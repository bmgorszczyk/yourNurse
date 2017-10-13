import React, { Component } from 'react';
import { Form, Col, FormGroup, FormControl, Button,  ControlLabel, Checkbox} from 'react-bootstrap';
import { Link } from 'react-router';

class Register extends Component {
  render() {
    return (
      <div className="container vertical-center">
          <Col sm={4} className="col-sm-offset-4">
            <Form horizontal>

              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  First name
                </Col>
                <Col sm={10}>
                  <FormControl type="email" placeholder="First name" />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  Last name
                </Col>
                <Col sm={10}>
                  <FormControl type="email" placeholder="Last name" />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  Email
                </Col>
                <Col sm={10}>
                  <FormControl type="email" placeholder="Email" />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={2}>
                  Password
                </Col>
                <Col sm={10}>
                  <FormControl type="password" placeholder="Password" />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Checkbox>Remember me</Checkbox>
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit">
                    Sign up
                  </Button>
                </Col>
              </FormGroup>
          </Form>
          <Link to="/login">Sign in</Link>
        </Col>
  	  </div>
    )
  }
}

export default Register;
