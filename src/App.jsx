import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const attemptToLogInWithToken = async() => {
      const localStorageToken = localStorage.getItem('token');

      if(localStorageToken) {
        const { data } = await axios.get('/api/v1/login', {
          headers: {
            authorization: localStorageToken
          }
        })
        setAuth(data);
      }
    }
    attemptToLogInWithToken();
  }, [token])

  const logIn = async(event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/api/v1/login', {
        username: usernameInput,
        password: passwordInput
      });
      
      localStorage.setItem('token', data);
      setToken(data);
      setUsernameInput('');
      setPasswordInput('');
      setError('');
    } catch(err) {
      setError('Bad credentials');
    }
  }

  return (
    <>
      { 
        token ?
        <>
          <h1>Welcome {auth.username}</h1>

          <button onClick={() => {
            localStorage.removeItem('token');
            setToken('');
          }}>Log Out</button>
        </> :
        <>
          { error }
          <form onSubmit={logIn}>
            <input 
              placeholder="username" 
              value={usernameInput} 
              onChange={((event) => setUsernameInput(event.target.value))} 
            />

            <input 
              placeholder="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
            />

            <button type="submit">Log in</button>
          </form>
        </>
      }
      
    </>
  )
}

export default App
