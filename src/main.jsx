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
