const detailsContainer = document.getElementById('detailsContainer');
const params = new URLSearchParams(window.location.search);
const pokemonId = params.get('id');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const showLoading = () => {
  detailsContainer.innerHTML = '<p>Loading Pokémon details...</p>';
};

const showError = (msg) => {
  detailsContainer.innerHTML = `<p class="error">${msg}</p>`;
};

const fetchPokemonDetails = async () => {
  if (!pokemonId) {
    showError('No Pokémon ID specified.');
    return;
  }



  showLoading();

  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!resp.ok) throw new Error('Failed to fetch Pokémon.');
    const data = await resp.json();

    const speciesResp = await fetch(data.species.url);
    if (!speciesResp.ok) throw new Error('Failed to fetch species data.');
    const speciesData = await speciesResp.json();

    const flavorEntry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
    const description = flavorEntry 
      ? flavorEntry.flavor_text.replace(/[\f\n]/g, ' ') 
      : 'No description available.';

    data.description = description;

    displayPokemonDetails(data);
  } catch (error) {
    showError(error.message);
  }
};

const displayPokemonDetails = (pokemon) => {
  const { name, id, types, moves, sprites, description, stats } = pokemon;
  const typeNames = types.map(t => capitalize(t.type.name)).join(', ');
  const nameCap = capitalize(name);

  const statsHTML = stats.map(stat =>
    `<p><strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}</p>`
  ).join('');

  const movesList = `
    <details>
      <summary>Show All Moves (${moves.length})</summary>
      <ul class="moves-list">
        ${moves.map(move => `<li>${capitalize(move.move.name)}</li>`).join('')}
      </ul>
    </details>
  `;

  const spritesHTML = `
    <div class="poke_img">
      <img src="${sprites.front_default}" alt="${nameCap} front">
      <img src="${sprites.back_default}" alt="${nameCap} back">
      ${sprites.front_shiny ? `<img src="${sprites.front_shiny}" alt="${nameCap} shiny front">` : ''}
      ${sprites.back_shiny ? `<img src="${sprites.back_shiny}" alt="${nameCap} shiny back">` : ''}
    </div>
  `;

  detailsContainer.innerHTML = `
    <a href="index.html" class="back-link">← Back to Pokédex</a>
    <div class="detail-card">
      <h2>${nameCap} (#${id.toString().padStart(3, '0')})</h2>
      ${spritesHTML}
      <div class="details_poke">
        <div class="description">
          <p><strong>Type(s):</strong> ${typeNames}</p>
          <h3>Description</h3>
          <p>${description}</p>
        </div>
      </div>
      <div class="poke_description">
        <h3>Base Stats</h3>
        <div class="stats">${statsHTML}</div>
        <h3>Moves</h3>
        ${movesList}
      </div>
    </div>
  `;
};

fetchPokemonDetails();
