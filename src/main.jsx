import React, { useEffect } from 'react'
import { useState } from "react";
import Row from './Row';
// import Picker from 'emoji-picker-react';
import { FiTrash2 } from 'react-icons/fi'
import { BiBold } from 'react-icons/bi'
import { FiItalic } from 'react-icons/fi'
import { IoMdArrowRoundForward } from 'react-icons/io'
// import { BsEmojiSmile } from 'react-icons/bs'

export default function Main() {

    const runes = require('runes');
    const [message, setMessage] = useState("");
    const [preProcessedPhones, setPreProcessedPhones] = useState("");
    const [processedPhones, setProcessedPhones] = useState([]);
    const [whatsappLinks, setWhatsappLinks] = useState([]);
    // const [showPicker, setShowPicker] = useState(false);

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
                /*if (phone.charAt(4) === "0") { /*+5930985177596
                    setProcessedPhones(oldArray => [...oldArray, "593" + phone.slice(5, phone.length)])
                } else {*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(1)])
                /*}*/
            } /*else if (phone.charAt(0) === "0" && phone.charAt(1) !== "5" && phone.charAt(1) !== "0") { /*0987500053
                setProcessedPhones(oldArray => [...oldArray, "593" + phone.substring(1, phone.length)])
            }*/ else if (phone.charAt(0) === "0" && phone.charAt(1) === "0") { /*00593984505619*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(2, phone.length)])
            } /*else if (phone.charAt(0) === "0" && phone.charAt(1) === "5") { /*0593984505619
                setProcessedPhones(oldArray => [...oldArray, phone.substring(1, phone.length)])
            } else if (phone.charAt(0) !== "+" && phone.charAt(0) !== "0" && phone.charAt(0) !== "5" && phone.charAt(1) !== "0" && phone !== '') {/*989368259
                setProcessedPhones(oldArray => [...oldArray, "593" + phone])
            } else if (phone.charAt(0) === "5") {/*593968192291
                if (phone.charAt(3) === "0") {/*5930990200193
                    setProcessedPhones(oldArray => [...oldArray, "593" + phone.substring(4, phone.length)])
                } else {
                    setProcessedPhones(oldArray => [...oldArray, phone])
                }
            }*/ else if (phone === "") {
                return;
            }
        });
    }
    function handleDelete(inputBox) {
        if (inputBox === "message") {
            setMessage(() => "");
        } else if (inputBox === "phones") {
            setProcessedPhones(() => [])
            setPreProcessedPhones(() => "")
        }
        setWhatsappLinks(() => [])
    }
    function createLinks() {
        processedPhones.forEach(phone => {
            setWhatsappLinks(oldArray => [...oldArray, { "telefono": phone, "enlace": "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(message) }]);
        })
    }
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
    const handleClickOutsideTextArea = (box) => {
        let textArea = document.getElementById(box);
        textArea.focus()
    }

    return (
        <div>
            <div className='row'>
                <h1>Whatssive</h1>
            </div>
            <div className='row'>
                <div className='col px-4 py-4'>
                    <div className='row'>
                        <div className='col'>
                            <div className='border border-dark textAreaBox mt-4 messageText'>
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
                                    {/*<div className='col-1 align-self-start'>
                                <BsEmojiSmile onClick={() => {
                                    setShowPicker(val => !val);
                                }}
                                    className='mb-3' style={{ cursor: "pointer" }} size={30} />
                            </div>*/}
                                    <div className='col text-end me-2'>
                                        <IoMdArrowRoundForward onMouseDown={() => handlePhones(preProcessedPhones)} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                                    </div>
                                    {/*showPicker && <Picker
                                pickerStyle={{ width: '100%' }}
                        onEmojiClick={onEmojiClick} />*/}
                                </div>
                            </div>
                        </div>
                        {whatsappLinks.length === 0 ? (
                            <div className='col mt-4'>
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
                            <div className='border border-dark textAreaBox mt-4 telephoneNumbers'>
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
                                    <div className='col' style={{ cursor: "text" }} onClick={() => { handleClickOutsideTextArea('phonesTextArea') }}></div>
                                </div>

                            </div>
                        </div>
                        {whatsappLinks.length === 0 ? (
                            <div className='col mt-4'>
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
