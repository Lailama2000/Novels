import { useContext } from "react"
import { AuthContext } from "shared"

export const useAuth = () => {
  return useContext(AuthContext);
};
