import log from '~/js/generic/log';

export default (error, context) => {
  log.funcStart('APOLLO PLUGIN - ERROR', JSON.stringify(error));
};
