"use client";

import Container from '../Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import { ModeToggle } from './ModeToggle';

export default function Navbar() {
    return(
        <div className="fixed w-full bg-white dark:bg-black z-10 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <ModeToggle />
                        <UserMenu />
                    </div>
                </Container>
            </div>
        </div>
    )
}
