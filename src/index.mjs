//seed random is not import compatible, but we still need to use it
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);
//const rand = require("seed-random");
//'use strict';

//*
var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
//var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//

var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

const rand = function(seed, options) {
    if (options && options.global === true) {
        options.global = false;
        Math.random = module.exports(seed, options);
        options.global = true;
        return Math.random;
    }
    var use_entropy = (options && options.entropy) || false;
    var key = [];

    // Flatten the seed string or build one from local entropy if needed.
    //*
    //var shortseed = 
    mixkey(flatten(
        use_entropy ? [seed, tostring(pool)] :
            0 in arguments ? seed : autoseed(), 3), key
    ); //*/

    // Use the seed to initialize an ARC4 generator.
    var arc4 = new ARC4(key);

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool);

    // Override Math.random

    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.

    return function() {         // Closure to return a random double:
        var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
            d = startdenom,                 //   and denominator d = 2 ^ 48.
            x = 0;                          //   and no 'extra last byte'.
        while (n < significance) {          // Fill up all significant digits by
            n = (n + x) * width;              //   shifting numerator and
            d *= width;                       //   denominator and generating a
            x = arc4.g(1);                    //   new least-significant-byte.
        }
        while (n >= overflow) {             // To avoid rounding up, before adding
            n /= 2;                           //   last byte, shift everything
            d /= 2;                           //   right using integer Math until
            x >>>= 1;                         //   we have exactly the desired bits.
        }
        return (n + x) / d;                 // Form the number within [0, 1).
    };
};

export const resetGlobal = function () {
    Math.random = oldRandom;
};

function ARC4(key) {
    var t, keylen = key.length,
        me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

    // The empty key [] is treated as [0].
    if (!keylen) { key = [keylen++]; }

    // Set up S using the standard key scheduling algorithm.
    while (i < width) {
        s[i] = i++;
    }
    for (i = 0; i < width; i++) {
        s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
        s[j] = t;
    }

    // The "g" method returns the next (count) outputs as one number.
    (me.g = function(count) {
        // Using instance members instead of closure state nearly doubles speed.
        var t, r = 0,
            i = me.i, j = me.j, s = me.S;
        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }
        me.i = i; me.j = j;
        return r;
        // For robust unpredictability discard an initial batch of values.
        // See http://www.rsa.com/rsalabs/node.asp?id=2009
    })(width);
}

function flatten(obj, depth) {
    var result = [], typ = (typeof obj)[0], prop;
    if (depth && typ == 'o') {
        for (prop in obj) {
            try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {
                //noop
            }
        }
    }
    return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

function mixkey(seed, key) {
    var stringseed = seed + '', smear, j = 0;
    while (j < stringseed.length) {
        key[mask & j] =
            mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
    }
    return tostring(key);
}

function autoseed(seed) {
    try {
        globalThis.crypto.getRandomValues(seed = new Uint8Array(width));
        return tostring(seed);
    } catch (e) {
        return [
            +new Date, 
            globalThis, 
            globalThis.navigator && globalThis.navigator.plugins,
            globalThis.screen, 
            tostring(pool)
        ];
    }
}

function tostring(a) {
    return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);
//*/

const defaultAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export class Random{
    constructor(options={}){
        this.options = options;
        this.rnd = rand(options.seed || (
            Date.now().toString()+
            Math.random()
        ));
    }
    
    ratio(){
        return this.rnd();
    }
    
    random(){
        return this.rnd();
    }
    
    float(upperBound=Number.MAX_VALUE, lowerBound=0){
        const delta = upperBound - lowerBound;
        return lowerBound + delta * this.rnd();
    }
    
    integer(upperBound=Math.floor(Number.MAX_VALUE), lowerBound=0){
        return Math.floor(this.float(upperBound, lowerBound));
    }
    
    array(array){
        return array[this.integer(array.length)];
    }
    
    string(parts=defaultAlphabet, max=10){
        const numParts = this.integer(max);
        let lcv=0;
        let result = '';
        for(;lcv < numParts; lcv++){
            result += this.array(parts);
        }
        return result;
    }
    
}