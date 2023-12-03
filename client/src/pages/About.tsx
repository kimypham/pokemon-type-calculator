import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/shadcn/ui";

export const About = () => {
    return (
        <div className="px-6 py-3">
            <h1 className="text-2xl font-semibold pb-2">About</h1>
            <p>This is a calculator that shows the strengths and weaknesses of Pokémon types.</p>
            <br/>
            <p>
                Use <Link to={"/offense"}>Offense</Link> to see the effectiveness of your Pokémon's attack for
                different Pokemon types.
            </p>
            <p>
                Use <Link to={"/offense"}>Defense</Link> to see the effectiveness of different Pokémon type's attacks on
                your Pokémon.
            </p>
            <br/>
            <br/>

            <ModeToggle/>

            <h2 className="text-lg font-semibold pb-2">Contact Me</h2>
            <p>Hi there, I'm Kim and I made this calculator!</p>
            <p>
                Have any thoughts/inquiries about it? Contact me here: <a
                href="mailto: km.phm2@gmail.com">km.phm2@gmail.com</a>
            </p>
            <p>View the source code <a href={"https://github.com/kimypham/pokemon-type-calculator"}>here</a></p>
        </div>
    );
};