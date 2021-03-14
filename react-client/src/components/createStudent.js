import React, {useState} from 'react';
import { withRouter } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
function Create(props) {
    const [student, setStudent] = useState({
        _id: '',
        studentNumber: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        program: ''
    });

    const [showLoading, setShowLoading] = useState(false);
    const apiUrl = 'http://localhost:5000/create/';

    const onChange = (e) => {
        e.persist();
        setStudent({...student, [e.target.name]:e.target.value});
    };

    const saveStudent = (e) => {
        console.log('sending');
        setShowLoading(true);
        e.preventDefault();
        const data = {
          studentNumber: student.studentNumber,
          password: student.password,
          firstName: student.firstName,
          lastName: student.lastName,
          address: student.address,
          phone: student.phone,
          email: student.email,
          program: student.program,
        };
        axios.post(apiUrl, data)
        .then(result => {
            setShowLoading(false);
            props.history.push('/show/'+result.data._id)
        }).catch((error) => {
            setShowLoading(false);
        });
    };

    return (
      <Form onSubmit={saveStudent}>
        <Form.Group>
          <Form.Label>Student Number</Form.Label>
          <Form.Control
            type="text"
            name="studentNumber"
            id="studentNumber"
            placeholder="Student Number"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            name="password"
            id="password"
            placeholder="Password"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="city"
            id="city"
            placeholder="city"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            id="phone"
            placeholder="Phone"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Program</Form.Label>
          <Form.Control
            as="select"
            name="program"
            id="program"
            onChange={onChange}
          >
            <option value="software">Software Engineering</option>
            <option value="electronics">Electronics Engineering</option>
            <option value="electrical">Electrical Engineering</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    );
}

export default withRouter(Create);