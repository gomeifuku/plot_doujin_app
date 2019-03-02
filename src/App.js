'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import logo from './logo.svg'
import './App.css'
import Header from './Header'
import MainSection from './components/MainSection'
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
                <MainSection classes={class_name_list}/>
            </div>
        );
    }
}
export default App;
