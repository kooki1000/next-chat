import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { routes } from "./routes";
import { MainLayout, MainPage } from "./routes/main";
import { NotFound } from "./routes/not-found";

export default function FrontendRoot() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.$path()} element={<MainPage />} />
        </Route>
        <Route
          path={routes.notFound.$path()}
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
