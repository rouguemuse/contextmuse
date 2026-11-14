import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { initObservability } from '@/lib/observability';
import '@/index.css';

initObservability();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
