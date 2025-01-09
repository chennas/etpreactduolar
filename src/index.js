// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Change here
import App from './App';
import '../src/styles/index.css';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
