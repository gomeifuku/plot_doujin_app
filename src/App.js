'use strict'
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import MainSection from './components/MainSection';

//import {parseTime} from "../utils/dates"



//setInterval(function(){this.setState({date:new Date()})}, 1000);

class App extends Component {
    render() {
        return (
            <div className="App">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className="App-header">
                              <Header />
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>

                </div>
              </MuiThemeProvider>
                <p className="App-intro">
                    To get started, edit
                    <code>src/App.js</code>
                    and save to reload.
                </p>
                <MainSection />
            </div>
        );
    }
}
export default App;
