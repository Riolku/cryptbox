import { isNullOrUndefined } from "util";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import styles from '../styles/FileInfo.module.css';

const mappedIcon = {
    'folder': <FolderIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
    'pdf': <PictureAsPdfIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
    'png': <ImageIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
    'jpg': <ImageIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
    'jpeg': <ImageIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
    'txt': <DescriptionIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />,
};

function cont(value, dict) {
    for(let [key, val] of Object.entries(dict)) {
        if(value != key) continue;
        return true;
    }
    return false;
}

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
    let [data, setData] = useState({'extension': 'png'});

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

    let typeIcon = cont(data['extension'], mappedIcon)?mappedIcon[data['extension']]:<AttachFileIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />;

    return (
        <div className = { styles.fileInfoBackground } onClick = { closeBox }>
            <div className = { styles.fileBackground }>
                <div className = { styles.filePreviewContainer }>
                    { typeIcon }
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