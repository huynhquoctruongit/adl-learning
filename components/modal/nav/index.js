import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
SwiperCore.use([Pagination]);
SwiperCore.use([Autoplay]);
const Navbars = ({ data = [], onChange, active }) => {
  return (
    <Swiper
      className="mySwiper pb-3 "
      slidesPerGroupSkip={1}
      slidesPerView={'auto'}
      navigation={false}
      centeredSlides={false}
    >
      {data.map((item, index) => {
        const classActive = active === index ? ' border-blue-900 border-opacity-90' : 'border-transparent';
        return (
          <SwiperSlide key={item.id} accessKey={item.id}>
            <div
              onClick={() => {
                if (onChange) onChange(index);
              }}
              className={`border-b-4 pb-2 hover:border-blue-900 hover:border-opacity-90 mx-5 first:ml-0 last:mr-10 transition-colors duration-200 ease-linear hover:cursor-pointer w-fit ${classActive}`}
            >
              {item.name}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
export default Navbars;
