
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UsersList from "./pages/UserList";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isLoggedIn")
  );

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/users" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <UsersList onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/edit/:id"
          element={
            isAuthenticated ? <EditUser /> : <Navigate to="/" />
          }
        />
        <Route
          path="/add-user"
          element={
            isAuthenticated ? <AddUser /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


