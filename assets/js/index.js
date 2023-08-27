const pokeContainer = document.querySelector('#pokeContainer');

const getPokemons = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon`
    const resp = await fetch(url)
    const data = await resp.json() 
    console.log(data);
}

getPokemons();