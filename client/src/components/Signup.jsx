import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useAuth } from '../context/authContext'


export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [disabledSubmit, setDisabledSubmit] = useState(true)
    const [redirectionMessage, setRedirectionMessage] = useState(false)
    const [signupFailed, setSignupFailed] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const serverBaseUrl = 'http://localhost:5000/api/';
    const navigate = useNavigate();

    const { signup } = useAuth();

    useEffect(() => {
        if (name !== '' && lastName !== '' && email !== '' && password !== '') {
            setDisabledSubmit(false)
        }
        else { setDisabledSubmit(true) }

    }, [name, lastName, email, password])
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }
    const handleChangeView = () => {
        navigate('/massive-whatsapp-sender/login')
    }
    const handleInfoChange = (inputBox, newData) => {
        switch (inputBox) {
            case 'name':
                setName((prevName) => newData)
                break;
            case 'lastName':
                setLastName((prevLastName) => newData)
                break;
            case 'email':
                setEmail((prevEmail) => newData)
                break;
            case 'password':
                setPassword((prevPassword) => newData)
                break;
            default:
                break;
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await signup(email, password, name, lastName)
            setSignupFailed(false)
            setRedirectionMessage(true);
            setTimeout(() => {
                navigate('/massive-whatsapp-sender/userDashboard')
            }, 500)
        } catch (error) {
            console.log(error.code)
            if (error.code === 'auth/email-already-in-use'){
                setErrorMessage('Otro usuario ya está utilizando el correo electrónico proporcionado.')
                setSignupFailed(true)
            } else if (error.code === "auth/invalid-email") {
                setErrorMessage("El correo electrónico es inválido.");
                setSignupFailed(true)
            } else if (error.code === "auth/operation-not-allowed") {
                setErrorMessage("Operación no permitida.");
                setSignupFailed(true)
            } else if (error.code === "auth/weak-password") {
                setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
                setSignupFailed(true)
            } else {
                setErrorMessage(error.message);
                setSignupFailed(true)
            }
        }
        
    }

    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-4'>
                <div>
                    <div>
                        <h3>¡Crea tu cuenta de Whatssive!</h3>
                        <p>Una cuenta gratuita para poder guardar tus mensajes y contactos.</p>
                        {redirectionMessage ? (<div className="alert alert-primary" role="alert">
                            En un momento será redirigido para iniciar sesión
                        </div>) : ''}
                        {signupFailed ? <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div> : ''}
                    </div>
                </div>
                <form className='text-start'>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input type="text" className="form-control" aria-label="First name" id="name" value={name} onChange={(e) => handleInfoChange('name', e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="lastName" className="form-label">Apellido</label>
                            <input type="text" className="form-control" aria-label="Last name" id="lastName" value={lastName} onChange={(e) => handleInfoChange('lastName', e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" autoComplete='username' id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                        <div id="emailHelp" className="form-text">Nunca compartiremos tu correo electrónico con nadie.</div>
                    </div>
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <div className="input-group mb-3">
                        <input type={showPassword ? "text" : "password"} autoComplete="current-password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => handleInfoChange('password', e.target.value)} />
                        <span style={{ cursor: "pointer" }} className='input-group-text' onClick={handleShowPassword}>{showPassword ? (<AiFillEyeInvisible />) : (<AiFillEye />)}</span>
                    </div>
                    <div className='text-center d-grid gap-2'>
                        <button type="submit" className="btn btn-success" onClick={(event) => handleSubmit(event)} disabled={disabledSubmit}>Regístrate</button>
                    </div>
                </form>
                <div className='text-center d-grid gap-2 mt-3'>
                    <button className="btn btn-primary" onClick={handleChangeView}>¿Ya tienes una cuenta? Inicia sesión</button>
                </div>
            </div>
        </div>
    )
}
