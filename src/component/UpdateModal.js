import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const UpdateModal = ({ show, handleClose }) => {
    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update the display name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form class="form-floating">
                        <input type="email" class="form-control" id="floatingInputValue" placeholder="name@example.com" value="" />
                        <label for="floatingInputValue">Display Name</label>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateModal