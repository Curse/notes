import * as userSelectors from "../auth/selectors";
import {connect} from "react-redux";
import styled from "styled-components";
import * as React from "react";
import * as notesSelectors from "../notes/selectors";
import {push} from "connected-react-router";
import {bindActionCreators} from "redux";

interface SearchDarkenerProps {
    editing: boolean
}

const SearchDarkener = styled.div<SearchDarkenerProps>`
  position:absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #212121;
  opacity: ${props => props.editing ? 0.85 : 0};
  pointer-events: ${props => props.editing ? 'all' : 'none'};
`

const SearchInput = styled.input`
box-shadow: black;
    position: absolute;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -22px);
    height: 44px;
    font-size: 34px;
    border-radius: 5px;
`

const SearchResult = styled.div`
  background-color: #EAEAEA;
  position: absolute;
  width: 80%;
  max-height: 30%;
  top: calc(50% + 22px + 5px);
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 5px;
  overflow: scroll;
  text-align: left;
`

const SearchResultItem = styled.button`
  display: flex;
  width: 100%;
  height: 22px;
  background-color: #EAEAEA;
  background-repeat: no-repeat;
  appearance: none;
  border: none;
  overflow: hidden;
  outline: none;
  text-align: left;
  
  &--selected,
  &:hover,
  &:focus {
    background: pink;
  }
`

const SearchResultItemLabel = styled.span`
  background-color: transparent;
  font-weight: 500;
  margin-right: 10px;
`

const SearchResultItemDetail = styled.span`
  color: grey;
`

const SearchCloseButton = styled.button`
  position: absolute;
  top: calc(50% - 22px - 28px - 5px);
  right: 10%;
  width: 28px;
  height: 28px;
  background: grey;
  border: none;
  color: white;
  font-weight: 500;
  font-size: 22px;
  border-radius: 50%;
  opacity: 1;
  outline: none;
`

const SearchBar = ({notes, paths, navigate}) => {
    const searchArea = React.useRef(null)
    const searchInput = React.useRef(null)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [editing, setEditing] = React.useState(false)
    const [position, setPosition] = React.useState(0)
    const [filteredNotes, setFilteredNotes] = React.useState([])

    const updateDisplayedPage = () => {
        if (position >= 0 && position < filteredNotes.length) {
            const note = filteredNotes[position]
            if (note) {
                const noteLabel = note[0]
                const path = paths.find(x => x.label === noteLabel).path
                navigate(path)
            }
        }
    }

    React.useEffect(() => {
        const callback = (evt) => {
            if (!editing && evt.shiftKey && evt.key === 'F') {
                setEditing(true)
                searchInput.current.focus()
                evt.preventDefault()
            } else if (editing) {
                switch (evt.key) {
                    case 'Escape': {
                        setEditing(false)
                        evt.preventDefault()
                        break;
                    }
                    case 'ArrowUp': {
                        if (position > 0) {
                            console.log('Previous Position: ' + position)
                            setPosition(position - 1)
                            console.log('Displaying Position: ' + position)
                            updateDisplayedPage()
                            evt.preventDefault()
                            break;
                        }
                    }
                    case 'ArrowDown': {
                        if (position < filteredNotes.length) {
                            setPosition(position + 1)
                            updateDisplayedPage()
                            evt.preventDefault()
                            break;
                        }
                    }
                }
            }
        }
        document.addEventListener('keydown', callback)
        return () => {
            document.removeEventListener('keydown', callback)
        }
    }, [editing, position, filteredNotes, setPosition, updateDisplayedPage])

    const handleOnChange = e => {
        setSearchQuery(e.target.value)
        setFilteredNotes(notes.filter(x => filter(x)))
        setPosition(-1)
    }

    const filter = note => {
        return note &&
            ((note[0] && note[0].includes(searchQuery))
                || (note[1] && note[1].content && note[1].content.includes(searchQuery)))
    }

    const handleResultItemOnClick = (noteLabel) => {
        const path = paths.find(x => x.label === noteLabel).path
        navigate(path)
        setEditing(false)
    }

    const searchResultItems = filteredNotes.map((n, index) =>
        <SearchResultItem
            className={(index==position ? '--selected' : '')}
            key={n[1].id}
            onClick={e => handleResultItemOnClick(n[0])}>
            <SearchResultItemLabel>@{n[0]}</SearchResultItemLabel>
            <SearchResultItemDetail>{n[1].content}</SearchResultItemDetail>
        </SearchResultItem>
    );

    return (
        <SearchDarkener ref={searchArea} editing={editing}>
            <SearchCloseButton onClick={e => setEditing(false)}>X</SearchCloseButton>
            <SearchInput ref={searchInput} onChange={handleOnChange}/>
            <SearchResult>
                {searchResultItems}
            </SearchResult>
        </SearchDarkener>
    )
}

const mapStateToProps = (state) => ({
    notes: notesSelectors.getNotes(state),
    paths: notesSelectors.getPaths(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    navigate: (label) => push(label)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
