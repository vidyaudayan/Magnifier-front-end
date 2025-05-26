import React, { useState, useEffect, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { MdArrowOutward } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

const defaultConfig = {
  slideWidth: 0,
  slideHeight: 400,
  gap: 20,
  visibleSlides: 1,
  textSize: {
    title: 'text-sm',
    subtitle: 'text-xs',
    button: 'text-xs'
  },
  padding: {
    x: 'px-4',
    y: 'py-4'
  },
  spacing: {
    sliderBottom: 'mb-2',
    navBottom: 'mb-4'
  }
};


const Slider = () => {
const navigate=useNavigate()

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const getConfig = (containerWidth) => {
    if (!containerWidth) return defaultConfig;

    if (containerWidth < 640) {
      return {
        ...defaultConfig,
        slideWidth: containerWidth - 40,
        slideHeight: 400,
        gap: 20,
        visibleSlides: 1,
        textSize: {
          title: 'text-sm',
          subtitle: 'text-xs',
          button: 'text-xs'
        },
        padding: {
          x: 'px-4',
          y: 'py-4'
        },
        spacing: {
          sliderBottom: 'mb-2',
          navBottom: 'mb-4'
        }
      };
    }
    if (containerWidth < 1024) {
      return {
        ...defaultConfig,
        slideWidth: containerWidth - 80,
        slideHeight: 500,
        gap: 30,
        visibleSlides: 1,
        textSize: {
          title: 'text-base',
          subtitle: 'text-sm',
          button: 'text-sm'
        },
        padding: {
          x: 'px-6',
          y: 'py-6'
        },
        spacing: {
          sliderBottom: 'mb-4',
          navBottom: 'mb-6'
        }
      };
    }
    return {
      ...defaultConfig,
      slideWidth: 1200,
      slideHeight: 700,
      gap: 80,
      visibleSlides: 3,
      textSize: {
        title: 'text-[24px]',
        subtitle: 'text-[14px]',
        button: 'text-[20px]'
      },
      padding: {
        x: 'px-[50px]',
        y: 'py-[72px]'
      },
      spacing: {
        sliderBottom: 'mb-6',
        navBottom: 'mb-8'
      }
    };
  };

  const [config, setConfig] = useState(defaultConfig);
  const { 
    slideWidth, 
    slideHeight, 
    gap, 
    visibleSlides, 
    textSize = {}, 
    padding = {}, 
    spacing = {} 
  } = config;

  const originalSlides = [
    { id: 1, content: 'Web Magnifier', image: '../src/assets/Images/image-11.png',loginURL:'/login',learnmoreURL:'/webmagnifierlearnmore' },
    { id: 2, content: 'ElectoAI', image: '../src/assets/Images/image-11.png',loginURL:'/login',learnmoreURL:'/electoailearnmore' },
    { id: 3, content: 'Voter Magnifier', image: '../src/assets/Images/image-11.png',loginURL:'/login',learnmoreURL:'/votermagnifierlearnmore' },
    { id: 4, content: 'Media Magnifier', image: '../src/assets/Images/image-11.png',loginURL:'/login',learnmoreURL:'/mediamagnifierlearnmore' },
  ];

  const slides = [
    originalSlides[originalSlides.length - 2],
    originalSlides[originalSlides.length - 1],
    ...originalSlides,
    originalSlides[0],
    originalSlides[1],
  ];

  const [currentIndex, setCurrentIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const transitionEnabled = useRef(true);
  const currentIndexRef = useRef(currentIndex);
  const isAnimatingRef = useRef(isAnimating);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    isAnimatingRef.current = isAnimating;
  }, [currentIndex, isAnimating]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        setConfig(getConfig(width));
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateDimensions();
    return () => resizeObserver.disconnect();
  }, []);

  const getTransformValue = () => {
    if (visibleSlides === 1) {
      return -currentIndex * (slideWidth + gap) + (containerWidth - slideWidth) / 2;
    }
    const slideWithGap = slideWidth + gap;
    const centerPosition = (containerWidth - slideWidth) / 2;
    return -currentIndex * slideWithGap + centerPosition;
  };

  const goToIndex = (index, smooth = true) => {
    if (isAnimatingRef.current) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    transitionEnabled.current = smooth;
  };

  const handleNext = () => goToIndex(currentIndexRef.current + 1);

  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsAnimating(false);
      if (currentIndex === 1) {
        transitionEnabled.current = false;
        setCurrentIndex(originalSlides.length + 1);
      } else if (currentIndex === slides.length - 2) {
        transitionEnabled.current = false;
        setCurrentIndex(2);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('transitionend', handleTransitionEnd);
      return () => slider.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, slides.length, originalSlides.length]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.style.transition = transitionEnabled.current
      ? 'transform 0.5s ease-in-out'
      : 'none';
    sliderRef.current.style.transform = `translateX(${getTransformValue()}px)`;
  }, [currentIndex, slideWidth, gap, visibleSlides]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimatingRef.current) {
        handleNext();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => goToIndex(index + 2);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full bg-white overflow-x-visible pt-4 sm:pt-6 lg:pt-10">
      <div 
        className={`relative w-full overflow-hidden ${spacing.sliderBottom || ''}`}
        style={{ height: `${slideHeight}px` }}
      >
        <div
          ref={sliderRef}
          className="flex absolute"
          style={{
            gap: `${gap}px`,
            width: `${slides.length * (slideWidth + gap)}px`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={`flex-shrink-0 relative text-white font-bold 
                 border-black rounded-2xl ${padding.x || ''} ${padding.y || ''}
                bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden 
                shadow-md transition-all duration-300`}
              style={{ 
                width: `${slideWidth}px`, 
                height: `${slideHeight}px` 
              }}
            >
              <div className="relative h-full z-20">
                {/* Top content section */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 relative z-30">
                  <div className="flex flex-col text-black">
                    <p className={`${textSize.subtitle || ''} font-bold leading-tight`}>
                      {slide.content}
                    </p>
                    <h1 className={`${textSize.title || ''} font-medium leading-tight mt-1 sm:mt-2`}>
                      Lorem ipsum dolor sit amet consectetur, <br className="hidden sm:block" />
                      adipisicing elit. Consectetur, expedita
                    </h1>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-around gap-0 sm:gap-6'>
  {/* Discover button with hover effect */}
  <div 
  className="my-2 sm:my-auto lg:my-14 flex items-center cursor-pointer group"
  onClick={() => navigate(slide.loginURL)} // Added click handler
>
  <div className="flex items-center bg-blue-600 rounded-full h-10 pl-4 pr-2 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
    <p className={`${textSize.button || ''} text-white font-medium`}>
      Discover
    </p>
    <div className="ml-2  rounded-full h-6 w-6 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
      <IoIosArrowForward className='text-white' />
    </div>
  </div>
</div>

  {/* Learn More button with underline effect */}
  <div className="my-2 sm:my-auto lg:my-14 flex items-center cursor-pointer group"
  onClick={() => navigate(slide.learnmoreURL)}>
    <div className="flex items-center rounded-full">
      <p className={`${textSize.button || ''} text-black font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 group-hover:after:w-full`}>
        Learn more
      </p>
      <div className="ml-2 bg-white rounded-full h-6 w-6 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
        <MdArrowOutward className='text-black' />
      </div>
    </div>
  </div>
</div>
                </div>
                
                {/* Image positioned absolutely at bottom */}
                <div className="absolute bottom-[-85px] left-4 right-4 z-10">
                  <img src={slide.image} alt="" className="w-full h-auto rounded-xl sm:rounded-2xl" />
                </div>
              </div>
            </div>
          ))} 
        </div>
      </div>
      <div className={`flex justify-center space-x-2 sm:space-x-3 ${spacing.navBottom || ''} mt-[0px]`}>
        {originalSlides.map((slide, index) => {
          const isActive = index === (currentIndex - 2 + originalSlides.length) % originalSlides.length;
          return (
            <span
              key={slide.id}
              onClick={() => !isAnimating && handleDotClick(index)}
              className={`cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-black font-medium' : 'text-gray-500 hover:text-gray-700'
              } ${isAnimating ? 'opacity-50' : ''}`}
            >
              {slide.content}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;