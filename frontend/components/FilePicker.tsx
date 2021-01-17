import Button from '@material-ui/core/Button';
import React, { useRef } from 'react';

import styles from '../styles/User.module.css';

export interface FilePickerProps {
    onFile: Function
}

export default function FilePicker({onFile}: FilePickerProps){
    const input = useRef<HTMLInputElement>(null);
    return(
        <Button className={styles.headerUI} style = {{ opacity: 0, fontFamily: 'var(--font)' }} variant="contained" onClick={()=>{input.current?.click()}}>
            <input ref={input} type="file" style={{ display: 'none'}} onChange={(ev)=>{onFile(ev.target.files[0])}}/>
            Upload
        </Button>
    )
}