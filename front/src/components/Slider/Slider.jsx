import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import styles from './Slider.module.scss';
import { useRef, useEffect } from 'react';
import nextIcon from './../../assets/img/nextSlide.svg';
import { useWindowWidth } from '../../hooks/hooks';

const Slider = ({ activePoint }) => {
  const swiperRef = useRef(null);// реф на слайдер
  const windowWidth = useWindowWidth(); // кастомный хук на определение ширины экрана
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0); 
    }
  }, [activePoint]); // при пирилистывание сбрасывание слайдера на 1 слайд


  return (
    <div className={styles.slider}>
      <Swiper
        slidesPerView={windowWidth > 990 ? 3 : 2}
        spaceBetween={windowWidth > 990 ? 80 : 60}
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
