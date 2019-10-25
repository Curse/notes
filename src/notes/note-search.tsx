import React from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as notesSelectors from './selectors'
import styled from 'styled-components'
import { push } from 'connected-react-router'
import { setNote } from "./actions";

const Wrap = styled.div`
    position: relative;
    width: 100%;

    .react-autosuggest__container {
        background-color: red;
        position: relative;
    }
`

const customStyles = {
    menu: (provided) => ({
        ...provided,
        marginTop: 0,
    })
}


const NoteSearch = ({paths, navigate, createNoteFromTerm}) => {
    const search = React.useRef(null)
    const options = paths.map(path => ({value: path.path, label: `@${path.label}`}))

    React.useEffect(() => {
        const callback = (evt) => {
            if (evt.shiftKey && evt.ctrlKey && evt.key === 'F') {
                search.current.focus()
            }
            if (evt.key === 'Enter') {
                // determine if the input value is an existing entity
                const term = evt.target.value
                const path = paths.find(function(path) {
                    return path.label.startsWith(term)
                })

                console.log(term)
                console.log(path)

                // if this entity does not match anything, create it
                if (path === undefined) {
                    createNoteFromTerm(term)
                    navigate(`${process.env.PUBLIC_URL}/p/${term}/`)
                } else {
                    evt.preventDefault()
                }
            }
        }
        document.addEventListener('keydown', callback)
        return () => {
          document.removeEventListener('keydown', callback)
        }
      }, [paths])

    return (
        <Wrap>
            <Select
                ref={search}
                value=''
                onChange={(option) => navigate(option.value)}
                options={options}
                placeholder="Jump to a note stub"
                styles={customStyles}
                noOptionsMessage={({inputValue})=>`Press [Enter] to create "${inputValue}"`}
            />
        </Wrap>
    )
}

const mapStateToProps = (state) => ({
    labels: notesSelectors.getLabels(state),
    paths: notesSelectors.getPaths(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    navigate: (label) => push(label),
    createNoteFromTerm: (label) => setNote({
        label,
        content: '',
        persist: true
    })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NoteSearch)