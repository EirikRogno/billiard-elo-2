import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { WebstepPositiveLogo } from "~/components/logo/WebstepPositive";

export function Login() {
  return (<div className="min-h-screen flex justify-between flex-col">
    <main className="grow flex flex-col justify-center items-center bg-light-sky">
      <h1 className="mb-12 text-4xl">Webstep Biljard App</h1>
      <Button
        variant="outline"
        onClick={async () => {
          await authClient.signIn.social({ provider: "google" });
        }}
        type="button"
      >
        Logg inn
      </Button>
    </main>
    <footer className="static bottom-0 bg-light-sky p-2"><div className="w-50"><WebstepPositiveLogo /></div></footer>
  </div>)
}
