/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import SwapIcon from "./swap.jsx";
import { sendChat } from "../api.js";
import "../styles.css";

const Chat = ({ room, client }) => {

  const [messages, setMessages] = useState([]);
  const [messagesDOM, setMessagesDOM] = useState(null);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    setMessagesDOM(document.getElementById("messageList"));
  }, [])

  useEffect(() => {
    if (room) {
      client.subscribe(`/rooms/chat/${room}`, (update) => {
        console.log(update);
        if (update.type === 'chat') {
          setMessages(messages => messages.concat(update.updated));
        }
      });
    }
  }, [room])

  useEffect(() => {
    if (messagesDOM) {
      messagesDOM.scrollTop = messagesDOM.scrollHeight; // scrolls to bottom of DOM element
    }
  }, [messages])

  const handleChange = (value) => {
    setInputVal(value)
  }

  const handleSubmit = (e) => {

    e.preventDefault();
    document.getElementById("chat-input").value = "";
    setInputVal("");

    const message = {
      username: "Anonymous",
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

  const getFormattedTime = () => {
    const date = new Date();
    const timeSent = date.toLocaleTimeString().split(" ");
    const timeFormatted = timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];
    return timeFormatted;
  }

  return (
    <div id="chat" className="relative hidden md:block bg-gray-800 w-full h-full rounded shadow-lg">
      <div className="flex border-b-2 border-gray-500">
        <p className="text-lg uppercase tracking-wider font-mono p-3">
          Chat
        </p>
        <SwapIcon chatActive={true} />
      </div>
      <div id="messageList" className="absolute overflow-y-auto w-full scrollbar" style={{ height: "75%" }}>
        <MessageList messages={messages} />
      </div>
      <ChatInput onChange={handleChange} onSubmit={handleSubmit} />
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
    <form autoComplete="off" onSubmit={handleSubmit} className="absolute inset-x-0 bottom-0 mb-3 mx-auto" style={{width: '95%'}}>
      <div className="relative w-full">
        <input id="chat-input" type="text" onChange={handleChange} placeholder="Send a message"
          className="text-black transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-white focus:border-green-400"      
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

export default Chat;
