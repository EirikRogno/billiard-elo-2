import { Outlet, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/layout";
import type { Route as RootRoute } from "../+types/root";
import { userContext } from "~/context";
import { authMiddleware } from "~/middleware/auth";
import { WebstepPositiveLogo } from "~/components/logo/WebstepPositive";
import { Header } from "~/components/header";
import { Spinner } from "~/components/ui/spinner";

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);

  return {
    session
  };
}

export const middleware: RootRoute.MiddlewareFunction[] = [authMiddleware]

export default function Layout({ loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/") }
  const navigation = useNavigation()

  return (<div className="bg-light-sky min-h-screen flex justify-between flex-col">
    <Header name={loaderData.session.user.name} avatarUrl={loaderData.session.user.image} />
    <main className="grow flex flex-col justify-center items-center">
      {navigation.state === "idle" ? <Outlet /> : <Spinner />}
    </main>
    <footer className="static bottom-0 bg-light-sky p-2"><div className="w-50"><WebstepPositiveLogo /></div></footer>
  </div>)
}
