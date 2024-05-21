import React, { useState } from 'react';
import JEOPPARDLOGO from './jeoLogo.webp';

function Mobile() {
    const [players, setPlayers] = useState([
        { id: 1, name: "Player 1", color: "blue", score: 0 },
        { id: 2, name: "Player 2", color: "purple", score: 0 }
    ]);
    const [playerName, setPlayerName] = useState('');
    const [playerColor, setPlayerColor] = useState('gray'); // Default player color
    const [currentBoard, setCurrentBoard] = useState(0);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedPenalty, setSelectedPenalty] = useState(null);

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
            id: players.length + 1,
            name: `Player ${players.length + 1}`,
            color: playerColor,
            score: 0
        };
        setPlayers([...players, newPlayer]);
        setPlayerName('');
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
        setSelectedValue(null); // Clear selection when switching boards
    };

    function Player({ player }) {
        const handleClick = () => {
            if (selectedValue) {
                const { amount, row, col } = selectedValue;
                updateScores(player.id, amount, row, col);
                setSelectedValue(null); // Clear selection after assigning points
            } else if (selectedPenalty) {
                const { amount, row } = selectedPenalty;
                updateScores(player.id, -amount, row, -1, true);
                setSelectedPenalty(null); // Clear selection after assigning points
            }
        };

        return (
            <div
                onClick={handleClick}
                style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white',
                    border: `10px solid ${player.color}`,
                    maxWidth: '30%',
                    backgroundColor: 'navy',
                    flex: '1 1 30%',
                    margin: '10px',
                    cursor: 'pointer'
                }}
            >
                <h2 style={{
                    color: player.score < 0 ? 'darkred' : player.score === highestScore ? 'green' : 'white'
                }}>
                    ${player.score}
                </h2>
                <h3>{player.name}</h3>
            </div>
        );
    }

    function MoneyValue({ value, row, col }) {
        const handleClick = () => {
            if (!value.slots[col]) {
                setSelectedValue({ amount: value.amount, row, col });
                setSelectedPenalty(null); // Clear penalty selection
            }
        };

        const isSelected = selectedValue && selectedValue.row === row && selectedValue.col === col;
        const playerID = value.slots[col];
        const backgroundColor = playerID ? players.find(p => p.id === playerID).color : 'navy';

        return (
            <div
                onClick={handleClick}
                className='player-text'
                style={{
                    flex: '1 1 14%',
                    padding: '20px 0',
                    margin: '5px',
                    border: isSelected ? '2px solid yellow' : '1px solid #080f44',
                    color: 'gold',
                    cursor: 'pointer',
                    backgroundColor: backgroundColor || 'inherit',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    // fontSize: '18px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: '',
                    opacity: playerID ? 0.5 : 1,
                }}
            >
                ${value.amount}
            </div>
        );
    }

    function PenaltyBox({ amount, row }) {
        const handleClick = () => {
            setSelectedPenalty({ amount, row });
            setSelectedValue(null); // Clear money value selection
        };

        const isSelected = selectedPenalty && selectedPenalty.amount === amount && selectedPenalty.row === row;

        return (
            <div
                onClick={handleClick}
                style={{
                    flex: 1,
                    paddingTop: '15px',
                    minWidth: '5%',
                    margin: '5px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid yellow' : '1px solid',
                    cursor: 'pointer',
                    backgroundColor: 'red',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                X
            </div>
        );
    }

    return (
        <div style={{ width: '100%', backgroundColor: 'black', maxWidth: '100%' }}>
            <center><img src={JEOPPARDLOGO} alt='' style={{ height: '200px', border: '2px solid blue', borderRadius: '40%', marginBottom: '5%', width: '50%' }}></img></center>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', flexWrap: 'wrap' }}>
                {players.map(player => <Player key={player.id} player={player} />)}
            </div>
            <h1 style={{ textAlign: 'center' }}>Play along Jeopardy</h1>
            {moneyValues.map((value, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', width: '95%', justifyContent: 'space-evenly' }}>
                    {value.slots.map((_, colIndex) => (
                        <MoneyValue key={`${rowIndex}-${colIndex}`} value={value} row={rowIndex} col={colIndex} />
                    ))}
                    <PenaltyBox amount={value.amount} row={rowIndex} />
                </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={() => switchBoard(0)} style={{
                    marginRight: '10px', border: currentBoard === 0 ? '5px solid gold' : '5px solid white', borderRadius: '25%', padding: '2%',
                    backgroundColor: 'navy', color: currentBoard === 0 ? 'gold' : 'white', textDecoration: currentBoard === 0 ? 'underline' : ''
                }}>First Round</button>
                <button onClick={() => switchBoard(1)} style={{
                    border: currentBoard === 1 ? '5px solid gold' : '5px solid white', borderRadius: '25%', padding: '2%',
                    backgroundColor: 'navy', color: currentBoard === 1 ? 'gold' : 'white', textDecoration: currentBoard === 1 ? 'underline' : ''
                }}>Second Round</button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '200px', paddingBottom: '100px' }}>
                <center >
                    <div style={{ backgroundColor: '#080f44', border: '5px solid gold', width: '75%', paddingBottom: '0%', paddingTop: '5%' }}>
                        <h4 style={{ color: 'white' }}>Add More Players</h4>
                        <div style={{
                            backgroundColor: 'navy', borderRadius: '10%',
                            border: `${playerColor} solid 4px`,
                            width: '75%'
                        }}>
                            <center style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', padding: '1%', margin: '1%' }}>
                                <h2
                                    type="text"
                                    value={playerName}
                                    // onChange={e => setPlayerName(e.target.value)}
                                    style={{ marginRight: '10px', padding: '1%', margin: '1%', color: 'white' }}
                                >{`Player ${players.length + 1}`}</h2>
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

                        <center><img src={JEOPPARDLOGO} alt='' style={{ height: '200px' }}></img></center>
                    </div>
                </center>
            </div>
        </div>
    );
}

export default Mobile;
