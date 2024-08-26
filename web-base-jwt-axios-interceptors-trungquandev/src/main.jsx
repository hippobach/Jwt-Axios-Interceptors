import App from './App.jsx';

import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';

// Config react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-left" theme="colored" />
  </BrowserRouter>
);
