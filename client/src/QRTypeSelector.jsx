import React, { useState, useEffect } from 'react';

function QRTypeSelector({ url, onNext, onBack }) {
  const [selectedType, setSelectedType] = useState('standard');
  const [dotColor, setDotColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

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
      setLogoFile(e.target.files[0]);
      
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
      logoImage: logoPreview
    });
  };

  return (
    <div className="w-full min-h-screen" style={{ position: 'absolute', top: 0, left: 0, right: 0, overflow: 'auto', paddingBottom: '100px', background: 'linear-gradient(to bottom right, #ebf5ff, #e6eeff)' }}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl my-8 relative">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Choose Your QR Code Style
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Customize how your QR code will look for URL: <span className="font-medium break-all">{url || 'your landing page'}</span>
            </p>
          </div>
          
          {/* QR Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">QR Code Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {qrTypes.map(type => (
                <button
                  key={type.id}
                  className={`p-4 border rounded-lg text-center transition-all duration-200 
                    ${selectedType === type.id 
                      ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-400 shadow-md' 
                      : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:shadow'}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="flex flex-col items-center">
                    <i className={`fas ${type.icon} text-2xl mb-2 ${selectedType === type.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}></i>
                    <span className={`block font-medium ${selectedType === type.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {type.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Color Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Color Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  QR Code Color
                </label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="h-10 w-10 border rounded mr-3"
                  />
                  <input 
                    type="text" 
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-10 border rounded mr-3"
                  />
                  <input 
                    type="text" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Additional Options</h3>
            <div className="space-y-4">
              {selectedType === 'logo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Logo (PNG or JPG recommended)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  {logoPreview ? (
                    <div className="mt-3 flex justify-center">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="h-20 w-20 object-contain border rounded p-1"
                      />
                    </div>
                  ) : selectedType === 'logo' && (
                    <div className="mt-3 text-center text-yellow-600 dark:text-yellow-400">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Please upload a logo image
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeMargin"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeMargin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Include margin around QR code
                </label>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between mt-8">
            <button
              onClick={onBack}
              className="px-4 py-2 border mb-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center mb-3 sm:mb-0"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Editor
            </button>
            
            <button
              onClick={handleNext}
              className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
            >
              Next: Generate QR Code
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRTypeSelector;