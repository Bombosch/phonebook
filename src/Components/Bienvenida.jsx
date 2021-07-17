import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import '../Css/bienvenida.css'

const sizeIcon = 24;

function Bienvenida() {

    return (<Container className="inicio flex-center section">
        <Row className="my-5 ">
            <h2 className="text-center mx-auto">Bienvenido a tu agenda telefónica</h2>
        </Row>
        <Row>
            <Col>
                <Button className="shadow-lg">
                    Ver mis contáctos
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    width={sizeIcon} 
                    height={sizeIcon} 
                    fill="currentColor" 
                    className="bi bi-person-lines-fill mx-4" 
                    viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                    </svg>
                </Button>
            </Col>
            <Col>
                <Button className="shadow-lg">
                    Agregar nuevo contácto
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    width={sizeIcon} 
                    height={sizeIcon} 
                    fill="currentColor" 
                    className="bi bi-person-plus-fill mx-4" 
                    viewBox="0 0 16 16">
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </Button>
            </Col>
        </Row>
    </Container>
    );
}


export default Bienvenida;
