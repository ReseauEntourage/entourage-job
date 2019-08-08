export const UIKIT_SCREENS = ['s', 'm', 'l', 'xl'];
// export const UIKIT_WIDTH = [
//   'auto',
//   'expand',
//   'small',
//   'medium',
//   'large',
//   'xlarge',
//   ...(function combine(a, b) {
//     if (a + 1 >= b) {
//       if (b >= 8) {
//         return [`${a}-${b}`];
//       }
//       return [`${a}-${b}`, ...combine(1, b + 1)];
//     }
//     return [`${a}-${b}`, ...combine(a + 1, b)];
//   })(1, 1),
// ];
// export const UIKIT_WIDTH_SCREENS = [
//   ...UIKIT_WIDTH,
//   ...UIKIT_SCREENS.map((screen) =>
//     UIKIT_WIDTH.map((width) => `${width}@${screen}`)
//   ).flat(),
// ];

export const UIKIT_SECTION_SIZES = [
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
];
export const UIKIT_STYLES = ['default', 'primary', 'secondary', 'danger'];
export const UIKIT_BUTTON_STYLES_SPEC = ['text', 'link', ...UIKIT_STYLES];
export const UIKIT_BUTTON_SIZES = ['small', 'large'];
export const UIKIT_COLORS = [
  'muted',
  'emphasis',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];
export const UIKIT_ALIGNMENT = ['left', 'right', 'center', 'justify'];
export const UIKIT_TRANSFORM = ['uppercase', 'capitalize', 'lowercase'];

export const UIKIT_TEXT_TAG = ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// export const UIKIT_TEXT_STYLES_SPEC = {
//     "": ""
// };
