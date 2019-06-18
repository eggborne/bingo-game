import React, { useState, useCallback } from 'react';
import StoreModal from './StoreModal';
import '../css/StoreScreen.css';
import { isFullScreen } from '../scripts/util';

const chipPngRed = require('../assets/bingochip.png');
const chipPngBlue = require('../assets/bingochipblue.png');
const chipPngGreen = require('../assets/bingochipgreen.png');
const chipPngOrange = require('../assets/bingochiporange.png');
const chickenPng = require('../assets/chickenstand.png');
const beeSprayPng1 = require('../assets/beespray.png');
const beeSprayPng2 = require('../assets/beespray2.png');
const beeSprayPng3 = require('../assets/beespray3.png');

export const prizes = {
  'Markers': [
    // { displayName: 'Red Chips', description: 'Red Chips', type: 'red', imgSrc: 'bingochip.png', imgHeight: '10vmin', cost: 50, class: 'item-row item-selection' },
    { displayName: 'Blue Chips', description: 'Blue Chips', type: 'blue', imgSrc: 'bingochipblue.png', imgHeight: '10vmin', cost: 500, class: 'item-row item-selection' },
    { displayName: 'Green Chips', description: 'Green Chips', type: 'green', imgSrc: 'bingochipgreen.png', imgHeight: '10vmin', cost: 1000, class: 'item-row item-selection' },
    { displayName: 'Orange Chips', description: 'Orange Chips', type: 'orange', imgSrc: 'bingochiporange.png', imgHeight: '10vmin', cost: 1500, class: 'item-row item-selection' },
   ],
  'Corner Chicken': [
    { displayName: '+10% Bonus Chance', description: '+10% Bonus Chance', type: '10', cost: 1000, class: 'item-row' },
    { displayName: '+25% Bonus Chance', description: '+25% Bonus Chance', type: '25', cost: 5000, class: 'item-row' },
    { displayName: '+40% Bonus Chance', description: '+40% Bonus Chance', type: '40', cost: 20000, class: 'item-row' },
  ],
  'Item Slots': [
    { displayName: 'First Item Slot', description: 'First Item Slot', type: 'first', cost: 5000, class: 'item-row' },
    { displayName: 'Second Item Slot', description: 'Second Item Slot', type: 'second', cost: 25000, class: 'item-row' },
    { displayName: 'Third Item Slot', description: 'Third Item Slot', type: 'third', cost: 75000, class: 'item-row' },
  ],
  'Extra Card Slots': [
    { displayName: 'Third Card Slot', description: '+1 Card Slot 1', type: '1', cost: 2000, class: 'item-row' },
    { displayName: 'Fourth Card Slot', description: '+1 Card Slot 2', type: '1', cost: 10000, class: 'item-row' },
    { displayName: 'Fifth Card Slot', description: '+1 Card Slot 3', type: '1', cost: 30000, class: 'item-row' },
    { displayName: 'Sixth Card Slot', description: '+1 Card Slot 4', type: '1', cost: 75000, class: 'item-row' }
  ]
}
const consumables = {
  'Bee Spray': [
    { consumable: true, displayName: 'Small Bee Spray', description: 'Holds 2 sprays', type: 'small', uses: 2, totalUses: 2, imgSrc: beeSprayPng1, imgHeight: '20vmin', cost: 1000, class: 'item-row item-selection' },
    { consumable: true, displayName: 'Medium Bee Spray', description: 'Holds 5 sprays', type: 'medium', uses: 5, totalUses: 5, imgSrc: beeSprayPng2, imgHeight: '20vmin', cost: 10000, class: 'item-row item-selection' },
    { consumable: true, displayName: 'Large Bee Spray', description: 'Holds 8 sprays', type: 'large', uses: 8, totalUses: 8, imgSrc: beeSprayPng3, imgHeight: '20vmin', cost: 50000, class: 'item-row item-selection' },
  ],
  // 'Transmogrifier': [
  //   { description: '2 sprays. Covers one square.', type: 'Small Bee Spray', uses: 2, imgSrc: beeSprayPng1, cost: 3000, class: 'item-row item-selection' },
  //   { description: '3 sprays. Covers nine squares', type: 'Medium Bee Spray', uses: 3, imgSrc: beeSprayPng2, cost: 10000, class: 'item-row item-selection' },
  //   { description: '5 sprays. Covers an entire card', type: 'Large Bee Spray', uses: 5, imgSrc: beeSprayPng3, cost: 20000, class: 'item-row item-selection' },
  // ]

}

function StoreScreen(props) {
  console.pink('StoreScreen ------------------');
  console.info('sote', props)
  const [selectedCategory, setSelectedCategory] = useState('consumable');
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [selectedSlot, setSelectedSlot] = useState(props.itemSlots.filter(slot => slot.item).length);
  const selectCategory = (category) => {
    setSelectedCategory(category);
    // props.onChangeStoreCategory(category);
  };
  const handleSelectSlot = (newSlot) => {
    setSelectedSlot(newSlot);
  }
  const selectItem = (item) => {
    setSelectedItem(item)
  };
  const refillItem = (item, refillCost) => {
    if (refillCost) {
      props.onClickRefillItem(item, refillCost);
    }
  };
  const handleClickBuyButton = () => {
    console.log('selectedItem is', selectedItem)
    console.log('selectedSlot is', selectedSlot)
    if (selectedSlot < props.itemSlots.length || !selectedItem.consumable) {
      props.onClickBuyButton(selectedItem, selectedSlot);
      setSelectedItem(undefined);
    }
  };
  const handleClickCancelButton = () => {
    setSelectedItem(undefined);
  };
  console.log('priz', props.userPrizes)
  console.log('itemSlots', props.itemSlots)
  let userPrizes = [...props.userPrizes, ...props.itemSlots];
  let storeClass = props.showing ? 'showing' : '';
  let cash = props.userCash;
  let noSpace = selectedSlot >= props.itemSlots.length;
  return (
    <>
      {props.showing && <StoreModal itemSlots={props.itemSlots} selectedItem={selectedItem} onSelectSlot={handleSelectSlot} onClickBuyButton={handleClickBuyButton} onClickCancelButton={handleClickCancelButton} />}
      <div id='store-screen' className={storeClass}>
        <header><img className='flipped' src={chickenPng} /> <img className='flipped' src={chickenPng} /> <div>SHOP</div> <img src={chickenPng} /> <img src={chickenPng} /></header>
        <div id='tab-area'>
          <div onPointerDown={() => selectCategory('permanent')} className={selectedCategory === 'permanent' ? 'selected' : undefined}>Permanent</div>
          <div onPointerDown={() => selectCategory('consumable')} className={selectedCategory === 'consumable' ? 'selected' : undefined}>Consumable</div>
        </div>
        {props.showing ?
        <div id='store-section-container' className={selectedCategory === 'consumable' ? 'shifted-left' : ''}>
          <div id='store-permanent' className='store-body'>
            <div className={`category-label`}>Markers</div>
            <div className={'prize-category item-grid'}>
              {prizes['Markers'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <img style={{ width: item.imgHeight, height: item.imgHeight }} src={require(`../assets/${item.imgSrc}`)}/>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
              <div className={`category-label`}>Corner Chicken</div>
            <div className={'prize-category'}>
              {prizes['Corner Chicken'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <div>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={`category-label`}>Item Slots</div>
            <div className={'prize-category'}>
              {prizes['Item Slots'].map((item, i) => {
                // return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                return (<div key={item.description + item.cost} className={`${item.class}${props.itemSlots[i] ? ' owned' : ''}`} >
                  <div>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={`category-label`}>Extra Card Slots</div>
            <div className={'prize-category'}>
              {prizes['Extra Card Slots'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <div>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onPointerDown={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
          </div>

          <div id='store-consumable' className='store-body'>

            {/* <div className={`category-label`}>Bee Spray</div> */}
            <div className={'prize-category item-grid consumable'}>
                {consumables['Bee Spray'].map((item, i) => {
                  let owned = props.itemSlots.filter(slot => slot.item && slot.item.description === item.description).length;
                  let perSpray = item.cost / item.totalUses;
                  let usesLeft = 0;
                  if (owned) {
                    usesLeft = props.itemSlots.filter(slot => slot.item.description === item.description)[0].item.uses;
                  }
                  let full = usesLeft === item.totalUses;
                  let itemCost = owned ? (!full) ? (perSpray * (item.totalUses - usesLeft)) : 'full' : item.cost;
                  let buttonLabel = owned ? 'REFILL' : 'BUY';
                  if (full) {
                    buttonLabel = 'FULL';
                  }
                  return (
                    <div key={item.description + item.cost} className={`${item.class}${owned ? ' owned' : ''}${full ? ' full' : ''}`} >
                      <div className='consumable-title'>{item.displayName}</div>
                      <div className='item-name'>{item.description}</div>
                      <img style={{ width: item.imgHeight, height: item.imgHeight }} src={item.imgSrc} />
                      <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${itemCost}</div>
                      <button onPointerDown={() => { (owned && !full) ? refillItem(item, itemCost) : selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>{buttonLabel}</button>
                    </div>
                  );
              })}
              </div>
          </div>
          </div>
          :
          null
        }
        <div id='info-footer'>
          <div>Money: <span>${cash}</span></div>
          <div>Item Slots: 1</div>
        </div>
      </div>
    </>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (prevProps.showing === nextProps.showing
    // && prevProps.userPrizes.length === nextProps.userPrizes.length
    && prevProps.itemSlots === nextProps.itemSlots
    && prevProps.userCash === nextProps.userCash
  );
};

export default React.memo(StoreScreen, isEqual);
// export default StoreScreen;
