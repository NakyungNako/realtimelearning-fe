import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound";
import PersistLogin from "./components/PersistLogin";
import Users from "./components/Users";
import useAuth from "./hooks/useAuth";
import LoggedNavBar from "./components/NavBar/LoggedNavBar";
import Main from "./components/Main";
import EmailVerification from "./components/EmailVerification";
import JoinGroup from "./components/JoinGroup";
import EditPresentation from "./components/Presentation/EditPresentation/EditPresentation";

function App() {
  const { auth } = useAuth();
  return (
    <div className="App">
      {!auth.accessToken ? <NavBar /> : <LoggedNavBar />}
      <Routes>
        <Route path="/signup" exact element={<Register />} />
        <Route path="/login" exact element={<Login />} />
        <Route
          path="/verifyUserEmail/:username/:token"
          exact
          element={<EmailVerification />}
        />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" exact element={<Main />} />
            <Route path="/users" exact element={<Users />} />
            <Route
              path="/joingroup/:grouptoken"
              exact
              element={<JoinGroup />}
            />
            <Route path="/edit/:groupId" exact element={<EditPresentation />} />
          </Route>
        </Route>

        {/* others */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
