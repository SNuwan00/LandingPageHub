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
// QR Code Types
  const qrTypes = [
    {
      id: 'standard',
      name: 'Standard QR Code',
      description: 'Classic square-module QR code',
      icon: 'fa-qrcode'
    },
    {
      id: 'dots',
      name: 'Dots QR Code',
      description: 'Circular modules for a softer look',
      icon: 'fa-circle'
    },
    {
      id: 'logo',
      name: 'Logo QR Code',
      description: 'Embed your logo in the center',
      icon: 'fa-image'
    },
    {
      id: 'colored',
      name: 'Colored QR Code',
      description: 'Customize colors for your brand',
      icon: 'fa-palette'
    },
    {
      id: 'rounded',
      name: 'Rounded QR Code',
      description: 'Softer edges for a modern look',
      icon: 'fa-square-full'
    },
    {
      id: 'micro',
      name: 'Micro QR Code',
      description: 'Smaller version for limited space',
      icon: 'fa-compress'
    }
  ];

  // Update the handleNext function
  const handleNext = () => {
    // Validate logo if logo type is selected
    if (selectedType === 'logo' && !logoPreview) {
      alert('Please upload a logo image for Logo QR Code type');
      return;
    }
    
    onNext({
      qrType: selectedType,
      dotColor,
      backgroundColor,
      includeMargin,
      logoImage: logoPreview,
      // Gradient options
      useGradientDot,
      dotGradientColor1,
      dotGradientColor2,
      useGradientBackground,
      bgGradientColor1,
      bgGradientColor2
    });
  };

  return (
    <div className="w-full min-h-screen" style={{ position: 'absolute', top: 0, left: 0, right: 0, overflow: 'auto', paddingBottom: '100px', background: 'linear-gradient(to bottom right, #ebf5ff, #e6eeff)' }}>
      <div className="w-full mx-2 sm:mx-auto sm:max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl my-8 relative">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Choose Your QR Code Style
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Customize how your QR code will look for URL: <span className="font-medium break-all">{url || 'your landing page'}</span>
            </p>
          </div>

          {/* Enhanced QR Code Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center">
              <i className="fas fa-qrcode mr-2 text-blue-600 dark:text-blue-400"></i>
              QR Code Style
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrTypes.map(type => (
                <button
                  key={type.id}
                  className={`p-5 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 group ${
                    selectedType === type.id 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 dark:from-blue-900 dark:to-indigo-900 dark:border-blue-400 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800' 
                      : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      selectedType === type.id 
                        ? 'bg-blue-100 dark:bg-blue-800' 
                        : 'bg-gray-100 dark:bg-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-500'
                    }`}>
                      <i className={`fas ${type.icon} text-xl ${
                        selectedType === type.id 
                          ? 'text-blue-600 dark:text-blue-300' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`}></i>
                    </div>
                    <span className={`block font-semibold text-sm mb-1 ${
                      selectedType === type.id 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      {type.description}
                    </span>
                    {selectedType === type.id && (
                      <div className="mt-2">
                        <i className="fas fa-check-circle text-blue-600 dark:text-blue-400"></i>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Color Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Color Customization</h3>
            
            {/* QR Code Color Section */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  QR Code Color
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Gradient</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={useGradientDot}
                      onChange={(e) => setUseGradientDot(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {!useGradientDot ? (
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="h-10 w-10 border rounded-lg mr-3 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 1</label>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={dotGradientColor1}
                        onChange={(e) => setDotGradientColor1(e.target.value)}
                        className="h-8 w-8 border rounded mr-2 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={dotGradientColor1}
                        onChange={(e) => setDotGradientColor1(e.target.value)}
                        className="flex-1 p-1 text-xs border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 2</label>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={dotGradientColor2}
                        onChange={(e) => setDotGradientColor2(e.target.value)}
                        className="h-8 w-8 border rounded mr-2 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={dotGradientColor2}
                        onChange={(e) => setDotGradientColor2(e.target.value)}
                        className="flex-1 p-1 text-xs border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Background Color Section */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Gradient</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={useGradientBackground}
                      onChange={(e) => setUseGradientBackground(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {!useGradientBackground ? (
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-10 border rounded-lg mr-3 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="#FFFFFF"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 1</label>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={bgGradientColor1}
                        onChange={(e) => setBgGradientColor1(e.target.value)}
                        className="h-8 w-8 border rounded mr-2 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={bgGradientColor1}
                        onChange={(e) => setBgGradientColor1(e.target.value)}
                        className="flex-1 p-1 text-xs border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 2</label>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={bgGradientColor2}
                        onChange={(e) => setBgGradientColor2(e.target.value)}
                        className="h-8 w-8 border rounded mr-2 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={bgGradientColor2}
                        onChange={(e) => setBgGradientColor2(e.target.value)}
                        className="flex-1 p-1 text-xs border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Additional Options</h3>
            <div className="space-y-6">
              {selectedType === 'logo' && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <i className="fas fa-image mr-2 text-blue-600 dark:text-blue-400"></i>
                    Upload Logo (PNG or JPG recommended)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full p-3 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-800 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {logoPreview ? (
                    <div className="mt-4 flex justify-center">
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="h-20 w-20 object-contain border-2 border-blue-300 dark:border-blue-600 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-1">
                          <i className="fas fa-check text-xs"></i>
                        </div>
                      </div>
                    </div>
                  ) : selectedType === 'logo' && (
                    <div className="mt-4 text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Please upload a logo image to use Logo QR Code
                    </div>
                  )}
                </div>
              )}
              
              {/* Enhanced Margin Option */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <i className="fas fa-expand-arrows-alt text-gray-600 dark:text-gray-400"></i>
                    </div>
                    <div>
                      <label htmlFor="includeMargin" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        Include Margin Around QR Code
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Adds white space padding around the QR code for better readability
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="includeMargin"
                      className="sr-only peer"
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>