import {compact, get, last} from 'lodash';

import {
  REQUEST_PAIR_LIST, RECEIVE_PAIR_LIST,
  REQUEST_PAIR, RECEIVE_PAIR,
  START_SET_LABEL, END_SET_LABEL
} from 'gui/constants';


function requestPairList() {
  return {
    type: REQUEST_PAIR_LIST
  }
}


function _buildCompanyLabel(company={}) {
  const companyName = company.companyName || '';
  const workPeriod = compact([company.startYear, company.endYear]).join('-');

  return `${companyName} ${workPeriod}`
}


function _profileModifier(profile) {
  const education = get(profile.educations, '[0].nameRaw', '');

  return {
    id: profile.docId,
    name: profile.name || profile.nick,
    nick: profile.nick,
    images: profile.pictures,
    location: profile.locations[0] || {},
    education,
    sources: profile.sources,
    firstCompanyLabel: _buildCompanyLabel(profile.positions[0]),
    lastCompanyLabel: _buildCompanyLabel(last(profile.positions[0]))
  }
}


function receivePairList(json) {
  /*
  need to add:
    skillInfo
    organization
    url
    birthYear
    birthMonth
    birthDay
    coursesAndCertificates
    sources
    nick
    nicks
    educations
    locations
    positions
    mainSkills
    names


    было полезно, в каких компаниях работал и чем занимался
    есть ли одинаковые ресурсы
    места учебы
   */

  const items = json.map((pair) => ({
      ...pair,
      first: _profileModifier(pair.first),
      second: _profileModifier(pair.second)
    })
  );

  return {
    type: RECEIVE_PAIR_LIST,
    items: items
  }
}


export function fetchPairList() {
  return (dispatch) => {
    dispatch(requestPairList());
    return fetch('/api/pairs', {credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(receivePairList(json)))
  }
}


function requestPair() {
  return {
    type: REQUEST_PAIR
  }
}


function receivePair(json) {
  return {
    type: RECEIVE_PAIR,
    item: json
  }
}


export function fetchPair(pairId) {
  return (dispatch) => {
    dispatch(requestPair());
    return fetch(`/api/pairs/${pairId}`, {credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(receivePair(json)))
  }
}


function startSetLabel() {
  return {
    type: START_SET_LABEL
  }
}

function endSetLabel(json) {
  return {
    type: END_SET_LABEL,
    item: json
  }
}


export function setLabel(pairId, label) {
  const options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({label})
  };

  return (dispatch) => {
    dispatch(startSetLabel());
    return fetch(`/api/pairs/${pairId}`, options)
      .then(response => response.json())
      .then(json => dispatch(endSetLabel(json)))
  }
}
