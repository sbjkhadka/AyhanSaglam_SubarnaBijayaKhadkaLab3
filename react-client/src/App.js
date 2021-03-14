import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import './App.css';
import Create from './components/createStudent';
import Home from './components/home';
import {Button} from 'react-bootstrap';


function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Router>
        <div className="d-flex flex-row justify-content-around h-100 w-100">
          <div className="w-25" style={{ backgroundColor: "lavender" }}>
            <a href="/create">Create new user</a>
            <br />
            <a href="/">Home</a>
          </div>
          <div className="w-75">
            <Route render={() => <Home />} path="/" />
            <Route render={() => <Create />} path="/create" />
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
