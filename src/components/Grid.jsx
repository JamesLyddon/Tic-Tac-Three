import React, {useContext} from 'react'
import Square from './Square.jsx'
import GameContext from '../context/GameContext.jsx'

const Grid = () => {
  const {blankGrid} = useContext(GameContext) 

  return (
    <div className="game-grid">
      {blankGrid.map((val, index) => {
        return <Square key={index} position={index}></Square>
      })}
    </div>
  )
}

export default Grid
