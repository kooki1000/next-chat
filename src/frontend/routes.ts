import { route, string } from "react-router-typesafe-routes";

export const routes = route({
  path: "",
  children: {
    chat: route({
      path: "chat/:threadId",
      params: { threadId: string() },
    }),
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
