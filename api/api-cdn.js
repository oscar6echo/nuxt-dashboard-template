import log from '~/js/generic/log';

const requestCdn = async (axios, name) => {
  let uri = process.env.CDN_HOST;
  if (process.env.CDN_PORT) uri += ':' + process.env.CDN_PORT;
  uri += process.env.CDN_PREFIX + '/' + name;

  log.funcStart('requestCdn', uri);

  const headers = {
    accept: 'application/json'
    // accept: 'application/text'
    // authorization: 'Bearer xxx'
  };

  const config = {
    method: 'get',
    url: uri,
    headers
  };

  const data = await axios.$request(config);

  log.funcEnd('requestCdn', data);
  return data;
};

export default requestCdn;
