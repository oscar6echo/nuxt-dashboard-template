// export function test(cR: f64, cI: f64, maxIter: u32): u32 {
//   let zR: f64 = 0;
//   let zI: f64 = 0;
//   let temp: f64 = 0;
//   let iter: u32 = 0;

//   while (zR * zR + zI * zI < 4 && iter < maxIter) {
//     temp = zR * zR - zI * zI + cR;
//     zI = 2 * zR * zI + cI;
//     zR = temp;
//     iter++;
//   }
//   return iter;
// }

declare function logI(data: u32): void;
declare function logF(data: f64): void;
declare function logS(data: string): void;

export const UINT8ARRAY_ID = idof<Uint8Array>();

function mandelbrotEscapeIter(cR: f64, cI: f64, maxIter: u32): u32 {
  let zR: f64 = 0;
  let zI: f64 = 0;
  let temp: f64 = 0;
  let iter: u32 = 0;
  while (zR * zR + zI * zI < 4 && iter < maxIter) {
    temp = zR * zR - zI * zI + cR;
    zI = 2 * zR * zI + cI;
    zR = temp;
    iter++;
  }
  return iter;
}

export function computeRow(
  rMin: f64,
  rMax: f64,
  iMin: f64,
  iMax: f64,
  canvasWidth: u32,
  canvasHeight: u32,
  maxIter: u32,
  rowNo: u32,
  palette: Uint8Array
): Uint8Array {
  const arrImageData = new Uint8Array(4 * canvasWidth);

  const cI: f64 = iMax + ((iMin - iMax) * (1.0 * rowNo)) / (1.0 * canvasHeight);

  for (let j: u32 = 0; j < canvasWidth; j++) {
    const cR: f64 = rMin + ((rMax - rMin) * j) / (1.0 * canvasWidth);
    const iter = mandelbrotEscapeIter(cR, cI, maxIter);
    if (iter === maxIter) {
      arrImageData[4 * j] = 0;
      arrImageData[4 * j + 1] = 0;
      arrImageData[4 * j + 2] = 0;
      arrImageData[4 * j + 3] = 255;
    } else {
      const k: u32 = 3 * iter;
      arrImageData[4 * j] = palette[k];
      arrImageData[4 * j + 1] = palette[k + 1];
      arrImageData[4 * j + 2] = palette[k + 2];
      arrImageData[4 * j + 3] = 255;
    }
  }
  return arrImageData;
}

export function computeGrid(
  rMin: f64,
  rMax: f64,
  iMin: f64,
  iMax: f64,
  canvasWidth: u32,
  canvasHeight: u32,
  maxIter: u32,
  palette: Uint8Array
): Uint8Array {
  const arrImageData = new Uint8Array(4 * canvasWidth * canvasHeight);

  for (let i: u32 = 0; i < canvasHeight; i++) {
    const cI: f64 = iMax + ((iMin - iMax) * (1.0 * i)) / (1.0 * canvasHeight);
    for (let j: u32 = 0; j < canvasWidth; j++) {
      const cR: f64 = rMin + ((rMax - rMin) * j) / (1.0 * canvasWidth);
      const iter = mandelbrotEscapeIter(cR, cI, maxIter);
      if (iter === maxIter) {
        arrImageData[4 * (i * canvasWidth + j)] = 0;
        arrImageData[4 * (i * canvasWidth + j) + 1] = 0;
        arrImageData[4 * (i * canvasWidth + j) + 2] = 0;
        arrImageData[4 * (i * canvasWidth + j) + 3] = 255;
      } else {
        const k: u32 = 3 * iter;
        arrImageData[4 * (i * canvasWidth + j)] = palette[k];
        arrImageData[4 * (i * canvasWidth + j) + 1] = palette[k + 1];
        arrImageData[4 * (i * canvasWidth + j) + 2] = palette[k + 2];
        arrImageData[4 * (i * canvasWidth + j) + 3] = 255;
      }
    }
  }
  return arrImageData;
}
