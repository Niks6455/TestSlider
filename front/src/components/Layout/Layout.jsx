import React from 'react';
import styles from './Layout.module.scss'; // Импортируем стили

const Layout = ({ children }) => {
    return (
        <div className={styles.layoutContainer}>
            {children}
        </div>
    );
};
export default Layout;
