import { redirect } from "react-router";
import type { Route } from "./+types/compare";
import { userContext } from "~/context";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { eq, ne, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CompareView } from "~/components/compareView";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Biljard App | Sammenlign" }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.get(userContext);
  if (!session) return redirect("/login");
  const db = database();

  const url = new URL(request.url);
  const opponentId = url.searchParams.get("opponent");

  try {
    const allUsers = await db
      .select({ id: schema.user.id, name: schema.user.name })
      .from(schema.user)
      .where(ne(schema.user.id, session.user.id));

    if (!opponentId) {
      return { allUsers, comparison: null, session };
    }

    const fetchStats = (userId: string) =>
      db
        .select({
          user: schema.user,
          matchCount: db.$count(
            schema.matchParticipant,
            eq(schema.user.id, schema.matchParticipant.userId)
          ),
          matchWins: db.$count(
            schema.match,
            eq(schema.match.winner, schema.user.id)
          ),
        })
        .from(schema.user)
        .leftJoin(
          schema.matchParticipant,
          eq(schema.matchParticipant.userId, schema.user.id)
        )
        .leftJoin(
          schema.match,
          eq(schema.match.id, schema.matchParticipant.matchId)
        )
        .where(eq(schema.user.id, userId))
        .groupBy(schema.user.id);

    const p1 = alias(schema.matchParticipant, "p1");
    const p2 = alias(schema.matchParticipant, "p2");

    const [currentUserStats, opponentStats, headToHeadMatches] =
      await Promise.all([
        fetchStats(session.user.id),
        fetchStats(opponentId),
        db
          .select({ matchId: schema.match.id, winner: schema.match.winner })
          .from(schema.match)
          .innerJoin(
            p1,
            and(
              eq(schema.match.id, p1.matchId),
              eq(p1.userId, session.user.id)
            )
          )
          .innerJoin(
            p2,
            and(eq(schema.match.id, p2.matchId), eq(p2.userId, opponentId))
          ),
      ]);

    return {
      allUsers,
      comparison: {
        currentUser: currentUserStats[0] ?? null,
        opponent: opponentStats[0] ?? null,
        headToHead: {
          total: headToHeadMatches.length,
          currentUserWins: headToHeadMatches.filter(
            (m) => m.winner === session.user.id
          ).length,
          opponentWins: headToHeadMatches.filter((m) => m.winner === opponentId)
            .length,
        },
      },
      session,
    };
  } catch (error) {
    console.error("Something went wrong getting compare stats", error);
    return redirect("/");
  }
}

export default function Compare({ loaderData }: Route.ComponentProps) {
  return (
    <CompareView
      allUsers={loaderData.allUsers}
      comparison={loaderData.comparison}
      session={loaderData.session}
    />
  );
}
