import d3 from '~/assets/d3';

const exportAsCsv = (that) => {
  const params = {
    skipHeader: false,
    columnGroups: true,
    skipFooters: false,
    skipGroups: false,
    skipPinnedTop: false,
    skipPinnedBottom: false,
    allColumns: true,
    onlySelected: false,
    suppressQuotes: true,
    fileName: 'data',
    sheetName: 'Sheet1',
    shouldRowBeSkipped: () => false,
    processCellCallback: (param) => param.value,
    processHeaderCallback: null
  };
  that.gridOptions.api.exportDataAsCsv(params);
};

const autoSizeColumns = (columnApi) => {
  const allColumnIds = [];
  columnApi.getAllColumns().forEach(function(col) {
    if (col.colDef.resizable) allColumnIds.push(col.colId);
  });
  columnApi.autoSizeColumns(allColumnIds);
};

const sizeColumnsToFit = (api) => {
  api.sizeColumnsToFit();
};

const setSizeToFitOnWindowResize = (api) => {
  window.addEventListener('resize', function _sizeColumnsToFit() {
    setTimeout(() => sizeColumnsToFit(api), 10);
  });
};

const addExtentToContext = ({ that, rowData, columns }) => {
  if (!rowData) return;
  if (!that.gridOptions.context) that.gridOptions.context = {};
  for (const { field, convert } of columns)
    that.gridOptions.context['extent_' + field] = d3.extent(
      rowData.map((e) => {
        return convert(e[field]);
      })
    );
};

const cellRendererBackgroundBar = ({
  value,
  convert = (e) => e,
  maxCol,
  minCol,
  formatter = (e) => e,
  round = null,
  mode = 'zero-left',
  colorPos = '#bcbddc',
  colorNeg = '#ffdab9',
  buffer = 0
}) => {
  const valNum = convert(value);
  const minColBuff = minCol > 0 ? minCol * (1 - buffer) : minCol * (1 + buffer);
  const maxColBuff = maxCol > 0 ? maxCol * (1 + buffer) : maxCol * (1 - buffer);
  let css;
  if (mode === 'zero-left') {
    const f = Math.round(100 * (valNum / maxColBuff), round);
    css = `background: linear-gradient(to right,${colorPos} ${f}%, transparent ${f}%, transparent 100%)`;
  } else if (mode === 'zero-center') {
    const maxAbs = Math.max(maxColBuff, -minColBuff) / 2;
    const f = Math.round(50 + (50 * (valNum / maxAbs)) / 2, round);
    let color;
    if (valNum >= 0) {
      color = colorPos;
      css = `background: linear-gradient(to right, transparent 50%, ${color} 50%, ${color} ${f}%, transparent ${f}%, transparent 100%)`;
    } else {
      color = colorNeg;
      css = `background: linear-gradient(to right, transparent ${f}%, ${color} ${f}%, ${color} 50%, transparent 50%, transparent 100%)`;
    }
  } else if (mode === 'span') {
    const f = Math.round(
      100 *
        (buffer +
          (1 - 2 * buffer) * ((valNum - minCol) / (maxCol - minCol)) +
          (valNum >= maxCol - (1 - 0.0001) ? buffer : 0)),
      round
    );
    css = `background: linear-gradient(to right,${colorPos} ${f}%, transparent ${f}%, transparent 100%)`;
  } else {
    return 'Missing config for cellRenderer';
  }
  const valDisplay = formatter(value);
  const html = `<div style="${css}">${valDisplay}<div>`;
  return html;
};

const buildMatComparator = (matOrder) => {
  const matComparator = (mat1, mat2) => matOrder[mat1] - matOrder[mat2];

  return matComparator;
};

export default {
  exportAsCsv,
  autoSizeColumns,
  sizeColumnsToFit,
  setSizeToFitOnWindowResize,
  addExtentToContext,
  cellRendererBackgroundBar,
  buildMatComparator
};
