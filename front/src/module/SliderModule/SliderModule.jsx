import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Layout from "../../components/Layout/Layout";
import styles from "./SliderModule.module.scss";
import Slider from "../../components/Slider/Slider";
import { ReactComponent as ButtonSlider } from "./../../assets/img/buttonSlider.svg";
import { ReactComponent as PhoneButton } from "./../../assets/img/phoneButton.svg";
import { Sliderdata } from "./sliderTestData";
import { useWindowWidth } from "../../hooks/hooks";
import Dots from "../../components/Dots/Dots";
import Polygon from "../../UI/Polygon/Polygon";
function SliderModule() {
    const [points] = useState(Sliderdata); // Массив точек (Имитируем что он пришел с API)
    const windowWidth = useWindowWidth(); // Кастомный хук для определения ширины экрана
    const circleRef = useRef(null); // Реф на круг
    const sliderRef = useRef(null); // реф на слайдер
    const nameSlidePhoneRef = useRef(null); // реф на название слайдера на мобилках
    const pointRefs = useRef([]); // массив рефов на точки
    const [activePoint, setActivePoint] = useState(points[0]); // Активная точка
    const [animatedStart, setAnimatedStart] = useState(points[0].startDate); // Анимированный старт
    const [animatedEnd, setAnimatedEnd] = useState(points[0].endDate);// Анимированный конец
    const [activeSlide, setActiveSlide] = useState(false); // Состояние поворота
    const radius = windowWidth > 990 ? 265 : 190; // Радиус круга
    const center = windowWidth > 990 ? 265 : 190; // Центр круга(вдруг не круг будет :)
    const pointSize = 8; // Размер точки
    const activeSize = 60; // Размер активной точки
    const baseRotation = 30; // Базовый угол поворота

   
    //! Начало анимации
    useEffect(() => {
        gsap.set(circleRef.current, { rotate: baseRotation }); // Поворот круга начальный
        pointRefs.current.forEach((el, index) => {
            if (el) {
                const angle = (index / points?.length) * 360 - baseRotation; 
                gsap.set(el, { rotate: angle });
            }
        }); // Смещение всех точек чтобы изначально смотрели в центр
        gsap.fromTo(
            pointRefs.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        ); // Появление всех точек
    }, []);
    
    
    //!Функция нажатия на точку
    const handleClick = (point) => {
        if (point?.id === activePoint?.id) return;
        animateNumbers(activePoint?.startDate, point?.startDate, setAnimatedStart);//Анимация чесел
        animateNumbers(activePoint?.endDate, point?.endDate, setAnimatedEnd);//Анимация чесел
        setActivePoint(point);//установка активной точки
        setActiveSlide(true);//состояние поворота
        const circleRotation = -((point?.id - 1) * (360 / points.length)) + baseRotation;//вычисления угла поворота
        
        //! Поворот круга
        gsap.to(circleRef.current, {
            rotate: circleRotation,
            duration: 0.5,
        });
        
        //! Поворот текста внутри круга и названия
        gsap.to(pointRefs.current[point.id - 1], {
            rotate: -circleRotation,
            scale: 1.1,
        });

        //! Появление текста
        gsap.fromTo([sliderRef.current, nameSlidePhoneRef.current], { opacity: 0 }, { opacity: 1, duration: 0.75 });

        //! Сброс состояния поворота
        setTimeout(() => {
            setActiveSlide(false);
        }, 750);
    };

    //!Функция при наведении на точку
    const handleHover = (index) => {
        index !== activePoint?.id - 1 && gsap.to(pointRefs.current[index], {
            scale: 1.5,
            duration: 0.2,
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
        });
    };

    //!Функция при mouseout c точки
    const handleHoverOut = (index) => {
        gsap.to(pointRefs.current[index], {
            scale: 1,
            duration: 0.2,
            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
        });
    };

     //! Функция получения координат точки
     const getCoordinates = (index, isActive) => {
        const angle = (index / points?.length) * (2 * Math.PI) - Math.PI / 2;
        const sizeOffset = isActive ? activeSize / 2 : pointSize / 2;
        const x = center + radius * Math.cos(angle) - sizeOffset;
        const y = center + radius * Math.sin(angle) - sizeOffset;
        return { x, y };
    };

    //!Функция анимации чисел
    const animateNumbers = (from, to, setState) => {
        let current = from;
        const step = Math.max(1, Math.abs(to - from) / 20);

        const updateNumber = () => {
            if (current !== to) {
                current += current < to ? step : -step;
                if ((current < to && current + step > to) || (current > to && current - step < to)) {
                    current = to;
                }
                setState(Math.round(current));
                requestAnimationFrame(updateNumber);
            }
        };
        requestAnimationFrame(updateNumber);
    };

    //!Функция нажатия на точку
    const clickPoint = (direction) => {
        const index = points.findIndex((point) => point?.id === activePoint?.id);
        if (direction === "prew") {
            const prevIndex = index === 0 ? points?.length - 1 : index - 1;
            handleClick(points[prevIndex]);
        } else if (direction === "next") {
            const nextIndex = index === points?.length - 1 ? 0 : index + 1;
            handleClick(points[nextIndex]);
        }
    };

    return (
        <Layout>
            <section className={styles.SliderModule}>
                <div className={styles.titleCont}>
                    <p>Исторические <br /> даты</p>
                </div>
                <div className={styles.circle} ref={circleRef}>
                    {points?.map((point, index) => {
                        const isActive = activePoint.id === point.id;
                        const { x, y } = getCoordinates(index, isActive);
                        return (
                            <div
                                key={point.id}
                                ref={(el) => (pointRefs.current[index] = el)}
                                className={isActive ? styles.pointActive : styles.point}
                                style={{ left: `${x}px`, top: `${y}px` }}
                                onClick={() => handleClick(point)}
                                onMouseEnter={() => handleHover(index)}
                                onMouseLeave={() => handleHoverOut(index)}
                            >
                                {isActive && 
                                    <div>
                                        {!activeSlide && <span className={styles.pointText}>{point?.name}</span>}
                                        <p>{point?.id}</p>
                                    </div>
                                }
                            </div>
                        );
                    })}
                </div>
                <div className={styles.dateContainer}>
                    <div className={styles.dateStart}>
                        <p>{animatedStart}</p>
                    </div>
                    <div className={styles.dateEnd}>
                        <p>{animatedEnd}</p>
                    </div>
                </div>
                <div className={styles.sliderContainer}>
                    <p className={styles.nameSlidePhone} ref={nameSlidePhoneRef} >{activePoint?.name}</p>
                    <span className={styles.line}></span>
                    <div className={styles.sliderContainerPickerDate}>
                        <p>0{activePoint?.id} / 0{points?.length}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={() => clickPoint("prew")}><ButtonSlider/></button>     
                        <button onClick={() => clickPoint("next")}><ButtonSlider/></button>        
                    </div>
                    <div ref={sliderRef}>
                        <Slider activePoint={activePoint}/>
                    </div>
                    <div className={styles.sliderContainerButtonPhone}>
                        <div className={styles.sliderContainerButtonPhoneInner}>
                            <div className={styles.sliderContainerPickerPhone}>
                                <p>0{activePoint?.id} / 0{points?.length}</p>
                            </div>
                            <div className={styles.buttonContainerPhone}>
                                <button onClick={() => clickPoint("prew")}><PhoneButton/></button>     
                                <button onClick={() => clickPoint("next")}><PhoneButton/></button>        
                            </div>
                        </div>
                       <Dots activePoint={activePoint} points={points} handleClick={handleClick}/>
                    </div>
                </div>
                    <Polygon/>
            </section>
        </Layout>
    );
}

export default SliderModule;
