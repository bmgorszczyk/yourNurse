import React, { Component } from 'react';
import logo from '../../assets/img/nurse_logo.png';
import { Alert, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import axios from 'axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

class Login extends Component {

  constructor(props){
    super();
    this.state = {
      login: '',
      password: '',
      showAlert: false,
      message: '',
      showSpinner: false
    }
  }

  authenticate(e){
      e.preventDefault();
      this.setState({showSpinner: true, showAlert: false});
      var data = {
        login: this.state.login,
        password: this.state.password
      }
	  var token = localStorage.getItem("jwt");

	  axios.post('https://yournurse.herokuapp.com/api/authenticate', data, { headers: { Authorization: token } })
		  .then(res => {
		      if(res.data.success){
              const token = res.data.token;
              localStorage.setItem('jwt', token);
		          setTimeout(() => {
      					  this.setState({showAlert: false, showSpinner: false})
      					  browserHistory.push('/dashboard');
                }, 1500)

              } else {
				  setTimeout(() => {
					  this.setState({showAlert: true, message: res.data.message, showSpinner: false});
				  }, 1500);
              }
		  });
  }

  render() {

    let alert, spinner;

    if(this.state.showSpinner) {
		spinner = (
			<ReactCSSTransitionGroup
				transitionName="list"
				transitionAppear={true}
				transitionAppearTimeout={1500}>
				<span>Logowanie<span className="fa fa-circle-o-notch fa-spin"></span></span>
			</ReactCSSTransitionGroup>
			)
	} else {
		spinner = (
				 <ReactCSSTransitionGroup
					  transitionName="list"
					  transitionAppear={true}
					  transitionAppearTimeout={1500}>
						<span>Zaloguj się</span>
		     	 </ReactCSSTransitionGroup>
		)
	}
    if (this.state.showAlert) {
      alert = (
		  <ReactCSSTransitionGroup
			  transitionName="list"
			  transitionAppear={true}
			  transitionAppearTimeout={1500}>

				<Alert className="alert-danger" bsStyle="warning"><span className="fa fa-exclamation-circle"></span>{this.state.message}</Alert>
		  </ReactCSSTransitionGroup>
      )
    } else alert = ' ';

    return (
      <div className="container vertical-center login">
      <ReactCSSTransitionGroup
          transitionName="fadeFromTop"
          transitionAppear={true}
          transitionAppearTimeout={1500}>
              <div className="loginWrapper">
                <div className="logoContainer">
					            <Link to="/"> <img src={logo} alt="logo" /> </Link>
                </div>
                <div className="helloText">Witaj w programie do tworzenia grafików yournurse. Zaloguj się!</div>
			    <div className="alertWrapper">
					{ alert }
				</div>
                <Form horizontal onSubmit={this.authenticate.bind(this)}>
                  <FormGroup className="inputWrapper" controlId="formHorizontalEmail">
					  <span className="inputSpan fa fa-user-o"></span>
                      <FormControl
						  className="nurseInput"
						  type="text"
                          placeholder="Login"
                          onChange={e => this.setState({login: e.currentTarget.value})}
                      />
                  </FormGroup>

                  <FormGroup className="inputWrapper" controlId="formHorizontalPassword">
					  <span className="inputSpan fa fa-lock"></span>
                      <FormControl
						  className="nurseInput"
						  type="password"
                          placeholder="Hasło"
                          onChange={e => this.setState({password: e.currentTarget.value})}
                      />
                  </FormGroup>

                  <FormGroup>
					  <Button className="nurseBtn" type="submit">{ spinner }</Button>
                  </FormGroup>
                </Form>
              </div>
          </ReactCSSTransitionGroup>
  	  </div>
    )
  }
}

export default Login;
