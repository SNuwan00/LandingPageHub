import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QRTypeSelector({ url, onNext, onBack }) {
  const [selectedType, setSelectedType] = useState('standard');
  const [dotColor, setDotColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // Gradient states for QR Code Colors
  const [useGradientDot, setUseGradientDot] = useState(false);
  const [dotGradientColor1, setDotGradientColor1] = useState('#000000');
  const [dotGradientColor2, setDotGradientColor2] = useState('#333333');
  
  // Gradient states for Background
  const [useGradientBackground, setUseGradientBackground] = useState(false);
  const [bgGradientColor1, setBgGradientColor1] = useState('#FFFFFF');
  const [bgGradientColor2, setBgGradientColor2] = useState('#F8F9FA');

  // Force document to be scrollable
  useEffect(() => {
    // Save original styles
    const originalStyle = document.body.style.cssText;
    
    // Apply scrollable styles to body
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.cssText = originalStyle;
    };
  }, []);

  // Handle logo file upload
  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
