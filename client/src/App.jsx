import { useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const templates = [
  {
    id: 1,
    name: "Simple",
    bgClass: "bg-gray-100",
    layout: "simple",
    buttonClass: "bg-blue-500 text-white rounded",
    containerClass: "text-center p-6 bg-white rounded-lg shadow-lg",
  },
  {
    id: 2,
    name: "Bold",
    bgClass: "bg-gradient-to-r from-purple-500 to-pink-500",
    layout: "bold",
    buttonClass: "bg-yellow-400 text-black font-bold rounded-full",
    containerClass: "text-center p-8 bg-gray-900 text-white rounded-xl shadow-2xl",
  },
  {
    id: 3,
    name: "Modern",
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
    formData.append('template', template.name);
    if (logo) formData.append('logo', logo);

    const res = await axios.post('/api/save-landing', formData);
    alert(`Landing page saved! Visit: ${res.data.url}`);
  };

  return (
    <div className={`min-h-screen p-6 ${template.bg}`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Landing Page Generator</h1>
      
      {/* Template Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Template:</label>
        <select
          value={template.id}
          onChange={(e) => setTemplate(templates.find(t => t.id === +e.target.value))}
          className="p-2 border rounded w-full"
        >
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Business Info */}
      <div className="mb-4">
        <label className="block mb-2">Business Name:</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="p-2 border rounded w-full"
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
        <label className="block mb-2">Links:</label>
        {links.map((link, i) => (
          <div key={i} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Text (e.g., Facebook)"
              value={link.text}
              onChange={(e) => updateLink(i, 'text', e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(i, 'url', e.target.value)}
              className="p-2 border rounded flex-1"
            />
          </div>
        ))}
        <button onClick={addLink} className="p-2 bg-blue-500 text-white rounded">
          <i className="fas fa-plus"></i> Add Link
        </button>
      </div>

      {/* Color Picker */}
      <div className="mb-4">
        <label className="block mb-2">Background Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="p-1 h-10 w-20 border rounded"
        />
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
  );
}

export default App;

