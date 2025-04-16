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
import AuthDelhi from './pages/NewDelhiAuthPage.jsx';
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
import UserGuidelines from './componenets/UserGuidelines.jsx';
import TermsAndConditions from './componenets/TermsandConditions.jsx';
import ProfilePage from './pages/profile.jsx';
import PostDisplayPage from './pages/PostDisplayPage.jsx';
import LoginForm from './componenets/LoginForm.jsx';
import LoginFormShare from './componenets/LoginShare.jsx';
import SearchUserPost from './componenets/SearchUserPost.jsx';
import ProfilePageNew from './pages/ProfileNew.jsx';
import SettingsPage from './pages/Settings.jsx';
import ProfilePageUsers from './pages/ProfileUsers.jsx';
import LoginJob from './componenets/Loginjob.jsx';
import PricingPage from './pages/Pricing.jsx';
import PaymentPage from './pages/Paymentpage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import SearchResults from './pages/SearchResults.jsx';
import { Sidebar } from 'lucide-react';
import RetryPaymentPage from './pages/RetryPayment.jsx';
import SharedPostRedirect from './componenets/SharedPostRedirect.jsx';
import UserPostDisplay from './pages/UserPostsDisplay.jsx';
import AllPostsPage from './componenets/AllPostsPage.jsx';
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
        path: "/login",
        element:<LoginForm/>,
      },
      {
        path: "/joblogin",
        element:<LoginJob/>,
      },
     
      {
        path: "/loginshare",
        element:<LoginFormShare/>,
      },
      {
        path: "/job-application",
        element:<Jobapplication /> ,
      },
      {
        path: "/verification",
        element:<VerificationPage /> ,
      },
     
     
      {
        path: "/landing",
        element:<LandingPage/>,
      },
      {
        path: "/posts",
        element:<LandingPage/>,
      },
      {
        path: "/displaypost",
        element: <PrivateRoute>
        <PostDisplayPage />
      </PrivateRoute>,
      },
      {
        path: "/posts",
        element: <AllPostsPage />, 
      },
      {
        path: "/post/:postId",  
        element: <SharedPostRedirect />,
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
        path: "/userguidelines",
        element:<UserGuidelines/>,
      },
      {
        path: "/profile",
        element:<ProfilePageNew/>,

      },
      {
        path: "/profile/:userId",
        element:<ProfilePageUsers/>,

      },


      {
        path: "/user/:userId/posts",
        element:<SearchUserPost/>,
      },
     
      {
        path: "/userposts",
        element: (
          <PrivateRoute>
            <UserPostDisplay/>  
          </PrivateRoute>
        ),
      },
      {
        path: "/termsandconditions",
        element:<TermsAndConditions/>,
      },
     
      {
        path: "/forgot-password",
        element:<ForgotPassword/>,
      },
      {
        path: "/reset-password/:token",
        element:<ResetPassword/>,
      },
      {
        path: "/reset-password/:token",
        element:<ResetPassword/>,
      },
      {
        path: "/settings",
        element:<SettingsPage/>,
      },
      {
        path:"/pricing",
        element:<PricingPage/>
      },
      {
        path:"/payment",
        element:<PaymentPage/>
      },
      {
        path:"/success",
        element:<PaymentSuccess/>
      },
      {
        path:"/retry-payment",
        element:<RetryPaymentPage/>
      },
      {
        path:"/search",
        element:<SearchResults/>
      },
      {
        path:"/sidebar",
        element:<Sidebar/>
      }
     
     
     
     
     
     
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
