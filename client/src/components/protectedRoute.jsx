import { useAuth } from "../context/authContext";
import { Navigate } from "react-router";


export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return <img src="https://c.tenor.com/tEBoZu1ISJ8AAAAC/spinning-loading.gif"></img>

    if (!user) return <Navigate to='/massive-whatsapp-sender/login' />

    return <>{children}</>
}