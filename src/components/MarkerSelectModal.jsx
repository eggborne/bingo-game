import React from 'react';
import '../css/MarkerSelectModal.css';
import { chipImages } from '../App';

const lockImage = require('../assets/lockicon.png')

function MarkerSelectModal(props) {
	console.log('chipim', chipImages)
	console.log('props.chipimage', props.chipImage)
  let modalClass = '';
  if (!props.showing) {
    modalClass += ' hidden';
	}
	let chipImageNames = Object.keys(chipImages);
	let lockedMarkers = new Array(30-chipImageNames.length).fill(undefined);
	let markerList = [...chipImageNames, ...lockedMarkers];
	console.log('lockedMarkers', lockedMarkers);
  return (
    <div id='marker-select-modal' className={modalClass}>
			<header>SELECT MARKER</header>
			<div id='marker-selection'>
				{markerList.map((imageName, i) => {
					console.log('image?', imageName);
					if (imageName) {
						let chipImage = chipImages[imageName];
						return (
							<img key={imageName} onPointerDown={() => props.onSelectNewMarker(imageName)} src={chipImage} className={imageName === props.chipImage ? 'current' : undefined} />
						);
					} else {
						return (
							<img className='locked' key={i} src={lockImage} />
						);
					}
			})}
			</div>
			<div id='button-area'>
				<button onClick={props.onClickOkayButton} className='modal-button' id='marker-ok-button'>OK</button>
			</div>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.showing === nextProps.showing && prevProps.chipImage === nextProps.chipImage;
}
export default React.memo(MarkerSelectModal, areEqual);
