import React, { useState } from 'react';
import '../css/LogInScreen.css';
import { isFullScreen } from '../scripts/util';

function LogInScreen(props) {
  const [mode, setMode] = useState('logIn');
  const [enteredValues, setEnteredValues] = useState({ username: '', pass: '', repeatPass: '', remember: true });
  let logInClass = '';
  if (!props.showing) {
    logInClass += ' hidden';
  }
  if (mode === 'register') {
    logInClass += ' register'
  }
  function handleUsernameChange(event) {
    setEnteredValues({ username: event.target.value, pass: enteredValues.pass, repeatPass: enteredValues.repeatPass, remember: enteredValues.remember });
  }
  function handlePassChange(event) {
    setEnteredValues({ username: enteredValues.username, pass: event.target.value, repeatPass: enteredValues.repeatPass, remember: enteredValues.remember });
  }
  function handleRepeatPassChange(event) {
    setEnteredValues({ username: enteredValues.username, pass: enteredValues.pass, repeatPass: event.target.value, remember: enteredValues.remember });
  }
  function handleRememberChange(event) {
    // event.preventDefault();
    let remember = enteredValues.remember;
    console.log('rememeber?', remember)
    console.log('changing to rememeber?', !remember)
    setEnteredValues({ username: enteredValues.username, pass: enteredValues.pass, repeatPass: enteredValues.repeatPass, remember: !remember });
  }
  function handleLogIn(event) {
    event.preventDefault();
    props.onClickLogInButton(enteredValues.username, enteredValues.pass, enteredValues.remember)
  }
  function handleRegister(event) {
    event.preventDefault();
    if (enteredValues.pass === enteredValues.repeatPass) {
      props.onClickRegisterButton(enteredValues.username, enteredValues.pass, enteredValues.remember)
    } else {
      console.error('pasword no match');
    }
  }
  return (
    <form onSubmit={mode === 'logIn' ? handleLogIn : handleRegister} id='log-in-screen' className={logInClass}>
      {mode === 'logIn' ?
        <>
          <div id='log-in-title'>Log In</div>
          <input onChange={handleUsernameChange} type='text' placeholder='username' value={enteredValues.username} />
          <input onChange={handlePassChange} type='password' placeholder='password' value={enteredValues.pass} />
        </>
        :
        <>
          <div id='log-in-title'>Register</div>
          <input onChange={handleUsernameChange} className='register' type='text' placeholder='username (3-16 characters)' value={enteredValues.username} />
          <input onChange={handlePassChange} className='register' type='password' placeholder='password (6+ characters)' value={enteredValues.pass} />
          <input onChange={handleRepeatPassChange} className='register' type='password' placeholder='repeat password' value={enteredValues.repeatPass}  />
        </>
      }
      <div id='remember-check'>Remember me: <input onChange={handleRememberChange} type='checkbox' checked={enteredValues.remember} /></div>
      <div className='button-area'>
        <button type='submit' id='agree-button' className='modal-button'>{mode === 'logIn' ? 'Log In' : 'Register'}</button>
        <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>Cancel</button>
        </div>
      {mode === 'logIn' ?
        <div id='mode-swap'>Need to <a onClick={() => setMode('register')}>Register?</a></div>
        :
        <div id='mode-swap'>Already registered? <a onClick={() => setMode('logIn')}>Log In</a></div>
      }
    </form>
  );
}

export default LogInScreen;
