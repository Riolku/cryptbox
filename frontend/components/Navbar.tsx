import React from 'react';
import { Link } from '@material-ui/core';

import styles from '../styles/Navbar.module.css';

const Navbar = ({ linkCol }: { linkCol: string }) => {
    return (
        <div className = { styles.navbarBackground }>
            <div className = { styles.navbarLinkContainer }>
                <Link href = '/'>
                    <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                        <img src = '/images/gradientC.png' style = {{ transform: 'translate(0,-15px)', height: '60px' }} />
                    </h1>
                </Link>
            </div>
            
            <div className = { styles.navbarLinkRightContainer }>
                <Link href = '/register'>
                    <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                        REGISTER
                    </h1>
                </Link>
            </div>
            <div className = { styles.navbarLinkRightContainer }>
                <Link href = '/login'>
                    <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                        LOGIN
                    </h1>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;