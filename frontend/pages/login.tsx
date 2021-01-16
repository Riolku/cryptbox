import React, { useState } from 'react';

import styles from '../styles/Login.module.css';

function login() {
    let [errorMessage, setErrorMessage] = useState('');

    function submitLogin() {
        let username = (document.getElementById('loginUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('loginPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else{
            fetch('LINK', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'username': username,
                    
                })
            }).then(ret => ret.json())
            .then(data => {
                
            });
        }
    }

    return (
        <div className = { styles.mainBackground }>
            <div className = { styles.loginBox }>
                <h1 className = { styles.loginHeader }> LOGIN </h1>
                <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                <input id = 'loginUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' />
                <input id = 'loginPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' />
                <button className = { styles.loginSubmitButton } onClick = { submitLogin }> SUBMIT </button>
            </div>
        </div>
    );
}

export default login;