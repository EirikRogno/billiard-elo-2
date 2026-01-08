import type { Route } from "./+types/home";
import type { Route as RootRoute } from "../+types/root";
import { authMiddleware } from "~/middleware/auth";
import { FrontPage } from "~/frontPage/frontPage";
import { userContext } from "~/context";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard ELO | Hjem" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);

  return {
    session
  };
}

export const middleware: RootRoute.MiddlewareFunction[] = [authMiddleware]

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/") }
  return (
    <FrontPage session={loaderData.session} />
  );
}
