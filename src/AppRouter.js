import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Guide from './components/guide';
import Formation from './components/formation';
import NextFormation from './components/nextformation'; 
import './App.css';
  
class App extends Component {
render() {
    return (
    <Router>
        <Routes>
                <Route exact path='/' element={< Guide />}></Route>
                <Route exact path='/login' element={< Login />}></Route>
                <Route exact path='/guide' element={< Guide />}></Route>
                <Route exact path='/formation' element={< Formation />}></Route>
                <Route exact path= '/nextformation' element={< NextFormation />}></Route>
        </Routes>
    </Router>
);
}
}
  
export default App;