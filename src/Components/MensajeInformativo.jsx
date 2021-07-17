import React, { useContext } from "react";
import { AppContext } from "./Provider/provider";

import "../Css/mensajeInformativo.css";

function MensajeInformativo() {
  const [state, setState] = useContext(AppContext);

  const handleOnClick =(e) =>{
console.log("Quitando Modal")
    state.modal.state=false;

    setState({
        ...state,
    })
  }

  return (
    <div>
      {state.modal.state && (
        <div className="modal flex-center section w-100">
          <div className="modal-information shadow">
            <h2 className="my-5">{state.modal.tittle}</h2>
            <h4 className="my-3"> {state.modal.message} </h4>
            <button onClick={() => handleOnClick()} className="shadow">Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MensajeInformativo;
