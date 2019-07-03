import React, { useState, useEffect } from 'react';
import '../css/ExperienceBar.css';

function ExperienceBar(props) {
  // useEffect(() => {

  // }, [])
  return (
    <div className='chicken-exp-bar'>{props.toNextLevel}&nbsp;<span> TO NEXT LEVEL</span>
      <div className='meter-green' style={{transform: `scaleX(${props.currentExperience / props.maxLength})` }}></div>
    </div>
  );
}

export default ExperienceBar;
