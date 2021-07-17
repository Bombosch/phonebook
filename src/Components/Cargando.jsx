import React, { useState, useContext } from "react";
import { AppContext } from "./Provider/provider";

import '../Css/cargando.css'

function Cargando() {
    const [state, setState] = useContext(AppContext);

    return (<div>{state.loading && <div className="cargando">
        <h2>Espere un momento por favor, estamos procesando la información</h2>
        <iframe src="https://embed.lottiefiles.com/animation/9043"></iframe>
    </div> }</div>)
};

export default Cargando;