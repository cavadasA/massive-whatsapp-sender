import React, { useState, useEffect } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';


export default function UserDashboard() {

    const { user, changeName, myMessages, myPhoneLists, deleteMessage, deletePhoneList, getMessages, getPhoneLists } = useAuth()

    const [userDisplayName, setUserDisplayName] = useState(user)
    const [showNameChange, setShowNameChange] = useState(false)
    const [modalData, setModalData] = useState({
        typeOfRecord: "",
        id: ""
    })
    const [newName, setNewName] = useState('')
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = (type, recordId) => {
        setShow(true);
        setModalData({
            typeOfRecord: type,
            id: recordId
        })
    }
    useEffect(() => {
        setTimeout(() => {
            if (user) setUserDisplayName(user.displayName)
        }, 300)
    }, [user])

    const handleInfoChange = (inputBox, newData) => {
        switch (inputBox) {
            case 'newName':
                setNewName((prevName) => newData)
                break;
            /*case 'password':
                setPassword((prevPassword) => newData)
                break;*/
            default:
                break;
        }
    }
    const handleShowName = () => {
        if (!showNameChange) {
            setNewName('')
            setShowNameChange(true)
        } else {
            setNewName('')
            setShowNameChange(false)
        }
    }
    const handleNameUpdate = async () => {
        try {
            await changeName(newName)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }
    const handleRecordDelete = async (id, typeOfRecord) => {
        if (typeOfRecord === "message") {
            await deleteMessage(id)
            getMessages();
            handleClose();
        } else if (typeOfRecord === "phoneList") {
            await deletePhoneList(id)
            getPhoneLists()
            handleClose();
        }
    }

    return (
        <div>
            {userDisplayName ? <div className='row mt-5 justify-content-start ms-5'>
                <div>
                    <h3>Perfil del Usuario</h3>
                </div>
                <div className='row'>
                    <div className='col-4'>
                        <form className='text-start'>
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <div className="input-group mb-3">
                                <input type='text' className="form-control" id="name" value={typeof userDisplayName === 'string' ? userDisplayName : ''} disabled />
                                <span style={{ cursor: "pointer" }} className='input-group-text' onClick={handleShowName} ><AiFillEdit /></span>
                            </div>
                            {showNameChange ?
                                <div>
                                    <label htmlFor="name" className="form-label">Nuevo nombre</label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" aria-label="First name" id="newName" value={newName} onChange={(e) => handleInfoChange('newName', e.target.value)} />
                                        <button type="button" className="btn btn-outline-success" onClick={handleNameUpdate}>Cambiar nombre</button>
                                    </div>
                                </div>
                                : ''}
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <div className="input-group mb-3">
                                <input type='text' className="form-control" id="email" value={user.email} disabled />
                            </div>
                        </form>
                    </div>
                </div>
                <div className='row'>
                    <h3 className='my-3'>Mis mensajes guardados</h3>
                    {myMessages.length === 0 ? <p>Aquí aparecerán tus mensajes cuando los crees</p> :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Título del mensaje</th>
                                    <th scope="col">Editar</th>
                                    <th scope="col">Borrar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myMessages.map((message, index) => {
                                    return (
                                        <tr key={message._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{message.title}</td>
                                            <td><AiFillEdit style={{ cursor: "pointer" }} onClick={() => navigate('/massive-whatsapp-sender/editSavedRecord', { state: { props: message, recordType: "savedMessage" } })} /></td>
                                            <td><FiTrash2 style={{ cursor: "pointer" }} onClick={() => handleShow("message", message._id)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
                <div className='row'>
                    <h3 className='my-3'>Mis listas de contactos</h3>
                    {myPhoneLists.length === 0 ? <p>Aquí aparecerán tus listas de contactos cuando las crees</p> :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre de la lista</th>
                                    <th scope="col">Editar</th>
                                    <th scope="col">Borrar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPhoneLists.map((phoneList, index) => {
                                    return (
                                        <tr key={phoneList._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{phoneList.title}</td>
                                            <td><AiFillEdit style={{ cursor: "pointer" }} onClick={() => navigate('/massive-whatsapp-sender/editSavedRecord', { state: { props: phoneList, recordType: "phoneList" } })} /></td>
                                            <td><FiTrash2 style={{ cursor: "pointer" }} onClick={() => handleShow("phoneList", phoneList._id)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalData.typeOfRecord === 'message' ? '¿Estás seguro que quieres borrar este mensaje?' : '¿Estás seguro que quieres borrar esta lista de contactos?'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalData.typeOfRecord === 'message' ? 'Al dar click en el botón de borrar no podrás recuperar tu mensaje guardado' : 'Al dar click en el botón de borrar no podrás recuperar tu lista de contactos'}</Modal.Body>
                    <Modal.Footer>
                        <div className='btn btn-secondary' onClick={handleClose}>Volver</div>
                        <div className='btn btn-danger' onClick={() => handleRecordDelete(modalData.id, modalData.typeOfRecord)}>Borrar</div>
                    </Modal.Footer>
                </Modal>
            </div> : ''}
        </div>
    )
}
