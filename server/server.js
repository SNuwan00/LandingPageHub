const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/logoImage', express.static('logoImage'));
app.use('/landings', express.static('landings'));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sc12422',
  database: 'landing_pages_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
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

// API to save landing page
app.post('/api/save-landing', upload.single('logo'), (req, res) => {
  // Log the incoming request body for debugging
  console.log('Request body:', req.body);
  console.log('Template received:', req.body.template); // Add this line to specifically log the template

  const { name, businessName, intro, links, color, ptColor, btColor, bColor, template } = req.body;
  const logoPath = req.file ? `/logoImage/${req.file.filename}` : '';
  const landingName = name.toLowerCase().replace(/\s+/g, '');

  // Parse links with error handling
  let parsedLinks = [];
  try {
    if (links && typeof links === 'string') {
      parsedLinks = JSON.parse(links);
      if (!Array.isArray(parsedLinks)) {
        parsedLinks = [];
      }
    }
  } catch (error) {
    console.error('Error parsing links:', error.message);
    parsedLinks = []; // Default to empty array if parsing fails
  }

  // Validate required fields
  if (!name || !businessName || !intro) {
    return res.status(400).json({ error: 'Missing required fields: name, businessName, and intro are required' });
  }

  // Define template-specific styles
  let containerClass, htmlContent;
  switch (template) {
    case "Light": // Must match exactly what's sent from client
      containerClass = "text-center p-6 bg-white rounded-lg shadow-lg";
      break;

    case "Dark": // Must match exactly what's sent from client
      containerClass = "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl";
      break;

    default:
      console.error(`Invalid template: "${template}" (type: ${typeof template})`);
      return res.status(400).json({ 
        error: `Invalid template: "${template}"`, 
        availableTemplates: ["Light", "Dark"],
        receivedType: typeof template
      });
  }

  // Update the button styles in the HTML template
  htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${businessName}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
      body {
        ${template === "Dark" ? 'background: linear-gradient(to right, #1a202c, #2d3748);' : ''}
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Arial', sans-serif;
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
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
      #link {
        background: ${bColor};
        color: ${btColor};
        width: 100%;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        display: block;
        text-align: center;
        text-decoration: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.12), 
                    0 2px 4px rgba(0,0,0,0.08), 
                    inset 0 -2px 0 rgba(0,0,0,0.2);
        transform: translateY(0);
        font-weight: 500;
        position: relative;
        overflow: hidden;
      }
      #link:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, 
                  rgba(255,255,255,0.1) 0%, 
                  rgba(255,255,255,0.05) 40%, 
                  rgba(0,0,0,0) 100%);
      }
      #link:hover {
        transform: translateY(-3px) scale(1.01);
        box-shadow: 0 7px 14px rgba(0,0,0,0.15), 
                    0 5px 5px rgba(0,0,0,0.1), 
                    inset 0 -2px 0 rgba(0,0,0,0.2);
      }
      #link:active {
        transform: translateY(1px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.12), 
                    0 1px 3px rgba(0,0,0,0.08),
                    inset 0 1px 1px rgba(0,0,0,0.2);
      }
    </style>
  </head>
  <body>
    <div class="${containerClass}" id="container">
      <div style="width: 100%;">
        ${logoPath ? `<img src="${logoPath}" alt="Logo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin: 0 auto 1rem auto; display: block;">` : ''}
        <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem; text-align: center;">${businessName}</h1>
        <p style="margin-bottom: 1.5rem; text-align: center;">${intro}</p>
        <div style="width: 100%;">
          ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" id="link">${link.text}</a>`).join('\n          ')}
        </div>
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
    res.json({ url: `http://localhost:5000/landings/${landingName}.html` });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//create db with table

/* CREATE DATABASE landing_pages_db;
USE landing_pages_db;
CREATE TABLE landings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  logo_path VARCHAR(255)
); */