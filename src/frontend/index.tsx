import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { routes } from "./routes";
import { Main } from "./routes/main";
import { NotFound } from "./routes/not-found";

export default function FrontendRoot() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.$path()} element={<Main />} />
        <Route
          path={routes.notFound.$path()}
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
