import React from 'react';

export default function Controls({ onStart, onPause, onReset, isRunning, isPaused }){
    return (
        <div className="controls">
            <button className="control-btn" onClick={onPause} title={isPaused ? 'Unpause' : 'Pause'}>
                <img src={isPaused ? require('../assets/btn_unpause.png') : require('../assets/btn_pause.png')} alt="Pause/Unpause" style={{width:'100%',height:'100%'}}/>
            </button>

            <button className="control-btn" onClick={onStart} title="Start">
                <img src={require('../assets/btn_start.png')} alt="Start" style={{width:'100%',height:'100%'}}/>
            </button>

            <button className="control-btn" onClick={onReset} title="Reset">
                <img src={require('../assets/btn_reset.png')} alt="Reset" style={{width:'100%',height:'100%'}}/>
            </button>
        </div>
    );
}