import "./App.css";
import Navbar from "./components/Navbar";
import Main from "./main";
import Auth from "./components/Auth";
import { Routes, Route } from "react-router-dom"


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/massive-whatsapp-sender/" exact element={Main()} />
        <Route path="/massive-whatsapp-sender/auth" exact element={Auth()} />
      </Routes>
    </div>
  );
}

export default App;
