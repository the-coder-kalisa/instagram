import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Forgot from './pages/Forgot'
import Chat from './pages/Chat'
import Explore from './pages/Explore';
import {AppContext} from './context/appContext'
import {useState} from 'react'
function App() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState(null);
  const [posters, setPosters] = useState(null);
  const [messages, setMessages] = useState([]);
  return (
    <AppContext.Provider value={{user, messages, setMessages, setUser,posters, setPosters, members, setMembers}}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />}/>
      <Route path="/chat" element={<Chat />}/>
      <Route path="/explore" element={<Explore />} />
    </Routes>
    </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
