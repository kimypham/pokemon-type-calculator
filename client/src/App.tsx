import { ThemeProvider } from "@/components/shadcn/ui";
import React from "react";
import { Offense } from "./pages/Offense";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Defense } from "@/pages/Defense.tsx";
import { About } from "@/pages/About.tsx";
import { NavigationBar } from "@/components/NavigationBar.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <NavigationBar/>
                <Routes>
                    <Route>
                        <Route path={"defense"} element={<Defense/>}/>
                        <Route path={"offense"} element={<Offense/>}/>
                        <Route path={"about"} element={<About/>}/>
                        <Route path={"/"} element={<About/>}/>
                        <Route path={"*"} element={<About/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            {/*<PokemonCalculator/>*/}
        </ThemeProvider>
    );
}

export default App;
