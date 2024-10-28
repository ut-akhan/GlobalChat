// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Chat from './pages/Chat'
import axios from 'axios';
import { UserContextProvider } from './UserContext';

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
    <Router>
      <Routes>
        <Route path="/auth" element={<Home />} />
        <Route path="/texts" element={<Chat />} />
      </Routes>
    </Router>
    </UserContextProvider>

  );
}

export default App;