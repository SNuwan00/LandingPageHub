function QRGenerator({ url, qrOptions, onBack, onCreateNew, onHome }) {

    const {
    qrType = 'standard',
    dotColor = '#000000',
    backgroundColor = '#FFFFFF',
    includeMargin = true,
    logoImage = null,
    // New gradient options
    useGradientDot = false,
    dotGradientColor1 = '#000000',
    dotGradientColor2 = '#333333',
    useGradientBackground = false,
    bgGradientColor1 = '#FFFFFF',
    bgGradientColor2 = '#F8F9FA'
  } = qrOptions || {};

  const [effectiveQrType, setEffectiveQrType] = useState(qrType);
  const [copyUrlSuccess, setCopyUrlSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Validate all inputs
  const validateInputs = React.useCallback(() => {
    setError(null);

    // Validate URL
    if (!url || typeof url !== 'string') {
      setError('Invalid URL provided');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Invalid URL format');
      return;
    }

    // Validate colors
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!useGradientDot && dotColor && !hexColorRegex.test(dotColor)) {
      setError('Invalid dot color format. Please use hex colors (e.g., #FF0000)');
      return;
    }

    if (!useGradientBackground && backgroundColor && !hexColorRegex.test(backgroundColor)) {
      setError('Invalid background color format. Please use hex colors (e.g., #FFFFFF)');
      return;
    }

    // Validate gradient colors
    if (useGradientDot) {
      if (!hexColorRegex.test(dotGradientColor1) || !hexColorRegex.test(dotGradientColor2)) {
        setError('Invalid gradient colors. Please use hex colors (e.g., #FF0000)');
        return;
      }
    }

    if (useGradientBackground) {
      if (!hexColorRegex.test(bgGradientColor1) || !hexColorRegex.test(bgGradientColor2)) {
        setError('Invalid background gradient colors. Please use hex colors (e.g., #FFFFFF)');
        return;
      }
    }

    // Validate QR type
    const validTypes = ['standard', 'dots', 'rounded', 'colored', 'micro', 'logo'];
    if (qrType && !validTypes.includes(qrType)) {
      setError(`Invalid QR type. Valid types: ${validTypes.join(', ')}`);
      return;
    }

    // Logo validation
    if (qrType === 'logo' && logoImage) {
      if (typeof logoImage !== 'string' || !logoImage.startsWith('data:image/')) {
        setError('Invalid logo image format');
        return;
      }
    }
  }, [url, dotColor, backgroundColor, qrType, logoImage, useGradientDot, dotGradientColor1, dotGradientColor2, useGradientBackground, bgGradientColor1, bgGradientColor2]);

  // Input validation
  useEffect(() => {
    validateInputs();
  }, [validateInputs]);
  
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

  const handleDownloadQR = async () => {
    if (error) {
      setError('Cannot download QR code due to validation errors. Please fix the issues first.');
      return;
    }

    try {
      const qrCodeElement = document.getElementById('qr-code');
      
      if (!qrCodeElement) {
        setError('QR code element not found. Please refresh and try again.');
        return;
      }

      const canvas = await html2canvas(qrCodeElement, { 
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: useGradientBackground ? null : (backgroundColor || '#FFFFFF')
      });
      
      const link = document.createElement('a');
      link.download = `qrcode-${effectiveQrType}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download QR code. Please try again.');
    }
  };

  const handleCopyUrl = async () => {
    if (error) {
      setError('Cannot copy URL due to validation errors.');
      return;
    }

    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(url);
      }
      
      setCopyUrlSuccess(true);
      setTimeout(() => setCopyUrlSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL. Please copy manually from the address bar.');
    }
  };

  // Calculate QR code rendering options based on the selected type
  const getQROptions = () => {
    // Responsive sizing with better mobile optimization
    const screenWidth = window.innerWidth;
    let baseSize;
    
    if (screenWidth < 480) {
      baseSize = effectiveQrType === 'micro' ? 120 : 140;
    } else if (screenWidth < 640) {
      baseSize = effectiveQrType === 'micro' ? 140 : 160;
    } else {
      baseSize = effectiveQrType === 'micro' ? 160 : 180;
    }
    
    const baseOptions = {
      value: url,
      size: baseSize,
      bgColor: useGradientBackground ? 'transparent' : backgroundColor,
      fgColor: useGradientDot ? 'url(#qrGradient)' : dotColor,
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
          height: baseSize * 0.25,
          width: baseSize * 0.25,
          excavate: true,
        }
      };
    }

    return baseOptions;
  };

  // Get CSS classes for specific QR types
  const getQRContainerClass = () => {
    let classes = "bg-white p-3 sm:p-4 rounded-lg shadow-md mx-auto mb-4 sm:mb-6 relative qr-container";
    
    // Add specific type classes
    classes += ` qr-${effectiveQrType}`;
    
    return classes;
  };

  // Get CSS style for QR container based on type
  const getQRContainerStyle = () => {
    let style = { 
      width: 'fit-content', 
      background: useGradientBackground 
        ? `linear-gradient(135deg, ${bgGradientColor1}, ${bgGradientColor2})`
        : backgroundColor 
    };
    
    // Type-specific styling
    switch(effectiveQrType) {
      case 'rounded':
        style.borderRadius = '16px';
        style.overflow = 'hidden';
        style.border = '2px solid rgba(59, 130, 246, 0.2)';
        break;
      case 'dots':
        style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        break;
      case 'colored':
        style.background = `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)`;
        style.boxShadow = `0 8px 25px ${dotColor}20`;
        break;
      case 'logo':
        style.borderRadius = '12px';
        style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
        style.border = '3px solid rgba(255, 255, 255, 0.8)';
        break;
      case 'micro':
        style.border = '1px solid rgba(0, 0, 0, 0.1)';
        style.borderRadius = '8px';
        break;
      default:
        style.border = '1px solid rgba(0, 0, 0, 0.05)';
    }
    
    return style;
  };

  // QR code description based on type
  const getQRDescription = () => {
    switch(effectiveQrType) {
      case 'standard':
        return "Standard square-module QR code with classic styling";
      case 'dots':
        return "Circular modules for a softer, modern appearance";
      case 'logo':
        return "QR code with embedded logo in the center";
      case 'colored':
        return "Custom colored QR code with enhanced contrast";
      case 'rounded':
        return "QR code with rounded corners for a modern look";
      case 'micro':
        return "Compact QR code optimized for limited space";
      default:
        return "Custom styled QR code";
    }
  };

  return (
    <div className="w-full min-h-screen" style={{ position: 'absolute', top: 0, left: 0, right: 0, overflow: 'auto', paddingBottom: '100px', background: 'linear-gradient(to bottom right, #ebf5ff, #e6eeff)' }}>
      <div className="max-w-sm sm:max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl my-4 sm:my-8">
        <div className="p-4 sm:p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 sm:mb-6">
              <i className="fas fa-check text-xl sm:text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
              Your Landing Page Is Ready!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
              Your landing page has been successfully created and is now live.
            </p>
            
            {/* Error Display */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mr-2"></i>
                  <span className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}
            
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-4 sm:mb-6">
              <span className="font-medium">{effectiveQrType.charAt(0).toUpperCase() + effectiveQrType.slice(1)} QR Code:</span> {getQRDescription()}
              {useGradientDot && <span className="ml-2 text-purple-600 dark:text-purple-400">• Gradient Colors</span>}
              {useGradientBackground && <span className="ml-2 text-indigo-600 dark:text-indigo-400">• Gradient Background</span>}
            </p>

            {!error && (
              <div 
                id="qr-code"
                className={getQRContainerClass()}
                style={getQRContainerStyle()}
              >
                <QRCodeSVG 
                  {...getQROptions()}
                />
                
                {/* Gradient Definition for QR Code */}
                {useGradientDot && (
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={dotGradientColor1} />
                        <stop offset="100%" stopColor={dotGradientColor2} />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 break-all hover:underline flex-1 text-center text-xs sm:text-sm"
                >
                  {url}
                </a>
                <button
                  onClick={handleCopyUrl}
                  className={`ml-2 sm:ml-3 px-2 sm:px-3 py-1 rounded transition-all duration-200 flex items-center text-xs sm:text-sm copy-button ${
                    copyUrlSuccess 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 success' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                  }`}
                  title="Copy URL"
                >
                  <i className={`fas ${copyUrlSuccess ? 'fa-check' : 'fa-copy'} text-xs sm:text-sm`}></i>
                  <span className="ml-1 hidden sm:inline">
                    {copyUrlSuccess ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Download and Back Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={handleDownloadQR}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center justify-center nav-button text-sm sm:text-base"
              >
                <i className="fas fa-download mr-2" style={{ width: '14px', height: '14px' }}></i>
                Download QR Code
              </button>
              
              <button
                onClick={onBack}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center nav-button text-sm sm:text-base"
              >
                <i className="fas fa-arrow-left mr-2" style={{ width: '14px', height: '14px' }}></i>
                Back to Options
              </button>
            </div>

            {/* Navigation Buttons */}
            {(onCreateNew || onHome) && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 dark:border-gray-600">
                {onCreateNew && (
                  <button
                    onClick={onCreateNew}
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 flex items-center justify-center nav-button text-sm sm:text-base"
                  >
                    <i className="fas fa-plus mr-2" style={{ width: '14px', height: '14px' }}></i>
                    Create New Page
                  </button>
                )}
                
                {onHome && (
                  <button
                    onClick={onHome}
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-all duration-300 flex items-center justify-center nav-button text-sm sm:text-base"
                  >
                    <i className="fas fa-home mr-2" style={{ width: '14px', height: '14px' }}></i>
                    Go to Home
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Share this QR code with your customers or on social media</p>
      </div>

      {/* Enhanced custom styles for specialized QR codes */}
      <style jsx global>{`
        /* Improved Dots QR Code Styles - Better Implementation */
        .qr-dots svg rect {
          rx: 50% !important;
          ry: 50% !important;
        }
        
        .qr-dots svg path {
          border-radius: 50% !important;
        }
        
        /* Apply circular dots to all QR modules */
        .qr-dots svg > g > g > rect {
          rx: 50% !important;
          ry: 50% !important;
        }
        
        /* Enhanced Rounded QR Code Styles */
        .qr-rounded svg {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .qr-rounded svg rect {
          rx: 3px !important;
          ry: 3px !important;
        }
        
        /* Improved Colored QR Code enhanced contrast */
        .qr-colored svg {
          filter: contrast(1.15) brightness(1.05) saturate(1.1);
        }
        
        /* Enhanced Micro QR Code styles */
        .qr-micro svg {
          filter: sharp(1px) contrast(1.1);
        }
        
        /* Enhanced Logo QR Code container */
        .qr-logo svg {
          position: relative;
          border-radius: 8px;
        }
        
        /* Gradient support for QR codes */
        .qr-container svg {
          transition: all 0.3s ease;
        }
        
        .qr-container:hover svg {
          transform: scale(1.02);
        }
        
        /* Smooth gradient transitions */
        .qr-gradient {
          background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
          transition: background 0.3s ease;
        }
        
        /* Enhanced shadow effects for different QR types */
        .qr-rounded {
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15) !important;
        }
        
        .qr-dots {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
        }
        
        .qr-logo {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
        }
        
        .qr-colored {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default QRGenerator;