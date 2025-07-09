import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { routes } from "./routes";
import { AuthLayout, SignInPage, SignUpPage } from "./routes/auth";
import { MainLayout, MainPage } from "./routes/main";
import { NotFound } from "./routes/not-found";

export default function FrontendRoot() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.$path()} element={<MainPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={routes.signIn.$path()} element={<SignInPage />} />
          <Route path={routes.signIn.flow.$path()} element={<SignInPage />} />
          <Route path={routes.signUp.$path()} element={<SignUpPage />} />
          <Route path={routes.signUp.flow.$path()} element={<SignUpPage />} />
        </Route>
        <Route
          path={routes.notFound.$path()}
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
