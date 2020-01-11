<template>
  <v-container fluid class="my-wrapper-block">
    <div class="d-flex flex-column align-center my-wrapper">
      <!-- <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div> -->
      <div class="subtitle-1 modt my-subtitle mb-3">
        Navigate the Julia Set with the player<br />
      </div>
      <div class="d-flex justify-space-between my-wrapper">
        <div class="d-flex flex-row justify-start"></div>
        <div class="d-flex flex-row justify-end"></div>
      </div>
      <div class="d-flex justify-space-between my-wrapper mt-2">
        <div class="d-flex flex-row justify-start">
          <InputNumber
            v-model.number="radius"
            label="Radius"
            class-string="my-square-box my-control-1 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="angle"
            label="Initial Angle (deg)"
            class-string="my-square-box my-control-1 mx-1"
          ></InputNumber>
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
        </div>
        <div class="d-flex flex-row justify-end">
          <v-btn
            id="save-png"
            text
            small
            class="modt action-button my-button my-0 mx-1"
            @click="saveAsPng"
          >
            save as png
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-space-between my-wrapper mt-2 mb-3">
        <div class="d-flex flex-row justify-start">
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
            v-model.number="fractalWidth"
            :disabled="true"
            format="fixed-3"
            label="Fractal Width"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
          <InputNumber
            v-model.number="fractalHeight"
            :disabled="true"
            format="fixed-3"
            label="Fractal Height"
            class-string="my-square-box my-control-3 mx-1"
          ></InputNumber>
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
        </div>
      </div>

      <Manipulate
        v-model.number:idx="idx"
        :values="values"
        :idx="idx"
        :autoplay="false"
        :loop="true"
        :alternate="false"
        :delay="delay"
        :format="formatSlider"
        :width-slider="200"
        :width-total="750"
        label="Angle (deg)"
        class="my-3"
      />
      <div>cartesian coords: {{ JSON.stringify(livePosFractal) }}</div>
      <div id="my-wrapper-canvas" class="my-3"></div>
    </div>
  </v-container>
</template>

<script>
import InputNumber from '~/components/misc/input-text-field';
import Manipulate from '~/components/misc/manipulate';

import d3 from '~/assets/d3';
import log from '~/js/generic/log';

import { buildComputeJulia } from '~/js/julia-gpu';

export default {
  name: 'TabJulia',
  components: { InputNumber, Manipulate },
  props: {},
  data() {
    return {
      idx: 300,
      delay: 25,
      incr: 0.25,

      radius: 0.7885,
      angle: 0,

      cR: 0,
      cI: 0,

      rMax: null,
      rMin: null,
      iMax: null,
      iMin: null,

      fractalWidthInit: 4,

      maxIter: 1024,
      freqRed: 28,
      freqGreen: 20,
      freqBlue: 44,

      fractalWidth: 0,
      fractalHeight: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      runtime: 0,

      report: {},
      showReset: true,

      selectedHeight: 'small',
      optionsHeight: [
        { value: 'smallest', text: 'Smallest' },
        { value: 'small', text: 'Small' },
        { value: 'large', text: 'Large' },
        { value: 'largest', text: 'Largest' }
      ],

      livePosFractal: {}
    };
  },
  computed: {
    values() {
      return d3.range(0, 360, this.incr);
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
    },
    formatSlider() {
      return (i) => i * (360 / this.values.length) + '°';
    }
  },
  watch: {
    selectedHeight() {
      log.watchStart(this, 'selectedHeight');

      this.buildCanvasDims();
      this.buildBounds();

      this.buildGpuKernel();
      this.runGpuKernel();

      this.removeGpuKernelCanvasFromDom();
      this.attachGpuKernelCanvasToDom();
    },
    radius() {
      log.watchStart(this, 'radius');
      this.reDraw();
    },
    angle() {
      log.watchStart(this, 'angle');
      this.reDraw();
    },
    maxIter() {
      log.watchStart(this, 'maxIter');
      this.buildPalette();
      this.reDraw();
    },
    freqRed() {
      log.watchStart(this, 'freqRed');
      this.buildPalette();
      this.reDraw();
    },
    freqGreen() {
      log.watchStart(this, 'freqGreen');
      this.buildPalette();
      this.reDraw();
    },
    freqBlue() {
      log.watchStart(this, 'freqBlue');
      this.buildPalette();
      this.reDraw();
    },
    idx() {
      //   log.watchStart(this, 'idx');
      this.reDraw();
    }
  },

  created() {
    log.hookStart(this, 'created');
  },

  mounted() {
    log.hookStart(this, 'mounted');

    this.buildCanvasDims();
    this.buildBounds();
    this.buildPalette();

    this.updateCoords();

    this.buildGpuKernel();
    this.runGpuKernel();
    this.attachGpuKernelCanvasToDom();
  },
  methods: {
    updateCoords() {
      const angleRad = 2 * Math.PI * ((this.angle + this.idx) / 360);
      this.cR = this.radius * Math.cos(angleRad);
      this.cI = this.radius * Math.sin(angleRad);
      this.livePosFractal = {
        x: this.cR,
        y: this.cI
      };
    },

    reDraw() {
      this.updateCoords();
      this.runGpuKernel();
    },

    buildGpuKernel() {
      console.log('START buildGpuKernel');
      const { canvasWidth, canvasHeight, maxIter } = this;
      console.log({ canvasWidth, canvasHeight, maxIter });
      if (this.gpuKernel) this.gpuKernel.destroy();

      this.gpuKernel = buildComputeJulia({
        canvasWidth,
        canvasHeight,
        maxIter
      });
      console.log(this.gpuKernel);
    },

    runGpuKernel() {
      console.log('START runGpuKernel');

      console.time('timer-gpu-mainthread');
      this.gpuKernel(
        this.cR,
        this.cI,
        this.rMin,
        this.rMax,
        this.iMin,
        this.iMax,
        this.paletteArr
      );
      console.timeEnd('timer-gpu-mainthread');
    },

    attachGpuKernelCanvasToDom() {
      console.log('START attachGpuKernelCanvasToDom');

      this.canvas = this.gpuKernel.canvas;
      this.canvas.id = 'my-canvas-julia';
      document.getElementById('my-wrapper-canvas').append(this.canvas);
    },

    removeGpuKernelCanvasFromDom() {
      console.log('START removeGpuKernelCanvasFromDom');
      const canvasJulia = document.getElementById('my-canvas-julia');
      if (canvasJulia) {
        canvasJulia.parentNode.removeChild(canvasJulia);
        console.log(
          'success =',
          document.getElementById('my-canvas-julia') === null
        );
      }
    },

    buildCanvasDims() {
      console.log('START buildCanvasDims');
      this.canvasWidth = window.innerWidth - this.marginWidth;
      this.canvasHeight = window.innerHeight - this.marginHeight;

      const { canvasWidth, canvasHeight } = this;
      console.log({ canvasWidth, canvasHeight });
    },

    buildBounds() {
      console.log('START buildBounds');

      const newWidth = this.fractalWidthInit;
      const newHeight = newWidth * (this.canvasHeight / this.canvasWidth);

      this.fractalWidth = newWidth;
      this.fractalHeight = newHeight;

      this.rMin = 0 - newWidth / 2;
      this.rMax = 0 + newWidth / 2;
      this.iMin = 0 - newHeight / 2;
      this.iMax = 0 + newHeight / 2;

      console.log({
        rMin: this.rMin,
        rMax: this.rMax,
        iMin: this.iMin,
        iMax: this.iMax
      });
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

    saveAsPng() {
      console.log('START saveAsPng');

      this.runGpuKernel();

      const a = document.createElement('a');
      a.href = this.canvas.toDataURL('image/png', 1.0);
      a.download = 'toto.png';
      document.body.appendChild(a);
      //   console.log(a.href);
      a.click();
      a.parentElement.removeChild(a);
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
  width: 120px;
}
.my-control-3 {
  width: 120px;
}
#select-mode {
  width: 600px;
}
#select-height {
  width: 120px;
}
</style>
