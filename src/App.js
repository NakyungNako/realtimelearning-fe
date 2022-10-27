import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Main />} />
        <Route path="/signup" exact element={<Register />} />
        <Route path="/login" exact element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
