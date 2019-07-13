import React, { useLayoutEffect } from 'react';
import '../css/NewRecordModal.css';
import { hotShotsVideo } from '../App.js';


const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}

function NewRecordModal(props) {
  let records = [
    {
      type: 'Quickest Bingo',
      unit: 'balls',
      value: 23,
      oldRecord: 75
    },
    {
      type: 'Most Bingos',
      unit: '',
      value: 9,
      oldRecord: 1
    }
  ]
  useLayoutEffect(() => {
    document.getElementById('hot-shots-2').play();
  }, [])
  let plural = records.length > 1 ? 'S' : '';
  return (
    <div id='new-record-modal'>
      <video id='hot-shots-2' src={hotShotsVideo}></video>
      <div className='game-end-title'>NEW RECORD{plural}!</div>
      <div id='records-list'>
      {records.map(record =>
        <div className='record-entry'>
          <div className='record-entry-title'>
            {record.type}
          </div>
          <div className='record-value-type'>Old:</div>
          <div className='record-value'>{record.oldRecord} {record.unit}</div>
          <div className='record-value-type'>New:</div>
          <div className='record-value'>{record.value} {record.unit}</div>
        </div>
      )}
      </div>
      <div className='button-area'>
        <button onClick={props.onClickOkayButton} className='modal-button' id='record-okay-button'>OK</button>
      </div>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
    return prevProps.showing === nextProps.showing
    && prevProps.roundResults === nextProps.roundResults
    && prevProps.userCardCount === nextProps.userCardCount
    && prevProps.lost === nextProps.lost;
}

export default React.memo(NewRecordModal, areEqual);
// export default NewRecordModal;
