(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MapboxPromoted = {}));
})(this, (function (exports) { 'use strict';

    const test = () => {
        return 123;
    };

    // import MapboxPromoted from './promoted';
    const test2 = () => {
        console.log(123);
    };
    const test3 = () => {
        console.log(test());
    };

    exports["default"] = test;
    exports.test = test;
    exports.test2 = test2;
    exports.test3 = test3;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
