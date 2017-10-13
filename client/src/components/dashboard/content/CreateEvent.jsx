import React, { Component } from 'react';
import { Alert, Modal, Button, Form, ControlLabel, FormControl, FormGroup, Radio } from 'react-bootstrap';

import axios from 'axios';
import $ from 'jquery';

class CreateEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      nurses: [],
      events: [],
      showCreateModal: false,
      nurseData: '',
      shiftKind: '',
      shiftTime: '',
      shiftSymbol: '',
      shiftFunction: '',
      otherShiftHours: '',
      otherHours: '',
      otherMinutes: '',
      chooseFunction: false,
      date: '',
      monthYear: '',
      alertVisible: false,
      showInput: false,
      warning: false
    }
  }

  componentWillMount(){

  	var token = localStorage.getItem("jwt");

    axios.get('https://yournurse.herokuapp.com/api/nurses', { headers: { Authorization: token } })
        .then((res) => {
            const data = res.data;
            this.setState({ nurses: data })
        });
  }

  componentWillReceiveProps(props) {
    this.setState({
      date: props.createEv.date,
      monthYear: props.createEv.monthYear
    });
  }

  openCreateModal(){
    this.setState({
      showCreateModal: true,
      alertVisible: false
    });
  }

  close(){
    this.setState({
      showCreateModal: false,
      alertVisible: false,
      showInput: false,
      warning: false,
      shiftSymbol: '',
      chooseFunction: false,
      shiftTime: "",
      otherHours: "",
      otherMinutes: ""
    });
  }

  addEvent(){

    if((this.state.nurseData === "" || this.state.nurseData === undefined) || (this.state.shiftSymbol === "" || this.state.shiftSymbol === undefined)) {
      this.setState({warning: true});
      return;
    }
    if(this.state.shiftSymbol === "I") {

      var mins = this.state.otherMinutes;
      mins = (mins/60).toFixed(2);
      mins = Math.round(mins*100);
      mins = String(mins);
      if(mins < 10) mins = "0" + mins;
      var otherShiftTime = this.state.otherHours + '.' + mins;
      otherShiftTime = Number(otherShiftTime);
      this.setState({
        shiftTime: otherShiftTime
      })
    }


    var nurseData = this.state.nurseData;
    nurseData = nurseData.split("-");

    var nurseID = nurseData[0];
    var nurseName = nurseData[1];
    var nurseLastname = nurseName.split(' ');
    var nurseCutName = nurseLastname[1].substring(0,1) + '.';
    var nurseCutted = nurseLastname[0] + ' '+ nurseCutName;


    var DB_Event, FE_Event;

    if(this.state.shiftSymbol === "I"){
      DB_Event = {
        title: nurseCutted,
        start: this.state.date,
        description: this.state.shiftSymbol,
        nurseName: nurseName,
        shiftTime: otherShiftTime,
        monthYear: this.state.monthYear,
        nurseID: nurseID,
        shiftFunction: this.state.shiftFunction
      }

      FE_Event = {
        title: nurseCutted,
        start: this.state.date,
        description: this.state.shiftSymbol,
        nurseName: nurseName,
        shiftFunction: this.state.shiftFunction,
        shiftTime: otherShiftTime,
        monthYear: this.state.monthYear,
        nurseID: nurseID
      }
    } else {
      DB_Event = {
        title: nurseCutted,
        start: this.state.date,
        description: this.state.shiftSymbol,
        nurseName: nurseName,
        shiftTime: this.state.shiftTime,
        monthYear: this.state.monthYear,
        nurseID: nurseID,
        shiftFunction: this.state.shiftFunction
      }

      FE_Event = {
        title: nurseCutted,
        start: this.state.date,
        description: this.state.shiftSymbol,
        nurseName: nurseName,
        shiftFunction: this.state.shiftFunction,
        shiftTime: this.state.shiftTime,
        monthYear: this.state.monthYear,
        nurseID: nurseID
      }
    }

    if((this.state.shiftSymbol === "D" || this.state.shiftSymbol === "N" || this.state.shiftSymbol === "I") && (this.state.shiftFunction === "" || this.state.shiftFunction === undefined) || (this.state.otherHours === "" && this.state.otherMinutes === "")) {
      this.setState({warning: true});
    }
    else if (this.state.shiftSymbol !== "X" && this.state.otherHours === "0" && this.state.otherMinutes === "00") {
      this.setState({warning: true})
    } else {
	  var token = localStorage.getItem("jwt");

      axios.post('https://yournurse.herokuapp.com/api/events', DB_Event, { headers: { Authorization: token } })
          .then(res => {
              if(res.data.success) {
				          this.props.reFetch();
                  $("#calendar").fullCalendar('renderEvent', FE_Event);
                  this.setState({
                    showCreateModal: false,
                    warning: false,
                    nurseData: "",
                    shiftSymbol: "",
                    shiftTime: "",
                    otherHours: "",
                    otherMinutes: "",
                    showInput: false,
                    shiftFunction: ""
                  });
                  this.props.generateList();

              } else {
                this.setState({alertVisible: true});
              }
          }).catch(()=>{
            console.log('something went wrong')
          });
      }
  }

  render() {

    let content, button, alert, warning, inputHours, functions;

    if(this.state.showInput && (this.state.shiftTime !== 12 || this.state.shiftTime !== 7.58)) {
      inputHours = (
        <FormGroup className="form-inline">
            <FormControl
                  className="nurseSelect"
                  componentClass="select"
                  placeholder="select"
                  name="hours"
                  onChange={e => this.setState({otherHours: e.target.value})}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
            </FormControl>
            <FormControl
                className="nurseSelect"
                componentClass="select"
                placeholder="select"
                name="minutes"
                onChange={e => this.setState({otherMinutes: e.target.value})}
                >
                    <option value="00">00</option>
                    <option value="05">05</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                    <option value="55">55</option>
          </FormControl>
        </FormGroup>
      )
    } else {
      inputHours = '';
    }

    if (this.state.warning) {
      warning = (
        <Alert bsStyle="warning">Wybierz pielęgniarkę i rodzaj dyżuru!</Alert>
      )
    } else {
      warning = '';
    }

    if (this.state.alertVisible) {
      alert = (
        <Alert bsStyle="warning">Wybrana pielęgniarka ma już ustalony dyżur w tym dniu!</Alert>
      )
    } else {
      alert = '';
    }
    if(this.state.chooseFunction){
      functions = (
        <FormGroup>
          <ControlLabel>Funkcja na dyżurze</ControlLabel>
            <Radio
                name="shiftFunction"
                onClick={e => this.setState({shiftFunction: "L"})}
            >
              Leki
            </Radio>
            <Radio
                name="shiftFunction"
                onClick={e => this.setState({shiftFunction: "D"})}
            >
              Dokumenty
            </Radio>
            <Radio
                name="shiftFunction"
                onClick={e => this.setState({shiftFunction: "Z"})}
            >
              Zabiegi
            </Radio>
        </FormGroup>
      )
    } else functions = ' ';
    if (this.state.nurses === null || this.state.nurses.length === 0) {
        content = (
            <div>Nie zostały dodane żadne pielęgniarki!</div>
        )
    } else {
      content = (
          <div>
              <Form>
                <FormGroup controlId="formControlsSelect">
                  <ControlLabel>Pielęgniarka</ControlLabel>
                  <FormControl
                      className="nurseSelect"
                      componentClass="select"
                      placeholder="select"
                      onChange={e => this.setState({nurseData: e.target.value})}
                        >
          					      <option value="" selected data-default>Wybierz pielęgniarkę</option>

          						  {this.state.nurses.map(function(nurse, i){
          							  let nurseData = nurse._id+ "-" +nurse.lastname+ " " +nurse.firstname;
          							  return (
          							<option key={i} value={nurseData}>{nurse.lastname} {nurse.firstname}</option>
          							  )
          						  })}
                  </FormControl>
                </FormGroup>
                <FormGroup>
                    <div className="flexWrapper">
                      <div className="flexItem">
                        <ControlLabel>Dyżur</ControlLabel>
                        <Radio
                            name="shiftKind"
                            onClick={e => this.setState({
                              shiftTime: 12,
                              shiftSymbol: "D",
                              otherHours: 0,
                              otherMinutes: 0,
                              showInput: false,
                              chooseFunction: true
                            })}
                        >
                          D - 7:00-19:00
                        </Radio>
                        <Radio
                            name="shiftKind"
      					            onClick={e => this.setState({
                              shiftTime: 12,
                              otherHours: 0,
                              otherMinutes: 0,
                              shiftSymbol: "N",
                              showInput: false,
                              chooseFunction: true
                            })}
                        >
                          N - 7:00-19:00
                        </Radio>
                        <Radio
                            name="shiftKind"
      					            onClick={e => this.setState({
                              shiftTime: 7.58,
                              otherHours: 0,
                              otherMinutes: 0,
                              shiftSymbol: "7:35",
                              showInput: false,
                              chooseFunction: false,
                              shiftFunction: ""
                            })}
                        >
                          "7:35" - 7:00 - 14:35
                        </Radio>
                        <Radio
                            name="shiftKind"
      					            onClick={e => this.setState({shiftSymbol: "I", showInput: true, chooseFunction: true})}
                        >
                          Inny
                        </Radio>
                        {inputHours}
                      </div>
                      <div className="flexItem">
                          <ControlLabel>Urlop</ControlLabel>
                          <Radio
                              name="shiftKind"
                              onClick={e => this.setState({
                                shiftTime: 7.58,
                                otherHours: 0,
                                otherMinutes: 0,
                                shiftSymbol: "L4",
                                showInput: false,
                                chooseFunction: false,
                                shiftFunction: ""
                              })}
                          >
                            L4 - urlop chorobowy
                          </Radio>
                          <Radio
                              name="shiftKind"
        					            onClick={e => this.setState({
                                shiftTime: 7.58,
                                otherHours: 0,
                                otherMinutes: 0,
                                shiftSymbol: "UW",
                                showInput: false,
                                chooseFunction: false,
                                shiftFunction: ""
                              })}
                          >
                            UW - urlop wypoczynkowy
                          </Radio>
                          <Radio
                              name="shiftKind"
        					            onClick={e => this.setState({
                                shiftTime: 7.58,
                                otherHours: 0,
                                otherMinutes: 0,
                                shiftSymbol: "OP",
                                showInput: false,
                                chooseFunction: false,
                                shiftFunction: ""
                              })}
                          >
                            OP - opieka nad dzieckiem
                          </Radio>
                          <Radio
                              name="shiftKind"
        					            onClick={e => this.setState({
                                shiftTime: 0,
                                otherHours: 0,
                                otherMinutes: 0,
                                shiftSymbol: "X",
                                showInput: false,
                                chooseFunction: false,
                                shiftFunction: ""
                              })}
                          >
                            X - prośba grafikowa
                          </Radio>
                        </div>
                    </div>
                </FormGroup>
                    { functions }
              </Form>
          </div>
      )
      button = (
          <Button className="successBtn" onClick={ this.addEvent.bind(this) } bsStyle="primary">Dodaj</Button>
      )
    }

    return (

      <div className="static-modal">
        <Modal
            className="createModal"
            show={this.state.showCreateModal}
            onHide={this.close.bind(this)}
            >
            <Modal.Header>
              <Modal.Title>Dodaj dyżur/wolne</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {warning}
              { alert }
              { content }
            </Modal.Body>
            <Modal.Footer>
              <Button className="defaultBtn" onClick={ this.close.bind(this) }>Zamknij</Button>
              { button }
            </Modal.Footer>
          </Modal>
      </div>
    )
  }
}

export default CreateEvent;
