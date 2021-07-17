import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory,Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import "../Css/login.css";

import { AppContext } from "./Provider/provider";

function NuevoUsuario() {
  const history = useHistory();
  const [state, setState] = useContext(AppContext);
  const [enableButton, setEnableButton] = useState(true);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    UserName: "",
    Password: "",
    Password2: "",
    Email: "",
  });

  const handlerOnChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    let posicionArroba = newUser.Email.lastIndexOf("@");
    let posicionPunto = newUser.Email.lastIndexOf(".");

    if (newUser.UserName.length < 5) {
      setMessage("Tu nombre de usuario no debe ser menor a 5 carácteres.");
      setEnableButton(true);
      return;
    }
    if (
      !(
        posicionArroba < posicionPunto &&
        posicionArroba > 0 &&
        newUser.Email.indexOf("@@") === -1 &&
        posicionPunto > 2 &&
        newUser.Email.length - posicionPunto > 2
      )
    ) {
      setMessage("Por favor escribe un correo con un formato válido.");
      setEnableButton(true);
      return;
    }
    if (newUser.Password.length < 8) {
      setMessage(
        "Tu contraseña debe ser de al menos 8 carácteres. No olvides utilizas signos especiales como ($, /, ., etc)"
      );
      setEnableButton(true);
      return;
    }
    if (newUser.Password != newUser.Password2) {
      setMessage("Tus contraseñas no coinciden.");
      setEnableButton(true);
      return;
    }

    setEnableButton(false);
    setMessage("");
  }, [newUser]);

  const urlBase = "https://localhost:44337/api/Users/";
  const CreaUsuario = async () => {
    setState({
      ...state,
      loading: true,
    });
    var sha1 = require("sha1");
    const User = {
      UserName: newUser.UserName.toUpperCase(),
      Password: sha1(newUser.Password),
      Email: newUser.Email,
    };

    await axios
      .post(urlBase, User)
      .then((response) => {
        setNewUser({ UserName: "", Password: "", Password2: "", Email: "" });
        //Obtenemos el Token
        ObtieneToken(User.UserName, User.Password);
      })
      .catch((error) => {
        setState({
          ...state,
          modal: {
            state: true,
            tittle: "¡Oh no!",
            message:
              "Ocurrió un error al crear tus usuario. Verifica no ingresar algún carácter especial e inténtalo de nuevo por favor.",
          },
          loading: false, 
        });
        console.log(error);
      });
  };

  //Obtenemos el Token
  const ObtieneToken = async (user, password) => {
    const Login = {
      UserName: user,
      Password: password,
    };
    const Url = "https://localhost:44337/api/Login/";
    await axios
      .post(Url, Login)
      .then((response) => {
        setState({ ...state, token: response.data,loading: false, });
        localStorage["TokenId"] = response.data;
        const moment = require("moment");
        localStorage["TokenDate"] = moment();
                history.goBack();
      })
      .catch((error) => {
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
        console.log("Error", error);
        history.goBack();
      });
  };

  return (
    <Container className="flex-center section my-3">
      <div className="login shadow">
        <Row className="text-center">
          <h2 className="mx-auto text-center">Crea tu usuario</h2>
        </Row>
        <Row className="text-center my-3">
          <h5 className="mx-auto text-center px-4">
            Por favor introduce tu información
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
                  name="UserName"
                  autoComplete="off"
                  value={newUser.userName}
                  placeholder="Ingresa tu nombre de usuario"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Email*</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fillRule="currentColor"
                      className="bi bi-envelope-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="inlineFormInputGroup"
                  maxLength="50"
                  onChange={(e) => handlerOnChange(e)}
                  autoComplete="off"
                  type="text"
                  name="Email"
                  value={newUser.Email}
                  placeholder="Ingresa tu eumail"
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
                  type="Password"
                  name="Password"
                  value={newUser.Password}
                  placeholder="Ingresa tu contraseña"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">
                Confirma tu Password *
              </Form.Label>
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
                  name="Password2"
                  value={newUser.Password2}
                  placeholder="Ingresa tu contraseña"
                />
              </InputGroup>
            </Col>
            <Col xs="auto text-center">
              <span className="text-center mx-auto">{message}</span>
            </Col>
            <Col xs="auto text-center">
              <Button
                variant="primary"
                type="button"
                onClick={() => CreaUsuario()}
                disabled={enableButton}
                className="my-4 shadow w-100 mx-auto "
              >
                Crear mi usuario
              </Button>
            </Col>
            <Col className="text-center my-2">
            <Link to="/">Regresar </Link>
          </Col>
          </Form>
       
        </Row>
      </div>
    </Container>
  );
}

export default NuevoUsuario;
