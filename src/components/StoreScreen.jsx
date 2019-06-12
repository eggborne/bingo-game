import React, { useState, useCallback } from 'react';
import StoreModal from './StoreModal';
import '../css/StoreScreen.css';
import { isFullScreen } from '../scripts/util';

let chipPngRed = require('../assets/bingochip.png');
let chipPngBlue = require('../assets/bingochipblue.png');
let chipPngGreen = require('../assets/bingochipgreen.png');
let chipPngOrange = require('../assets/bingochiporange.png');
let chickenPng = require('../assets/chicken.png');

const prizes = {
  'Markers': [
    { description: 'Red Chips', type: 'red', imgSrc: chipPngRed, cost: 0, class: 'item-row item-selection' },
    { description: 'Blue Chips', type: 'blue', imgSrc: chipPngBlue, cost: 500, class: 'item-row item-selection' },
    { description: 'Green Chips', type: 'green', imgSrc: chipPngGreen, cost: 1000, class: 'item-row item-selection' },
    { description: 'Orange Chips', type: 'orange', imgSrc: chipPngOrange, cost: 1500, class: 'item-row item-selection' },
  ],
  'Corner Chicken': [
    { description: '+10% Bonus Chance', type: '10 Bonus', cost: 1000, class: 'item-row' },
    { description: '+25% Bonus Chance', type: '25 Bonus', cost: 5000, class: 'item-row' },
    { description: '+50% Bonus Chance', type: '30 Bonus', cost: 20000, class: 'item-row' },
  ],
  'Extra Card Slots': [
    { description: '+1 Card Slot', type: 'Card Slot', cost: 2000, class: 'item-row' },
    { description: '+1 Card Slot', type: 'Card Slot', cost: 10000, class: 'item-row' },
    { description: '+1 Card Slot', type: 'Card Slot', cost: 30000, class: 'item-row' },
    { description: '+1 Card Slot', type: 'Card Slot', cost: 75000, class: 'item-row' }]
}

function StoreScreen(props) {
  console.pink('StoreScreen ------------------');
  const [selectedItem, setSelectedItem] = useState(undefined);
  const selectItem = useCallback((item) => {
    setSelectedItem(item)
  });

  const handleClickBuyButton = useCallback(() => {
    props.onClickBuyButton(selectedItem);
    setSelectedItem(undefined);
  }, [selectedItem])
  const handleClickCancelButton = useCallback(() => {
    setSelectedItem(undefined);
  },[])
  let userPrizes = props.userPrizes;
  let prizeCategories = Object.keys(prizes);
  let storeClass = props.showing ? 'showing' : '';
  let cash = props.userCash;
  return (
    <>
      {props.showing && <StoreModal selectedItem={selectedItem} onClickBuyButton={handleClickBuyButton} onClickCancelButton={handleClickCancelButton} />}
      <div id='store-screen' className={storeClass}>
        <header><div>$</div> <img className='flipped' src={chickenPng} /> <img className='flipped' src={chickenPng} /> STORE <img src={chickenPng} /> <img src={chickenPng} /> <div>$</div></header>
        {props.showing ?
          <div id='store-body'>
            <div id='marker-grid' className={'prize-category'}>
              <div className={`category-label`}>Markers</div>
              {prizes['Markers'].map((item, i) => {
                return (<div key={item.type} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <img src={item.imgSrc} />
                  <div className={cash < item.cost ? 'unavailable' : ''}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={'prize-category'}>
              <div className={`category-label`}>Corner Chicken</div>
              {prizes['Corner Chicken'].map((item, i) => {
                return (<div className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <div>{item.description}</div>
                  <div className={cash < item.cost ? 'unavailable' : ''}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={'prize-category'}>
              <div className={`category-label`}>Extra Card Slots</div>
              {prizes['Extra Card Slots'].map((item, i) => {
                return (<div className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <div>{item.description}</div>
                  <div className={cash < item.cost ? 'unavailable' : ''}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
          </div>
          :
          <div></div>
        }
        <div id='info-footer'>
          <div>Money:</div>
          <div> ${cash}</div>
        </div>
      </div>
    </>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (
    prevProps.showing == nextProps.showing &&
    prevProps.userPrizes == nextProps.userPrizes &&
    prevProps.userCash == nextProps.userCash
  );
};

export default React.memo(StoreScreen, isEqual);
// export default StoreScreen;
