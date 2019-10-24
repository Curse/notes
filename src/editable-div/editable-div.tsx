import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {makeGetNoteByLabel} from '../notes/selectors'
import {setNote} from '../notes/actions'
import SimpleRender from './simple-render'
import styled from 'styled-components'

const Wrap = styled.div`
    outline: none;
    width: 100%;
`

const Text = styled.div`
    outline: none;
    display: inline-block;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgba(0,0,0,0/9);
    padding: 3px 2px;
    min-height: 1em;
    color: rgba(0,0,0,0.9);
`

const defaultContent = "Type here..."

const EditableDiv = ({
    name,
    note,
    setContent,
}) => {
    const {
        id = null,
        content = defaultContent,
    } = note || {}
    const [editing, setEditing] = React.useState(false)
    const noteStart = React.useRef(null)
    const editableDiv = React.useRef(null)

    const resetFocus = () => {
        noteStart.current.focus()
    }

    React.useEffect(()=>{
        if (!editing){
            return
        }
        const handler = (event) => {
            if (event.target !== editableDiv.current) {
                resetFocus()
            }
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    },[editing])

    const persistEdit = () => {
        const newContent = editableDiv.current.innerText
        setEditing(false)
        if (newContent !== content) {
            setContent(id, newContent)
        }
    }

    const handleBlur = e => {
        persistEdit()
    };

    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            setEditing(false)
            resetFocus()
            return false
        }
        if (e.ctrlKey && e.key === 'Enter') {
            persistEdit()
            resetFocus()
            return false
        }
    }

    return (
        <Wrap ref={noteStart} tabIndex={0}>
            <Text
                id={name}
                ref={editableDiv}
                contentEditable
                onFocus={e => setEditing(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onKeyUp={()=>console.log(editableDiv.current.innerHTML)}
                suppressContentEditableWarning={true}
            >
            {editing
                ? content
                : <SimpleRender text={content}/>}
            </Text>
        </Wrap>
    );
};

const mapStateToProps = (state, ownProps) => {
    const getContentByLabel = makeGetNoteByLabel(ownProps.name)
    return {
        note: getContentByLabel(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
    setContent: (id, content) => setNote({label: ownProps.name, id, content}),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditableDiv)
