import { Link } from "react-router";

import { Button } from "@/components/ui/button"
import type { Session } from "~/lib/auth.server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Match } from "~/routes/home";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

function MatchParticipant({ name, avatar, winner, className }: { name: string, avatar: string | null, winner: boolean, className?: string }) {
  const textColor = winner ? "text-green-500" : "text-red-500";
  return <div className={`flex flex-col gap-2 items-center ${className || ""}`}>
    <Avatar className="size-15">
      <AvatarImage src={avatar || undefined} />
      <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <p className={`max-w-20 text-center text-sm text-lime ${textColor} font-bold`}>{name}</p>
  </div>
}

export function FrontPage({ session, matches }: { session: Session, matches: Match[] }) {
  return (
    <>
      <h1 className="mt-9 mb-3 text-3xl">Din Elo rating:</h1>
      <h2 className="text-4xl text-strawberry font-extrabold">{session.user.eloRating}</h2>
      <Button
        className="my-10"
        variant="outline"
        asChild
      >
        <Link to="/register">Registrer kamp</Link>
      </Button>
      <h2 className="text-xl mb-2">Nylige kamper:</h2>
      <div className="w-full max-w-lg p-4 flex flex-col gap-2">
        {matches.map(({ winnerId, matchCreatedAt, matchId, eloDelta, players: [player1, player2] }) => {
          const timeString = new Intl.DateTimeFormat("no", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(matchCreatedAt);
          const eloString = (id: string) => id === winnerId ? `+${eloDelta}` : `-${eloDelta}`;
          return <Card className="bg-white md:px-4" key={matchId}>
            <CardHeader>
              <CardTitle className="text-center">{timeString}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-[1fr_32px_2px_32px_1fr]">
              <MatchParticipant {...player1} winner={winnerId === player1.id} className="justify-self-start md:justify-self-center" />
              <p className="text-lg self-center justify-self-start">{eloString(player1.id)}</p>
              <Separator orientation="vertical" />
              <p className="text-lg self-center justify-self-end">{eloString(player2.id)}</p>
              <MatchParticipant {...player2} winner={winnerId === player2.id} className="justify-self-end md:justify-self-center" />
            </CardContent>
          </Card>
        })}
      </div>
    </>
  );
}
