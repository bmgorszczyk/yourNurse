import React, { Component } from 'react';
import { Link } from 'react-router';
import DeleteNurse from './DeleteNurse';
import { Table, Col } from 'react-bootstrap';
import axios from 'axios';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class ShowNurses extends Component {

  constructor(props){
      super(props);
      this.state = {
          nurses: [],
          showDeleteModal: false,
          currNurse: '',
          isConfirmed: false
      }
  }

  componentWillMount() {
  	var token = localStorage.getItem("jwt");

    axios.get('https://yournurse.herokuapp.com/api/nurses', { headers: { Authorization: token } })
      .then(res => {
        this.setState({ nurses: res.data });
      });
      console.log(this.state.nurses);
  }

  deleteNurse(val, nurse){

    if (val === true) {
		var token = localStorage.getItem("jwt");

        axios.delete('https://yournurse.herokuapp.com/api/nurses/' + nurse._id, { headers: { Authorization: token } })
          .then((res) => {
            this.setState({ nurses: res.data });
          });
    }

    this.setState({
        showDeleteModal: false
    });
  }

  showModal(nurse) {
	  this.setState({
	      showDeleteModal: true,
          currNurse: nurse
    });
  }

  render() {

    let content;
    var that = this
    console.log(this.state.nurses);

    if (this.state.nurses === null || this.state.nurses.length === 0) {
      content = (
                <div>Nie została dodana żadna pięlęgniarka!</div>
      )
    } else {
      content = (
        <Table responsive className="nurseTable">
          <thead>
          <tr>
            <th>Lp</th>
            <th>Nazwisko</th>
            <th>Imię</th>
            <th>Nr telefonu</th>
            <th>Akcje</th>
          </tr>
          </thead>
          <tbody>
            {this.state.nurses.map(function(nurse, i){
              return (
                  <tr key={ i }>
                    <td>{ i+1 }</td>
                    <td>{nurse.lastname}</td>
                    <td>{nurse.firstname}</td>
                    <td>{nurse.tel}</td>
                    <td>
                        <Link to={"/dashboard/nurse/edit/" + nurse._id}><button className="actionBtn"><span className="fa fa-pencil"></span></button></Link>
                        <button className="actionBtn" onClick={that.showModal.bind(that, nurse) }><span className="fa fa-times"></span></button>
                    </td>
                  </tr>
              )
            })}
          </tbody>
        </Table>
      )
    }
    return (
      <div>
        <div className="top-bar">Lista pielęgniarek</div>
        <ReactCSSTransitionGroup
            transitionName="fadeFromTop"
            transitionAppear={true}
            transitionAppearTimeout={1500}
            transitionLeave={false}
            transitionEnter={false}>
              <Col sm={12} className="content-wrapper">
                <Col lg={6} md={10} sm={12}>
                    <div className="boxWrapper">
                        <div className="boxTitle">Istniejące pięlęgniarki</div>
                        { content }
                    </div>
                </Col>
                <DeleteNurse isConfirmed={this.deleteNurse.bind(this)} deleteEv={this.state}/>
              </Col>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default ShowNurses;
