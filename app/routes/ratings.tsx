import { redirect } from "react-router";
import type { Route } from "./+types/ratings";
import { userContext } from "~/context";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { eq, and, desc, gt, gte, max, sql } from "drizzle-orm";
import { RatingsView } from "~/components/ratingsView";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard App | Topplisten" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);
  if (!session) {
    return redirect("login");
  }
  const db = database();

  try {
    const users = await db.select({
      user: schema.user,
      matchCount: db.$count(schema.matchParticipant, eq(schema.user.id, schema.matchParticipant.userId)),
      matchWins: db.$count(schema.match, eq(schema.match.winner, schema.user.id)),
      lastMatchDate: max(schema.matchParticipant.createdAt)
    })
      .from(schema.user)
      .leftJoin(schema.matchParticipant, eq(schema.matchParticipant.userId, schema.user.id))
      .leftJoin(schema.match, eq(schema.match.id, schema.matchParticipant.matchId))
      .orderBy(desc(schema.user.eloRating))
      .groupBy(schema.user.id)
      .having(({ matchCount, lastMatchDate }) => and(gte(matchCount, 5), gt(lastMatchDate, sql`now() - '30 day'::interval`)))
      .limit(10);

    return {
      users,
    };
  } catch (error) {
    console.error("Something went wrong getting ratings", error);
    return redirect("/")
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <RatingsView users={loaderData.users} />
  );
}
