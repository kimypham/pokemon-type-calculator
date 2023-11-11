import {Button} from "@/components/shadcn/ui/button.tsx";
import { ThemeProvider } from "@/components/shadcn/ui/theme-provider.tsx";
import {ModeToggle} from "@/components/shadcn/ui/mode-toggle.tsx";
import {useMutation} from "@tanstack/react-query";
import {Form, FormControl, FormItem, FormLabel} from "./components/shadcn/ui/form";
import {FormField} from "@/components/shadcn/ui/form.tsx";
import {Input} from "@/components/shadcn/ui/input.tsx";
import {useForm} from "react-hook-form";
import axios from "axios";
import {Badge} from "@/components/shadcn/ui/badge.tsx";
import { Icons } from "./components/shadcn/ui/icon";


function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="p-8">
                <h1 className="text-4xl font-extrabold dark:text-white text-center">Pokemon Type Calculator</h1>
                <ModeToggle/>
                <PokemonSearch/>
            </div>
        </ThemeProvider>

    )
}

interface IName {
    name: string
}

interface IPokemonType {
    type: IName
}

interface IPokemon {
    name: string,
    types: IPokemonType[],
    sprites: {
        front_default: string,
        versions?: {
            "generation-v": {
                "black-white": {
                    animated: {
                        front_default: string
                    }
                }
            }
        }
    }
}

interface IType {
    damage_relations: {
        double_damage_from: IName[],
        double_damage_to: IName[],
        half_damage_from: IName[],
        half_damage_to: IName[],
        no_damage_from: IName[],
        no_damage_to: IName[],
    }
}


function PokemonSearch() {
    const form = useForm<{name: string}>(
        {defaultValues: {name: ""}}
    )

    async function onSubmit(values: { name: string }) {
        console.log(values.name)
        mutatePokemon(values.name)
        mutateType("test")
        // {pokemonData?.types.map(async (pokemon) => await mutateType(pokemon.type.name))}

    }

    const {data: retrievedPokemonData, mutate: mutatePokemon, isPending ,isError: isErrorPokemon} = useMutation({
        mutationFn: (pokemonName: string) => {
            console.log("i sent")
            return axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonName)
        }
    })

    const {data: retrievedTypeData, mutate: mutateType} = useMutation({
        mutationFn: (pokemonType: string) => {
            console.log("i sent2", pokemonType)
            return axios.get('https://pokeapi.co/api/v2/type/normal')
        }
    })

    console.log(retrievedPokemonData?.data)
    console.log("retrievedTypeData",retrievedTypeData?.data)


    const pokemonData: IPokemon = retrievedPokemonData?.data
    const typeData: IType = retrievedTypeData?.data

    let pokemonName: string = ""
    if (pokemonData) {
        pokemonName = pokemonData?.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
    }

    const pokemonSprite = () => {
        if (pokemonData.sprites.versions?.["generation-v"]["black-white"].animated.front_default) {
        return <img src={pokemonData.sprites.versions?.["generation-v"]["black-white"].animated.front_default} className="h-32 w-32 p-5"/>
        } else {
            return <img src={pokemonData.sprites.front_default} className="h-40 w-40 rendering-pixelated"/>
        }
    }


    return (
        <div>
            <div className="flex w-full items-center pb-14 justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Search for a Pokemon</FormLabel>
                                    <div className="flex">
                                        <FormControl>
                                            <Input placeholder="Pokemon name or ID" {...field} required/>
                                        </FormControl>
                                        <Button type="submit">Search</Button>
                                    </div>
                                </FormItem>

                            )}
                        />
                    </form>
                </Form>
            </div>
            { isPending &&
                <div className="flex">
                    <Icons.spinner className="h-5 w-5 animate-spin"/><div className="pl-2">Loading...</div>
                </div>
            }
            { isErrorPokemon &&
                <div>
                    <p>Pokemon doesn't exist</p>
                </div>
            }
            { pokemonData &&
                <div className="flex">
                    <div className="w-1/2 mr-2 text-center justify-center">
                        <h2>{pokemonName}</h2>
                        <div className="flex object-center content-center justify-center">
                            {pokemonSprite()}
                        </div>
                        <div className="flex justify-center">
                            {pokemonData?.types.map((pokemon) => <p key={pokemon.type.name}><Badge>{pokemon.type.name.toUpperCase()}</Badge></p>)}
                        </div>
                    </div>

                    {typeData &&
                        <div className="w-1/2">
                            <div className="pb-5">
                                <h1 className="font-bold">Weak against / Defense</h1>
                                <p>Use these types on {pokemonName}!</p>
                                <p>takes 2x damage from</p>
                                <div className="flex">
                                    {typeData?.damage_relations.double_damage_from.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                                </div>
                                <p>takes 1x damage from</p>
                                <p>TODO</p>
                                { typeData?.damage_relations.half_damage_from &&
                                    <div>
                                        <p>takes 1⁄2x damage from</p>
                                        <div className="flex">
                                            {typeData?.damage_relations.half_damage_from.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                                        </div>
                                    </div>
                                }
                                <p>does not effect</p>
                                <div className="flex">
                                    {typeData?.damage_relations.no_damage_from.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                                </div>
                            </div>
                            <h1 className="font-bold">Strong against / Offense</h1>
                            <p>Use {pokemonData?.types.map((pokemon) => pokemon.type.name)} moves on these types!</p>
                            <p>does 2x damage to</p>
                            <div className="flex">
                                {typeData?.damage_relations.double_damage_to.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                            </div>
                            <p>does 1x damage to</p>
                            <p>TODO</p>
                            <p>does 1⁄2x damage to</p>
                            <div className="flex">
                                {typeData?.damage_relations.half_damage_to.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                            </div>
                            <p>immune to</p>
                            <div className="flex">
                                {typeData?.damage_relations.no_damage_to.map((type) => <p><Badge>{type.name.toUpperCase()}</Badge></p>)}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default App