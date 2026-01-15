import { cn } from "@/lib/utils"
import { WebstepBilliardLogo } from "../logo/WebstepBilliardLogo"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <WebstepBilliardLogo
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
