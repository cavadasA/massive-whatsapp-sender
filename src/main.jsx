import React, { useEffect } from 'react'
import { useState } from "react";
import Row from './Row';

export default function Main() {

    const [message, setMessage] = useState("");
    const [processedPhones, setProcessedPhones] = useState([]);
    const [preProcessedPhones, setPreProcessedPhones] = useState("");
    const [whatsappLinks, setWhatsappLinks] = useState([]);

    function handlePhones(phonesAsText) {
        let separatedPhones = phonesAsText.split('\n');
        console.log(separatedPhones)
        setProcessedPhones(() => [])
        setWhatsappLinks(() => [])
        separatedPhones.forEach(phone => {
            if (phone.charAt(0) === "+") { /*+593989803423*/
                if (phone.charAt(4) === "0") { /*+5930985177596*/
                    setProcessedPhones(oldArray => [...oldArray, "593" + phone.slice(5, phone.length)])
                } else {
                    setProcessedPhones(oldArray => [...oldArray, phone.substring(1)])
                }
            } else if (phone.charAt(0) === "0" && phone.charAt(1) !== "5" && phone.charAt(1) !== "0") { /*0987500053*/
                setProcessedPhones(oldArray => [...oldArray, "593" + phone.substring(1, phone.length)])
            } else if (phone.charAt(0) === "0" && phone.charAt(1) === "0") { /*00593984505619*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(2, phone.length)])
            } else if (phone.charAt(0) === "0" && phone.charAt(1) === "5") { /*0593984505619*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(1, phone.length)])
            } else if (phone.charAt(0) !== "+" && phone.charAt(0) !== "0" && phone.charAt(0) !== "5" && phone.charAt(1) !== "0" && phone !== '') {/*989368259*/
                setProcessedPhones(oldArray => [...oldArray, "593" + phone])
            } else if (phone.charAt(0) === "5") {/*593968192291*/
                if (phone.charAt(3) === "0") {/*5930990200193*/
                    setProcessedPhones(oldArray => [...oldArray, "593" + phone.substring(4, phone.length)])
                } else {
                    setProcessedPhones(oldArray => [...oldArray, phone])
                }
            } else if (phone === "") {
                return;
            }
        });
    }
    function createLinks() {
        processedPhones.forEach(phone => {
            setWhatsappLinks(oldArray => [...oldArray, { "telefono": phone, "enlace": "https://wa.me/" + phone + "?text=" + encodeURIComponent(message) }]);
        })
    }


    useEffect(() => {
        if (processedPhones.length !== 0) {
            createLinks();
        }
    }, [processedPhones])

    return (
        <div>
            <div className="row">
                <div className="col-6 px-4 py-4">
                    <h1>Mensaje</h1>
                    <div className="input-group input-group-lg">
                        <textarea className="form-control" rows={18} onChange={(event) => setMessage(event.target.value)}></textarea>
                    </div>
                </div>
                <div className="col-6 px-4 py-4">
                    <h1>Teléfonos</h1>
                    <div className="input-group input-group-lg">
                        <textarea className="form-control" rows={18} onChange={(event) => setPreProcessedPhones(event.target.value)}></textarea>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="button">
                        <button
                            className="btn"
                            style={{ backgroundColor: "pink" }}
                            type="button"
                            onClick={() => handlePhones(preProcessedPhones)}
                        >
                            Enviar mono &#128539;
                        </button>
                    </div>
                </div>
            </div>
            {whatsappLinks.length !== 0 ? (
                <div className='row'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Enlace</th>
                                <th scope="col">Check</th>
                            </tr>
                        </thead>
                        <tbody>
                            {whatsappLinks.map((link, index) => {

                                return (/**/
                                    <Row index={index} link={link} key={index}></Row>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : ""}
        </div>
    )
}
