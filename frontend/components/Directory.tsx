import React, { useRef } from 'react';
import { useRouter } from 'next/router';

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
    changeDirectory: Function,
    isFirst: boolean,
    isLast: boolean
}

function cont(value, dict) {
    for(let [key, val] of Object.entries(dict)) {
        if(value != key) continue;
        return true;
    }
    return false;
}

export default function Directory({data, changeDirectory, isFirst, isLast}: DirectoryProps){
    const router = useRouter();

    function selectFile() {
        if(data['type'] == 'folder'){
            console.log("CLICKED");
            changeDirectory({ 'name': data['name'], 'id': data['id'] });
        }else router.push('/user/file/' + data['id']);
    }

    if(isFirst){
        return(
            <div className = { styles.fileEntryContainerNoHover } style = {{ borderTop: 0, borderBottom: isLast?'1px solid #00000033':'' }}>
                <h1 className = { styles.fileEntryComponent } style = {{ fontFamily: 'var(--bold-font)', paddingLeft: '0.5%', width: '40%' }}> File Name </h1>
    
                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '10%' }}> Date Uploaded </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '10%' }}> Last Modified </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '6%' }}> Extension </h1>
            </div>
        )
    }

    let typeIcon = <FolderIcon />
    if(data['type'] != 'folder')
        typeIcon = cont(data['extension'], mappedIcon)?mappedIcon[data['extension']]:<AttachFileIcon />;

    return(
        <div className = { styles.fileEntryContainer } style = {{ borderBottom: isLast?'1px solid #00000033':'' }} onClick = { selectFile }>
            <div className = { styles.fileEntryIcon } style = {{ width: '2%' }}> { typeIcon } </div>
            <h1 className = { styles.fileEntryComponent } style = {{ width: '40%' }}> { data['name'] } </h1>

            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> { data['created'] } </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> { data['modified'] } </h1>
            <h1 className = { styles.fileEntryComponentRight } style = {{ width: '6%' }}> { data['extension'] } </h1>
        </div>
    )
}