import * as userSelectors from "../auth/selectors";
import {connect} from "react-redux";
import styled from "styled-components";
import * as React from "react";
import * as notesSelectors from "../notes/selectors";

const SearchDarkener = styled.div`
  position:absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #212121;
  opacity: 0.85;
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
`

const SearchResultItem = styled.div`
  width: 100%;
  height: 22px;
  background-color: transparent;
  overflow: hidden;
`

const SearchResultItemLabel = styled.span`
  font-weight: 500;
  margin-right: 10px;
`

const SearchResultItemDetail = styled.span`
  color: grey;
`

const SearchBar = ({notes}) => {
    const [searchQuery, setSearchQuery] = React.useState('')

    const handleOnChange = e => {
        setSearchQuery(e.target.value)
    }

    const filter = note => {
        return note &&
            ((note[0] && note[0].includes(searchQuery))
            || (note[1] && note[1].content && note[1].content.includes(searchQuery)))
    }

    const searchResultItems = notes.filter(x => filter(x)).map((n) =>
        <SearchResultItem key={n[1].id}>
            <SearchResultItemLabel>@{n[0]}</SearchResultItemLabel>
            <SearchResultItemDetail>{n[1].content}</SearchResultItemDetail>
        </SearchResultItem>
    );

    return (
        <SearchDarkener>
            <SearchInput onChange={handleOnChange}/>
            <SearchResult>
                {searchResultItems}
            </SearchResult>
        </SearchDarkener>
    )
}

const mapStateToProps = (state) => ({
    notes: notesSelectors.getNotes(state),
})

export default connect(mapStateToProps)(SearchBar)
