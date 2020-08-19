import React, { Component } from 'react';

import { FaSave, FaTimes } from 'react-icons/fa';
import { Controlled as CodeMirror } from 'react-codemirror2';
import equal from 'fast-deep-equal';

import api from '../services/api';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';

import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/scroll/annotatescrollbar';

import './styles.css'


class CodeEditor extends Component {

    constructor() {
        super();
        this.state = {
            html: '',
            css: '',
            js: '',
            java: '',
            fileName: 'Example.java',
            fileId: '',
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(this.props.content, prevProps.content)) {
            let content = this.props.content.content;
            let id = this.props.content.id;
            let fileName = this.props.content.name;
            
            this.setState({ java: content, fileId: id, fileName: fileName});
        }

    }

    componentDidMount() {
        this.setState({ java: this.props.content });
    }

    async getFile() {
        try {
           let res = await api.get('/files/' + this.state.fileId);
           console.log(res.data);

           this.setState({ java: res.data.content, fileName: res.data.name });
        } catch(e){
            alert(e);
        }
    }

    async saveFile() {
        try {
            await api.put('/files/' + this.state.fileId);

            alert(`File ${this.state.fileName} updated!`);
        } catch(e) {
            alert('Could not save the file\n\nPS: You can not save the example file!');
        }
    }

    async deleteFile() {
        try {
            await api.delete('/files/' + this.state.fileId);

            alert('File deleted!');
        } catch(e) {
            alert('Could not delete the file, may not be saved in the system');
        }
    }

    render() {
        const { java } = this.state;

        const codeMirrorOptions = {
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,

        }

        return (
            <div className="container">
                <section className="code">
                    <h1 className="fileName">{this.state.fileName}</h1>
                    <div className="codeEditor">
                        <CodeMirror
                            value={java}
                            options={{
                                mode: 'jsx',
                                autoCloseBrackets: true,
                                autoCloseTags: true,
                                keyMap: 'sublime',
                                matchBrackets: true,
                                scrollbarStyle: "native",
                                ...codeMirrorOptions,

                            }}
                            onBeforeChange={(editor, data, java) => {
                                this.setState({ java });
                            }}
                        />

                        <button className="icon" onClick={() => { this.saveFile() }}>
                            <FaSave className="saveIcon" size={24} />
                        </button>
                        <button className="icon close" onClick={() => {this.deleteFile()}}>
                            <FaTimes className="closeIcon" size={24} />
                        </button>

                    </div>
                </section>
            </div>
        )
    }

}

export default CodeEditor