import { Provider } from 'react-redux'
import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'
import configureStore from './config/configure-store'
import history from './utils/history'
import firebase from 'firebase';
import * as _ from "lodash";
import { Login } from "./auth/Login";
import { setUser } from './auth/actions'
import ForceAuth from './auth/ForceAuth'
import UserBar from './user-bar/user-bar'
import styled, {ThemeProvider} from 'styled-components'
import EditableDiv from './editable-div'
import * as theme from './config/theme'
import { createGlobalStyle } from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp'
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown'
import UserStatus from './user-status/user-status'

import "normalize.css";

const store = configureStore({}, history)

// Configure Firebase.
var firebaseConfig = {
    apiKey: "AIzaSyBR2o33lqBdQsoHD4X1uppI93k2fVDeQsw",
    authDomain: "curse-notes.firebaseapp.com",
    databaseURL: "https://curse-notes.firebaseio.com",
    projectId: "curse-notes",
    storageBucket: "curse-notes.appspot.com",
    messagingSenderId: "715608577655",
    appId: "1:715608577655:web:b80968c875c4d3a1601872"
  };
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged( user => store.dispatch(setUser(user)))


const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed&display=swap");

  * {
    box-sizing: border-box;
  }

  body {
    background-position: center top;
    @media (max-width: 799px) {
      background-image: none !important;    
    }
  }
  
`

const Wrap = styled.div`
  font-family: 'Roboto', sans-serif;
`

const NotesBar = styled.div`
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 800px) {
    min-height: auto;
    position: fixed;
    bottom: 0;
    right: 30px;
    
    border-color: ${({theme})=>theme.highlight};
    border-style: solid;
    border-width: 3px;
    border-bottom: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .3);
    height: 31px;
    width: 180px;
      &.open {
        height: 400px;
        width: 450px;
      }
  } 
`

const StyledUserStatus = styled(UserStatus)`
  bottom: 0;
  right: 0;
`

const NotesHeader = styled.div`
  background-color: ${({theme})=>theme.highlight};
  font-family: 'Roboto Condensed', sans-serif;
  color: white;
  padding: 5px 10px 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const NoteContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`

const App = () => {
  const [open, setOpen] = React.useState(true)

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <Wrap>
              <GlobalStyle/>
              <ForceAuth>
                <NotesBar className={open ? 'open' : ''}>
                  <NotesHeader onClick={()=>setOpen(!open)}>Road to Redemption<FontAwesomeIcon icon={open ? faAngleDoubleDown: faAngleDoubleUp} /></NotesHeader>
                  <UserBar/>
                    <NoteContainer>
                        <Route exact={true} path={`/notes/`} component={Home} />
                        <Route path={`/notes/p/:pageId`} component={Page} />
                    </NoteContainer>
                  <StyledUserStatus/>
                </NotesBar>
              </ForceAuth>
            </Wrap>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  )
};

const Home = ({ match }) => <EditableDiv name="home"/>

const Page = ({ match }) => <EditableDiv name={match.params.pageId}/>;

const rootElement = document.getElementById("root");
render(<App />, rootElement);
