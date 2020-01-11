import { GPU } from 'gpu.js';

const buildComputeJulia = ({ canvasWidth, canvasHeight, maxIter }) => {
  const settings = {
    argumentTypes: {
      cR: 'Float',
      cI: 'Float',
      rMin: 'Float',
      rMax: 'Float',
      iMin: 'Float',
      iMax: 'Float',
      palette: 'Array'
    },
    constants: { canvasWidth, canvasHeight, maxIter },
    output: [canvasWidth, canvasHeight],
    loopMaxIterations: maxIter,
    graphical: true
  };

  console.log(settings);

  function computeJuliaCanvas(cR, cI, rMin, rMax, iMin, iMax, palette) {
    const maxIter = this.constants.maxIter;
    const canvasWidth = this.constants.canvasWidth;
    const canvasHeight = this.constants.canvasHeight;

    let zI = iMin + (iMax - iMin) * (this.thread.y / canvasHeight);
    let zR = rMin + (rMax - rMin) * (this.thread.x / canvasWidth);

    // let zR = 0;
    // let zI = 0;
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
  return gpu.createKernel(computeJuliaCanvas, settings);
};

export { buildComputeJulia };
