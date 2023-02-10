import React, {useContext} from 'react'
import GameContext from '../context/GameContext.jsx'

const Square = ({position}) => {
  const { playerTurn, gridValues, playerClick, setColour} = useContext(GameContext)
  let value = gridValues[position]
  return (
    <div 
      className="square" 
      onClick={() => playerClick(playerTurn, position)}
      style={setColour(gridValues[position])}
    >
      <span 
        className={value === "X" ? "stampx" : value === "O" ? "stampo" : ""}
      >
    {value}</span></div >
  )
}

export default Square