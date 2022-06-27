import "./App.css";
import Navbar from "./components/Navbar";
import Main from "./main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./context/authContext.js";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import UserDashboard from "./components/UserDashboard";
import { ProtectedRoute } from "./components/protectedRoute";
import EditRecord from "./components/EditRecord";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/massive-whatsapp-sender/" exact element={<Main />} />
          <Route
            path="/massive-whatsapp-sender/signup"
            exact
            element={<Signup />}
          />
          <Route
            path="/massive-whatsapp-sender/login"
            exact
            element={<Login />}
          />
          <Route
            path="/massive-whatsapp-sender/forgotPassword"
            exact
            element={<ForgotPassword />}
          />
          <Route
            path="/massive-whatsapp-sender/userDashboard"
            exact
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/massive-whatsapp-sender/editSavedRecord"
            exact
            element={
              <ProtectedRoute>
                <EditRecord />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
