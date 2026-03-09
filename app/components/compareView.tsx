import { useNavigate } from "react-router";
import type { Session } from "~/lib/auth.server";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserOption = { id: string; name: string };

type Stats = {
  user: {
    id: string;
    name: string;
    image: string | null;
    eloRating: number;
  };
  matchCount: number;
  matchWins: number;
};

type HeadToHead = {
  total: number;
  currentUserWins: number;
  opponentWins: number;
};

type Comparison = {
  currentUser: Stats | null;
  opponent: Stats | null;
  headToHead: HeadToHead;
};

function winRate(wins: number, total: number) {
  if (total === 0) return "–";
  return `${Math.round((wins / total) * 100)} %`;
}

function StatRow({
  label,
  leftValue,
  rightValue,
}: {
  label: string;
  leftValue: string | number;
  rightValue: string | number;
}) {
  return (
    <div className="grid grid-cols-3 items-center py-3 border-b last:border-0">
      <span
        className={`text-center text-lg`}
      >
        {leftValue}
      </span>
      <span className="text-center text-sm text-strawberry">{label}</span>
      <span
        className={`text-center text-lg`}
      >
        {rightValue}
      </span>
    </div>
  );
}

function PlayerHeader({ stats }: { stats: Stats }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="size-12">
        <AvatarImage src={stats.user.image || undefined} />
        <AvatarFallback>{stats.user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-center">{stats.user.name}</span>
    </div>
  );
}

export function CompareView({
  allUsers,
  comparison,
}: {
  allUsers: UserOption[];
  comparison: Comparison | null;
  session: Session;
}) {
  const navigate = useNavigate();
  const selectedOpponentId = comparison?.opponent?.user.id ?? null;
  const selectedItem = selectedOpponentId
    ? {
      value: selectedOpponentId,
      label:
        allUsers.find((u) => u.id === selectedOpponentId)?.name ??
        selectedOpponentId,
    }
    : { value: "", label: "" };

  return (
    <div className="flex flex-col items-center w-full max-w-lg px-4 py-6 gap-6">
      <h1 className="text-3xl">Sammenlign</h1>

      <div className="">
        <Combobox
          name="opponent"
          value={selectedItem}
          onValueChange={(item) => {
            if (item?.value) navigate(`/compare?opponent=${item.value}`);
          }}
          items={allUsers.map((u) => ({ value: u.id, label: u.name }))}
        >
          <ComboboxInput placeholder="Velg motspiller" />
          <ComboboxContent>
            <ComboboxEmpty>Ingen spillere funnet</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {comparison && comparison.currentUser && comparison.opponent && (
        <div className="w-full p-4">
          <div className="grid grid-cols-3 items-center mb-4">
            <PlayerHeader stats={comparison.currentUser} />
            <span className="text-center text-lg">vs</span>
            <PlayerHeader stats={comparison.opponent} />
          </div>

          <StatRow
            label="Elo rating"
            leftValue={comparison.currentUser.user.eloRating}
            rightValue={comparison.opponent.user.eloRating}
          />
          <StatRow
            label="Kamper"
            leftValue={comparison.currentUser.matchCount}
            rightValue={comparison.opponent.matchCount}
          />
          <StatRow
            label="Winrate"
            leftValue={winRate(
              comparison.currentUser.matchWins,
              comparison.currentUser.matchCount
            )}
            rightValue={winRate(
              comparison.opponent.matchWins,
              comparison.opponent.matchCount
            )}
          />
          <StatRow
            label="Head-to-head seiere"
            leftValue={comparison.headToHead.currentUserWins}
            rightValue={comparison.headToHead.opponentWins}
          />
        </div>
      )}

      {!comparison && (
        <p className="text-sm text-center mx-2 mb-8">
          Velg en motspiller for å sammenligne statistikk.
        </p>
      )}
    </div>
  );
}
