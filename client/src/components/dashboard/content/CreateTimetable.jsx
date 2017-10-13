import React, { Component } from 'react';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import NursesList from './NursesList';
import PDFMake from './PDFMake';
import axios from 'axios';
import $ from 'jquery';
import 'fullcalendar';
import normatives from '../../../normatives.json';
import { Col } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class CreateTimetable extends Component {

    constructor(props){
      super();
      this.state = {
        events: [],
        nurses: [],
		    list: [],
	      prevHours: [],
	      prevprevHours: [],
		    monthEvents: [],
        showEditModal: false,
        showCreateModal: false,
        loadingComp: true,
        loadingList: false,
        nurseName: '',
        shiftKind: '',
        date: '',
        currEvent: '',
        monthYear: '',
        currNormativ: '',
	      prevNormativ: '',
	      prevprevNormativ: ''
      }
      this.normatives = normatives;
    }


	reFetchData(){
		var token = localStorage.getItem("jwt");

		axios.get('https://yournurse.herokuapp.com/api/events', { headers: { Authorization: token } })
			.then(res => {
				this.setState({ events: res.data });
				$('#calendar').fullCalendar('removeEvents');
				$('#calendar').fullCalendar('addEventSource', this.state.events);
				$('#calendar').fullCalendar('rerenderEvents' );
			});

	}

    fetchBasicData(){
	  var token = localStorage.getItem("jwt");

      axios.get('https://yournurse.herokuapp.com/api/events', { headers: { Authorization: token } })
    			.then(res => {
    				this.setState({ events: res.data })

					var token = localStorage.getItem("jwt");

					axios.get('https://yournurse.herokuapp.com/api/nurses', { headers: { Authorization: token } })
						.then(res => {
							this.setState({ nurses: res.data, loadingComp: false });
							this.renderCalendar();
						});

    			});

    }

    generateList() {

      var currDate = $("#calendar").fullCalendar('getDate');
      var monthYear = currDate.format('YYYY-M');
      this.setState({
        monthYear: monthYear
      });

    	var currYearMonth = this.state.monthYear;
    	var currYMData = currYearMonth.split("-");
    	var currMonth = currYMData[1];
    	var currYear = currYMData[0];

    	var prevMonth = Number(currMonth)-1;
		  prevMonth = String(prevMonth);
    	var prevprevMonth = Number(currMonth)-2;
		  prevprevMonth = String(prevprevMonth);

    	var prevYearMonth = currYear + '-' + prevMonth;
    	var prevprevYearMonth = currYear + '-' + prevprevMonth;

		  var token = localStorage.getItem("jwt");

  		axios.get('https://yournurse.herokuapp.com/api/nurses', { headers: { Authorization: token } })
  			.then(res => {
				this.setState({
					nurses: res.data
				});

				var token = localStorage.getItem("jwt");

				axios.get('https://yournurse.herokuapp.com/api/normatives/' + this.state.monthYear, { headers: { Authorization: token } })
					.then(res => {
						this.setState({
							hours: res.data
						});

						var token = localStorage.getItem("jwt");

						axios.get('https://yournurse.herokuapp.com/api/normatives/' + prevYearMonth, { headers: { Authorization: token } })
							.then(res => {
								this.setState({
									prevHours: res.data
								});

								var token = localStorage.getItem("jwt");

								axios.get('https://yournurse.herokuapp.com/api/normatives/' + prevprevYearMonth, { headers: { Authorization: token } })
									.then(res => {
										this.setState({
											prevprevHours: res.data,
                      loadingComp: false
										});
										setTimeout(() => {
										  this.setState({
											loadingList: false
										  });
										}, 500);

										Object.keys(normatives).forEach((item) => {

											var normativeData = this.state.monthYear.split("-");
											var year = Number(normativeData[0]);
											var month = Number(normativeData[1]);

											if(month >=3) {
												this.setState({
													currNormativ: normatives[year][month]["workingDays"],
													prevNormativ: normatives[year][month-1]["workingDays"],
													prevprevNormativ: normatives[year][month-2]["workingDays"],
												})
											} else if(month === 2) {
												this.setState({
													currNormativ: normatives[year][month]["workingDays"],
													prevNormativ: normatives[year][month-1]["workingDays"],
													prevprevNormativ: 0,
												})
											} else {
												this.setState({
													currNormativ: normatives[year][month]["workingDays"],
													prevNormativ: 0,
													prevprevNormativ: 0,
												})
											}
										});

										let output = [];
										let flag = 1;

										this.state.nurses.forEach((nurse) => {
											this.state.hours.forEach((item) => {
												if (nurse._id === item._id) {
													output.push({
														id: nurse._id,
														firstname: nurse.firstname,
														lastname: nurse.lastname,
														hours: item.hours,
														count: item.count
													});
													flag = 0;
												}
											});

											if (flag === 1) {
												output.push({
													id: nurse._id,
													firstname: nurse.firstname,
													lastname: nurse.lastname,
													hours: 0,
													count: 0
												});
											}
											flag = 1;
										});

										let output2 = [];
										let flag2 = 1;

										output.forEach((base) => {
											this.state.prevHours.forEach((item) => {
												if (base.id === item._id) {
													output2.push({
														id: base.id,
														firstname: base.firstname,
														lastname: base.lastname,
														hours: base.hours,
														count: base.count,
														prevHours: item.hours
													});
													flag2 = 0;
												}
											});

											if (flag2 === 1) {
												output2.push({
													id: base.id,
													firstname: base.firstname,
													lastname: base.lastname,
													hours: base.hours,
													count: base.count,
													prevHours: 0
												});
											}
											flag2 = 1;
										});

										let output3 = [];
										let flag3 = 1;

										output2.forEach((base) => {
											this.state.prevprevHours.forEach((item) => {
												if (base.id === item._id) {
													output3.push({
														id: base.id,
														firstname: base.firstname,
														lastname: base.lastname,
														hours: base.hours,
														count: base.count,
														prevHours: base.prevHours,
														prevprevHours: item.hours
													});
													flag3 = 0;
												}
											});

											if (flag3 === 1) {
												output3.push({
													id: base.id,
													firstname: base.firstname,
													lastname: base.lastname,
													hours: base.hours,
													count: base.count,
													prevHours: base.prevHours,
													prevprevHours: 0
												});
											}
											flag3 = 1;
										});

										this.setState({list: output3});

									});
							});
					});
			});
	}

    renderCalendar() {

		$('#calendar').fullCalendar({
			firstDay: 1,
			showNonCurrentDates: false,
			height: 800,
			buttonText: {
				today: 'Dzisiaj'
			},
			header: {
				left: 'prev,next today',
				center: 'title',
				right: ''
			},
			validRange: {
				start: '2017-01-01',
				end: '2020-12-31'
			},
			monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
			monthNamesShort: ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'],
			dayNames: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek','Piątek', 'Sobota', 'Niedziela'],
			dayNamesShort: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw','Pią', 'Sob'],
			events: this.state.events,
			locale: 'pl',
			editable: true,
			droppable: true,
			eventDrop: function(event, delta){
				let newEvent = {
					start: event.start.format()
				}

				var token = localStorage.getItem("jwt");

				axios.put('https://yournurse.herokuapp.com/api/events/' + event._id, newEvent, { headers: { Authorization: token } })

			},
			dayClick: function(date, jsEvent, view) {
				var currDate = $("#calendar").fullCalendar('getDate');
				var monthYear = currDate.format('YYYY-M');

				this.setState({
					date: date.format(),
					monthYear: monthYear
				});

				this.refs.showCreateModal.openCreateModal();
			}.bind(this),

			eventClick: function(calEvent, jsEvent, view) {
				this.setState({currEvent: calEvent});
				this.refs.showEditModal.openEditModal();
			}.bind(this),

			eventRender: function (event, element, view) {
        var symbolFunction;
        if(event.shiftFunction === '') {
          symbolFunction = event.description;
        } else {
          symbolFunction = event.description + '/' + event.shiftFunction;
        }
				element.find('.fc-title span').remove();
				element.find('.fc-title').prepend('<span class="shiftKind">' + symbolFunction + '</span>');
			},
			viewRender: function(view, element) {
				var currDate = $("#calendar").fullCalendar('getDate');
				var monthYear = currDate.format('YYYY-M');
				this.setState({
					monthYear: monthYear,
					loadingList: true
				});
				this.generateList();
			}.bind(this)
		});
		$('#calendar').fullCalendar( 'refetchEvents');
    }

    componentDidMount(){
  		this.fetchBasicData();
    }

	render() {
    let content, loader;

    if(this.state.loadingList){
      loader = (
        <ReactCSSTransitionGroup
            transitionName="list"
            transitionAppear={true}
            transitionLeave={false}
			      transitionEnter={false}
            transitionAppearTimeout={1500}>
              <div className="loadingListWrapper">
                  <span className="fa fa-circle-o-notch fa-spin"></span>
              </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      loader = ''
    }

    if(this.state.loadingComp){
      content = (
        <div className="loadingWrapper container">
            <span className="fa fa-circle-o-notch fa-spin"></span>
        </div>
      )
    } else {
      content = (
        <ReactCSSTransitionGroup
            transitionName="fadeFromTop"
            transitionAppear={true}
			      transitionLeave={false}
			      transitionEnter={false}
            transitionAppearTimeout={1500}>
              <div className="timetableWrapper container">
					  <Col lg={7} md={12}>
						  <div className="boxWrapper">
							  <div className="boxTitle">Kalendarz</div>
								  <div id="calendar"></div>
						  </div>
        			  </Col>
        			  <Col lg={5} md={12}>
                        {loader}
            				    <NursesList list={this.state.list} currNormativ={this.state.currNormativ} prevNormativ={this.state.prevNormativ} prevprevNormativ={this.state.prevprevNormativ} monthYear={this.state.monthYear}/>
						  		      <PDFMake nurses={this.state.nurses} norms={this.state.list} monthYear={this.state.monthYear} normativ={this.state.currNormativ} />
					      </Col>
        			  <CreateEvent ref="showCreateModal" createEv={this.state} generateList={this.generateList.bind(this)} fetchBasicData={this.fetchBasicData.bind(this)} reFetch={this.reFetchData.bind(this)}/>
        			  <EditEvent ref="showEditModal" editEv={this.state} generateList={this.generateList.bind(this)} fetchBasicData={this.fetchBasicData.bind(this)} reFetch={this.reFetchData.bind(this)}/>
              </div>
          </ReactCSSTransitionGroup>
      )//
    }

		return (
      <div>
        <div className="top-bar">Grafik</div>
        <div> {content} </div>
      </div>

		)
  }
}

export default CreateTimetable;
