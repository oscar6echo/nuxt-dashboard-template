import { buildComputeMandelbrot } from '~/js/mandelbrot-gpu';

let activePalette = null;
let activeCanvasWidth = null;
let activeCanvasHeight = null;
let activeMaxIter = null;
let computeGrid = null;

self.onmessage = ({
  data: {
    msgType,
    paletteArr,
    rMin,
    rMax,
    iMin,
    iMax,
    canvasDims,
    maxIter,
    generation
  }
}) => {
  switch (msgType) {
    case 'init': {
      activePalette = paletteArr;
      activeMaxIter = maxIter;
      activeCanvasWidth = canvasDims.width;
      activeCanvasHeight = canvasDims.height;

      computeGrid = buildComputeMandelbrot({
        canvasWidth: activeCanvasWidth,
        canvasHeight: activeCanvasHeight,
        maxIter: activeMaxIter,
        graphical: false
      });

      self.postMessage({
        msgType: 'ready'
      });
      return;
    }

    case 'update': {
      if (maxIter) activeMaxIter = maxIter;
      if (paletteArr) activePalette = paletteArr;
      if (canvasDims) {
        activeCanvasWidth = canvasDims.width;
        activeCanvasHeight = canvasDims.height;
      }

      computeGrid = buildComputeMandelbrot({
        canvasWidth: activeCanvasWidth,
        canvasHeight: activeCanvasHeight,
        maxIter: activeMaxIter,
        graphical: false
      });

      self.postMessage({
        msgType: 'udpate'
      });
      return;
    }

    case 'run-grid': {
      if (!activePalette) throw new Error('missing palette');
      if (!computeGrid) throw new Error('computeGrid not built');

      console.time('timer-gpu');
      const result = computeGrid(rMin, rMax, iMin, iMax, activePalette);
      console.timeEnd('timer-gpu');

      const arrImageDataGrid = new Uint8Array(
        4 * canvasDims.width * canvasDims.height
      );
      for (let j = 0; j < canvasDims.height; j++) {
        for (let i = 0; i < canvasDims.width; i++) {
          for (let k = 0; k < 4; k++) {
            arrImageDataGrid[4 * (j * canvasDims.width + i) + k] =
              result[j][i][k];
          }
        }
      }

      self.postMessage({ msgType: 'run-grid', generation, arrImageDataGrid }, [
        arrImageDataGrid.buffer
      ]);
    }
  }
};
