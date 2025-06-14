import { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
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

          {/* Full Preview Modal - Responsive for Mobile and Desktop */}
          {showFullPreview && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 modal-backdrop">
              {/* Desktop Layout */}
              <div className="hidden lg:flex justify-center items-center p-6 h-full">
                <div className="relative w-full max-w-6xl h-[92vh] modal-content">
                  <div className="absolute -top-14 right-0 z-10 flex space-x-3">
                    <button 
                      onClick={closeFullPreview} 
                      className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center space-x-2 font-medium"
                      title="Close full preview"
                    >
                      <i className="fas fa-times text-sm"></i>
                      <span>Close</span>
                    </button>
                  </div>
                  <iframe 
                    srcDoc={generateHtmlContent()}
                    className="w-full h-full rounded-2xl border-0 shadow-2xl bg-white"
                    title="Full Preview"
                  ></iframe>
                </div>
              </div>
              
              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <i className="fas fa-eye text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Landing Page Preview</h3>
                      <p className="text-white/70 text-xs">Mobile View</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeFullPreview} 
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                    title="Close preview"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>
                
                {/* Mobile Preview Content */}
                <div className="flex-1 overflow-hidden">
                  <iframe 
                    srcDoc={generateHtmlContent()}
                    className="w-full h-full border-0 bg-white"
                    title="Mobile Landing Page Preview"
                  ></iframe>
                </div>
                
                {/* Mobile Footer Info */}
                <div className="p-3 bg-black/20 backdrop-blur-sm border-t border-white/10">
                  <div className="flex items-center justify-between text-white/70 text-xs">
                    <span>Template: <span className="text-blue-400 font-medium">{template.name}</span></span>
                    <span>Touch to scroll ↕</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col lg:flex-row h-auto lg:h-screen desktop-main-container">
            {/* Left Side / Mobile Full Width - Enhanced Editor */}
            <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-20 lg:pb-0 desktop-left-panel">
              <div className="p-3 lg:p-6 space-y-4 lg:space-y-8 max-w-full">
                
                {/* Template Selection - Enhanced with Categories */}
                <div className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-purple-500' : 'bg-blue-500'} flex items-center justify-center shadow-md`}>
                      <i className="fas fa-palette text-white text-sm lg:text-lg"></i>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Choose Template</h2>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="mb-4 lg:mb-6">
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105'
                              : darkMode
                                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-4 max-h-60 lg:max-h-80 overflow-y-auto scrollbar-thin p-4">
                    {filteredTemplates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t)}
                        className={`relative p-2 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 group ${
                          template.id === t.id 
                            ? 'ring-2 lg:ring-3 ring-blue-500 scale-105 shadow-xl' 
                            : 'hover:scale-102 hover:shadow-lg'
                        } ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                      >
                        <div className="text-center">
                          <div className="text-lg lg:text-2xl mb-1 lg:mb-2">{t.icon}</div>
                          <span className="block text-xs lg:text-lg font-semibold mb-1 leading-tight">{t.name}</span>
                          <span className="hidden lg:block text-xs opacity-70 mb-2">{t.description}</span>
                          <span className={`inline-block px-1 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium ${
                            darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {t.category}
                          </span>
                        </div>
                        {template.id === t.id && (
                          <div className="absolute top-1 right-1 lg:top-2 lg:right-2">
                            <i className="fas fa-check-circle text-blue-500 text-sm lg:text-lg"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                
                {/* Business Information - Enhanced */}
                <div className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-green-500' : 'bg-green-500'} flex items-center justify-center shadow-md`}>
                      <i className="fas fa-building text-white text-sm lg:text-lg"></i>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Business Information</h2>
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-xs lg:text-sm">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter your business name"
                        className={`w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border transition-all duration-300 focus:ring-2 lg:focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 text-sm lg:text-base ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400' 
                            : 'bg-white/50 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-xs lg:text-sm">Introduction Text</label>
                      <textarea
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="Tell visitors about your business..."
                        rows="3"
                        className={`w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border transition-all duration-300 focus:ring-2 lg:focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm lg:text-base ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400' 
                            : 'bg-white/50 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-xs lg:text-sm">Logo Upload</label>
                      <div className={`relative border-2 border-dashed rounded-lg lg:rounded-xl p-4 lg:p-6 transition-all duration-300 hover:border-blue-500 ${
                        darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50/50'
                      }`}>
                        <input
                          type="file"
                          onChange={(e) => setLogo(e.target.files[0])}
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <i className="fas fa-cloud-upload-alt text-2xl lg:text-3xl mb-2 opacity-50"></i>
                          <p className="text-xs lg:text-sm font-medium">Click or drag to upload logo</p>
                          <p className="text-xs opacity-70 mt-1">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* Links Management - Enhanced */}
                <div className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-purple-500' : 'bg-purple-500'} flex items-center justify-center shadow-md`}>
                        <i className="fas fa-link text-white text-sm lg:text-lg"></i>
                      </div>
                      <h2 className="text-lg lg:text-xl font-bold">Social Links</h2>
                    </div>
                    <button
                      onClick={addLink}
                      className="px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2"
                      disabled={links.length >= 6}
                    >
                      <i className="fas fa-plus text-xs"></i>
                      <span className="hidden lg:inline">Add Link</span>
                      <span className="lg:hidden">Add</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
                    {links.map((link, index) => (
                      <div key={index} className={`p-3 lg:p-4 rounded-lg lg:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-xs lg:text-sm">Link {index + 1}</span>
                          {links.length > 1 && (
                            <button
                              onClick={() => removeLink(index)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2 lg:space-y-3">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
                            <div className="lg:col-span-1">
                              <label className="block text-xs font-medium mb-1">Icon</label>
                              <select
                                value={link.icon}
                                onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                className={`w-full p-2 lg:p-2.5 rounded-lg border text-xs lg:text-sm ${
                                  darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                                }`}
                              >
                                {socialIconOptions.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="lg:col-span-2">
                              <label className="block text-xs font-medium mb-1">Link Text</label>
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => updateLink(index, 'text', e.target.value)}
                                placeholder="e.g., Visit Website"
                                className={`w-full p-2 lg:p-2.5 rounded-lg border text-xs lg:text-sm ${
                                  darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'
                                }`}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium mb-1">URL</label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateLink(index, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className={`w-full p-2 lg:p-2.5 rounded-lg border text-xs lg:text-sm ${
                                darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Customization - Enhanced & Responsive */}
                <div className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-pink-500' : 'bg-pink-500'} flex items-center justify-center shadow-md`}>
                      <i className="fas fa-paint-brush text-white text-sm lg:text-lg"></i>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Advanced Customization</h2>
                  </div>
                  
                  {/* Style Options */}
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-2 lg:mb-3">Animation Style</label>
                      <div className="grid grid-cols-3 gap-1 lg:gap-2">
                        {['fade', 'slide', 'bounce'].map(style => (
                          <button
                            key={style}
                            onClick={() => setAnimationStyle(style)}
                            className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                              animationStyle === style
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                : darkMode
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-2 lg:mb-3">Font Family</label>
                      
                      {/* English Fonts */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">English Fonts</h4>
                        <div className="grid grid-cols-3 lg:grid-cols-2 gap-1 lg:gap-2">
                          {fontOptions.english.map(font => (
                            <button
                              key={font.family}
                              onClick={() => setFontStyle(font.family)}
                              className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                                fontStyle === font.family
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  : darkMode
                                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: font.family }}
                              title={`${font.name} - ${font.category}`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sinhala Fonts */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">සිංහල Fonts</h4>
                        <div className="grid grid-cols-2 gap-1 lg:gap-2">
                          {fontOptions.sinhala.map(font => (
                            <button
                              key={font.family}
                              onClick={() => setFontStyle(font.family)}
                              className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                                fontStyle === font.family
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  : darkMode
                                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: font.family }}
                              title={`${font.name} - ${font.category}`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tamil Font */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">தமிழ் Font</h4>
                        <div className="grid grid-cols-1 gap-1 lg:gap-2">
                          {fontOptions.tamil.map(font => (
                            <button
                              key={font.family}
                              onClick={() => setFontStyle(font.family)}
                              className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                                fontStyle === font.family
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  : darkMode
                                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: font.family }}
                              title={`${font.name} - ${font.category}`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hindi Font */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">हिंदी Font</h4>
                        <div className="grid grid-cols-1 gap-1 lg:gap-2">
                          {fontOptions.hindi.map(font => (
                            <button
                              key={font.family}
                              onClick={() => setFontStyle(font.family)}
                              className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                                fontStyle === font.family
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  : darkMode
                                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: font.family }}
                              title={`${font.name} - ${font.category}`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-2 lg:mb-3">Button Style</label>
                      <div className="grid grid-cols-3 gap-1 lg:gap-2">
                        {[
                          { value: 'rounded-lg', label: 'Round' },
                          { value: 'rounded-xl', label: 'Modern' },
                          { value: 'rounded-full', label: 'Pill' }
                        ].map(style => (
                          <button
                            key={style.value}
                            onClick={() => setButtonStyle(style.value)}
                            className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                              buttonStyle === style.value
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                                : darkMode
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-2 lg:mb-3">Shadow Intensity</label>
                      <div className="grid grid-cols-3 gap-1 lg:gap-2">
                        {['light', 'medium', 'heavy'].map(intensity => (
                          <button
                            key={intensity}
                            onClick={() => setShadowIntensity(intensity)}
                            className={`p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                              shadowIntensity === intensity
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                                : darkMode
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
              {/* Color Customization */}
                  <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200/20">
                    <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Color Palette</h3>
                    
                    {/* Background Color Options */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">Background</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Gradient</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useGradientBackground}
                              onChange={(e) => setUseGradientBackground(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                      
                      {!useGradientBackground ? (
                        // Single Color Mode
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className={`flex-1 p-2 lg:p-2 rounded-lg border text-xs lg:text-sm ${
                              darkMode 
                                ? 'bg-gray-700 text-white border-gray-600' 
                                : 'bg-white text-gray-800 border-gray-300'
                            }`}
                          />
                        </div>
                      ) : (
                        // Gradient Mode
                        <div className="space-y-3">
                          {/* Gradient Presets */}
                          <div>
                            <label className="block text-xs font-medium mb-2">Quick Presets</label>
                            <div className="grid grid-cols-4 gap-2">
                              {gradientPresets.map((preset, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setGradientColor1(preset.colors[0]);
                                    setGradientColor2(preset.colors[1]);
                                    setGradientDirection(preset.direction);
                                  }}
                                  className="h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all duration-200"
                                  style={{
                                    background: `linear-gradient(${preset.direction.includes('to-r') ? 'to right' : preset.direction.includes('to-br') ? 'to bottom right' : 'to bottom'}, ${preset.colors[0]}, ${preset.colors[1]})`
                                  }}
                                  title={preset.name}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Custom Gradient Colors */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Color 1</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={gradientColor1}
                                  onChange={(e) => setGradientColor1(e.target.value)}
                                  className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={gradientColor1}
                                  onChange={(e) => setGradientColor1(e.target.value)}
                                  className={`flex-1 p-1 rounded text-xs ${
                                    darkMode 
                                      ? 'bg-gray-700 text-white border-gray-600' 
                                      : 'bg-white text-gray-800 border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Color 2</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={gradientColor2}
                                  onChange={(e) => setGradientColor2(e.target.value)}
                                  className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={gradientColor2}
                                  onChange={(e) => setGradientColor2(e.target.value)}
                                  className={`flex-1 p-1 rounded text-xs ${
                                    darkMode 
                                      ? 'bg-gray-700 text-white border-gray-600' 
                                      : 'bg-white text-gray-800 border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Gradient Direction */}
                          <div>
                            <label className="block text-xs font-medium mb-2">Direction</label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { value: 'to-r', label: '→' },
                                { value: 'to-br', label: '↘' },
                                { value: 'to-b', label: '↓' }
                              ].map(dir => (
                                <button
                                  key={dir.value}
                                  onClick={() => setGradientDirection(dir.value)}
                                  className={`p-2 rounded text-lg font-bold transition-all duration-300 ${
                                    gradientDirection === dir.value
                                      ? 'bg-blue-500 text-white'
                                      : darkMode
                                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {dir.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Gradient Preview */}
                          <div>
                            <label className="block text-xs font-medium mb-1">Preview</label>
                            <div 
                              className="h-8 rounded-lg border-2 border-gray-200"
                              style={{
                                background: `linear-gradient(${gradientDirection.includes('to-r') ? 'to right' : gradientDirection.includes('to-br') ? 'to bottom right' : 'to bottom'}, ${gradientColor1}, ${gradientColor2})`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Button Color Options */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">Button</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Gradient</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useGradientButton}
                              onChange={(e) => setUseGradientButton(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                      
                      {!useGradientButton ? (
                        // Single Color Mode
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <input
                            type="color"
                            value={bColor}
                            onChange={(e) => setBColor(e.target.value)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={bColor}
                            onChange={(e) => setBColor(e.target.value)}
                            className={`flex-1 p-2 lg:p-2 rounded-lg border text-xs lg:text-sm ${
                              darkMode 
                                ? 'bg-gray-700 text-white border-gray-600' 
                                : 'bg-white text-gray-800 border-gray-300'
                            }`}
                          />
                        </div>
                      ) : (
                        // Gradient Mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Color 1</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={buttonGradientColor1}
                                  onChange={(e) => setButtonGradientColor1(e.target.value)}
                                  className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={buttonGradientColor1}
                                  onChange={(e) => setButtonGradientColor1(e.target.value)}
                                  className={`flex-1 p-1 rounded text-xs ${
                                    darkMode 
                                      ? 'bg-gray-700 text-white border-gray-600' 
                                      : 'bg-white text-gray-800 border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Color 2</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={buttonGradientColor2}
                                  onChange={(e) => setButtonGradientColor2(e.target.value)}
                                  className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={buttonGradientColor2}
                                  onChange={(e) => setButtonGradientColor2(e.target.value)}
                                  className={`flex-1 p-1 rounded text-xs ${
                                    darkMode 
                                      ? 'bg-gray-700 text-white border-gray-600' 
                                      : 'bg-white text-gray-800 border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Button Gradient Preview */}
                          <div>
                            <label className="block text-xs font-medium mb-1">Preview</label>
                            <div 
                              className="h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center text-white text-xs font-medium"
                              style={{
                                background: `linear-gradient(to right, ${buttonGradientColor1}, ${buttonGradientColor2})`
                              }}
                            >
                              Button Style
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Text Colors */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                      <div className="space-y-2 lg:space-y-3">
                        <label className="block text-xs lg:text-sm font-medium">Text Color</label>
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <input
                            type="color"
                            value={ptColor}
                            onChange={(e) => setPTColor(e.target.value)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={ptColor}
                            onChange={(e) => setPTColor(e.target.value)}
                            className={`flex-1 p-2 lg:p-2 rounded-lg border text-xs lg:text-sm ${
                              darkMode 
                                ? 'bg-gray-700 text-white border-gray-600' 
                                : 'bg-white text-gray-800 border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 lg:space-y-3">
                        <label className="block text-xs lg:text-sm font-medium">Button Text Color</label>
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <input
                            type="color"
                            value={btColor}
                            onChange={(e) => setBTColor(e.target.value)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={btColor}
                            onChange={(e) => setBTColor(e.target.value)}
                            className={`flex-1 p-2 lg:p-2 rounded-lg border text-xs lg:text-sm ${
                              darkMode 
                                ? 'bg-gray-700 text-white border-gray-600' 
                                : 'bg-white text-gray-800 border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Section - Enhanced & Responsive */}
                <div className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-green-500' : 'bg-green-500'} flex items-center justify-center shadow-md`}>
                      <i className="fas fa-save text-white text-sm lg:text-lg"></i>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Save & Publish</h2>
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-xs lg:text-sm">Page URL Name</label>
                      <input
                        type="text"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        placeholder="e.g., my-awesome-page"
                        className={`w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border transition-all duration-300 focus:ring-2 lg:focus:ring-3 focus:ring-green-500/20 focus:border-green-500 text-sm lg:text-base ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400' 
                            : 'bg-white/50 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                      />
                      <p className="text-xs opacity-70 mt-2">
                        Your page will be available at: your-domain.com/{pageName || 'page-name'}
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleSave} 
                      disabled={!pageName}
                      className="w-full p-3 lg:p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg lg:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/25 font-bold text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 lg:space-x-3"
                    >
                      <i className="fas fa-rocket text-sm lg:text-base"></i>
                      <span>Create Landing Page</span>
                    </button>
                  </div>
                </div>
                {/* Mobile Preview Button */}
                <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 mobile-preview-btn safe-area-bottom">
                  <button 
                    onClick={openFullPreview}
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-3 font-bold text-lg backdrop-blur-sm border border-white/10 touch-optimized focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95"
                    aria-label="Preview your landing page in full screen"
                  >
                    <i className="fas fa-eye text-lg" aria-hidden="true"></i>
                    <span>Preview Landing Page</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Preview (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 lg:h-full flex-col border-l border-gray-200/20 desktop-right-panel desktop-preview-panel">
              <div className={`p-4 lg:p-6 ${darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm border-b border-gray-200/20`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl ${darkMode ? 'bg-blue-500' : 'bg-blue-500'} flex items-center justify-center shadow-md`}>
                      <i className="fas fa-eye text-white text-sm lg:text-lg"></i>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Live Preview</h2>
                  </div>
                  
                  <div className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm opacity-70">
                    <i className="fas fa-mobile-alt"></i>
                    <span>Mobile View</span>
                  </div>
                </div>
                
                <div className="mt-3 lg:mt-4 flex items-center justify-center">
                  <div className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium ${
                    darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    Template: <span className="font-bold text-blue-500">{template.name}</span> {template.icon}
                  </div>
                </div>
              </div>
              
              <div 
                className="flex-1 overflow-y-auto flex justify-center items-center p-4 lg:p-6"
                style={
                  template.name === "Dark Pro" 
                    ? {background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%)"} 
                    : template.name === "Cyberpunk"
                    ? {background: "#000000", backgroundImage: "radial-gradient(circle at 25% 25%, #00ffff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ff00ff 0%, transparent 50%)"}
                    : template.name === "Nature Zen"
                    ? {background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"}
                    : template.name === "Golden Hour"
                    ? {background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fed7aa 100%)"}
                    : template.name === "Deep Ocean"
                    ? {background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)"}
                    : template.name === "Aurora"
                    ? {background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)"}
                    : template.name === "Mint Fresh"
                    ? {background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #a7f3d0 100%)"}
                    : template.name === "Glassmorphism"
                    ? {background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
                    : darkMode 
                      ? {background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)"} 
                      : {background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"}
                }
              >
                <div className="relative">
                  <div className={`absolute -inset-3 lg:-inset-4 rounded-2xl lg:rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-sm`}></div>
                  <iframe 
                    srcDoc={generateHtmlContent()}
                    title="Landing Page Preview"
                    className="relative w-[300px] lg:w-[350px] h-[500px] lg:h-[600px] border-0 rounded-xl lg:rounded-2xl shadow-2xl"
                    style={{ 
                      boxShadow: template.name === "Cyberpunk" 
                        ? "0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)" 
                        : template.name === "Glassmorphism"
                        ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                  />
                </div>
              </div>
              
              {/* Footer Info */}
              <div className={`p-3 lg:p-4 ${darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm border-t border-gray-200/20`}>
                <div className="text-center">
                  <div className="text-xs lg:text-sm font-medium text-blue-600 mb-1">
                    © 2024 All Rights Reserved - CSB Developments
                  </div>
                  <div className="text-xs opacity-70">
                    <a href="https://www.csbodima.lk" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                      www.csbodima.lk
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Modal - New Addition */}
          {showProModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Pro Features</h2>
                  <button onClick={handleProClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlock additional premium templates, advanced analytics, and priority support.</p>
                  <button
                    onClick={() => {/* Payment gateway integration to be configured */}}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;

    