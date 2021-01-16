import { isNullOrUndefined } from "util";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../styles/FileInfo.module.css';

function splitString(str, c) {
    let ret = [], curr = '';
    for(let i=0; i<str.length; i++){
        if(str[i] == c){
            if(curr.length > 0) ret.push(curr);
            curr = '';
        }else curr += str[i];
    }
    if(curr.length > 0) ret.push(curr);
    return ret;
}

const fileInfo = ({ closeInfo }: { closeInfo: Function }) => {
    let [firstTime, setFirstTime] = useState(true);
    let [errorMessage, setErrorMessage] = useState('');
    let [data, setData] = useState(null);

    const router = useRouter();

    function closeBox() {
        closeInfo();
    }

    let urlPath = splitString(router.pathname, '/');
    if(urlPath.length != 3){ //file does not exist
        return null;
    }

    if(firstTime){
        setFirstTime(false);
        fetch('https://api.cryptbox.kgugeler.ca/file/' + urlPath[2], {
            method: 'GET',
            credentials: 'include'
        }).then(ret => ret.json())
        .then(data => {
            if(data['status'] != 'ok') setErrorMessage(data['status']);
            else setData(data);
        });
    }

    return (
        <div className = { styles.fileInfoBackground } onClick = { closeBox }>
            <div className = { styles.fileBackground }>
                <div className = { styles.filePreviewContainer }>
                    
                </div>
                <div className = { styles.fileInfo }>
                    <div className = { styles.fileInfoHeader }> File Name </div>
                    <div className = { styles.fileInfoHeader } style = {{ paddingTop: 0, paddingBottom: '4%', fontSize: '15px', fontFamily: 'var(--bold-font)' }}> Details </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Owner </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> pepega </h1>
                    </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Date Uploaded </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> 12/30/2021 12:01 PM </h1>
                    </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Last Modified </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> 12/30/2021 12:01 PM </h1>
                    </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> File Size </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> 208 Bytes </h1>
                    </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Extension </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> pdf </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default fileInfo;