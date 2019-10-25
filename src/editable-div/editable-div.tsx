import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getSuggestableNotes, makeGetNoteByLabel} from '../notes/selectors'
import {setNote} from '../notes/actions'
import SimpleRender from './simple-render'
import styled from 'styled-components'
import { MentionsInput, Mention } from 'react-mentions'
import defaultStyles from './defaultStyles'

interface EditingStyleChangeFunction {
    editing: boolean
}

const Wrap = styled.div`
    padding: 0 5px;
    
    .editor {
      opacity: 0;
    }
    &.editing .editor{
      opacity: 1;
    }
`

const ContentWrap = styled.div`
    outline: none;
    position: relative;
    width: 100%;
    font-size: 14px;
    width: 100%;
    
    
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

const RenderedContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  pointer-events: none;
  
  a {
    pointer-events: all;
  }
`

const NoteLabel = styled.h2`
    margin: 10px 0 0 0;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
`

const defaultContent = "Type here..."


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
    const editableDiv = React.useRef(null)


    const resetFocus = () => {
        // noteStart.current.focus()
    }

    React.useEffect(()=>{
        setContentState(content)
    },[content])

    const persistEdit = () => {
        const newContent = contentState
        setEditing(false)
        if (newContent !== content) {
            setContent(id, newContent)
        }
    }

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
    }

    return (
        <Wrap className={editing ? 'editing': ''}>
            <NoteLabel>{name}</NoteLabel>
            <ContentWrap>
                <MentionsInput
                    key={'editable-content'}
                    value={contentState}
                    onChange={(e)=>setContentState(e.target.value)}
                    style={defaultStyles}
                    onKeyDown={handleKeyDown}
                    onClick={handleEditStart}
                    inputRef={editableDiv}
                    className={'editor'}
                >
                  <Mention
                    trigger="@"
                    data={suggestions}
                    displayTransform={(id, display) => `@${display}`}
                  />
                </MentionsInput>
                {!editing && <RenderedContent>
                    <div
                        contentEditable
                        suppressContentEditableWarning={true}
                        >
                        <SimpleRender text={content}/>
                    </div>
                </RenderedContent>}
                {editing && <SaveButton onClick={()=>persistEdit()}>Save</SaveButton>}
            </ContentWrap>
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