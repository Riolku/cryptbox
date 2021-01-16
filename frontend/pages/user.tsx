import Head from 'next/head';
import { useState } from 'react'
import { useRouter } from 'next/router';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AppsIcon from '@material-ui/icons/Apps';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';

import FilePicker from '../components/FilePicker';
import Navbar from '../components/Navbar';

const drawerWidth = 240;

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
      paddingLeft: 245,
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
                            <ListItemText primary={"Home"} />
                        </ListItem>
                        <ListItem button selected={fvstate === "Shared"} key={"Shared"} onClick={(ev)=>{handleListItemClick(ev, "Shared")}}>
                            <ListItemIcon><FolderSharedIcon /></ListItemIcon>
                            <ListItemText primary={"Shared"} />
                        </ListItem>
                        <ListItem button selected={fvstate === "Trash"} key={"Trash"} onClick={(ev)=>{handleListItemClick(ev, "Trash")}}>
                            <ListItemIcon><DeleteIcon /></ListItemIcon>
                            <ListItemText primary={"Trash"} />
                        </ListItem>
                        <Divider />
                        <ListItem button key={"Logout"} onClick={(ev)=>{useRouter().push("/")}}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={"Logout"}/>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}>
                    <p>{fvstate}</p>
                </div>
            </main>
        </div>
    )
}