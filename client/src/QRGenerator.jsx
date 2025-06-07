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

}

export default QRGenerator;