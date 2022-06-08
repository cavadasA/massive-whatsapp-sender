import React, { useState, useEffect } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

export default function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignIn, setIsSignUp] = useState(false);
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [disabledSubmit, setDisabledSubmit] = useState(true)

    useEffect(() => {
        if (isSignIn) {
            {email !== '' && password !== '' ? setDisabledSubmit(false) : setDisabledSubmit(true)}
        } else {
            {name !== '' && lastName !== '' && email !== '' && password !== '' ? setDisabledSubmit(false) : setDisabledSubmit(true)}
        }
    }, [name, lastName, email, password])

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }
    const handleChangeView = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp)
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

    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-4'>
                <div>
                    {isSignIn ? (
                        <div>
                            <h3>Inicio de sesión</h3>
                        </div>
                    ) : (
                        <div>
                            <h3>¡Crea tu cuenta de Whatssive!</h3>
                            <p>Una cuenta gratuita para poder guardar tus mensajes y contactos.</p>
                        </div>
                    )}
                </div>
                <form className='text-start'>
                    {isSignIn ? '' : (
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
                    )}
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" autoComplete='username' id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                        {isSignIn ? '' : (<div id="emailHelp" className="form-text">Nunca compartiremos tu correo electrónico con nadie.</div>
                        )}
                    </div>
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <div className="input-group mb-3">
                        <input type={showPassword ? "text" : "password"} autoComplete="current-password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => handleInfoChange('password', e.target.value)} />
                        <span style={{ cursor: "pointer" }} className='input-group-text' onClick={handleShowPassword}>{showPassword ? (<AiFillEyeInvisible />) : (<AiFillEye />)}</span>
                    </div>
                    <div className='text-center d-grid gap-2'>
                        <button type="submit" className="btn btn-success" disabled={disabledSubmit}>{isSignIn ? 'Iniciar sesión' : 'Regístrate'}</button>
                    </div>
                </form>
                <div className='text-center d-grid gap-2 mt-3'>
                    <button className="btn btn-primary" onClick={handleChangeView}>{isSignIn ? '¿Aún no tienes cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión' }</button>
                </div>
            </div>
        </div>
    )
}
