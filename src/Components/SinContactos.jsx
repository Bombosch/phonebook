import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import "../Css/sinContactos.css";

import Agenda from "../Images/agenda.png";

function SinContactos() {



  return (
    <Container className="sin-contactos flex-center section">
      <Row>
        <Col className="text-center">
          <h2 className="mb-5 text-center mx-auto">
            Aún no tienes contáctos registrados
          </h2>
          <img
            src={Agenda}
            className="my-3 mr-5"
            title="Agenda telefónica Jaime Bosch Dev"
            alt="Agenda telefónica Jaime Bosch Dev"
          />

          <Link to="/createContact" className="shadow">
            Registra tu primer contácto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-person-plus-fill mx-3"
              viewBox="0 0 16 16"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path
                fill-rule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default SinContactos;
