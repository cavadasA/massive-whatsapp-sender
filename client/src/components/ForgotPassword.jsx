import React, { useState } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {

    const [email, setEmail] = useState('')
    const { resetPassword } = useAuth();
    const [redirectionMessage, setRedirectionMessage] = useState(false)
    const navigate = useNavigate();


    const handleInfoChange = (inputBox, newData) => {
        switch (inputBox) {
            case 'email':
                setEmail((prevEmail) => newData)
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await resetPassword(email)
            setRedirectionMessage(true);
            setTimeout(() => {
                navigate('/massive-whatsapp-sender/login')
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-4'>
                <div>
                    <div>
                        <h3>Recupera tu contraseña</h3>
                        {redirectionMessage ? (<div className="alert alert-primary" role="alert">
                            Hemos enviado un correo de recuperación a la dirección ingresada
                        </div>) : ''}
                    </div>
                </div>
                <form className='text-start'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" autoComplete='username' id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                    </div>
                    <div className='text-center d-grid gap-2'>
                        <button type="submit" className="btn btn-success" onClick={(event) => handleSubmit(event)} >Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
