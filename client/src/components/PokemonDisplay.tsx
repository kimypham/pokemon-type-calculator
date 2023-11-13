import { Badge } from "@/components/shadcn/ui";
import React from "react";
import type { IPokemon } from "@/types.ts";

interface PokemonDisplayProps {
    pokemonName: string;
    pokemonData: IPokemon;
}

export const PokemonDisplay = ({pokemonName, pokemonData}: PokemonDisplayProps) => {
    const pokemonSprite = () => {
        if (pokemonData?.sprites.versions?.["generation-v"]["black-white"].animated.front_default) {
            return (
                <img
                    src={pokemonData?.sprites.versions?.["generation-v"]["black-white"].animated.front_default}
                    className="w-32 h-32 p-5"
                    alt={"sprite of " + pokemonName}
                />
            );
        } else {
            return (
                <img
                    src={pokemonData?.sprites.front_default}
                    className="w-40 h-40 rendering-pixelated"
                    alt={"sprite of " + pokemonName}
                />
            );
        }
    };

    return (
        <div>
            <h2>{pokemonName}</h2>
            <div className="flex content-center justify-center object-center">
                {pokemonSprite()}
            </div>
            <div className="flex justify-center">
                {pokemonData?.types.map((pokemon, i) => (
                    <div key={"type" + i}>
                        <Badge>{pokemon.type.name.toUpperCase()}</Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonDisplay;