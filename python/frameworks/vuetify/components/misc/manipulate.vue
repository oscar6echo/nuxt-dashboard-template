<template>
  <div :style="style" class="d-flex flex-row justify-start align-center my-0">
    <div class="text-left mr-2">{{ label }}</div>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnPlayPause"
    >
      <fa :icon="btnPlayPauseIcon" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnStop"
    >
      <fa :icon="icons.stop" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnStepLeft"
    >
      <fa :icon="icons.stepLeft" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnStepRight"
    >
      <fa :icon="icons.stepRight" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnSpeedUp"
    >
      <fa :icon="icons.speedUp" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnSpeedDown"
    >
      <fa :icon="icons.speedDown" />
    </v-btn>
    <v-btn
      :ripple="false"
      x-small
      depressed
      class="control mr-1"
      @click="clickBtnDirection"
    >
      <fa :icon="btnDirectionIcon" />
    </v-btn>
    <v-btn
      :color="btnAlternateColor"
      :ripple="false"
      depressed
      x-small
      class="control mr-1"
      @click="clickBtnAlternate"
    >
      <fa :icon="icons.alternate" />
    </v-btn>
    <v-btn
      :color="btnLoopColor"
      :ripple="false"
      x-small
      depressed=""
      class="control mr-1"
      @click="clickBtnLoop"
    >
      <fa :icon="btnLoopIcon" />
    </v-btn>
    <!-- <v-slider
      v-model="idxLocal"
      :min="0"
      :max="values.length - 1"
      class="my-manipulate"
      color="#000"
      track-color="#bbb"
      dense
      hide-details
    ></v-slider> -->

    <input
      id="my-manipulate"
      v-model="idxLocal"
      :min="0"
      :max="values.length - 1"
      :style="styleSlider"
      class="mx-1"
      type="range"
      step="1"
    />

    <div class="text-right ml-1">{{ format(idxLocal) }}</div>
  </div>
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    label: { type: String, default: () => '' },
    values: { type: Array, required: true },
    idx: { type: Number, required: true },
    forward: { type: Boolean, default: (e) => true },
    autoplay: { type: Boolean, default: (e) => false },
    loop: { type: Boolean, default: (e) => false },
    alternate: { type: Boolean, default: (e) => false },
    format: { type: Function, default: (e) => e },
    delay: { type: Number, default: (e) => 100 },
    widthSlider: { type: Number, default: (e) => 215 },
    widthTotal: { type: Number, default: (e) => 730 }
  },
  data() {
    return {
      idxLocal: 0,
      isForward: null,
      isAutoplay: null,
      isLoop: null,
      isAlternate: null,
      delayLocal: null,

      isPlay: false,
      interval: null,
      speedFactor: 1.5,

      activeColor: '#cdcdcd',

      icons: {
        play: ['fas', 'play'],
        pause: ['fas', 'pause'],
        stop: ['fas', 'stop'],
        speedUp: ['fas', 'chevron-up'],
        speedDown: ['fas', 'chevron-down'],
        toRight: ['fas', 'arrow-right'],
        toLeft: ['fas', 'arrow-left'],
        alternate: ['fas', 'exchange-alt'],
        redoRight: ['fas', 'redo'],
        redoLeft: ['fas', 'undo'],
        stepRight: ['fas', 'step-forward'],
        stepLeft: ['fas', 'step-backward']
      }
    };
  },
  computed: {
    btnPlayPauseIcon() {
      return this.isPlay ? this.icons.pause : this.icons.play;
    },
    btnDirectionIcon() {
      return this.isForward ? this.icons.toRight : this.icons.toLeft;
    },
    btnLoopIcon() {
      return this.isForward ? this.icons.redoRight : this.icons.redoLeft;
    },
    btnAlternateColor() {
      return this.isAlternate ? this.activeColor : null;
    },
    btnLoopColor() {
      return this.isLoop ? this.activeColor : null;
    },
    style() {
      return `width:${this.widthTotal}px`;
    },
    styleSlider() {
      return `width:${this.widthSlider}px`;
    }
  },
  watch: {
    idxLocal() {
      this.$emit('input', +this.idxLocal);
    },
    idx: {
      handler() {
        this.idxLocal = this.idx;
      },
      immediate: true
    },
    forward: {
      handler() {
        this.isForward = this.forward;
      },
      immediate: true
    },
    // autoplay: {
    //   handler() {
    //     this.isAutoplay = this.autoplay;
    //   },
    //   immediate: true
    // },
    loop: {
      handler() {
        this.isLoop = this.loop;
      },
      immediate: true
    },
    alternate: {
      handler() {
        this.isAlternate = this.alternate;
      },
      immediate: true
    },
    delay: {
      handler() {
        this.delayLocal = this.delay;
      },
      immediate: true
    }
  },
  mounted() {
    if (this.autoplay) this.clickBtnPlayPause();
  },

  methods: {
    onChange($evt) {
      console.log($evt);
      this.idxLocal = $evt;
    },
    clickBtnPlayPause() {
      console.log('clickBtnPlayPause');
      if (this.isPlay) {
        this.isPlay = !this.isPlay;
        clearInterval(this.interval);
      } else {
        this.isPlay = !this.isPlay;
        this.setVariableInterval();
      }
    },
    clickBtnStop() {
      console.log('clickBtnStop');
      clearInterval(this.interval);
      this.isPlay = false;
      this.idxLocal = 0;
    },
    clickBtnStepLeft() {
      console.log('clickBtnStepLeft');
      if (!this.isPlay) {
        if (this.isForward) {
          this.isForward = false;
        }
        this.step();
      }
    },
    clickBtnStepRight() {
      console.log('clickBtnStepRight');
      if (!this.isPlay) {
        if (!this.isForward) {
          this.isForward = true;
        }
        this.step();
      }
    },
    clickBtnSpeedUp() {
      console.log('clickBtnSpeedUp');
      this.delayLocal /= this.speedFactor;
      console.log(this.delayLocal);
    },
    clickBtnSpeedDown() {
      console.log('clickBtnSpeedDown');
      this.delayLocal *= this.speedFactor;
      console.log(this.delayLocal);
    },
    clickBtnDirection() {
      console.log('clickBtnDirection');
      this.isForward = !this.isForward;
    },
    clickBtnAlternate() {
      console.log('clickBtnAlternate');
      this.isAlternate = !this.isAlternate;
    },
    clickBtnLoop() {
      console.log('clickBtnLoop');
      this.isLoop = !this.isLoop;
    },

    setVariableInterval() {
      this.step();
      if (this.isPlay)
        this.timer = setTimeout(this.setVariableInterval, this.delayLocal);
    },

    step() {
      const first = 0;
      const last = this.values.length - 1;
      let move = true;
      if (this.isForward) {
        if (this.idxLocal < last) {
          this.idxLocal++;
        } else if (this.isLoop) {
          if (this.isAlternate) {
            this.idxLocal = last - 1;
            this.isForward = false;
          } else {
            this.idxLocal = first;
          }
        } else {
          move = false;
        }
      } else if (this.idxLocal > first) {
        this.idxLocal--;
      } else if (this.isLoop) {
        if (this.isAlternate) {
          this.idxLocal = first + 1;
          this.isForward = true;
        } else {
          this.idxLocal = last;
        }
      } else {
        move = false;
      }
      if (!move) {
        clearInterval(this.timer);
        this.isPlay = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.control {
  border-radius: 0;
  background-color: $grey-btn-base;
  border: $border;
}

// #my-manipulate {
// }
// input[type='range'] {
//   -webkit-appearance: none;
// }
// input[type='range']::-webkit-slider-runnable-track {
//   background: linear-gradient(to right, black 30%, gray 30%);
//   //   background: 'black';
//   background-position: right top;
//   height: 2px;
//   box-shadow: inset 0px 0px 0px 1px red;
// }
// input[type='range']::-moz-range-track {
//   background: linear-gradient(to left, red 30%, transparent 30%);
//   background-position: right top;
//   height: 10px;
//   box-shadow: inset 0px 0px 0px 1px black;
// }
// input[type='range']::-ms-track {
//   background: linear-gradient(to left, red 30%, transparent 30%);
//   background-position: right top;
//   background-repeat: no-repeat; /* no repeat means background appears a little on the left due to width issue and hence the fix */
//   width: 100%; /* to fix width issue in Edge */
//   height: 10px;
//   color: transparent; /* to avoid the intermediate stripe lines in < IE11 */
//   border-color: transparent;
//   border-style: solid;
//   border-width: 10px 0px; /* dummy just to increase height, otherwise thumb gets hidden */
//   box-shadow: inset 0px 0px 0px 1px black;
// }
// input[type='range']::-ms-fill-lower {
//   background: transparent; /* IE11 has default fill and that needs to be removed */
// }
// input[type='range']::-webkit-slider-thumb {
//   -webkit-appearance: none;
//   height: 12px;
//   width: 12px;
//   margin-top: -5px;
//   background: black;
//   border: 0px solid chocolate;
//   border-radius: 100%;
// }
// input[type='range']::-moz-range-thumb {
//   height: 18px;
//   width: 18px;
//   background: sandybrown;
//   border: 1px solid chocolate;
//   border-radius: 50%;
// }
// input[type='range']::-ms-thumb {
//   height: 18px;
//   width: 18px;
//   margin-top: 0px; /* nullify default margin */
//   background: sandybrown;
//   border: 1px solid chocolate;
//   border-radius: 50%;
// }
//
</style>

<style>
/* // .v-input__control .v-input__slot {
//   transition: none !important;
//   transition-timing-function: none !important;
// } */
/* .v-input__slot {
  transition-timing-function: none !important;
} */
</style>
