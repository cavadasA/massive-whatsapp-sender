import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {

    const user = null;

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <form className="container-fluid justify-content-end">
                    {user ? "" : (
                        <Link to="/massive-whatsapp-sender/auth">
                            <button className="btn btn-primary me-2" type="button">Iniciar sesión</button>
                        </Link>
                    )}
                </form>
            </nav>
        </div>
    )
}
