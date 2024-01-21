import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import CarParkData from "./CarParkData";


const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
      <CarParkData/>
    </ChakraProvider>
  </React.StrictMode>
);
