import { createContext } from "react";

const DropzoneContext = createContext()

const DropzoneProvider = ()=> {
    return (
        <DropzoneContext.Provider ></DropzoneContext.Provider>
    )
}

export default DropzoneProvider
export {DropzoneContext}