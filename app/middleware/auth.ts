import { redirect } from "react-router";
import { userContext } from "~/context";
import { auth, type Session } from "@/lib/auth.server"
import type { Route } from "../+types/root";

export const authMiddleware: Route.MiddlewareFunction = async ({
  request, context,
}) => {
  const session: Session | null = await auth.api.getSession({ headers: request.headers });
  const user = session?.user;

  if (!user) {
    throw redirect("/");
  }

  context.set(userContext, session);
};

