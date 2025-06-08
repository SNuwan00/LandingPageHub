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
      