import flatten from 'flat';
import log from '~/js/generic/log';

const urlEncodeState = (conf) => {
  return flatten(conf);
};

const urlDecodeState = (conf) => {
  return flatten.unflatten(conf);
};

const buildLink = ({ that, route, query, path, keepQuery = true }) => {
  if (!keepQuery) return path;

  const queryObj = that ? that.$route.query : route ? route.query : query;
  const queryStr = Object.entries(queryObj)
    .map(([k, v]) => k + '=' + v)
    .join('&');
  let link = path;
  if (query !== '') link += '?' + queryStr;
  return link;
};

const mergeObj = (current, update) => {
  for (const key of Object.keys(update)) {
    // if (!current.hasOwnProperty(key) || typeof update[key] !== 'object')
    if (
      !Object.prototype.hasOwnProperty.call(current, key) ||
      typeof update[key] !== 'object'
    )
      current[key] = update[key];
    else mergeObj(current[key], update[key]);
  }
  return current;
};

const getStateFromUrl = (that) => {
  log.funcStart('getStateFromUrl');
  const urlEncodedState = that.$route.query;
  const state = urlDecodeState(urlEncodedState);
  log.funcEnd('getStateFromUrl', JSON.stringify(state));
  return state;
};

const pushStateToUrl = ({ that, state }) => {
  const query = urlEncodeState(state);
  that.$router.push({ query });
};

const updateStateInUrl = ({ that, update = {}, remove = [] }) => {
  log.funcStart('updateStateInUrl');
  const state = getStateFromUrl(that);
  const stateStr = JSON.stringify(state);
  const newState = mergeObj({ ...state }, update);
  for (const k of remove) {
    delete newState[k];
  }
  const newStateStr = JSON.stringify(newState);
  if (stateStr === newStateStr) {
    log.funcEnd('updateStateInUrl', 'no need to update url');
    return;
  }
  pushStateToUrl({ that, state: newState });
  log.funcEnd('updateStateInUrl', JSON.stringify(newState));
};

const compareFlatState = (newState, oldState) => {
  const obj = { newState: {}, oldState: {}, updated: [] };
  obj.keys = [...Object.keys(newState)];
  const oldStateLocal = oldState ? { ...oldState } : {};

  for (const k of obj.keys) {
    obj.newState[k] = newState[k];
    obj.oldState[k] = oldStateLocal[k];
    if (obj.newState[k] !== obj.oldState[k]) obj.updated.push(k);
  }

  obj.contains = (e) => {
    return obj.updated.includes(e);
  };

  obj.containsAny = (elts) => {
    for (const e of elts) {
      if (obj.contains(e)) return true;
    }
    return false;
  };

  obj.update = (that) => {
    for (const k of obj.keys) {
      that[k] = obj.newState[k];
    }
  };

  return obj;
};

export { getStateFromUrl, updateStateInUrl, buildLink, compareFlatState };
