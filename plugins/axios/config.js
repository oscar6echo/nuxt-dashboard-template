import log from '~/js/generic/log';

export default function({ $axios }) {
  $axios.onRequest((config) => {
    const authHeader = 'Bearer XXX'; // to be updated
    config.headers.authorization = authHeader;

    config.headers.accept = 'application/json';
  });

  $axios.onError((error) => {
    log.funcStart('AXIOS PLUGIN - ERROR', JSON.stringify(error.response));
  });
}
