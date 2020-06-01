import React from 'react';
import '../styles.css';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {value: '', newMessage: false, messages: []};
    }

    handleChange(value) {
        this.setState({value: value})
    }

    handleSubmit(e) {
        /* TODO: Create a new message item to render with the latest message */
        e.preventDefault();
        this.setState((state) => {
            state.messages.push(this.state.value);
            return {messages: state.messages};
        })
    }

    render() {
        return (
            <div className="relative bg-gray-800 w-3/4 md:2/3 rounded shadow-lg">
                <p className="uppercase tracking-wider font-mono p-3 border-gray-500 border-b-2">Chat</p>
                <div className="divide-y divide-gray-600"></div>
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

const Message = (props) => {
    return (<span> {props.text} </span>)
}

export default Chat;