import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import AuthContextProvider from './AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
        <App />
      <ToastContainer 
      position='bottom-center'
      autoClose={1000}
      closeButton={false}
      />
    </AuthContextProvider>
      </BrowserRouter>
)
