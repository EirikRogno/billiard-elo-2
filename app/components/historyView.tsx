import type { Session } from "~/lib/auth.server";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "./ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Match = {
  matchId: string;
  matchCreatedAt: Date;
  winnerId: string | null;
  eloDelta: number | null;
  opponentId: string;
  opponentName: string;
  opponentAvatar: string | null;
}

export function HistoryView({ session, matches }: { session: Session, matches: Match[] }) {
  return <>
    <h1 className="my-5 text-3xl">Kamphistorikk:</h1>
    <ItemGroup className="mb-5 gap-2 w-full px-4 items-center">
      {matches.map(({ winnerId, matchCreatedAt, matchId, opponentAvatar, opponentName, eloDelta }) => {
        const bg = winnerId === session.user.id ? "bg-lime-400" : "bg-red-400";
        const timeString = new Intl.DateTimeFormat("no", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(matchCreatedAt);

        return <Item className={`${bg} max-w-2xl w-full`} key={matchId}>
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage src={opponentAvatar || undefined} />
              <AvatarFallback>{opponentName.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {opponentName}
            </ItemTitle>
            <ItemDescription className="text-black">
              {timeString}
            </ItemDescription>
          </ItemContent>
          {eloDelta &&
            <ItemContent>
              <ItemTitle>
                {winnerId === session.user.id ? "+" : "-"}{eloDelta}
              </ItemTitle>
            </ItemContent>
          }
        </Item>
      }
      )}
    </ItemGroup >
  </>
}
