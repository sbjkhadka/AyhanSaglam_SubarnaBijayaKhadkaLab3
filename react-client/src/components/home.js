import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Landing from '../components/Landing';



function Home(props) {
  // this state holds the email address of currently loggged in student
  const [currentLoggedIn, setCurrentLoggedIn] = useState("noOne");
  const [student, setStudent] = useState({
    email: "",
    password: "",
  });

  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "http://localhost:5000/login";

  const onChange = (e) => {
    console.log(e.target.value);
    e.persist();
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const loginStudent = (e) => {
    console.log("sending_login");
    setShowLoading(true);
    e.preventDefault();
    const data = {
      email: student.email,
      password: student.password,
    };
    axios
      .post(apiUrl, data)
      .then((res) => {
        setShowLoading(false);
        if (res.data.currentLoggedIn !== undefined) {
          setCurrentLoggedIn(res.data.currentLoggedIn);
          console.log(res);
          localStorage.setItem('authKey', res.data.token);
        }
      })
      .catch((error) => {
        setShowLoading(false);
      });
  };

  const readCookie = async () => {
    try {
        console.log("--- in readCookie function ---");
        axios.post("http://localhost:5000/read_cookie", {authKey: localStorage.getItem('authKey')}).then(res=>{
          if (res.data.currentLoggedIn !== undefined) {
            setCurrentLoggedIn(res.data.currentLoggedIn);
            console.log(res.data.currentLoggedIn);
          }
        });

    } catch (e) {
      setCurrentLoggedIn("noOne");
      console.log(e);
    }
  };

  useEffect(() => {
    console.log('use effect called')
    readCookie();
  }, []); //only the first render

  
const handleLogout = (e) => {
  e.preventDefault();
  axios.get("http://localhost:5000/logout");
  localStorage.removeItem("authKey");
  setCurrentLoggedIn("noOne");
}

  return (
    <div>
      <a href="#" onClick={handleLogout}>
        logout
      </a>
      {showLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {currentLoggedIn === "noOne" ? (
        <Form onSubmit={loginStudent}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              id="email"
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
           </Button>
        </Form>
      ) : (
        <Landing />
      )}
    </div>
  );
}
export default withRouter(Home);