import d3 from '~/assets/d3';

const msg = 'world!';
let c = 0;

self.addEventListener('message', (event) => {
  c++;
  console.log(JSON.stringify(event.data, c));
  self.postMessage({ hello: msg, echo: event.data, also: d3.range(5), c });
});

self.postMessage({ hello: 'from web worker' });
