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
    this.user = "Anonymous";
    this.wsURL = "ws://localhost:3030";
    this.ws = new WebSocket(this.wsURL);
  }

  componentDidMount() {
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
        user: this.user,
        messageString: this.state.value,
        time: timeFormatted,
      };

      this.ws.send(JSON.stringify(message));
      console.log("message sent to server");

      this.addMessage(message);
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
    /* Utility function that scrolls to dummy div at the bottom of the message list */
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <div id="chat" className="relative hidden md:block bg-gray-800 w-full h-full rounded shadow-lg">
        <div className="flex border-b-2 border-gray-500">
          <p className="uppercase tracking-wider font-mono p-3">
            Chat
          </p>
          <SwapIcon chatActive={true} />
        </div>
        <div className="absolute overflow-y-auto w-full scrollbar" style={{ height: "78%" }}>
          <MessageList messages={this.state.messages} />
          <div className="flow-left clear-both"
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
        <ChatInput onChange={this.handleChange} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  handleSubmit(e) {
    this.props.onSubmit(e);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="absolute inset-x-0 bottom-0 mb-3 w-full flex justify-center items-center">
        <input type="text" onChange={this.handleChange} placeholder="Send a message"
          className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded h-8 w-9/10 px-4 ml-2 mr-3 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400"      
        />
        <SendButton />
      </form>
    );
  }
}

const SendButton = () => {
  return (
    <button type="button">
      <svg
        className="fill-current mr-2 hover:text-customgreen"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  );
};

const MessageList = (props) => {
  const messages = props.messages;
  var listItems = [];

  listItems = messages.map((m, idx) => {
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
