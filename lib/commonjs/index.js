(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

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

}));
