import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

import SinContactos from "../Components/SinContactos";
import axios from "axios";
import { AppContext } from "./Provider/provider";
import { useHistory } from "react-router-dom";

import "../Css/listaContactos.css";

const iconSize = 20;

function ListaContactos() {
  const history = useHistory();
  const [backcontacts, setBackContacts] = useState();
  const [contacts, setContacts] = useState();
  const [state, setState] = useContext(AppContext);

  useEffect(() => {
    setState({ ...state, loading: true });
    const moment = require("moment");
    const TokenId = localStorage.getItem("TokenId");
    const TokenDate = localStorage.getItem("TokenDate");
    const IsNow = moment();
    const TimeToken = IsNow.diff(TokenDate, "hours");
    if (TokenId && TimeToken <= 3) {
      setState({ ...state, token: TokenId, loading: false });
    } else {
      history.push("/");
      setState({ ...state, loading: false });
    }
    getContacts();
  }, []);

  const getContacts = async () => {
    setState({ ...state, loading: true });
    let TokenId = state.token;
    const urlBase = "https://localhost:44337/api/Contacts/";
    const config = {
      headers: { Authorization: `Bearer ${TokenId}` },
    };
    await axios
      .get(urlBase, config)
      .then((response) => {
        setContacts(response.data);
        setBackContacts(response.data);
        setState({ ...state, loading: false });
      })
      .catch((error) => {
        setState({
          ...state,
          modal: {
            state: true,
            tittle: "¡Oh no!",
            message: error.response.data,
          },
          loading: false,
        });
        console.log("Error CreateContact:", error.response.data);
        console.log("Error CreateContact:", error.response);
      });
  };

  const handleCloseSesion = (e) => {
    e.preventDefault();
    console.log("CierraSesion");
    localStorage["TokenId"] = "";
    setState({ ...state, token: "" });
  };

  const handleNewUser = (e) => {
    e.preventDefault();
    console.log("History", history);
    history.push("/createContact");
  };

  const handleDeleteContact = async (e) => {
    setState({ ...state, loading: true });
    console.log(e.currentTarget.dataset.id);
    let TokenId = state.token;
    const urlBase = `https://localhost:44337/api/Contacts/${e.currentTarget.dataset.id}`;
    const config = {
      headers: { Authorization: `Bearer ${TokenId}` },
    };
    await axios
      .delete(urlBase, config)
      .then((response) => {
        setState({
          ...state,
          modal: {
            state: true,
            tittle: "¡Buen trabajo!",
            message: "Haz eliminado con éxito a tu contácto",
          },
          loading: false,
        });
        getContacts();
      })
      .catch((error) => {
        setState({
          ...state,
          modal: {
            state: true,
            tittle: "¡Oh no!",
            message: error.response.data,
          },
        });
        console.log("Error CreateContact:", error.response.data);
        console.log("Error CreateContact:", error.response);
      });
  };

  const handleEditContact = (e) => {
    debugger;
    let Contact = contacts.find(
      (element) => element.id == e.currentTarget.dataset.id
    );
    if (Contact) {
      setState({
        ...state,
        contact: {
          ...Contact,
          send: true,
        },
      });

      history.push("/createContact");
    }
  };

  const handleOnChangeSerch = (e) => {
    debugger;
    let Valor = e.target.value;
    let Busqueda="";
    if (Valor.length === 0) setContacts(backcontacts);
    else {
      switch (document.getElementById("cmb_Serch").value) {
        case "1": //Nombre
          Busqueda = backcontacts.filter(contact => contact.name.includes(Valor))
          console.log("Filtro por Nombre", Busqueda );
          setContacts(Busqueda)
          break;
          case "2": //Apellido
           Busqueda = backcontacts.filter(contact => contact.surname.includes(Valor))
          console.log("Filtro por Apellido", Busqueda );
          setContacts(Busqueda)
          break;
          case "3": //Telefono
          Busqueda = backcontacts.filter(contact => contact.phone.includes(Valor))
         console.log("Filtro por Telefono", Busqueda );
         setContacts(Busqueda)
         break;
         case "4": //Email
         Busqueda = backcontacts.filter(contact => contact.email.includes(Valor))
        console.log("Filtro por Email", Busqueda );
        setContacts(Busqueda)
        break;
        default:
          break;
      }
      ;
    }
  };

  return !contacts ? (
    <SinContactos />
  ) : (
    <Container className="listaContactos">
      <Row className="my-5">
        <h2 className="text-center mx-auto ">Mis contáctos</h2>
      </Row>
      <Row className="my-5">
        <Col xs={12} md={4} className="my-3">
          <select id="cmb_Serch" xs={12}>
            <option value="1">Buscar por nombre</option>
            <option value="2">Buscar por apellido</option>
            <option value="3">Buscar por teléfono</option>
            <option value="4">Buscar por email</option>
          </select>
        </Col>
        <Col xs={12} md={5} className="my-3">
          <input
            type="text"
            onChange={(e) => handleOnChangeSerch(e)}
            className="w-100"
            xs={12}
            placeholder="Busca por nombre, appellido, teléfono o correo"
          />
        </Col>

        <Col xs={12} md={3} className="my-3">
          <Button className="w-100" onClick={(e) => handleNewUser(e)}>
            Agregar nuevo contácto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-plus-fill mx-3"
              viewBox="0 0 16 16"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path
                fillRule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </Button>
        </Col>
      </Row>
      <Row className="table-information">
        <Table striped bordered hover className="shadow">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Teléfono</th>
              <th>Mail</th>
              <th>Direccion</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {contacts &&
              contacts.map((contacto) => (
                <tr key={contacto.id}>
                  <td>{contacto.name}</td>
                  <td>{contacto.surname}</td>
                  <td>{contacto.phone}</td>
                  <td>{contacto.email}</td>
                  <td>{contacto.address}</td>
                  <td>
                    <button
                      data-id={contacto.id}
                      onClick={(name) => handleEditContact(name)}
                      title={`¿Quieres editar a ${contacto.name}`}
                    >
                      Editar
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={iconSize}
                      height={iconSize}
                      fill="currentColor"
                      className="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                    </button>
                 
                  </td>
                  <td>
                    <button
                      data-id={contacto.id}
                      onClick={(e) => handleDeleteContact(e)}
                      title={`¿Estas seguro que quieres eliminar a ${contacto.name}?`}
                    >
                      Eliminar
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={iconSize}
                      height={iconSize}
                      name={contacto.id}
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                    </button>
                  
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Row>
      <div className="cierra-sesion">
        <Button onClick={(e) => handleCloseSesion(e)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-left mx-3"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
            />
            <path
              fillRule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
            />
          </svg>
          Cerrar sesion
        </Button>
      </div>
    </Container>
  );
}

export default ListaContactos;
