import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import styles from './Slider.module.scss';
import { useRef, useEffect } from 'react';
import nextIcon from './../../assets/img/nextSlide.svg';

const Slider = ({ activePoint }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    console.log("activePoint", activePoint)
    if (swiperRef.current) {
      swiperRef.current.slideTo(0); 
    }
  }, [activePoint]); 

  return (
    <div className={styles.slider}>
      <Swiper
        slidesPerView={3}
        spaceBetween={80}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {activePoint.sliderData.map((item, index) => (
          <SwiperSlide key={index}>
            <p className={styles.date}>{item.date}</p>
            <p className={styles.text}>{item.textSlide}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={styles.nextButton} onClick={() => swiperRef.current?.slideNext()}>
        <img src={nextIcon} alt="Next" />
      </button>
    </div>
  );
};

export default Slider;
