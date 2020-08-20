/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
const Filter = require('bad-words');
const filter = new Filter();
import SwapIcon from "./swap.jsx";
import { sendChat, setUsernameInDB, getUsernameFromDB } from "../api.js";
import "../styles.css";

const Chat = ({ room, client, onSwapClick , authorized}) => {

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [usernameVal, setUsernameVal] = useState("");
  const [messagesDOM, setMessagesDOM] = useState(null);
  const [inputVal, setInputVal] = useState("");

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMessagesDOM(document.getElementById("messageList"));
  }, [])

  useEffect(() => {
    if (authorized) {
      getUsernameFromDB().then((response) => {
        setUsername(response.username);
      });
    }
  }, [authorized])

  useEffect(() => {
    if (room && client) {
      client.subscribe(`/rooms/chat/${room}`, (update) => {
        console.log(update);
        if (update.type === 'chat') {
          setMessages(messages => messages.concat(update.updated));
        }
      });
    }
  }, [client])

  useEffect(() => {
    if (messagesDOM) {
      messagesDOM.scrollTop = messagesDOM.scrollHeight; // scrolls to bottom of DOM element
    }
  }, [messages])

  const handleInputChange = (value) => {
    setInputVal(value);
  }

  const handleInputSubmit = (e) => {

    e.preventDefault();
    document.getElementById("chat-input").value = "";
    setInputVal("");

    const message = {
      username: username,
      text: inputVal,
      time: getFormattedTime(),
    }

    if (inputVal.length > 0) {
      setMessages(messages => messages.concat(message));
    }

    if (room.length > 0) {
      console.log('sending chat')
      sendChat(message, room);
    }
  }

  const handleUsernameChange = (value) => {
    setUsernameVal(value);
  }

  const handleUsernameSubmit = (e) => {
    e.preventDefault();

    if (filter.isProfane(usernameVal)) {
      setErrorMessage("Hey! Be nice.");
      setErrorVisible(true);
    }
    else {
      setUsername(usernameVal);
      setUsernameInDB(usernameVal);
      setErrorVisible(false);
    }
  }

  const getFormattedTime = () => {
    const date = new Date();
    const timeSent = date.toLocaleTimeString().split(" ");
    const timeFormatted = timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];
    return timeFormatted;
  }

  return (
    <div id="chat" className="flex flex-col bg-gray-800 rounded shadow-lg w-full h-full">
      <div id="title" className="relative flex border-b-2 border-gray-500">
        <span className="text-lg uppercase tracking-wider font-mono p-3"> Chat </span>
        <SwapIcon onClick={onSwapClick} />
      </div>
      <div id="messages" className="flex-grow w-full h-full overflow-y-auto scrollbar">
        <MessageList messages={messages} />
      </div>
      <div id="input">
        {username.length === 0 || username === "DEFAULT_USERNAME"
          ? <UsernameEntry onChange={handleUsernameChange} onSubmit={handleUsernameSubmit}/>
          : <ChatInput onChange={handleInputChange} onSubmit={handleInputSubmit}/>
        }
      </div>
      <ErrorMessage visible={errorVisible} message={errorMessage}/>
    </div>
  );
}

const ChatInput = ({ onChange, onSubmit }) => {

  const handleChange = (e) => {
    onChange(e.target.value);
  }

  const handleSubmit = (e) => {
    onSubmit(e);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className="mb-3 mx-auto" style={{width: '95%'}}>
      <div className="relative w-full">
        <input id="chat-input" type="text" onChange={handleChange} placeholder="Send a message"
          className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-white focus:border-green-400"      
        />
        <SendButton />
      </div>
    </form>
  ); 
}

const SendButton = () => {

  return (
    <button type="button" className="absolute right-0 text-black mt-1">
      <svg className="fill-current mr-2 hover:text-customgreen" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  );
};

const MessageList = ({ messages }) => {
  const listItems = messages.map((m, idx) => {
    return (
      <li key={idx}>
        <Message user={m.username} messageString={m.text} time={m.time} />
      </li>
    );
  });
  
  return <ul className="mt-2">{listItems}</ul>;
};

const Message = ({ user, time, messageString }) => {

  return (
    <div className="flex flex-col mx-1 p-2 rounded hover:bg-gray-900">
      <div className="flex items-center">
        <span className="font-bold"> {user}</span>
        <span className="ml-1 text-sm text-gray-400"> {time} </span>
      </div>
      <p className="font-sans"> {messageString} </p>
    </div>
  );
};

const UsernameEntry = ( { onSubmit, onChange }) => {

  const handleChange = (e) => {
    onChange(e.target.value);
  }

  const handleSubmit = (e) => {
    onSubmit(e);
  }

  return (
    <div className="h-full flex items-center justify-center space-x-2 px-4 py-2 border-t-2 border-gray-500">
        <p className="inline text-lg md:text-xl font-semibold">Enter a username: </p>
        <form autoComplete="off" onSubmit={handleSubmit} className="flex-grow">
          <input id="chat-input" type="text" onChange={handleChange}
              className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-gray-200 appearance-none 
              border-2 border-transparent rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-white focus:border-green-400"      
          />
        </form>
    </div>
  );
}

const ErrorMessage = ({ message, visible }) => {
  return (
    <div className={`${visible ? "flex" : "hidden"} items-center space-x-1 px-4 pb-2 text-red-500 font-semibold`}>
      <svg viewBox="0 0 20 20" className="fill-current w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default Chat;
