import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/Register";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound";
import Users from "./components/Users";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Main />} />
        <Route path="/signup" exact element={<Register />} />
        <Route path="/login" exact element={<Login />} />

        {/*protected routes*/}
        <Route element={<RequireAuth />}>
          <Route path="/home" exact element={<Home />} />
          <Route path="/users" exact element={<Users />} />
        </Route>

        {/* others */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
