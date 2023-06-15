export const variants = {
  hidden: { opacity: 0, height: 0 },
  enter: { opacity: 1, height: 'auto' },
  exit: { opacity: 0 }
};

export const variantsHidden = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};
export const variantsScale = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.96 },
  exit: { opacity: 0, scale: 0.96 }
};

export const variantsOpacity = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
};

export const variantsToast = {
  visible: { opacity: 1, y: -70 },
  hidden: { opacity: 0, y: -0 },
  exit: { opacity: 0, y: -20 }
};

export const orderDifficult = {
  easy: 0,
  medium: 1,
  hard: 2,
  very_hard: 3
};

export const timeCache = 60 * 60 * 1000;

export const configMathjax = {
  messageStyle: 'none',
  jax: ['input/TeX', 'output/CommonHTML'],
  CommonHTML: {
    linebreaks: { automatic: true },
    mtextFontInherit: true,
    availableFonts: ["STIX"],
    preferredFont: "STIX",
    webFont: "STIX-Web",
  },

  extensions: ['tex2jax.js', 'asciimath2jax.js', 'mml2jax.js', 'MathMenu.js', 'MathZoom.js'],
  TeX: {
    extensions: ['AMSmath.js', 'AMSsymbols.js', 'autoload-all.js']
  },
  'HTML-CSS': {},
  styles: {
    '.mjx-test.mjx-test-inline': {
      display: 'inline-table!important',
      'margin-right': 0
    },
    '.mjx-test-inline .mjx-left-box': {
      display: 'table-cell!important',
      width: '10000em!important',
      'min-width': 0,
      'max-width': 'none',
      padding: 0,
      border: 0,
      margin: 0,
      float: null
    }
  },
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ],
    processEscapes: true,
    processRefs: true,
    processEnvironments: true
  }
};
