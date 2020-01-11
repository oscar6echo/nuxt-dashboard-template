import d3 from '~/assets/d3';

const formatFloat = (x, n) => {
  if (typeof x === 'number') {
    return x.toLocaleString('en', {
      minimumFractionDigits: n,
      maximumFractionDigits: n
    });
  }
  return 'NaN';
};

const timeStrToNum = (isoString) => new Date(isoString).valueOf();

const fmtDate = d3.timeFormat('%a %d-%b-%y %H:%M:%S');
// const fmtDate = d3.timeFormat('%Y-%m-%d');

const dicFormat = {
  integer: d3.format(',d'),
  float: d3.format(',.2f'),
  float0: d3.format(',.0f'),
  float2: d3.format(',.2f'),
  float3: d3.format(',.3f'),
  boolean: (e) => (e ? 'TRUE' : 'FALSE'),
  text: (e) => e,
  json: (e) => (e ? JSON.stringify(e, null, 2) : null),
  timestamp: (e) => fmtDate(new Date(e))
};

const syntaxHighlightJson = (json) => {
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function(match) {
      let cls = 'number';
      if (match.startsWith('"')) {
        if (match.endsWith(':')) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};

const compareStringAsc = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
};

const compareStringDes = (a, b) => {
  if (a < b) {
    return 1;
  }
  if (a > b) {
    return -1;
  }

  return 0;
};

const shiftDate = (d, { day, hour, minute, second }) => {
  const shiftSec = (second || 0) * 1000;
  const shiftMinute = (minute || 0) * 1000 * 60;
  const shiftHour = (hour || 0) * 1000 * 60 * 60;
  const shiftDay = (day || 0) * 1000 * 60 * 60 * 24;

  const shiftTotal = shiftSec + shiftMinute + shiftHour + shiftDay;
  const t1 = d.getTime();
  const d2 = new Date(t1 + shiftTotal);

  return d2;
};

export default {
  formatFloat,
  dicFormat,
  timeStrToNum,
  syntaxHighlightJson,
  compareStringAsc,
  compareStringDes,
  shiftDate
};
