import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import delhiMap from '../assets/Images/delhi.jpg';
import biharMap from '../assets/Images/bihar.jpg';
import bengalMap from '../assets/Images/westbengal.jpg';


const ImageCarousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: true,
      pauseOnHover: true,
    };
  
    const images = [
      { name: "Delhi", src: delhiMap },
      { name: "Bihar", src: biharMap },
      { name: "West Bengal", src: bengalMap },
    ];
  
    return (
      <div className="w-full h-[400px] p-2 overflow-hidden">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.src} alt={image.name} className="w-full h-[400px] object-cover" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                <h2 className="text-xl font-semibold">{image.name}</h2>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default ImageCarousel;
  