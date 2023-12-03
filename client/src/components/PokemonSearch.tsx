import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from "@/components/shadcn/ui";
import React from "react";
import { useForm } from "react-hook-form";

interface PokemonSearchProps {
    onSubmit: any;
}

export const PokemonSearch = ({onSubmit}: PokemonSearchProps) => {
    const form = useForm<{ name: string }>({defaultValues: {name: ""}});


    return (
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
    );
};