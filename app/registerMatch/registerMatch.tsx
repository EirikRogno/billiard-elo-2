import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Session } from "~/lib/auth.server";


export function RegisterMatch({ session, users }: { session: Session, users: { name: string, id: string }[] }) {

  return <>
    <header>
      <div>
        <p>{session.user.name}</p>
      </div>
    </header>
    <main>
      <Select>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Velg motspiller" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => <SelectItem value={user.id}>{user.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </main>
  </>
}
