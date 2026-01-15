import type { Route } from "./+types/home";
import { FrontPage } from "~/components/frontPage";
import { userContext } from "~/context";
import { redirect } from "react-router";
import { database } from "~/database/context";
import * as schema from "database/schema"
import { eq, desc } from "drizzle-orm";

export type Match = {
  matchId: string;
  matchCreatedAt: Date;
  winnerId: string | null;
  eloDelta: number | null;
  players: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Biljard App | Hjem" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(userContext);
  if (!session) {
    return redirect("login");
  }
  const db = database();

  try {
    const rows = await db.select()
      .from(schema.match)
      .innerJoin(schema.matchParticipant, eq(schema.match.id, schema.matchParticipant.matchId))
      .innerJoin(schema.user, eq(schema.matchParticipant.userId, schema.user.id))
      .orderBy(desc(schema.match.createdAt))
      .limit(20);

    const matches = Object.values(rows.reduce<Record<string, Match>>(
      (acc, row) => {
        const user = row.user;
        const match = row.match;

        if (!acc[match.id]) {
          acc[match.id] = {
            matchId: match.id,
            matchCreatedAt: match.createdAt,
            winnerId: match.winner,
            eloDelta: match.resultEloDelta,
            players: []
          };
        }

        if (user) {
          acc[match.id].players.push({
            id: user.id,
            name: user.name,
            avatar: user.image
          });
        }

        return acc;
      },
      {}
    ));

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
  if (!loaderData.session) { throw redirect("/login") }
  return (
    <FrontPage session={loaderData.session} matches={loaderData.matches} />
  );
}
