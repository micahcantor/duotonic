/* eslint-disable react/prop-types */
import React from "react";
import SwapIcon from "./swap.jsx";
import "../styles.css";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { value: "", messages: [] };
    this.username = "Anonymous";
    this.wsURL = "ws://localhost:3030";
    this.ws = new WebSocket(this.wsURL);
    this.messageList = null;
  }

  componentDidMount() {
    this.messageList = document.getElementById("messageList");
    this.scrollToBottom(); // scroll to bottom of messages

    this.ws.onopen = () => {
      console.log("connected");
    };
    this.ws.onmessage = (e) => {
      console.log("message received");
      const message = JSON.parse(e.data);
      this.addMessage(message);
    };
    this.ws.onclose = () => {
      console.log("disconnected");

      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      });
    };
  }

  componentDidUpdate() {
    this.scrollToBottom(); // scroll to bottom of messages when a new message is added
  }

  handleChange(value) {
    this.setState({ value: value }); // updates the input box
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.value != "") {
      // prevent empty messages
      const date = new Date();
      const timeSent = date.toLocaleTimeString().split(" ");
      const timeFormatted =
        timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];
      const message = {
        user: this.username,
        messageString: this.state.value,
        time: timeFormatted,
      };

      this.ws.send(JSON.stringify(message));
      console.log("message sent to server");

      this.addMessage(message);

      document.getElementById("chat-input").value = "";
      this.setState({ value: "" })
    }
  }

  addMessage(message) {
    /* Utility function that updates the local state of messages */
    this.setState((state) => {
      state.messages.push(message);
      return { messages: state.messages };
    });
  }

  scrollToBottom() {
    /* Utility function that scrolls to the bottom of the message list */
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  render() {
    return (
      <div id="chat" className="relative hidden md:block bg-gray-800 w-full h-full rounded shadow-lg">
        <div className="flex border-b-2 border-gray-500">
          <p className="text-lg uppercase tracking-wider font-mono p-3">
            Chat
          </p>
          <SwapIcon chatActive={true} />
        </div>
        <div id="messageList" className="absolute overflow-y-auto w-full scrollbar" style={{ height: "75%" }}>
          <MessageList messages={this.state.messages} />
        </div>
        <ChatInput onChange={this.handleChange} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

const ChatInput = (props) => {

  const handleChange = (e) => {
    props.onChange(e.target.value);
  }

  const handleSubmit = (e) => {
    props.onSubmit(e);
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

const MessageList = (props) => {
  const messages = props.messages;

  var listItems = messages.map((m, idx) => {
    return (
      <li key={idx}>
        <Message user={m.user} messageString={m.messageString} time={m.time} />
      </li>
    );
  })
  
  return <ul className="mt-2">{listItems}</ul>;
};

const Message = (props) => {
  return (
    <div className="flex flex-col mx-1 p-2 rounded hover:bg-gray-900">
      <div className="flex items-center">
        <span className="font-bold"> {props.user}</span>
        <span className="ml-1 text-sm text-gray-400"> {props.time} </span>
      </div>
      <p className="font-sans"> {props.messageString} </p>
    </div>
  );
};

export default Chat;
