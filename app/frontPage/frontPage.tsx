import { Link } from "react-router";

import { Button } from "@/components/ui/button"
import type { Session } from "~/lib/auth.server";

export function FrontPage({ session }: { session: Session }) {
  return (
    <>
      <h1 className="mb-3 text-3xl">Din Elo rating:</h1>
      <h2 className="text-4xl text-strawberry font-extrabold">{session.user.eloRating}</h2>
      <Button
        className="mt-10"
        variant="outline"
        asChild
      >
        <Link to="/register">Registrer kamp</Link>
      </Button>
    </>
  );
}
