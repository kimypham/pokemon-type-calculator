import { ModeToggle, ThemeProvider } from "@/components/shadcn/ui";
import React from "react";
import PokemonCalculator from "@/components/PokemonCalculator.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="p-8">
                <h1 className="text-4xl font-extrabold text-center dark:text-white">
                    Pokemon Type Calculator
                </h1>
                <ModeToggle/>
                <PokemonCalculator/>
            </div>
        </ThemeProvider>
    );
}

export default App;
