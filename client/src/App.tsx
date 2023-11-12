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
  ThemeProvider,
} from "@/components/shadcn/ui";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="p-8">
        <h1 className="text-4xl font-extrabold text-center dark:text-white">
          Pokemon Type Calculator
        </h1>
        <ModeToggle />
        <PokemonSearch />
      </div>
    </ThemeProvider>
  );
}

interface IName {
  name: string;
}

interface IPokemonType {
  type: IName;
}

interface IPokemon {
  name: string;
  types: IPokemonType[];
  sprites: {
    front_default: string;
    versions?: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
          };
        };
      };
    };
  };
}

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
  fairy: 1,
};

// const initialEffectiveness : IEffectiveness {
//     4?: string[];
//     2?: string[];
//     0.5?: string[];
//     0.25?: string[];
//     0?: string[];
// }

interface IEffectiveness {
  4?: string[];
  2?: string[];
  0.5?: string[];
  0.25?: string[];
  0?: string[];
}

function PokemonSearch() {
  const [pokemonData, setPokemonData] = useState<IPokemon>();
  const [typeData, setTypeData] = useState<IType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notFoundError, setNotFoundError] = useState<boolean>(false);
  const [takeDamageArray, setTakeDamageArray] = useState<IDamage>({
    ...initialDamageArray,
  });
  const [giveDamageArray, setGiveDamageArray] = useState<IDamage>({
    ...initialDamageArray,
  });

  const [takeDamageList, setTakeDamageList] = useState<IEffectiveness>();
  const form = useForm<{ name: string }>({ defaultValues: { name: "" } });

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

  const calculateDamage = (
    typeData: IType,
    currentTakeDamageArray: IDamage,
    currentGiveDamageArray: IDamage
  ) => {
    // const newTakeDamageArray:IDamage = {...currentTakeDamageArray};

    typeData.damage_relations.double_damage_from.forEach((type) => {
      currentTakeDamageArray[type.name as keyof IDamage] =
        currentTakeDamageArray[type.name as keyof IDamage] * 2;
    });
    typeData.damage_relations.half_damage_from.forEach((type) => {
      currentTakeDamageArray[type.name as keyof IDamage] =
        currentTakeDamageArray[type.name as keyof IDamage] / 2;
    });
    typeData.damage_relations.no_damage_from.forEach((type) => {
      currentTakeDamageArray[type.name as keyof IDamage] = 0;
    });

    typeData.damage_relations.double_damage_to.forEach((type) => {
      currentGiveDamageArray[type.name as keyof IDamage] =
        currentGiveDamageArray[type.name as keyof IDamage] * 2;
    });
    typeData.damage_relations.half_damage_to.forEach((type) => {
      currentGiveDamageArray[type.name as keyof IDamage] =
        currentGiveDamageArray[type.name as keyof IDamage] / 2;
    });
    typeData.damage_relations.no_damage_to.forEach((type) => {
      currentGiveDamageArray[type.name as keyof IDamage] = 0;
    });
  };

  useEffect(() => {
    // I add this check so that when you reload the page (when the pokemonData is empty) the calculation would not run
    if (pokemonData) {
      // I changed to this to ensure the initial array always correct --> if you use state it could get contaminated when u request on different pokemons
      const currentTakeDamageArray: IDamage = JSON.parse(
        JSON.stringify(initialDamageArray)
      );
      const currentGiveDamageArray = JSON.parse(
        JSON.stringify(initialDamageArray)
      );

      pokemonData?.types.forEach(async (pokemon) => {
        const typeData = await getTypeData(pokemon.type.name);
        if (typeData) {
          // I added this
          calculateDamage(
            typeData,
            currentTakeDamageArray,
            currentGiveDamageArray
          );
        }
        // U gotta set it here to make sure the set state is setting after the calculation is done <3
        setTakeDamageArray(currentTakeDamageArray);
        setGiveDamageArray(currentGiveDamageArray);
      });
    }
  }, [pokemonData]);

  //i added this baby <3
  // anything for my loving baby
  // YOU CAN DO IT BABY!!!!!!!!!!
  // I BELIEVE IN YOUUUUUUUUUUUUUU <3<3<3<3
  // I AM HAPPY TO HELP YOU OUT
  useEffect(() => {
    // This one here so that the first initial load wouldn't trigger this --> Less console log
    if (pokemonData) {
      interface Effectiveness {
        [key: number]: string[];
      }

      const takeEffectiveness: Effectiveness = {};

      Object.keys(takeDamageArray).forEach((type) => {
        const effectiveness = takeDamageArray[type as keyof IDamage];

        const toUpdateEffectiveness = takeEffectiveness[effectiveness];

        if (toUpdateEffectiveness) {
          toUpdateEffectiveness.push(type);
        } else {
          takeEffectiveness[effectiveness] = [type];
        }
      });
      // Prolly do teh same for giveDamageArray --> then we will clean up later
      console.log(takeEffectiveness);
      console.log(JSON.stringify(takeEffectiveness));
    }
  }, [takeDamageArray]);

  async function onSubmit(values: { name: string }) {
    if (pokemonData?.name.toLowerCase() != values.name.toLowerCase()) {
      setTakeDamageArray({ ...initialDamageArray });
      setGiveDamageArray({ ...initialDamageArray });
      setTypeData(undefined);
      setNotFoundError(false);

      setIsLoading(true);
      getPokemonData(values.name);
    }
  }

  let pokemonName: string = "";
  if (pokemonData) {
    pokemonName =
      pokemonData?.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
  }

  const pokemonSprite = () => {
    if (
      pokemonData?.sprites.versions?.["generation-v"]["black-white"].animated
        .front_default
    ) {
      return (
        <img
          src={
            pokemonData?.sprites.versions?.["generation-v"]["black-white"]
              .animated.front_default
          }
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
      <div className="flex items-center justify-center w-full pb-14">
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
        <div className="flex">
          <Icons.spinner className="w-5 h-5 animate-spin" />
          <div className="pl-2">Loading...</div>
        </div>
      )}
      {notFoundError && (
        <div>
          <p>Pokemon doesn't exist</p>
        </div>
      )}
      {pokemonData && (
        <div className="flex">
          <div className="justify-center w-1/2 mr-2 text-center">
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

          {typeData && (
            <div className="w-1/2">
              <div className="pb-5">
                <h1 className="font-bold">Weak against / Defense</h1>
                <p>Use these types on {pokemonName}!</p>
                <p>takes 2x damage from</p>
                <div className="flex">
                  {typeData?.damage_relations.double_damage_from.map(
                    (type, i) => (
                      <div key={"double_damage_from" + i}>
                        <Badge>{type.name.toUpperCase()}</Badge>
                      </div>
                    )
                  )}
                </div>
                <p>takes 1x damage from</p>
                <p>TODO</p>
                {typeData?.damage_relations.half_damage_from && (
                  <div>
                    <p>takes 1⁄2x damage from</p>
                    <div className="flex">
                      {typeData?.damage_relations.half_damage_from.map(
                        (type, i) => (
                          <div key={"half_damage_from" + i}>
                            <Badge>{type.name.toUpperCase()}</Badge>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                <p>does not effect</p>
                <div className="flex">
                  {typeData?.damage_relations.no_damage_from.map((type, i) => (
                    <div key={"no_damage_from" + i}>
                      <Badge>{type.name.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <h1 className="font-bold">Strong against / Offense</h1>
              <p>
                Use {pokemonData?.types.map((pokemon) => pokemon.type.name)}{" "}
                moves on these types!
              </p>
              <p>does 2x damage to</p>
              <div className="flex">
                {typeData?.damage_relations.double_damage_to.map((type, i) => (
                  <div key={"double_damage_to" + i}>
                    <Badge>{type.name.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
              <p>does 1x damage to</p>
              <p>TODO</p>
              <p>does 1⁄2x damage to</p>
              <div className="flex">
                {typeData?.damage_relations.half_damage_to.map((type, i) => (
                  <div key={"half_damage_to" + i}>
                    <Badge>{type.name.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
              <p>immune to</p>
              <div className="flex">
                {typeData?.damage_relations.no_damage_to.map((type, i) => (
                  <div key={"no_damage_to" + i}>
                    <Badge>{type.name.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {takeDamageArray && JSON.stringify(takeDamageArray)}
    </div>
  );
}

export default App;
