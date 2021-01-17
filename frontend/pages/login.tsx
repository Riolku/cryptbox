import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';

import styles from '../styles/Login.module.css';

import post from './post';

import { getUserMasterKey, exportMasterKeyForStorage, importMasterKeyFromStorage, prepareMasterKeyForLogin } from '../crypto/user';

function login() {
    let [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    function submitLogin() {
        let username = (document.getElementById('loginUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('loginPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else{
            console.log("Attempting to retrieve master key.");
            getUserMasterKey(username, password).then(master_key => {
              console.log("Key Acquired.");

              post('/authenticate', {
                  'username': username,
                  'password': prepareMasterKeyForLogin(master_key)
              }, data => {
                  console.log("Login Success.");

                  if(data['status'] != 'ok') setErrorMessage('Login failed');
                  else{
                      exportMasterKeyForStorage(master_key).then(res => {
                          localStorage.setItem('master_key', res);
                          window.location.reload();
                      });
                  }
              });
            });
        }
    }

    if(process.browser && localStorage.getItem('master_key') != undefined)
        router.push('/user');

    return (
        <div>
            <Navbar linkCol = 'black' />
            <div className = { styles.mainBackground }>
                <div className = { styles.loginBox }>
                    <h1 className = { styles.loginHeader }> LOGIN </h1>
                    <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                    <input id = 'loginUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' />
                    <input id = 'loginPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' type="password" />
                    <button className = { styles.loginSubmitButton } onClick = { submitLogin }> SUBMIT </button>
                </div>
            </div>
        </div>
    );
}

export default login;
