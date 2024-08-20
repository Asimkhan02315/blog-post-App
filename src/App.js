
import './App.css';
import Navbar from './layout/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import UserPost from './components/UserPost'
import EditPost from './components/EditPost'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/Register' element={<Register />} />
          <Route exact path='/Login' element={<Login />} />
          <Route exact path='/CreatePost' element={<CreatePost />} />
          <Route exact path='/UserPost' element={<UserPost />} />
          <Route exact path='/EditPost/:id' element={<EditPost />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}
export default App;