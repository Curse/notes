import {Provider} from 'react-redux'
import React, {useState, useEffect, useRef} from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {ConnectedRouter} from 'connected-react-router'
import configureStore from './config/configure-store'
import history from './utils/history'
import firebase from 'firebase';
import * as _ from "lodash";
import {Login} from "./auth/Login";
import {setUser} from './auth/actions'
import ForceAuth from './auth/ForceAuth'
import UserBar from './user-bar/user-bar'
import SearchBar from './search/search'
import styled, {ThemeProvider} from 'styled-components'
import EditableDiv from './editable-div'
import * as theme from './config/theme'
import {createGlobalStyle} from "styled-components"

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
firebase.auth().onAuthStateChanged(user => store.dispatch(setUser(user)))


const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Lato&display=swap");

  * {
    box-sizing: border-box;
  }
`

const Wrap = styled.div`
  font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
    "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
`

const App = () => (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Wrap>
                <GlobalStyle/>
                <ForceAuth>
                    <UserBar/>
                    <ConnectedRouter history={history}>
                        <Route exact={true} path="/notes/" component={Home}/>
                        <Route path="/notes/p/:pageId" component={Page}/>
                    </ConnectedRouter>
                    <SearchBar/>
                </ForceAuth>
            </Wrap>
        </Provider>
    </ThemeProvider>
);

const Home = ({match}) => <EditableDiv name="home"/>

const Page = ({match}) => <EditableDiv name={match.params.pageId}/>;

const rootElement = document.getElementById("root");
render(<App/>, rootElement);
