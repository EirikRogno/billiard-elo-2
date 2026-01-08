import { Login } from "~/login/login";
import type { Route } from "./+types/loginRoute";
import { auth } from "@/lib/auth.server";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard Elo | Logg inn" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (session) {
    throw redirect("/home")
  }
}

export default function LoginRoute({ actionData, loaderData }: Route.ComponentProps) {
  return (
    <Login />
  );
}
