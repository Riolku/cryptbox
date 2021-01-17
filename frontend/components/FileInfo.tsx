import { isNullOrUndefined } from "util";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import styles from '../styles/FileInfo.module.css';

import { getreq, postreq } from '../pages/request-utils';

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

function getExtension(name) {
    let idx = name.length-1;
    for(let i=name.length-1; i>=0; i--){
        if(name[i] == '.'){
            idx = i;
            break;
        }
    }
    let res = '';
    for(let i=idx+1; i<name.length; i++)
        res += name[i];
    return res;
}

const fileInfo = ({ fileInfo, closeInfo }: { fileInfo: Object, closeInfo: Function }) => {
    let [firstTime, setFirstTime] = useState(true);
    let [errorMessage, setErrorMessage] = useState('');
    let [data, setData] = useState({'extension': 'png'});

    // const router = useRouter();

    function closeBox() {
        closeInfo();
    }

    // let urlPath = splitString(router.pathname, '/');
    // if(urlPath.length != 3){ //file does not exist
    //     return null;
    // }

    // if(firstTime){
    //     setFirstTime(false);
    //     getreq('/file/' + urlPath[2], data => {
    //         if(data['status'] != 'ok') setErrorMessage(data['status']);
    //         else setData(data);
    //     });
    // }

    let typeIcon = cont(fileInfo['extension'], mappedIcon)?mappedIcon[fileInfo['extension']]:<AttachFileIcon className = { styles.bigImageIcon } style = {{ fontSize: 100 }} />;
    console.log("YES", fileInfo);
    return (
        <div className = { styles.fileInfoBackground } onClick = { closeBox }>
            <div className = { styles.fileBackground }>
                <div className = { styles.filePreviewContainer }>
                    { typeIcon }
                </div>
                <div className = { styles.fileInfo }>
                    <div className = { styles.fileInfoHeader }> { fileInfo['name'] } </div>
                    <div className = { styles.fileInfoHeader } style = {{ paddingTop: 0, paddingBottom: '4%', fontSize: '15px', fontFamily: 'var(--bold-font)' }}> Details </div>

                    {/* <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Owner </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> { fileInfo['owner'] } </h1>
                    </div> */}

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Date Uploaded </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> { fileInfo['created'] + ' ' + fileInfo['created_time'] } </h1>
                    </div>

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Last Modified </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> { fileInfo['modified'] + ' ' + fileInfo['modified_time'] } </h1>
                    </div>

                    {/* <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> File Size </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> 208 Bytes </h1>
                    </div> */}

                    <div className = { styles.fileInfoEntry }>
                        <h1 className = { styles.fileInfoEntryHeader }> Extension </h1>
                        <h1 className = { styles.fileInfoEntryEntry }> { getExtension(fileInfo['name']) } </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default fileInfo;