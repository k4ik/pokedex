const pokeContainer = document.querySelector('#pokeContainer');
const pokemonsCount = 1025;
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#d2adf1',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}

const mainTypes = Object.keys(colors);

const fetchPokemons = async () => {
    const pokemonPromises = [];
    for (let i = 1; i <= pokemonsCount; i++) {
        pokemonPromises.push(getPokemon(i));
    }
    await Promise.all(pokemonPromises);
}

const getPokemon = async (id) => {
    let pokemon = localStorage.getItem(`pokemon-${id}`);
    if (!pokemon) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const resp = await fetch(url);
        const data = await resp.json();

        pokemon = {
            id: data.id,
            name: data.name,
            types: data.types.map(typeInfo => typeInfo.type.name)
        };

        localStorage.setItem(`pokemon-${id}`, JSON.stringify(pokemon));
    } else {
        pokemon = JSON.parse(pokemon);
    }
    createPokemonCard(pokemon);
}


const createPokemonCard = (poke) => {
    const card = document.createElement('div');
    card.classList.add('pokemon');

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');

    const type = mainTypes.find(type => poke.types.indexOf(type) > -1);
    const color = colors[type];

    card.style.backgroundColor = color;

    const pokemonInnerHTML = `
        <div class="imgContainer">
            <a href="details.html?id=${poke.id}" target="_blank">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
            </a>
        </div>
        <div class="infs">
            <span class="number">#${id}</span>
            <h2 class="name">${name}</h2>
            <p class="type">Type: <span>${type}</span></p>
        </div>
    `;

    card.innerHTML = pokemonInnerHTML;
    pokeContainer.appendChild(card);
}

const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');

searchButton.addEventListener('click', () => {
    const searchText = searchInput.value.toLowerCase();
    filterPokemons(searchText);
});

const filterPokemons = (searchText) => {
    const allPokemonCards = document.querySelectorAll('.pokemon');

    allPokemonCards.forEach(card => {
        const cardText = card.innerText.toLowerCase();
        if (cardText.includes(searchText)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

fetchPokemons();
