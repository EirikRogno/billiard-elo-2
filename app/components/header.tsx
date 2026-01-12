import { useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator";

export function Header({ avatarUrl, name }: { avatarUrl?: string | null, name: string }) {
  const navigate = useNavigate();
  return (
    <header className="">
      <div className="p-2 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {avatarUrl &&
            <Avatar>
              <AvatarImage src={avatarUrl} alt="User profile picture" />
            </Avatar>
          }
          <p>{name}</p>
        </div>
        <div>
          <Button
            variant="link"
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => { navigate("/") }
                }
              })
            }}
          >Logg ut</Button>
        </div>
      </div>
      <Separator />
    </header>
  )
}
