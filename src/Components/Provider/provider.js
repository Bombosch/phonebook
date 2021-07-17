import React,  {createContext, useState} from 'react';

const MyProvider = (props) =>{
    const [state, setState] = useState({
        modal:{
            tittle:"Soy el titulo",
            message:"Soy el mensaje",
            state:false
        },
        contact:{
            send:false,
        },
        token:"",
        loading:false
    });

    return(
        <div>
            <AppContext.Provider value={[state, setState]}>
                {props.children}
            </AppContext.Provider>
        </div>
    )
}

export default MyProvider;
export const AppContext = createContext();