import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from "react-router-dom";
import './App.css';
import Create from './components/createStudent';
import Home from './components/home';


function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Router>
        <div className="d-flex flex-row justify-content-around h-100 w-100">
          <div className="w-25" style={{ backgroundColor: "lavender" }}>
            <nav>
              <Link to={"/"}>Home</Link>
              <br />
              <Link to={"/create"}>Create new user</Link>
              <br />
            </nav>
          </div>
          <div className="w-75">
            <Switch>
              <Route render={() => <Create />} path="/create" />
              <Route render={() => <Home />} path="/" />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
