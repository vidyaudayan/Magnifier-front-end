import React, { useEffect, useState } from 'react';
import { NavigationSection } from '../pages/BackgroundCopyOf/sections/NavigationSection/NavigationSection';
import { FooterSection } from '../pages/BackgroundCopyOf/sections/FooterSection/FooterSection';

const Bulletin = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  // Latest News Banner
  const latestNews = {
    title: "Campus Election Results 2024",
    date: "March 25, 2024",
    excerpt: "Student Progressive Alliance wins majority in student government elections with record voter turnout...",
    image: "https://picsum.photos/1200/600?election"
  };

  // News Categories
//   const newsCategories = ['All', 'Campus Politics', 'National Politics', 'Elections', 'Policy', 'Activism'];

  // News Items (20+ entries)
  const newsItems = [
    { 
      id: 1, 
      category: 'Campus Politics', 
      title: 'Student Government Budget Proposal', 
      date: 'March 28, 2024', 
      excerpt: 'New budget allocates funds for sustainability initiatives...',
      image: 'https://picsum.photos/400/300?budget',
      comments: 18
    },
    { 
      id: 2, 
      category: 'National Politics', 
      title: 'Student Loan Reform Debate', 
      date: 'March 27, 2024', 
      excerpt: 'Congressional committee reviews new education funding bill...',
      image: 'https://picsum.photos/400/300?congress',
      comments: 32
    },
    { 
      id: 3, 
      category: 'Elections', 
      title: 'Youth Voter Registration Drive', 
      date: 'March 26, 2024', 
      excerpt: 'Campus groups aim to register 10,000 new voters...',
      image: 'https://picsum.photos/400/300?vote',
      comments: 25
    },
    { 
      id: 4, 
      category: 'Policy', 
      title: 'New Campus Security Measures', 
      date: 'March 25, 2024', 
      excerpt: 'Controversial surveillance proposal under review...',
      image: 'https://picsum.photos/400/300?security',
      comments: 41
    },
    { 
      id: 5, 
      category: 'Activism', 
      title: 'Climate Strike Draws Thousands', 
      date: 'March 24, 2024', 
      excerpt: 'Students demand action on environmental policies...',
      image: 'https://picsum.photos/400/300?climate',
      comments: 57
    },
    { 
      id: 6, 
      category: 'Campus Politics', 
      title: 'Honor Code Reform Petition', 
      date: 'March 23, 2024', 
      excerpt: 'Student-led initiative gathers 5,000 signatures...',
      image: 'https://picsum.photos/400/300?petition',
      comments: 29
    },
    { 
      id: 7, 
      category: 'National Politics', 
      title: 'Education Secretary Campus Visit', 
      date: 'March 22, 2024', 
      excerpt: 'Discussion on federal education standards...',
      image: 'https://picsum.photos/400/300?secretary',
      comments: 22
    },
    { 
      id: 8, 
      category: 'Policy', 
      title: 'International Student Visa Changes', 
      date: 'March 21, 2024', 
      excerpt: 'New immigration policies affect student community...',
      image: 'https://picsum.photos/400/300?visa',
      comments: 38
    },
    { 
      id: 9, 
      category: 'Activism', 
      title: 'Racial Justice Rally Planned', 
      date: 'March 20, 2024', 
      excerpt: 'March for equity and inclusion scheduled Friday...',
      image: 'https://picsum.photos/400/300?justice',
      comments: 45
    },
    { 
      id: 10, 
      category: 'Elections', 
      title: 'Ballot Measure Town Hall', 
      date: 'March 19, 2024', 
      excerpt: 'Analysis of Proposition 17 education funding...',
      image: 'https://picsum.photos/400/300?townhall',
      comments: 19
    },
    // Additional 10 items
    { 
      id: 11, 
      category: 'Policy', 
      title: 'Campus Free Speech Guidelines', 
      date: 'March 18, 2024', 
      excerpt: 'New policies balance safety and expression...',
      image: 'https://picsum.photos/400/300?speech',
      comments: 33
    },
    { 
      id: 12, 
      category: 'National Politics', 
      title: 'Student Debt Relief Expansion', 
      date: 'March 17, 2024', 
      excerpt: 'White House proposes new forgiveness plan...',
      image: 'https://picsum.photos/400/300?debt',
      comments: 48
    },
    { 
      id: 13, 
      category: 'Activism', 
      title: 'Labor Rights Teach-In', 
      date: 'March 16, 2024', 
      excerpt: 'Organizing campus workers unionization efforts...',
      image: 'https://picsum.photos/400/300?labor',
      comments: 27
    },
    { 
      id: 14, 
      category: 'Campus Politics', 
      title: 'Tuition Freeze Proposal', 
      date: 'March 15, 2024', 
      excerpt: 'Board of trustees considers 3-year tuition freeze...',
      image: 'https://picsum.photos/400/300?tuition',
      comments: 39
    },
    { 
      id: 15, 
      category: 'Elections', 
      title: 'Voter Registration Deadline', 
      date: 'March 14, 2024', 
      excerpt: 'Last day to register for primary elections...',
      image: 'https://picsum.photos/400/300?deadline',
      comments: 15
    },
    { 
      id: 16, 
      category: 'Policy', 
      title: 'Campus Police Reform', 
      date: 'March 13, 2024', 
      excerpt: 'Task force recommends new community safety model...',
      image: 'https://picsum.photos/400/300?police',
      comments: 52
    },
    { 
      id: 17, 
      category: 'National Politics', 
      title: 'Supreme Court Hears Affirmative Action Case', 
      date: 'March 12, 2024', 
      excerpt: 'Landmark decision could impact admissions...',
      image: 'https://picsum.photos/400/300?court',
      comments: 63
    },
    { 
      id: 18, 
      category: 'Activism', 
      title: 'Fossil Fuel Divestment Protest', 
      date: 'March 11, 2024', 
      excerpt: 'Students demand endowment policy changes...',
      image: 'https://picsum.photos/400/300?divest',
      comments: 41
    },
    { 
      id: 19, 
      category: 'Campus Politics', 
      title: 'New Student Senate Leadership', 
      date: 'March 10, 2024', 
      excerpt: 'First-generation student elected as president...',
      image: 'https://picsum.photos/400/300?senate',
      comments: 28
    },
    { 
      id: 20, 
      category: 'Policy', 
      title: 'Mental Health Funding Increase', 
      date: 'March 9, 2024', 
      excerpt: 'University allocates $2M for counseling services...',
      image: 'https://picsum.photos/400/300?health',
      comments: 37
    }
  ];

  // Upcoming Events
  const events = [
    { 
      id: 1, 
      date: 'March 29, 2024', 
      title: 'Policy Hackathon', 
      time: '9:00 AM', 
      location: 'Innovation Center', 
      type: 'Competition'
    },
    { 
      id: 2, 
      date: 'March 30, 2024', 
      title: 'Civil Rights Symposium', 
      time: '2:00 PM', 
      location: 'History Building', 
      speaker: 'Rep. John Lewis Jr.'
    },
    { 
      id: 3, 
      date: 'April 1, 2024', 
      title: 'Budget Town Hall', 
      time: '6:00 PM', 
      location: 'Student Union', 
      type: 'Finance'
    }
  ];

  // Announcements
  const announcements = [
    { 
      title: 'Voter Registration Deadline', 
      date: 'March 30', 
      priority: 'high', 
      content: 'Last day to register for state primary elections' 
    },
    { 
      title: 'Election Volunteers Needed', 
      date: 'March 28', 
      priority: 'medium', 
      content: 'Help staff campus polling stations' 
    },
    { 
      title: 'Policy Paper Competition', 
      date: 'March 27', 
      priority: 'low', 
      content: 'Submit by April 15 for cash prizes' 
    }
  ];

  // Political Leadership
  const leadership = [
    {
      name: "Alexandra Chen",
      position: "Student Body President",
      party: "Progressive Alliance",
      image: "https://picsum.photos/100/100?leader1"
    },
    {
      name: "Jordan Miller",
      position: "Academic Affairs Chair",
      party: "Independent",
      image: "https://picsum.photos/100/100?leader2"
    }
  ];


  return (
    <div className="min-h-screen flex flex-col">
   <header className="bg-white shadow-sm">
        <NavigationSection />
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Campus Bulletin</h1>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Latest News Banner */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={latestNews.image} alt="Latest News" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-blue-600 font-medium">Breaking News</span>
                <span className="text-sm text-gray-500">{latestNews.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{latestNews.title}</h2>
              <p className="text-gray-600">{latestNews.excerpt}</p>
              <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                Read Full Story →
              </button>
            </div>
          </div>
        </section>

        {/* News Categories
        <div className="flex flex-wrap gap-2 mb-8">
          {newsCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .map(item => (
              <article key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <img src={item.image} alt="" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-blue-600 font-medium">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-blue-600 font-medium hover:text-blue-800">
                      Read More →
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>💬 {item.comments}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* Leadership Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Leadership</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <img src={leader.image} alt={leader.name} className="w-20 h-20 rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
                    <p className="text-gray-600">{leader.position}</p>
                    <p className="text-sm text-blue-600 mt-1">{leader.party}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events & Announcements */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-16 flex-shrink-0">
                      <div className="text-center bg-blue-600 text-white p-2 rounded-lg">
                        <div className="text-sm font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs">
                          {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                      {event.speaker && <p className="text-sm text-gray-500 mt-1">Speaker: {event.speaker}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  announcement.priority === 'high' 
                  ? 'border-red-500 bg-red-50' 
                  : announcement.priority === 'medium' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-500 bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    </div>
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

       <footer className="bg-white text-white mt-12">
        <FooterSection />
        {/* <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2024 Campus Bulletin. All rights reserved.</p>
        </div> */}
      </footer>

    
    </div>
  );
};

export default Bulletin;