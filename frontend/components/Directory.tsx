import React, { useRef } from 'react';

import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';

import styles from '../styles/Directory.module.css';

interface DirectoryProps {
    file_type: string,
    parent: string,
    encrypted_name: string,
    modified: string
}

export default function Directory({file_type, parent, encrypted_name, modified}: DirectoryProps){

    var typeIcon;
    if(file_type === "directory"){
        typeIcon = <FolderIcon />
    } else if(file_type === "file"){
        typeIcon = <DescriptionIcon />
    }

    return(
        <div className={styles.fileEntryContainer}>
            <div className={styles.fileEntryComponent}>{typeIcon}</div>
            <div className={styles.fileEntryComponent}><h1>{encrypted_name}</h1></div>
            <div className={styles.fileEntryComponent}><p>{modified}</p></div>
        </div>
    )
}