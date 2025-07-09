import React from "react";
import { BrowserRouter } from "react-router";

import { Providers } from "@/providers";
import { App } from "./App";

export default function FrontendRoot() {
  return (
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  );
}
