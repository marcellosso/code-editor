import React, { useState, useEffect } from 'react';

import { FaArrowRight, FaFolder, FaJava } from 'react-icons/fa';

import CodeEditor from '../../components/CodeEditor';
import './styles.css';

import api from '../../services/api';

/* 
    I didn't use the get '/files/{fileId}', because I would rather get all files directly and save on state (later with redux), so the website is more optimized and faster
    If I would continue on this project, I would add redux to handle global state
*/

export default function Home() {
    const [files, setFiles] = useState([]);
    const [fileTree, setTree] = useState();
    const [content, setContent] = useState('import java.util.*;\n\npublic class HelloWorld {\n\n\tpublic static void main(String args[]){\n\t\tSystem.out.println(\'Hello World\');\n\t}\n\n}');

    useEffect(() => {
        getFiles();
        getFilesContent();
    }, [])

    
    async function getFiles() {
        try {
            let res = await api.get('/filetree');

            setFiles(res.data);
        } catch (e) {
            alert(e);
        }

    }

    function getFile(id) {
        fileTree.forEach((file) => {
            if (file.id === id) {
                setContent(file);
            }
        });
    }

    // Get file content when the app loads, so we don't have to make API calls everytime a file is clicked, save json in state

    async function getFilesContent() {
        try {
            let res = await api.get('/files');

            setTree(res.data);
        } catch (e) {
            alert(e);
        }
    }


    function renderFiles(tempFiles) {
        
    }

    renderFiles = (tempFiles) => tempFiles.map(function (item, i) {
        return (
            <div className="fileItem" key={i} id={item.id} >
                <div className="itemContainer">
                    {item.isDirectory ?
                        <FaFolder className="icons folder" size={20} />
                        :
                        <FaJava className="icons language" size={14} />
                    }

                    <button onClick={() => getFile(item.id)}>
                        <p>{item.name}</p>
                    </button>
                </div>
                {item.children ?
                    renderFiles(item.children)
                    :
                    <></>
                }

            </div>
        )
    })

    return (
        <div className="mainContainer">
            <div className="files">
                <FaArrowRight className="arrow" size={26} />
                <h3>FILES</h3>

                <div className="filesContainer">
                    {renderFiles(files)}
                </div>
            </div>
            <div className="codeContainer">
                <div className="banner">
                    <h1>Veezoo Code Editor</h1>
                </div>
                <div className="codeMain">
                    <CodeEditor content={content} />
                </div>
            </div>
        </div>
    )

}