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

export const permanentItems = {
  'Markers': [
    { id: 0, cost: 10, category: 'Markers', displayName: 'Red Chips', description: 'Red Chips', type: 'red', imgSrc: 'bingochip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 1, cost: 25, category: 'Markers', displayName: 'Blue Chips', description: 'Blue Chips', type: 'blue', imgSrc: 'bingochipblue.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 2, cost: 50, category: 'Markers', displayName: 'Green Chips', description: 'Green Chips', type: 'green', imgSrc: 'bingochipgreen.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 3, cost: 100, category: 'Markers', displayName: 'Orange Chips', description: 'Orange Chips', type: 'orange', imgSrc: 'bingochiporange.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    // { id: 4, cost: 1000, category: 'Markers', displayName: 'Green Pepper Chips', description: 'Green Pepper Chips', type: 'pepper', imgSrc: 'pepper.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 4, cost: 1000, category: 'Markers', displayName: 'Tomato Chips', description: 'Tomato Chips', type: 'tomato', imgSrc: 'tomato.png', imgHeight: '10vmin', class: 'item-row item-selection' },
   ],
  'Item Slots': [
    { id: 4, cost: 500, category: 'Item Slots', displayName: 'First Item Slot', description: 'First Item Slot', type: 'first', class: 'item-row' },
    { id: 5, cost: 2500, category: 'Item Slots', displayName: 'Second Item Slot', description: 'Second Item Slot', type: 'second', class: 'item-row' },
    { id: 6, cost: 7500, category: 'Item Slots', displayName: 'Third Item Slot', description: 'Third Item Slot', type: 'third', class: 'item-row' },
  ],
  'Card Slots': [
    { id: 7, cost: 200, category: 'Card Slots', displayName: 'Third Card Slot', description: '+1 Card Slot 1', type: '1', class: 'item-row' },
    { id: 8, cost: 1000, category: 'Card Slots', displayName: 'Fourth Card Slot', description: '+1 Card Slot 2', type: '1', class: 'item-row' },
    { id: 9, cost: 5000, category: 'Card Slots', displayName: 'Fifth Card Slot', description: '+1 Card Slot 3', type: '1', class: 'item-row' },
    { id: 10, cost: 10000, category: 'Card Slots', displayName: 'Sixth Card Slot', description: '+1 Card Slot 4', type: '1', class: 'item-row' }
  ]
}
const consumables = {
  'Bee Spray': [
    { id: 11, cost: 200, category: 'Bee Spray', consumable: true, displayName: 'Small Bee Spray', description: 'Holds 2 sprays', type: 'small', uses: 2, totalUses: 2, imgSrc: beeSprayPng1, imgHeight: '20vmin', class: 'item-row item-selection' },
    { id: 12, cost: 1000, category: 'Bee Spray', consumable: true, displayName: 'Medium Bee Spray', description: 'Holds 5 sprays', type: 'medium', uses: 5, totalUses: 5, imgSrc: beeSprayPng2, imgHeight: '20vmin', class: 'item-row item-selection' },
    { id: 13, cost: 5000, category: 'Bee Spray', consumable: true, displayName: 'Large Bee Spray', description: 'Holds 8 sprays', type: 'large', uses: 8, totalUses: 8, imgSrc: beeSprayPng3, imgHeight: '20vmin', class: 'item-row item-selection' },
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
              {permanentItems['Markers'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <img style={{ width: item.imgHeight, height: item.imgHeight }} src={require(`../assets/${item.imgSrc}`)}/>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            {/* <div className={`category-label`}>Corner Chicken</div>
            <div className={'prize-category'}>
              {permanentItems['Corner Chicken'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                  <div>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div> */}
            <div className={`category-label`}>Item Slots</div>
            <div className={'prize-category'}>
              {permanentItems['Item Slots'].map((item, i) => {
                // return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.type === prize.type && item.cost === prize.cost).length ? ' owned' : ''}`} >
                return (<div key={item.description + item.cost} className={`${item.class}${props.itemSlots[i] ? ' owned' : ''}`} >
                  <div className='permanent-title'>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={`category-label`}>Card Slots</div>
            <div className={'prize-category'}>
              {permanentItems['Card Slots'].map((item, i) => {
                return (<div key={item.description + item.cost} className={`${item.class}${userPrizes.filter(prize => item.displayName === prize.displayName && item.description === prize.description).length ? ' owned' : ''}`} >
                  <div className='permanent-title'>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
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

                    usesLeft = props.itemSlots.filter(slot => slot.item && slot.item.description === item.description)[0].item.uses;
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
                      <button onClick={() => { (owned && !full) ? refillItem(item, itemCost) : selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>{buttonLabel}</button>
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
          {/* <div>Item Slots: {props.itemSlots.length}</div> */}
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
