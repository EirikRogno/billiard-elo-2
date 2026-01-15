import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator";
import { ExternalLinkIcon, MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";
import { useState } from "react";

export function Header({ avatarUrl, name }: { avatarUrl?: string | null, name: string }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="">
      <div className="p-2 flex justify-between items-center">
        <Link to="/">
          <div className="flex gap-2 items-center">
            {avatarUrl &&
              <Avatar>
                <AvatarImage src={avatarUrl} alt="User profile picture" />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            }
            <p>{name}</p>
          </div>
        </Link>
        <Drawer direction="top" open={menuOpen} onOpenChange={setMenuOpen}>
          <DrawerTrigger className="p-2 fill-black">
            <MenuIcon />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="hidden">Meny</DrawerTitle>
            <ButtonGroup orientation="vertical" className="flex flex-col items-center w-full">
              <Button
                variant="link"
                asChild
                onClick={() => setMenuOpen(false)}
                className="my-4"
              >
                <Link to="/">Din rating</Link>
              </Button>
              <ButtonGroupSeparator orientation="horizontal" />
              <Button
                variant="link"
                asChild
                onClick={() => setMenuOpen(false)}
                className="my-4"
              >
                <Link to="/register">Registrer kamp</Link>
              </Button>
              <ButtonGroupSeparator orientation="horizontal" />
              <Button
                className="my-4"
                variant="link"
                asChild
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/history">Din kamphistorikk</Link>
              </Button>
              <ButtonGroupSeparator orientation="horizontal" />
              <Button
                className="my-4"
                variant="link"
                asChild
                onClick={() => setMenuOpen(false)}
              >
                <Link to="https://no.wikipedia.org/wiki/Elo-rating" target="_blank">Hva er Elo rating? <ExternalLinkIcon /></Link>
              </Button>
              <ButtonGroupSeparator orientation="horizontal" />
              <Button
                className="my-4"
                variant="link"
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => { navigate("/") }
                    }
                  })
                  setMenuOpen(false);
                }}
              >Logg ut</Button>
            </ButtonGroup>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator />
    </header>
  )
}
