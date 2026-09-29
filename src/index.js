import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Entry point: mounts the React app into <div id="root"> from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
