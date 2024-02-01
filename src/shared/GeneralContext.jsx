import { createContext, useState } from "react";

export const GeneralContext = createContext();

export const GeneralContextProvider = ({children}) =>{
    const [isLoading , setIsLoading] = useState(false);

    const contextValue = {
        isLoading,
        setIsLoading
    }

    return (
        <GeneralContext.Provider value={contextValue}>
            {children}
        </GeneralContext.Provider>
    )
}