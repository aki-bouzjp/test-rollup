export declare const LAYOUT_PARAMS: {
    'icon-image': string[];
    'icon-size': (string | number | (string | number)[])[];
    'text-field': string[];
    'text-anchor': string;
    'text-size': (string | number | (string | number)[])[];
};
export declare const PAINT_PARAMS: {
    'text-color': string;
    'text-halo-color': string;
    'text-halo-width': number;
    'icon-halo-color': string;
    'icon-halo-width': number;
    'text-translate': (string | number | (string | number)[] | (string | number[])[])[];
    'text-translate-anchor': string;
    'text-opacity': (string | number | string[])[];
};
export declare const FILTER: (string | (string | string[])[])[];
export declare const createSelectedTextColor: (adid: string, isDarkMode?: boolean | undefined) => (string | (string | string[])[])[];
export declare const createSelectedTextHaloColor: (adid: string, isDarkMode?: boolean | undefined) => (string | (string | string[])[])[];
