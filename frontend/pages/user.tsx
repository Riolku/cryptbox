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

const drawerWidth = 220;

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
      padding: theme.spacing(3),
    },
  }),
);

export default function User(){

    const classes = useStyles();

    const [fvstate, setFVState] = useState("Home")

    const handleListItemClick =(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string)=>{
        setFVState(index)
    }

    return(
        //<FilePicker onFile={(file)=>}></FilePicker>
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}>
                
                <div className={classes.toolbar }>
                    <List>
                        <ListItem button selected={fvstate === "Home"} key={"Home"} onClick={(ev)=>{handleListItemClick(ev, "Home")}}>
                            <ListItemIcon><AppsIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> MY FILES </h1>
                        </ListItem>
                        <ListItem button selected={fvstate === "Shared"} key={"Shared"} onClick={(ev)=>{handleListItemClick(ev, "Shared")}}>
                            <ListItemIcon><FolderSharedIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> SHARED WITH ME </h1>
                        </ListItem>
                        <ListItem button selected={fvstate === "Trash"} key={"Trash"} onClick={(ev)=>{handleListItemClick(ev, "Trash")}}>
                            <ListItemIcon><DeleteIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> TRASH </h1>
                        </ListItem>
                        <Divider />
                        <ListItem button key={"Logout"} onClick={(ev)=>{useRouter().push("/")}}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> LOGOUT </h1>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}>
                    <p></p>
                </div>
            </main>
        </div>
    )
}