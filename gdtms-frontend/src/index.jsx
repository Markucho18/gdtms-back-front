import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { TokenContextProvider } from "./contexts/TokenContext";
import { ModalContextProvider} from './contexts/ModalContext';
import { MainContextProvider } from "./contexts/MainContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MainContextProvider>
      <TokenContextProvider>
        <ModalContextProvider>
            <App />
        </ModalContextProvider>
      </TokenContextProvider>
  </MainContextProvider>
);
