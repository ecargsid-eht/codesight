import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react"
import toast from "react-hot-toast";

const HomePage = () => {
  return (
    <div>
        <button className="btn btn-primary" onClick={() => toast.success("Success toast")}>Click me</button>
        <SignedOut>
            <SignInButton mode="modal">
                <button className="btn btn-primary">Login</button>
            </SignInButton>
        </SignedOut>
        <SignedIn>
            <SignOutButton>
                <button className="btn btn-active">Logout</button>
            </SignOutButton>
        </SignedIn>
        <UserButton />
    </div>
  )
}

export default HomePage