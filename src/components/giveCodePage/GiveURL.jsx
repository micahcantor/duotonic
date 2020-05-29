import React from 'react';
import '../../styles.css';

class GiveUrl extends React.Component {
    constructor(props) {
        super(props);
    }

    onCopyClick() {
        console.log('copied')
    }

    render() {
        return (
            <div className="flex flex-col items-center font-sans font-bold text-6xl">
                <p className="mt-8 "> Share this link with a friend: </p>
                
                <div className="text-customgreen flex items-center">
                    <p className="text-customgreen mr-4"> link.url/link {this.props.shareUrl} </p>
                    <button onClick={this.onCopyClick} type="button"> 
                        <svg className="mt-1 w-10 h-10 text-white hover:text-customgreen stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                    </button>
                    
                </div>
                
                <p className="text-6xl"> Or find a random listener: </p>
            </div>
        )
    }
    
    
}

export default GiveUrl;