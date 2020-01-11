<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        {{ dot }}
      </div>

      <canvas id="my-canvas" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';

export default {
  name: 'TabSlider2D',
  components: {},
  props: {},
  data() {
    return {
      width: 650,
      height: 350,
      canvas: null,
      dot: null
    };
  },
  computed: {
    title() {
      return capitalCase('2d slider');
    },
    style() {
      return `width: ${this.width}px, height: ${this.height}px`;
    }
  },
  mounted() {
    this.buildCanvas();
  },

  methods: {
    buildCanvas() {
      this.canvas = document.getElementById('my-canvas');
      this.dot = [this.width / 2, this.height / 2];
      this.draw(this.canvas);

      this.canvas.addEventListener(
        'mousemove',
        (evt) => {
          this.dot = this.getPointPos(this.canvas, evt);
          this.draw(this.canvas);
        },
        false
      );
    },
    getPointPos(canvas, evt) {
      const rect = canvas.getBoundingClientRect();
      return [
        evt.clientX - rect.left - canvas.clientLeft,
        evt.clientY - rect.top - canvas.clientTop
      ];
    },
    draw(canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.fillStyle = 'grey';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(this.dot[0] - 5, this.dot[1] - 5, 10, 10);
      ctx.fillText(this.dot.join(',') + ' ', this.dot[0] + 10, this.dot[1] + 3);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}

.modt.subtitle.local {
  margin-bottom: 30px;
}

#my-canvas {
  border: 2px solid $corp-red;
}
</style>

<style></style>
