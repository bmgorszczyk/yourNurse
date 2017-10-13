import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from '../../../assets/img/nurse_logo_white.png';
import av from '../../../assets/img/av.png';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { browserHistory } from 'react-router';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleNurse: false,
      visibleTimetable: false,
      visibleSidebar: false
    }
  }

  slideSidebar(){
    this.setState({
      visibleSidebar: !this.state.visibleSidebar
    })
  }

  slideNurse() {
    this.setState({
      visibleNurse: !this.state.visibleNurse,
      visibleTimetable: false
    })
  }

  slideTimetable() {
    this.setState({
      visibleTimetable: !this.state.visibleTimetable,
      visibleNurse: false
    })
  }

  logout(){
      localStorage.removeItem('jwt');
      browserHistory.push('/login');
  }

  render() {
    return (
      <div className={this.state.visibleSidebar ? "sidebar open": "sidebar"}>
        <button onClick={this.slideSidebar.bind(this)} className="hamburgerBtn"><span className="fa fa-bars" aria-hidden="true"></span></button>
        <div className="logo-wrapper">
            <img src={logo} alt="logo" />
        </div>
        <div className="avatarWrapper">
            <div className="avatar">
                <img src={av} alt="av"/>
            </div>
            <p className="userName">Admin Admin</p>
        </div>
        <ReactCSSTransitionGroup
            transitionName="fadeFromTop"
            transitionAppear={true}
            transitionAppearTimeout={1500}
            transitionEnter={false}
            transitionLeave={false}>
                <div className="nav_wrapper">
                    <nav className="nav">
                        <ul className="nav_list">
                            <li onClick={this.slideSidebar.bind(this)} className="list_item">
                                <Link to="/dashboard">
                                <span className="material-icons">dashboard</span>
                                Dashboard</Link>
                            </li>
                            <li className="list_item">
                                <a onClick={this.slideNurse.bind(this)}><span className="material-icons">group</span>Pielęgniarki <span className="slide fa fa-angle-down"></span></a>
                                <ul className={this.state.visibleNurse ? "subnav open" : "subnav"}>
                                    <li onClick={this.slideSidebar.bind(this)} className="subnav_item"><Link to="/dashboard/nurse/create"><span className="material-icons">person_add</span>Dodaj pielęgniarkę</Link></li>
                                    <li onClick={this.slideSidebar.bind(this)} className="subnav_item"><Link to="/dashboard/nurse/list"><span className="material-icons">people_outline</span>Spis pielęgniarek</Link></li>
                                </ul>
                            </li>
                            <li className="list_item">
                                <a onClick={this.slideTimetable.bind(this)}><span className="material-icons">event</span>Grafiki<span className="slide fa fa-angle-down"></span></a>
                                <ul className={this.state.visibleTimetable ? "subnav open" : "subnav"}>
                                    <li onClick={this.slideSidebar.bind(this)} className="subnav_item"><Link to="/dashboard/timetable/create"><span className="material-icons">add_box</span>Utwórz grafik</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
          </ReactCSSTransitionGroup>
          <button className="logout" onClick={this.logout.bind(this)}><span className="fa fa-power-off"></span></button>
      </div>
    )
  }
}

export default Sidebar;
