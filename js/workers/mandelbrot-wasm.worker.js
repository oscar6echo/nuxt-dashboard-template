console.log('start mandelbrot-wasm.worker.js');

if (!WebAssembly.instantiateStreaming) {
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    const wasModule = await WebAssembly.instantiate(source, importObject);
    return wasModule;
  };
}

let wasm = null;
let activePalette;
const loader = require('assemblyscript/lib/loader');

const importObj = {
  utils: {
    logI(data) {
      console.log('Log() - ' + data);
    },
    logF(data) {
      console.log('Log() - ' + data);
    },
    logS(data) {
      console.log('Log() - ' + wasm.__getString(data));
    }
  },
  env: {
    abort(msg, file, line, column) {
      // wasm.__getString() is added by assemblyscript's loader: https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader
      console.error(
        'abort: (' +
          wasm.__getString(msg) +
          ') at ' +
          wasm.__getString(file) +
          ':' +
          line +
          ':' +
          column
      );
    },
    trace(msg, n) {
      console.log(
        'trace: ' +
          wasm.__getString(msg) +
          (n ? ' ' : '') +
          Array.prototype.slice.call(arguments, 2, 2 + n).join(', ')
      );
    }
  }
};

const paletteToArray = (paletteIn) => {
  const paletteOut = new Uint8Array(3 * paletteIn.length);
  for (const [i, color] of Object.entries(paletteIn)) {
    paletteOut[3 * i] = color.red;
    paletteOut[3 * i + 1] = color.green;
    paletteOut[3 * i + 2] = color.blue;
  }
  return paletteOut;
};

self.onmessage = async ({
  data: {
    msgType,
    palette,
    wasmArrayBuffer,
    rMin,
    rMax,
    iMin,
    iMax,
    canvasDims,
    maxIter,
    generation,
    rowNo,
    workerId
  }
}) => {
  switch (msgType) {
    case 'init': {
      console.log('start loader.instantiate');
      wasm = await loader.instantiate(wasmArrayBuffer, importObj);

      activePalette = wasm.__retain(
        wasm.__allocArray(wasm.UINT8ARRAY_ID, paletteToArray(palette))
      );

      self.postMessage({
        msgType: 'ready'
      });
      return;
    }

    case 'update': {
      if (palette)
        activePalette = wasm.__retain(
          wasm.__allocArray(wasm.UINT8ARRAY_ID, paletteToArray(palette))
        );

      self.postMessage({
        msgType: 'update'
      });
      return;
    }

    case 'run-row': {
      if (!wasm) throw new Error('wasm not initialized');
      if (!activePalette) throw new Error('missing palette');

      const resultRow = wasm.computeRow(
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims.width,
        canvasDims.height,
        maxIter,
        rowNo,
        activePalette
      );
      const arrImageDataRow = wasm.__getUint8Array(resultRow);

      self.postMessage(
        { msgType: 'run-row', generation, rowNo, workerId, arrImageDataRow },
        [arrImageDataRow.buffer]
      );
      return;
    }

    case 'run-grid': {
      if (!wasm) throw new Error('wasm not initialized');
      if (!activePalette) throw new Error('missing palette');

      const resultGrid = wasm.computeGrid(
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims.width,
        canvasDims.height,
        maxIter,
        activePalette
      );
      const arrImageDataGrid = wasm.__getUint8Array(resultGrid);

      self.postMessage({ msgType: 'run-grid', generation, arrImageDataGrid }, [
        arrImageDataGrid.buffer
      ]);
    }
  }
};
