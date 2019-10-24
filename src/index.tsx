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
import Editor from './editor/editor'

import "normalize.css";

const store = configureStore({}, history)

// Configure Firebase.
const config = {
  apiKey: "AIzaSyCn5nqB4w-zjYUEXnh3JuTV4ogkHkiZKRQ",
  authDomain: "notesapp-ec179.firebaseapp.com",
  databaseURL: "https://notesapp-ec179.firebaseio.com",
  projectId: "notesapp-ec179",
  storageBucket: "",
  messagingSenderId: "795682020834",
  appId: "1:795682020834:web:9aff90c0dc116ceca4edbb",
  measurementId: "G-CW0PVM7GRW"
};
firebase.initializeApp(config);
firebase.analytics();
firebase.auth().onAuthStateChanged( user => store.dispatch(setUser(user)))


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
            <Route exact={true} path="/" component={Home} />
            <Route path="/p/:pageId" component={Page} />
          </ConnectedRouter>
        </ForceAuth>
      </Wrap>
    </Provider>
  </ThemeProvider>
);

const Home = ({ match }) => <EditableDiv name="home"/>

const Page = ({ match }) => <Editor name={match.params.pageId}/>;

const rootElement = document.getElementById("root");
render(<App />, rootElement);
