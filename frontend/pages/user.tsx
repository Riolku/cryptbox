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
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import FilePicker from '../components/FilePicker';
import Navbar from '../components/Navbar';
import Directory from '../components/Directory'
import FileInfo from '../components/FileInfo';
import Header from '../components/Header';

import { decryptContent, encryptContent, encryptRawContent, newIV, prepareBytesForSending, prepareIVforSending } from '../crypto/files'
import { importMasterKeyFromStorage } from '../crypto/user'
import { fromBytesToString } from '../crypto/utils'

import styles from '../styles/User.module.css';

import { getreq, postreq } from './request-utils';

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

export default function User() {
    const router = useRouter();

    const [fvstate, setFVState] = useState("My Files");
    const [uploadedFile, setUpload] = useState(null)

    const [username, setUsername] = useState("")

    let [currentFolder, setCurrentFolder] = useState(0);
    let [parentFolder, setParentFolder] = useState(0);
    let [children, setChildren] = useState([]);

    let [firstTime, setFirstTime] = useState(true);
    let [baseDirectoryIDs, setBaseIDs] = useState({});

    let [showFolderPopup, setFolderPopup] = useState(false);

    let [popupErrorMessage, setPopupErrorMessage] = useState('');

    function _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        var str = window.btoa( binary );
        return str;
    }

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string)=>{
        setFVState(index)
    }

    function submitLogout() {
        localStorage.removeItem('master_key');
        localStorage.removeItem('username')
        router.push('/');
    }

    async function addFolder(name) {
        let iv = await newIV();
        setPopupErrorMessage('');
        console.log("BASE", baseDirectoryIDs);
        console.log(localStorage.getItem('master_key'));
        let master = await importMasterKeyFromStorage(localStorage.getItem('master_key'));
        console.log("GOT MASTER");
        let data = await encryptContent(name, master, iv);
        console.log("DONE DATA");
        postreq('/directory/' + currentFolder + '/directory', {
          'name_iv': iv,
          'encrypted_name': data,
          'parent': currentFolder
        }, data => {
          console.log("ADDED FOLDER", data);
          if(data['status'] != 'ok'){

          }else{

          }
        });
    }

    function attemptAddFolder() {
        let name = (document.getElementById('create-folder-name') as HTMLInputElement).value;
        if(name == '') setPopupErrorMessage('Please enter a folder name');
        else addFolder(name);
    }

    useEffect(() => {
        if(currentFolder != 0 && currentFolder != undefined){
          getreq('/directory/' + currentFolder, data => {
            console.log("GOT DIRECTORY", data);
            if (data['status'] != 'ok') {

            } else {
              setParentFolder(data['parent']);
              setChildren(conv(data['children']));
            }
          });
        }
    }, [currentFolder]);

    useEffect(() => {
        setCurrentFolder(baseDirectoryIDs[fvstate]);
    }, [fvstate]);

    useEffect(() => {
        if(uploadedFile != null){
            uploadedFile.arrayBuffer().then((buff)=>{
                importMasterKeyFromStorage(localStorage.getItem('master_key')).then((master_key)=>{
                    newIV().then(name_iv=>{
                        encryptContent(uploadedFile.name, master_key, name_iv).then((enc_name)=>{
                            newIV().then(b64_iv=>{
                                encryptRawContent(buff, master_key, b64_iv).then((enc_b64s)=>{
                                    let ret = {
                                        "encrypted_name": enc_name,
                                        "encrypted_content": prepareBytesForSending(enc_b64s),
                                        "name_iv": prepareIVforSending(name_iv),
                                        "content_iv": prepareIVforSending(b64_iv)
                                    }
        
                                    postreq('/directory/' + currentFolder + '/file', ret, data => {
                                        if (data['status'] != 'ok') {
                                            
                                        } else {
                    
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }, [uploadedFile]);

    if(firstTime){
        setFirstTime(false);
        getreq('/user/dirs', data => {
            console.log("FETCHED IDS", data);
            if(data['status'] != 'ok'){

            }else{
                let ret = {
                    'My Files': data['home'],
                    'Trash': data['trash']
                };
                setCurrentFolder(data['home']);
                //setFolderPath([{'name': 'My Files', 'id': data['home']}]);
                setBaseIDs(ret);
            }
        });
    }

    function getFromLocalStorage(): string{
        
        let username = ""

        if(process.browser){
            username = localStorage.getItem('username')
        }

        return username;
    }

    return(
        <div>
            <Header title="User"/>
            <div style = {{ position: 'fixed', left: 0, height: '100vh', width: '230px', top: '-9px', background: 'rgba(0,0,0,0.02)' }}>
                <img src = '/images/gradientC.png' style = {{ cursor: 'pointer', position: 'absolute', left: '10%', top: '40px', height: '50px' }} onClick = { () => router.push('/') } />
                <List style = {{ top: '108px' }}>
                    <ListItem button key={"User"}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <h1 className={ styles.sidebarText }>{
                            getFromLocalStorage()
                        }</h1>
                    </ListItem>
                    <Divider />
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
                {/*<FolderPath folderPath = { folderPath } />*/}
                {/* <h1 className = { styles.userHeader }> { fvstate } </h1> */}
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