import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/index.css";


import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import InformacionContacto from './Components/InformacionContacto'
import MensajeInformativo from "./Components/MensajeInformativo";
import MyProvider from "./Components/Provider/provider";
import NuevoUsuario from "./Components/NuevoUsuario";
import Home from "./Components/Home";
import Cargando from "./Components/Cargando"

import "./Css/indexMedia.css";

ReactDOM.render(
  <MyProvider>
    <Router >
      <Switch>
        <Route path="/createUser">
          <NuevoUsuario />
        </Route>
        <Route path="/createContact">
          <InformacionContacto />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router >
    <MensajeInformativo />
    <Cargando/>
  </MyProvider>,
  document.getElementById("root")
);
