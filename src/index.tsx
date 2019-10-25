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
import bgi from './sheet-bg.png'

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
    background-image: url(${bgi});
    background-position: center top;
  }
`

const Wrap = styled.div`
  font-family: 'Roboto', sans-serif;
`

const NotesBar = styled.div`
  position: fixed;
  bottom: 0;
  right: 30px;
  width: 450px;
  background-color: #fff;
  border-color: ${({theme})=>theme.highlight};
  border-style: solid;
  border-width: 3px;
  border-bottom: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .3);
  height: 31px;
  &.open {
    height: 400px;
  }
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

const App = () => {
  const [open, setOpen] = React.useState(true)

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Wrap>
          <GlobalStyle/>
          <ForceAuth>
            <NotesBar className={open ? 'open' : ''}>
              <NotesHeader onClick={()=>setOpen(!open)}>Road to Redemption<FontAwesomeIcon icon={open ? faAngleDoubleDown: faAngleDoubleUp} /></NotesHeader>
              <UserBar/>
              <ConnectedRouter history={history}>
                <Route exact={true} path={`${process.env.PUBLIC_URL}/`} component={Home} />
                <Route path={`${process.env.PUBLIC_URL}/p/:pageId`} component={Page} />
              </ConnectedRouter>
            </NotesBar>
          </ForceAuth>
        </Wrap>
      </Provider>
    </ThemeProvider>
  )
};

const Home = ({ match }) => <EditableDiv name="home"/>

const Page = ({ match }) => <EditableDiv name={match.params.pageId}/>;

const rootElement = document.getElementById("root");
render(<App />, rootElement);
