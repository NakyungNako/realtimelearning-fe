import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/Register";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound";
import PersistLogin from "./components/PersistLogin";
import Users from "./components/Users";
import useAuth from "./hooks/useAuth";
import LoggedNavBar from "./components/NavBar/LoggedNavBar";

function App() {
  const { auth } = useAuth();
  return (
    <div className="App">
      {!auth.accessToken ? <NavBar /> : <LoggedNavBar />}
      <Routes>
        <Route path="/signup" exact element={<Register />} />
        <Route path="/login" exact element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" exact element={<Home />} />
            <Route path="/users" exact element={<Users />} />
          </Route>
        </Route>

        {/* others */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
