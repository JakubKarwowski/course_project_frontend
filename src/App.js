import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AdminPage from './components/AdminPage';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import MyCollections from './components/MyCollections';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/login" element={<LoginPage/>}/>
          <Route exact path="/register" element={<RegisterPage/>}/>
          <Route exact path="/mycollections" element={<MyCollections/>}/>
          <Route exact path="/adminpage" element={<AdminPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
