import React from "react";
import styles from "./Dots.module.scss";
function Dots(props) {
    return ( 
        <div>
            <ul className={styles.pointList}>
                {props?.points.map((point) => (
                    <li
                        key={point.id}
                        onClick={() => props?.handleClick(point)}
                        className={`${styles.pointItemPhone} ${props?.activePoint.id === point.id ? styles.activePointPhone : ""}`}
                    ></li>
                ))}
            </ul>
        </div>
     );
}

export default Dots;