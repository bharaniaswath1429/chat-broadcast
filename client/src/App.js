import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Signup, Login, Chatroom } from "./pages";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chatroom />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      </div>
    </Router>
  );
}

export default App;
