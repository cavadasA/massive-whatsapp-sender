import React, { useEffect } from 'react'
import { useState } from "react";
import Row from './components/Row';
// import Picker from 'emoji-picker-react';
import { FiTrash2 } from 'react-icons/fi'
import { BiBold } from 'react-icons/bi'
import { FiItalic } from 'react-icons/fi'
import { IoIosSave } from 'react-icons/io'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { useAuth } from './context/authContext';
import { Dropdown } from 'react-bootstrap';
// import { BsEmojiSmile } from 'react-icons/bs'


export default function Main() {

    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [phoneListTitle, setPhoneListTitle] = useState("");
    const [showNewMessageBox, setShowNewMessageBox] = useState(false);
    const [showNewPhonesBox, setShowNewPhonesBox] = useState(false);
    const [preProcessedPhones, setPreProcessedPhones] = useState("");
    const [processedPhones, setProcessedPhones] = useState([]);
    const [whatsappLinks, setWhatsappLinks] = useState([]);
    // const [showPicker, setShowPicker] = useState(false);
    const { user, loading, myMessages, myPhoneLists, getMessages, getPhoneLists } = useAuth()
    const serverBaseUrl = 'http://localhost:5000/api/';

    /* DA FORMATO A LOS TELÉFONOS Y VERIFICA QUE NO HAYA TEXTO */
    function handlePhones(phonesAsText) {
        const regExp = /[a-zA-Z]/g;
        let phonesSeparatedByLine = phonesAsText.split('\n');
        setProcessedPhones(() => [])
        setWhatsappLinks(() => [])
        let phonesWithNoSpaces = [];
        phonesSeparatedByLine.forEach(phone => {
            if (regExp.test(phone)) {
                return
            } else {
                let numbers = phone.split(' ');
                phonesWithNoSpaces = [...phonesWithNoSpaces, numbers[0]];
            }
        })
        phonesWithNoSpaces.forEach(phone => {
            if (phone.charAt(0) === "+") { /*+593989803423*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(1)])
            } else if (phone.charAt(0) === "0" && phone.charAt(1) === "0") { /*00593984505619*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(2, phone.length)])
            } else if (phone === "") {
                return;
            }
        });
    }
    /* MANEJA EL "LIMPIAR" LAS CAJAS DE TEXTO */
    function handleDelete(inputBox) {
        if (inputBox === "message") {
            setMessage(() => "");
        } else if (inputBox === "phones") {
            setProcessedPhones(() => [])
            setPreProcessedPhones(() => "")
        }
        setWhatsappLinks(() => [])
    }
    /* CREA LOS LINKS PARA LOS NUEVOS MENSAJES DE WHATSAPP */
    function createLinks() {
        processedPhones.forEach(phone => {
            setWhatsappLinks(oldArray => [...oldArray, { "telefono": phone, "enlace": "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(message) }]);
        })
    }
    /* MANEJA EL CAMBIO A NEGRITAS Y CURSIVA DEL TEXTO SELECCIONADO */
    function handleTextModification(type) {
        let textArea = document.getElementById('messageTextArea');
        let indexBeginningSelection = textArea.selectionStart;
        let indexEndingSelection = textArea.selectionEnd;
        let selectedText = message.substring(indexBeginningSelection, indexEndingSelection)
        let textBeforeSelection = message.substring(0, indexBeginningSelection)
        let textAfterSelection = message.substring(indexEndingSelection)
        if (type === 'bold') {
            let boldedText = "*" + selectedText + "*"
            setMessage(textBeforeSelection + boldedText + textAfterSelection);
        } else if (type === 'italic') {
            let italickedTExt = "_" + selectedText + "_"
            setMessage(textBeforeSelection + italickedTExt + textAfterSelection);
        }
    }
    /*const onEmojiClick = (event, emojiObject) => {
        let textArea = document.getElementById('messageTextArea');
        let typingPosition = textArea.selectionEnd;
        console.log(String.fromCodePoint('0x' + emojiObject.unified))
        if (textArea) {
            let firstPart = runes.substr(message, 0, typingPosition);
            let secondPart = runes.substr(message, typingPosition);
            setMessage(firstPart + String.fromCodePoint('0x' + emojiObject.unified) + secondPart);
            textArea.selectionEnd = typingPosition + 1;
            textArea.focus()
            window.setTimeout(function () {
                textArea.setSelectionRange(typingPosition + 1, typingPosition + 1, 'none')
            }, 0);
            setShowPicker(val => !val)
        }
    }*/
    useEffect(() => {
        if (processedPhones.length !== 0) {
            createLinks();
        }
    }, [processedPhones])
    /* MUESTRA EL CURSOR COMO UN CARET | EN LA CAJA DE TELEFONOS FUERA DEL TEXTAREA Y ENFOCA EL CUADRO DE TEXTO AL DAR CLICK */
    const handleClickOutsideTextArea = (box) => {
        let textArea = document.getElementById(box);
        textArea.focus()
    }
    /* MANEJA EL MOSTRAR Y OCULTAR EL INPUT PARA GUARDAR UN MENSAJE  */
    const handleShowSaveMessage = () => {
        setShowNewMessageBox((prevState) => !prevState)
    }
    const handleShowSavePhones = () => {
        setShowNewPhonesBox((prevState) => !prevState)
    }
    /* MANEJA EL CAMBIO DEL VALOR DEL INPUT DEL TITULO DEL NUEVO MENSAJE */
    const handleTitleChange = (newTitle) => {
        setTitle((prevTitle) => newTitle)
    }
    /* MANEJA EL CAMBIO DEL VALOR DEL INPUT DEL TITULO DE LOS NUEVOS TELÉFONOS */
    const handlePhoneTitleChange = (newTitle) => {
        setPhoneListTitle((prevTitle) => newTitle)
    }
    /* PETICIÓN A LA API PARA CREAR UN NUEVO MENSAJE EN LA BBDD */
    const handleSaveMessage = async () => {
        await fetch(serverBaseUrl + 'newMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: title,
                    message: message,
                    email: user.email
                }
            )
        })
            .then(
                data => {
                    console.log(data)
                }
            )
        getMessages();
        handleShowSaveMessage()
    }
    const handleSavePhoneList = async () => {
        await fetch(serverBaseUrl + 'newPhoneList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: phoneListTitle,
                    phoneList: preProcessedPhones,
                    email: user.email
                }
            )
        })
            .then(
                data => {
                    console.log(data)
                }
            )
        getPhoneLists();
        handleShowSavePhones()
    }
    /* MUESTRA EL MENSAJE SELECCIONADO EN LA CAJA DE MENSAJES */
    const handleSetMessage = (id) => {
        let receivedMessage = myMessages.find(o => o._id === id)
        setMessage(receivedMessage.message)
    }
    /* MUESTRA LA LISTA DE TELÉFONOS SELECCIONADA EN LA CAJA DE TELÉFONOS */
    const handleSetPhoneLists = (id) => {
        let receivedPhoneList = myPhoneLists.find(o => o._id === id)
        setPreProcessedPhones(receivedPhoneList.phoneList)
    }
    /* SI NO HAY UN USUARIO CONECTADO, EN CADA CAMBIO DE LA VARIABLE USUARIO, NO MUESTRA LA CAJA PARA GUARDAR UN MENSAJE */
    useEffect(() => {
        if (!loading) {
            if (!user) {
                setShowNewMessageBox(false)
            }
        }
    }, [user])

    return (
        <div>
            <div className='row'>
                <div className='col px-4 py-2'>
                    <div className='row'>
                        <div className='col'>
                            <div className='border border-dark border-2 textAreaBox mt-4 messageText'>
                                <div className='row'>
                                    <div className="input-group input-group-lg">
                                        <textarea id='messageTextArea' placeholder='Pon tu mensaje aquí' style={{ border: "none", outline: "none", width: "100%" }} className="p-2 textAreaBox" rows={10} value={message} onChange={(event) => setMessage(event.target.value)}></textarea>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-1 ms-2'>
                                        <FiTrash2 onClick={() => handleDelete("message")} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                    </div>
                                    <div className='col-1 '>
                                        <BiBold onMouseDown={() => handleTextModification('bold')} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                    </div>
                                    <div className='col-1'>
                                        <FiItalic onMouseDown={() => handleTextModification('italic')} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                    </div>
                                    {user &&
                                        <div className='col-1'>
                                            <IoIosSave onMouseDown={handleShowSaveMessage} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                        </div>}
                                    {user &&
                                        <div className='col-1'>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                                    Mis mensajes guardados
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {myMessages.map(fetchedMessage => {
                                                        return <Dropdown.Item key={fetchedMessage._id} onClick={(e) => handleSetMessage(fetchedMessage._id)}>{fetchedMessage.title}</Dropdown.Item>
                                                    })}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>}
                                    {/*<div className='col-1 align-self-start'>
                                <BsEmojiSmile onClick={() => {
                                    setShowPicker(val => !val);
                                }}
                                    className='mb-3' style={{ cursor: "pointer" }} size={30} />
                            </div>*/}
                                    <div className='col text-end me-2'>
                                        <IoMdArrowRoundForward onMouseDown={() => handlePhones(preProcessedPhones)} className='mb-3' style={{ cursor: "pointer", color: '#147DF5' }} size={30} />
                                    </div>
                                    {/*showPicker && <Picker
                                pickerStyle={{ width: '100%' }}
                        onEmojiClick={onEmojiClick} />*/}
                                </div>
                            </div>
                            {showNewMessageBox ?
                                <div>
                                    <div class="row g-3 align-items-center mt-2">
                                        <div class="col-auto">
                                            <label for="inputPassword6" class="col-form-label">Nuevo mensaje guardado</label>
                                        </div>
                                        <div class="col-auto input-group mb-3">
                                            <input type="text" className="form-control" aria-label="New message" id="newMessage" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder='Titulo del mensaje' />
                                            <button type="button" className="btn btn-outline-success" onClick={handleSaveMessage}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                                : ''}
                        </div>
                        {whatsappLinks.length === 0 ? (
                            <div className='col mt-4' style={{ color: 'gray' }}>
                                <h2>Instrucciones</h2>
                                <p>En la primera caja deberás escribir el mensaje que quieras enviar a tus contactos.</p>
                                <p>Puedes usar el botón de <b>B</b> para que el texto seleccionado se envíe en formato de negrita en whatsapp.</p>
                                <p>También puedes usar el botón de <b><i>I</i></b> para que el texto que selecciones se envíe en formato de cursiva en whatsapp.</p>
                                <br />
                                <p>Una vez que hayas escrito tu mensaje e ingresado los teléfonos, podrás dar click en el botón de <b><IoMdArrowRoundForward></IoMdArrowRoundForward></b> para generar los enlaces de whatsapp.</p>
                            </div>
                        ) : ''}
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <div className='border border-dark border-2 textAreaBox mt-4 telephoneNumbers'>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="input-group input-group-lg">
                                            <textarea id='phonesTextArea' placeholder='Números telefónicos' style={{ border: "none", outline: "none", width: "100%" }} className="p-2 textAreaBox" rows={5} value={preProcessedPhones} onChange={(event) => setPreProcessedPhones(event.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-1 ms-2'>
                                        <FiTrash2 onClick={() => handleDelete("phones")} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                    </div>
                                    {user &&
                                        <div className='col-1'>
                                            <IoIosSave onMouseDown={handleShowSavePhones} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                        </div>}
                                    {user &&
                                        <div className='col-1'>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                                    Mis teléfonos guardados
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {myPhoneLists.map(fetchedPhoneList => {
                                                        return <Dropdown.Item key={fetchedPhoneList._id} onClick={(e) => handleSetPhoneLists(fetchedPhoneList._id)}>{fetchedPhoneList.title}</Dropdown.Item>
                                                    })}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>}
                                    <div className='col' style={{ cursor: "text" }} onClick={() => { handleClickOutsideTextArea('phonesTextArea') }}></div>
                                </div>

                            </div>
                            {showNewPhonesBox ?
                                <div>
                                    <div class="row g-3 align-items-center mt-2">
                                        <div class="col-auto">
                                            <label for="inputPassword6" class="col-form-label">Nueva lista de teléfonos</label>
                                        </div>
                                        <div class="col-auto input-group mb-3">
                                            <input type="text" className="form-control" aria-label="New message" id="newMessage" value={phoneListTitle} onChange={(e) => handlePhoneTitleChange(e.target.value)} placeholder='Título de la lista' />
                                            <button type="button" className="btn btn-outline-success" onClick={handleSavePhoneList}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                                : ''}
                        </div>
                        {whatsappLinks.length === 0 ? (
                            <div className='col mt-4' style={{ color: 'gray' }}>
                                <p>En la segunda caja deberás escribir, en forma de lista, los teléfonos a donde quieres enviar tu mensaje y deberán estar en el siguiente formato: </p>
                                <p>Código del país (+34, +593, +52, etc.) <b>+</b> teléfono. Por ejemplo: +59322505660 ó +525536017599</p>
                                <p>También los podrás escribir así: </p>
                                <p>2 ceros (00) <b>+</b> código del país (34, 593, 52, etc.) <b>+</b> teléfono. Por ejemplo: 0059322505660 ó 00525536017599</p>
                            </div>
                        ) : ''}
                    </div>
                </div>
                {whatsappLinks.length !== 0 ? (
                    <div className='col px-4 py-4'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Teléfono</th>
                                    <th scope="col">Enlace</th>
                                    <th scope="col">Enviado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {whatsappLinks.map((link, index) => {
                                    return (
                                        <Row index={index} link={link} key={index}></Row>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : ''}
            </div>
        </div>
    )
}
