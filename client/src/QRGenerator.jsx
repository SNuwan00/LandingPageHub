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

}

export default QRGenerator;