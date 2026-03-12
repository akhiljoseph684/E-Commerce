import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import AuthContextProvider from './AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId='758062384142-0qtaofhuml3dil309c68bgtagnmdqvcb.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
      <ToastContainer 
      position='bottom-center'
      autoClose={1000}
      closeButton={false}
      />
    </AuthContextProvider>
      </BrowserRouter>
)
