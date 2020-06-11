import React from "react";
import "../styles.css";

class SwapIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {

    }

    render() {
        return (
            <button type="button" className="md:hidden absolute inset-y-0 right-0 mt-2 mr-3 w-8 h-8">
                <svg className="stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
            </button>
        );
    }
}

export default SwapIcon;