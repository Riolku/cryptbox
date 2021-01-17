import React from 'react';
import { Link } from '@material-ui/core';

import styles from '../styles/Navbar.module.css';

const Navbar = ({ linkCol }: { linkCol: string }) => {
    let obj1 = 
    <div className = { styles.navbarLinkRightContainer }>
        <Link href = '/register'>
            <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                REGISTER
            </h1>
        </Link>
    </div>
    
    let obj2 =
    <div className = { styles.navbarLinkRightContainer }>
        <Link href = '/login'>
            <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                LOGIN
            </h1>
        </Link>
    </div>

    if(process.browser && localStorage.getItem('master_key') != undefined){
        obj1 =
        <div className = { styles.navbarLinkRightContainer }>
            <Link href = '/user'>
                <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                    DASHBOARD
                </h1>
            </Link>
        </div>
        obj2 = null;
    }

    return (
        <div className = { styles.navbarBackground }>
            <div className = { styles.navbarLinkContainer }>
                <Link href = '/'>
                    <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                        <img src = '/images/gradientC.png' style = {{ transform: 'translate(0,-15px)', height: '60px' }} />
                    </h1>
                </Link>
            </div>
            { obj1 }
            { obj2 }
        </div>
    );
}

export default Navbar;