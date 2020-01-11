import log from '~/js/generic/log';

const getPosFromRoute = (conf, routeName) => {
  log.funcStart('getPosFromRoute', routeName);

  if (!conf || !routeName) {
    log.funcEnd('getPosFromRoute', 'ERROR: MISSING CONF');
    return null;
  }
  if (routeName === 'index') return { root: true };
  const pos = {};

  const fractions = routeName.split('-');
  const pathTab = fractions[1];
  const idxTab = getIdxPath(conf.tabs, pathTab);
  pos.tab = { idx: idxTab, path: pathTab };
  if (fractions.length > 2) {
    const pathSub = fractions[2];
    const idxSub = conf.tabs[idxTab].tabs.findIndex((e) => e.path === pathSub);
    pos.sub = { idx: idxSub, path: pathSub };
  }

  log.funcEnd('getPosFromRoute', JSON.stringify(pos));
  return pos;
};

const getIdxPath = (tabs, path) => {
  log.funcStart('getIdxPath', path);

  const obj = tabs.findIndex((e) => e.path === path);

  log.funcEnd('getIdxPath', obj);
  return obj;
};

const getIdxFromPath = (conf, pathObj) => {
  log.funcStart('getIdxFromPath', pathObj);

  if (!conf) {
    log.funcEnd('getIdxFromPath', 'ERROR: MISSING CONF');
    return null;
  }
  const obj =
    pathObj.level === 2
      ? conf.tabs.findIndex((e) => e.path === pathObj.path)
      : null;

  log.funcEnd('getIdxFromPath', JSON.stringify(obj));
  return obj;
};

const defaultRoute = (conf, route, activeTab) => {
  log.funcStart('defaultRoute', [route.path, JSON.stringify(activeTab)]);

  const pos = getPosFromRoute(conf, route.name);
  log.print({ obj: JSON.stringify(pos), name: 'pos' });

  if (!pos) return;
  if (pos.tab && pos.sub) {
    log.funcEnd('defaultRoute', 'Nothing to do');
    return;
  }
  let path;

  if (pos.root) {
    const tab = conf.tabs[activeTab.tab];
    path = '/' + tab.path;
    log.funcEnd('defaultRoute', path);
    return path;
  }

  if (pos.tab.idx === -1) {
    log.funcEnd('defaultRoute', '/');
    return '/';
  }

  path = null;
  const idx = pos.tab.idx;
  if (!pos.sub) {
    path = '/' + conf.tabs[idx].path;
  }
  if (Number.isInteger(activeTab.sub[idx])) {
    const sub = conf.tabs[idx].tabs[activeTab.sub[idx]];
    path += '/' + sub.path;
  }
  log.funcEnd('defaultRoute', path);
  return path;
};

export default {
  getPosFromRoute,
  getIdxFromPath,
  defaultRoute
};
