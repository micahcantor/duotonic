/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import SwapIcon from "./swap.jsx";
import { sendChat, setUsernameInDB, getUsernameFromDB } from "../api.js";
import "../styles/styles.css";
const Filter = require('bad-words');

const Chat = ({ room, client, onSwapClick, queueVisible, authorized}) => {

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [usernameVal, setUsernameVal] = useState("");
  const messagesBottom = useRef(null);
  const [inputVal, setInputVal] = useState("");
  const [showUsernameEntry, setShowUsernameEntry] = useState(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        if (update.type === 'chat') {
          setMessages(messages => [...messages, update.updated]);
        }
      });
    }
  }, [client, room])

  useEffect(() => {
    if (messagesBottom.current) {
      messagesBottom.current.scrollIntoView(false); // scrolls to bottom of DOM element
    }
  }, [messages, messagesBottom])

  const handleInputChange = (value) => {
    setInputVal(value);
  }

  const handleInputSubmit = (e) => {

    e.preventDefault();
    const message = {
      username: username,
      text: inputVal,
      time: getFormattedTime(),
    }
    console.log(inputVal)
    if (inputVal.length > 0) {
      setMessages([...messages, message]);
    }

    if (room) {
      sendChat(message, room);
    }

    setInputVal("");
    document.getElementById("chat-input").value = "";
  }

  const handleUsernameChange = (value) => {
    setUsernameVal(value);
  }

  const handleUsernameSubmit = (e) => {
    e.preventDefault();

    const filter = new Filter();

    if (filter.isProfane(usernameVal)) {
      setErrorMessage("Hey! Be nice.");
      setErrorVisible(true);
    }
    else {
      setShowUsernameEntry(false);
      setUsername(usernameVal);
      setUsernameInDB(usernameVal);
      setErrorVisible(false);
    }
  }

  const handleUsernameDisplayClick = () => {
    setShowUsernameEntry(true);
  }

  const getFormattedTime = () => {
    const date = new Date();
    const timeSent = date.toLocaleTimeString().split(" ");
    const timeFormatted = timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];
    return timeFormatted;
  }
  
  return (
    <div id="chat" className={`${queueVisible ? "hidden" : "flex"} md:flex flex-col bg-bgDark rounded shadow-lg w-full h-full`}>
      <div id="title" className="flex items-center justify-between relative border-b-2 border-text">
        <span className="text-lg uppercase tracking-wider font-mono p-3"> Chat </span>
        <SwapIcon onClick={onSwapClick} />
      </div>
      <div id="messages" className="flex-grow w-full h-full overflow-y-auto scrollbar">
        <MessageList messages={messages} messagesBottom={messagesBottom}/>
      </div>
      { username.length === 0 || username === "DEFAULT_USERNAME"
        ? null
        : <ChatStatus username={username} onClick={handleUsernameDisplayClick}/>
      }
      <div id="input">
        {showUsernameEntry || username.length === 0 || username === "DEFAULT_USERNAME" // the not looks weird but this ensures the chat is rendered by default
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
    <form autoComplete="off" onSubmit={handleSubmit} className="px-4 mb-3 mx-auto">
      <div className="relative w-full">
        <input id="chat-input" type="text" onChange={handleChange} placeholder="Send a message"
          className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-text appearance-none border-2 
          border-transparent rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-gray-200 focus:border-primary"      
        />
        <SendButton />
      </div>
    </form>
  ); 
}

const SendButton = () => {

  return (
    <button type="button" className="absolute right-0 text-black mt-1">
      <svg className="fill-current mr-2 hover:text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  );
};

const MessageList = ({ messages, messagesBottom }) => {
  const listItems = messages.map((m, idx) => {
    return (
      <li key={idx}>
        <Message user={m.username} messageString={m.text} time={m.time} />
        <div ref={messagesBottom}></div>
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
        <span className="ml-1 text-sm text-textColor"> {time} </span>
      </div>
      <p className="font-sans"> {messageString} </p>
    </div>
  );
};

const ChatStatus = ({ username, onClick }) => {
  return (
    <div className="flex self-end mt-1 mr-4 p-2 bg-bgColor rounded border-2 border-transparent 
      focus:border-primary hover:border-primary items-center space-x-1">
      <button onClick={onClick}>
        <span className="font-semibold"> {username} </span>
      </button>
    </div>
  )
}

const UsernameEntry = ( { onSubmit, onChange }) => {

  const handleChange = (e) => {
    onChange(e.target.value);
  }

  const handleSubmit = (e) => {
    onSubmit(e);
  }

  return (
    <div className="h-full flex items-center justify-center space-x-2 px-4 py-2 border-t-2 border-text">
        <p className="inline text-lg md:text-xl font-semibold">Enter a username: </p>
        <form autoComplete="off" onSubmit={handleSubmit} className="flex-grow">
          <input id="chat-input" type="text" onChange={handleChange}
              className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-text appearance-none 
              border-2 border-transparent rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-gray-200 focus:border-primary"      
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
