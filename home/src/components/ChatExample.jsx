import React, { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export const ChatExample = () => {
  const [messages, setMessages] = useState([
    {name: "micah", text: "Hey", time: "6:04 PM" },
    {name: "sawyer", text: "Hey what's up", time: "6:04 PM" },
    {name: "sawyer", text: "what kind of music are you into", time: "6:04 PM" },
    {name: "micah", text: "oh I don't know", time: "6:05 PM" },
    {name: "micah", text: "why don't you choose first?", time: "6:05 PM" },
    {name: "sawyer", text: "sure", time: "6:05 PM" },
  ]);

  const [inputVal, setInputVal] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (inputVal.length > 0) {
      const message = {
        name: "anonymous",
        text: inputVal, 
        time: getFormattedTime()
      }
      setMessages([...messages, message]);
      setInputVal("");

      document.getElementById("chat-input").value = "";
    }
  }

  function onChange(value) {
    setInputVal(value);
  }

  function getFormattedTime() {
    const date = new Date();
    const timeSent = date.toLocaleTimeString().split(" ");
    const timeFormatted = timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];
    return timeFormatted;
  }

  return (
    <div className="rounded border-4 border-textColor h-full">
      <div id="title" className="flex items-center justify-between relative border-b-2 border-textColor">
        <span className="text-lg uppercase tracking-wider font-mono p-3"> Chat </span>
      </div>
      <div id="messages" style={{height: '400px'}}>
        <ScrollToBottom className="w-full h-full overflow-y-scroll">
          <MessageList messages={messages}/>
        </ScrollToBottom>
      </div>

      <ChatInput onChange={e => onChange(e.target.value)} onSubmit={onSubmit} />
    </div>
  );
};


const MessageList = ({ messages }) => {
  const listItems = messages.map((m, idx) => {
    return (
      <li key={idx}>
        <Message user={m.name} messageString={m.text} time={m.time} />
      </li>
    );
  });

  return <ul>{listItems}</ul>;
};

const Message = ({ user, time, messageString }) => {

  return (
    <div className="flex flex-col mx-1 p-2">
      <div className="flex items-center">
        <span className="font-bold"> {user}</span>
        <span className="pl-1 pt-1 text-xs text-textColor"> {time} </span>
      </div>
      <p className="font-sans"> {messageString} </p>
    </div>
  );
};

const ChatInput = ({ onChange, onSubmit }) => {
  return (
    <div id="input">
      <form autoComplete="off" onSubmit={onSubmit} className="px-4 mb-3 mx-auto">
          <div className="relative w-full">
              <input id="chat-input" onChange={onChange} type="text" placeholder="Send a message" className="text-black placeholder-black transition-colors duration-200 ease-in-out appearance-none border-2 border-textColor rounded h-8 w-full px-2 leading-tight focus:outline-none hover:bg-bgDark focus:border-primary" />
              <button type="button" className="absolute right-0 text-black mt-1">
                  <svg className="fill-current mr-2 hover:text-customgreen" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                  </svg>
              </button>
          </div>
      </form>
    </div>
  )
}
