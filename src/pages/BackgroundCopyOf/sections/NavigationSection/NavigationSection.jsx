import { ChevronDownIcon, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../componenets/Welcome/button";
import logo from "../../../../assets/Images/logo.jpg"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../../componenets/Welcome/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../componenets/Welcome/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../componenets/Welcome/select";

export const NavigationSection = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Navigation menu items data with href links
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
    { label: "FAQ's", href: "#faqs" },
  ];

  // Language options
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToStateSelection = () => {
    const stateSection = document.getElementById("state-selection");
    if (stateSection) {
      // Calculate offset for header height (84px)
      const offset = 84;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = stateSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      // Fallback to regular navigation if section not found
      navigate("/signup");
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = window.innerWidth < 768 ? 100 : 84;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    if (isOpen) setIsOpen(false);
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    if (isOpen) setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative w-full h-[84px] flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex flex-shrink-0 cursor-pointer items-center space-x-2" onClick={scrollToTop}>
  <img
    src={logo} // Make sure the path is correct: `public/logo.jpg`
    alt="Logo"
    className="w-10 h-10 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
  />
  <h1 className="font-bold text-xl sm:text-2xl text-blue-900 md:text-4xl">Magnifier</h1>
</div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center">
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="px-4 py-2 text-base tracking-[-0.16px] leading-6 font-normal text-black hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                
                {/* Language Selector */}
                <NavigationMenuItem>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="border-0 bg-transparent hover:bg-transparent focus:ring-0 shadow-none text-base text-[#636363] font-normal px-4 py-2">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-[116px] h-[38px] rounded-[29px] bg-[#ffffffbf] text-black font-medium text-sm tracking-[-0.14px] border-none hover:bg-gray-100"
            >
              Login
            </Button>

            <Button 
            onClick={scrollToStateSelection}
            
              className="w-[116px] h-[38px] rounded-[29px] font-medium text-white text-sm tracking-[-0.14px]  hover:opacity-90"
            >
              Sign up
              <img className="w-[5px] h-2 ml-1" alt="Arrow" src="/vector-3.svg" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
                <SheetTitle className="text-lg font-semibold mb-6 px-3">Menu</SheetTitle>
                <div className="flex flex-col gap-6">
                  {/* Navigation Items */}
                  <nav className="flex flex-col">
                    {navItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="text-lg font-normal text-[#636363] hover:text-[#578cff] transition-colors px-3 py-2"
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        {item.label}
                      </a>
                    ))}
                    
                    {/* Language Menu Item */}
                    <div className="relative">
                      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full text-lg font-normal text-[#636363] hover:text-[#578cff] transition-colors px-3 py-2 border-0 bg-transparent shadow-none">
                          Language
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem 
                              key={lang.value} 
                              value={lang.value}
                              className="text-base"
                            >
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </nav>

                  {/* Auth Buttons */}
                  <div className="flex flex-col gap-3 px-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/login");
                      }}
                      className="w-full h-[38px] rounded-[29px] bg-[#ffffffbf] text-black font-medium text-sm tracking-[-0.14px] border-none hover:bg-gray-100"
                    >
                      Login
                    </Button>

                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        scrollToStateSelection();
                      }}
                      className="w-full h-[38px] rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-900 hover:opacity-90"
                    >
                      Sign up
                      <img className="w-[5px] h-2 ml-1" alt="Arrow" src="/vector-3.svg" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};