import React from "react";
import {connect} from 'react-redux'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import {makeGetNoteByLabel} from "../notes/selectors";
import {bindActionCreators} from "redux";
import {setNote} from "../notes/actions";

const defaultContent = "Type here..."

const Editor = ({name, note, setContent}) => {
    const {
        id = null,
        content = defaultContent,
    } = note || {}

    const [editing, setEditing] = React.useState(false)
    const noteStart = React.useRef(null)

    const resetFocus = () => {
        noteStart.current.focus()
    }

    const persistEdit = editor => {
        const newContent = editor.getData()
        setEditing(false)
        if (newContent !== content) {
            setContent(id, newContent)
        }
    }

    const handleFocus = e => {
        setEditing(true)
    };

    const handleBlur = editor => {
        persistEdit(editor)
    };

    const handleKeyDown = (event, editor) => {
        console.log(event)
        if (event.key === 'Escape') {
            setEditing(false)
            resetFocus()
            return false
        }
        if (event.ctrlKey && event.key === 'Enter') {
            persistEdit(editor)
            resetFocus()
            return false
        }
    }

    return <CKEditor
        editor={ClassicEditor}
        data={content}
        mention={['test', 'test2']}
        onChange={ ( event, editor ) => {
            handleKeyDown(event, editor)
        } }
        onBlur={ ( event, editor ) => {
            handleBlur(editor)
        } }
        onFocus={ ( event, editor ) => {
            handleFocus(editor)
        } }
    />
}

const mapStateToProps = (state, ownProps) => {
    const getContentByLabel = makeGetNoteByLabel(ownProps.name)
    return {
        note: getContentByLabel(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
    setContent: (id, content) => setNote({label: ownProps.name, id, content}),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
