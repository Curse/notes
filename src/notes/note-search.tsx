import React from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as notesSelectors from './selectors'
import styled from 'styled-components'
import { push } from 'connected-react-router'

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


const NoteSearch = ({paths, navigate}) => {
    const search = React.useRef(null)
    const options = paths.map(path => ({value: path.path, label: `@${path.label}`}))

    React.useEffect(() => {
        const callback = (evt) => {
          if (evt.shiftKey && evt.ctrlKey && evt.key === 'F') {
            search.current.focus()
          }
        }
        document.addEventListener('keydown', callback)
        return () => {
          document.removeEventListener('keydown', callback)
        }
      }, [])

    return (
        <Wrap>
            <Select
                ref={search}
                value=''
                onChange={(option) => navigate(option.value)} 
                options={options}
                className="bbbababb"
                placeholder="Jump to a note stub"
                styles={customStyles}
            />
        </Wrap>
    )
}

const mapStateToProps = (state) => ({
    labels: notesSelectors.getLabels(state),
    paths: notesSelectors.getPaths(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    navigate: (label) => push(label)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NoteSearch)