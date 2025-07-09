import { route } from "react-router-typesafe-routes";

export const routes = route({
  path: "",
  children: {
    signIn: route({
      path: "sign-in",
      children: { flow: route({ path: "*" }) },
    }),
    signUp: route({
      path: "sign-up",
      children: { flow: route({ path: "*" }) },
    }),
    notFound: route({ path: "*" }),
  },
});
