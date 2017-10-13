import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import '../node_modules/font-awesome/css/font-awesome.min.css';
import './assets/styles/scss/variables.scss';
import './assets/styles/fullcalendar.min.css';
import './index.scss';

import Login from './components/login/Login';
import Register from './components/login/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateNurse from './components/dashboard/content/CreateNurse';
import ShowNurses from './components/dashboard/content/ShowNurses';
import EditNurse from './components/dashboard/content/EditNurse';
import CreateTimetable from './components/dashboard/content/CreateTimetable';
import ShowTimetables from './components/dashboard/content/ShowTimetables';
import DashboardContent from './components/dashboard/content/DashboardContent';

function requireAuth (nextState, replace, callback) {
  const token = localStorage.getItem('jwt');
  if (!token) replace('/')
  return callback();
}

ReactDOM.render((
	<Router history={browserHistory}>
		  <Route path="/" component={Login} />
		  <Route path="login" component={Login} />
		  <Route path="register" component={Register} />
		  <Route path="dashboard" component={Dashboard} onEnter={requireAuth}>
         <IndexRoute component={DashboardContent}/>
				 <Route path="nurse/create" component={CreateNurse} />
				 <Route path="nurse/list" component={ShowNurses} />
				 <Route path="nurse/edit/:id" component={EditNurse} />
				 <Route path="timetable/create" component={CreateTimetable} />
				 <Route path="timetable/list" component={ShowTimetables} />
		  </Route>
		  <Route path="**" component={Login}/>
 		</Router>

), document.getElementById('root'));
