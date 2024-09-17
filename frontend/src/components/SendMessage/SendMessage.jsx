import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom'
import suggestionsArray from '../../Data/RandomSuggestions';

const MessageBoard = () => {
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('Write your anonymous message here');
  const [suggestions, setsuggestions] = useState([])
  const userId = useParams().id
  const [showNotify, setshowNotify] = useState(false)
  const [NotificationMessage, setNotificatioMessage] = useState('')
  const navigate = useNavigate()

  function generateRandomMessages(){
    let temp = []
    for(let i=0; i<3; i++){
        let val = Math.floor(Math.random()*30)
        temp.push(suggestionsArray[val])
    }
    setsuggestions(temp)
  }

  useEffect(generateRandomMessages, [])

  function HandleNotifications(message) {
    setNotificatioMessage(message);
    setshowNotify(true);
    setTimeout(() => setshowNotify(false), 2000);
  }

  const messages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?"
  ];

  const handleSendMessage = () => {
    if (message || selectedMessage) {
      console.log('Message sent:', message || selectedMessage);
      let messageToSend = message || selectedMessage
      fetch(`/v1/sendmessage/${userId}`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({message:messageToSend}),
        credentials:'include'
      }).then((response)=>response.json())
      .then((response)=>{
        if(response.status == 200){
            HandleNotifications('Message Sent SucessFully')
        }
        else{
            HandleNotifications(response.message)
        }
      })
      setMessage('');
      setSelectedMessage('');
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
  };

  return (
    <div>
                {
            showNotify &&
          <div role="alert" className="alert text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{NotificationMessage}</span>
          </div>
          }
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Public Profile Link</h2>

        <div className="mb-6">
          <label className="block text-lg mb-2" htmlFor="anonymous-message">
            Send Anonymous Message to {userId}
          </label>
          <textarea
            id="anonymous-message"
            className="textarea textarea-bordered w-full"
            placeholder={selectedMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="btn btn-primary mt-4 w-full"
            onClick={handleSendMessage}
          >
            Send It
          </button>
        </div>

        <div className="mb-6">
          <button className="btn btn-outline btn-secondary w-full" onClick={generateRandomMessages}>Suggest Messages</button>
        </div>

        <div className="mb-4">
          <p>Click on any message below to select it.</p>
          <div className="space-y-2">
            {suggestions.map((msg, index) => (
              <button
                key={index}
                className={`btn w-full ${selectedMessage === msg ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => handleSelectMessage(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="mb-4">Get Your Message Board</p>
          <button className="btn btn-primary" onClick={()=>navigate("/")}>Create Your Account</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MessageBoard;
