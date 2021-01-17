import Head from 'next/head';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AppsIcon from '@material-ui/icons/Apps';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';

import FilePicker from '../components/FilePicker';
import Navbar from '../components/Navbar';
import Directory from '../components/Directory'
import FileInfo from '../components/FileInfo';
import Header from '../components/Header';

import { newIV, decryptContent, encryptContent } from '../crypto/files';

import styles from '../styles/User.module.css';

const drawerWidth = 300;

const testData = [
    {
        'encrypted_name': 'File 1',
        'extension': 'pdf',
        'modified': '12/30/2021 10:41 PM',
        'created': '12/30/2021 10:41 PM',
    },
    {
        'encrypted_name': 'File 2',
        'extension': 'png',
        'modified': '12/29/2021 10:41 PM',
        'created': '12/29/2021 10:41 PM',
    },
    {
        'encrypted_name': 'File 3',
        'extension': 'folder',
        'modified': '12/3/2021 10:41 PM',
        'created': '12/3/2021 10:41 PM',
    }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      paddingLeft: 285,
    },
  }),
);

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

function prependZero(num) {
    if(num <= 9) return '0' + num;
    return num;
}

function changeToDate(epoch) {
    let date = new Date(epoch);
    return prependZero(date.getMonth()) + '-' + prependZero(date.getDay()) + '-' + date.getFullYear();
}

function conv(children) {
    let ret = [], master_key = localStorage.getItem('master_key');
    children['directories'].sort(function(a, b) {
        if(a['modified'] == b['modified']) return a['created'] > b['created'];
        return a['modified'] > b['modified'];
    });
    children['files'].sort(function(a, b) {
        if(a['modified'] == b['modified']) return a['created'] > b['created'];
        return a['modified'] > b['modified'];
    });
    for(let folder of children['directories']){
        let folder_iv = folder['name_iv'];
        ret.push(
            {
                'name': decryptContent(folder['encrypted_name'], master_key, folder_iv),
                'modified': changeToDate(folder['modified']),
                'created': changeToDate(folder['created']),
                'parent': folder['parent']
            }
        );
    }
    for(let file of children['files']){
        let file_iv = file['name_iv'];
        ret.push(
            {
                'name': decryptContent(file['encrypted_name'], master_key, file_iv),
                'modified': changeToDate(file['modified']),
                'created': changeToDate(file['created'])
            }
        );
    }
    return ret;
}

export default function User(){
    const classes = useStyles();
    const router = useRouter();

    const [fvstate, setFVState] = useState("My Files");
    const [uploadedFile, setUpload] = useState(null)

    let [currentFolder, setCurrentFolder] = useState(0);
    let [parentFolder, setParentFolder] = useState(0);
    let [children, setChildren] = useState([]);

    let [firstTime, setFirstTime] = useState(true);
    let [baseDirectoryIDs, setBaseIDs] = useState({});

    let [showFolderPopup, setFolderPopup] = useState(true);

    let [popupErrorMessage, setPopupErrorMessage] = useState('');

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string)=>{
        setFVState(index)
    }

    function submitLogout() {
        localStorage.removeItem('master_key');
        router.push('/');
    }

    function addFolder(name) {
        let iv = newIV();
        fetch('https://api.cryptbox.kgugeler.ca/directory/' + currentFolder + '/directory', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                'name_iv': iv,
                'encrypted_name': encryptContent(name, localStorage.getItem('master_key'), iv),
                'parent': currentFolder
            })
        }).then(ret => ret.json())
        .then(data => {
            if(data['status'] != 'ok'){

            }else{

            }
        });
    }

    function attemptAddFolder() {
        let name = (document.getElementById('create-folder-name') as HTMLInputElement).value;
        if(name == '') setPopupErrorMessage('Please enter a file name');
        else addFolder(name);
    }

    useEffect(() => {
        fetch('https://api.cryptbox.kgugeler.ca/directory/' + currentFolder, {
            method: 'GET',
            credentials: 'include'
        }).then(ret => ret.json())
        .then(data => {
            if(data['status'] != 'ok'){

            }else{
                setParentFolder(data['parent']);
                setChildren(conv(data['children']));
            }
        });
    }, [currentFolder]);

    useEffect(() => {
        setCurrentFolder(baseDirectoryIDs[fvstate]);
    }, [fvstate]);

    useEffect(() => {
        if(uploadedFile != null){
            let ret = new FormData();
            ret.append('file', uploadedFile, uploadedFile.name);

            fetch('https://api.cryptbox.kgugeler.ca/directory/' + currentFolder + '/file', {
                method: 'POST',
                credentials: 'include',
                body: ret
            }).then(ret => ret.json())
            .then(data => {
                if(data['status'] != 'ok'){

                }else{

                }
            });
        }
    }, [uploadedFile]);

    if(firstTime){
        setFirstTime(false);
        fetch('https://api.cryptbox.kgugeler.ca/user/dirs', {
            method: 'GET',
            credentials: 'include'
        }).then(ret => ret.json())
        .then(data => {
            console.log(data);
            if(data['status'] != 'ok'){

            }else{
                let ret = {
                    'My Files': data['home'],
                    'Shared With Me': data['shared'],
                    'Trash': data['trash']
                };
                setBaseIDs(ret);
            }
        });
    }

    return(
        <div>
            <Header title="User"/>
            <div style = {{ position: 'fixed', left: 0, height: '100vh', width: '230px', top: '-9px', background: 'rgba(0,0,0,0.02)' }}>
                <img src = '/images/gradientC.png' style = {{ cursor: 'pointer', position: 'absolute', left: '10%', top: '3.5%', height: '50px' }} onClick = { () => router.push('/') } />
                <List style = {{ top: '108px' }}>
                    <ListItem button selected={fvstate === "My Files"} key={"My Files"} onClick={(ev)=>{handleListItemClick(ev, "My Files")}}>
                        <ListItemIcon><AppsIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> MY FILES </h1>
                    </ListItem>
                    {/*<ListItem button selected={fvstate === "Shared With Me"} key={"Shared With Me"} onClick={(ev)=>{handleListItemClick(ev, "Shared With Me")}}>
                        <ListItemIcon><FolderSharedIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> SHARED WITH ME </h1>
                    </ListItem>*/}
                    <ListItem button selected={fvstate === "Trash"} key={"Trash"} onClick={(ev)=>{handleListItemClick(ev, "Trash")}}>
                        <ListItemIcon><DeleteIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> TRASH </h1>
                    </ListItem>
                    <Divider />
                    <ListItem button key={"Logout"} onClick = { submitLogout }>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> LOGOUT </h1>
                    </ListItem>
                </List>
            </div>
            <div className = { styles.userBackground }>
                <h1 className = { styles.userHeader }> { fvstate } </h1>
                {
                    fvstate == 'My Files'?
                    <div>
                        <button className = { styles.newFolder } onClick = { addFolder }><AddIcon fontSize="small" style={{ position:'absolute', left:'5%', top:'18%' }}/> <h1 style={{ position: 'absolute', top: '-12%', left: '25%', fontSize: '15px', fontFamily: 'var(--font)' }}>Add Folder </h1></button>
                        <div className = { styles.uploadFile }>
                            <PublishIcon style={{ position:'absolute', left:'5%', top:'10%' }}/>
                            <h1 style = {{ position: 'absolute', top: '5%', left: '60%', transform: 'translate(-50%,-32%)', fontSize: '15px', fontFamily: 'var(--font)' }}> Upload </h1>
                            <FilePicker onFile={ (file)=>{setUpload(file)} }/>
                        </div>
                    </div>
                    :null
                }
                <div className = { styles.filesBackground } style = {{ top: fvstate=='My Files'?'150px':'100px' }}>
                    <Directory data = { null } changeDirectory = { null } isFirst = { true } isLast = { false } />
                    {
                        children.map((value, index) => {
                            return <Directory data = { value } changeDirectory = { setCurrentFolder } isFirst = { false } isLast = { index == testData.length-1 } />
                        })
                    }
                </div>
            </div>
            {
                showFolderPopup?
                <div className = { styles.popupContainer }>
                    <div className = { styles.popupInnerContainer }>
                        <h1 className = { styles.popupHeader }> Create Folder </h1>
                        <h1 className = { styles.popupError }> { popupErrorMessage } </h1>
                        <h1 className = { styles.popupEntryHeader }> Name </h1>
                        <input id = 'create-folder-name' className = { styles.popupEntryInput } placeholder = 'Folder name' />
                        <div className = { styles.popupBottom }>
                            <button className = { styles.popupConfirm } onClick = { attemptAddFolder }> Confirm </button>
                            <button className = { styles.popupCancel } onClick = { () => setFolderPopup(false) }> Cancel </button>
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    )
}
