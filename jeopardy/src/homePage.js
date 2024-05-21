import React, { useState } from 'react';
import JEOPPARDLOGO from './giphy.gif'
import { NavLink } from "react-router-dom";

function HomePage() {
 

    return (
       <div style={{textAlign:'center'}}>
        <h2>Welcome Home </h2>

        <NavLink
                        exact to="/jeopardy"
                        id="jeopardy"
                        className=""
                        activeStyle={{
                            background: "navy",textOverflow: "clip",border:'5px solid gold'}}
                    >
                        Jeopardy!
                    </NavLink>
       </div>
       
    );



}

export default HomePage;
