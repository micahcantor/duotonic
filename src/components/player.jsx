/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
import React from 'react';
import {SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle} from '@reach/slider'
import '../slider_styles.css';
import '../styles.css';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.handlePauseChange = this.handlePauseChange.bind(this);
        this.state = {isPaused: true}              // holds pause state for the entire player
    }

    handlePauseChange(isPausedParam) {
        this.setState({isPaused: !isPausedParam});  // flip paused bool state
    }

    render() { 
        const isPaused = this.state.isPaused;
        return (
            <div className="flex overflow-hidden absolute bottom-0 inset-x-0 flex-col border-t-2 border-gray-500 bg-gray-900 h-22">
                <div className="flex mx-auto mt-2 justify-between items-center" style={{ width: "95%"}}>
                    <SongInfo className="w-1/3 px-2" song={this.props.song} />
                    <PlaybackControls className="w-1/3 px-2"
                        isPaused={isPaused}        // same isPaused bool is sent to PlaybackControls and progress bar
                        onPauseChange={this.handlePauseChange} />
                    <VolumeSlider className="w-1/3 px-2" />
                    
                </div>
                <ProgressBar 
                    isPaused={isPaused}            // same state sent to PlaybackConrols
                    runtime={this.props.song.runtime} />
            </div>   
        )     
    }
}

const PlaybackControls = (props) => {
    return (
        <div className="flex justify-center -ml-2 -mr-4 text-white">
            <LeftSkip />
            <PausePlay 
                isPaused={props.isPaused} 
                onPauseChange={props.onPauseChange}/>
            <RightSkip />
        </div>
    );
};
 
class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {elapsed: 0, progressActive: false}     // elapsed: seconds of the song elapsed
    }                                                        // progressActive: is the progress bar incrementing

    advanceProgress() {
        /* starts a repeating increment function and sets progress active to true*/
        this.setState({progressActive: true});
        this.timerID = setInterval(
            () => this.setState((state) => ({elapsed: state.elapsed + .01})), // increments elapsed
            10                                                            // every 10 ms
        );
    }

    pauseProgress() {
        this.setState({progressActive: false}); 
        clearInterval(this.timerID);                                         // stops the interval when paused
    }

    render() {
        if (!this.props.isPaused && !this.state.progressActive)             // if song is playing and the progress bar is not already active
            this.advanceProgress();                                         
        else if (this.props.isPaused && this.state.progressActive)          // if the song is paused and the progress bar is active
            this.pauseProgress();

        const progress = (this.state.elapsed / this.props.runtime) * 100;   // elapsed / runtime as a percentage
        if (progress == 100) this.pauseProgress();                          // stops progress bar at 100%

        return (
            <div className="flex shadow w-full h-2 bg-grey-light">
                <div className="bg-customgreen leading-none py-1 rounded" style={{ width: progress + "%"}}> </div> 
            </div>
        );
    }
}

class PausePlay extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onPauseChange(this.props.isPaused);          // calls function passed down from Player
    }                                                           // lifts pause state to the player so it is accessible to other player components

    render() {
        const isPaused = this.props.isPaused;
        return (
            <button onClick={this.handleClick} className="rounded-full h-16 w-16 flex items-center" type="button">
                {isPaused ? <PlayIcon /> : <PauseIcon />}  
            </button>
        );      
    }
}

class VolumeSlider extends React.Component {
    /* Later on the value state of the sldier will be lifted up so it can be referenced by the audio playing component. */

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="flex items-center text-gray-500" >
                <svg className="w-4 h-4 mr-2 mt-2 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
                    <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                </svg>
                
                <SliderInput className="w-32" min={0} max={100} >
                    <SliderTrack >
                        <SliderTrackHighlight />
                        <SliderHandle className="hover:bg-customgreen hover:border-customgreen focus:bg-customgreen focus:border-customgreen"/>
                    </SliderTrack>
                </SliderInput>

                <svg className="w-4 h-4 ml-2 mt-2 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" >
                    <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>          
            </div>
        );
    }
}

const SongInfo = (props) => {
    return (
        <div className="flex items-center justify-between">
            <img className="h-16 max-w-none rounded shadow" src={props.song.coverUrl} alt="Album cover" />
            <div className="flex flex-col ml-2 font-light text-gray-500">
                <span className="text-white">{props.song.name}</span>
                <span>{props.song.artist}</span>
                <span>{props.song.album}</span>
            </div>
        </div>
    );
};

const PauseIcon = () => {
    return (
        <svg className="flex w-16 h-16 stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
            <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>                
        </svg>
    )
}

const PlayIcon = () => {
    return (
        <svg className="flex w-16 h-16 stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    )
}

const RightSkip = () => {
    return (
        <button className="" type="button">
            <svg className="w-12 h-12 stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"> </path>
            </svg>
        </button>
    );
};

const LeftSkip = () => {
    return (
        <button className="" type="button">
            <svg className="w-12 h-12 stroke-current hover:text-customgreen" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7"></path>
            </svg>
        </button>
    );
};

const DisconnectButton = () => {
    return (
        <div className="flex w-1/5 mr-2 text-white justify-end">
            <button type="button" className="bg-transparent font-semibold lowercase hover:text-customgreen py-2 px-4 rounded">
                Disconnect
            </button>
        </div>
    );
};

export default Player;
