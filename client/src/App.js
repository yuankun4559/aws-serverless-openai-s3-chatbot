// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {ProvideAuth} from "./commons/use-auth";
import RequireAuth from "./pages/private-route";

import SignIn from "./pages/login";
import ChatPage from "./pages/chatpage";
import Register from './pages/registerpage'

import './App.css';
function App() {
  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register-user" element={<Register />} />
          <Route path="/chat" element={<RequireAuth redirectPath="/" ><ChatPage/></RequireAuth>} />
          {/* <Route path="/chat" element={<ChatPage />}/> */}
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;
