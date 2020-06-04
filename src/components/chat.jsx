/* eslint-disable react/prop-types */
import React from 'react';
import '../styles.css';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {value: '', messages: []};
        this.user = 'Anonymous';
        this.wsURL = 'ws://localhost:3030';
        this.ws = new WebSocket(this.wsURL);
    }

    componentDidMount() {
        this.scrollToBottom();  // scroll to bottom of messages

        this.ws.onopen = () => {
            console.log('connected');
        }
        this.ws.onmessage = (e) => {
            console.log('message received');
            const message = JSON.parse(e.data);
            this.addMessage(message);
        }
        this.ws.onclose = () => {
            console.log('disconnected');

            // automatically try to reconnect on connection loss
            this.setState({
              ws: new WebSocket(URL),
            });
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();  // scroll to bottom of messages when a new message is added
    }

    handleChange(value) {
        this.setState({value: value}); // updates the input box
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.value != "") { // prevent empty messages   
            const date = new Date();
            const timeSent = date.toLocaleTimeString().split(" ");
            const timeFormatted = timeSent[0].substring(0, timeSent[0].length - 3) + " " + timeSent[1];       
            const message = {user: this.user, messageString: this.state.value, time: timeFormatted};

            this.ws.send(JSON.stringify(message));
            console.log('message sent to server');

            this.addMessage(message);
        }
    }

    addMessage(message) {
        /* Utility function that updates the local state of messages */
        this.setState((state) => {
            state.messages.push(message);
            return {messages: state.messages};
        });
    }

    scrollToBottom() {
        /* Utility function that scrolls to dummy div at the bottom of the message list */
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        return (
            <div className="relative bg-gray-800 w-3/4 md:2/3 rounded shadow-lg">
                <p className="uppercase tracking-wider font-mono p-3 border-gray-500 border-b-2">Chat</p>
                <div className="divide-y divide-gray-600"></div>
                <div className="absolute overflow-y-auto" style={{height: "75%"}}>
                    <MessageList messages={this.state.messages} />
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
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
        this.props.onSubmit(e)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="absolute inset-x-0 bottom-0 mb-3 w-full flex justify-center items-center">
                <input 
                    type="text" 
                    onChange={this.handleChange}
                    className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded h-8 w-9/10 px-4 mr-3 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400"
                    placeholder="Send a message" 
                />
                <SendButton />
            </form>
        );
    }
}

const SendButton = () => {
    return ( 
        <button type="button">
            <svg className="fill-current hover:text-customgreen" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    )
}

const MessageList = (props) => {
    
    const messages = props.messages;
    var listItems = []

    /* this is ugly but I couldn't get map function to work, not sure why */
    var i = 0;
    for (const m of messages) {
        listItems.push(
            <li key={i}> <Message user={m.user} messageString={m.messageString} time={m.time}/></li>
        );
        i++;
    }

    return (
        <ul className="mt-2">{listItems}</ul>
    );
}

const Message = (props) => {
    return (
        <div className="flex flex-col mx-1 p-2 rounded hover:bg-gray-900">
            <div className="flex items-center">
                <span className="font-bold"> {props.user}</span>
                <span className="ml-1 text-sm text-gray-400"> {props.time} </span>
            </div>
            <span className="font-sans"> {props.messageString}</span>
        </div>
    )
}

export default Chat;