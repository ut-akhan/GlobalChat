// Home.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Cookies from 'js-cookie';

function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Handle login
        const response = await axios.post('http://localhost:2000/api/v1/auth/login', { email, password });
        setUser(response.data);
        console.log('Login response:', response.data);
        // On successful login
        setUser(response.data);  
        Cookies.set('token', Cookies.get('token')); // Set the token in cookies if not already done
        localStorage.setItem('user', JSON.stringify(response.data)); // Persist user data
        navigate('/texts');
      } else {
        // Handle registration
        const response = await axios.post('http://localhost:2000/api/v1/auth/register', { name, email, password });
        console.log('Register response:', response.data);
        navigate('/texts');
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, err);
      setError(`${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={!isLogin} 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p className="mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "} 
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Home;
