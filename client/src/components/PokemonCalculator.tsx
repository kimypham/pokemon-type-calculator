import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Badge, Button, Form, FormControl, FormField, FormItem, FormLabel, Icons, Input } from "@/components/shadcn/ui";
import type { IName, IPokemon } from "@/types.ts";
import PokemonDisplay from "@/components/PokemonDisplay.tsx";

interface IType {
    damage_relations: {
        double_damage_from: IName[];
        double_damage_to: IName[];
        half_damage_from: IName[];
        half_damage_to: IName[];
        no_damage_from: IName[];
        no_damage_to: IName[];
    };
}

interface IDamage {
    normal: number;
    fire: number;
    water: number;
    grass: number;
    electric: number;
    ice: number;
    fighting: number;
    poison: number;
    ground: number;
    flying: number;
    physic: number;
    bug: number;
    rock: number;
    ghost: number;
    dragon: number;
    dark: number;
    steel: number;
    fairy: number;
}

const initialDamageArray: IDamage = {
    normal: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    physic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1
};

interface IEffectiveness {
    4?: string[];
    2?: string[];
    0.5?: string[];
    0.25?: string[];
    0?: string[];
}

interface Effectiveness {
    [key: number]: string[];
}

export const PokemonCalculator = (): JSX.Element => {
    const [pokemonData, setPokemonData] = useState<IPokemon>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notFoundError, setNotFoundError] = useState<boolean>(false);
    const [takeDamageArray, setTakeDamageArray] = useState<IDamage>({
        ...initialDamageArray
    });
    const [giveDamageArray, setGiveDamageArray] = useState<IDamage>({
        ...initialDamageArray
    });
    const [takeDamageList, setTakeDamageList] = useState<IEffectiveness>();
    const [giveDamageList, setGiveDamageList] = useState<IEffectiveness>();

    const form = useForm<{ name: string }>({defaultValues: {name: ""}});

    const pokemonName: string = pokemonData ? pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1) : "";
    
    const getPokemonData = (pokemonName: string) => {
        axios
            .get("https://pokeapi.co/api/v2/pokemon/" + pokemonName)
            .then((response) => {
                setPokemonData(response.data);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    console.log(error);
                    setNotFoundError(true);
                } else {
                    console.error(error);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getTypeData = async (pokemonType: string): Promise<IType> => {
        return await axios
            .get("https://pokeapi.co/api/v2/type/" + pokemonType)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const calculateEffectiveness = (typeData: IType, currentTakeDamageArray: IDamage, currentGiveDamageArray: IDamage) => {
        typeData.damage_relations.double_damage_from.forEach((type) => {
            currentTakeDamageArray[type.name as keyof IDamage] *= 2;
        });
        typeData.damage_relations.half_damage_from.forEach((type) => {
            currentTakeDamageArray[type.name as keyof IDamage] /= 2;
        });
        typeData.damage_relations.no_damage_from.forEach((type) => {
            currentTakeDamageArray[type.name as keyof IDamage] = 0;
        });

        typeData.damage_relations.double_damage_to.forEach((type) => {
            currentGiveDamageArray[type.name as keyof IDamage] *= 2;
        });
        typeData.damage_relations.half_damage_to.forEach((type) => {
            currentGiveDamageArray[type.name as keyof IDamage] /= 2;
        });
        typeData.damage_relations.no_damage_to.forEach((type) => {
            currentGiveDamageArray[type.name as keyof IDamage] = 0;
        });
    };

    const calculatePokemonEffectiveness = async () => {
        if (pokemonData) {
            const currentTakeDamageArray: IDamage = {...initialDamageArray};
            const currentGiveDamageArray: IDamage = {...initialDamageArray};

            await Promise.all(
                pokemonData?.types.map(async (pokemon) => {
                    const typeData: IType = await getTypeData(pokemon.type.name);
                    if (typeData) {
                        calculateEffectiveness(typeData, currentTakeDamageArray, currentGiveDamageArray);
                    }
                })
            );
            setTakeDamageArray(currentTakeDamageArray);
            setGiveDamageArray(currentGiveDamageArray);
        }
    };

    const reformatEffectiveness = (damageArray: IDamage) => {
        const effectivenessObj: Effectiveness = {};
        Object.keys(damageArray).forEach((type) => {
            const effectiveness: number = damageArray[type as keyof IDamage];
            const toUpdateEffectiveness: string[] | undefined = effectivenessObj[effectiveness];

            if (toUpdateEffectiveness) {
                toUpdateEffectiveness.push(type);
            } else {
                effectivenessObj[effectiveness] = [type];
            }
        });
        return effectivenessObj;
    };

    const reformatPokemonEffectiveness = () => {
        if (pokemonData) {
            setTakeDamageList(reformatEffectiveness(takeDamageArray));
            setGiveDamageList(reformatEffectiveness(giveDamageArray));
        }
    };

    useEffect(() => {
        calculatePokemonEffectiveness();
    }, [pokemonData]);

    useEffect(() => {
        reformatPokemonEffectiveness();
    }, [takeDamageArray]);

    async function onSubmit(values: { name: string }) {
        if (pokemonData?.name.toLowerCase() != values.name.toLowerCase()) {
            setTakeDamageArray({...initialDamageArray});
            setGiveDamageArray({...initialDamageArray});
            setNotFoundError(false);

            setIsLoading(true);
            getPokemonData(values.name.toLowerCase());
        }
    }

    const displayEffectiveness = (effectivenessNumber: number, isDefense: boolean) => {
        const damageList: IEffectiveness | undefined = isDefense ? takeDamageList : giveDamageList;
        const types = damageList?.[effectivenessNumber as keyof IEffectiveness];

        const isImmune = effectivenessNumber == 0;
        const defenseDesc = isImmune ? "does not affect" : "takes " + effectivenessNumber + "x damage from";
        const offesnseDesc = isImmune ? "immune to" : "gives " + effectivenessNumber + "x damage to";
        const description = isDefense ? defenseDesc : offesnseDesc;
        if (types) {
            return (
                <div>
                    <p>{description}</p>
                    <div className="flex">
                        {types.map(
                            (type, i) => (
                                <div key={description + i}>
                                    <Badge>{type.toUpperCase()}</Badge>
                                </div>
                            )
                        )}
                    </div>
                </div>
            );
        }
    };

    const displayAllEffectiveness = (isDefense: boolean) => {
        return [4, 2, 1, 1 / 2, 1 / 4, 0].map((effectiveness, i) => (
            <div key={i}>
                {displayEffectiveness(effectiveness, isDefense)}
            </div>
        ));
    };

    return (
        <div>
            <div className="flex items-center justify-center w-full pb-14">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Search for a Pokemon</FormLabel>
                                    <div className="flex">
                                        <FormControl>
                                            <Input
                                                placeholder="Pokemon name or ID"
                                                {...field}
                                                required
                                            />
                                        </FormControl>
                                        <Button type="submit">Search</Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
            {isLoading && (
                <div className="flex justify-center text-center">
                    <Icons.spinner className="w-5 h-5 animate-spin"/>
                    <div className="pl-2">Loading...</div>
                </div>
            )}
            {notFoundError && (
                <div className="text-center">
                    <p>Pokemon doesn't exist</p>
                </div>
            )}
            {pokemonData && !(isLoading || notFoundError) && (
                <div className="flex">
                    <div className="justify-center w-1/2 mr-2 text-center">
                        <PokemonDisplay pokemonName={pokemonName} pokemonData={pokemonData}></PokemonDisplay>
                    </div>

                    <div className="w-1/2">
                        <div className="pb-5">
                            <h1 className="font-bold">Weak against / Defense</h1>
                            <p>Use these types on {pokemonName}!</p>
                            {displayAllEffectiveness(true)}
                        </div>
                        <h1 className="font-bold">Strong against / Offense</h1>
                        <p>
                            Use {pokemonName}'s {pokemonData?.types.map((pokemon) => pokemon.type.name)}{" "}
                            moves on these types!
                        </p>
                        {displayAllEffectiveness(false)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonCalculator;