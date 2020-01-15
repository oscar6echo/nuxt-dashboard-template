<template>
  <div class="d-flex flex-column align-center my-wrapper">
    <div>coords: {{ JSON.stringify(livePosFractal) }}</div>
    <div>coords(%): {{ JSON.stringify(liveDebug) }}</div>

    <div id="my-wrapper-canvas" class="my-3">
      <canvas
        v-show="isWorker"
        id="my-canvas-worker"
        class="my-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script>
import {
  getStateFromUrl,
  updateStateInUrl,
  compareFlatState
} from '~/js/generic/app-state';
import log from '~/js/generic/log';

import WorkerJS from '~/js/workers/mandelbrot-js.worker.js';
import WorkerWASM from '~/js/workers/mandelbrot-wasm.worker.js';
import WorkerGPU from '~/js/workers/mandelbrot-gpu.worker.js';

import { buildComputeMandelbrot } from '~/js/mandelbrot-gpu';

export default {
  name: 'TabMandelbrotDisplay',
  components: {},
  props: {},
  data() {
    return {
      fractalWidthInit: 4,
      zoomInit: 1,
      centerReInit: -0.5,
      centerImInit: 0,
      //   selectedModeInit: 'mainthread-gpu-grid',
      selectedModeInit: 'worker-js-row',

      rMax: null,
      rMin: null,
      iMax: null,
      iMin: null,

      selectedMode: null,
      selectedHeight: null,

      livePosFractal: 'Move Mouse over Image',
      liveDebug: 'Move Mouse over Image',

      state: {},
      lastState: null,
      isWorker: false,
      isMounted: false
    };
  },
  computed: {
    url() {
      return this.$route.fullPath;
    },
    isActiveTab() {
      return this.$route.name === 'index-fractals-mandelbrot';
    },
    fractalWidth() {
      return this.rMax - this.rMin;
    },
    fractalHeight() {
      return this.iMax - this.iMin;
    },
    marginWidth() {
      return 200;
    },
    marginHeight() {
      switch (this.selectedHeight) {
        case 'smallest':
          return 800;
        case 'small':
          return 600;
        case 'large':
          return 200;
        case 'largest':
          return 0;
        default:
          return null;
      }
    }
  },
  watch: {
    url: {
      handler() {
        log.watchStart(this, 'url', [JSON.stringify(this.url)]);
        if (this.isMounted) {
          this.updateDraw();
        }
      },
      immediate: true
    }
  },

  created() {
    log.hookStart(this, 'created');

    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('keypress', this.keyPressed);
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.removeEventListener('keypress', this.keyPressed);
  },

  mounted() {
    log.hookStart(this, 'mounted');

    this.generation = 0;
    this.updateDraw();
    this.isMounted = true;
  },

  methods: {
    pushStateToUrl() {
      const { centerRe, centerIm, zoom } = this;
      log.methodStart(this, 'pushStateToUrl', [centerRe, centerIm, zoom]);

      updateStateInUrl({
        that: this,
        update: {
          mandelbrot: {
            centerRe,
            centerIm,
            zoom
          }
        }
      });
    },

    removeStateFromUrl() {
      log.methodStart(this, 'removeStateFromUrl', []);

      updateStateInUrl({
        that: this,
        remove: ['mandelbrot']
      });
    },

    async updateDraw() {
      log.methodStart(this, 'updateDraw', [this.url]);
      const state = getStateFromUrl(this);

      console.log(state);
      if (!state.mandelbrot) return;

      const data = state.mandelbrot;
      this.state.selectedMode = data.selectedMode;
      this.state.selectedHeight = data.selectedHeight;
      this.state.centerRe = +data.centerRe;
      this.state.centerIm = +data.centerIm;
      this.state.zoom = +data.zoom;
      this.state.zoomFactor = +data.zoomFactor;
      this.state.maxIter = +data.maxIter;
      this.state.freqRed = +data.freqRed;
      this.state.freqGreen = +data.freqGreen;
      this.state.freqBlue = +data.freqBlue;

      const diff = compareFlatState(this.state, this.lastState);
      diff.update(this);

      if (this.lastState === null) {
        // init

        console.log('-'.repeat(100));
        console.log('MODE selectedMode');

        this.updateFlags();
        this.buildPalette();
        this.buildCanvasDims();
        this.buildBounds();

        if (this.isWorker) {
          console.log('--> WORKER');
          this.buildCanvasWorker();
          this.addListenersToCanvas();
          this.buildCanvasData();
          await this.buildWorkers();
          this.startDraw();
        } else {
          console.log('--> MAIN THREAD');
          this.buildGpuKernel();
          this.runGpuKernel();
          this.attachGpuKernelCanvasToDom();
          this.addListenersToCanvas();
        }

        window.that = this;
      } else if (diff.contains('selectedMode')) {
        // update mode

        console.log('-'.repeat(100));
        console.log('MODE selectedMode');

        this.updateFlags();

        this.removeListenersFromCanvas();
        if (this.isWorker) {
          console.log('-->> WORKER');
          this.buildCanvasWorker();
          this.addListenersToCanvas();
          this.buildCanvasData();
          await this.buildWorkers();
          this.startDraw();
        } else {
          console.log('-->> MAIN THREAD');
          this.removeGpuKernelCanvasFromDom();
          this.buildGpuKernel();
          this.runGpuKernel();
          this.attachGpuKernelCanvasToDom();
          this.addListenersToCanvas();
        }
      } else if (diff.contains('selectedHeight')) {
        // update img height

        console.log('-'.repeat(100));
        console.log('MODE selectedHeight');

        this.buildCanvasDims();
        this.buildBounds();
        this.removeListenersFromCanvas();
        if (this.isWorker) {
          console.log('-->> WORKER');
          this.addListenersToCanvas();
          this.reDraw();
        } else {
          console.log('-->> MAIN THREAD');
          this.removeGpuKernelCanvasFromDom();
          this.buildGpuKernel();
          this.runGpuKernel();
          this.attachGpuKernelCanvasToDom();
          this.addListenersToCanvas();
        }
      } else if (
        diff.containsAny([
          'centerRe',
          'centerIm',
          'zoom',
          'maxIter',
          'freqRed',
          'freqGreen',
          'freqBue'
        ])
      ) {
        // basic redraw

        console.log('-'.repeat(100));
        console.log('MODE all other');

        this.buildPalette();
        this.buildBounds();
        if (this.isWorker) {
          this.updateWorker();
          this.startDraw();
        } else {
          this.buildGpuKernel();
          this.runGpuKernel();
          this.removeGpuKernelCanvasFromDom();
          this.attachGpuKernelCanvasToDom();
          this.addListenersToCanvas();
        }
      }

      this.lastState = { ...this.state };
      this.reportToParent();
    },

    updateFlags() {
      this.isWorker = this.selectedMode.split('-')[0] === 'worker';
      this.isJs = this.selectedMode.split('-')[1] === 'js';
      this.isWasm = this.selectedMode.split('-')[1] === 'wasm';
      this.isGpu = this.selectedMode.split('-')[1] === 'gpu';
      this.byRow = this.selectedMode.split('-')[2] === 'row';
    },

    reportToParent(showReset = true) {
      console.log('START reportToParent');

      const { canvasWidth, canvasHeight, fractalWidth, fractalHeight } = this;
      const report = {
        canvasWidth,
        canvasHeight,
        fractalWidth,
        fractalHeight,
        showReset
      };
      this.$emit('report', report);
    },

    runtimeToParent() {
      console.log('START runtimeToParent');

      const runtime = this.timerEnd - this.timerStart;
      this.$emit('runtime', runtime);
    },

    saveAsPng() {
      console.log('START saveAsPng');

      if (!this.isWorker) this.runGpuKernel();

      const a = document.createElement('a');
      a.href = this.canvas.toDataURL('image/png', 1.0);
      a.download = 'toto.png';
      document.body.appendChild(a);
      //   console.log(a.href);
      a.click();
      a.parentElement.removeChild(a);
    },

    buildCanvasDims() {
      console.log('START buildCanvasDims');
      this.canvasWidth = window.innerWidth - this.marginWidth;
      this.canvasHeight = window.innerHeight - this.marginHeight;

      const { canvasWidth, canvasHeight } = this;
      console.log({ canvasWidth, canvasHeight });
    },

    buildCanvasWorker() {
      console.log('START buildCanvasWorker');

      const canvasMainThread = document.getElementById('my-canvas-mainthread');
      if (canvasMainThread) {
        canvasMainThread.parentNode.removeChild(canvasMainThread);
      }

      this.canvas = document.getElementById('my-canvas-worker');
      console.log(this.canvas);
    },

    removeListenersFromCanvas() {
      this.canvas.removeEventListener('click', this._listenerClick);
      this.canvas.removeEventListener('mousemove', this._listenerMove);
    },

    addListenersToCanvas() {
      console.log('START addListenersToCanvas');

      this._listenerClick = (evt) => {
        this.zoomIn = !!evt.shiftKey;
        this.clickCanvas(evt);
      };
      this.canvas.addEventListener('click', this._listenerClick);

      this._listenerMove = (evt) => {
        const { posFractal, posPct } = this.getPoint(evt);
        this.livePosFractal = {
          x: posFractal.x,
          y: posFractal.y
        };
        this.liveDebug = {
          fracX: posPct.x,
          fracY: posPct.y
        };
      };
      this.canvas.addEventListener('mousemove', this._listenerMove);
    },

    buildCanvasData() {
      console.log('START buildCanvasData');
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;

      this.ctx = this.canvas.getContext('2d');
      this.rowData = this.ctx.createImageData(this.canvas.width, 1);
      this.gridData = this.ctx.createImageData(
        this.canvas.width,
        this.canvas.height
      );

      console.log(this.rowData);
      console.log(this.gridData);
    },

    buildGpuKernel() {
      console.log('START buildGpuKernel');
      const { canvasWidth, canvasHeight, maxIter } = this;
      console.log({ canvasWidth, canvasHeight, maxIter });
      if (this.gpuKernel) this.gpuKernel.destroy();
      this.gpuKernel = buildComputeMandelbrot({
        canvasWidth,
        canvasHeight,
        maxIter,
        graphical: true
      });
      console.log(this.gpuKernel);
    },

    runGpuKernel() {
      console.log('START runGpuKernel');

      this.timerStart = new Date().getTime();
      console.time('timer-gpu-mainthread');

      const test = {
        rMin: this.rMin,
        rMax: this.rMax,
        iMin: this.iMin,
        iMax: this.iMax,
        paletteArr: this.paletteArr
      };
      console.log(test);
      console.log(JSON.stringify(test));

      window.gpuKernel = this.gpuKernel;
      console.log(this.gpuKernel);
      console.log(this.gpuKernel.constants);

      //   const that = this;
      //   setTimeout(
      //     () =>
      //       that.gpuKernel(
      //         this.rMin,
      //         this.rMax,
      //         this.iMin,
      //         this.iMax,
      //         this.paletteArr
      //       ),
      //     10
      //   );
      this.gpuKernel(
        this.rMin,
        this.rMax,
        this.iMin,
        this.iMax,
        this.paletteArr
      );

      this.timerEnd = new Date().getTime();
      console.timeEnd('timer-gpu-mainthread');
      this.runtimeToParent();
    },

    attachGpuKernelCanvasToDom() {
      console.log('START attachGpuKernelCanvasToDom');

      this.canvas = this.gpuKernel.canvas;
      this.canvas.id = 'my-canvas-mainthread';
      this.canvas.classList.add('my-canvas');
      document.getElementById('my-wrapper-canvas').append(this.canvas);
    },

    removeGpuKernelCanvasFromDom() {
      console.log('START removeGpuKernelCanvasFromDom');
      const canvasMainThread = document.getElementById('my-canvas-mainthread');
      if (canvasMainThread) {
        // console.log('remove canvas');
        canvasMainThread.parentNode.removeChild(canvasMainThread);
        // console.log(
        //   'success =',
        //   document.getElementById('my-canvas-mainthread') === null
        // );
      }
    },

    async buildWorkers() {
      const promises = [];
      if (this.isJs) {
        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
          promises.push(this.createWorker(i));
        }
      } else if (this.isWasm) {
        await this.loadWasmArrayBuffer();

        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
          promises.push(this.createWorker(i));
        }
      } else if (this.isGpu) {
        promises.push(this.createWorker(0));
      }

      const that = this;
      await Promise.all(promises).then((data) => (that.workers = data));

      console.log(this.workers);
    },

    createWorker(workerId) {
      const that = this;
      return new Promise(function(resolve, reject) {
        const SelectedWorker = that.isJs
          ? WorkerJS
          : that.isWasm
          ? WorkerWASM
          : that.isGpu
          ? WorkerGPU
          : 'IMPOSSIBLE';
        const worker = new SelectedWorker();
        worker.idle = true;
        worker.id = workerId;

        worker.onmessage = function(evt) {
          worker.idle = true;

          switch (evt.data.msgType) {
            case 'ready':
              resolve(worker);
              return;
            case 'update':
              return;
            case 'run-row':
              that.receiveRow(evt.data);
              return;
            case 'run-grid':
              that.receiveGrid(evt.data);
          }
        };

        worker.onerror = function(evt) {
          worker.idle = true;
          console.log(`Error from Web Worker: ${evt.message}`);
          reject(evt.error);
        };

        const canvasDims = {
          width: that.canvasWidth,
          height: that.canvasHeight
        };
        const payload = {
          msgType: 'init',
          workerId,
          canvasDims,
          palette: that.palette,
          paletteArr: that.paletteArr,
          maxIter: that.maxIter,
          wasmArrayBuffer: that.isWasm ? that.wasmArrayBuffer : null
        };
        worker.postMessage(payload);
      });
    },

    updateWorker() {
      const canvasDims = {
        width: this.canvasWidth,
        height: this.canvasHeight
      };
      for (const worker of this.workers)
        worker.postMessage({
          msgType: 'update',
          maxIter: this.maxIter,
          palette: this.palette,
          paletteArr: this.paletteArr,
          canvasDims
        });
    },

    startDraw() {
      console.log('START startDraw');

      this.generation++;

      if (this.isWorker) {
        this.timerStart = new Date().getTime();
        this.timerEnd = this.timerStart;
        this.runtimeToParent();

        if (this.byRow) {
          console.log('BY ROW');
          this.rowNoCenter = Math.round(this.canvas.height / 2);
          this.nextRowUp = this.rowNoCenter - 1;
          this.nextRowDown = this.rowNoCenter;

          for (let workerId = 0; workerId < this.workers.length; workerId++) {
            this.processNextRow(workerId);
          }
        } else {
          console.log('WHOLE GRID');
          this.processGrid();
        }
      } else {
        this.runGpuKernel();
      }
    },

    reDraw() {
      console.log('START reDraw');

      this.buildPalette();
      if (this.isWorker) {
        this.updateWorker();
        this.pushStateToUrl();
        // this.startDraw();
      } else {
        this.buildGpuKernel();
        this.runGpuKernel();
        this.removeGpuKernelCanvasFromDom();
        this.attachGpuKernelCanvasToDom();
        this.addListenersToCanvas();
      }
    },

    resetDraw() {
      this.centerRe = this.centerReInit;
      this.centerIm = this.centerImInit;
      this.zoom = this.zoomInit;

      this.buildBounds();
      this.pushStateToUrl();
    },

    clearUrl() {
      this.removeStateFromUrl();
      this.reportToParent(false);
    },

    processNextRow(workerId) {
      console.log('processNextRow');
      const worker = this.workers[workerId];
      let rowNo;
      if (workerId % 2 === 0) {
        rowNo = this.nextRowDown;
        this.nextRowDown++;
      } else {
        rowNo = this.nextRowUp;
        this.nextRowUp--;
      }
      if (rowNo < 0 || rowNo >= this.canvas.height) {
        this.timerEnd = new Date().getTime();
        this.runtimeToParent();
        return;
      }

      const { rMin, rMax, iMin, iMax, maxIter, generation } = this;
      const canvasDims = {
        width: this.canvasWidth,
        height: this.canvasHeight
      };
      worker.idle = true;
      worker.postMessage({
        msgType: 'run-row',
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims,
        maxIter,
        generation,
        rowNo,
        workerId
      });
    },

    receiveRow(data) {
      //   console.log('receiveRow');
      const { generation, rowNo, workerId, arrImageDataRow } = data;

      if (generation !== this.generation) return;

      this.rowData.data.set(arrImageDataRow, 0);
      this.ctx.putImageData(this.rowData, 0, rowNo);
      this.processNextRow(workerId);
    },

    processGrid() {
      const worker = this.workers[0];

      const { rMin, rMax, iMin, iMax, maxIter, generation } = this;
      const canvasDims = {
        width: this.canvasWidth,
        height: this.canvasHeight
      };
      worker.idle = true;
      worker.postMessage({
        msgType: 'run-grid',
        rMin,
        rMax,
        iMin,
        iMax,
        canvasDims,
        maxIter,
        generation
      });
    },

    receiveGrid(data) {
      console.log('START receiveGrid');
      const { generation, arrImageDataGrid } = data;

      if (generation !== this.generation) return;

      this.gridData.data.set(arrImageDataGrid, 0);
      this.ctx.putImageData(this.gridData, 0, 0);
      this.timerEnd = new Date().getTime();
      this.runtimeToParent();
    },

    buildPalette() {
      this.palette = [];
      const wrap = (x) => {
        const remainder = x % 255;
        const quotient = (x - remainder) / 255;
        if (quotient % 2 === 0) return remainder;
        return 255 - remainder;
      };
      for (let i = 0; i <= this.maxIter; i++) {
        this.palette.push({
          red: wrap(this.freqRed * i),
          green: wrap(this.freqGreen * i),
          blue: wrap(this.freqBlue * i)
        });
      }

      this.buildPaletteArray();
    },

    buildPaletteArray() {
      this.paletteArr = new Uint8Array(3 * this.palette.length);
      for (const [i, color] of Object.entries(this.palette)) {
        this.paletteArr[3 * i] = color.red;
        this.paletteArr[3 * i + 1] = color.green;
        this.paletteArr[3 * i + 2] = color.blue;
      }
    },

    buildBounds() {
      console.log('START buildBounds');

      const newWidth = this.fractalWidthInit / this.zoom;
      const newHeight = newWidth * (this.canvasHeight / this.canvasWidth);

      this.rMin = this.centerRe - newWidth / 2;
      this.rMax = this.centerRe + newWidth / 2;
      this.iMin = this.centerIm - newHeight / 2;
      this.iMax = this.centerIm + newHeight / 2;

      console.log({
        rMin: this.rMin,
        rMax: this.rMax,
        iMin: this.iMin,
        iMax: this.iMax
      });
    },

    clickCanvas(evt) {
      console.log('START clickCanvas');

      const { posFractal } = this.getPoint(evt);
      console.log(posFractal);

      this.centerRe = posFractal.x;
      this.centerIm = posFractal.y;

      const factor = this.zoomIn ? 1.0 / this.zoomFactor : this.zoomFactor;
      this.zoom *= factor;

      this.buildBounds();
      this.reportToParent();
      this.pushStateToUrl();
    },

    keyPressed(e) {
      console.log('START keyPressed');

      if (!this.isActiveTab) return;

      const letter = String.fromCharCode(e.keyCode).toUpperCase();
      console.log(letter);

      const factor = 1 / 3;
      const wShift = this.fractalWidth * factor;
      const hShift = this.fractalHeight * factor;

      switch (letter) {
        case 'J':
          this.centerRe += -wShift;
          break;
        case 'K':
          this.centerRe += +wShift;
          break;
        case 'F':
          this.centerIm += -hShift;
          break;
        case 'R':
          this.centerIm += +hShift;
          break;
        default:
          return;
      }

      this.buildBounds();
      this.reportToParent();
      this.pushStateToUrl();
    },

    getPoint(evt) {
      const rect = this.canvas.getBoundingClientRect();
      const posPixel = {
        x: evt.clientX - rect.left - this.canvas.clientLeft,
        y: evt.clientY - rect.top - this.canvas.clientTop
      };
      const posPct = {
        x: posPixel.x / rect.width,
        y: posPixel.y / rect.height
      };
      const posFractal = {
        x: this.rMin + this.fractalWidth * posPct.x,
        y: this.iMax - this.fractalHeight * posPct.y
      };
      return { rect, posPixel, posPct, posFractal };
    },

    async loadWasmArrayBuffer() {
      if (this.wasmArrayBuffer) return;

      const name = 'wasm/mandelbrot.wasm';
      let uri = process.env.CDN_HOST;
      if (process.env.CDN_PORT) uri += ':' + process.env.CDN_PORT;
      uri += process.env.CDN_PREFIX + '/' + name;

      //   const hostname = process.env.CDN_HOSTNAME;
      //   const prefix = process.env.CDN_LOCAL ? '/' : hostname + '/';
      //   const uri = prefix + name;

      const response = await fetch(uri);
      this.wasmArrayBuffer = await response.arrayBuffer();
      console.log('wasmArrayBuffer');
      console.log(this.wasmArrayBuffer);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-top: 50px;
  padding-left: 50px;
  padding-right: 50px;
}
.my-wrapper {
  width: 100%;
}
</style>
