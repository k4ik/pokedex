const detailsContainer = document.getElementById('detailsContainer');
const params = new URLSearchParams(window.location.search);
const pokemonId = params.get('id');

const fetchPokemonDetails = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const resp = await fetch(url);
    const data = await resp.json();

    // Agora, vamos buscar a descrição do Pokémon usando a PokéAPI v2
    const speciesUrl = data.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();

    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

    data.description = description;
    displayPokemonDetails(data);
}

const displayPokemonDetails = (pokemonData) => {
    const { name, id, types, moves, sprites, description } = pokemonData;

    const typeNames = types.map(type => type.type.name).join(', ');
    const moveNames = moves.map(move => move.move.name).join(', ');

    const detailsHTML = `
    <div class="detail-card">
        <h2>${name}</h2>
        <div class="details_poke">
            <div class="poke_img"><img src="${sprites.front_default}" alt="${name}"></div>
            <div class="description">
                <p><strong>ID:</strong> ${id}</p>
                <p><strong>Type(s):</strong> ${typeNames}</p>
            </div>
        </div>
        <div class="poke_description">
            <h3>Description</h3>
            <p>${description}</p>
        </div>
    </div> 
    `;

    detailsContainer.innerHTML = detailsHTML;
}

fetchPokemonDetails();
