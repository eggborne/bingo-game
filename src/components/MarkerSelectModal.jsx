import React from 'react';
import '../css/MarkerSelectModal.css';
import { chipImages } from '../App';

function MarkerSelectModal(props) {
	console.log('chipim', chipImages)
	console.log('props.chipimage', props.chipImage)
  let modalClass = '';
  if (!props.showing) {
    modalClass += ' hidden';
  }
  return (
    <div id='marker-select-modal' className={modalClass}>
			<header>SELECT MARKER</header>
			<div id='marker-selection'>
				{Object.keys(chipImages).map(image => {
					console.log('image?', image);
					let chipImage = chipImages[image];
					return (
						<img key={image} onPointerDown={() => props.onSelectNewMarker(image)} src={chipImage} className={image === props.chipImage ? 'current' : undefined} />
					);
			})}
			</div>
			<button onClick={props.onClickOkayButton} className='modal-button' id='marker-ok-button'>OK</button>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.showing === nextProps.showing && prevProps.chipImage === nextProps.chipImage;
}
export default React.memo(MarkerSelectModal, areEqual);
