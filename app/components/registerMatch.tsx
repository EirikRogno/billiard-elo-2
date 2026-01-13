import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import type { Session } from "~/lib/auth.server";

type User = { name: string, id: string }

export function RegisterMatch({ session, users }: { session: Session, users: User[] }) {
  const [selectedOpponent, setSelectedOpponent] = useState<User>()
  const navigation = useNavigation();

  return <div className="p-4 flex flex-col items-center text-center">
    <h1 className="my-5 text-3xl">Registrer kamp:</h1>
    <h2 className="text-sm mb-8">Kun en spiller trenger registrere. For å registrere en kamp mot noen så må motspilleren din også ha logget inn en gang.</h2>
    <Form
      method="post"
      className="flex flex-col gap-7 items-start text-xl"
      onSubmit={(event) => {
        if (navigation.state === "submitting") {
          event.preventDefault();
        }
      }}>
      <div>
        <Label className="text-bold text-lg mb-2">Motspiller</Label>
        <Select name="opponentId" value={selectedOpponent?.id || ""} onValueChange={(value) => setSelectedOpponent(users.find(u => u.id === value))}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Velg motspiller" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {selectedOpponent &&
        <>
          <RadioGroup name="winnerId" className="flex flex-col gap-4">
            <Label className="text-bold text-lg">Hvem vant?</Label>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={session.user.id} id="r1" />
              <Label htmlFor="r1" className="text-lg">{session.user.name}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={selectedOpponent.id} id="r2" />
              <Label className="text-lg" htmlFor="r2">{selectedOpponent.name}</Label>
            </div>
          </RadioGroup>
          <Button disabled={navigation.state === "submitting"} variant="outline" type="submit">
            {navigation.state === "submitting" && <Spinner />}
            Lagre
          </Button>
        </>
      }
    </Form>
  </div>
}
