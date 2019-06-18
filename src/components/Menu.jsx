import React, { useState } from 'react';
import '../css/Menu.css';
import { chipImages } from '../App.js';

function Menu(props) {
  console.orange('Menu ------------------');
  console.info(props);
  const [touchingSlider, setTouchedSlider] = useState(undefined);

  // let menuClass = ' hidden';
  let menuClass = 'hidden';
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
  if (props.gameStarted || props.gameInProgress) {
    itemClass += ' unavailable';
  }
  let currentOrientation = window.innerWidth > window.innerHeight ? 'land' : 'port';
  let orientationLock = props.orientationLock ? `${props.orientationLock.substr(0, 4)}` : 'none';
  let displayMargin = props.cardMargin;
  return (
    <div id='menu' className={menuClass}>
      {props.menuMode === 'settings' &&
        <>
          <div className='menu-item'>
            <div>Auto Mark Free Space</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleAutoFreeSpace')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.autoFreeSpace ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleAutoFreeSpace')} src={require('../assets/rightarrow.png')} />
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
            <div>Sound Effects</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleSound')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.soundOn ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleSound')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
        </>
      }
      {props.menuMode === 'caller' &&
        <>
          <div className='menu-item'>
            <div>Caller Voice</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleVoice')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.voiceOn ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleVoice')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
            <div>Fancy Calls</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleFancyCalls')} src={require('../assets/leftarrow.png')} />
              <div><small>{props.fancyCalls ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleFancyCalls')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div id='margin-control' className='menu-item'>
            <div>Caller<br />Volume</div>
            <div className='item-label'></div>
            <div style={{ textAlign: 'center' }}>
              <input
                id='margin-slider'
                // onPointerDown={handleTouchSlider}
                // onTouchEnd={handleEndTouchSlider}
                // onTouchCancel={handleEndTouchSlider}
                // onChange={changeSelectedMargin}
                type='range' min='0' max='0.2' step='0.01' value={8}
              />
            </div>
          </div>
          <div className='menu-item'>
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
              <div><small>{props.isFullScreen ? 'ON' : 'OFF'}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('toggleFullScreen')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
          <div style={{minWidth: '100%', fontSize: '90%'}}>Lock Full Screen Orientation</div>
            <div></div>
            <div style={{alignSelf: 'flex-end'}} className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('lock-minus')} src={require('../assets/leftarrow.png')} />
              <div><small>{orientationLock}</small></div>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('lock-plus')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
          <div className='menu-item'>
            <div>Card Size</div>
            <div className='item-label'><small>{currentOrientation}</small></div>
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
              <header>{props.user.username}'s Statistics</header>
            </div>
            <div className='account-row'>
              <div>Money</div>
              <div>${props.user.currency.cash}</div>
            </div>
            <div className='account-row'>
              <div>Chickens</div>
              <div>{props.chickenCount}</div>
            </div>
            <div className='account-row'>
              <div>Games Played</div>
              <div>{props.stats.totalGames}</div>
            </div>
            <div className='account-row'>
              <div>Total Bingos</div>
              <div>{props.stats.totalBingos}</div>
            </div>
            <div className='account-row'>
              <div>Bees Killed</div>
              <div>{props.stats.beesKilled}</div>
            </div>
            {/* <div className='account-row'>
              <div>Win Rate</div>
              <div>{winRate}</div>
            </div> */}
            <div className='account-row'>
              <div>Card Slots</div>
              <div>{props.cardSlots.length}</div>
            </div>
            <div className='account-row'>
              <div>Item Slots</div>
              <div>{props.itemSlots.length}</div>
            </div>
            <div className='account-row'>
              <div>Chicken Slots</div>
              <div>{props.chickenCount}</div>
            </div>
            <div className='account-row'>
              <div>Bonus Chance</div>
            <div style={{fontSize: '120%'}}>{props.user.bonusChance}%</div>
            </div>
          </div>
          <div className='menu-item full-panel'>
            <div className='button-row'>
              {props.user.loggedIn ?
                <button onClick={props.onClickLogOut} className='menu-button' id='log-out-button'>Log Out</button>
                :
                <button onClick={props.onClickLogIn} className='menu-button' id='log-in-button'>Log In / Register</button>
              }
            </div>
          </div>
        </>
      }
      {props.menuMode === 'cards' &&
        <>
          <div className={itemClass}>
            <div>Player Cards</div>
            <div className='item-label'><small>Slots:</small> {props.user.itemSlots.length}</div>
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
          <div className={'menu-item'}>
            <div>Marker</div>
            <div className='item-label'></div>
            <div className='number-toggle'>
              <img alt='' onPointerDown={() => props.onClickMenuArrow('marker-minus')} src={require('../assets/leftarrow.png')} />
              <img alt='' className='arrow-image' src={chipImages[props.chipImage]} />
              <img alt='' onPointerDown={() => props.onClickMenuArrow('marker-plus')} src={require('../assets/rightarrow.png')} />
            </div>
          </div>
        </>
      }
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing === nextProps.showing &&
    prevProps.menuMode === nextProps.menuMode &&
    prevProps.showOpponentCards === nextProps.showOpponentCards &&
    prevProps.voiceOn === nextProps.voiceOn &&
    prevProps.soundOn === nextProps.soundOn &&
    prevProps.drawSpeed === nextProps.drawSpeed &&
    prevProps.playerCardCount === nextProps.playerCardCount &&
    prevProps.opponentCardCount === nextProps.opponentCardCount &&
    prevProps.fitWide === nextProps.fitWide &&
    prevProps.cardMargin === nextProps.cardMargin &&
    prevProps.cardSlots === nextProps.cardSlots &&
    prevProps.bonusChance === nextProps.bonusChance &&
    prevProps.chipImage === nextProps.chipImage &&
    prevProps.isFullScreen === nextProps.isFullScreen &&
    prevProps.autoFreeSpace === nextProps.autoFreeSpace &&
    prevProps.user.loggedIn === nextProps.user.loggedIn &&
    prevProps.orientationLock === nextProps.orientationLock &&
    prevProps.fancyCalls === nextProps.fancyCalls &&
    prevProps.gameStarted === nextProps.gameStarted
  );
}

export default React.memo(Menu, areEqual);
// export default Menu;
