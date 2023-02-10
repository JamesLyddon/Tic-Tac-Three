import './static/style/main.css';
import React, {useState} from 'react';
import Grid from './components/Grid.jsx'
import GameContext from './context/GameContext.jsx'
import { VscDebugRestart, VscDebugStart } from 'react-icons/vsc';

function App() {
  const gameColours = ['rgb(233, 116, 81)', 'rgb(15, 163, 177)']
  const blankGrid = Array(9).fill('')
  const [gridValues, setGridValues] = useState(blankGrid)
  const [gridHistory, setGridHistory] = useState([blankGrid])
  const [playerTurn, setPlayerTurn] = useState('X')
  const [winner, setWinner] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [playerScores, setPlayerScores] = useState({
    X: 0,
    O: 0
  })

  // toggle player X and O
  const togglePlayer = (currentPlayer) => {
    if (currentPlayer === 'X') {
      setPlayerTurn('O')
    } else if (currentPlayer === 'O') {
      setPlayerTurn('X')
    }
  }

  // game winner/tie logic
  const checkWinner = (gameGrid) => {
    let winningRuns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    winningRuns.forEach((run) => {
      if (
        gameGrid[run[0]] === '' ||
        gameGrid[run[1]] === '' ||
        gameGrid[run[2]] === ''
      ) {
        return
      } else if (
        gameGrid[run[0]] === gameGrid[run[1]] &&
        gameGrid[run[1]] === gameGrid[run[2]]
      ) {
        const winnerTag = gameGrid[run[0]]
        setWinner(winnerTag)
        setPlayerScores(prev => {
          const newScores = {...playerScores}
          newScores[winnerTag] += 1
          return newScores
        })
      } else if (
        gridHistory.length === 9
      ) {
        setWinner('Tie')
      }
    })
  }

  // game reset
  const resetGame = () => {
    setGridValues(blankGrid)
    setGridHistory([blankGrid])
    setPlayerTurn('X')
    setWinner(null)
    setMoveCount(0)
  }

  // handle player move
  const playerClick = (currentPlayer, position) => {
    if(gridValues[position] !== '' || winner) return
    setMoveCount(moveCount + 1)
    const newGrid = [...gridValues]
    newGrid[position] = currentPlayer
    const newHistory = gridHistory.slice(0, moveCount + 1)
    setGridValues(newGrid)
    setGridHistory([...newHistory, newGrid])
    checkWinner(newGrid)
    togglePlayer(currentPlayer)
  }

  // conditionally set colour
  const setColour = (val) => {
    return val === 'X' ? {color: gameColours[0]} : {color: gameColours[1]} 
  }

  // History Buttons
  const stepBack = () => {
    if (moveCount >= 1) {
      setMoveCount(moveCount - 1)
      setGridValues(gridHistory[moveCount - 1])
      togglePlayer(playerTurn)
    }
  }

  const stepForward = () => {
    if (moveCount < gridHistory.length - 1) {
      setMoveCount(moveCount + 1)
      setGridValues(gridHistory[moveCount + 1])
      togglePlayer(playerTurn)
    }
  }

  // Generate Game Status Message
  const selectDisplay = () => {
    if(!winner) {
      return `Next player: ${playerTurn}`
    } else if (winner === "X" || winner === "O") {
      return `Winner: ${winner}`
    } else if (winner === "Tie") {
      return `Tie`
    }
  }

  return (
    <GameContext.Provider value={{blankGrid, playerTurn, togglePlayer, gridValues, playerClick, winner, setColour}}>
      <Grid/>
      <div style={winner ? {color: 'rgb(255,204,0)'} : setColour(playerTurn)} className={winner === 'X' || winner === 'O' ? "status jump" : "status"}>
        {selectDisplay()}
      </div>
      <div className="status-buttons">
        <VscDebugStart onClick={stepBack} role="button" aria-label="go back a step" className="invert"/>
        <VscDebugRestart role="button" aria-label="restart game" onClick={resetGame} className="reset slowly-rotate"/> 
        <VscDebugStart onClick={stepForward} role="button" aria-label="go forward a step"/>

      </div>
      <div className="status-scores">
        <span>X score: {playerScores.X}</span>
        <span>O score: {playerScores.O}</span>
      </div>
    </GameContext.Provider>
  )
}
export default App
