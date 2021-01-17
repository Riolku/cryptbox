import styles from '../styles/FolderPath.module.css';

const FolderPath = ({ folderPath, changeFolder }: { folderPath: any, changeFolder: Function }) => {
    let ret = [];

    for(let i=0; i<folderPath.length; i++){
        let entry = folderPath[i];
        ret.push(
            <h1 className = { styles.pathEntry } onClick = { () => changeFolder(entry['id']) }>
                { entry['name'] }
            </h1>
        );
        if(i+1 != folderPath.length){
            ret.push(
                <h1 className = { styles.pathDivider }>
                    &#62;
                </h1>
            );
        }
    }

    return (
        <div className = { styles.pathContainer }>
            { ret }
        </div>
    );
}

export default FolderPath;