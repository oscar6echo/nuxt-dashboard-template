import log from '~/js/generic/log';

const requestCdn = async (axios, name) => {
  let uri;
  if (process.env.CDN_LOCAL === true) {
    const port = process.env.CDN_PORT;
    uri = `http://localhost:${port}/${name}`;
  } else {
    const hostname = process.env.CDN_HOSTNAME;
    const prefix = process.env.CDN_PREFIX;
    uri = `${hostname}/${prefix}${name}`;
  }

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
