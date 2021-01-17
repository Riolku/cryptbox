import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';

import styles from '../styles/Login.module.css';

import post from './post';

import { getUserMasterKey, exportMasterKeyForStorage, importMasterKeyFromStorage, prepareMasterKeyForLogin } from '../crypto/user';
import { newDirectory, encryptContent, newIV, loadIVfromResponse, prepareIVforSending } from '../crypto/files';

function Register() {
    let [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    async function submitRegister() {
        let username = (document.getElementById('registerUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('registerPasswordField') as HTMLInputElement).value;
        let repassword = (document.getElementById('registerConfirmPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else if(password != repassword) setErrorMessage('Passwords do not match');
        else{
            let master_key = await getUserMasterKey(username, password);

            let home = await newDirectory("Home", master_key);
            let trash = await newDirectory("Trash", master_key);

            console.log(home);
            console.log(trash);

            post('/register', {
                'username': username,
                'password': prepareMasterKeyForLogin(master_key),
                'home' : home,
                'trash' : trash
            }, data => {
                if(data['status'] != 'ok') setErrorMessage('Login failed');
                else{
                    exportMasterKeyForStorage(master_key).then(storage_key => {
                        localStorage.setItem('master_key', storage_key);
                        localStorage.setItem('username', username);
                        window.location.reload();
                    });
                }
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
                    <h1 className = { styles.loginHeader }> REGISTER </h1>
                    <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                    <input id = 'registerUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' />
                    <input id = 'registerPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' type="password" />
                    <input id = 'registerConfirmPasswordField' className = { styles.loginPasswordField } placeholder = 'Confirm Password' style = {{ top: '46%' }} type="password" />
                    <button className = { styles.loginSubmitButton } style = {{ top: '61%' }} onClick = { submitRegister }> Register </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
