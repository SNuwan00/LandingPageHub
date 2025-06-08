import { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SuccessPage from './QRGenerator.jsx'; // Import the SuccessPage component
import QRTypeSelector from './QRTypeSelector';
import QRGenerator from './QRGenerator';

// Modern template collection with advanced styling and new premium templates
const templates = [
  {
    id: 1,
    name: "Minimal",
    bgClass: "bg-gradient-to-br from-slate-50 to-gray-100",
    layout: "minimal",
    buttonClass: "bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    containerClass: "text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20",
    description: "Clean, minimal design with subtle gradients",
    icon: "✨",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Classic"
  },
  {
    id: 2,
    name: "Dark Pro",
    bgClass: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
    layout: "professional",
    buttonClass: "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25",
    containerClass: "text-center p-10 bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-500/20",
    description: "Professional dark theme with purple accents",
    icon: "🌙",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Professional"
  },
  {
    id: 3,
    name: "Cyberpunk",
    bgClass: "bg-black",
    layout: "futuristic",
    buttonClass: "bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-2xl shadow-lg hover:shadow-cyan-400/50",
    containerClass: "text-center p-8 bg-black border-2 border-cyan-400 rounded-3xl shadow-2xl shadow-cyan-400/20",
    description: "Futuristic cyberpunk neon design",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",
    category: "Modern"
  },
  {
    id: 4,
    name: "Nature Zen",
    bgClass: "bg-gradient-to-br from-green-100 to-emerald-200",
    layout: "organic",
    buttonClass: "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-200",
    description: "Peaceful nature-inspired zen theme",
    icon: "🌿",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    category: "Nature"
  },
  {
    id: 5,
    name: "Golden Hour",
    bgClass: "bg-gradient-to-br from-orange-200 via-red-200 to-yellow-100",
    layout: "warm",
    buttonClass: "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-200",
    description: "Warm golden hour sunset vibes",
    icon: "🌅",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "Warm"
  },
  {
    id: 6,
    name: "Deep Ocean",
    bgClass: "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100",
    layout: "fluid",
    buttonClass: "bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-200",
    description: "Serene deep ocean blue tones",
    icon: "🌊",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Cool"
  },
  {
    id: 7,
    name: "Aurora",
    bgClass: "bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200",
    layout: "mystical",
    buttonClass: "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200",
    description: "Mystical aurora borealis colors",
    icon: "🌌",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    category: "Premium"
  },
  {
    id: 8,
    name: "Mint Fresh",
    bgClass: "bg-gradient-to-br from-mint-100 via-teal-100 to-cyan-100",
    layout: "fresh",
    buttonClass: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl shadow-lg",
    containerClass: "text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-200",
    description: "Fresh mint and teal combination",
    icon: "🍃",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    category: "Fresh"
  },
  {
    id: 9,
    name: "Glassmorphism",
    bgClass: "bg-gradient-to-br from-white/20 via-white/10 to-transparent",
    layout: "glass",
    buttonClass: "bg-white/20 backdrop-blur-md text-gray-800 rounded-2xl shadow-lg border border-white/30",
    containerClass: "text-center p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30",
    description: "Modern glassmorphism effect",
    icon: "💎",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    category: "Premium"
  }
];