import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Game from './Jeopardy';
function App() {
  return (<>
    <BrowserRouter>
    {/* <Header />  */}
    <Routes>

    <Route path="/" element={<Game/>} />
    


    {/* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
      
    </div> */}
    </Routes>
    {/* <Footer/> */}
    
  </BrowserRouter>
  </>
  );
}

export default App;
