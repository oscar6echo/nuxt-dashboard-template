<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="subtitle-1 modt my-subtitle mt-5 my-3">
        Advanced <a href="https://d3js.org/">d3js</a> - Straight from this
        <a href="https://observablehq.com/@oscar6echo">ObservableHQ</a>
        <a href="https://observablehq.com/@mbostock/voronoi-stippling"
          >notebook</a
        >
      </div>
      <div class="d-flex flex-column align-center">
        <canvas id="my-canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Worker from '~/js/workers//voronoi.worker.js';

export default {
  name: 'TabkWiki',
  components: {},
  props: {
    filename: { type: String, required: true }
  },
  data() {
    return {
      width: 650
    };
  },
  computed: {},

  async mounted() {
    const image = await this.getImage();
    const { data, width, height } = this.getData(image, this.width);

    const canvas = document.getElementById('my-canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add('with-border');

    const ctx = canvas.getContext('2d');

    // const worker = new Worker(this.$router.options.base + 'worker/voronoi.js');
    const worker = new Worker();

    const displayPoints = ({ data: points }) => {
      console.log('start displayPoints');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      for (let i = 0, n = points.length; i < n; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        ctx.moveTo(x + 1.5, y);
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
      }
      ctx.fillStyle = '#000';
      ctx.fill();
    };

    const n = Math.round((width * height) / 40);
    worker.addEventListener('message', displayPoints);
    worker.postMessage({ data, width, height, n });
  },
  methods: {
    getImage() {
      //   let uri;
      //   if (process.env.CDN_LOCAL === true) {

      //     const port = process.env.CDN_PORT;
      //     uri = `http://localhost:${port}/${this.filename}`;
      //   } else {
      //     const hostname = process.env.CDN_HOSTNAME;
      //     const prefix = process.env.CDN_PREFIX;
      //     uri = `${hostname}/${prefix}${this.filename}`;
      //   }

      let uri = process.env.CDN_HOST;
      if (process.env.CDN_PORT) uri += ':' + process.env.CDN_PORT;
      uri += process.env.CDN_PREFIX + '/' + this.filename;

      return new Promise((resolve, reject) => {
        const i = new Image();
        if (
          new URL(uri, document.baseURI).origin !== new URL(location).origin
        ) {
          i.crossOrigin = 'anonymous';
        }
        i.onload = () => resolve(i);
        i.onerror = () =>
          reject(new Error(`Unable to load file: ${this.name}`));
        i.src = uri;
      });
    },
    getData(image, width) {
      const height = Math.round(width * (image.height / image.width));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        width,
        height
      );
      // console.log(ctx);

      const { data: rgba } = ctx.getImageData(0, 0, width, height);
      const data = new Float64Array(width * height);
      for (let i = 0, n = rgba.length / 4; i < n; ++i)
        data[i] = Math.max(0, 1 - rgba[i * 4] / 254);

      console.log('data.length', data.length);
      return { data, width, height };
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
.with-border {
  border: 1px solid $grey-border;
}
</style>
