import Head from 'next/head';
import FilePicker from '../components/FilePicker';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AppsIcon from '@material-ui/icons/Apps';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from '../styles/User.module.css';

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
}));

export default function User(){

    const classes = useStyles();

    const [fvstate, setFVState] = useState("Home")

    const handleListItemClick =(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string)=>{
        setFVState(index)
    }

    return(
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}>
                
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem button selected={fvstate === "Home"} key={"Home"} onClick={(ev)=>{handleListItemClick(ev, "Home")}}>
                            <ListItemIcon><AppsIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> MY FILES </h1>
                        </ListItem>
                        <ListItem button selected={fvstate === "Shared"} key={"Shared"} onClick={(ev)=>{handleListItemClick(ev, "Shared")}}>
                            <ListItemIcon><FolderSharedIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> SHARED WITH ME</h1>
                        </ListItem>
                        <ListItem button selected={fvstate === "Trash"} key={"Trash"} onClick={(ev)=>{handleListItemClick(ev, "Trash")}}>
                            <ListItemIcon><DeleteIcon /></ListItemIcon>
                            <h1 className = { styles.sidebarText }> TRASH </h1>
                        </ListItem>
                        <Divider />
                    </List>
                </div>
            </Drawer>

            <div className = { styles.userBackground }>
                
            </div>
        </div>
    )
}