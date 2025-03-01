import { useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const templates = [
  {
    id: 1,
    name: "Simple",
    image: "./images/simple.png",
    bgClass: "bg-gray-100",
    layout: "simple",
    buttonClass: "bg-blue-500 text-white rounded",
    containerClass: "text-center p-6 bg-white rounded-lg shadow-lg",
  },
  {
    id: 2,
    name: "Bold",
    image: "./images/bold.png",
    bgClass: "bg-gradient-to-r from-purple-500 to-pink-500",
    layout: "bold",
    buttonClass: "bg-yellow-400 text-black font-bold rounded-full",
    containerClass: "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl",
  },
  {
    id: 3,
    name: "Modern",
    image: './images/modern.png',
    bgClass: "bg-gray-900",
    layout: "modern",
    buttonClass: "bg-green-500 text-white rounded-lg hover:bg-green-600 transition",
    containerClass: "text-center p-6 bg-gray-800 text-white rounded-lg shadow-lg border border-green-500",
  },
];

function App() {
  const [template, setTemplate] = useState(templates[0]);
  const [businessName, setBusinessName] = useState('');
  const [intro, setIntro] = useState('');
  const [links, setLinks] = useState([{ text: '', url: '' }]);
  const [color, setColor] = useState('#ffffff');
  const [ptColor, setPTColor] = useState('#ffffff');
  const [btColor, setBTColor] = useState('#ffffff');
  const [bColor, setBColor] = useState('#000000');
  const [logo, setLogo] = useState(null);
  const [pageName, setPageName] = useState('');

  const addLink = () => setLinks([...links, { text: '', url: '' }]);
  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = async () => {
    if (!pageName) return alert('Please enter a name for your landing page');
    const formData = new FormData();
    formData.append('name', pageName);
    formData.append('businessName', businessName);
    formData.append('intro', intro);
    formData.append('links', JSON.stringify(links));
    formData.append('color', color);
    formData.append('ptColor', ptColor);
    formData.append('btColor', btColor);
    formData.append('bColor', bColor);
    formData.append('template', template.name);
    if (logo) formData.append('logo', logo);

    const res = await axios.post('/api/save-landing', formData);
    alert(`Landing page saved! Visit: ${res.data.url}`);
  };

  return (
    <div className='flex items-center justify-center'>
    <div className={`min-h-screen p-6 ${template.bg}`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Landing Page Generator</h1>
      
      {/* Template Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium">Select Template:</label>
        <div className="grid grid-cols-3 gap-4">
          {templates.map(t => (
            <div
              key={t.id}
              onClick={() => setTemplate(t)}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 w-80  ${
                template.id === t.id ? 'border-4 border-blue-500' : 'border border-gray-300'
              } ${t.bgClass}`}
            >
              <img
                src={t.image}
                alt={`${t.name} template preview`}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-3 text-center">
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-600">
                  {t.name === "Simple" ? "Clean and minimalistic design" :
                   t.name === "Bold" ? "Vibrant and eye-catching style" :
                   "Sleek and modern dark theme"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Info */}
      <div className="mb-4">
        <label className="block mb-2">Business Name:</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="p-2 border rounded w-full"
           required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Introduction:</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="block mb-2">Upload Logo:</label>
        <input
          type="file"
          onChange={(e) => setLogo(e.target.files[0])}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Dynamic Links */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium">Links:</label>
        {links.map((link, i) => (
          <div key={i} className="flex space-x-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Text (e.g., Facebook)"
              value={link.text}
              onChange={(e) => updateLink(i, 'text', e.target.value)}
              className="p-2 border rounded flex-1"
              required
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(i, 'url', e.target.value)}
              className="p-2 border rounded flex-1"
              required
            />
            <button
              onClick={() => {
                const newLinks = links.filter((_, index) => index !== i);
                setLinks(newLinks);
              }}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              title="Delete Link"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
        <button
          onClick={addLink}
          className={`p-2 rounded flex items-center ${
          links.some(link => !link.text.trim() || !link.url.trim()) 
          ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
           disabled={links.some(link => !link.text.trim() || !link.url.trim())}
        >
          <i className="fas fa-plus mr-2"></i> Add Link
        </button>
      </div>

      {/* Color Picker */}
      <div className="mb-4 flex justify-center items-center space-x-6">
        <div className="ml-4 mr-8">
          <label className="block mb-2">Background Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-1 h-10 w-20 border rounded"
          />
        </div>
        <div className="ml-4 mr-8">
          <label className="block mb-2">Primary Text Color:</label>
          <input
            type="color"
            value={ptColor}
            onChange={(e) => setPTColor(e.target.value)}
            className="p-1 h-10 w-20 border rounded"
          />
        </div>
        <div className="ml-8 mr-4">
          <label className="block mb-2">Button Color:</label>
          <input
            type="color"
            value={bColor}
            onChange={(e) => setBColor(e.target.value)}
            className="p-1 h-10 w-20 border rounded"
          />
        </div>
        <div className="ml-8 mr-4">
          <label className="block mb-2">Button Text Color:</label>
          <input
            type="color"
            value={btColor}
            onChange={(e) => setBTColor(e.target.value)}
            className="p-1 h-10 w-20 border rounded"
          />
        </div>
      </div>


      {/* Save Page */}
      <div className="mb-4">
        <label className="block mb-2">Landing Page Name:</label>
        <input
          type="text"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="e.g., mypage"
        />
      </div>
      <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded w-full">
        Save Landing Page
      </button>
    </div>
    </div>
  );
}

export default App;

