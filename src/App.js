import React, { useEffect, useRef, useState } from 'react';
import Digit from './components/Digit';
import Controls from './components/Controls';

import titleImg from './assets/title_tomatoro.png';
import tomatoFixed from './assets/tomato_fixed.png';
import tomatoRotating from './assets/tomato_rotating.png';
import colonImg from './assets/colon.png';

import btnPomodoro from './assets/btn_pomodoro.png';
import btnShort from './assets/btn_shortbreak.png';
import btnLong from './assets/btn_longbreak.png';

import tickSfx from './assets/tick.mp3';
import ringSfx from './assets/ring.mp3';

import d0 from './assets/digits/0.png';
import d1 from './assets/digits/1.png';
import d2 from './assets/digits/2.png';
import d3 from './assets/digits/3.png';
import d4 from './assets/digits/4.png';
import d5 from './assets/digits/5.png';
import d6 from './assets/digits/6.png';
import d7 from './assets/digits/7.png';
import d8 from './assets/digits/8.png';
import d9 from './assets/digits/9.png';

import btnPause from './assets/btn_pause.png';
import btnUnpause from './assets/btn_unpause.png';

const digitsArray = [d0,d1,d2,d3,d4,d5,d6,d7,d8,d9];

const MODES = {
  POMODORO: { label: 'Pomodoro 25mins', seconds: 25 * 60, asset: btnPomodoro },
  SHORT: { label: 'Short Break 5mins', seconds: 5 * 60, asset: btnShort },
  LONG: { label: 'Long Break 15mins', seconds: 15 * 60, asset: btnLong },
};

export default function App(){
  const [mode, setMode] = useState('POMODORO');
  const [totalSeconds, setTotalSeconds] = useState(MODES.POMODORO.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const tickRef = useRef(null);
  const ringRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(()=>{
    tickRef.current = new Audio(tickSfx);
    ringRef.current = new Audio(ringSfx);
    if(tickRef.current) tickRef.current.volume = 0.6;
    if(ringRef.current) ringRef.current.volume = 0.9;
  },[]);

  useEffect(()=>{
    clearInterval(intervalRef.current);

    if(isRunning){
      intervalRef.current = setInterval(()=>{
        setTotalSeconds(prev => {
          if(prev <= 1){
            if(ringRef.current) ringRef.current.play().catch(()=>{});
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(false);
            setAngle(a => a + 5);
            return 0;
          }

          if(!isPaused){
            if(tickRef.current){
              try{
                tickRef.current.pause();
                tickRef.current.currentTime = 0;
                tickRef.current.play();
              }catch(e){ }
            }
            setAngle(a => a + 5);
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const mmTens = Math.floor(minutes / 10);
  const mmOnes = minutes % 10;
  const ssTens = Math.floor(seconds / 10);
  const ssOnes = seconds % 10;

  function handleSelectMode(key){
    setMode(key);
    const seconds = MODES[key].seconds;
    setTotalSeconds(seconds);
    setIsRunning(false);
    setIsPaused(false);
    setAngle(0);
  }
  function handleStart(){
    if(totalSeconds <= 0) return;
    setIsRunning(true);
    setIsPaused(false);
  }
  function handlePause(){
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);

    if(nextPaused){
      if(tickRef.current){
        try{ tickRef.current.pause(); tickRef.current.currentTime = 0; }catch(e){}
      }
    } else {
      if(!isRunning && totalSeconds > 0){ setIsRunning(true); }
    }
  }
  function handleReset(){
    const seconds = MODES[mode].seconds;
    setTotalSeconds(seconds);
    setIsRunning(false);
    setIsPaused(false);
    setAngle(0);
    if(tickRef.current){ try{ tickRef.current.pause(); tickRef.current.currentTime = 0; }catch(e){} }
    if(ringRef.current){ try{ ringRef.current.pause(); ringRef.current.currentTime = 0; }catch(e){} }
  }

  return (
    <div className="app">
      <div className="left-column">
        {Object.keys(MODES).map(key => (
          <button
            key={key}
            className={`preset-btn ${mode===key? 'mode-active':''}`}
            onClick={()=>handleSelectMode(key)}
            title={MODES[key].label}
          >
            <img src={MODES[key].asset} alt={MODES[key].label} style={{width:'100%',height:'100%'}}/>
          </button>
        ))}
      </div>

      <div className="center-column">
        <div className="header-title">
          <img src={titleImg} alt="Tomatoro" />
        </div>

        <div className="tomato-stage">
          <img src={tomatoFixed} alt="tomato base" className="tomato-fixed"/>

          <img src={tomatoRotating} alt="tomato rotating" className="tomato-rotating" style={{transform: `translate(-50%,-50%) rotate(${angle}deg)`}}
          />

          <div className="digit-display" aria-hidden={false}>
            <Digit digitIndex={mmTens} digits={digitsArray}/>
            <Digit digitIndex={mmOnes} digits={digitsArray}/>

            <img src={colonImg} alt=":" className="colon-img" />

            <Digit digitIndex={ssTens} digits={digitsArray}/>
            <Digit digitIndex={ssOnes} digits={digitsArray}/>
          </div>
        </div>

        <Controls onStart={handleStart} onPause={handlePause} onReset={handleReset} isRunning={isRunning} isPaused={isPaused} />

      </div>
    </div>
  );
}
