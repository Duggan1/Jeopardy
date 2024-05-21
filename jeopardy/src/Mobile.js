import React, { useState } from 'react';
import JEOPPARDLOGO from './jeoLogo.webp';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    MONEY: 'money',
    PENALTY: 'penalty'
};

function Mobile() {
    const [players, setPlayers] = useState([
        { id: 1, name: "Player 1", color: "blue", score: 0 },
        { id: 2, name: "Player 2", color: "purple", score: 0 }
    ]);
    const [playerName, setPlayerName] = useState('');
    const [playerColor, setPlayerColor] = useState('gray'); // Default player color
    const [currentBoard, setCurrentBoard] = useState(0);

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
    };

    function Player({ player }) {
        const [{ isOver }, drop] = useDrop({
            accept: [ItemTypes.MONEY, ItemTypes.PENALTY],
            drop: (item) => {
                const { amount, row, col, isPenalty } = item;
                updateScores(player.id, isPenalty ? -amount : amount, row, col, isPenalty);
            },
            collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        });

        return (
            <div
                ref={drop}
                style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white',
                    border: `10px solid ${player.color}`,
                    minWidth: '150px',
                    backgroundColor: isOver ? 'darkblue' : 'navy',
                    flex: '1 1 30%',
                    margin: '10px'
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
        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.MONEY,
            item: { amount: value.amount, row, col, isPenalty: false },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const playerID = value.slots[col];
        const backgroundColor = playerID ? players.find(p => p.id === playerID).color : 'navy';

        return (
            <div
                ref={drag}
                style={{
                    flex: '1 1 14%',
                    padding: '20px 0',
                    margin: '5px',
                    border: '1px solid #080f44',
                    color: 'gold',
                    cursor: 'pointer',
                    backgroundColor: backgroundColor || 'inherit',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                ${value.amount}
            </div>
        );
    }

    function PenaltyBox({ amount, row }) {
        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.PENALTY,
            item: { amount, row, col: -1, isPenalty: true },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        return (
            <div
                ref={drag}
                style={{
                    flex: '1 1 5%',
                    paddingTop: '15px',
                    margin: '5px',
                    borderRadius: '50%',
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: 'red',
                    color: 'white',
                    textAlign: 'center',
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                X
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ width: '100%', backgroundColor: 'black', maxWidth: '100%' }}>
                <center><img src={JEOPPARDLOGO} alt='' style={{ height: '200px', border:'2px solid blue', borderRadius:'40%', marginBottom:'5%',width:'50%' }}></img></center>

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
        </DndProvider>
    );
}

export default Mobile;
