import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { WebstepPositiveLogo } from "~/components/logo/WebstepPositive";
import { WebstepBilliardLogo } from "./logo/WebstepBilliardLogo";

export function Login() {
  return (<div className="min-h-screen flex justify-between flex-col">
    <main className="grow flex flex-col justify-center items-center bg-light-sky">
      <div className="mb-8 mx-2 flex items-center">
        <WebstepBilliardLogo className="my-5 size-20 motion-safe:animate-[spin_3.7s_linear_infinite]" />
        <h1 className="text-4xl text-center">Webstep Biljard App</h1>
        <WebstepBilliardLogo className="my-5 size-20 rotate-160 motion-safe:animate-[spin_4.8s_linear_infinite]" />
      </div>
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
  </div >)
}
