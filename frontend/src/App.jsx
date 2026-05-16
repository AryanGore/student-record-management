import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  return (
    <Router>
      <div>
        <header>
          <div className="container">
            <div id="branding">
              <h1>Student Record System</h1>
            </div>
            <nav>
              <ul>
                {isAuthenticated ? (
                  <>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add">Add Student</Link></li>
                    <li><button onClick={handleLogout} style={{background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', textTransform: 'uppercase', fontSize: '16px'}}>Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <StudentList setAuth={setAuth} /> : <Navigate to="/login" />} />
            <Route path="/add" element={isAuthenticated ? <StudentForm setAuth={setAuth} /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={isAuthenticated ? <StudentForm setAuth={setAuth} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
