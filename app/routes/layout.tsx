import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import type { Route as RootRoute } from "../+types/root";
import { userContext } from "~/context";
import { authMiddleware } from "~/middleware/auth";

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);

  return {
    session
  };
}

export const middleware: RootRoute.MiddlewareFunction[] = [authMiddleware]

export default function Layout({ loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/") }

  return (<>
    <header>
      <div>
        <p>{loaderData.session?.user.name}</p>
      </div>
    </header>
    <main className="h-full">
      <Outlet />
    </main>
  </>)
}
