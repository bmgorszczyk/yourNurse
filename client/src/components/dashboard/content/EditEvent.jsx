import React, { Component } from 'react';
import { Alert, Modal, Button, Form, ControlLabel, FormControl, FormGroup, Radio } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

class CreateEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      nurses: [],
      showEditModal: false,
      nurseData: '',
      nurseName: '',
      shiftFunction: '',
      chooseFunction: false,
      shiftTime: '',
      otherHours: '',
      otherMinutes: '',
      shiftSymbol: '',
      currEvent: ''
    }
    this.finalTime = "";
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

    let otherHData = props.editEv.currEvent.shiftTime;
    otherHData = String(otherHData);
    otherHData = otherHData.split(".");
    let otherH = otherHData[0];
    let otherM = otherHData[1];
    otherM = String(otherM);
    otherM = "0." + otherM;
    otherM = Number(otherM);
    otherM = otherM*60;
    otherM = Math.round(otherM);
    //otherM = Math.round(otherM);
    otherM = String(otherM);
    if(otherM < 10) otherM = "0" + otherM;
    this.finalTime = otherH + '.' + otherM;
    this.finalTime = Number(this.finalTime);


    this.setState({
      otherHours: otherH,
      otherMinutes: otherM
    })

    this.setState({
      currEvent: props.editEv.currEvent,
      nurseName: props.editEv.nurseName,
      shiftSymbol: props.editEv.currEvent.description,
    })

  }

  openEditModal(){
    this.setState({
      showEditModal: true,
      currEvent: this.props.editEv.currEvent,
      nurseData: this.props.editEv.currEvent.nurseID + '-' + this.props.editEv.currEvent.nurseName,
      shiftSymbol: this.props.editEv.currEvent.description,
      shiftFunction: this.props.editEv.currEvent.shiftFunction
    });
  }

  close(){
    this.setState({
      alertVisible: false,
      showInput: false,
      warning: false,
      shiftSymbol: '',
      chooseFunction: false,
      shiftTime: "",
      showEditModal: false,
    });
  }

    deleteEvent(){
        let event = this.state.currEvent;
    		$('#calendar').fullCalendar('removeEvents', event._id);

		    var token = localStorage.getItem("jwt");

  	    axios.delete('https://yournurse.herokuapp.com/api/events/' + event._id, { headers: { Authorization: token } })
  		  .then((res) => {
          this.props.reFetch();
  			  this.setState({ events: res.data });
          this.props.generateList();
  		  });

		    this.setState({
          showEditModal: false,
          warning: false,
          nurseData: "",
          shiftSymbol: "",
          shiftTime: "",
          shiftFunction: ""
        });

	}

    updateEvent(){

        if((this.state.nurseData=== "" || this.state.nurseData === undefined) || (this.state.shiftSymbol === "" || this.state.shiftSymbol === undefined)) {
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

        let FE_Event = this.state.currEvent;

        FE_Event.title = nurseCutted;
        FE_Event.nurseName = nurseName;
        FE_Event.description = this.state.shiftSymbol;
        FE_Event.shiftFunction = this.state.shiftFunction;

        var DB_Event;

        if(this.state.shiftSymbol === "I"){
          DB_Event = {
            title: nurseCutted,
            description: this.state.shiftSymbol,
            shiftTime: otherShiftTime,
            nurseName: nurseName,
            nurseID: nurseID,
            shiftFunction: this.state.shiftFunction
          }
        } else {
          DB_Event = {
            title: nurseCutted,
            description: this.state.shiftSymbol,
            shiftTime: this.state.shiftTime,
            nurseName: nurseName,
            nurseID: nurseID,
            shiftFunction: this.state.shiftFunction
          }
        }


        if((this.state.shiftSymbol === "D" || this.state.shiftSymbol === "N" || this.state.shiftSymbol === "I") && (this.state.shiftFunction === "" || this.state.shiftFunction === undefined) || (this.state.otherHours === "" && this.state.otherMinutes === "")) {
          this.setState({warning: true});
        } else if (this.state.shiftSymbol !== "X" && this.state.otherHours === "0" && this.state.otherMinutes === "00") {
          this.setState({warning: true})
        } else {

    		    var token = localStorage.getItem("jwt");

            axios.put('https://yournurse.herokuapp.com/api/events/' + FE_Event._id, DB_Event, { headers: { Authorization: token } })
        		  .then((res) => {
                  $('#calendar').fullCalendar('updateEvent', FE_Event);
                  this.props.reFetch();
                  this.props.generateList();
                  this.setState({
                    showEditModal: false,
                    warning: false,
                    nurseData: "",
                    shiftSymbol: "",
                    shiftTime: "",
                    otherHours: "",
                    otherMinutes: "",
                    shiftFunction: ""
                   });
        		  });
        }
    }

  render() {

	  let alert, warning, inputHours, functions;

    if(this.state.showInput || this.state.shiftSymbol === "I") {

        inputHours = (
          <FormGroup className="form-inline">
              <FormControl
                    className="nurseSelect"
                    componentClass="select"
                    placeholder="select"
                    name="hours"
                    value={this.state.otherHours}
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
                  value={this.state.otherMinutes}
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

    if(this.state.chooseFunction || this.state.shiftSymbol === "D" || this.state.shiftSymbol === "N" || this.state.shiftSymbol === "I") {
      functions = (
        <FormGroup>
          <ControlLabel>Funkcja na dyżurze</ControlLabel>
            <Radio
                name="shiftFunction"
                checked={this.state.shiftFunction === "L"}
                onClick={e => this.setState({shiftFunction: "L"})}
            >
              Leki
            </Radio>
            <Radio
                name="shiftFunction"
                checked={this.state.shiftFunction === "D"}
                onClick={e => this.setState({shiftFunction: "D"})}
            >
              Dokumenty
            </Radio>
            <Radio
                name="shiftFunction"
                checked={this.state.shiftFunction === "Z"}
                onClick={e => this.setState({shiftFunction: "Z"})}
            >
              Zabiegi
            </Radio>
        </FormGroup>
      )
    } else functions = ' ';

    return (

      <div className="static-modal">
      <Modal
          className="editModal"
          show={this.state.showEditModal}
          onHide={this.close.bind(this)}
          >
          <Modal.Header>
              <Modal.Title>Edytuj dyżur/wolne </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {warning}
              { alert }
              <Form>
                  <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Pielęgniarka</ControlLabel>
                      <FormControl
                          className="nurseSelect"
                          componentClass="select"
                          placeholder="select"
                          onChange={e => this.setState({nurseData: e.target.value})}
                          defaultValue={this.state.nurseData}
                          >
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
                              checked={this.state.shiftSymbol === "D"}
                              onClick={e => this.setState({
                                shiftTime: 12,
                                otherHours: 0,
                                otherMinutes: 0,
                                shiftSymbol: "D",
                                showInput: false,
                                chooseFunction: true
                              })}

                          >
                            D - 7:00-19:00
                          </Radio>
                          <Radio
                              name="shiftKind"
                              checked={this.state.shiftSymbol === "N"}
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
                              checked={this.state.shiftSymbol === "7:35"}
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
                              checked={this.state.shiftSymbol === "I"}
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
                                checked={this.state.shiftSymbol === "L4"}
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
                                checked={this.state.shiftSymbol === "UW"}
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
                                checked={this.state.shiftSymbol === "OP"}
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
                                checked={this.state.shiftSymbol === "X"}
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
          </Modal.Body>
          <Modal.Footer>
              <Button className="defaultBtn" onClick={ this.close.bind(this) }>Zamknij</Button>
              <Button className="successBtn" onClick={ this.updateEvent.bind(this) } >Zaktualizuj</Button>
              <Button className="deleteBtn" onClick={ this.deleteEvent.bind(this) } >Usuń</Button>
          </Modal.Footer>
      </Modal>
      </div>
    )
  }
}

export default CreateEvent;
