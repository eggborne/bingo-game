import React, { useState, useEffect } from 'react';
import StoreModal from './StoreModal';
import '../css/StoreScreen.css';

export const permanentItems = {
  'Markers': [
    { id: 0, cost: 10, category: 'Markers', displayName: 'Red Marker', description: 'Red Marker', type: 'red', imgSrc: 'bingochip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 1, cost: 20, category: 'Markers', displayName: 'Blue Marker', description: 'Blue Marker', type: 'blue', imgSrc: 'bingochipblue.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 2, cost: 30, category: 'Markers', displayName: 'Green Marker', description: 'Green Marker', type: 'green', imgSrc: 'bingochipgreen.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 3, cost: 50, category: 'Markers', displayName: 'Tomato Marker', description: 'Tomato Marker', type: 'tomato', imgSrc: 'tomato.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 100, cost: 100, category: 'Markers', displayName: 'Onion Marker', description: 'Onion Marker', type: 'onion', imgSrc: 'onionchip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 101, cost: 200, category: 'Markers', displayName: 'Orange Marker', description: 'Orange Marker', type: 'orange', imgSrc: 'orangefruitchip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 4, cost: 300, category: 'Markers', displayName: 'Mingus Marker', description: 'Mingus Marker', type: 'mingus', imgSrc: 'minguschip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 5, cost: 500, category: 'Markers', displayName: 'Conan Marker', description: 'Conan Marker', type: 'conan', imgSrc: 'conanchip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
    { id: 102, cost: 1000, category: 'Markers', displayName: 'Eyeball Marker', description: 'Eyeball Marker', type: 'eyeball', imgSrc: 'eyeballchip.png', imgHeight: '10vmin', class: 'item-row item-selection' },
   ],
  'Item Slots': [
    { id: 6, cost: 500, category: 'Item Slots', displayName: 'First Item Slot', description: 'First Item Slot', type: 'first', class: 'item-row' },
    { id: 7, cost: 2500, category: 'Item Slots', displayName: 'Second Item Slot', description: 'Second Item Slot', type: 'second', class: 'item-row' },
    { id: 888, cost: 7500, category: 'Item Slots', displayName: 'Third Item Slot', description: 'Third Item Slot', type: 'third', class: 'item-row' },
  ],
  'Card Slots': [
    { id: 8, cost: 1000, category: 'Card Slots', displayName: 'Third Card Slot', description: '+1 Card Slot 1', type: '1', class: 'item-row' },
    { id: 9, cost: 2000, category: 'Card Slots', displayName: 'Fourth Card Slot', description: '+1 Card Slot 2', type: '1', class: 'item-row' },
    { id: 10, cost: 5000, category: 'Card Slots', displayName: 'Fifth Card Slot', description: '+1 Card Slot 3', type: '1', class: 'item-row' },
    { id: 11, cost: 10000, category: 'Card Slots', displayName: 'Sixth Card Slot', description: '+1 Card Slot 4', type: '1', class: 'item-row' }
  ]
}
const consumables = {
  'Bee Control': [
    { id: 12, cost: 100, category: 'Bee Spray', consumable: true, displayName: 'Small Bee Spray', description: 'Holds 1 spray', type: 'small', uses: 1, totalUses: 1, imgSrc: 'beespray.png', imgHeight: '20vmin', class: 'item-row item-selection' },
    { id: 13, cost: 1000, category: 'Bee Spray', consumable: true, displayName: 'Medium Bee Spray', description: 'Holds 3 sprays', type: 'medium', uses: 3, totalUses: 3, imgSrc: 'beespray2.png', imgHeight: '20vmin', class: 'item-row item-selection' },
  ],
  'Free Spaces': [
    { id: 14, cost: 200, category: 'Free Spaces', consumable: true, displayName: 'One Free Space', description: 'Use on any square', type: 'one', uses: 1, totalUses: 1, imgSrc: 'freespace.png', imgHeight: '20vmin', class: 'item-row item-selection' },
    { id: 15, cost: 2000, category: 'Free Spaces', consumable: true, displayName: 'Two Free Spaces', description: 'Use on any square', type: 'two', uses: 2, totalUses: 2, imgSrc: 'freespace.png', imgHeight: '20vmin', class: 'item-row item-selection' },
  ],
  'Chicken Supplies': [
    { id: 900, cost: 2000, category: 'Chicken Supplies', consumable: true, displayName: 'Energy Drink', description: 'Fully charges one of your chickens', type: 'normal', uses: 1, totalUses: 1, imgSrc:'energydrink.png', imgHeight: '20vmin', class: 'item-row item-selection' }
  ]
}

function StoreScreen(props) {
  console.pink('StoreScreen ------------------');
  console.info('store props', props)
  const [selectedCategory, setSelectedCategory] = useState('consumable');
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [selectedSlot, setSelectedSlot] = useState(undefined);
  useEffect(() => {
    if (!props.showing && selectedItem) {
      setSelectedItem(undefined);
    }
  }, [props.showing]);
  const selectCategory = (category) => {
    setSelectedCategory(category);
    // props.onChangeStoreCategory(category);
  };
  const handleSelectSlot = (newSlot) => {
    setSelectedSlot(newSlot);
    setTimeout(() => {
      handleClickBuyButton(newSlot);
    }, 120);
  }
  const selectItem = (item) => {
    setSelectedItem(item)
  };
  const refillItem = (item, refillCost) => {
    if (refillCost) {
      props.onClickRefillItem(item, refillCost);
    }
  };
  const handleClickBuyButton = (newSlot) => {
    console.log('selectedItem is', selectedItem)
    let targetSlot = selectedSlot || newSlot
    console.log('targetSlot is', targetSlot)
    if (targetSlot < props.itemSlots.length || !selectedItem.consumable) {
      props.onClickBuyButton({...selectedItem}, targetSlot);
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
        <header><div>SHOP</div></header>
        <div id='tab-area'>
          <div onPointerDown={() => selectCategory('permanent')} className={selectedCategory === 'permanent' ? 'selected' : undefined}><span>Permanent</span></div>
          <div onPointerDown={() => selectCategory('consumable')} className={selectedCategory === 'consumable' ? 'selected' : undefined}><span>Consumable</span></div>
        </div>
        {props.showing ?
        <div id='store-section-container' className={selectedCategory === 'consumable' ? 'shifted-left' : ''}>
          <div id='store-permanent' className='store-body'>
            <div className={`category-label`}>Markers</div>
            <div className={'prize-category item-grid'}>
                {permanentItems['Markers'].map((item, i) => {
                  let owned = [...props.userPrizes].filter(prize => item.id === prize.id).length;
                  console.log('[...props.userPrizes]', [...props.userPrizes]);
                  console.log(item.displayName, 'owned?', owned)
                return (<div key={item.id} className={`${item.class}${owned ? ' owned' : ''}`} >
                  <img style={{ width: item.imgHeight, height: item.imgHeight }} src={require(`../assets/${item.imgSrc}`)}/>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={`category-label`}>Item Slots</div>
            <div className={'prize-category'}>
              {permanentItems['Item Slots'].map((item, i) => {
                let owned = [...props.userPrizes].filter(prize => item.id === prize.id).length;
                console.log('[...props.userPrizes]', [...props.userPrizes]);
                console.log(item.displayName, 'owned?', owned)
                return (<div key={item.id} className={`${item.class}${owned ? ' owned' : ''}`} >
                  <div className='permanent-title'>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
            <div className={`category-label`}>Card Slots</div>
            <div className={'prize-category'}>
              {permanentItems['Card Slots'].map((item, i) => {
                let owned = [...props.userPrizes].filter(prize => item.id === prize.id).length;
                  console.log('[...props.userPrizes]', [...props.userPrizes]);
                  console.log(item.displayName, 'owned?', owned)
                return (<div key={item.id} className={`${item.class}${owned ? ' owned' : ''}`} >
                  <div className='permanent-title'>{item.displayName}</div>
                  <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                  <button onClick={() => { selectItem(item) }} className={cash < item.cost ? 'unavailable' : ''}>BUY</button>
                </div>)
              })}
            </div>
          </div>
          <div id='store-consumable' className='store-body'>
            <div className={`category-label`}>Bee Control</div>
            <div className={'prize-category item-grid consumable'}>
              {consumables['Bee Control'].map((item, i) => {
                let owned = props.itemSlots.filter(slot => slot.item && slot.item.id === item.id).length;
                let perSpray = Math.floor(item.cost / item.totalUses);
                let usesLeft = 0;
                if (owned) {
                  usesLeft = props.itemSlots.filter(slot => slot.item && slot.item.id === item.id)[0].item.uses;
                }
                let full = usesLeft === item.totalUses;
                let itemCost = owned ? (!full) ? (perSpray * (item.totalUses - usesLeft)) : 'full' : item.cost;
                let buttonLabel = owned ? 'REFILL' : 'BUY';
                if (full) {
                  buttonLabel = 'FULL';
                }
                return (
                  <div key={item.id} className={`${item.class}${owned ? ' owned' : ''}${full ? ' full' : ''}`} >
                    <div className='consumable-title'>{item.displayName}</div>
                    <div className='item-description'>{item.description}</div>
                    <img style={{ width: item.imgHeight, height: item.imgHeight }} src={require(`../assets/${item.imgSrc}`)} />
                    <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${itemCost}</div>
                    <button onClick={() => { (owned && !full) ? refillItem(item, itemCost) : selectItem(item) }} className={cash < itemCost ? 'unavailable' : ''}>{buttonLabel}</button>
                  </div>
                );
              })}
              </div>
              <div className={`category-label`}>Free Spaces</div>
              <div className={'prize-category item-grid consumable'}>
                {consumables['Free Spaces'].map((item, i) => {
                  let owned = props.itemSlots.filter(slot => slot.item && slot.item.id === item.id).length;
                  let buttonLabel = 'BUY';
                  return (
                    <div key={item.id} className={`${item.class}${owned ? ' owned full' : ' full'}`} >
                      <div className='consumable-title'>{item.displayName}</div>
                      <div className='item-description'>{item.description}</div>
                      <img style={{ width: item.imgHeight, height: item.imgHeight, transform: 'scale(0.8)' }} src={require(`../assets/${item.imgSrc}`)} />
                      <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                      <button onClick={() => !owned ? selectItem(item) : null } className={(cash < item.cost || owned) ? 'unavailable' : ''}>{buttonLabel}</button>
                    </div>
                  );
                })}
              </div>
              <div className={'category-label'}>Chicken Supplies</div>
              <div className={'prize-category item-grid consumable'}>
                {consumables['Chicken Supplies'].map((item, i) => {
                  let owned = props.itemSlots.filter(slot => slot.item && slot.item.id === item.id).length;
                  let buttonLabel = 'BUY';
                  return (
                    <div key={item.id} className={`${item.class}${owned ? ' owned full' : ' full'}`}>
                      <div className={'consumable-title'}>{item.displayName}</div>
                      <div className={'item-description'}>{item.description}</div>
                      <img style={{ width: item.imgHeight, height: item.imgHeight, transform: 'scale(0.8)' }} src={require(`../assets/${item.imgSrc}`)} />
                      <div className={cash < item.cost ? 'item-cost unavailable' : 'item-cost'}>${item.cost}</div>
                      <button onClick={() => !owned ? selectItem(item) : null } className={(cash < item.cost || owned) ? ' unavailable' : ''}>{buttonLabel}</button>
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
