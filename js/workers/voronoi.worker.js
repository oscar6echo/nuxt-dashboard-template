// importScripts('https://unpkg.com/d3-delaunay@5.1.6/dist/d3-delaunay.min.js');

import d3 from '~/assets/d3';

onmessage = (event) => {
  const {
    data: { data, width, height, n }
  } = event;
  const points = new Float64Array(n * 2);
  const c = new Float64Array(n * 2);
  const s = new Float64Array(n);

  // Initialize the points using rejection sampling.
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < 30; ++j) {
      points[i * 2] = Math.floor(Math.random() * width);
      const x = points[i * 2];
      points[i * 2 + 1] = Math.floor(Math.random() * height);
      const y = points[i * 2 + 1];
      if (Math.random() < data[y * width + x]) break;
    }
  }

  const delaunay = new d3.Delaunay(points);
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  for (let k = 0; k < 80; ++k) {
    // Compute the weighted centroid for each Voronoi cell.
    c.fill(0);
    s.fill(0);
    for (let y = 0, i = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const w = data[y * width + x];
        i = delaunay.find(x + 0.5, y + 0.5, i);
        s[i] += w;
        c[i * 2] += w * (x + 0.5);
        c[i * 2 + 1] += w * (y + 0.5);
      }
    }

    // Relax the diagram by moving points to the weighted centroid.
    // Wiggle the points a little bit so they don’t get stuck.
    const w = (k + 1) ** -0.8 * 10;
    for (let i = 0; i < n; ++i) {
      const x0 = points[i * 2];
      const y0 = points[i * 2 + 1];
      const x1 = s[i] ? c[i * 2] / s[i] : x0;
      const y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
      points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
      points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
    }

    postMessage(points);
    voronoi.update();
  }

  close();
};
