import React from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "./shadcn/ui/navigation-menu";
import { Link } from "@radix-ui/react-navigation-menu";
import { useLocation } from "react-router-dom";
import './NavigationBar.css';


export const NavigationBar = (): React.ReactElement => {
    const location: string = useLocation().pathname;

    return (
        <div className="bg-neutral-800 flex">
            <h1 id="navbar-logo" className="text-lg font-bold text-white py-3 px-6">
                Pokemon Type Calculator
            </h1>
            <div className="inline-block float-right flex-1 flex-end justify-end text-right">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/defense">
                                <NavigationMenuLink active={location === "/defense"}
                                                    className={navigationMenuTriggerStyle()}>
                                    Defense
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/offense">
                                <NavigationMenuLink active={location == "/offense"}
                                                    className={navigationMenuTriggerStyle()}>
                                    Offense
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/about">
                                <NavigationMenuLink active={location == "/about"}
                                                    className={navigationMenuTriggerStyle()}>
                                    About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
};