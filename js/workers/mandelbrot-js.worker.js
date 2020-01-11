const mandelbrotEscapeIter = ({ cR, cI, maxIter }) => {
  let [zR, zI] = [0, 0];
  let iter = 0;
  while (zR * zR + zI * zI < 4 && iter < maxIter) {
    [zR, zI] = [zR * zR - zI * zI + cR, 2 * zR * zI + cI];
    iter++;
  }
  return iter;
};

const computeRow = ({ rMin, rMax, iMin, iMax, canvasDims, maxIter, rowNo }) => {
  const cI = iMax + ((iMin - iMax) * rowNo) / canvasDims.height;
  const arr = new Uint8Array(4 * canvasDims.width);

  for (let j = 0; j < canvasDims.width; j++) {
    const cR = rMin + ((rMax - rMin) * j) / canvasDims.width;
    const iter = mandelbrotEscapeIter({ cR, cI, maxIter });
    const color =
      iter === maxIter ? { red: 0, green: 0, blue: 0 } : activePalette[iter];
    arr[4 * j] = color.red;
    arr[4 * j + 1] = color.green;
    arr[4 * j + 2] = color.blue;
    arr[4 * j + 3] = 255;
  }
  return arr;
};

const computeGrid = ({ rMin, rMax, iMin, iMax, canvasDims, maxIter }) => {
  const arr = new Uint8Array(4 * canvasDims.width * canvasDims.height);

  for (let i = 0; i < canvasDims.height; i++) {
    const cI = iMax + ((iMin - iMax) * i) / canvasDims.height;
    for (let j = 0; j < canvasDims.width; j++) {
      const cR = rMin + ((rMax - rMin) * j) / canvasDims.width;
      const iter = mandelbrotEscapeIter({ cR, cI, maxIter });
      const color =
        iter === maxIter ? { red: 0, green: 0, blue: 0 } : activePalette[iter];
      arr[4 * (i * canvasDims.width + j)] = color.red;
      arr[4 * (i * canvasDims.width + j) + 1] = color.green;
      arr[4 * (i * canvasDims.width + j) + 2] = color.blue;
      arr[4 * (i * canvasDims.width + j) + 3] = 255;
    }
  }
  return arr;
};

let activePalette = null;

self.onmessage = ({
  data: {
    msgType,
    palette,
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
      activePalette = palette;

      self.postMessage({
        msgType: 'ready'
      });
      return;
    }

    case 'update': {
      if (palette) activePalette = palette;

      self.postMessage({
        msgType: 'update'
      });
      return;
    }

    case 'run-row': {
      if (!activePalette) throw new Error('missing palette');

      const arrImageDataRow = computeRow({
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims,
        maxIter,
        rowNo
      });

      self.postMessage(
        { msgType: 'run-row', generation, rowNo, workerId, arrImageDataRow },
        [arrImageDataRow.buffer]
      );
      return;
    }

    case 'run-grid': {
      if (!activePalette) throw new Error('missing palette');

      const arrImageDataGrid = computeGrid({
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims,
        maxIter
      });

      self.postMessage({ msgType: 'run-grid', generation, arrImageDataGrid }, [
        arrImageDataGrid.buffer
      ]);
    }
  }
};
