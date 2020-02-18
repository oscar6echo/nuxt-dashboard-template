import log from '~/js/generic/log';

const buildConf = () => {
  log.funcStart('buildConf');

  const tabs = [
    {
      path: 'countries',
      title: 'Countries',
      tabs: [
        { path: 'table', title: 'Table' },
        { path: 'plot', title: 'Plot' },
        { path: 'map', title: 'Map' }
      ]
    },
    {
      path: 'realtime',
      title: 'Real Time'
    },
    {
      path: 'slider2d',
      title: '2D Slider'
    },
    {
      path: 'climate',
      title: 'Climate',
      tabs: [
        { path: 'weather', title: 'Weather' },
        { path: 'temperature', title: 'Temperature' }
      ]
    },
    {
      path: 'wikitable',
      title: 'Wiki Tables',
      tabs: [
        { path: 'ancient', title: 'Ancient' },
        { path: 'modern', title: 'Modern' }
      ]
    },
    {
      path: 'bitcoin',
      title: 'Bitcoin TX'
    },
    {
      path: 'portrait',
      title: 'Portraits',
      tabs: [
        { path: 'obama', title: 'Obama' },
        { path: 'gosling', title: 'Gosling' },
        { path: 'moss', title: 'Moss' },
        { path: 'fassbender', title: 'Fassbender' },
        { path: 'delevigne', title: 'Delevigne' }
      ]
    },
    {
      path: 'fractals',
      title: 'Fractals',
      tabs: [
        { path: 'mandelbrot', title: 'Mandelbrot' },
        { path: 'julia', title: 'Julia' },
        { path: 'info', title: 'Info' }
      ]
    },
    {
      path: 'disclaimer',
      title: 'Disclaimer'
    }
  ];

  const obj = {
    tabs,
    // MANUALCONFIG
    // SET DEFAULT TAB
    // FOR ALL TAB WITH SUBTABS SET DEFAULT SUBTAB
    activeTab: { tab: 0, sub: { 0: 0, 4: 0, 6: 0 } },

    // MANUAL CONFIG
    defaultStyle: {
      level1: {
        vertical: true,
        width: '130px',
        height: '70px'
      },
      level2: {
        vertical: false,
        width: '125px',
        height: '70px'
      }
    },

    // MANUALCONFIG
    navBarLink: '/countries/plot'
  };

  // DEFAULT CONFIG
  // NOT SET => ALL DEFAULT TO 0
  if (!obj.activeTab) obj.activeTab = {};
  if (!obj.activeTab.tab) obj.activeTab.tab = 0;
  if (!obj.activeTab.sub) obj.activeTab.sub = {};
  tabs.forEach((e, i) => {
    if (e.tabs && !obj.activeTab.sub[i]) obj.activeTab.sub[i] = 0;
  });

  // REMOVE INVALID SUB KEYS
  for (const k of Object.keys(tabs)) {
    if (k < 0 || k >= tabs.length) {
      delete obj.activeTab.sub[k];
    }
  }
  log.funcEnd('buidConf', obj);
  return obj;
};

export default buildConf;
