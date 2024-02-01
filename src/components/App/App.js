
import { RouterProvider } from "react-router-dom";
import { Router } from "components";
import { AuthContextProvider, GeneralContextProvider } from "shared";
import i18next from "i18next";
import { useEffect } from "react";

export const App = () => {
  const currentLang = i18next.language;
  useEffect(() => {
    if (currentLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLang]);
  return (
    <>
    <GeneralContextProvider>
      <AuthContextProvider>
        <RouterProvider router={Router}>
        
        </RouterProvider>
      </AuthContextProvider>
    </GeneralContextProvider>
    </>
  );
}

