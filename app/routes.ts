import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("register", "routes/register.tsx"),
    route("history", "routes/history.tsx"),
    route("ratings", "routes/ratings.tsx"),
    route("compare", "routes/compare.tsx"),
  ]),
  route("login", "routes/loginRoute.tsx"),
  route("api/auth/*", "routes/api.auth.ts")
] satisfies RouteConfig;
