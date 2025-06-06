
import React from 'react'
import logo from '../../assets/Images/logo.jpg';  // <-- Import your logo here
import { FooterSection } from '../../pages/BackgroundCopyOf/sections/FooterSection/FooterSection';


const VotermagnifierLearnmore = () => {
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
               Voter magnifier
              </h1>
              <p className="text-lg font-bold md:text-2xl text-gray-700 max-w-2xl mb-8">
             A smarter dashboard for voter insights and election analytics.
              </p>
              <p className="text-lg md:text-xl text-gray-700 max-w-5xl mb-8">
               Voter Magnifier is a cutting-edge political dashboard designed to give leaders, parties, and
campaigners deep, data-driven insights into voter behavior and election trends. By analyzing
constituency-wise, year-wise, and election-specific data, it helps users strategize more effectively,
target outreach, and track election results with precision. Whether you’re monitoring voter turnout,
demographic shifts, or past election outcomes, Voter Magnifier equips you with the tools to make
smarter, evidence-based decisions and build stronger connections with your electorate.
              </p>
            </div>
          </section>
    <FooterSection/>

        </div>
  )
}


export default VotermagnifierLearnmore