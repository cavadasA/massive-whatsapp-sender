import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import background from '../resources/colors.jpeg'

export default function Navbar() {

    const { user, logout, loading } = useAuth()
    const [userDisplayName, setUserDisplayName] = useState(user)
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!loading) {
            if (user) {
                setUserDisplayName(user.displayName)
            }
        }
    }, [user])

    const handleGoToProfile = () => {
        navigate('/massive-whatsapp-sender/userDashboard')
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                {loading ? <h1 className='text-center'>Loading...</h1> : (
                    <form className="container-fluid justify-content-between">
                        <Link to="/massive-whatsapp-sender/" style={{ textDecoration: 'none' }}>
                            <h1 className='mb-0 ms-3'>
                                <span className='d-inline' style={{ fontFamily: 'sublimaextrabold', color: '#A1FF0A' }}>What</span>
                                <span className='d-inline' style={{ fontFamily: 'sublimaextrabold', color: '#0AEFFF' }}>ss</span>
                                <span className='d-inline' style={{ fontFamily: 'sublimaextrabold', color: '#BE0AFF' }}>ive</span>
                            </h1>
                        </Link>
                        {!user ? (<Link to="/massive-whatsapp-sender/login">
                            <button className="btn btn-primary me-2" type="button">Iniciar sesión</button>
                        </Link>) :
                            user &&
                            <div>
                                <DropdownButton align="end" style={{ background: `url(${background})` }} title="Mi cuenta" id="dropdown-menu-align-end" >
                                    <Dropdown.Item eventKey="1" onClick={handleGoToProfile}>Ajustes</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="2" onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                                </DropdownButton>
                            </div>}
                    </form>
                )}
            </nav>
        </div>
    )
}
