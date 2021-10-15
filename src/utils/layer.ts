import { COLORS } from 'utils/color';

export const LAYOUT_PARAMS = {
  'icon-image': ['get', 'icon'],
  'icon-size': [
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    10, 0.5, // zoom is 10 (or less)    -> icon size will be 0.5
    16, 1.0, // zoom is 16 (or greater) -> icon size will be 1.0
  ],
  'text-field': ['get', 'name_ja'],
  'text-anchor': 'top',
  'text-size': [
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    10, 9,
    16, 12,
  ]
};

export const PAINT_PARAMS = {
  'text-color': COLORS.FONT_COLOR_DARK,
  'text-halo-color': COLORS.FONT_HALO_COLOR_DARK,
  'text-halo-width': 1.0,
  'icon-halo-color': COLORS.FONT_COLOR_DARK,
  'icon-halo-width': 1.5,
  'text-translate': [
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    10,
    ['literal', [0.0, 12.0]],
    16,
    ['literal', [0.0, 24.0]],
  ],
  'text-translate-anchor': 'viewport',
  'text-opacity': [
    'step',
    ['zoom'],
    0,
    14,
    1
  ]
};

export const FILTER = [
  'all',
  ['>=', ['zoom'], ['get', 'min_zoom']],
];

export const createSelectedTextColor = (adid: string, isDarkMode?: boolean) => {
  return [
    'case',
    ['==', ['get', 'adid'], adid],
    isDarkMode ? COLORS.SELECTED_FONT_COLOR_LIGHT : COLORS.SELECTED_FONT_COLOR_DARK,
    isDarkMode ? COLORS.FONT_COLOR_LIGHT : COLORS.FONT_COLOR_DARK,
  ];
};

export const createSelectedTextHaloColor = (adid: string, isDarkMode?: boolean) => {
  return [
    'case',
    ['==', ['get', 'adid'], adid],
    isDarkMode ? COLORS.SELECTED_FONT_HALO_COLOR_LIGHT : COLORS.SELECTED_FONT_HALO_COLOR_DARK,
    isDarkMode ? COLORS.FONT_HALO_COLOR_LIGHT : COLORS.FONT_HALO_COLOR_DARK,
  ];
};
