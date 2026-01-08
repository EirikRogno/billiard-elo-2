import { Link, useNavigate } from "react-router";

import { authClient } from "~/lib/auth-client"
import { Button } from "@/components/ui/button"
import type { Session } from "~/lib/auth.server";

export function FrontPage({ session }: { session: Session }) {
  const navigate = useNavigate();

  return (<>
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <h1>Din Elo rating: {session.user.eloRating}</h1>
      <div className="flex flex-row gap-5">
        <Button
          asChild
        >
          <Link to="/register">Registrer kamp</Link>
        </Button>
        <Button
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => { navigate("/") }
              }
            })
          }}
        >
          Logg ut
        </Button>
      </div>
    </div>
  </>);
}
