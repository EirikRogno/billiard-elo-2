import { useState } from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Session } from "~/lib/auth.server";

type User = { name: string, id: string }

export function RegisterMatch({ session, users }: { session: Session, users: User[] }) {

  const [selectedOpponent, setSelectedOpponent] = useState<User>()

  return <>
    <header>
      <div>
        <p>{session.user.name}</p>
      </div>
    </header>
    <main>
      <Form method="post">
        <Select name="opponentId" value={selectedOpponent?.id || ""} onValueChange={(value) => setSelectedOpponent(users.find(u => u.id === value))}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Velg motspiller" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {selectedOpponent &&
          <>
            <RadioGroup name="winnerId">
              <Label>Hvem vant?</Label>
              <div className="flex items-center gap-3">
                <RadioGroupItem value={session.user.id} id="r1" />
                <Label htmlFor="r1">{session.user.name}</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value={selectedOpponent.id} id="r2" />
                <Label htmlFor="r2">{selectedOpponent.name}</Label>
              </div>
            </RadioGroup>
            <Button type="submit">Lagre</Button>
          </>
        }
      </Form>
    </main>
  </>
}
