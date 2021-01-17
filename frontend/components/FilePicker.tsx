import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import React, { useRef } from 'react';

import styles from '../styles/User.module.css';

export interface FilePickerProps {
    onFile: (file: File | null) => void;
}

export default function FilePicker({onFile}: FilePickerProps){
    const input = useRef<HTMLInputElement>(null);
    return(
        <Button className={styles.headerUI} variant="contained" onClick={()=>{
            input.current?.click();
        }}>
            <input ref={input} type="file" style={{ display: 'none'}} onChange={(ev)=>{
                onFile(ev.target.files ? ev.target.files[0] : null);
            }}/>
            <PublishIcon/> 
            Upload
        </Button>
    )
}