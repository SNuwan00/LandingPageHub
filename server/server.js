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

  const { name, businessName, intro, links, color, template } = req.body;
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
      buttonClass = "bg-blue-500 text-white rounded";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>body { background-color: ${color}; }</style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-24 mb-4">` : ''}
            <h1 class="text-3xl font-bold mb-2">${businessName}</h1>
            <p class="mb-4">${intro}</p>
            <div class="space-y-2">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-4 py-2 ${buttonClass}">${link.text}</a>`).join('')}
            </div>
          </div>
        </body>
        </html>
      `;
      break;

    case "Bold":
      containerClass = "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl";
      buttonClass = "bg-yellow-400 text-black font-bold rounded-full";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>body { background: linear-gradient(to right, #8b5cf6, #ec4899); }</style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-32 mb-6 rounded-full border-4 border-yellow-400">` : ''}
            <h1 class="text-4xl font-extrabold mb-3 tracking-wide">${businessName}</h1>
            <p class="mb-6 text-lg">${intro}</p>
            <div class="space-y-3">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-6 py-3 ${buttonClass}">${link.text}</a>`).join('')}
            </div>
          </div>
        </body>
        </html>
      `;
      break;

    case "Modern":
      containerClass = "text-center p-6 bg-gray-800 text-white rounded-lg shadow-lg border border-green-500";
      buttonClass = "bg-green-500 text-white rounded-lg hover:bg-green-600 transition";
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${businessName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>body { background-color: #1f2937; }</style>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="${containerClass}">
            ${logoPath ? `<img src="${logoPath}" alt="Logo" class="mx-auto h-28 mb-5 rounded-lg shadow-md">` : ''}
            <h1 class="text-3xl font-semibold mb-3 text-green-400">${businessName}</h1>
            <p class="mb-5 text-gray-300">${intro}</p>
            <div class="space-y-3">
              ${parsedLinks.map(link => `<a href="${link.url}" target="_blank" class="block px-5 py-3 ${buttonClass}">${link.text}</a>`).join('')}
            </div>
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