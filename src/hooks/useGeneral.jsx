import { useContext } from "react"
import { GeneralContext} from "shared"


export const useGeneral = () => {
  return useContext(GeneralContext);
}
