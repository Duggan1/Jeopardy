import React from 'react';
import { NavLink } from "react-router-dom";
import JEOPPARDLOGO from './jeoLogo.webp';
import computerImage from './computer.jpg'; // Replace with the path to your computer image
import mobileImage from './mobile.jpg'; // Replace with the path to your mobile/tablet image
import bgFull from './bg-full.webp';

function HomePage() {
    return (<>
        <div style={{background:`url(${bgFull})`,backgroundSize:'100% 100%'}}>
            <div style={{ textAlign: 'center', padding: '20px'}}>
            <img src={JEOPPARDLOGO} alt="Jeopardy Logo" style={{ height: '200px', marginBottom: '20px',borderRadius:'40%' }} />
            
            <div style={{ display: 'flex',flexDirection:'row', justifyContent: 'left', marginTop: '-200px' }}>
                <div style={{ margin: '10px', textAlign: 'center',backgroundColor: 'rgba(255, 255, 255, 0.6)',padding:'2%',border:'1px solid black',borderRadius:'10%' }}>
                    <img src={computerImage} alt="Computer" style={{ width: '200px', borderRadius: '10px' }} />
                    <br />
                    <NavLink
                        exact to="/jeopardy"
                        id="jeopardy-computer"
                        className="nav-link"
                        style={{
                            display: 'inline-block',
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: 'navy',
                            color: 'white',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            border: '2px solid gold'
                        }}
                        activeStyle={{
                            background: "gold",
                            color: 'navy'
                        }}
                    >
                        Play on Computer
                    </NavLink>
                </div>
                <div style={{ margin: '10px',marginLeft: 'auto', textAlign: 'center',backgroundColor: 'rgba(255, 255, 255, 0.6)',padding:'2%',border:'1px solid black',borderRadius:'10%'  }}>
                    <img src={mobileImage} alt="Mobile/Tablet" style={{ width: '200px', borderRadius: '10px' }} />
                    <br />
                    <NavLink
                        exact to="/mobileJeopardy"
                        id="mobile"
                        className="nav-link"
                        style={{
                            display: 'inline-block',
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: 'navy',
                            color: 'white',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            border: '2px solid gold'
                        }}
                        activeStyle={{
                            background: "gold",
                            color: 'navy'
                        }}
                    >
                        Play on Mobile/Tablet
                    </NavLink>
                </div>
            </div>
            <h2 style={{paddingTop:'250px'}}>Welcome to Play-Along Jeopardy</h2>
            </div>
        </div>
        
        </>
    );
}

export default HomePage;
