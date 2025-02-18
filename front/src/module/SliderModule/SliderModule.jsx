import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Layout from "../../components/Layout/Layout";
import styles from "./SliderModule.module.scss";
import Slider from "../../components/Slider/Slider";
import { ReactComponent as ButtonSlider } from "./../../assets/img/buttonSlider.svg";
import { Sliderdata } from "./sliderTestData";
function SliderModule() {
    const [points] = useState(Sliderdata);
    const circleRef = useRef(null);
    const textRef = useRef(null);
    const [activePoint, setActivePoint] = useState(points[1]);
    const [animatedStart, setAnimatedStart] = useState(points[1].startDate);
    const [animatedEnd, setAnimatedEnd] = useState(points[1].endDate);
    const pointRefs = useRef([]);
    const [activeSlide, setActiveSlide] = useState(false);
    const radius = 265;
    const center = 265;
    const pointSize = 8;
    const activeSize = 60;

    const getCoordinates = (index, isActive) => {
        const angle = (index / points.length) * (2 * Math.PI) - Math.PI / 2;
        const sizeOffset = isActive ? activeSize / 2 : pointSize / 2;
        const x = center + radius * Math.cos(angle) - sizeOffset;
        const y = center + radius * Math.sin(angle) - sizeOffset;
        return { x, y };
    };

    const animateNumbers = (from, to, setState) => {
        let current = from;
        const step = Math.max(1, Math.abs(to - from) / 20); // Увеличиваем шаг анимации
    
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
    

    const handleClick = (point) => {
        if (point.id === activePoint.id) return;

        animateNumbers(activePoint.startDate, point.startDate, setAnimatedStart);
        animateNumbers(activePoint.endDate, point.endDate, setAnimatedEnd);
        setActivePoint(point);
        setActiveSlide(true);

       const circleRotation = -((point.id - 1) * (360 / points.length)) + 60;
       gsap.to(circleRef.current, {
           rotate: circleRotation,
           duration: 0.5,
       });

       const pointRotation = -circleRotation;
       gsap.to(pointRefs.current[point.id - 1], {
           rotate: pointRotation,
           scale: 1.1,
       });


        setTimeout(() => {
            setActiveSlide(false);
        }, 750);
    };

    const handleHover = (index) => {
        gsap.to(pointRefs.current[index], {
            scale: 1.5,
            duration: 0.2,
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
        });
    };

    const handleHoverOut = (index) => {
        gsap.to(pointRefs.current[index], {
            scale: 1,
            duration: 0.2,
            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
        });
    };

    useEffect(() => {
        gsap.fromTo(
            pointRefs.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }, []);

    const clickPoint = (direction) => {
        const index = points.findIndex((point) => point.id === activePoint.id);
    
        if (direction === "prew") {
            const prevIndex = index === 0 ? points.length - 1 : index - 1;
            handleClick(points[prevIndex]);
        } else if (direction === "next") {
            const nextIndex = index === points.length - 1 ? 0 : index + 1;
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
                    {points.map((point, index) => {
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
                                {isActive && (
                                    <div>
                                        {!activeSlide && <span className={styles.pointText}>{point.name}</span>}
                                        <p>{point.id}</p>
                                    </div>
                                )}
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
                    <div className={styles.sliderContainerPickerDate}>
                        <p>{activePoint.startDate} / {activePoint.endDate}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={() => clickPoint("prew")}><ButtonSlider/></button>     
                        <button onClick={() => clickPoint("next")}><ButtonSlider/></button>        
                    </div>
                    <div>
                        <Slider activePoint={activePoint}/>
                    </div>
                </div>
                <div className={styles.Polygon}>
                    <span className={styles.PolygonCool}></span>
                    <span className={styles.PolygonRow}></span>
                </div>
            </section>
        </Layout>
    );
}

export default SliderModule;
