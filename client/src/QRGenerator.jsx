import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

function QRGenerator({ url, qrOptions, onBack }) {
  const {
    qrType = 'standard',
    dotColor = '#000000',
    backgroundColor = '#FFFFFF',
    includeMargin = true,
    logoImage = null
  } = qrOptions || {};

  // Fallback to standard if logo is selected but no logo is provided
  const [effectiveQrType, setEffectiveQrType] = useState(qrType);
  
  useEffect(() => {
    // If logo type is selected but no logo provided, fall back to standard
    if (qrType === 'logo' && !logoImage) {
      setEffectiveQrType('standard');
    } else {
      setEffectiveQrType(qrType);
    }
  }, [qrType, logoImage]);

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

  const handleDownloadQR = () => {
    const qrCodeElement = document.getElementById('qr-code');
    
    html2canvas(qrCodeElement, { scale: 3 }).then(canvas => {
      const link = document.createElement('a');
      link.download = `qrcode-${effectiveQrType}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // Calculate QR code rendering options based on the selected type
  const getQROptions = () => {
    const baseOptions = {
      value: url,
      size: effectiveQrType === 'micro' ? 150 : 200,
      bgColor: backgroundColor,
      fgColor: dotColor,
      level: "H",
      includeMargin: includeMargin,
    };

    // Only add imageSettings if we have a logo image and it's logo type
    if (effectiveQrType === 'logo' && logoImage) {
      return {
        ...baseOptions,
        imageSettings: {
          src: logoImage,
          x: undefined,
          y: undefined,
          height: 50,
          width: 50,
          excavate: true,
        }
      };
    }

    return baseOptions;
  };

  // Get CSS classes for specific QR types
  const getQRContainerClass = () => {
    let classes = "bg-white p-4 rounded-lg shadow-md mx-auto mb-6 relative";
    
    if (effectiveQrType === 'rounded') {
      classes += " qr-rounded";
    }
    
    if (effectiveQrType === 'dots') {
      classes += " qr-dots";
    }
    
    return classes;
  };

  // QR code description based on type
  const getQRDescription = () => {
    switch(effectiveQrType) {
      case 'standard':
        return "Standard square-module QR code";
      case 'dots':
        return "Circular modules for a softer look";
      case 'logo':
        return "QR code with embedded logo";
      case 'colored':
        return "Custom colored QR code";
      case 'rounded':
        return "QR code with rounded corners";
      case 'micro':
        return "Smaller, compact QR code";
      default:
        return "Custom QR code";
    }
  };

  return (
    <div className="w-full min-h-screen" style={{ position: 'absolute', top: 0, left: 0, right: 0, overflow: 'auto', paddingBottom: '100px', background: 'linear-gradient(to bottom right, #ebf5ff, #e6eeff)' }}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl my-8">
        <div className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <i className="fas fa-check text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your Landing Page Is Ready!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Your landing page has been successfully created and is now live.
            </p>
            
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-6">
              <span className="font-medium">{effectiveQrType.charAt(0).toUpperCase() + effectiveQrType.slice(1)} QR Code:</span> {getQRDescription()}
            </p>

            <div 
              id="qr-code"
              className={getQRContainerClass()}
              style={{ width: 'fit-content', background: backgroundColor }}
            >
              <QRCodeSVG 
                {...getQROptions()}
              />
            </div>

            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center text-blue-600 dark:text-blue-400 mb-6 break-all hover:underline"
            >
              {url}
            </a>

            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
              <button
                onClick={handleDownloadQR}
                className="px-4 py-2 mb-2 sm:mb-0 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center justify-center w-95"
              >
                <i className="fas fa-download mr-2"></i>
                Download QR Code
              </button>
              
              <button
                onClick={onBack}
                className="px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Options
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Share this QR code with your customers or on social media</p>
      </div>

      {/* Add custom styles for specialized QR codes */}
      <style jsx global>{`
        .qr-rounded svg path:not([stroke]) {
          border-radius: 4px !important;
        }
        
        .qr-dots svg path:not([stroke]) {
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  );
}

export default QRGenerator;