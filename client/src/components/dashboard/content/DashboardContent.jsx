import React, { Component } from 'react';
import { Table, Col} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import axios from 'axios';
import normatives from '../../../normatives.json';

class DashboardContent extends Component {

  constructor(props){
    super();
    this.state = {
      events: [],
      eventsToday: [],
      currNormativ: ''
    }
    this.normatives = normatives;

    this.date = new Date();

    this.weekday = new Array(7);
    this.weekday[0] =  "Niedziela";
    this.weekday[1] = "Poniedziałek";
    this.weekday[2] = "Wtorek";
    this.weekday[3] = "Środa";
    this.weekday[4] = "Czwartek";
    this.weekday[5] = "Piątek";
    this.weekday[6] = "Sobota";

    this.months = new Array(12);
    this.months[0] = "Styczeń";
    this.months[1] = "Luty";
    this.months[2] = "Marzec";
    this.months[3] = "Kwiecień";
    this.months[4] = "Maj";
    this.months[5] = "Czerwiec";
    this.months[6] = "Lipiec";
    this.months[7] = "Sierpień";
    this.months[8] = "Wrzesień";
    this.months[9] = "Październik";
    this.months[10] = "Listopad";
    this.months[11] = "Grudzień";

    this.newDate = new Date();
	  this.month = this.newDate.getMonth()+1;
	  this.year = this.newDate.getFullYear();
    this.day = this.newDate.getDate();

    if(this.month < 10) this.month2 = "0"+this.month;
    if(this.day < 10) this.day = "0"+this.day;
  	this.monthYear = this.year + '-' + this.month;
  	this.monthYearZero = this.year + this.month;
  	this.dayMonthYear = this.year + '-' + this.month + '-' + this.day;
  }

  componentDidMount(){

    Object.keys(normatives).forEach((item) => {

      var normativeData = new Date();
      var year = normativeData.getFullYear();
      var month = normativeData.getMonth()+1;

        this.setState({
          currNormativ: normatives[year][month]["workingDays"],
          daysOff: normatives[year][month]["freeDays"]
        });
    });

    this.setState({
      day: this.weekday[this.date.getDay()],
      month: this.months[this.date.getMonth()],
      dayNr: this.date.getDate(),
      year: this.date.getFullYear()
    })

    var token = localStorage.getItem("jwt");
	  axios.get('https://yournurse.herokuapp.com/api/events/' + this.monthYear, { headers: { Authorization: token } })
		  .then(res => {
			      this.setState({events: res.data})
            this.parseEventsToday();
		  });
  }

  parseEventsToday() {
    let tab = [];
    this.state.events.forEach((event) => {
      var eventDateTime = event.start.split('T');
      var eventDate = eventDateTime[0];

      if(eventDate === this.dayMonthYear) {
        tab.push(event);
      }
    })
    this.setState({eventsToday: tab})
  }

  render() {

    let content;

    if(this.state.eventsToday === '' || this.state.eventsToday.length === 0) {
      content = ( <div>Żadna pięlęgniarka nie sprawuje dzisiaj dyżuru!</div>)
    } else {
      content = (
        <Table responsive className="nurseTable">
          <thead>
          <tr>
            <th>Lp</th>
            <th>Nazwisko i imię</th>
            <th>Rodzaj dyżuru</th>
            <th>Funkcja na dyżurze</th>
          </tr>
          </thead>
          <tbody>
          {this.state.eventsToday.map(function(event, i){
              return (
                  <tr key={ i }>
                    <td>{ i+1 }</td>
                    <td>{event.nurseName}</td>
                    <td>{event.description}</td>
                    <td>{event.shiftFunction}</td>
                  </tr>
              )
          })}
          </tbody>
        </Table>
      )
    }

    return (
      <div>
        <div className="top-bar">Dashboard</div>
        <ReactCSSTransitionGroup
            transitionName="fadeFromTop"
            transitionAppear={true}
            transitionAppearTimeout={3500}
            transitionLeave={false}
            transitionEnter={false}>
                <div className="content-wrapper">
                  <Col sm={12}>
                    <Col lg={3} md={4} sm={6}>
                      <div className="boxWrapper today">
                        <div className="boxTitle">Dzisiaj</div>
                        <p className="dayNr">{this.state.dayNr}</p>
                        <p className="monthYear">{this.state.month} {this.state.year}</p>
                        <p className="dayTitle">{this.state.day}</p>
                      </div>
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <div className="boxWrapper weather">
                        <div className="boxTitle">Normatyw</div>
                        <p className="dayNr">{this.state.currNormativ}</p>
                        <p className="monthYear">dni roboczych</p>
                        <p className="dayTitle">{this.state.daysOff} dni wolnych</p>
                      </div>
                    </Col>
                  </Col>
                  <Col sm={12} >
                    <Col lg={6} md={8} sm={12}>
                      <div className="boxWrapper">
                        <div className="boxTitle">Dzisiejsze dyżury/wolne</div>
                         {content}
                      </div>
                    </Col>
                  </Col>
                </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default DashboardContent;
