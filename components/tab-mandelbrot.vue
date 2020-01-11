<template>
  <v-container fluid class="my-wrapper-block">
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
            @click="clearUrl"
          >
            clear url
          </v-btn>
          <v-btn
            v-show="showReset"
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
            v-model.number="fractalWidth"
            :disabled="true"
            fmt-number="exp-2"
            label="Fractal Width"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="fractalHeight"
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

      <div class="d-flex justify-space-between my-wrapper">
        <div class="d-flex flex-row justify-start">
          <div id="select-point">
            <v-select
              v-model="selectedPoint"
              :items="optionsPoints"
              label="Guided Tour"
              hide-details
              outlined
              dense
              class="my-square-box mx-1"
            ></v-select>
          </div>
        </div>
        <div class="d-flex flex-row justify-end"></div>
      </div>

      <MandelbrotDisplay
        ref="mandelbrot"
        class="my-3"
        @report="report = $event"
        @runtime="runtime = $event"
      />
    </div>
  </v-container>
</template>

<script>
import InputNumber from '~/components/misc/input-text-field';
import MandelbrotDisplay from '~/components/tab-mandelbrot-display';

import { getStateFromUrl, updateStateInUrl } from '~/js/generic/app-state';
import log from '~/js/generic/log';

export default {
  name: 'TabMandelbrot',
  components: { InputNumber, MandelbrotDisplay },
  props: {},
  data() {
    return {
      centerRe: -0.5,
      centerIm: 0,
      zoom: 1,

      zoomFactor: 2,
      maxIter: 1024,
      freqRed: 7,
      freqGreen: 5,
      freqBlue: 11,

      fractalWidth: 0,
      fractalHeight: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      runtime: 0,

      report: {},
      showReset: true,

      selectedMode: 'mainthread-gpu-grid',
      //   selectedMode: 'worker-js-row',
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
        { value: 'smallest', text: 'Smallest' },
        { value: 'small', text: 'Small' },
        { value: 'large', text: 'Large' },
        { value: 'largest', text: 'Largest' }
      ],

      selectedPoint: null,
      optionsPoints: [
        { value: null, text: 'Select Point of View' },
        { value: 'A', text: 'Point Alpha' },
        { value: 'B', text: 'Point Beta' },
        { value: 'C', text: 'Point Gamma' }
      ],
      dicPoints: {
        A: {
          centerRe: -1.1453076095461656,
          centerIm: 0.2674573919209704,
          zoom: 2048,
          maxIter: 10000
        },
        B: {
          centerRe: 0.3250562044003387,
          centerIm: 0.03511290035337347,
          zoom: 8192,
          maxIter: 15000
        },
        C: {
          centerRe: -0.5,
          centerIm: 0,
          zoom: 1.3,
          maxIter: 2000,
          freqRed: 70,
          freqGreen: 6
        }
      }
    };
  },
  computed: {
    url() {
      return this.$route.fullPath;
    }
  },
  watch: {
    url(newVal) {
      log.watchStart(this, 'url', [newVal]);
      this.loadStateFromUrl();
    },
    report(newVal, oldVal) {
      log.watchStart(this, 'report', [newVal, oldVal]);
      this.canvasWidth = this.report.canvasWidth;
      this.canvasHeight = this.report.canvasHeight;
      this.fractalWidth = this.report.fractalWidth;
      this.fractalHeight = this.report.fractalHeight;
      this.showReset = this.report.showReset;
    },
    selectedMode() {
      log.watchStart(this, 'selectedMode');
      this.pushStateToUrl();
    },
    selectedHeight() {
      log.watchStart(this, 'selectedHeight');
      this.pushStateToUrl();
    },
    selectedPoint() {
      const point = this.dicPoints[this.selectedPoint];
      for (const [k, v] of Object.entries(point)) {
        this[k] = v;
      }
      this.pushStateToUrl();
    },

    centerRe() {
      log.watchStart(this, 'centerRe');
      this.pushStateToUrl();
    },
    centerIm() {
      log.watchStart(this, 'centerIm');
      this.pushStateToUrl();
    },
    zoom() {
      log.watchStart(this, 'zoom');
      this.pushStateToUrl();
    },
    zoomFactor() {
      log.watchStart(this, 'zoomFactor');
      this.pushStateToUrl();
    },
    maxIter() {
      log.watchStart(this, 'maxIter');
      this.pushStateToUrl();
    },
    freqRed() {
      log.watchStart(this, 'freqRed');
      this.pushStateToUrl();
    },
    freqGreen() {
      log.watchStart(this, 'freqGreen');
      this.pushStateToUrl();
    },
    freqBlue() {
      log.watchStart(this, 'freqBlue');
      this.pushStateToUrl();
    }
  },

  created() {
    log.hookStart(this, 'created');
  },

  mounted() {
    log.hookStart(this, 'mounted');

    const urlHasState = this.loadStateFromUrl();
    if (!urlHasState) this.pushStateToUrl();
  },
  methods: {
    loadStateFromUrl() {
      const state = getStateFromUrl(this);
      if (state.mandelbrot) {
        const data = state.mandelbrot;

        this.selectedMode = data.selectedMode;
        this.selectedHeight = data.selectedHeight;
        this.centerRe = +data.centerRe;
        this.centerIm = +data.centerIm;
        this.zoom = +data.zoom;
        this.zoomFactor = +data.zoomFactor;
        this.maxIter = +data.maxIter;
        this.freqRed = +data.freqRed;
        this.freqGreen = +data.freqGreen;
        this.freqBlue = +data.freqBlue;
        return true;
      }
      return false;
    },

    pushStateToUrl() {
      const {
        selectedMode,
        selectedHeight,
        centerRe,
        centerIm,
        zoom,
        zoomFactor,
        maxIter,
        freqRed,
        freqGreen,
        freqBlue
      } = this;
      log.methodStart(this, 'pushStateToUrl', [
        selectedMode,
        selectedHeight,
        centerRe,
        centerIm,
        zoom,
        zoomFactor,
        maxIter,
        freqRed,
        freqGreen,
        freqBlue
      ]);

      updateStateInUrl({
        that: this,
        update: {
          mandelbrot: {
            selectedMode,
            selectedHeight,
            centerRe,
            centerIm,
            zoom,
            zoomFactor,
            maxIter,
            freqRed,
            freqGreen,
            freqBlue
          }
        }
      });
    },
    saveAsPng() {
      this.$refs.mandelbrot.saveAsPng();
    },
    resetDraw() {
      this.$refs.mandelbrot.resetDraw();
    },
    clearUrl() {
      this.$refs.mandelbrot.clearUrl();
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-top: 30px;
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
