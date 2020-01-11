import { GPU } from 'gpu.js';

const buildUnit = ({ maxIter }) => {
  const settings = {
    argumentTypes: {
      cR: 'Float',
      cI: 'Float',
      palette: 'Array'
    },
    constants: { maxIter },
    output: [1],
    loopMaxIterations: maxIter,
    graphical: false
  };

  function computeUnit(cR, cI, palette) {
    const maxIter = this.constants.maxIter;

    let zR = 0;
    let zI = 0;
    let iter = 0;
    let temp = 0;
    while (zR * zR + zI * zI < 4 && iter < maxIter) {
      temp = zR * zR - zI * zI + cR;
      zI = 2 * zR * zI + cI;
      zR = temp;
      iter++;
    }
    if (iter === maxIter) {
      return [0, 0, 0, 255];
    }
    return [
      palette[3 * iter],
      palette[3 * iter + 1],
      palette[3 * iter + 2],
      255
    ];
  }

  const gpu = new GPU();
  return gpu.createKernel(computeUnit, settings);
};

const buildComputeMandelbrot = ({
  canvasWidth,
  canvasHeight,
  maxIter,
  graphical
}) => {
  const settings = {
    argumentTypes: {
      rMin: 'Float',
      rMax: 'Float',
      iMin: 'Float',
      iMax: 'Float',
      palette: 'Array'
    },
    returnType: 'Array(4)',
    constants: { canvasWidth, canvasHeight, maxIter },
    output: [canvasWidth, canvasHeight],
    loopMaxIterations: maxIter,
    graphical
  };

  console.log(settings);

  function computeMandelbrot(rMin, rMax, iMin, iMax, palette) {
    const maxIter = this.constants.maxIter;
    const canvasWidth = this.constants.canvasWidth;
    const canvasHeight = this.constants.canvasHeight;

    const cI = iMax + (iMin - iMax) * (this.thread.y / canvasHeight);
    const cR = rMin + (rMax - rMin) * (this.thread.x / canvasWidth);

    let zR = 0;
    let zI = 0;
    let iter = 0;
    let temp = 0;
    while (zR * zR + zI * zI < 4 && iter < maxIter) {
      temp = zR * zR - zI * zI + cR;
      zI = 2 * zR * zI + cI;
      zR = temp;
      iter++;
    }
    if (iter === maxIter) {
      return [0, 0, 0, 255];
    }
    return [
      palette[3 * iter],
      palette[3 * iter + 1],
      palette[3 * iter + 2],
      255
    ];
  }

  function computeMandelbrotCanvas(rMin, rMax, iMin, iMax, palette) {
    const maxIter = this.constants.maxIter;
    const canvasWidth = this.constants.canvasWidth;
    const canvasHeight = this.constants.canvasHeight;

    const cI = iMin + (iMax - iMin) * (this.thread.y / canvasHeight);
    const cR = rMin + (rMax - rMin) * (this.thread.x / canvasWidth);

    let zR = 0;
    let zI = 0;
    let iter = 0;
    let temp = 0;
    while (zR * zR + zI * zI < 4 && iter < maxIter) {
      temp = zR * zR - zI * zI + cR;
      zI = 2 * zR * zI + cI;
      zR = temp;
      iter++;
    }
    if (iter === maxIter) {
      this.color(0, 0, 0, 1);
    } else {
      this.color(
        palette[3 * iter] / 255,
        palette[3 * iter + 1] / 255,
        palette[3 * iter + 2] / 255,
        1
      );
    }
  }

  const gpu = new GPU();
  if (graphical) return gpu.createKernel(computeMandelbrotCanvas, settings);
  else return gpu.createKernel(computeMandelbrot, settings);
};

export { buildComputeMandelbrot, buildUnit };
