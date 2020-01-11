<template>
  <v-container fluid class=" my-wrapper-block">
    <div class="d-flex flex-column align-center my-wrapper">
      <!-- <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div> -->
      <div class="subtitle-1 modt my-subtitle mb-3">
        Click/Shift+Click to zoom in/out - Press key J/K/F/R to move
        Left/Right/Down/Up.<br />
      </div>
      <div class="d-flex justify-space-between my-wrapper">
        <div class="d-flex flex-row justify-start">
          <div id="select-mode">
            <v-select
              v-model="selectedMode"
              :items="optionsMode"
              label="Compute Mode"
              hide-details
              outlined
              dense
              class="my-square-box mx-1"
            ></v-select>
          </div>
        </div>
        <div class="d-flex flex-row justify-end">
          <div id="select-height">
            <v-select
              v-model="selectedHeight"
              :items="optionsHeight"
              label="Image Height"
              hide-details
              outlined
              dense
              class="my-square-box mx-1"
            ></v-select>
          </div>
          <v-btn
            id="save-png"
            text
            small
            class="modt action-button my-button my-0 mx-1"
            @click="saveAsPng"
          >
            save as png
          </v-btn>
          <v-btn
            text
            small
            class="modt action-button my-button my-0 mx-1"
            @click="resetDraw"
          >
            reset
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-space-between my-wrapper mt-2">
        <div class="d-flex flex-row justify-start">
          <InputNumber
            v-model.number="centerRe"
            label="Center X"
            class-string="my-square-box my-control-1 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="centerIm"
            label="Center Y"
            class-string="my-square-box my-control-1 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="zoom"
            label="Zoom"
            class-string="my-square-box my-control-1 mx-1"
          ></InputNumber>
        </div>
        <div class="d-flex flex-row justify-end">
          <InputNumber
            v-model.number="fractalDims.width"
            :disabled="true"
            fmt-number="exp-2"
            label="Fractal Width"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="fractalDims.height"
            :disabled="true"
            format="exp-2"
            label="Fractal Height"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
        </div>
      </div>
      <div class="d-flex justify-space-between my-wrapper mt-2 mb-3">
        <div class="d-flex flex-row justify-start">
          <InputNumber
            v-model.number="zoomFactor"
            label="Zoom Factor"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="maxIter"
            label="Max Iterations"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="freqRed"
            label="Red Factor"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="freqGreen"
            label="Green Factor"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="freqBlue"
            label="Blue Factor"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
        </div>
        <div class="d-flex flex-row justify-end">
          <InputNumber
            v-model.number="canvasWidth"
            :disabled="true"
            label="Image Width"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="canvasHeight"
            :disabled="true"
            label="Image Height"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>

          <InputNumber
            v-model.number="runtime"
            :disabled="true"
            label="Runtime (ms)"
            class-string="my-square-box my-control-2 mx-1"
          ></InputNumber>
        </div>
      </div>
      <!-- <div class="d-flex justify-space-between my-wrapper mt-2">
        <div class="d-flex flex-row"></div>
        <div class="d-flex flex-row justify-end"></div>
      </div> -->

      <div>coords: {{ JSON.stringify(livePosFractal) }}</div>
      <div v-if="isLiveDebug">coords(%): {{ JSON.stringify(liveDebug) }}</div>

      <div id="my-wrapper-canvas" class="my-3">
        <canvas
          v-show="isWorker"
          id="my-canvas-worker"
          class="my-canvas"
        ></canvas>
      </div>
    </div>
  </v-container>
</template>

<script>
import InputNumber from '~/components/misc/input-text-field';

import WorkerJS from '~/js/workers/mandelbrot-js.worker.js';
import WorkerWASM from '~/js/workers/mandelbrot-wasm.worker.js';
import WorkerGPU from '~/js/workers/mandelbrot-gpu.worker.js';

import { buildComputeMandelbrot } from '~/js/mandelbrot-gpu';

export default {
  name: 'TabMandelbrot',
  components: { InputNumber },
  props: {},
  data() {
    return {
      canvas: null,

      centerRe: -0.5,
      centerReInit: -0.5,
      centerIm: 0,
      centerImInit: 0,
      fractalWidthInit: 4,
      zoom: 1,
      zoomInit: 1,
      zoomIn: true,
      zoomFactor: 2,

      rMax: 0,
      rMin: 0,
      iMax: 0,
      iMin: 0,

      maxIter: 1024,
      freqRed: 7,
      freqGreen: 5,
      freqBlue: 11,

      generation: 0,

      timerStart: null,
      timerEnd: null,

      livePosFractal: 'Move Mouse over Image',
      liveDebug: 'Move Mouse over Image',
      isLiveDebug: true,

      canvasWidth: 0,
      canvasHeight: 0,

      //   selectedMode: 'worker-js-row',
      selectedMode: 'mainthread-gpu-grid',
      optionsMode: [
        {
          value: 'worker-js-row',
          text: 'By Row - Web Worker - Vanilla JavaScript'
        },
        {
          value: 'worker-js-grid',
          text: 'Grid - Web Worker - Vanilla JavaScript'
        },
        {
          value: 'worker-wasm-row',
          text: 'By Row - Web Worker - AssemblyScript compiled to WebAssembly'
        },
        {
          value: 'worker-wasm-grid',
          text: 'Grid - Web Worker - AssemblyScript compiled to WebAssembly'
        },
        {
          value: 'worker-gpu-grid',
          text: 'Grid - Web Worker -  Massively parallel with gpu.js'
        },
        {
          value: 'mainthread-gpu-grid',
          text: 'Grid - Main Thread -  Massively parallel with gpu.js'
        }
      ],
      selectedHeight: 'small',
      optionsHeight: [
        { value: 'large', text: 'Large' },
        { value: 'small', text: 'Small' }
      ],

      wasmArrayBuffer: null,
      gpuKernel: null
    };
  },
  computed: {
    fractalDims() {
      return {
        width: this.rMax - this.rMin,
        height: this.iMax - this.iMin
      };
    },
    marginWidth() {
      return 200;
    },
    marginHeight() {
      return this.selectedHeight === 'small' ? 700 : 200;
    },

    isActiveTab() {
      return this.$route.name === 'index-fractals-mandelbrot';
    },
    runtime() {
      const secs = this.timerEnd - this.timerStart;
      return secs;
    },
    isWorker() {
      return this.selectedMode.split('-')[0] === 'worker';
    },
    isJs() {
      return this.selectedMode.split('-')[1] === 'js';
    },
    isWasm() {
      return this.selectedMode.split('-')[1] === 'wasm';
    },
    isGpu() {
      return this.selectedMode.split('-')[1] === 'gpu';
    },
    byRow() {
      return this.selectedMode.split('-')[2] === 'row';
    }
  },
  watch: {
    centerRe() {
      this.buildBounds();
      this.startDraw();
    },
    centerIm() {
      this.buildBounds();
      this.startDraw();
    },
    zoom() {
      this.buildBounds();
      this.startDraw();
    },
    freqRed() {
      this.reDraw();
    },
    freqGreen() {
      this.reDraw();
    },
    freqBlue() {
      this.reDraw();
    },
    maxIter() {
      this.reDraw();
    },
    selectedHeight() {
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
    },
    async selectedMode() {
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
    }
  },

  created() {
    console.log('---- created');

    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('keypress', this.keyPressed);
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.removeEventListener('keypress', this.keyPressed);
  },

  async mounted() {
    console.log('---- mounted');

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

    // debug
    window.that = this;
  },
  methods: {
    saveAsPng() {
      console.log('START saveAsPng');

      if (!this.isWorker) this.runGpuKernel();

      const a = document.createElement('a');
      a.href = this.canvas.toDataURL('image/png', 1.0);
      a.download = 'toto.png';
      document.body.appendChild(a);
      console.log(a.href);
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

    resizeGpuKernelOutput() {
      this.gpuKernel
        .setOutput([this.canvasWidth, this.canvasHeight])
        .setConstants({
          canvasWidth: this.canvasWidth,
          canvasHeight: this.canvasHeight,
          maxIter: this.maxIter
        });
    },

    runGpuKernel() {
      console.log('START runGpuKernel');

      this.timerStart = new Date().getTime();
      console.time('timer-gpu-mainthread');

      this.gpuKernel(
        this.rMin,
        this.rMax,
        this.iMin,
        this.iMax,
        this.paletteArr
      );

      this.timerEnd = new Date().getTime();
      console.timeEnd('timer-gpu-mainthread');
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
        console.log('remove canvas');
        canvasMainThread.parentNode.removeChild(canvasMainThread);
        console.log(
          'success =',
          document.getElementById('my-canvas-mainthread') === null
        );
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
        this.startDraw();
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
      this.startDraw();
    },

    processNextRow(workerId) {
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
      this.startDraw();
    },

    keyPressed(e) {
      console.log('START keyPressed');

      if (!this.isActiveTab) return;

      const letter = String.fromCharCode(e.keyCode).toUpperCase();
      console.log(letter);

      const factor = 1 / 3;
      const wShift = this.fractalDims.width * factor;
      const hShift = this.fractalDims.height * factor;

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
      }

      this.buildBounds();
      this.startDraw();
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
        x: this.rMin + this.fractalDims.width * posPct.x,
        y: this.iMax - this.fractalDims.height * posPct.y
      };
      return { rect, posPixel, posPct, posFractal };
    },

    async loadWasmArrayBuffer() {
      if (this.wasmArrayBuffer) return;

      const response = await fetch('/wasm/mandelbrot.wasm');
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

.modt.action-button.my-button {
  height: 100%;
}

.my-square-box {
  border-radius: 0;
}
.my-control-1 {
  width: 210px;
}
.my-control-2 {
  width: 110px;
}
.my-control-3 {
  width: 110px;
}
#select-mode {
  width: 600px;
}
#select-height {
  width: 120px;
}
</style>
