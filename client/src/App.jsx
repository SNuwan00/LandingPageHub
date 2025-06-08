import { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SuccessPage from './QRGenerator.jsx'; // Import the SuccessPage component
import QRTypeSelector from './QRTypeSelector';
import QRGenerator from './QRGenerator';

// Modern template collection with advanced styling and new premium templates
const templates = [
  {
    id: 1,
    name: "Minimal",
    bgClass: "bg-gradient-to-br from-slate-50 to-gray-100",
    layout: "minimal",
    buttonClass: "bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    containerClass: "text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20",
    description: "Clean, minimal design with subtle gradients",
    icon: "✨",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Classic"
  },
  {
    id: 2,
    name: "Dark Pro",
    bgClass: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
    layout: "professional",
    buttonClass: "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25",
    containerClass: "text-center p-10 bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-500/20",
    description: "Professional dark theme with purple accents",
    icon: "🌙",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Professional"
  },
  {
    id: 3,
    name: "Cyberpunk",
    bgClass: "bg-black",
    layout: "futuristic",
    buttonClass: "bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-2xl shadow-lg hover:shadow-cyan-400/50",
    containerClass: "text-center p-8 bg-black border-2 border-cyan-400 rounded-3xl shadow-2xl shadow-cyan-400/20",
    description: "Futuristic cyberpunk neon design",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",
    category: "Modern"
  },
  {
    id: 4,
    name: "Nature Zen",
    bgClass: "bg-gradient-to-br from-green-100 to-emerald-200",
    layout: "organic",
    buttonClass: "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-200",
    description: "Peaceful nature-inspired zen theme",
    icon: "🌿",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    category: "Nature"
  },
  {
    id: 5,
    name: "Golden Hour",
    bgClass: "bg-gradient-to-br from-orange-200 via-red-200 to-yellow-100",
    layout: "warm",
    buttonClass: "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-200",
    description: "Warm golden hour sunset vibes",
    icon: "🌅",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Warm"
  },
  {
    id: 6,
    name: "Deep Ocean",
    bgClass: "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100",
    layout: "fluid",
    buttonClass: "bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-200",
    description: "Serene deep ocean blue tones",
    icon: "🌊",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Cool"
  },
  {
    id: 7,
    name: "Aurora",
    bgClass: "bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200",
    layout: "mystical",
    buttonClass: "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200",
    description: "Mystical aurora borealis colors",
    icon: "🌌",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    category: "Premium"
  },
  {
    id: 8,
    name: "Mint Fresh",
    bgClass: "bg-gradient-to-br from-mint-100 via-teal-100 to-cyan-100",
    layout: "fresh",
    buttonClass: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-200",
    description: "Fresh mint and teal combination",
    icon: "🍃",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    category: "Fresh"
  },
  {
    id: 9,
    name: "Glassmorphism",
    bgClass: "bg-gradient-to-br from-white/20 via-white/10 to-transparent",
    layout: "glass",
    buttonClass: "bg-white/20 backdrop-blur-md text-gray-800 rounded-2xl shadow-lg border border-white/30",
    containerClass: "text-center p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30",
    description: "Modern glassmorphism effect",
    icon: "💎",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    category: "Premium"
  }
];

// Advanced Font Collection with multiple languages
const fontOptions = {
  english: [
    { name: 'Inter', family: 'Inter', category: 'Sans-serif' },
    { name: 'Poppins', family: 'Poppins', category: 'Sans-serif' },
    { name: 'Birthstone', family: 'Birthstone', category: 'Handwriting' },
    { name: 'Alegreya', family: 'Alegreya', category: 'Serif' },
    { name: 'Special Elite', family: 'Special Elite', category: 'Monospace' },
    { name: 'Delius', family: 'Delius', category: 'Handwriting' }
  ],
  sinhala: [
    { name: 'Noto Sans Sinhala', family: 'Noto Sans Sinhala', category: 'Sans-serif' },
    { name: 'Maname', family: 'Maname', category: 'Handwriting' }
  ],
  tamil: [
    { name: 'Katamaran', family: 'Katamaran', category: 'Sans-serif' }
  ],
  hindi: [
    { name: 'Mukta', family: 'Mukta', category: 'Sans-serif' }
  ]
};

// Gradient presets for easy selection
const gradientPresets = [
  { name: 'Ocean Blue', colors: ['#667eea', '#764ba2'], direction: 'to-br' },
  { name: 'Sunset', colors: ['#f093fb', '#f5576c'], direction: 'to-r' },
  { name: 'Purple Rain', colors: ['#a855f7', '#ec4899'], direction: 'to-br' },
  { name: 'Green Nature', colors: ['#22c55e', '#16a34a'], direction: 'to-r' },
  { name: 'Fire', colors: ['#f97316', '#ea580c'], direction: 'to-br' },
  { name: 'Teal Fresh', colors: ['#14b8a6', '#06b6d4'], direction: 'to-r' },
  { name: 'Royal', colors: ['#3b82f6', '#1d4ed8'], direction: 'to-br' },
  { name: 'Rose Gold', colors: ['#f43f5e', '#be185d'], direction: 'to-r' }
];

const socialIconOptions = [
  { value: 'fas fa-external-link-alt', label: 'Link' },
  { value: 'fab fa-facebook-f',         label: 'Facebook' },
  { value: 'fab fa-youtube',            label: 'YouTube' },
  { value: 'fas fa-globe',              label: 'Website' },
  { value: 'fab fa-instagram',         label: 'Instagram' },
  { value: 'fab fa-twitter',           label: 'Twitter' }
];

function App() {
  const [template, setTemplate] = useState(templates[0]);
  const [businessName, setBusinessName] = useState('');
  const [intro, setIntro] = useState('');
  const [links, setLinks] = useState([{ text: '', url: '', icon: 'fas fa-external-link-alt' }]);
  const [color, setColor] = useState('#ffffff');
  const [ptColor, setPTColor] = useState('#1f2937');
  const [btColor, setBTColor] = useState('#ffffff');
  const [bColor, setBColor] = useState('#6366f1');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pageName, setPageName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [successUrl, setSuccessUrl] = useState(null);
  // Pro modal state
  const [showProModal, setShowProModal] = useState(false);
  const [showQRSelector, setShowQRSelector] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [qrOptions, setQrOptions] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [animationStyle, setAnimationStyle] = useState('fade');
  const [fontStyle, setFontStyle] = useState('Inter');
  const [buttonStyle, setButtonStyle] = useState('rounded-xl');
  const [shadowIntensity, setShadowIntensity] = useState('medium');
  
  // Advanced customization states - Enhanced with gradient support
  const [useGradientBackground, setUseGradientBackground] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#667eea');
  const [gradientColor2, setGradientColor2] = useState('#764ba2');
  const [gradientDirection, setGradientDirection] = useState('to-br');
  const [useGradientButton, setUseGradientButton] = useState(false);
  const [buttonGradientColor1, setButtonGradientColor1] = useState('#6366f1');
  const [buttonGradientColor2, setButtonGradientColor2] = useState('#8b5cf6');
  
  const borderRadius = 12;
  const containerPadding = 32;
  const fontFamily = fontStyle;
  
  // Template categories for filtering
  const categories = ['All', 'Classic', 'Professional', 'Modern', 'Nature', 'Warm', 'Cool', 'Fresh', 'Premium'];
  
  // Filter templates by category
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

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
  // Open and close Pro modal handlers
  const handleProOpen = () => setShowProModal(true);
  const handleProClose = () => setShowProModal(false);

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

  const addLink = () => {
    if (links.length < 6) {
      setLinks([...links, { text: '', url: '', icon: 'fas fa-external-link-alt' }]);
    }
  };
  
  const removeLink = (index) => {
    if (links.length > 1) {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
    }
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const validateForm = () => {
    // Check page name
    if (!pageName || pageName.trim().length < 3) {
      alert('Please enter a page name with at least 3 characters');
      return false;
    }
    
    // Check for valid page name format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(pageName.trim())) {
      alert('Page name can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    
    // Check business name
    if (!businessName || businessName.trim().length < 2) {
      alert('Please enter a business name with at least 2 characters');
      return false;
    }
    
    // Check intro
    if (!intro || intro.trim().length < 10) {
      alert('Please enter an introduction with at least 10 characters');
      return false;
    }
    
    // Validate links
    const validLinks = links.filter(link => link.text.trim() && link.url.trim());
    if (validLinks.length === 0) {
      alert('Please add at least one valid link');
      return false;
    }
    
    // Validate URL format
    for (let link of validLinks) {
      const url = link.url.trim();
      
      // Check if URL starts with http:// or https://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert(`Please enter a complete URL for "${link.text}" (must start with http:// or https://)`);
        return false;
      }
      
      try {
        new URL(url);
      } catch {
        alert(`Please enter a valid URL for "${link.text}"`);
        return false;
      }
    }
    
    return true;
  };

  const checkPageNameExists = async (name) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      console.log('Checking page name:', name, 'at:', `${apiUrl}/check-page-name/${encodeURIComponent(name)}`);
      
      const response = await fetch(`${apiUrl}/check-page-name/${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Page name check response:', data);
      return data.exists;
    } catch (error) {
      console.error('Error checking page name:', error);
      console.error('Error details:', error.message);
      // Return false to allow proceeding if check fails
      return false;
    }
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) return;
    
    // Check if page name already exists
    const pageExists = await checkPageNameExists(pageName.trim());
    if (pageExists) {
      alert('A page with this name already exists. Please choose a different name.');
      return;
    }
    
    // Filter out empty links
    const validLinks = links.filter(link => link.text.trim() && link.url.trim());
    
    const formData = new FormData();
    formData.append('name', pageName.trim());
    formData.append('businessName', businessName.trim());
    formData.append('intro', intro.trim());
    formData.append('links', JSON.stringify(validLinks));
    formData.append('color', color);
    formData.append('ptColor', ptColor);
    formData.append('btColor', btColor);
    formData.append('bColor', bColor);
    formData.append('template', template.name);
    if (logo) formData.append('logo', logo);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      console.log('Submitting to:', `${apiUrl}/save-landing`);
      
      const res = await axios.post(`${apiUrl}/save-landing`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
        withCredentials: true,
      });
      
      console.log('Response:', res.data);
      setSuccessUrl(res.data.url);
      setShowQRSelector(true); // Go to QR selector first
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        // Server responded with error status
        alert(`Error: ${error.response.data?.error || 'Server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        alert('Network error: Unable to connect to server. Please check your connection and try again.');
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
    }
  };

  const generateHtmlContent = () => {
    // Advanced template-specific styling with new templates
    let pageBackground = "";
    
    switch (template.name) {
      case "Minimal":
        pageBackground = "background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);";
        break;
      case "Dark Pro":
        pageBackground = "background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%);";
        break;
      case "Cyberpunk":
        pageBackground = "background: #000000; background-image: radial-gradient(circle at 25% 25%, #00ffff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ff00ff 0%, transparent 50%);";
        break;
      case "Nature Zen":
        pageBackground = "background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);";
        break;
      case "Golden Hour":
        pageBackground = "background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fed7aa 100%);";
        break;
      case "Deep Ocean":
        pageBackground = "background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);";
        break;
      case "Aurora":
        pageBackground = "background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%);";
        break;
      case "Mint Fresh":
        pageBackground = "background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #a7f3d0 100%)";
        break;
      case "Glassmorphism":
        pageBackground = "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        break;
      default:
        pageBackground = "background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);";
    }
    
    // Dynamic shadow based on template and intensity
    const getShadowStyle = () => {
      const intensityMap = {
        'light': '0 10px 25px -12px rgba(0, 0, 0, 0.15)',
        'medium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'heavy': '0 35px 60px -12px rgba(0, 0, 0, 0.35)'
      };
      
      if (template.name === "Cyberpunk") {
        return `box-shadow: 0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2);`;
      } else if (template.name === "Glassmorphism") {
        return `box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`;
      }
      
      return `box-shadow: ${intensityMap[shadowIntensity] || intensityMap.medium}, 0 0 0 1px rgba(255, 255, 255, 0.1);`;
    };
    
    // Animation styles based on selection
    const getAnimationKeyframes = () => {
      switch (animationStyle) {
        case 'slide':
          return `
            @keyframes slideInUp {
              from { opacity: 0; transform: translateY(50px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideInLeft {
              from { opacity: 0; transform: translateX(-50px); }
              to { opacity: 1; transform: translateX(0); }
            }`;
        case 'bounce':
          return `
            @keyframes bounceIn {
              0% { opacity: 0; transform: scale(0.3); }
              50% { opacity: 1; transform: scale(1.05); }
              70% { transform: scale(0.9); }
              100% { opacity: 1; transform: scale(1); }
            }`;
        case 'fade':
        default:
          return `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }`;
      }
    };
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${businessName || "Landing Page"}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Birthstone:wght@400;700&family=Alegreya:wght@400;500;700&family=Special+Elite:wght@400&family=Delius:wght@400&family=Noto+Sans+Sinhala:wght@300;400;500;600;700&family=Maname:wght@400&family=Katamaran:wght@300;400;500;600;700&family=Mukta:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
          ${getAnimationKeyframes()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            ${pageBackground}
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Change from center to flex-start for better scrolling */
            font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
            overflow-y: auto; /* Allow vertical scrolling */
          }
          
          body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            pointer-events: none;
          }
          
          #container {
            background: ${useGradientBackground 
              ? `linear-gradient(${gradientDirection.includes('to-r') ? 'to right' : gradientDirection.includes('to-br') ? 'to bottom right' : 'to bottom'}, ${gradientColor1}, ${gradientColor2})`
              : color};
            color: ${ptColor};
            width: 100%;
            max-width: 420px;
            min-height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: ${containerPadding}px;
            border-radius: ${borderRadius}px;
            ${getShadowStyle()}
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            animation: ${animationStyle === 'slide' ? 'slideInUp' : animationStyle === 'bounce' ? 'bounceIn' : 'fadeInUp'} 0.8s ease-out;
            margin: 20px auto; /* Add margin for better spacing when scrolling */
          }
          
          #container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            pointer-events: none;
          }
          
          .logo-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto 24px auto;
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
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
            background: linear-gradient(135deg, ${ptColor}, ${ptColor}99);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
            animation: titleGlow 2s ease-in-out infinite alternate;
          }
          
          .intro-text {
            margin-bottom: 32px;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.9;
            max-width: 300px;
            animation: ${animationStyle === 'slide' ? 'slideInLeft' : animationStyle === 'bounce' ? 'bounceIn' : 'fadeInUp'} 0.6s ease-out 0.2s both;
          }
          
          .links-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .link-item {
            background: ${useGradientButton 
              ? `linear-gradient(to right, ${buttonGradientColor1}, ${buttonGradientColor2})`
              : bColor};
            color: ${btColor};
            width: 100%;
            padding: 16px 20px;
            border-radius: ${buttonStyle === 'rounded-full' ? '50px' : buttonStyle === 'rounded-xl' ? '12px' : '6px'};
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.2);
            animation: ${animationStyle === 'slide' ? 'slideInUp' : animationStyle === 'bounce' ? 'bounceIn' : 'fadeInUp'} 0.6s ease-out forwards;
            animation-delay: calc(var(--delay) * 0.1s + 0.4s);
            opacity: 0;
            transform: translateY(30px);
          }
          
          .link-item:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s;
          }
          
          .link-item:hover:before {
            left: 100%;
          }
          
          .link-item:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            filter: brightness(1.1);
          }
          
          .link-item:active {
            transform: translateY(-1px) scale(0.98);
          }
          
          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes titleGlow {
            0% {
              text-shadow: 0 0 5px rgba(0,0,0,0.1);
            }
            100% {
              text-shadow: 0 0 20px rgba(0,0,0,0.2);
            }
          }
          
          .footer {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75rem;
            opacity: 0.6;
            text-align: center;
            white-space: nowrap;
          }
          
          /* Responsive Design */
          @media (max-width: 480px) {
            #container {
              max-width: 350px;
              padding: 24px;
            }
            
            h1 {
              font-size: 1.875rem;
            }
            
            .link-item {
              padding: 14px 18px;
              font-size: 0.95rem;
            }
          }
        </style>
      </head>
      <body>
        <div id="container">
          <div style="width: 100%; position: relative;">
            ${logoPreview ? `
              <div class="logo-container">
                <img src="${logoPreview}" alt="Logo">
              </div>
            ` : ''}
            
            <h1>${businessName || "Your Business Name"}</h1>
            <p class="intro-text">${intro || "Your introduction text goes here"}</p>
            
            <div class="links-container">
              ${links.map((link, index) => link.text ? 
                `<a href="${link.url || '#'}" target="_blank" class="link-item" style="--delay: ${index}">
                  <i class="${link.icon}" style="margin-right: 8px; opacity: 0.8;"></i>
                  ${link.text}
                </a>`
                : ''
              ).join('')}
              ${(links.length === 0 || !links.some(link => link.text)) ? 
                `<a href="#" class="link-item" style="--delay: 0">
                  <i class="fas fa-external-link-alt" style="margin-right: 8px; opacity: 0.8;"></i>
                  Example Link
                </a>`
                : ''}
            </div>
          </div>
          
          <div class="footer">
            Powered By CSB DEVELOPMENT
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

  const handleBackToEditor = () => {
    setSuccessUrl(null);
    setShowQRSelector(false);
    setShowQRGenerator(false);
    setQrOptions(null);
  };

  const handleBackToQRSelector = () => {
    setShowQRGenerator(false);
    setShowQRSelector(true);
  };

  const handleQROptionsSelected = (options) => {
    setQrOptions(options);
    setShowQRSelector(false);
    setShowQRGenerator(true);
  };

  const handleCreateNew = () => {
    setShowQRGenerator(false);
    setShowQRSelector(false);
    setShowFullPreview(false);
    setBusinessName('');
    setIntro('');
    setLinks([{ text: '', url: '' }]);
    setColor('#ffffff');
    setPTColor('#1f2937');
    setBTColor('#ffffff');
    setBColor('#6366f1');
    setLogo(null);
    setLogoPreview(null);
    setPageName('');
    setSuccessUrl(null);
  };

  const handleGoHome = () => {
    setShowQRGenerator(false);
    setShowQRSelector(false);
    setShowFullPreview(false);
  };

  return (
    <>
      {showQRGenerator ? (
        <QRGenerator 
          url={successUrl} 
          qrOptions={qrOptions} 
          onBack={handleBackToQRSelector}
          onCreateNew={handleCreateNew}
          onHome={handleGoHome}
        />
      ) : showQRSelector ? (
        <QRTypeSelector 
          url={successUrl} 
          onNext={handleQROptionsSelected} 
          onBack={handleBackToEditor} 
        />
      ) : (
        <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800'}`}>
          {/* Enhanced Header - Responsive */}
          <div className={`sticky top-0 z-40 backdrop-blur-lg ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} border-b border-gray-200/20 shadow-lg`}>
            <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl ${darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} flex items-center justify-center shadow-lg`}>
                    <i className="fas fa-rocket text-white text-sm lg:text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      CSB Landing Page Hub
                    </h1>
                    <p className="text-xs lg:text-sm opacity-70 hidden lg:block">Create stunning landing pages in seconds</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 lg:space-x-4">
                  {/* Dark Mode Toggle Switch */}
                  <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        id="darkModeToggle"
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 lg:w-14 lg:h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 peer-checked:bg-indigo-600"></div>
                      <div className="dot absolute top-0.5 left-0.5 lg:top-1 lg:left-1 w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-4 lg:peer-checked:translate-x-6 flex items-center justify-center">
                        {darkMode ? <i className="fas fa-moon text-gray-800 text-xs lg:text-sm"></i> : <i className="fas fa-sun text-yellow-500 text-xs lg:text-sm"></i>}
                      </div>
                    </div>
                  </label>

                  <button 
                    onClick={openFullPreview}
                    className="hidden lg:flex px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25 items-center space-x-2 font-medium"
                  >
                    <i className="fas fa-expand-alt text-sm"></i>
                    <span>Full Preview</span>
                  </button>

                  {/* Pro Features Button */}
                  <button
                    onClick={handleProOpen}
                    className="px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg lg:rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-1 lg:space-x-2 font-medium text-sm lg:text-base"
                    title="Pro Features"
                  >
                    <i className="fas fa-star text-xs lg:text-sm"></i>
                    <span>Pro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>