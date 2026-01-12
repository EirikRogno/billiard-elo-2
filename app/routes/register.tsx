import { userContext } from "~/context";
import type { Route } from "./+types/register";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { RegisterMatch } from "~/components/registerMatch";
import { redirect } from "react-router";
import { not, eq } from "drizzle-orm"
import { calculateEloDelta } from "~/lib/eloService";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard App | Registrer kamp" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const session = context.get(userContext);
  const formData = await request.formData();
  const userId = session?.user.id
  let opponentId = formData.get("opponentId");
  let winnerId = formData.get("winnerId");
  if (typeof winnerId !== "string" || typeof opponentId !== "string") {
    return { submitError: "Winner and opponent are required" };
  }

  opponentId = opponentId.trim();
  winnerId = winnerId.trim();
  if (!opponentId || !winnerId || !userId) {
    return { submitError: "Winner and opponent are required" };
  }

  const db = database();
  try {
    const opponent = (await db.select().from(schema.user).where(eq(schema.user.id, opponentId)))[0]
    const userElo = session?.user.eloRating || 1000;
    const eloDelta = calculateEloDelta(userElo, opponent.eloRating, winnerId === userId ? 1 : 0)

    const matchInsert = await db.insert(schema.match).values({ winner: winnerId, resultEloDelta: Math.abs(eloDelta) }).returning({ id: schema.match.id });
    const matchId = matchInsert[0].id
    await db.insert(schema.matchParticipant).values({ matchId, userId: opponentId });
    await db.insert(schema.matchParticipant).values({ matchId, userId });

    const newEloPlayer = userElo + eloDelta;
    const newEloOpponent = opponent.eloRating - eloDelta;

    await db.update(schema.user).set({ eloRating: newEloPlayer }).where(eq(schema.user.id, userId));
    await db.update(schema.user).set({ eloRating: newEloOpponent }).where(eq(schema.user.id, opponentId));

    console.log("eloDelta:", eloDelta)
    console.log("New elo:", opponent.name, newEloOpponent);
    console.log("New elo:", session?.user.name, newEloPlayer);

    return redirect("/")
  } catch (error) {
    console.error(error);
    return { submitError: "Error updating database" };
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

export default function Register({ loaderData }: Route.ComponentProps) {
  if (!loaderData.session) { throw redirect("/login") }
  return (
    <RegisterMatch session={loaderData.session} users={loaderData.users} />
  );
}
