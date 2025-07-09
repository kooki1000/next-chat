import React from "react";
import { BrowserRouter } from "react-router";

import { App } from "./App";

export default function FrontendRoot() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
