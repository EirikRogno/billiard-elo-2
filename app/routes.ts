import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/loginRoute.tsx"),
  route("home", "routes/home.tsx"),
  route("register", "routes/register.tsx"),
  route("api/auth/*", "routes/api.auth.ts")
] satisfies RouteConfig;
