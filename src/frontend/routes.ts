import { route } from "react-router-typesafe-routes";

export const routes = route({
  path: "",
  children: {
    notFound: route({
      path: "*",
    }),
  },
});
