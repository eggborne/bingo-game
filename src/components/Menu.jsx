import React, { useState } from 'react';
import '../css/Menu.css';
import { isFullScreen } from '../scripts/util';

function Menu(props) {
  const [touchingSlider, setTouchedSlider] = useState(undefined);
  let menuClass = ' hidden';
  if (props.showing) {
    menuClass = '';
  }
  if (touchingSlider) {
    menuClass += ' obscured';
  }
  let playerCardCount = props.playerCardCount;
  let opponentCardCount = props.opponentCardCount;
  let fitWide = props.fitWide;

  const changeSelectedSpeed = (event) => {
    props.onChangeCallSpeed(event.target.value);
  }
  const changeSelectedMargin = (event) => {
    props.onChangeCardMargin(event.target.value);
  }
  const handleTouchSlider = (event) => {
    if (event.target.id === 'margin-slider') {
      console.log('setting touched...')
      setTouchedSlider(event.target.id);
      document.getElementById('game-board').classList.remove('blurred');
    }
  }
  const handleEndTouchSlider = (event) => {
    setTouchedSlider(undefined);
    document.getElementById('game-board').classList.add('blurred');
  }

  let displaySpeed = props.drawSpeed / 1000;
  let itemClass = 'menu-item';
  if (props.gameStarted || props.ballQueue.length) {
    itemClass += ' unavailable';
  }
  let currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  let displayMargin = props.cardMargin;
  return (
    <div id='menu' className={menuClass}>
      {props.menuMode === 'settings' &&
        <>
          <div className={itemClass}>
            <div>Number of Cards</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('player-cards-minus')} src={require('../assets/leftarrow.png')} />
              <div>{playerCardCount}</div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('player-cards-plus')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className={itemClass}>
            <div>Opponent Cards</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('opponent-cards-minus')} src={require('../assets/leftarrow.png')} />
              <div>{opponentCardCount}</div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('opponent-cards-plus')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
            <div>Show Opponents</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleShowOpponentCards')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.showOpponentCards ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleShowOpponentCards')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
            <div>Caller</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleVoice')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.voiceOn ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleVoice')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className={props.voiceOn ? 'menu-item' : 'menu-item unavailable'}>
            <div>Caller<br />Speed</div>
            <div className='item-label'>{displaySpeed}<span style={{ fontSize: `calc(var(--header-height) / 5)` }}><br />sec.</span></div>
            <div style={{ textAlign: 'center' }}>
              <input
                id='speed-slider'
                onChange={changeSelectedSpeed}
                type='range' min='1' max='7' step='0.5' value={displaySpeed}
              />
            </div>
          </div>
        </>
      }
      {props.menuMode === 'display' &&
        <>
          <div className='menu-item'>
            <div>Full Screen</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleFullScreen')} src={require('../assets/leftarrow.png')} />
              <div><small>{isFullScreen() ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleFullScreen')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
            <div>Card Size</div>
            <div className='item-label'><span style={{ fontSize: `calc(var(--header-height) / 5)` }}>{currentOrientation}</span></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('fit-minus')} src={require('../assets/leftarrow.png')} />
              <div>{fitWide}<br /><span style={{ fontSize: `calc(var(--header-height) / 5)` }}>wide</span></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('fit-plus')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div id='margin-control' className='menu-item'>
            <div>Card<br />Margin</div>
            <div className='item-label'><span style={{ fontSize: `calc(var(--header-height) / 5)` }}>{currentOrientation}</span></div>
            <div style={{ textAlign: 'center' }}>
              <input
                id='margin-slider'
                onPointerDown={handleTouchSlider}
                onTouchEnd={handleEndTouchSlider}
                onTouchCancel={handleEndTouchSlider}
                onChange={changeSelectedMargin}
                type='range' min='0' max='0.2' step='0.01' value={displayMargin}
              />
            </div>
          </div>
        </>
      }
      {props.menuMode === 'account' &&
        <>
          <div className='menu-item full-panel'>
            <div className='account-row'>
              <div>Username</div>
              <div>{props.user.username}</div>
            </div>
            <div className='account-row'>
              <div>Money</div>
              <div>${props.user.currency.money}</div>
            </div>
            <div className='account-row'>
              <div>Games Played</div>
              <div>{props.stats.totalGames}</div>
            </div>
            <div className='account-row'>
              <div>Total Bingos</div>
              <div>{props.stats.totalBingos}</div>
            </div>
          </div>
          <div className='menu-item full-panel'>
            <div className='button-row'>
              {props.user.loggedIn ?
                <button onPointerDown={props.onClickLogOut}  className='menu-button' id='log-out-button'>Log Out</button>
                :
                <button onPointerDown={props.onClickLogIn} className='menu-button' id='log-in-button'>Log In / Register</button>
              }
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default Menu;
