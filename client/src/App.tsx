import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Badge,
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Icons,
    Input,
    ModeToggle,
    ThemeProvider
} from "@/components/shadcn/ui";
import { useEffect, useState } from "react";

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

interface IDamage {
    normal: number,
    fire: number,
    water: number,
    grass: number,
    electric: number,
    ice: number,
    fighting: number,
    poison: number,
    ground: number,
    flying: number,
    physic: number,
    bug: number,
    rock: number,
    ghost: number,
    dragon: number,
    dark: number,
    steel: number,
    fairy: number
}

const initialDamageArray: IDamage = {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "physic": 1,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 1,
    "fairy": 1
}

interface IListDamage {
    4: string[],
    2: string[],
    0.5: string[],
    0.25: string[],
    0: string[]
}


function PokemonSearch() {
    const [pokemonData, setPokemonData] = useState<IPokemon>()
    const [typeData, setTypeData] = useState<IType>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [notFoundError, setNotFoundError] = useState<boolean>(false)
    const [takeDamageArray, setTakeDamageArray] = useState<IDamage>({...initialDamageArray})
    const [giveDamageArray, setGiveDamageArray] = useState<IDamage>({...initialDamageArray})

    const [takeDamageList, setTakeDamageList] = useState<IListDamage>()
    const form = useForm<{ name: string }>(
        {defaultValues: {name: ""}}
    )

    const getPokemonData = (pokemonName: string) => {
        axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonName)
            .then((response) => {
                setPokemonData(response.data)
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    console.log(error)
                    setNotFoundError(true)
                } else {
                    console.error(error)
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const getTypeData = (pokemonType: string) => {
        console.log(pokemonType)
        axios.get('https://pokeapi.co/api/v2/type/' + pokemonType)
            .then((response) => {
                console.log(response.data)
                let newTakeDamageArray: IDamage = takeDamageArray
                let newGiveDamageArray: IDamage = giveDamageArray
                const typeData: IType = response.data

                typeData.damage_relations.double_damage_from.map((type) => {
                    // console.log("type.name * 2", type.name, takeDamageArray[type.name as keyof IDamage], takeDamageArray[type.name as keyof IDamage] * 2)
                    newTakeDamageArray[type.name as keyof IDamage] = takeDamageArray[type.name as keyof IDamage] * 2
                })
                typeData.damage_relations.half_damage_from.map((type) => {
                    // console.log("type.name / 2", type.name, takeDamageArray[type.name as keyof IDamage], takeDamageArray[type.name as keyof IDamage] / 2)
                    newTakeDamageArray[type.name as keyof IDamage] = takeDamageArray[type.name as keyof IDamage] / 2
                })
                typeData.damage_relations.no_damage_from.map((type) => {
                    // console.log("type.name * 0", type.name, takeDamageArray[type.name as keyof IDamage])
                    newTakeDamageArray[type.name as keyof IDamage] = 0
                })

                typeData.damage_relations.double_damage_to.map((type) => {
                    newGiveDamageArray[type.name as keyof IDamage] = giveDamageArray[type.name as keyof IDamage] * 2
                })
                typeData.damage_relations.half_damage_to.map((type) => {
                    newGiveDamageArray[type.name as keyof IDamage] = giveDamageArray[type.name as keyof IDamage] / 2
                })
                typeData.damage_relations.no_damage_to.map((type) => {
                    newGiveDamageArray[type.name as keyof IDamage] = 0
                })


                // console.log("newTakeDamageArray", newTakeDamageArray)
                // console.log("newGiveDamageArray", newGiveDamageArray)
                // setTakeDamageArray(newTakeDamageArray) // looks like we dont need this??
                // setGiveDamageArray(newGiveDamageArray)
                setTypeData(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        // test()
        pokemonData?.types.map((pokemon) => getTypeData(pokemon.type.name))
        console.log("final", takeDamageArray)
        const test = takeDamageArray
        console.log("test", test)

        // setTakeDamageArray({...initialDamageArray})
        // console.log("takeDamageArray", takeDamageArray)

        // for (const property in test) {
        //     // console.log(takeDamageArray)
        //     console.log(`${property}: ${test[property as keyof IDamage]}`);
        // }
        console.log(Object.values(test))
        console.log(JSON.parse(JSON.stringify(test)))
    }, [pokemonData]);

    async function onSubmit(values: { name: string }) {
        if (pokemonData?.name.toLowerCase() != values.name.toLowerCase()) {
            setPokemonData(undefined)
            setTakeDamageArray({...initialDamageArray})
            setGiveDamageArray({...initialDamageArray})

            setTypeData(undefined)
            setNotFoundError(false)
            console.log(values.name)


            setIsLoading(true)
            getPokemonData(values.name)
        }
    }

    let pokemonName: string = ""
    if (pokemonData) {
        pokemonName = pokemonData?.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
    }

    const pokemonSprite = () => {
        if (pokemonData?.sprites.versions?.["generation-v"]["black-white"].animated.front_default) {
            return <img src={pokemonData?.sprites.versions?.["generation-v"]["black-white"].animated.front_default}
                        className="h-32 w-32 p-5" alt={"sprite of " + pokemonName}/>
        } else {
            return <img src={pokemonData?.sprites.front_default} className="h-40 w-40 rendering-pixelated"
                        alt={"sprite of " + pokemonName}/>
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
                            render={({field}) => (
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
            {isLoading &&
                <div className="flex">
                    <Icons.spinner className="h-5 w-5 animate-spin"/>
                    <div className="pl-2">Loading...</div>
                </div>
            }
            {notFoundError &&
                <div>
                    <p>Pokemon doesn't exist</p>
                </div>
            }
            {pokemonData &&
                <div className="flex">
                    <div className="w-1/2 mr-2 text-center justify-center">
                        <h2>{pokemonName}</h2>
                        <div className="flex object-center content-center justify-center">
                            {pokemonSprite()}
                        </div>
                        <div className="flex justify-center">
                            {pokemonData?.types.map((pokemon, i) => <div key={"type" + i}>
                                <Badge>{pokemon.type.name.toUpperCase()}</Badge></div>)}
                        </div>
                    </div>

                    {typeData &&
                        <div className="w-1/2">
                            <div className="pb-5">
                                <h1 className="font-bold">Weak against / Defense</h1>
                                <p>Use these types on {pokemonName}!</p>
                                <p>takes 2x damage from</p>
                                <div className="flex">
                                    {typeData?.damage_relations.double_damage_from.map((type, i) => <div
                                        key={"double_damage_from" + i}><Badge>{type.name.toUpperCase()}</Badge></div>)}
                                </div>
                                <p>takes 1x damage from</p>
                                <p>TODO</p>
                                {typeData?.damage_relations.half_damage_from &&
                                    <div>
                                        <p>takes 1⁄2x damage from</p>
                                        <div className="flex">
                                            {typeData?.damage_relations.half_damage_from.map((type, i) => <div
                                                key={"half_damage_from" + i}><Badge>{type.name.toUpperCase()}</Badge>
                                            </div>)}
                                        </div>
                                    </div>
                                }
                                <p>does not effect</p>
                                <div className="flex">
                                    {typeData?.damage_relations.no_damage_from.map((type, i) => <div
                                        key={"no_damage_from" + i}><Badge>{type.name.toUpperCase()}</Badge></div>)}
                                </div>
                            </div>
                            <h1 className="font-bold">Strong against / Offense</h1>
                            <p>Use {pokemonData?.types.map((pokemon) => pokemon.type.name)} moves on these types!</p>
                            <p>does 2x damage to</p>
                            <div className="flex">
                                {typeData?.damage_relations.double_damage_to.map((type, i) => <div
                                    key={"double_damage_to" + i}><Badge>{type.name.toUpperCase()}</Badge></div>)}
                            </div>
                            <p>does 1x damage to</p>
                            <p>TODO</p>
                            <p>does 1⁄2x damage to</p>
                            <div className="flex">
                                {typeData?.damage_relations.half_damage_to.map((type, i) => <div
                                    key={"half_damage_to" + i}><Badge>{type.name.toUpperCase()}</Badge></div>)}
                            </div>
                            <p>immune to</p>
                            <div className="flex">
                                {typeData?.damage_relations.no_damage_to.map((type, i) => <div key={"no_damage_to" + i}>
                                    <Badge>{type.name.toUpperCase()}</Badge></div>)}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default App