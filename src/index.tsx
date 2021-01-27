import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './components/App/index';
import ThemeProvider from './providers/ThemeProvider';
import LoadingProvider from './providers/LoadingProvider';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

