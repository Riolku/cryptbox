import * as React from 'react';
import {useRef, useState} from 'react'
import styles from '../styles/Login.module.css';

export default function Register() {

    let [errorMessage, setErrorMessage] = useState('');

    function submitRegister() {
        let username = (document.getElementById('registerUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('registerPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else{
            fetch('LINK', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            }).then(ret => ret.json())
            .then(data => {

            });
        }
    }

    return (
        <div className = { styles.mainBackground }>
            <div className = { styles.loginBox }>
                <h1 className = { styles.loginHeader }> REGISTER </h1>
                <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                <input id = 'registerUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' />
                <input id = 'registerPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' />
                <button className = { styles.loginSubmitButton } onClick = { submitRegister }> Register </button>
            </div>
        </div>
    );
}