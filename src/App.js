import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AdminPage from './components/AdminPage';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import MyCollections from './components/MyCollections';
import RegisterPage from './components/RegisterPage';
import Collection from './components/Collection';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/mycollections" element={<MyCollections/>}/>
          <Route path="/mycollections/:id" element={<Collection/>}/>
          <Route path="/adminpage" element={<AdminPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
