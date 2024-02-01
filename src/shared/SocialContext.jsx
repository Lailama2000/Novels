import { createContext, useState } from "react";


export const SocailContext = createContext();

export const SocailContextProvider = ({children}) =>{
    const [general , setGeneral] = useState([]);
    const contextValue = {
        general,
        setGeneral
    }
    return (
        <SocailContext.Provider value={contextValue}>
            {children}
        </SocailContext.Provider>
    );
}