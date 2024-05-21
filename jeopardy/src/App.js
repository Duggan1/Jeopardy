import logo from './logo.svg';
import './App.css';
import { BrowserRouter , Route,Routes, Switch } from 'react-router-dom';

import Game from './Jeopardy';
import HomePage from './homePage';

function App() {
  return (<>
    <BrowserRouter>
    {/* <Header />  */}
    <Routes>

    <Route path="/jeopardy" element={<Game/>} />
    <Route path="/" element={<HomePage/>} />
    


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
