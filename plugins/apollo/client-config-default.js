export default function(context) {
  return {
    httpEndpoint: 'https://countries.trevorblades.com',
    // wsEndpoint: 'ws://countries.trevorblades.com',
    // LocalStorage token
    tokenName: 'apollo-token', // optional
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false, // Optional
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false // Optional
  };
}
