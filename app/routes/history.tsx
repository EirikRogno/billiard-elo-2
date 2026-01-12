import { redirect } from "react-router";
import type { Route } from "./+types/history";
import { userContext } from "~/context";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { eq, and, not, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { HistoryView } from "~/components/historyView";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard App | Historikk" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);
  if (!session) {
    return redirect("login");
  }
  const db = database();

  try {
    const opponentParticpant = alias(schema.matchParticipant, "opponentParticipant")
    const opponent = alias(schema.user, "opponent")
    const matches = await db.select({
      matchId: schema.match.id,
      matchCreatedAt: schema.match.createdAt,
      winnerId: schema.match.winner,
      eloDelta: schema.match.resultEloDelta,
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentAvatar: opponent.image,
    })
      .from(schema.match)
      .innerJoin(schema.matchParticipant, eq(schema.match.id, schema.matchParticipant.matchId))
      .where(eq(schema.matchParticipant.userId, session.user.id))
      .innerJoin(opponentParticpant, and(eq(schema.match.id, opponentParticpant.matchId), not(eq(opponentParticpant.userId, session.user.id))))
      .innerJoin(opponent, eq(opponent.id, opponentParticpant.userId))
      .orderBy(desc(schema.match.createdAt))
      .limit(50);

    return {
      session,
      matches
    };
  } catch (error) {
    console.error("Something went wrong getting matches", error);
    return redirect("/")
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <HistoryView session={loaderData.session} matches={loaderData.matches} />
  );
}
