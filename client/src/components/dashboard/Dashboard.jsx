import React, { Component } from 'react';
import Sidebar from './sidebar/Sidebar';

class Dashboard extends Component {

  render() {
    return (
      <div className="dashboard">
      	<Sidebar />
      	<div className="content">
            { this.props.children }
        </div>
  	  </div>
    )
  }
}

export default Dashboard;
