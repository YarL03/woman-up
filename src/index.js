import React from 'react';
import ReactDOM from 'react-dom/client';
import './less/index.less';
import App from './App';
import './firebase'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);