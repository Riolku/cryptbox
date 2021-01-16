import React, { useRef } from 'react';

import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import styles from '../styles/Directory.module.css';

const mappedIcon = {
    'folder': <FolderIcon />,
    'pdf': <PictureAsPdfIcon />,
    'png': <ImageIcon />,
    'jpg': <ImageIcon />,
    'jpeg': <ImageIcon />,
    'txt': <DescriptionIcon />,
};

interface DirectoryProps {
    data: Object,
    isLast: boolean
}

function cont(value, dict) {
    for(let [key, val] of Object.entries(dict)) {
        if(value != key) continue;
        return true;
    }
    return false;
}

export default function Directory({data, isLast}: DirectoryProps){
    let typeIcon = cont(data['extension'], mappedIcon)?mappedIcon[data['extension']]:<AttachFileIcon />;

    return(
        <div className = { styles.fileEntryContainer } style = {{ borderBottom: isLast?'1px solid #00000033':'' }}>
            <div className = { styles.fileEntryIcon } style = {{ width: '2%' }}> { typeIcon } </div>
            <h1 className = { styles.fileEntryComponent } style = {{ width: '40%' }}> File Name </h1>

            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> Date Uploaded </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> Last Modified </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '6%' }}> Extension </h1>
        </div>
    )
}