import React, { Component } from 'react';
import { Alert, Form, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class CreateNurse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      tel: '',
      showAlert: false
    }
  }

  nurses = [];

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  saveData = e => {
    e.preventDefault();
    let newNurse = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      tel: this.state.tel
    }

    var token = localStorage.getItem("jwt");

    axios.post('https://yournurse.herokuapp.com/api/nurses', newNurse, { headers: { Authorization: token } })

    this.setState({
      firstname: '',
      lastname: '',
      tel: '',
      showAlert: true
    })
  }

  render() {

    let alert;
    if(this.state.showAlert){
      alert = (
          <ReactCSSTransitionGroup
              transitionName="fadeFromTop"
              transitionAppear={true}
              transitionAppearTimeout={3500}
              transitionLeave={false}
  			      transitionEnter={false}>
                  <Alert bsStyle="success">Pielęgniarka została dodana!</Alert>
          </ReactCSSTransitionGroup>
      )
    } else alert = '';

    return (
      <div>
      <div className="top-bar">Tworzenie pielęgniarki</div>
      <ReactCSSTransitionGroup
          transitionName="fadeFromTop"
          transitionAppear={true}
          transitionAppearTimeout={3500}
          transitionLeave={false}
          transitionEnter={false}>
              <div className="content-wrapper">
                <Col lg={6} md={10} sm={12}>
                  <div className="boxWrapper">
                    <div className="boxTitle">Dodaj pięlęgniarkę</div>
            { alert }
                    <Form horizontal onSubmit={e => this.saveData(e)}>
                      <FormGroup controlId="formHorizontalEmail">
                        <Col sm={9}>
                          <span className="inputSpan fa fa-user"></span>
                          <FormControl
                              required
                              className="nurseInput"
                              type="text"
                              placeholder="Imię"
                              name="firstname"
                              value={this.state.firstname}
                              onChange={e => this.onChange(e)}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalPassword">
                        <Col sm={9}>
                          <span className="inputSpan fa fa-user"></span>
                          <FormControl
                              required
                              className="nurseInput"
                              type="text"
                              placeholder="Nazwisko"
                              name="lastname"
                              value={this.state.lastname}
                              onChange={e => this.onChange(e)}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalPassword" >
                        <Col sm={9}>
                          <span className="inputSpan fa fa-phone"></span>
                          <FormControl
                              className="nurseInput"
                              type="text"
                              placeholder="Numer"
                              name="tel"
                              maxLength="9"
                              value={this.state.tel}
                              onChange={e => this.onChange(e)}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Col sm={3}>
                          <Button className="nurseBtn" type="submit">Dodaj</Button>
                        </Col>
                      </FormGroup>
                    </Form>
                  </div>
                </Col>
              </div>
          </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default CreateNurse;
