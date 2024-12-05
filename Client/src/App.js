import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import Editorpage from './component/Editorpage';
import { Routes,Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import LoginForm from './component/LoginForm';

function App() {
  return (

      <>
      <Toaster position='top-center '></Toaster>
      <Routes>
        <Route path='/' element={<LoginForm/>} ></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/editor/:roomId' element={<Editorpage/>} ></Route>
      </Routes>
      </>
  );
}

export default App;
