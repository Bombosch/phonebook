import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { AppContext } from "./Provider/provider";

import "../Css/login.css";

function Login() {
  const [enableButton, setEnableButton] = useState(true);
  const [messageValidation, setMessageValidation] = useState("");
  const [state, setState] = useContext(AppContext);
  const [user, setUser] = useState({
    nameUser: "",
    password: "",
  });

  useEffect(() => {
    setEnableButton(true);
    if (user.nameUser.length < 5) {
      setMessageValidation(
        "Tu nombre de usuario no debe ser menor a 5 carácteres"
      );
      return;
    }
    if (user.password.length < 8) {
      setMessageValidation("Tu contraseña no debe ser menor a 8 carácteres.");
      return;
    }
    setMessageValidation("");
    setEnableButton(false);
  }, [user]);

  const handlerOnChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const ObtieneToken = async (e) => {
    setState({
      ...state,
      loading: true,
    });
    var sha1 = require("sha1");
    const Login = {
      UserName: user.nameUser,
      Password: sha1(user.password),
    };
    const Url = "https://localhost:44337/api/Login/";
    console.log(Url, Login);
    await axios
      .post(Url, Login)
      .then((response) => {
        console.log("response", response);
        setState({ ...state, token: response.data, loading:false });
        localStorage["TokenId"] = response.data;
        const moment = require("moment");
        localStorage["TokenDate"] = moment();
        //Obtenemos el Token
      })
      .catch((error) => {
        debugger;
        const Msg = error.response.data;
        setState({
          ...state,
          modal: {
            state: true,
            tittle: "¡Oh no!",
            message: Msg,
          },
          loading: false, 
        });
        console.log("Error:", error);
      });
  };

  return (
    <Container className="flex-center section ">
      <div className="login shadow">
        <Row className="text-center">
          <h2 className="mx-auto text-center">
            Bienvenido a tu agenda telefónica
          </h2>
        </Row>
        <Row className="text-center my-3">
          <h5 className="mx-auto text-center">
            Por favor introduce tus credenciales
          </h5>
        </Row>
        <Row>
          <Form autoComplete="off" className="mx-auto" xs={12}>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">
                Nombre de usuario*
              </Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-badge"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z" />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="inlineFormInputGroup"
                  maxLength="50"
                  onChange={(e) => handlerOnChange(e)}
                  name="nameUser"
                  autoComplete="off"
                  value={user.userName}
                  placeholder="Ingresa tu nombre de usuario"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Password *</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fillRule="currentColor"
                      className="bi bi-lock-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="inlineFormInputGroup"
                  maxLength="50"
                  onChange={(e) => handlerOnChange(e)}
                  autoComplete="off"
                  type="password"
                  name="password"
                  value={user.password}
                  placeholder="Ingresa tu contraseña"
                />
              </InputGroup>
            </Col>
            <Col className="text-center">
              <span className="mx-auto text-center">{messageValidation}</span>
            </Col>
            <Col xs="auto text-center">
              <Button
                variant="primary"
                disabled={enableButton}
                type="button"
                onClick={(e) => ObtieneToken(e)}
                className="my-4 shadow w-100 mx-auto "
              >
                Ingresar
              </Button>
            </Col>
          </Form>
        </Row>
        <Row>
          <Link to="/createUser" className="text-center mx-auto my-3">
            Crear una cuenta
          </Link>
        </Row>
      </div>
    </Container>
  );
}

export default Login;
