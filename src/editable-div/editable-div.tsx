import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getSuggestableNotes, makeGetNoteByLabel} from '../notes/selectors'
import {setNote} from '../notes/actions'
import SimpleRender from './simple-render'
import styled from 'styled-components'
import { MentionsInput, Mention } from 'react-mentions'
import defaultStyles from './defaultStyles'

const Wrap = styled.div`
    outline: none;
    position:relative;
    width: 100%;
`

const StyledMentionsInput = styled(MentionsInput)`
    outline: none;
    display: inline-block;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgba(0,0,0,0/9);
    padding: 3px 2px;
    min-height: 1em;
    color: rgba(0,0,0,0.9);
    border: none;
    
    textarea {
        border: none;
    }
`

const SaveButton = styled.button`
  position:absolute;
  top: 0;
  right: 0;
  opacity: 0.5;
  &:hover,
  &:focus {
    opacity: 1;
  }
`

const defaultContent = "Type here..."

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  }
  return caretPos;
}

const EditableDiv = ({
    name,
    note,
    suggestions,
    setContent,
}) => {
    const {
        id = null,
        content = defaultContent,
    } = note || {}
    const [editing, setEditing] = React.useState(false)
    const [contentState, setContentState] = React.useState(content)
    const [cursorPosition, setCursorPosition] = React.useState(null)
    const noteStart = React.useRef(null)
    const editableDiv = React.useRef(null)


    const resetFocus = () => {
        // noteStart.current.focus()
    }

    React.useEffect(()=>{
        setContentState(content)
    },[content])

    React.useEffect(()=>{
        if (!editing){
            return
        }
        console.log(cursorPosition)
        console.log(editableDiv)
        // @ts-ignore

        window.setTimeout(() => {
            editableDiv.current.focus()
            editableDiv.current.setSelectionRange(cursorPosition, cursorPosition)
        }, 1)
    },[editing, cursorPosition])

    const persistEdit = () => {
        const newContent = contentState
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

    const handleEditStart = e => {
        setEditing(true)
        setCursorPosition(getCaretPosition(e.target))
    }

    return (
        <Wrap ref={noteStart} tabIndex={0}>
            {editing
            ? <MentionsInput
                    value={contentState}
                    onChange={(e)=>setContentState(e.target.value)}
                    style={defaultStyles}
                    onKeyDown={handleKeyDown}
                    inputRef={editableDiv}
                >
                  <Mention
                    trigger="@"
                    data={suggestions}
                    markup={'@__display__'}
                    displayTransform={(id, display) => `@${display}`}
                  />
                </MentionsInput>
            : <div
                contentEditable
                onClick={handleEditStart}
                >
                <SimpleRender text={content}/>
              </div>}
            {editing && <SaveButton onClick={()=>persistEdit()}>Save</SaveButton>}
        </Wrap>
    );
};

const mapStateToProps = (state, ownProps) => {
    const getContentByLabel = makeGetNoteByLabel(ownProps.name)
    return {
        note: getContentByLabel(state),
        suggestions: getSuggestableNotes(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
    setContent: (id, content) => setNote({label: ownProps.name, id, content}),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditableDiv)