import { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Add this helper function after your imports
function isLightColor(color) {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light (brightness > 128)
  return brightness > 128;
}

// Update the templates array
const templates = [
  {
    id: 1,
    name: "Light", // Make sure name is exactly "Light"
    bgClass: "bg-gray-100",
    layout: "simple",
    buttonClass: "bg-blue-500 text-white rounded",
    containerClass: "text-center p-6 bg-white rounded-lg shadow-lg",
    description: "Clean and minimalistic light design"
  },
  {
    id: 2,
    name: "Dark", // Make sure name is exactly "Dark"
    bgClass: "bg-gray-900",
    layout: "bold",
    buttonClass: "bg-yellow-400 text-black font-bold rounded-full",
    containerClass: "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl",
    description: "Sleek and modern dark theme"
  }
];

function App() {
  const [template, setTemplate] = useState(templates[0]);
  const [businessName, setBusinessName] = useState('');
  const [intro, setIntro] = useState('');
  const [links, setLinks] = useState([{ text: '', url: '' }]);
  const [color, setColor] = useState('#ffffff');
  const [ptColor, setPTColor] = useState('#000000');
  const [btColor, setBTColor] = useState('#ffffff');
  const [bColor, setBColor] = useState('#3b82f6'); // Default blue
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pageName, setPageName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Generate logo preview when logo is selected
  useEffect(() => {
    if (logo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(logo);
    }
  }, [logo]);

  const addLink = () => setLinks([...links, { text: '', url: '' }]);
  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = async () => {
    if (!pageName) return alert('Please enter a name for your landing page');
    const formData = new FormData();
    formData.append('name', pageName);
    formData.append('businessName', businessName);
    formData.append('intro', intro);
    formData.append('links', JSON.stringify(links));
    formData.append('color', color);
    formData.append('ptColor', ptColor);
    formData.append('btColor', btColor);
    formData.append('bColor', bColor);
    formData.append('template', template.name); // Make sure we're sending the template name, not the object
    if (logo) formData.append('logo', logo);

    try {
      const res = await axios.post('http://localhost:5000/api/save-landing', formData);
      alert(`Landing page saved! Visit: ${res.data.url}`);
      window.open(res.data.url, '_blank');
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
      console.error('Error details:', error);
    }
  };

  const generateHtmlContent = () => {
    // Set page background (outside container) based on template name
    let pageBackground = "";
    if (template.name === "Dark") {
      pageBackground = "background: linear-gradient(to right, #1a202c, #2d3748);";
    }
    
    // Always use the user's selected container background color
    const containerBackground = color;
    
    // Always use the user's selected text color
    // Don't override with automatic dark/light detection
    const containerTextColor = ptColor;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${businessName || "Landing Page"}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
          body {
            ${pageBackground}
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
          }
          #container {
            background: ${containerBackground};
            color: ${containerTextColor};
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
        <div id="container" style="background: ${containerBackground}; color: ${containerTextColor};" class="text-center p-6 rounded-lg shadow-lg">
          <div style="width: 100%;">
            ${logoPreview ? `<img src="${logoPreview}" alt="Logo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin: 0 auto 1rem auto; display: block;">` : ''}
            <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem; text-align: center; color: ${containerTextColor};">${businessName || "Your Business Name"}</h1>
            <p style="margin-bottom: 1.5rem; text-align: center; color: ${containerTextColor};">${intro || "Your introduction text goes here"}</p>
            <div style="width: 100%;">
              ${links.map(link => link.text ? 
                `<a href="${link.url || '#'}" target="_blank" id="link">${link.text}</a>` : 
                '').join('')}
              ${links.length === 0 || !links.some(link => link.text) ? 
                `<a href="#" id="link">Example Link</a>` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Handle full preview
  const openFullPreview = () => {
    setShowFullPreview(true);
  };

  // Close full preview
  const closeFullPreview = () => {
    setShowFullPreview(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-black'} bg-opacity-75 z-50 flex justify-center items-center p-4 modal-backdrop`}>
          <div className="relative w-full max-w-4xl h-[90vh] modal-content">
            <button 
              onClick={closeFullPreview} 
              className="absolute -top-12 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
            >
              <i className="fas fa-times"></i>
            </button>
            <iframe 
              srcDoc={generateHtmlContent()}
              className={`w-full h-full rounded-lg border-0 iframe-container ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
              title="Full Preview"
            ></iframe>
          </div>
        </div>
      )}

      {/* Main layout container - horizontal split */}
      <div className="flex flex-row h-screen overflow-hidden">
        {/* Left Side - Editor */}
        <div className="w-1/2 h-screen overflow-y-auto p-4 border-r">
          <h1 className="text-3xl font-bold mb-6 text-center">Landing Page Generator</h1>
          
          {/* Template Selection */}
          <div className="mb-6">
            <label className={`block mb-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Select Template:
            </label>
            <div className="flex flex-wrap gap-4 justify-center">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t)}
                  className={`py-3 px-6 rounded-lg shadow transition-all ${
                    template.id === t.id 
                      ? 'ring-4 ring-blue-500 font-bold scale-105' 
                      : 'hover:scale-105'
                  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                >
                  <div className="text-center">
                    <span className="block text-xl font-semibold mb-1">{t.name}</span>
                    <span className="block text-sm opacity-80">{t.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Business Name:</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Introduction:</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
              rows="3"
            />
          </div>

          {/* Logo Upload */}
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload Logo:</label>
            <input
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600 file:bg-gray-600 file:text-white file:border-gray-500' : 'bg-white text-gray-800'}`}
            />
          </div>

          {/* Dynamic Links */}
          <div className="mb-4">
            <label className={`block mb-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Links:</label>
            {links.map((link, i) => (
              <div key={i} className="flex space-x-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Text (e.g., Facebook)"
                  value={link.text}
                  onChange={(e) => updateLink(i, 'text', e.target.value)}
                  className={`p-2 border rounded flex-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
                  required
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  className={`p-2 border rounded flex-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
                  required
                />
                {links.length > 1 && (
                  <button
                    onClick={() => {
                      const newLinks = links.filter((_, index) => index !== i);
                      setLinks(newLinks);
                    }}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete Link"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addLink}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition-all duration-300 transform hover:-translate-y-1 shadow-md"
            >
              <i className="fas fa-plus mr-2"></i> Add Link
            </button>
          </div>

          {/* Color Picker */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="mb-2">
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Background Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="p-1 h-10 w-full border rounded"
              />
            </div>
            <div className="mb-2">
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Primary Text Color:</label>
              <input
                type="color"
                value={ptColor}
                onChange={(e) => setPTColor(e.target.value)}
                className="p-1 h-10 w-full border rounded"
              />
            </div>
            <div className="mb-2">
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Button Color:</label>
              <input
                type="color"
                value={bColor}
                onChange={(e) => setBColor(e.target.value)}
                className="p-1 h-10 w-full border rounded"
              />
            </div>
            <div className="mb-2">
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Button Text Color:</label>
              <input
                type="color"
                value={btColor}
                onChange={(e) => setBTColor(e.target.value)}
                className="p-1 h-10 w-full border rounded"
              />
            </div>
          </div>

          {/* Save Page */}
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Landing Page Name:</label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              className={`p-2 border rounded w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
              placeholder="e.g., mypage"
            />
          </div>
          <button 
            onClick={handleSave} 
            className="p-2 bg-green-500 text-white rounded w-full hover:bg-green-600 mb-8 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
          >
            Save Landing Page
          </button>
        </div>

        {/* Right Side - Preview */}
        <div className="w-1/2 h-screen flex flex-col">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 flex justify-between items-center">
            <h2 className="text-xl font-bold">Live Preview</h2>
            <div className="flex space-x-3">
              <button 
                onClick={toggleDarkMode} 
                className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} transition-all duration-300 hover:-translate-y-1 shadow-md`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <button 
                onClick={openFullPreview}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md flex items-center"
              >
                <i className="fas fa-expand-alt mr-2"></i> Full View
              </button>
            </div>
          </div>
          <div 
            className="flex-1 overflow-y-auto flex justify-center py-6" 
            style={template.name === "Dark" 
              ? {background: "linear-gradient(to right, #1a202c, #2d3748)"} 
              : darkMode 
                ? {background: "#111827"} // Just dark background, not the template gradient
                : {}}
          >
            <iframe 
              srcDoc={generateHtmlContent()}
              title="Landing Page Preview"
              className="w-full h-full border-0"
              style={{ maxWidth: '450px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

