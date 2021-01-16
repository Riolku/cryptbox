import React, { useRef } from 'react';

import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';

import styles from '../styles/Directory.module.css';

interface DirectoryProps {
    data: Object,
    isLast: boolean
}

export default function Directory({data, isLast}: DirectoryProps){
    var typeIcon = null;
    // if(file_type === "directory"){
    //     typeIcon = <FolderIcon />
    // } else if(file_type === "file"){
    //     typeIcon = <DescriptionIcon />
    // }

    return(
        <div className = { styles.fileEntryContainer } style = {{ borderBottom: isLast?'1px solid #00000033':'' }}>
            <div className = { styles.fileEntryComponent } style = {{ width: '2%' }}> a </div>
            <h1 className = { styles.fileEntryComponent } style = {{ width: '40%' }}> File Name </h1>

            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> Date Uploaded </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> Last Modified </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '6%' }}> Extension </h1>
        </div>
    )
}