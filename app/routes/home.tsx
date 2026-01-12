import type { Route } from "./+types/home";
import { FrontPage } from "~/components/frontPage";
import { userContext } from "~/context";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard App | Hjem" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);

  return {
    session
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/login") }
  return (
    <FrontPage session={loaderData.session} />
  );
}
