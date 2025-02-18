import styles from "./Polygon.module.scss";

function Polygon() {
    return ( 
        <div className={styles.Polygon}>
            <span className={styles.PolygonCool}></span>
            <span className={styles.PolygonRow}></span>
        </div>
     );
}

export default Polygon;