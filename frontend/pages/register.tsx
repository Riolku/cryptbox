import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';

import styles from '../styles/Login.module.css';

function Register() {
    let [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    function submitRegister() {
        let username = (document.getElementById('registerUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('registerPasswordField') as HTMLInputElement).value;
        let repassword = (document.getElementById('registerConfirmPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else if(password != repassword) setErrorMessage('Passwords do not match');
        else{
            fetch('http://167.99.181.60:5000/register', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            }).then(ret => ret.json())
            .then(data => {
                if(data['status'] != 'Ok') setErrorMessage('Login failed');
                else{
                    localStorage.setItem('username', username);
                    window.location.reload();
                }
            });
        }
    }

    if(process.browser && localStorage.getItem('username') != undefined)
        router.push('/user');

    return (
        <div>
            <Navbar />
            <div className = { styles.mainBackground }>
                <div className = { styles.loginBox }>
                    <h1 className = { styles.loginHeader }> REGISTER </h1>
                    <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                    <input id = 'registerUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' />
                    <input id = 'registerPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' />
                    <input id = 'registerConfirmPasswordField' className = { styles.loginPasswordField } placeholder = 'Confirm Password' style = {{ top: '46%' }} />
                    <button className = { styles.loginSubmitButton } style = {{ top: '61%' }} onClick = { submitRegister }> Register </button>
                </div>
            </div>
        </div>
    );
}

export default Register;