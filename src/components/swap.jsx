import React from "react";
import "../styles.css";

class SwapIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'chatActive': props.chatActive};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const chat = document.getElementById("chat");
        const queue = document.getElementById("queue");
        if (this.state.chatActive) {
            chat.className = "hidden md:block relative hidden bg-gray-800 w-full h-full rounded shadow-lg"
            queue.className = "relative h-full w-full md:w-2/5 md:block md:mr-4 bg-gray-800 rounded shadow-lg"
            this.setState({chatActive: false});
        }
        else {
            chat.className = "md:block relative bg-gray-800 w-full h-full rounded shadow-lg"
            queue.className = "hidden relative h-full w-full md:w-2/5 md:block md:mr-4 bg-gray-800 rounded shadow-lg"
            this.setState({chatActive: true});
        }
    }

    render() {
        return (
            <button onClick={this.handleClick} type="button" className="md:hidden absolute inset-y-0 right-0 mt-2 mr-3 w-8 h-8">
                <svg className="stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            </button>
        );
    }
}

export default SwapIcon;