import React, {useContext, useEffect} from "react";
import ListaContactos from "./ListaContactos";
import Login from "./Login";
import { AppContext } from "./Provider/provider";



function Home(){
    const moment = require('moment');
    const [state, setState] = useContext(AppContext);

    useEffect(()=>{
        const TokenId = localStorage.getItem('TokenId');
        const TokenDate = localStorage.getItem('TokenDate');
        const IsNow = moment();
        const TimeToken =IsNow.diff(TokenDate, 'hours'); 
        if(TokenId && TimeToken<=3){
            setState({...state, token: TokenId})
        }
    },[])

    return(
        state.token ? <ListaContactos/> : <Login/> 
    )

}

export default Home;
