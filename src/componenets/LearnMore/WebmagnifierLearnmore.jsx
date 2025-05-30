import React from "react";
import image from '../../assets/Images/image-11.png';
import logo from '../../assets/Images/logo.jpg';  // <-- Import your logo here
import { FooterSection } from "../../pages/BackgroundCopyOf/sections/FooterSection/FooterSection";
import { NavigationSection } from "../../pages/BackgroundCopyOf/sections/NavigationSection/NavigationSection";

const WebmagnifierLearnmore = () => {
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
            Web Magnifier
          </h1>
          <p className="text-lg font-bold md:text-2xl text-gray-700 max-w-xl mb-8">
            A smarter social space for political voices
          </p>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mb-8">
            India’s first politics-focused social media platform, designed to revolutionize how citizens, leaders,
            and political organizations engage online. Built with a deep understanding of India’s democratic
            fabric, Web Magnifier provides a dedicated space for transparent dialogue, real-time updates, and
            meaningful political discourse.
          </p>
        </div>
      </section>

      {/* Scroll-down Section (DeepMind style) */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <h2 className="text-4xl md:text-[80px] font-semibold leading-tight mb-6">
          Earn for Every Interaction<br />
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Turn your voice into value. Web Magnifier rewards users for the engagement they generate—
          whether it’s likes, shares, comments, or views. The more impactful your political content, the more
          you earn. It's not just expression—it's empowerment.
        </p>
      </section>

      {/* Image Section */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <div className="max-w-7xl w-full">
          <img
            src={image}
            alt="Project Mariner"
            className="w-full h-auto max-h-[700px] object-contain mx-auto"
          />
        </div>
      </section>

      {/* Pin Posts Section */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <h2 className="text-4xl md:text-[80px] font-semibold leading-tight mb-6">
          Pin Your Most Important Posts<br />
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Make your voice stand out. Web Magnifier lets you pin important posts directly to the main feed,
          giving them higher visibility across the platform. Perfect for critical updates, announcements, or
          campaign highlights.
        </p>
      </section>

      {/* Curated Feed Section */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <h2 className="text-4xl md:text-[80px] font-semibold leading-tight mb-6">
          Curated Feed for Every <br /> Level of Politics
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-16">
          Web Magnifier organizes your feed into three powerful sections—making it easier to stay informed,
          engaged, and active at every level of the political landscape.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl w-full items-start">
          {/* Local */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-64 h-64 bg-blue-900 bg-opacity-30 rounded-2xl flex items-center justify-center mb-6">
              <img src="/path-to-your-local-icon.png" alt="Local Politics" className="h-24" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">For you</h3>
            <p className="text-gray-700">
              View posts specific to your state. Discover what's trending locally, from regional debates to state-level policy discussions and community sentiments.
            </p>
          </div>

          {/* State */}
          <div className="flex flex-col items-center text-center px-4 mt-16 md:mt-20">
            <div className="w-64 h-64 bg-blue-900 bg-opacity-30 rounded-2xl flex items-center justify-center mb-6">
              <img src="/path-to-your-state-icon.png" alt="State Politics" className="h-24" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Local politics</h3>
            <p className="text-gray-700">
              Stay connected to your constituency. This feed focuses on hyperlocal posts, allowing you to engage
              with conversations and issues that directly affect your area.
            </p>
          </div>

          {/* National */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-64 h-64 bg-blue-900 bg-opacity-30 rounded-2xl flex items-center justify-center mb-6">
              <img src="/path-to-your-national-icon.png" alt="National Politics" className="h-24" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">National</h3>
            <p className="text-gray-700">
              Explore all posts from across the country. This section shows a complete, unfiltered stream of
              political content from users nationwide—capturing the pulse of Indian politics at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Voice Posts Section */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <h2 className="text-4xl md:text-[80px] font-semibold leading-tight mb-6">
          Speak Your Mind <br /> with Voice Posts
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Go beyond text—share your opinions, reactions, or updates through voice. Web Magnifier lets you
          post audio clips directly to the feed, making political expression more personal, accessible, and real.
          Perfect for leaders, activists, or anyone who prefers speaking over typing.
        </p>
      </section>

      {/* Chatbot Section */}
      <section className="bg-white text-black flex flex-col items-center justify-start md:justify-center px-6 text-center md:min-h-screen py-12 md:py-0">
        <h2 className="text-4xl md:text-[80px] font-semibold leading-tight mb-6">
          Your Personal Political Chatbot
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Stay informed effortlessly with Web Magnifier’s AI-powered chatbot. Get instant updates on the
          latest news, election results, policy changes, and trending political topics—all through a simple chat
          interface. Your go-to assistant for real-time political insights anytime, anywhere.
        </p>
      </section>

      <FooterSection style={{ backgroundColor: '#f9fafb' }} />

    </div>
  );
};

export default WebmagnifierLearnmore;