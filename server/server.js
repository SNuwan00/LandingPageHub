const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');
const validator = require('validator');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Tailwind CSS
  crossOriginEmbedderPolicy: false, // Allow cross-origin requests
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resources
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// CORS configuration - must come before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://qrhub.csbodima.lk',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} from ${req.get('origin') || 'unknown'}`);
  next();
});

// Additional middleware for handling API requests
app.use((req, res, next) => {
  // Set additional headers for API responses
  if (req.path.startsWith('/api/')) {
    res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
  }
  next();
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use('/logoImage', express.static('logoImage'));
app.use('/landings', express.static('landings'));

// MySQL Connection with environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    throw err;
  }
  console.log('MySQL Connected successfully');
});

// Handle MySQL connection errors
db.on('error', (err) => {
  console.error('MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to MySQL...');
    // Implement reconnection logic if needed
  }
});

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'logoImage/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create folders if they don’t exist
['logoImage', 'landings'].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

// Input sanitization helper function
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove XSS threats and validate
  let sanitized = xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
  
  // Additional validation and trimming
  sanitized = validator.escape(sanitized.trim());
  
  return sanitized;
}

// Validate color format (hex colors only)
function isValidColor(color) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

// Validate URL format
function isValidUrl(url) {
  try {
    // First try basic URL constructor validation
    new URL(url);
    
    // Then use validator for additional checks
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      validate_length: true,
      require_host: true,
      require_valid_protocol: true,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    });
  } catch (error) {
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API to check if page name already exists
app.get('/api/check-page-name/:name', (req, res) => {
  try {
    const { name } = req.params;
    console.log(`Received request to check page name: ${name}`);
    
    // Add CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Page name is required' });
    }

    const sanitizedName = sanitizeInput(name);
    const landingName = sanitizedName.toLowerCase().replace(/\s+/g, '');

    // Check if file exists
    const filePath = path.join(__dirname, 'landings', `${landingName}.html`);
    const fileExists = fs.existsSync(filePath);

    // Also check database
    const query = 'SELECT COUNT(*) as count FROM landings WHERE name = ?';
    db.query(query, [landingName], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const dbExists = results[0].count > 0;
      const exists = fileExists || dbExists;

      console.log(`Page name "${landingName}" exists: ${exists}`);
      res.json({ exists });
    });
  } catch (error) {
    console.error('Error checking page name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to save landing page
app.post('/api/save-landing', upload.single('logo'), (req, res) => {
  // Log the incoming request body for debugging
  console.log('Request body:', req.body);
  console.log('Template received:', req.body.template);

  let { name, businessName, intro, links, color, ptColor, btColor, bColor, template } = req.body;

  // Comprehensive input sanitization
  try {
    name = sanitizeInput(name);
    businessName = sanitizeInput(businessName);
    intro = sanitizeInput(intro);
    template = sanitizeInput(template);
    
    // Validate and sanitize colors
    color = sanitizeInput(color);
    ptColor = sanitizeInput(ptColor);
    btColor = sanitizeInput(btColor);
    bColor = sanitizeInput(bColor);
    
    // Validate color formats
    const colors = { color, ptColor, btColor, bColor };
    for (const [colorName, colorValue] of Object.entries(colors)) {
      if (colorValue && !isValidColor(colorValue)) {
        return res.status(400).json({ 
          error: `Invalid ${colorName} format. Please use valid hex color codes (e.g., #FF0000)` 
        });
      }
    }
  } catch (error) {
    console.error('Input sanitization error:', error);
    return res.status(400).json({ error: 'Invalid input data provided' });
  }

  const logoPath = req.file ? `/logoImage/${req.file.filename}` : '';
  const landingName = name.toLowerCase().replace(/\s+/g, '');

  // Parse and validate links with enhanced error handling
  let parsedLinks = [];
  try {
    if (links && typeof links === 'string') {
      parsedLinks = JSON.parse(links);
      if (!Array.isArray(parsedLinks)) {
        parsedLinks = [];
      }
      
      // Validate each link
      for (let i = 0; i < parsedLinks.length; i++) {
        const link = parsedLinks[i];
        
        if (!link.text || !link.url) {
          return res.status(400).json({ 
            error: `Link ${i + 1} is missing required text or URL` 
          });
        }
        
        // Sanitize link data (don't escape URLs)
        link.text = sanitizeInput(link.text);
        // Only remove XSS from URL, don't HTML escape it
        link.url = xss(link.url.trim(), {
          whiteList: {}, // No HTML tags allowed
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script']
        });
        
        // Validate URL format
        if (!isValidUrl(link.url)) {
          return res.status(400).json({ 
            error: `Link ${i + 1} has an invalid URL format. Please use http:// or https://` 
          });
        }
        
        // Validate text length
        if (link.text.length > 50) {
          return res.status(400).json({ 
            error: `Link ${i + 1} text is too long. Maximum 50 characters allowed.` 
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing links:', error.message);
    return res.status(400).json({ error: 'Invalid links format provided' });
  }

  // Validate required fields
  if (!name || !businessName || !intro) {
    return res.status(400).json({ error: 'Missing required fields: name, businessName, and intro are required' });
  }

  // Validate field lengths
  if (name.length > 50) {
    return res.status(400).json({ error: 'Page name must be 50 characters or less' });
  }
  if (businessName.length > 100) {
    return res.status(400).json({ error: 'Business name must be 100 characters or less' });
  }
  if (intro.length > 500) {
    return res.status(400).json({ error: 'Introduction must be 500 characters or less' });
  }

  // Validate page name format (alphanumeric and hyphens only)
  const pageNameRegex = /^[a-zA-Z0-9-]+$/;
  if (!pageNameRegex.test(landingName)) {
    return res.status(400).json({ 
      error: 'Page name can only contain letters, numbers, and hyphens. Special characters and spaces are not allowed.' 
    });
  }

  // Limit links to maximum 6
  if (parsedLinks.length > 6) {
    return res.status(400).json({ 
      error: 'Maximum 6 links allowed to maintain page performance and design quality.' 
    });
  }

  // Check if landing page name already exists
  const checkQuery = 'SELECT id FROM landings WHERE name = ?';
  db.query(checkQuery, [landingName], (err, existingResults) => {
    if (err) {
      console.error('Database error during name check:', err);
      return res.status(500).json({ error: 'Database error during validation' });
    }

    if (existingResults.length > 0) {
      return res.status(409).json({ 
        error: 'This page name is already taken. Please choose a different name.',
        suggestion: `Try: ${landingName}-${Date.now().toString().slice(-4)}`
      });
    }

    // Proceed with creating the landing page if name is unique
    createLandingPage();
  });

  function createLandingPage() {

  // Define template-specific styles with enhanced support
  let containerClass, htmlContent;
  switch (template) {
    case "Minimal":
      containerClass = "text-center p-6 bg-white rounded-lg shadow-lg";
      break;

    case "Dark Pro":
      containerClass = "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl";
      break;

    case "Cyberpunk":
      containerClass = "text-center p-8 bg-black text-cyan-400 rounded-xl shadow-2xl border-2 border-cyan-400";
      break;

    case "Nature Zen":
      containerClass = "text-center p-8 bg-green-50 text-green-900 rounded-xl shadow-xl";
      break;

    case "Golden Hour":
      containerClass = "text-center p-8 bg-orange-50 text-orange-900 rounded-xl shadow-xl";
      break;

    case "Deep Ocean":
      containerClass = "text-center p-8 bg-blue-50 text-blue-900 rounded-xl shadow-xl";
      break;

    case "Aurora":
      containerClass = "text-center p-8 bg-purple-50 text-purple-900 rounded-xl shadow-xl";
      break;

    case "Mint Fresh":
      containerClass = "text-center p-8 bg-teal-50 text-teal-900 rounded-xl shadow-xl";
      break;

    case "Glassmorphism":
      containerClass = "text-center p-8 bg-white/20 backdrop-blur-xl text-gray-800 rounded-xl shadow-2xl border border-white/30";
      break;

    default:
      console.error(`Invalid template: "${template}" (type: ${typeof template})`);
      return res.status(400).json({ 
        error: `Invalid template: "${template}"`, 
        availableTemplates: ["Minimal", "Dark Pro", "Cyberpunk", "Nature Zen", "Golden Hour", "Deep Ocean", "Aurora", "Mint Fresh", "Glassmorphism"],
        receivedType: typeof template
      });
  }

  // Update the button styles in the HTML template with CSB branding
  htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - Powered by CSB Landing Page Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
      body {
        ${template === "Dark Pro" ? 'background: linear-gradient(to right, #1a202c, #2d3748);' : 
          template === "Cyberpunk" ? 'background: #000000; background-image: radial-gradient(circle at 25% 25%, #00ffff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ff00ff 0%, transparent 50%);' :
          template === "Nature Zen" ? 'background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);' :
          template === "Golden Hour" ? 'background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fed7aa 100%);' :
          template === "Deep Ocean" ? 'background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);' :
          template === "Aurora" ? 'background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%);' :
          template === "Mint Fresh" ? 'background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #a7f3d0 100%);' :
          template === "Glassmorphism" ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' :
          'background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);'}
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      #container {
        background: ${color};
        color: ${ptColor};
        width: 100%;
        max-width: 400px;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: ${template === "Cyberpunk" ? '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)' : 
                     template === "Glassmorphism" ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' :
                     '0 25px 50px -12px rgba(0, 0, 0, 0.25)'};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        animation: fadeInUp 0.8s ease-out;
      }
      #link {
        background: ${bColor};
        color: ${btColor};
        width: 100%;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 0.875rem 1.25rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        display: block;
        text-align: center;
        text-decoration: none;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15), 
                    0 4px 10px rgba(0,0,0,0.1);
        transform: translateY(0);
        font-weight: 600;
        font-size: 1rem;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.2);
      }
      #link:before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.6s;
      }
      #link:hover:before {
        left: 100%;
      }
      #link:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        filter: brightness(1.1);
      }
      #link:active {
        transform: translateY(-1px) scale(0.98);
      }
      .logo-container {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 1.5rem auto;
        position: relative;
        background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
        padding: 4px;
        animation: logoFloat 3s ease-in-out infinite;
      }
      .logo-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
        line-height: 1.2;
        animation: titleGlow 2s ease-in-out infinite alternate;
      }
      .intro-text {
        margin-bottom: 2rem;
        text-align: center;
        font-size: 1.1rem;
        line-height: 1.6;
        opacity: 0.9;
        max-width: 300px;
      }
      .footer {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        opacity: 0.6;
        text-align: center;
        white-space: nowrap;
        z-index: 1000;
      }
      .footer a {
        color: inherit;
        text-decoration: none;
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }
      .footer a:hover {
        opacity: 1;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes logoFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      @keyframes titleGlow {
        0% { text-shadow: 0 0 5px rgba(0,0,0,0.1); }
        100% { text-shadow: 0 0 20px rgba(0,0,0,0.2); }
      }
      @media (max-width: 480px) {
        #container {
          max-width: 350px;
          padding: 1.5rem;
        }
        h1 { font-size: 1.75rem; }
        #link { padding: 0.75rem 1rem; font-size: 0.9rem; }
      }
    </style>
  </head>
  <body>
    <div class="${containerClass}" id="container">
      <div style="width: 100%;">
        ${logoPath ? `
          <div class="logo-container">
            <img src="${logoPath}" alt="${businessName} Logo">
          </div>
        ` : ''}
        <h1>${businessName}</h1>
        <p class="intro-text">${intro}</p>
        <div style="width: 100%;">
          ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" id="link" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt" style="margin-right: 8px; opacity: 0.8;"></i>
            ${link.text}
          </a>`).join('\n          ')}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>© 2024 All Rights Reserved - CSB Developments</div>
      <div style="margin-top: 2px;">
        <a href="https://www.csbodima.lk" target="_blank" rel="noopener noreferrer">
          www.csbodima.lk
        </a>
      </div>
    </div>
  </body>
  </html>
  `;

  // Save to file
  fs.writeFileSync(`landings/${landingName}.html`, htmlContent);

  // Save to MySQL (optional metadata storage)
  const query = 'INSERT INTO landings (name, business_name, logo_path) VALUES (?, ?, ?)';
  db.query(query, [landingName, businessName, logoPath], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ url: `${process.env.BASE_URL}/landings/${landingName}.html` });
  });
  } // Close createLandingPage function
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`404 - API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Server listening on all interfaces (0.0.0.0:${PORT})`);
  console.log(`CORS enabled for origins: https://qrhub.csbodima.lk, http://localhost:5173`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

//create db with table

/* CREATE DATABASE landing_pages_db;
USE landing_pages_db;
CREATE TABLE landings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  logo_path VARCHAR(255)
); */