import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import Root from './routes/root';
import store from './app/store'
import { Provider } from 'react-redux'

import ErrorPage from './error-page';

import WelcomeNew from './componenets/WelcomeNew.jsx';

import DelhiSignup from './componenets/DelhiSignup.jsx'
import Jobapplication from './componenets/Jobapplication.jsx';
import AuthDelhi from './pages/delhiAuthPage.jsx';
import AuthBihar from './pages/bihar.jsx';
import AuthBengal from './pages/bengal.jsx';
import PrivateRoute from './componenets/PrivateRoute.jsx';
import LandingPage from './pages/Landing.jsx';
import AboutUsPage from './componenets/AboutUs.jsx';
import Dashboard from './componenets/Dashboard.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import ContactForm from './componenets/ContactUs.jsx';
import Support from './componenets/Support.jsx';
import FAQ from './componenets/FAQ.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element:<WelcomeNew/>,
      },
      
      {
        path: "/signup/delhi",
        element:<AuthDelhi/>,
      },
      {
        path: "/signup/bihar",
        element:<AuthBihar/>,
      },
      {
        path: "/signup/west bengal",
        element:<AuthBengal/>,
      },
      {
        path: "/job-application",
        element:<PrivateRoute><Jobapplication /></PrivateRoute> ,
      },
     
      {
        path: "/landing",
        element:<LandingPage/>,
      },
      {
        path: "/aboutus",
        element:<AboutUsPage/>,
      },
      {
        path: "/dashboard",
        element:<Dashboard/>,
      },
      {
        path: "/contact",
        element:<ContactForm/>,
      },
      
      {
        path: "/support",
        element:<Support/>,
      },
      {
        path: "/faq",
        element:<FAQ/>,
      },
     
      {
        path: "/forgot-password",
        element:<ForgotPassword/>,
      },
      {
        path: "/reset-password/:token",
        element:<ResetPassword/>,
      },
     
     
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
 <RouterProvider router={router} />
  </StrictMode>,
  </Provider>,
)
