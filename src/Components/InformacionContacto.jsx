import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import { AppContext } from "./Provider/provider";
import { useHistory, Link } from "react-router-dom";

import "../Css/informacionContacto.css";

import Agenda from "../Images/agenda.png";

const ColorValidationTrue = "bg-success";
const ColorValidationFalse = "bg-alert";
const regexValidationEmail =
  /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
const regexValidationNumber = /^([0-9])*$/;

function InformacionContacto(props) {
  const history = useHistory();
  const [state, setState] = useContext(AppContext);
  const [enableButton, setEnableButton] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState({
    id: "",
    name: "",
    nameValidation: "",
    surname: "",
    surnameValidation: "",
    phone: "",
    phoneValidation: "",
    email: "",
    emailValidation: "",
    adress: "",
  });

  useEffect(() => {
    const moment = require("moment");
    const TokenId = localStorage.getItem("TokenId");
    const TokenDate = localStorage.getItem("TokenDate");
    const IsNow = moment();
    const TimeToken = IsNow.diff(TokenDate, "hours");
    if (TokenId && TimeToken <= 3) {
      setState({ ...state, token: TokenId });
    } else history.push("/");

    setEditContact(state.contact.send);
    if (state.contact.send) {
      setContact({
        ...contact,
        id: state.contact.id,
        name: state.contact.name,
        nameValidation: true,
        surname: state.contact.surname,
        surnameValidation: true,
        phone: state.contact.phone,
        phoneValidation: true,
        email: state.contact.email,
        emailValidation: true,
        adress: state.contact.address,
      });

      setState({
        ...state,
        contact: {
          ...state.contact,
          send: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    let posicionArroba = contact.email.lastIndexOf("@");
    let posicionPunto = contact.email.lastIndexOf(".");

    if (
      contact.nameValidation &&
      contact.surnameValidation &&
      contact.phoneValidation &&
      contact.emailValidation
    )
      setEnableButton(true);
    else setEnableButton(false);

    if (contact.name.length < 3) {
      setMessage("El nombre de tu contácto no debe ser menor a 3 carácteres");
      return;
    }
    if (contact.surname.length < 3) {
      setMessage("El apellido de tu contácto no debe ser menor a 3 carácteres");
      return;
    }
    if (contact.phone.length < 10) {
      setMessage(
        "El número celular de tu contácto no debe ser menor a 10 dígitos"
      );
      return;
    }
    if (
      !(
        posicionArroba < posicionPunto &&
        posicionArroba > 0 &&
        contact.email.indexOf("@@") === -1 &&
        posicionPunto > 2 &&
        contact.email.length - posicionPunto > 2
      )
    ) {
      setMessage("Ingresa un email válido para tu contácto.");
      return;
    }
    setMessage("");
  }, [contact]);

  const handlerOnClick = async (event) => {
    event.preventDefault();

    setState({...state, loading:true});
    console.log("Click Boton");
    let TokenId = state.token;
    console.log("Token", TokenId);
    let urlBase = "https://localhost:44337/api/Contacts/";
    let Contact = {
      IdUser: "00000000-0000-0000-0000-000000000000",
      Name: contact.name,
      Surname: contact.surname,
      Phone: contact.phone,
      Email: contact.email,
      Address: contact.adress,
    };

    const config = {
      headers: { Authorization: `Bearer ${TokenId}` },
    };
    console.log("Config", config);
    console.log("Contact", Contact);
    if (editContact) {
      //Update
      Contact = {
        ...Contact,
        Id: contact.id,
      }
      console.log("Update");
      await axios
        .put(`${urlBase}${contact.id}`, Contact, config)
        .then((response) => {
          console.log("Contact", response.data);
          setState({
            ...state,
            modal: {
              state: true,
              tittle: "¡Buen trabajo!",
              message: `Haz editado a tu contacto con éxito. ¡Felicidades!`,
            },
            loading:false
          });
        })
        .catch((error) => {
          setState({
            ...state,
            modal: {
              state: true,
              tittle: "¡Oh no!",
              message: error.response.data,
            },
            loading:false
          });
          console.log("Error CreateContact:", error.response.data);
          console.log("Error CreateContact:", error.response);
        });
    } else {
      //Insert
      console.log("Insert");
      await axios
        .post(urlBase, Contact, config)
        .then((response) => {
          console.log("Contact", response.data);
          setContact({
            id: "",
            name: "",
            nameValidation: "",
            surname: "",
            surnameValidation: "",
            phone: "",
            phoneValidation: "",
            email: "",
            emailValidation: "",
            adress: "",
          });
          // Obtenemos el Token
          setState({
            ...state,
            modal: {
              state: true,
              tittle: "¡Buen trabajo!",
              message: `Haz creado tu contacto con éxito. ¡Felicidades!`,
            },
            loading:false
          });
        })
        .catch((error) => {
          setState({
            ...state,
            modal: {
              state: true,
              tittle: "¡Oh no!",
              message: error.response.data,
            },
            loading:false
          });
          console.log("Error CreateContact:", error.response.data);
          console.log("Error CreateContact:", error.response);
        });
    }
  };

  const handlerOnChange = (e) => {
    if (
      e.target.name === "phone" &&
      !regexValidationNumber.test(e.target.value)
    )
      return;

    let itemValidation = e.target.name + "Validation";
    let valueValidation = validation(e.target.name, e.target.value);

    setContact({
      ...contact,
      [e.target.name]: e.target.value,
      [itemValidation]: valueValidation,
    });
  };

  const validation = (name, value) => {
    if (name === "name" || name === "surname") {
      if (value.length < 3) return false;
      else return true;
    }
    if (name === "phone") {
      if (value.length < 10) return false;
      else return true;
    }
    if (name === "email") {
      return regexValidationEmail.test(value);
    }
  };

  return (
    <Container className="flex-center section my-3">
     <div className="information-contact flex-center my-3 mx-auto">
     <Row className="mb-5 titulo">
        <h2 className="text-center mx-auto">
          {editContact ? "Edita a tu usuario" : "Alta de nuevo contácto"}
        </h2>
      </Row>
      <Row className="information-contact-container shadow-lg p-3">
        <Col xs={12} md={6} className="information-contact-container-image">
          <Row className="text-center flex-center information-contact-imagediv">
            <img
              src={Agenda}
              alt="Agenda telefónica Jaime Bosch Dev"
              title="Agenda telefónica Jaime Bosch Dev"
            />
          </Row>
        </Col>
        <Col xs={12} md={6} className="information-contact-container-data">
          <Form autoComplete="off">
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Nombre *</Form.Label>
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
                  name="name"
                  autoComplete="off"
                  onChange={(e) => handlerOnChange(e)}
                  value={contact.name}
                  className={
                    contact.nameValidation
                      ? ColorValidationTrue
                      : contact.nameValidation === false
                      ? ColorValidationFalse
                      : ""
                  }
                  placeholder="Ingresa el nombre de tu contácto"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">
                Apellidos *
              </Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-badge-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.245z" />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="inlineFormInputGroup"
                  maxLength="50"
                  autoComplete="off"
                  name="surname"
                  onChange={(e) => handlerOnChange(e)}
                  value={contact.surname}
                  className={
                    contact.surnameValidation
                      ? ColorValidationTrue
                      : contact.surnameValidation === false
                      ? ColorValidationFalse
                      : ""
                  }
                  placeholder="Ingresa los apellidos de tu contácto"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Teléfono *</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-telephone-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                      />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  maxLength="15"
                  name="phone"
                  autoComplete="off"
                  value={contact.phone}
                  className={
                    contact.phoneValidation
                      ? ColorValidationTrue
                      : contact.phoneValidation === false
                      ? ColorValidationFalse
                      : ""
                  }
                  id="inlineFormInputGroup"
                  onChange={(e) => handlerOnChange(e)}
                  placeholder="Ingresa el teléfono de tu contácto"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Email *</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
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
                  name="email"
                  autoComplete="off"
                  onChange={(e) => handlerOnChange(e)}
                  value={contact.email}
                  className={
                    contact.emailValidation
                      ? ColorValidationTrue
                      : contact.emailValidation === false
                      ? ColorValidationFalse
                      : ""
                  }
                  placeholder="Ingresa el email de tu contácto"
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup">Dirección</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-geo-alt-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  maxLength="120"
                  as="textarea"
                  rows={2}
                  id="inlineFormInputGroup"
                  name="adress"
                  autoComplete="off"
                  onChange={(e) => handlerOnChange(e)}
                  value={contact.adress}
                  className={
                    contact.adressValidation
                      ? ColorValidationTrue
                      : contact.nameValidation === false
                      ? ColorValidationFalse
                      : ""
                  }
                  placeholder="Ingresa la dirección de tu contácto"
                />
              </InputGroup>
            </Col>
            <Col class="text-center">
              <span class="text-center mx-auto">{message}</span>
            </Col>
            <Col xs="auto text-center">
              <Button
                onClick={(e) => handlerOnClick(e)}
                variant="primary"
                disabled={!enableButton}
                type="button"
                className="my-4 shadow w-100 mx-auto "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-check-fill mx-3"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
                Guardar
              </Button>
            </Col>
          </Form>
        </Col>
      </Row>
      <div className="migaja">
        <Link to="/">Mis contáctos</Link> /{" "}
        {editContact ? "Editar Usuario" : "Nuevo Usuario"}
      </div>
     </div>
    </Container>
  );
}

export default InformacionContacto;
