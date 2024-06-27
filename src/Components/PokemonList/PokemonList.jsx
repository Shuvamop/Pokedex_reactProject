import React, { useEffect, useState } from "react";
import axios from "axios";
import "../PokemonList/PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

const PokemonList = () => {
  // const [x,setX]=useState(0)
  // const [y,setY]=useState(0)

  // useEffect(async()=>{
  //     // console.log('effect called');
  //     const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
  //     console.log(response)
  // },[])

  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(POKEDEX_URL); //This downloads list of 20 pokemons
        const pokemonResults = response.data.results; // we get the array of pokemons from result
        console.log(response.data);
        //iterating over the array of pokemons , and using their url , to create an array of promises
        //that will download those 20 pokemons
        const pokeomResultPromies = pokemonResults.map((pokemon) =>
          axios.get(pokemon.url)
        );
        //passing that promises array to axios.all
        const pokemonData = await axios.all(pokeomResultPromies); // array of 20 pokemon detailed data
        console.log(pokemonData);

        // now iterate on the data of each pokemon and extract id , name, image, types
        const pokeListResult = pokemonData.map((pokeData) => {
          const pokemon = pokeData.data;
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other
              ? pokemon.sprites.other.dream_world.front_default
              : pokemon.sprites.front_shiny,
            types: pokemon.types,
          };
        });
        console.log(pokeListResult);

        setPokemonList(pokeListResult);

        // console.log(response);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="pokemon-list-wrapper">
      {/* <div>
            X : {x} <button onClick={()=>setX(x+1)}>Inc</button>
        </div>
        <div>
            Y : {y} <button onClick={()=>setY(y+1)}>Inc</button>
        </div> */}
{/* 
      <div>Pokemon List</div> */}
      <div className="pokemon-wrapper">
      {isLoading
        ? "Loading......"
        : pokemonList.map((p) => (
            <Pokemon name={p.name} image={p.image} key={p.id} />
          ))}
      </div>
      <div className="controls">
        <button>Prev</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default PokemonList;
