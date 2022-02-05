// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import {useLocalStorageState} from '../utils';

function Board({currentBoard, onSquareSelected}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareSelected(i)}>
        {currentBoard[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function MoveMarker({move, isCurrentMove, onMoveSelected}) {
  let buttonText = `Go to ${
    move === 0 ? 'game start' : `move #${move.toString()}`
  }`;
  if (isCurrentMove) {
    buttonText += ' (current)';
  }
  return (
    <button disabled={isCurrentMove} onClick={() => onMoveSelected(move)}>
      {buttonText}
    </button>
  );
}

function Game() {
  const [gameHistory, setGameHistory] = useLocalStorageState(
    'tic-tac-toe-squares',
    [Array(9).fill(null)],
  );

  const [currentMove, setCurrentMove] = useLocalStorageState(
    'tic-tac-toe-move',
    0,
  );

  const currentBoard = gameHistory[currentMove];
  const nextValue = calculateNextValue(currentBoard);
  const winner = calculateWinner(currentBoard);
  const status = calculateStatus(winner, currentBoard, nextValue);

  function selectSquare(square) {
    if (winner || currentBoard[square]) {
      return;
    }
    const currentBoardCopy = [...currentBoard];
    currentBoardCopy[square] = nextValue;

    setGameHistory([
      ...gameHistory.slice(0, currentMove + 1),
      currentBoardCopy,
    ]);
    setCurrentMove(currentMove + 1);
  }

  function restart() {
    setGameHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onSquareSelected={selectSquare} currentBoard={currentBoard} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ul>
          {Array(gameHistory.length)
            .fill(null)
            .map((_, idx) => (
              <div key={`move-list-${idx}`}>
                <MoveMarker
                  move={idx}
                  isCurrentMove={idx === currentMove}
                  onMoveSelected={setCurrentMove}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
