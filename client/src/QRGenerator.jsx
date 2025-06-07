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

}

export default QRGenerator;