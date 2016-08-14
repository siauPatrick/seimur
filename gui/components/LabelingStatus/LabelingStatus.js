import React from 'react';
import {browserHistory, Link} from 'react-router';
import {isNumber} from 'lodash';


export default function LabelingStatus({pairList}) {
  const positiveLabeledPairs = pairList.filter(pair => pair.label === 1);
  const negativeLabeledPairs = pairList.filter(pair => pair.label === -1);
  const unlabeledPairs = pairList.filter(pair => !isNumber(pair.label));

  return (
    <div className="labeling-status">
      <i className="labeling-status__positive">{positiveLabeledPairs.length}</i>
      {' + '} <i className="labeling-status__negative">{negativeLabeledPairs.length}</i>
      {' + '} <i className="labeling-status__unlabeled">{unlabeledPairs.length}</i>
      {' = '} <i>{pairList.length}</i>
    </div>
  )
}
