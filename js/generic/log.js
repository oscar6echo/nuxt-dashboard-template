const CAN_PRINT = process.env.CONSOLE_LOG;

const objCss = {
  func: 'color: orange; ; font-weight: bold',
  method: 'color: white; background-color: blue',
  hook: 'color: white; background-color: red',
  watch: 'color: white; background-color: green'
};

const print = ({ obj, name, force = false, css = '' }) => {
  if (obj || force) {
    if (CAN_PRINT && name) console.log('%c' + name, css);
    if (CAN_PRINT) console.log(obj);
  }
};

const base = ({
  name,
  start = true,
  params = null,
  result = null,
  symbol = '-',
  n = 10,
  css = ''
}) => {
  const line = symbol.repeat(n);
  const tag = typeof start === 'boolean' ? (start ? 'START' : 'END') : start;
  const strParams = params instanceof String ? params : '';
  const output = `${line} ${name} ${tag} ${strParams}`;

  if (result !== null) {
    if (CAN_PRINT) console.log(result);
  }

  if (CAN_PRINT) console.log('%c' + output, css);

  if (Array.isArray(params)) {
    if (CAN_PRINT) console.log(params);
  }
};

const func = ({ name, start, params, result }) => {
  const fullName = 'FUNCTION ' + name;
  const symbol = '>';
  const n = 20;
  const css = objCss.func;
  base({ name: fullName, start, params, symbol, n, result, css });
};

const funcStart = (name, params = null) => {
  const start = true;
  func({ name, start, params });
};

const funcEnd = (name, result = null) => {
  const start = false;
  func({ name, start, result });
};

const method = ({ that, name, start, params, result }) => {
  const fullName = 'COMPONENT ' + that.$options.name + ' METHOD ' + name;
  const symbol = '-';
  const n = 30;
  const css = objCss.method;
  base({ name: fullName, start, params, symbol, n, result, css });
};

const methodStart = (that, name, params = null) => {
  const start = true;
  method({ that, name, start, params });
};

const methodEnd = (that, name, result = null) => {
  const start = false;
  method({ that, name, start, result });
};

const hook = ({ that, name, start }) => {
  const fullName = 'COMPONENT ' + that.$options.name + ' HOOK ' + name;
  const symbol = '_';
  const n = 40;
  const css = objCss.method;
  base({ name: fullName, start, symbol, n, css });
};

const hookStart = (that, name) => {
  const start = true;
  hook({ that, name, start });
};

const hookEnd = (that, name) => {
  const start = false;
  hook({ that, name, start });
};

const watch = ({ that, name, start }) => {
  const fullName = 'COMPONENT ' + that.$options.name + ' WATCH ' + name;
  const symbol = '*';
  const n = 10;
  const css = objCss.watch;
  base({ name: fullName, start, symbol, n, css });
};

const watchStart = (that, name, params = null) => {
  const start = true;
  watch({ that, name, start, params });
};

const watchEnd = (that, name, result = null) => {
  const start = false;
  watch({ that, name, start, result });
};

export default {
  print,
  funcStart,
  funcEnd,
  methodStart,
  methodEnd,
  hookStart,
  hookEnd,
  watchStart,
  watchEnd
};
