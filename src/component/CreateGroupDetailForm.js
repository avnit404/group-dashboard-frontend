import axios from 'axios';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { createGroup, createGroupRequest } from '../redux/create-group/createGroupsType';
import { getGroup } from '../redux/group/groupType';

const CreateGroupDetailForm = ({show, handleClose ,setCreateGroupDetail,createGroupDetail}) => {
    const dispatch = useDispatch()

    const createGroupDetailData = (e)=>{
        const data = e.target.value
        setCreateGroupDetail(data)
    }
    const handleSave = async() => {
        const payload = {
            "groupName": createGroupDetail,
            "table": JSON.stringify([]),
            "column":JSON.stringify([])
        }
        // try {
        //    await axios.post(`${process.env.REACT_APP_BASE_URL}/group/createGroup`, payload)
        //    getGroupData()
         
        // } catch (error) {
        //     console.log(error)
        // }
        dispatch(createGroupRequest(payload))
        dispatch(getGroup())
        handleClose()
    }
    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Group Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form class="form-floating">
                        <input type="text" class="form-control" id="floatingInputValue" placeholder="name@example.com" onChange={(e)=>createGroupDetailData(e)}/>
                        <label for="floatingInputValue">Display Name</label>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateGroupDetailForm