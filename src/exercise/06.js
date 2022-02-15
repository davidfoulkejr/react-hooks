// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon';

const statusOptions = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

function PokemonInfo({pokemonName}) {
  const [pokemonState, setPokemonState] = React.useState({
    status: statusOptions.pending,
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    setPokemonState({
      status: statusOptions.pending,
    });

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemonState({pokemon: pokemonData, status: statusOptions.resolved});
      },
      e => {
        setPokemonState({status: statusOptions.rejected, error: e});
      },
    );
  }, [pokemonName]);

  switch (pokemonState.status) {
    case statusOptions.idle:
      return 'Submit a pokemon';
    case statusOptions.pending:
      return <PokemonInfoFallback name={pokemonName} />;
    case statusOptions.resolved:
      return <PokemonDataView pokemon={pokemonState.pokemon} />;
    case statusOptions.rejected:
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{pokemonState.error.message}</pre>
        </div>
      );
    default:
      return null;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
