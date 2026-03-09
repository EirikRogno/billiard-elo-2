import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { user } from "database/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type User = {
  user: typeof user.$inferSelect,
  matchCount: number;
  matchWins: number;
  lastMatchDate: Date | null;
}

export function RatingsView({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const navigate = useNavigate();
  return <>
    <h1 className="my-5 text-3xl">Topplisten:</h1>
    <h2 className="text-sm text-center mx-2 mb-8">For å havne på topplisten må du ha spillt minst 5 kamper, og ha spillt en kamp i løpet av de siste 30 dagene.</h2>
    <Table className="max-w-4xl">
      <TableHeader>
        <TableRow className="font-extrabold">
          <TableHead>Spiller</TableHead>
          <TableHead>Kamper</TableHead>
          <TableHead>Winrate</TableHead>
          <TableHead>Elo rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(({ user, matchCount, matchWins }) => {
          const isCurrentUser = user.id === currentUserId;
          return <TableRow
            key={user.id}
            className={!isCurrentUser ? "cursor-pointer hover:bg-muted/50" : ""}
            onClick={!isCurrentUser ? () => navigate(`/compare?opponent=${user.id}`) : undefined}
          >
            <TableCell className="flex flex-row items-center gap-4">
              <Avatar className="size-8">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {user.name}
            </TableCell>
            <TableCell>{matchCount}</TableCell>
            <TableCell>{Math.round(matchWins / matchCount * 100)} %</TableCell>
            <TableCell>{user.eloRating}</TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  </>
}
