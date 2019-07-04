import React, { useState, useEffect } from 'react';
import { experienceLevels } from '../App.js';
import '../css/ExperienceBar.css';

function ExperienceBar(props) {
  // useEffect(() => {

  // }, [])
  let barWidth = props.currentExperience / experienceLevels[props.currentLevel];
  if (barWidth > 1) {
    barWidth = 1;
  }
  return (
    <div className='chicken-exp-bar'>
      <div className='meter-green' style={{ transform: `scaleX(${barWidth})` }}>&nbsp;</div>
      <div>{props.toNextLevel} TO NEXT LEVEL</div>
    </div>
  );
}

export default ExperienceBar;
