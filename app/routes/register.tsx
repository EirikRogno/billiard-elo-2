import { userContext } from "~/context";
import type { Route } from "./+types/register";
import type { Route as RootRoute } from "../+types/root";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { authMiddleware } from "~/middleware/auth";
import { RegisterMatch } from "~/registerMatch/registerMatch";
import { redirect } from "react-router";
import { not, eq } from "drizzle-orm"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard ELO | Registrer kamp" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  if (typeof name !== "string" || typeof email !== "string") {
    return { guestBookError: "Name and email are required" };
  }

  name = name.trim();
  email = email.trim();
  if (!name || !email) {
    return { guestBookError: "Name and email are required" };
  }

  const db = database();
  try {
    await db.insert(schema.guestBook).values({ name, email });
  } catch (error) {
    return { guestBookError: "Error adding to guest book" };
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);

  const db = database()
  const users = await db.select({ name: schema.user.name, id: schema.user.id })
    .from(schema.user)
    .where(not(eq(schema.user.id, session?.user.id || "")))

  return {
    session,
    users
  };
}

export const middleware: RootRoute.MiddlewareFunction[] = [authMiddleware]

export default function Register({ actionData, loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/") }
  return (
    <RegisterMatch session={loaderData.session} users={loaderData.users} />
  );
}
