import { Link } from '@material-ui/core';
import styles from '../styles/Home.module.css';

import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div>
            <Navbar linkCol = 'white' />
            <div className = { styles.mainBackground }>
                <h1 className = { styles.homeHeader }> Encrypt, store, and share your work, in one easy step </h1>
                <div className = { styles.homeInfoContainer }>
                    <h1 className = { styles.homeDesc }> Using Sia, a modern decentralized storage platform, you can encrypt and store your data - nobody can access your data without your permission, not even us. 
                                                        CryptBox enables you to back up and share your files easily and securely. </h1>
                    <Link href = '/register'>
                        <button className = { styles.homeTryButton }> SIGN UP NOW </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
