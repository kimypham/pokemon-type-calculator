export interface IName {
    name: string;
}

export interface IPokemonType {
    type: IName;
}

export interface IPokemon {
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