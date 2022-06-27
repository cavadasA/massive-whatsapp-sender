import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AiFillEdit } from 'react-icons/ai'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'


export default function EditRecord(props) {

  const location = useLocation();
  const navigate = useNavigate();

  const { getMessages, getPhoneLists, updateMessage, updatePhoneList } = useAuth()
  const [phoneListTitle, setPhoneListTitle] = useState("")
  const [preProcessedPhones, setPreProcessedPhones] = useState("");
  const [messageTitle, setMessageTitle] = useState("")
  const [messageBody, setMessageBody] = useState("")


  const handleInfoChange = (inputBox, newData) => {
    switch (inputBox) {
      case 'phoneListTitle':
        setPhoneListTitle((prevName) => newData)
        break;
      case 'messageTitle':
        setMessageTitle((prevName) => newData)
        break;
      /*case 'password':
          setPassword((prevPassword) => newData)
          break;*/
      default:
        break;
    }
  }

  useEffect(() => {
    if (location.state) {
      if (location.state.recordType === "phoneList") {
        setPhoneListTitle(location.state.props.title)
        setPreProcessedPhones(location.state.props.phoneList)
      } else if (location.state.recordType === "savedMessage") {
        setMessageTitle(location.state.props.title)
        setMessageBody(location.state.props.message)
      }
    }
  }, [])

  const handleMessageUpdate = async (idToUpdate) => {
    await updateMessage(idToUpdate, messageTitle, messageBody);
    getMessages();
    getPhoneLists();
    navigate('/massive-whatsapp-sender/userDashboard')
  }
  const handlePhoneListUpdate = async (idToUpdate) => {
    await updatePhoneList(idToUpdate, phoneListTitle, preProcessedPhones);
    getMessages();
    getPhoneLists();
    navigate('/massive-whatsapp-sender/userDashboard')
  }

  return (
    <div>
      {location.state.recordType === "savedMessage" ?
        <div className='row ms-5 mt-5'>
          <div className='col-4'>
            <form className='text-start'>
              <label htmlFor="name" className="form-label">Título del mensaje</label>
              <div className="input-group mb-3">
                <input type='text' className="form-control" id="phoneListTitle" value={messageTitle} onChange={(e) => handleInfoChange('messageTitle', e.target.value)} />
                <span style={{ cursor: "pointer" }} className='input-group-text' ><AiFillEdit /></span>
              </div>
              <div className='border border-dark border-2 textAreaBox mt-4 telephoneNumbers'>
                <div className="input-group input-group-lg">
                  <textarea id='phonesTextArea' placeholder='Números telefónicos' style={{ border: "none", outline: "none", width: "100%" }} className="p-2 textAreaBox" rows={5} value={messageBody} onChange={(event) => setMessageBody(event.target.value)}></textarea>
                </div>
              </div>
            </form>
            <div className='d-flex justify-content-between mx-4 mt-4'>
              <div className='btn btn-primary' onClick={() => navigate('/massive-whatsapp-sender/userDashboard')}>Volver</div>
              <div className='btn btn-success' onClick={() => handleMessageUpdate(location.state.props._id)}>Guardar cambios</div>
            </div>
          </div>
        </div>
        :
        location.state.recordType === "phoneList" ?
          <div className='row ms-5 mt-5'>
            <div className='col-4'>
              <form className='text-start'>
                <label htmlFor="name" className="form-label">Nombre de la lista de contactos</label>
                <div className="input-group mb-3">
                  <input type='text' className="form-control border-2 border-dark" id="phoneListTitle" value={phoneListTitle} onChange={(e) => handleInfoChange('phoneListTitle', e.target.value)} />
                </div>
                <div className='border border-dark border-2 textAreaBox mt-4 telephoneNumbers'>
                  <div className="input-group input-group-lg">
                    <textarea id='phonesTextArea' placeholder='Números telefónicos' style={{ border: "none", outline: "none", width: "100%" }} className="p-2 textAreaBox" rows={5} value={preProcessedPhones} onChange={(event) => setPreProcessedPhones(event.target.value)}></textarea>
                  </div>
                </div>
              </form>
              <div className='d-flex justify-content-between mx-4 mt-4'>
                <div className='btn btn-primary' onClick={() => navigate('/massive-whatsapp-sender/userDashboard')}>Volver</div>
                <div className='btn btn-success' onClick={() => handlePhoneListUpdate(location.state.props._id)}>Guardar cambios</div>
              </div>
            </div>
          </div> : ''}
    </div>
  )
}

EditRecord.propTypes = {
  recordType: PropTypes.string,
  phoneListToEdit: PropTypes.object,
  savedMessageToEdit: PropTypes.object
}