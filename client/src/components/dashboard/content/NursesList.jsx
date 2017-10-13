/**
 * Created by Bartek on 08.08.2017.
 */

import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class NursesList extends Component {

	render() {

		var monthYear = this.props.monthYear.split("-");
		var month = monthYear[1];
		var normativ = (this.props.currNormativ*7.58).toString().split(".");
		var hours = normativ[0];
		var minutes = normativ[1];
		normativ = hours.concat(".", minutes);

		var prevNormativ = this.props.prevNormativ;
		var prevprevNormativ = this.props.prevprevNormativ;
		return (
			<ReactCSSTransitionGroup
				transitionName="list"
				transitionAppear={true}
				transitionLeave={false}
				transitionEnter={false}
				transitionAppearTimeout={1500}>
				<div className="boxWrapper">
					<div className="boxTitle">Lista szczegółów</div>
					<div className="rightSide">
						<div className="tableWrapper">
							<Table responsive>
								<thead>
								<tr>
									<th>Lp</th>
									<th>Nazwisko i imię</th>
									<th>Godzin(g:m)</th>
									<th>Normatyw(g:m)</th>
									<th>Zostaje(g:m)</th>
									<th>Dyzurów</th>
								</tr>
								</thead>
								<tbody>
									{this.props.list.map(function(nurse, i){
										var hours = Math.round(nurse.hours * 100) / 100;

										var prevNorm = (prevNormativ*7.58)-nurse.prevHours;
										var prevprevNorm = (prevprevNormativ*7.58)-nurse.prevprevHours;
										var nurseNormativ;
										var left;

										if(month === "1") {
											nurseNormativ = normativ;
											left = normativ;
										}

										else if(month === "4" || month === "7" || month === "10"){
											nurseNormativ = normativ;
											left = Math.round((nurseNormativ - nurse.hours)*100)/100;

										} else if (month === "3" || month === "6" || month === "9" || month === "12"){

											if (nurse.prevHours === 0){
												nurseNormativ = Number(nurseNormativ);
												normativ = Number(normativ);
												nurseNormativ = normativ;
												left = Math.round((nurseNormativ - nurse.hours)*100)/100;
											} else {
												nurseNormativ = Number(nurseNormativ);
												normativ = Number(normativ);
												nurseNormativ = Math.round((normativ + prevNorm)*100)/100;
												left = Math.round((nurseNormativ - nurse.hours)*100)/100;
											}
										} else {

											if (nurse.prevHours === 0 && nurse.prevprevHours === 0){
												nurseNormativ = Number(nurseNormativ);
												normativ = Number(normativ);
												nurseNormativ = normativ;
												left = Math.round((nurseNormativ - nurse.hours)*100)/100;
											}

											else if (nurse.prevprevHours === 0){
												nurseNormativ = Number(nurseNormativ);
												normativ = Number(normativ);
												nurseNormativ = Math.round((normativ + prevNorm)*100)/100;
												left = Math.round((nurseNormativ - nurse.hours)*100)/100;
										 }

										 else if (nurse.prevHours === 0){
											 nurseNormativ = Number(nurseNormativ);
											 normativ = Number(normativ);
											 nurseNormativ = Math.round((normativ + prevprevNorm)*100)/100;
											 left = Math.round((nurseNormativ - nurse.hours)*100)/100;

										 } else {
												nurseNormativ = Number(nurseNormativ);
												normativ = Number(normativ);
												nurseNormativ = Math.round((normativ + prevNorm + prevprevNorm)*100)/100;
												left = Math.round((nurseNormativ - nurse.hours)*100)/100;
											}
										}

										nurseNormativ = String(nurseNormativ);
										nurseNormativ = nurseNormativ.split('.');
										let finalNormativ = '';

										if(!nurseNormativ[1]) {
											  finalNormativ = nurseNormativ[0];
										} else {
												let finalHours = nurseNormativ[0];
												let finalMinutes = nurseNormativ[1];
												finalMinutes = "0."+finalMinutes;
												finalMinutes = Number(finalMinutes);
												finalMinutes = Math.round(finalMinutes*60);
												finalMinutes = Math.round(finalMinutes);
												finalMinutes = String(finalMinutes);

												let firstChar = finalMinutes.charAt(finalMinutes.length-2);
												let secondChar = finalMinutes.charAt(finalMinutes.length-1);
												if(!firstChar) firstChar = "0";
												if(secondChar > 5 && secondChar < 10) {
														firstChar = Number(firstChar);
														firstChar = firstChar + 1;
														firstChar = String(firstChar);
														secondChar = "0";
												} else if (secondChar > 0 && secondChar < 5) {
														firstChar = String(firstChar);
														secondChar = "5";
												}
												finalMinutes = firstChar+secondChar;
												if(finalMinutes === "60") {
													finalMinutes = "00"
													finalHours = Number(finalHours);
													finalHours += 1;
													finalHours = String(finalHours);
												}


												finalNormativ = finalHours + ':' + finalMinutes;
										}

										left = String(left);
										left = left.split('.');
										let finalLeft = '';
										if(!left[1]) {
											  finalLeft = left[0];
										} else {
												let final2Hours = left[0];
												let final2Minutes = left[1];
												final2Minutes = "0."+final2Minutes;
												final2Minutes = Number(final2Minutes);
												final2Minutes = Math.round(final2Minutes*60);
												final2Minutes = Math.round(final2Minutes);
												final2Minutes = String(final2Minutes);

												let firstChar2 = final2Minutes.charAt(final2Minutes.length-2);
												let secondChar2 = final2Minutes.charAt(final2Minutes.length-1);
												if(!firstChar2) firstChar2 = "0";
												if(secondChar2 > 5 && secondChar2 < 10) {
														firstChar2 = Number(firstChar2);
														firstChar2 = firstChar2 + 1;
														firstChar2 = String(firstChar2);
														secondChar2 = "0";
												} else if (secondChar2 > 0 && secondChar2 < 5) {
														firstChar2 = String(firstChar2);
														secondChar2 = "5";
												}
												final2Minutes = firstChar2+secondChar2;
												if(final2Minutes === "60") {
													final2Minutes = "00"
													final2Hours = Number(final2Hours);
													final2Hours += 1;
													final2Hours = String(final2Hours);
												}
												finalLeft = final2Hours + ':' + final2Minutes;
										}

										hours = String(hours);
										hours = hours.split('.');
										let finalTime = '';
										if(!hours[1]) {
											  finalTime = hours[0];
										} else {
												let final3Hours = hours[0];
												let final3Minutes = hours[1];
												final3Minutes = "0."+final3Minutes;
												final3Minutes = Number(final3Minutes);
												final3Minutes = Math.round(final3Minutes*60);
												final3Minutes = Math.round(final3Minutes);
												final3Minutes = String(final3Minutes);

												let firstChar3 = final3Minutes.charAt(final3Minutes.length-2);
												let secondChar3 = final3Minutes.charAt(final3Minutes.length-1);
												if(!firstChar3) firstChar3 = "0";
												if(secondChar3 > 5 && secondChar3 < 10) {
														firstChar3 = Number(firstChar3);
														firstChar3 = firstChar3 + 1;
														firstChar3 = String(firstChar3);
														secondChar3 = "0";
												} else if (secondChar3 > 0 && secondChar3 < 5) {
														firstChar3 = String(firstChar3);
														secondChar3 = "5";
												}
												final3Minutes = firstChar3+secondChar3;
												if(final3Minutes === "60") {
													final3Minutes = "00"
													final3Hours = Number(final3Hours);
													final3Hours += 1;
													final3Hours = String(final3Hours);
												}

						            finalTime = final3Hours + ':' + final3Minutes;
										}

										return (
											<tr key={ i }>
												<td>{ i+1 }</td>
												<td>{nurse.lastname} {nurse.firstname}</td>
												<td>{finalTime}</td>
												<td>{finalNormativ}</td>
												<td>{finalLeft}</td>
												<td>{nurse.count}</td>
											</tr>
										)
									})}
								</tbody>
							</Table>
						</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
		)
	}
}

export default NursesList;
