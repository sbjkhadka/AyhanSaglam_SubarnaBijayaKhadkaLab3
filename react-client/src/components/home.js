import React, { useState } from "react";
import { withRouter } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
 function Home(props) {
     const [student, setStudent] = useState({
         email: '',
         password: ''
     });

     const [showLoading, setShowLoading] = useState(false);
     const apiUrl = "http://localhost:5000/login/";

    const onChange = (e) => {
        console.log(e.target.value);
        e.persist();
        setStudent({...student, [e.target.name]: e.target.value});
    };

    const loginStudent = (e) => {
        console.log('sending_login');
        setShowLoading(true);
        e.preventDefault();
        const data = {
            email: student.email, 
            password: student.password
        };
        axios
          .post(apiUrl, data)
          .then((result) => {
            setShowLoading(false);
            props.history.push("/show/" + result.data._id);
          })
          .catch((error) => {
            setShowLoading(false);
          });
    };

     return (
       <Form onSubmit={loginStudent}>
         <Form.Group>
           <Form.Label>Email</Form.Label>
           <Form.Control
             type="email"
             name="email"
             id="email"
             onChange={onChange}
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
           />
         </Form.Group>

         <Button variant="primary" type="submit">
           Login
         </Button>
       </Form>
     );
 }
 export default withRouter(Home);