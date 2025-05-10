import "./firebase.js"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import Root from './routes/root';
import {store} from './app/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../src/app/store.js'

import ErrorPage from './error-page';
import { useEffect,useState } from 'react';
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
import UserGuidelines from '../src/pages/BackgroundCopyOf/Terms&Condition/UserGuidelines.jsx';
import TermsAndConditions from '../src/pages/BackgroundCopyOf/Terms&Condition/Terms-condition.jsx';
import ProfilePage from './pages/profile.jsx';
import PostDisplayPage from './pages/PostDisplayPage.jsx';
import LoginForm from './componenets/LoginForm.jsx';
import LoginFormShare from './componenets/LoginShare.jsx';
import SearchUserPost from './componenets/SearchUserPost.jsx';
import ProfilePageNew from './pages/ProfileNew.jsx';
import SettingsPage from './pages/Settings.jsx';
import ProfilePageUsers from './pages/ProfileUsers.jsx';
import LoginJob from './componenets/Loginjob.jsx';

import PaymentPage from './pages/Paymentpage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import SearchResults from './pages/SearchResults.jsx';

import RetryPaymentPage from './pages/RetryPayment.jsx';
import SharedPostRedirect from './componenets/SharedPostRedirect.jsx';
import UserPostDisplay from './pages/UserPostsDisplay.jsx';
import AllPostsPage from './componenets/AllPostsPage.jsx';
import Livefeed from './LivefeedPages/Livefeed.jsx';
import Notifications from './LivefeedPages/Notifications.jsx';
import Profile from './LivefeedPages/Profile.jsx';
import ElectoAI from './LivefeedPages/ElectoAI.jsx';
import ProfileNew from './LivefeedPages/ProfileNew.jsx';
import SearchPage from './LivefeedPages/SearchPage.jsx';
import { BackgroundCopyOf } from './pages/BackgroundCopyOf/sections/BackgroundCopyOf.jsx';
import { DelhiSignUpPage } from './pages/SignUpPage/DelhiSignupPage.jsx';
import { BiharSignUpPage } from './pages/SignUpPage/BiharSignUpPage.jsx';
import { BengalSignUpPage } from './pages/SignUpPage/BengalSignUpPage.jsx';
import { LoginPage } from './pages/LoginPage/LoginPage.jsx';
import { VerifyPage } from './pages/VerifyPage/VerifyPage.jsx';
import { MainContentSection } from './pages/BackgroundCopyOf/sections/MainContentSection/MainContentSection.jsx';
import { InfoSection } from './pages/BackgroundCopyOf/sections/InfoSection/InfoSection.jsx';
import { FeatureSection } from './pages/BackgroundCopyOf/sections/FeatureSection/FeatureSection.jsx';
import { DashboardSection } from './pages/BackgroundCopyOf/sections/DashboardSection/DashboardSection.jsx';
import UsersProfilePage from './LivefeedPages/UsersProfilePage.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import SearchPostDisplayPage from './LivefeedPages/SearchPostDisplayPage.jsx';
import PricingPage from './LivefeedPages/PricingPage.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element:<BackgroundCopyOf/>,
      },
      {
        path: "/welcome",
        element:<WelcomeNew/>,
      },
      {
        path: "/signup/delhi",
        element:<DelhiSignUpPage/>,
      },
      {
        path: "/signup/bihar",
        element: <BiharSignUpPage />,
      },
      {
        path: "/signup/west-bengal", 
        element: <BengalSignUpPage />,
      },
      {
        path: "/login",
        element:<LoginPage/>,
      },
      {
        path: "/verify",
        element:<VerifyPage/>,
      },
      
      
      {
        path: "/signup/olddelhi",
        element:<AuthDelhi/>,
      },
      {
        path: "/signup/oldbihar",
        element:<AuthBihar/>,
      },
      {
        path: "/signup/oldwest bengal",
        element:<AuthBengal/>,
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
      {/*{
        path: "/post/:postId",  
        element: <SharedPostRedirect />,
      },*/},
      {
        path: "/aboutus",
        element:<AboutUsPage/>,
      },
      {
        path: "/dashboard",
        element:<Dashboard/>,
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
        path: "/user-guidelines",
        element:<UserGuidelines/>,
      },
      {
        path: "/pro",
        element:<ProfileNew/>,

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
        path: "/terms-condition",
        element:<TermsAndConditions/>,
      },

      {
        path: "/features",
        element:<MainContentSection/>,
      },
      {
        path: "/contact",
        element:<InfoSection/>,
      },
      {
        path: "/faq",
        element:<FeatureSection/>,
      },
      {
        path: "/service",
        element:<DashboardSection/>,
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
        path:"/pricingold",
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
        path:"/s",
        element:<SearchResults/>
      },
      
      {
        path:"/livefeed/*",
        element:<Livefeed/>,

        children:[
          {
            path: "userprofile/:userId",
            element:<UsersProfilePage/>,
    
          },

          {
            path:"notifications",
            element:<Notifications/>
          },
          {
            path:"electoai",
            element:<ElectoAI/>
          },
          {
            path: "searchpost/:postId",  
            element: <SearchPostDisplayPage />,
          },
          {
            path:"search",
            element:<SearchPage/>
          },
         
          {
            path:"pricing",
            element:<PricingPage/>
          },
         
          {
            path:"settings",
            element:<SettingsPage/>
          },
         
          {
            path:"profile",
            element:<ProfileNew/>
          },
         
         
        ],
      },
      
     
     
     
     
     
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
<LanguageProvider>
 <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
  <StrictMode>
 <RouterProvider router={router} />
  </StrictMode>,
  </PersistGate>
  </Provider>,
  </LanguageProvider>
  </ThemeProvider>
)
