// src/Chat.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Cookies from 'js-cookie'

function Chat() {
  const {user} = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = user._id;
  const config = {
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${Cookies.get('token')}`},
  }

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not set
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/v1/texts', config); // Replace with your API endpoint

        // Debugging: Log the response data and status
        console.log('API response:', response);

        // Ensure response data is in JSON format
        if (Array.isArray(response.data.texts)) {
          setMessages(response.data.texts);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        // Debugging: Log the error response
        console.error('Error fetching messages:', error.response || error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:2000/api/v1/texts', { 
        userId: userId,
        message: newMessage,
      }, config); // Replace with your API endpoint

      console.log(response.data.text);

      if (response.data && response.data.text.message) {
        setMessages([...messages, response.data.text]);
        setNewMessage('');
      } else {
        console.error('Invalid message response:', response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error.response || error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md h-screen flex flex-col">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold flex-1"></h2>
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-2">
          {Array.isArray(messages) ? (
            messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-2 rounded-lg ${msg.createdBy === userId ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}
              >
                <p>{msg.message}</p>
                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()} from {msg.name}</span>
              </div>
            ))
          ) : (
            <p>No messages to display</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center">
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
        />
        <button 
          type="submit" 
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700"
        >
          {user.name}
        </button>
      </form>
    </div>
  );

}

export default Chat;