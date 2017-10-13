import React, { Component } from 'react';
import pdfMake from '../../../../node_modules/pdfmake/build/pdfmake.min.js';
import vfsFonts from '../../../../node_modules/pdfmake/build/vfs_fonts.js';
import axios from 'axios';
pdfMake.vfs = vfsFonts.pdfMake.vfs;

class PDFMake extends Component {

    constructor(props){
        super(props);
        this.state = {monthEvents: []}
    }

     getEvents() {
		 var token = localStorage.getItem("jwt");

		 axios.get('https://yournurse.herokuapp.com/api/events/' + this.props.monthYear, { headers: { Authorization: token } })
			 .then(res => {
				 this.setState({
					 monthEvents: res.data
				 });
				 this.generate();
			 });
     }

     generate(){

        var sourceData = this.props.norms;
        var events = this.state.monthEvents;
        var bodyData = [];
        var headerRow = [];
        var date = this.props.monthYear.split("-");
        var year = date[0];
        var month = date[1];
        var fakeMonth = Number(month);
        fakeMonth = String(fakeMonth);
        console.log(fakeMonth);
        console.log(new Date().getDay());

        var monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

        var monthName = monthNames[month-1];
        console.log(new Date().getMonth());

        var numberOfDays = new Date(year, fakeMonth, 0).getDate();
        console.log(numberOfDays);

        headerRow.push({text: 'Lp', style: 'medium'});
        headerRow.push({text: 'Nazwisko i imię', style: 'medium'});

		 var dayNumbers = [];

		 for(let i=1; i<numberOfDays+1; i++) {
			 dayNumbers.push(new Date(year, fakeMonth-1, i).getDay());
		 }

		 for(var i=1; i<numberOfDays+1; i++){

       var day;

			 if(dayNumbers[i-1] === 6) {
				 day = i;
				 headerRow.push({text: day, style: 'Saturday'});
			 }
			 else if(dayNumbers[i-1] === 0) {
				 day = i;
				 headerRow.push({text: day, style: 'Sunday'});
			 } else {
				 day = i;
				 headerRow.push({text: day, style: 'tableHeader'});
			 }

     }
		 headerRow.push({text: "D", style: 'default'});
		 headerRow.push({text: "N", style: 'default'});
		 headerRow.push({text: "U", style: 'default'});
     headerRow.push({text: "L4", style: 'default'});
     headerRow.push({text: "OP", style: 'default'});
     headerRow.push({text: 'G', style: 'default'});

     bodyData.push(headerRow);

     sourceData.forEach((sourceRow, i) => {
  			var date = this.props.monthYear.split("-");
  			var year = date[0];
  			var month = date[1];
  			var fakeMonth = Number(month);
  			fakeMonth = String(fakeMonth);

  			var numberOfDays = new Date(year, fakeMonth, 0).getDate();

  			var dataRow = [];

        var name = sourceRow.lastname + ' ' + sourceRow.firstname;
  			dataRow.push({text: i+1, style: 'medium'});
  			dataRow.push({text: name, style: 'medium'});
  		  var dayHours = 0, nightHours = 0, dayoffHours = 0, dayoffHours2 = 0, dayoffHours3 = 0;

  			for(var j=1; j<numberOfDays+1; j++){

  				var day = [];

  				events.forEach((event) => {
  				    var start = event.start.split('T');
  				    var eventDate = start[0].split('-');
  				    var eventDay =  eventDate[2];

  				    if(eventDay < 10) {
  						    eventDay = eventDay.substr(1);
              }

  				    if(String(j) === eventDay && String(sourceRow.id) === event.nurseID) {
                var shiftF;

                if(event.shiftFunction === "") {
                  shiftF = event.shiftFunction;
                } else {
                  shiftF = '/'+event.shiftFunction;
                }
                if(event.description === "I"){

                  var sTimeData = String(event.shiftTime).split(".");
                  var sTime = '';
                  if(!sTimeData[1]) {
                      sTime = sTimeData[0];
                  } else {
                      let fHours = sTimeData[0];
                      let fMinutes = sTimeData[1];
                      fMinutes = "0."+fMinutes;
                      fMinutes = Number(fMinutes);
                      fMinutes = Math.round(fMinutes*60);
                      fMinutes = Math.round(fMinutes);
                      fMinutes = String(fMinutes);

                      let firstChar = fMinutes.charAt(fMinutes.length-2);
                      let secondChar = fMinutes.charAt(fMinutes.length-1);
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
                      fMinutes = firstChar+secondChar;
                      if(fMinutes === 60) {
                        fMinutes = "00"
                        fHours = Number(fHours);
                        fHours += 1;
                        fHours = String(fHours);
                      }

                      sTime = fHours + ':' + fMinutes;
                  }

                  day.push(sTime);
                  day.push({text: shiftF, style: 'small'});
                } else {
                  day.push(event.description);
                  day.push({text: shiftF, style: 'small'});
                }
    						if(event.description === "D" || event.description === "7:35") {
    							dayHours += event.shiftTime;
    						}
    						else if(event.description === "N") {
    							nightHours += event.shiftTime;
    						}
    						else if(event.description === "UW" ) {
    							dayoffHours += event.shiftTime;
    						}
                else if(event.description === "L4") {
    							dayoffHours2 += event.shiftTime;
    						}
                else if(event.description === "OP") {
    							dayoffHours3 += event.shiftTime;
    						} else {
                  dayHours += event.shiftTime;
                }
  					  }
          });

  				day.push(" ");

          if(dayNumbers[j-1] === 6) {
            dataRow.push({text: day, style: 'Saturday'});
          }
          else if(dayNumbers[j-1] === 0) {
            dataRow.push({text: day, style: 'Sunday'});
          } else {
            dataRow.push({text: day, style: 'default'});
          }
			}

      let dayH = Math.round((dayHours)*100)/100;
      let nightH = Math.round((nightHours)*100)/100;
      let dayoffH = Math.round((dayoffHours)*100)/100;
      let dayoffH2 = Math.round((dayoffHours2)*100)/100;
      let dayoffH3 = Math.round((dayoffHours3)*100)/100;
      let sumH = Math.round((sourceRow.hours)*100)/100;

      dayH = String(dayH);
      nightH = String(nightH);
      dayoffH = String(dayoffH);
      dayoffH2 = String(dayoffH2);
      dayoffH3 = String(dayoffH3);
      sumH = String(sumH);

      dayH = dayH.split('.');
      nightH = nightH.split('.');
      dayoffH = dayoffH.split('.');
      dayoffH2 = dayoffH2.split('.');
      dayoffH3 = dayoffH3.split('.');
      sumH = sumH.split('.');

      let finalDayH = '';
      if(!dayH[1]) {
          finalDayH = dayH[0];
      } else {
          let finalHours = dayH[0];
          let finalMinutes = dayH[1];
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

          finalDayH = finalHours + ':' + finalMinutes;
      }

      let finalNighH = '';
      if(!nightH[1]) {
          finalNighH = nightH[0];
      } else {
          let final2Hours = nightH[0];
          let final2Minutes = nightH[1];
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

          finalNighH = final2Hours + ':' + final2Minutes;
      }

      let finalDayoffH = '';
      if(!dayoffH[1]) {
          finalDayoffH = dayoffH[0];
      } else {
          let final3Hours = dayoffH[0];
          let final3Minutes = dayoffH[1];
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

          finalDayoffH = final3Hours + ':' + final3Minutes;
      }

      let finalDayoffH2 = '';
      if(!dayoffH2[1]) {
          finalDayoffH2 = dayoffH2[0];
      } else {
          let final5Hours = dayoffH2[0];
          let final5Minutes = dayoffH2[1];
          final5Minutes = "0."+final5Minutes;
          final5Minutes = Number(final5Minutes);
          final5Minutes = Math.round(final5Minutes*60);
          final5Minutes = Math.round(final5Minutes);
          final5Minutes = String(final5Minutes);

          let firstChar5 = final5Minutes.charAt(final5Minutes.length-2);
          let secondChar5 = final5Minutes.charAt(final5Minutes.length-1);

          if(!firstChar5) firstChar5 = "0";
          if(secondChar5 > 5 && secondChar5 < 10) {
              firstChar5 = Number(firstChar5);
              firstChar5 = firstChar5 + 1;
              firstChar5 = String(firstChar5);
              secondChar5 = "0";
          } else if (secondChar5 > 0 && secondChar5 < 5) {
              firstChar5 = String(firstChar5);
              secondChar5 = "5";
          }
          final5Minutes = firstChar5+secondChar5;
          if(final5Minutes === "60") {
            final5Minutes = "00"
            final5Hours = Number(final5Hours);
            final5Hours += 1;
            final5Hours = String(final5Hours);
          }

          finalDayoffH2 = final5Hours + ':' + final5Minutes;
      }

      let finalDayoffH3 = '';
      if(!dayoffH3[1]) {
          finalDayoffH3 = dayoffH3[0];
      } else {
          let final6Hours = dayoffH3[0];
          let final6Minutes = dayoffH3[1];
          final6Minutes = "0."+final6Minutes;
          final6Minutes = Number(final6Minutes);
          final6Minutes = Math.round(final6Minutes*60);
          final6Minutes = Math.round(final6Minutes);
          final6Minutes = String(final6Minutes);

          let firstChar6 = final6Minutes.charAt(final6Minutes.length-2);
          let secondChar6 = final6Minutes.charAt(final6Minutes.length-1);

          if(!firstChar6) firstChar6 = "0";
          if(secondChar6 > 5 && secondChar6 < 10) {
              firstChar6 = Number(firstChar6);
              firstChar6 = firstChar6 + 1;
              firstChar6 = String(firstChar6);
              secondChar6 = "0";
          } else if (secondChar6 > 0 && secondChar6 < 5) {
              firstChar6 = String(firstChar6);
              secondChar6 = "5";
          }
          final6Minutes = firstChar6+secondChar6;
          if(final6Minutes === "60") {
            final6Minutes = "00"
            final6Hours = Number(final6Hours);
            final6Hours += 1;
            final6Hours = String(final6Hours);
          }

          finalDayoffH3 = final6Hours + ':' + final6Minutes;
      }

      let finalSumH = '';
      if(!sumH[1]) {
          finalSumH = sumH[0];
      } else {
          let final4Hours = sumH[0];
          let final4Minutes = sumH[1];
          final4Minutes = "0."+final4Minutes;
          final4Minutes = Number(final4Minutes);
          final4Minutes = Math.round(final4Minutes*60);
          final4Minutes = Math.round(final4Minutes);
          final4Minutes = String(final4Minutes);

          let firstChar4 = final4Minutes.charAt(final4Minutes.length-2);
          let secondChar4 = final4Minutes.charAt(final4Minutes.length-1);

          if(!firstChar4) firstChar4 = "0";
          if(secondChar4 > 5 && secondChar4 < 10) {
              firstChar4 = Number(firstChar4);
              firstChar4 = firstChar4 + 1;
              firstChar4 = String(firstChar4);
              secondChar4 = "0";
          } else if (secondChar4 > 0 && secondChar4 < 5) {
              firstChar4 = String(firstChar4);
              secondChar4 = "5";
          }
          final4Minutes = firstChar4+secondChar4;
          if(final4Minutes === "60") {
            final4Minutes = "00"
            final4Hours = Number(final4Hours);
            final4Hours += 1;
            final4Hours = String(final4Hours);
          }


          finalSumH = final4Hours + ':' + final4Minutes;
      }

			dataRow.push({text: finalDayH, style: 'medium'});
		  dataRow.push({text: finalNighH, style: 'medium'});
		  dataRow.push({text: finalDayoffH, style: 'medium'});
      dataRow.push({text: finalDayoffH2, style: 'medium'});
      dataRow.push({text: finalDayoffH3, style: 'medium'});
			dataRow.push({text: finalSumH, style: 'medium'});
			bodyData.push(dataRow);
    });

    let finalNorm = this.props.normativ*7.58;
    finalNorm = String(finalNorm);
    finalNorm = finalNorm.split(".");
    let normHours = finalNorm[0];
    let normMins = finalNorm[1];

    normMins = "0."+normMins;
    normMins = Number(normMins);
    normMins = Math.round(normMins*60);
    normMins = Math.round(normMins);
    normMins = String(normMins);

    let fstChar = normMins.charAt(normMins.length-2);
    let sndChar = normMins.charAt(normMins.length-1);
    if(!fstChar) fstChar = "0";
    if(sndChar > 5 && sndChar < 10) {
        fstChar = Number(fstChar);
        fstChar = fstChar + 1;
        fstChar = String(fstChar);
        sndChar = "0";
    } else if (sndChar > 0 && sndChar < 5) {
        fstChar = String(fstChar);
        sndChar = "5";
    }
    normMins = fstChar+sndChar;
    if(normMins === "60") {
      normMins = "00"
      normHours = Number(normHours);
      normHours += 1;
      normHours = String(normHours);
    }

    let finalN = normHours + ':' + normMins;

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins :[12,12,12,12],
      content: [
			  { text: [
				  {
				  	text: 'Rozkład pracy dla pielęgniarek na miesiąc:  '
				  },
				  {
				  	text: monthName, bold: true, fontSize: 10
				  },
				  {
				  	text: '  normatyw: '
				  },
				  {
				  	text: finalN, bold: true, fontSize: 10
				  }
			     ], alignment: 'center', fontSize: 10
			  },
			  { text: ' '},
			  {
                   table: {
                       body: bodyData
                  },
                  layout: {
                        paddingLeft: function(i) { return 3; },
                        paddingRight: function(i, node) { return 3; },
                        paddingTop: function(i, node) { return 2; },
                        paddingBottom: function(i, node) { return 2; }
                    }
              },
			  { text: ' '},
			  {
			  	columns: [
					{
						text: [
							{
								text: 'Oznaczenie godzin:\n', fontSize: 8, bold: true, lineHeight: 1.5
							},
							{
								text: 'D - dzień 7:00-19:00\n', fontSize: 7
							},
							{
								text: 'N - noc 19:00-7:00\n', fontSize: 7
							},
							{
								text: '7:35 - dzień 7:00-14:35\n', fontSize: 7
							}
						], alignment: 'left'
					},
					{
						text: [
							{
								text: 'Funkcja na dyżurze:\n', fontSize: 8, bold: true, lineHeight: 1.5
							},
							{
								text: 'L - leki\n', fontSize: 7
							},
							{
								text: 'D - dokumenty\n', fontSize: 7
							},
							{
								text: 'Z - zabiegi\n', fontSize: 7
							}
						]
					},
					{
						text: [
							{
								text: 'Pozostałe:\n', fontSize: 8, bold: true, lineHeight: 1.5
							},
							{
								text: 'L4 - urlop chorobowy\n', fontSize: 7
							},
							{
								text: 'UW - urlop wypoczynkowy\n', fontSize: 7
							},
              {
								text: 'OP - opieka nad dzieckiem\n', fontSize: 7
							},
              {
								text: 'X - prośba grafikowa\n', fontSize: 7
							},
              {
                text: 'U - godzin urlopowych/wolnych\n', fontSize: 7
              },
							{
								text: 'G - godzin przepracowanych\n', fontSize: 7
							}
						]
					},
					{
						text: 'Sporządziła: ', fontSize: 8, bold: true, alignment: 'center'
					},
					{
						text: 'Sprawdził: ', fontSize: 8, bold: true, alignment: 'center'
					}
				]
			  },

          ],
          styles: {
        			tableHeader: {
        				fontSize: 7,
        				bold: true
        			},
        			default: {
        				fontSize: 6,
        				lineHeight: 1,
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 1,
                paddingBottom: 1,
        				bold: true
        			},
        			Saturday: {
        				fontSize: 6,
        				fillColor: '#f9eded',
        				color:'black',
                bold: true
        			},
        			Sunday: {
        				fontSize: 6,
        				fillColor: '#f7c7c7',
        				color:'black',
                bold: true
        			},
        			small: {
        			  fontSize: 5,
        			  lineHeight: 0.6,
        			  alignment: 'center',
        			  bold: false
        			},
        		    medium: {
        				fontSize: 6,
        				bold: false
        			}
		      }
      };

     console.log(bodyData);
     pdfMake.createPdf(docDefinition).open();

  }

  render() {

    return (
		<button className="nurseBtn" onClick={this.getEvents.bind(this)}>Generuj PDF</button>
    );
  }
}

export default PDFMake;
