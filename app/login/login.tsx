import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function Login() {
  return <main className="flex flex-col justify-center items-center h-screen">
    <h1 className="mb-8">Webstep biljard Elo</h1>
    <Button
      onClick={async () => {
        await authClient.signIn.social({ provider: "google" });
      }}
      type="button"
    >
      Logg inn
    </Button>
  </main>
}
