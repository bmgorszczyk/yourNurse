import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteNurse extends Component {

	constructor(props){
		super(props);
		this.state = {
			showDeleteModal: false,
			nurseID: ''
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
				showDeleteModal: props.deleteEv.showDeleteModal,
				currNurse: props.deleteEv.currNurse
		});
	}

	close(){
		this.setState({
			showDeleteModal: false,
			isConfirmed: false
		});
	}

	confirm() {
		this.props.isConfirmed(true, this.state.currNurse);
	}

	render() {

		return (
			<div className="static-modal">
				<Modal
					className="createModal"
					show={this.state.showDeleteModal}
					onHide={this.close.bind(this)}
					>
					<Modal.Header>
						<Modal.Title>Usuń pielęgniarkę</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>Czy na pewno chcesz usunąć tę pielęgniarkę?</div>
					</Modal.Body>
					<Modal.Footer>
						<Button className="deleteBtn"onClick={this.confirm.bind(this)}>Usuń</Button>
						<Button className="defaultBtn" onClick={this.close.bind(this)}>Anuluj</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default DeleteNurse;
