import Head from 'next/head';
import { useState } from 'react'
import { useRouter } from 'next/router';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AppsIcon from '@material-ui/icons/Apps';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import FilePicker from '../components/FilePicker';
import Navbar from '../components/Navbar';

import styles from '../styles/User.module.css';

const drawerWidth = 300;

const testData = [
    {

    },
    {

    },
    {

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

export default function User(){
    const classes = useStyles();
    const router = useRouter();

    const [fvstate, setFVState] = useState("My Files")

    const handleListItemClick =(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string)=>{
        setFVState(index)
    }

    function submitLogout() {
        localStorage.removeItem('username');
        router.push('/');
    }

    return(
        <div>
            <div style = {{ position: 'fixed', left: 0, height: '100vh', width: '230px', top: '-9px', background: 'rgba(0,0,0,0.02)' }}>
                <List>
                    <ListItem button selected={fvstate === "My Files"} key={"My Files"} onClick={(ev)=>{handleListItemClick(ev, "My Files")}}>
                        <ListItemIcon><AppsIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> MY FILES </h1>
                    </ListItem>
                    <ListItem button selected={fvstate === "Shared With Me"} key={"Shared With Me"} onClick={(ev)=>{handleListItemClick(ev, "Shared With Me")}}>
                        <ListItemIcon><FolderSharedIcon /></ListItemIcon>
                        <h1 className = { styles.sidebarText }> SHARED WITH ME </h1>
                    </ListItem>
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
                <div className = { styles.filesBackground }>
                    {
                        testData.map((value, index) => {
                            return (
                                <div className = { styles.fileEntryContainer } style = {{ borderBottom: index==testData.length-1?'1px solid rgba(0,0,0,0.2)':0 }}>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}