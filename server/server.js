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
  let containerClass, buttonClass, htmlContent;
  switch (template) {
    case "Simple":
      containerClass = "text-center p-6 bg-white rounded-lg shadow-lg";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
			      #container{
			      	background:${color};
              color:${ptColor};
			      	height: 90vh;  
			      	width: 50vw; 
			      	display: flex;
			      	flex-direction: column;
			      	justify-content: center;
			      	align-items: center;
			      }
			      #link {
			      	background:${bColor};
              color:${btColor};
			      	width: 40vw; 
			      	transition: transform 0.3s ease;
			      }
			      #link:hover {
			      	transform: scale(1.05);
			      }
			    </style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}"   id="container">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-24 mb-4 w-32 h-32 rounded-full object-cover">` : ''}
            <h1 class="text-3xl font-bold mb-2">${businessName}</h1>
            <p class="mb-4">${intro}</p>
            <div class="space-y-5">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-4 py-2 rounded-lg shadow-lg" id="link">${link.text}</a>`).join('')}
            </div>
            <footer class="py-6 text-${ptColor}">
              <div class="container mx-auto text-center mt-6">
                <!-- Navigation Links -->
                <nav class="flex justify-center space-x-6 mb-4">
                  <h2>Contact Us</h2>
                </nav>
            
                <!-- Social Media Icons -->
                <div class="flex justify-center space-x-4 mb-4">
                  <a href="https://www.facebook.com/sanju.srinuwan?mibextid=wwXIfr" target="_blank">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="http://wa.me//+94704874781" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                  <a href="https://linkedin.com/in/sanjuka-sri-nuwan-7031a229a" target="_blank">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://github.com/SNuwan00" target="_blank">
                    <i class="fab fa-github"></i>
                  </a>
                </a>
                <a href="mailto:sanjukasrinuwan@gmail.com" target="_blank">
                  <i class="fas fa-envelope email-icon"></i>
                </a>
                  <a href="https://csbodima.lk/nuwan" target="_blank">
                    <i class="fas fa-globe"></i>
                  </a>
                  <!-- Other social media links -->
                </div>
            
                <!-- Copyright Notice -->
                <p class="text-sm">© 2024 CSB Development, Inc. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
        </html>
      `;
      break;

    case "Bold":
      containerClass = "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
			      #container{
			      	background:${color};
              color:${ptColor};
			      	height: 90vh;  
			      	width: 50vw; 
			      	display: flex;
			      	flex-direction: column;
			      	justify-content: center;
			      	align-items: center;
			      }
			      #link {
			      	background:${bColor};
              color:${btColor};
			      	width: 40vw; 
			      	transition: transform 0.3s ease;
			      }
			      #link:hover {
			      	transform: scale(1.05);
			      }
			    </style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}"   id="container">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-24 mb-4 w-32 h-32 rounded-full object-cover">` : ''}
            <h1 class="text-3xl font-bold mb-2">${businessName}</h1>
            <p class="mb-4">${intro}</p>
            <div class="space-y-5">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-4 py-2 rounded-lg shadow-lg" id="link">${link.text}</a>`).join('')}
            </div>
            <footer class="py-6 text-${ptColor}">
              <div class="container mx-auto text-center mt-6">
                <!-- Navigation Links -->
                <nav class="flex justify-center space-x-6 mb-4">
                  <h2>Contact Us</h2>
                </nav>
            
                <!-- Social Media Icons -->
                <div class="flex justify-center space-x-4 mb-4">
                  <a href="https://www.facebook.com/sanju.srinuwan?mibextid=wwXIfr" target="_blank">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="http://wa.me//+94704874781" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                  <a href="https://linkedin.com/in/sanjuka-sri-nuwan-7031a229a" target="_blank">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://github.com/SNuwan00" target="_blank">
                    <i class="fab fa-github"></i>
                  </a>
                </a>
                <a href="mailto:sanjukasrinuwan@gmail.com" target="_blank">
                  <i class="fas fa-envelope email-icon"></i>
                </a>
                  <a href="https://csbodima.lk/nuwan" target="_blank">
                    <i class="fas fa-globe"></i>
                  </a>
                  <!-- Other social media links -->
                </div>
            
                <!-- Copyright Notice -->
                <p class="text-sm">© 2024 CSB Development, Inc. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
        </html>
      `;
      break;

    case "Modern":
      containerClass = "text-center p-6 rounded-lg shadow-lg border border-green-500";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
			      body {
			      	background: linear-gradient(to right, #FF4066, #FFF16A);
			      }
			      #container{
			      	background:${color};
              color:${ptColor};
			      	height: 90vh;  
			      	width: 50vw; 
			      	display: flex;
			      	flex-direction: column;
			      	justify-content: center;
			      	align-items: center;
			      }
			      #link {
			      	background:${bColor};
              color:${btColor};
			      	width: 40vw; 
			      	transition: transform 0.3s ease;
			      }
			      #link:hover {
			      	transform: scale(1.05);
			      }
			    </style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}"   id="container">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-24 mb-4 w-32 h-32 rounded-full object-cover">` : ''}
            <h1 class="text-3xl font-bold mb-2">${businessName}</h1>
            <p class="mb-4">${intro}</p>
            <div class="space-y-5">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-4 py-2 rounded-lg shadow-lg" id="link">${link.text}</a>`).join('')}
            </div>
            <footer class="py-6 text-${ptColor}">
              <div class="container mx-auto text-center mt-6">
                <!-- Navigation Links -->
                <nav class="flex justify-center space-x-6 mb-4">
                  <h2>Contact Us</h2>
                </nav>
            
                <!-- Social Media Icons -->
                <div class="flex justify-center space-x-4 mb-4">
                  <a href="https://www.facebook.com/sanju.srinuwan?mibextid=wwXIfr" target="_blank">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="http://wa.me//+94704874781" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                  <a href="https://linkedin.com/in/sanjuka-sri-nuwan-7031a229a" target="_blank">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://github.com/SNuwan00" target="_blank">
                    <i class="fab fa-github"></i>
                  </a>
                </a>
                <a href="mailto:sanjukasrinuwan@gmail.com" target="_blank">
                  <i class="fas fa-envelope email-icon"></i>
                </a>
                  <a href="https://csbodima.lk/nuwan" target="_blank">
                    <i class="fas fa-globe"></i>
                  </a>
                  <!-- Other social media links -->
                </div>
            
                <!-- Copyright Notice -->
                <p class="text-sm">© 2024 CSB Development, Inc. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
        </html>
      `;
      break;
    default:
      return res.status(400).json({ error: "Invalid template" });
  }

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