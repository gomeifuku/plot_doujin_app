'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import logo from './logo.svg'
import './App.css'
import Header from './Header'
import MainSection from './components/MainSection'

//import {parseTime} from "../utils/dates"



//setInterval(function(){this.setState({date:new Date()})}, 1000);

class App extends Component {
    render() {
      const class_name_list = {
        header:"header",
        list:"list",
        form:"form",
        footer:"footer"
      }

        return (
            <div className="App">
    { /*             <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className="App-header">
                          <Header />
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>

                </div>*
              </MuiThemeProvider>
                <p className="App-intro">
                    To get started, edit
                    <code>src/App.js</code>
                    and save to reload.
                </p>*/}
                <MainSection classes={class_name_list}/>
            </div>
        );
    }
}
export default App;
