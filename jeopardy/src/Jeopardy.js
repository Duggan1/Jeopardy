import React, { useState } from 'react';
import JEOPPARDLOGO from './giphy.gif'

function Game() {
    const [players, setPlayers] = useState([
        { id: 1, name: "Player 1", color: "blue", score: 0 },
        { id: 2, name: "Player 2", color: "purple", score: 0 }
    ]);
    const [playerName, setPlayerName] = useState('');
    const [playerColor, setPlayerColor] = useState('gray'); // Default player color
    const [currentBoard, setCurrentBoard] = useState(0);
  // 0 for first round, 1 for double Jeopardy

    const boards = [
        [200, 400, 600, 800, 1000].map(amount => ({
            amount,
            slots: Array(6).fill(null)
        })),
        [400, 800, 1200, 1600, 2000].map(amount => ({
            amount,
            slots: Array(6).fill(null)
        }))
    ];
    const addPlayer = () => {
        const newPlayer = {
            id: players.length + 1,  // Simple ID assignment, might need more sophisticated method in a real app
            name: `Player ${players.length + 1}`,
            color: playerColor,
            score: 0
        };
        setPlayers([...players, newPlayer]);
        setPlayerName('');  // Reset the form input after adding
    };

    const [moneyValues, setMoneyValues] = useState(boards[currentBoard]);

    const updateScores = (playerId, amount, row, col, isPenalty = false) => {
        const boardValues = moneyValues.slice();
        if (!boardValues[row].slots[col] || isPenalty) {
            const updatedPlayers = players.map(player => {
                if (player.id === playerId) {
                    return { ...player, score: player.score + amount };
                }
                return player;
            });
            setPlayers(updatedPlayers);

            if (!isPenalty) {
                boardValues[row].slots[col] = playerId;
                setMoneyValues(boardValues);
            }
        }
    };
    const highestScore = Math.max(...players.map(player => player.score));

    const switchBoard = (boardIndex) => {
        setCurrentBoard(boardIndex);
        setMoneyValues(boards[boardIndex]);
    };

    function Player({ player }) {
        const handleDrop = (e) => {
            e.preventDefault();
            const amount = Number(e.dataTransfer.getData("amount"));
            const row = Number(e.dataTransfer.getData("row"));
            const col = Number(e.dataTransfer.getData("col"));
            const isPenalty = e.dataTransfer.getData("isPenalty") === 'true';

            updateScores(player.id, isPenalty ? -amount : amount, row, col, isPenalty);
        };

        const allowDrop = (e) => {
            e.preventDefault();
        };

        return (
            <div 
                onDrop={handleDrop} 
                onDragOver={allowDrop} 
                style={{
                    textAlign: 'center', 
                    padding: '10px', color:'white',
                    border: `10px solid ${player.color}`, // Conditional green border
                    minWidth: '150px',
                    backgroundColor: 'navy',
                    width:'30%'
                }}
            >
                <h2 style={{ 
                    // color: 'white', 
                // backgroundColor: 
                                // border:'5px solid black',
                                 color: 
                                     player.score < 0 ? 'darkred': 
                                        highestScore == 0 ? 'white':
                                        player.score === highestScore ? 'green' :
                                         'white' }}>${player.score}</h2>
                <h3 style={{ 
                                // border:'5px solid black',
                                }}>{player.name}</h3>
                
            </div>
        );
    }
    

    function MoneyValue({ value, row, col }) {
        const handleDragStart = (e, isPenalty = false) => {
            e.dataTransfer.setData("amount", value.amount.toString());
            e.dataTransfer.setData("row", row.toString());
            e.dataTransfer.setData("col", col.toString());
            e.dataTransfer.setData("isPenalty", isPenalty.toString());
        };

        const playerID = value.slots[col];
        const backgroundColor = playerID ? players.find(p => p.id === playerID).color : 'navy';

        return (
            <div 
                draggable={!playerID}
                onDragStart={(e) => handleDragStart(e, false)} 
                style={{
                    flex: 1,
                    padding: '20px 0',
                    margin: '5px',
                    border: '1px solid #080f44',
                    color: 'gold',
                    cursor: 'pointer',
                    backgroundColor: backgroundColor || 'inherit',
                    textAlign: 'center',
                    minWidth: '14.5%',
                    fontWeight: 'bold',
                    fontSize: '18px', // You can adjust the font size as needed
                    boxSizing: 'border-box', // Ensures padding and border are included in the element's total width and height
                    overflow: 'hidden', // Ensures content doesn't overflow
                    whiteSpace: 'nowrap', // Prevents text from wrapping
                    textOverflow: 'ellipsis' // Adds ellipsis (...) if text overflows
                  }}
            >
                ${value.amount}
            </div>
        );
    }

    function PenaltyBox({ amount, row }) {
        const handleDragStart = (e) => {
            e.dataTransfer.setData("amount", amount.toString());
            e.dataTransfer.setData("row", row.toString());
            e.dataTransfer.setData("col", -1); // Indicate it's a penalty
            e.dataTransfer.setData("isPenalty", "true");
        };

        return (
            <div 
                draggable
                onDragStart={handleDragStart} 
                style={{ flex: 1, paddingTop: '15px',minWidth:'5%', margin: '5px', borderRadius:'50%',border: '1px solid', cursor: 'pointer', backgroundColor: 'red', color:'white', textAlign: 'center'}}
            >
                X
            </div>
        );
    }

    return (
        <div style={{ width: '100%',backgroundColor:'black',maxWidth:'100%' }}>
            <center><img src={JEOPPARDLOGO} alt='' style={{height:'200px'}} ></img></center>
        

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px',flexWrap: 'wrap' }}>
            {players.map(player => <Player key={player.id} player={player} />)}
        </div>
        <h1 style={{ textAlign: 'center' }}>Play along Jeopardy</h1>
        {moneyValues.map((value, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', width: '95%', justifyContent: 'space-evenly'}}>
                {value.slots.map((_, colIndex) => (
                    <MoneyValue key={`${rowIndex}-${colIndex}`} value={value} row={rowIndex} col={colIndex} />
                ))}
                <PenaltyBox amount={value.amount} row={rowIndex} />
            </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={() => switchBoard(0)} style={{ marginRight: '10px', border: currentBoard == 0 ? '5px solid gold' : '5px solid white', borderRadius: '25%', padding: '2%',
                backgroundColor: 'navy', color: currentBoard == 0 ? 'gold' : 'white', textDecoration: currentBoard == 0 ? 'underline':''}}>First Round</button>
            <button onClick={() => switchBoard(1)} style={{ border: currentBoard == 1 ? '5px solid gold' : '5px solid white', borderRadius: '25%', padding: '2%',
                backgroundColor: 'navy', color: currentBoard == 1 ? 'gold' : 'white', textDecoration: currentBoard == 1 ? 'underline':'' }}>Second Round</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '200px',paddingBottom: '100px', }}>
            <center >
            <div style={{backgroundColor:'#080f44',border: '5px solid gold' ,width:'75%',paddingBottom:'0%',paddingTop:'5%' }}>
            
            
            <h4 style={{color:'white'}}>Add More Players</h4>
                <div style={{backgroundColor:'navy', borderRadius:'10%',border:'gold 2px solid',width:'75%' }}>
                <center style={{display:'flex',alignItems: 'center', justifyContent: 'center', marginRight: '10px',padding:'1%',margin:'1%' }}>
                    <h2
                    type="text"
                    value={playerName}
                    // onChange={e => setPlayerName(e.target.value)}
                    
                    style={{ marginRight: '10px',padding:'1%',margin:'1%',color:'white' }}
            >{`Player ${players.length + 1}`}</h2>
                {/* <br></br> */}
                <input
                    type="color"
                    value={playerColor}
                    onChange={e => setPlayerColor(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                </center>
                 <br></br>
                <button style={{
    backgroundColor: 'gold',
    color: 'black',
    padding: '10px 20px',
    margin: '10px',
    border: '2px solid gold',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  }}
        onClick={addPlayer}>Add Player</button>
        </div>

        <center ><img src={JEOPPARDLOGO} alt='' style={{height:'200px'}} ></img></center>
        </div>
        </center>
            </div>

       
    </div>
    );
}

export default Game;
