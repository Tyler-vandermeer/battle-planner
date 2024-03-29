import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './components/css/main.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);