"use client";

import Container from '../Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import { ModeToggle } from './ModeToggle';
import { useSession } from "next-auth/react"
interface User {
    email:             String
    hashedPassword: String
}

interface NavbarProps {
    currentUser?: User;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    const { data: session } = useSession()
    console.log(currentUser);
    return(
        <div className="fixed w-full bg-white dark:bg-black z-10 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <ModeToggle />
                        <UserMenu />
                        <div>{session ? "there is user" : "pls login"}</div>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Navbar;