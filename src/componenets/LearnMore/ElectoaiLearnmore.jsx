import React from 'react'
import logo from '../../assets/Images/logo.jpg';
import { FooterSection } from '../../pages/BackgroundCopyOf/sections/FooterSection/FooterSection';


const ElectoaiLearnmore = () => {
  return (
    <div className="flex flex-col">
       
             {/* Header with Logo */}
             <header className="w-full bg-white shadow-md text-3xl flex items-center px-6 py-4">
               <img
                 src={logo}
                 alt="Web Magnifier Logo"
                 className="h-12 w-auto"
               /> Magnifier
             </header>
       
             {/* Hero Section */}
             <section className="bg-white flex flex-col items-center justify-start md:justify-center text-center px-4 md:min-h-screen py-12 md:py-0">
               <div className="flex flex-col items-center justify-center text-center px-4">
                 <h1 className="text-5xl md:text-[7.75rem] font-bold text-black mb-6">
                 ElectoAI
                 </h1>
                 <p className="text-lg font-bold md:text-2xl text-gray-700 max-w-2xl mb-8">
             Your AI-powered political chatbot for instant insights and support.
                 </p>
                 <p className="text-lg md:text-xl text-gray-700 max-w-5xl mb-8">
                ElectoAI is an intelligent chatbot designed to assist political leaders, campaigners, and voters with
quick access to information, campaign guidance, and real-time answers. Powered by AI, ElectoAI
makes political engagement easier by providing instant, accurate responses to your questions
anytime, anywhere.

                 </p>
               </div>
             </section>
       <FooterSection/>
   
           </div>
  )
}

export default ElectoaiLearnmore