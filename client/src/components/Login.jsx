import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useAuth } from '../context/authContext'

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [disabledSubmit, setDisabledSubmit] = useState(true)
    const [loginFailed, setLoginFailed] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [redirectionMessage, setRedirectionMessage] = useState(false)
    const navigate = useNavigate();

    const { login, loginWithGoogle } = useAuth();

    const handleChangeView = () => {
        navigate('/massive-whatsapp-sender/signup')
    }
    const handleInfoChange = (inputBox, newData) => {
        switch (inputBox) {
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
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await login(email, password)
            setLoginFailed(false)
            setRedirectionMessage(true);
            navigate('/massive-whatsapp-sender/userDashboard')

        } catch (error) {
            console.log(error.code)
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('Otro usuario ya está utilizando el correo electrónico proporcionado.')
                setLoginFailed(true)
            } else if (error.code === "auth/invalid-email") {
                setErrorMessage("El correo electrónico es inválido.");
                setLoginFailed(true)
            } else if (error.code === "auth/operation-not-allowed") {
                setErrorMessage("Operación no permitida.");
                setLoginFailed(true)
            } else if (error.code === "auth/weak-password") {
                setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
                setLoginFailed(true)
            } else {
                setErrorMessage(error.message);
                setLoginFailed(true)
            }
        }


    }
    const handleGoogleSignin = async () => {
        try {
            await loginWithGoogle()
            setRedirectionMessage(true);
            navigate('/massive-whatsapp-sender/userDashboard')
        } catch (error) {
            setErrorMessage(error.message);
            setLoginFailed(true)
        }
    }

    useEffect(() => {
        if (email !== '' && password !== '') {
            setDisabledSubmit(false)
        }
        else { setDisabledSubmit(true) }

    }, [email, password])

    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-4'>
                <div>
                    <div>
                        <h3>Inicio de sesión</h3>
                        {redirectionMessage ? (<div className="alert alert-primary" role="alert">
                            En un momento será redirigido a la página principal
                        </div>) : ''}
                        {loginFailed ? <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div> : ''}
                    </div>
                </div>
                <form className='text-start'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" autoComplete='username' id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                    </div>
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <div className="input-group mb-3">
                        <input type={showPassword ? "text" : "password"} autoComplete="current-password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => handleInfoChange('password', e.target.value)} />
                        <span style={{ cursor: "pointer" }} className='input-group-text' onClick={handleShowPassword}>{showPassword ? (<AiFillEyeInvisible />) : (<AiFillEye />)}</span>
                    </div>
                    <div className='text-center d-grid gap-2'>
                        <button type="submit" className="btn btn-success" onClick={(event) => handleSubmit(event)} disabled={disabledSubmit}>Iniciar sesión</button>
                    </div>
                </form>
                <div className="strike mt-3">
                    <span>O</span>
                </div>
                <div className='text-center d-grid gap-2 mt-3'>
                    <button className="btn btn-outline-secondary text-black  " onClick={handleGoogleSignin}><img className='me-3 pb-1' src="https://img.icons8.com/color/16/000000/google-logo.png" />Inicia sesión con Google</button>
                </div>
                <div className='text-center d-grid gap-2 mt-3'>
                    <button className="btn btn-primary" onClick={handleChangeView}>¿Aún no tienes cuenta? Regístrate</button>
                </div>
                <div className='text-center d-grid gap-2 mt-3 '>
                    <Link to={"/massive-whatsapp-sender/forgotPassword"}>¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
        </div>
    )
}
