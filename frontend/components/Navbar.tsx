import React from 'react';
import { Link } from '@material-ui/core';

import styles from '../styles/Navbar.module.css';

const Navbar = () => {
    return (
        <div className = { styles.navbarBackground }>
            <div className = { styles.navbarLinkContainer }>
                <Link href = '/'>
                    <h1 className = { styles.navbarLink }> 
                        HOME
                    </h1>
                </Link>
            </div>
            
            <div className = { styles.navbarLinkRightContainer }>
                <Link href = '/register'>
                    <h1 className = { styles.navbarLink }> 
                        REGISTER
                    </h1>
                </Link>
            </div>
            <div className = { styles.navbarLinkRightContainer }>
                <Link href = '/login'>
                    <h1 className = { styles.navbarLink }> 
                        LOGIN
                    </h1>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;