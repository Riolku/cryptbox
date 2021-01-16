import Button from '@material-ui/core/Button';
import React, { useRef } from 'react';

export interface FilePickerProps {
    onFile: (file: File | null) => void;
}

export default function FilePicker({onFile}: FilePickerProps){
    const input = useRef<HTMLInputElement>(null);
    return(
        <Button variant="contained" onClick={()=>{
            input.current?.click();
        }}>
            <input ref={input} type="file" style={{ display: 'none'}} onChange={(ev)=>{
                onFile(ev.target.files ? ev.target.files[0] : null);
            }}/>
            Upload
        </Button>
    )
}