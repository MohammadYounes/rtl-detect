/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var RtlDetectLib, self;

RtlDetectLib = self = {

    // Private functions - star
    _escapeRegExpPattern: function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        return str.replace(/([\.\*\+\^\$\[\]\\\(\)\|\{\}\,\-\:\?])/g, '\\$1');
    },
    _toLowerCase: function (str, reserveReturnValue) {
        if (typeof str !== 'string') {
            return reserveReturnValue && str;
        }
        return str.toLowerCase();
    },
    _toUpperCase: function (str, reserveReturnValue) {
        if (typeof str !== 'string') {
            return reserveReturnValue && str;
        }
        return str.toUpperCase();
    },
    _trim: function (str, delimiter, reserveReturnValue) {
        var patterns = [],
            regexp,
            addPatterns = function (pattern) {
                // Build trim RegExp pattern and push it to patterns array
                patterns.push('^' + pattern + '+|' + pattern + '+$');
            };

        // fix reserveReturnValue value
        if (typeof delimiter === 'boolean') {
            reserveReturnValue = delimiter;
            delimiter = null;
        }

        if (typeof str !== 'string') {
            return reserveReturnValue && str;
        }

        // Trim based on delimiter array values
        if (Array.isArray(delimiter)) {
            // Loop through delimiter array
            delimiter.map(function(item) {
                // Escape delimiter to be valid RegExp Pattern
                var pattern = self._escapeRegExpPattern(item);
                // Push pattern to patterns array
                addPatterns(pattern);
            });
        }

        // Trim based on delimiter string value
        if (typeof delimiter === 'string') {
            // Escape delimiter to be valid RegExp Pattern
            var patternDelimiter = self._escapeRegExpPattern(delimiter);
            // push pattern to patterns array
            addPatterns(patternDelimiter);
        }

        // If delimiter  is not defined, Trim white spaces
        if (!delimiter) {
            // Push white space pattern to patterns array
            addPatterns('\\s');
        }

        // Build RegExp pattern
        var pattern = '(' + patterns.join('|') + ')';
        // Build RegExp object
        regexp = new RegExp(pattern, 'g');

        // trim string for all patterns
        while(str.match(regexp)) {
            str = str.replace(regexp, '');
        }

        // Return trim string
        return str;
    },

    _parseLocale : function (strLocale) {
        // parse locale regex object
        var regex = /^([a-zA-Z]*)([_\-a-zA-Z]*)$/,
            matches =  regex.exec(strLocale), // exec regex
            parsedLocale,
            lang,
            countryCode;

        if (!strLocale || !matches) {
            return;
        }

        // fix countryCode string by trimming '-' and '_'
        matches[2] = self._trim(matches[2], ['-', '_']);

        lang = self._toLowerCase(matches[1]);
        countryCode = self._toUpperCase(matches[2]) || countryCode;

        // object with lang, countryCode properties
        parsedLocale = {
            lang: lang,
            countryCode: countryCode
        };

        // return parsed locale object
        return parsedLocale;
    },
    // Private functions - End

    // Public functions - star
    isRtlLang: function (strLocale) {
        var objLocale = self._parseLocale(strLocale);
        if (!objLocale) {
            return;
        }
        // return true if the intel string lang exists in the BID RTL LANGS array else return false
        return (self._BIDI_RTL_LANGS.indexOf(objLocale.lang) >= 0);
    },

    getLangDir: function (strLocale) {
        // return 'rtl' if the intel string lang exists in the BID RTL LANGS array else return 'ltr'
        return self.isRtlLang(strLocale) ? 'rtl' : 'ltr';
    }

    // Public functions - End
};

// Const BIDI_RTL_LANGS Array
// BIDI_RTL_LANGS ref: http://en.wikipedia.org/wiki/Right-to-left
Object.defineProperty(self, '_BIDI_RTL_LANGS', {
    value: [
        'ar', /* 'العربية', Arabic */
        'arc', /* Aramaic */
        'bcc', /* 'بلوچی مکرانی', Southern Balochi */
        'bqi', /* 'بختياري', Bakthiari */
        'ckb', /* 'Soranî / کوردی', Sorani */
        'dv', /* Dhivehi */
        'fa', /* 'فارسی', Persian */
        'glk', /* 'گیلکی', Gilaki */
        'he', /* 'עברית', Hebrew */
        'ku', /* 'Kurdî / كوردی', Kurdish */
        'mzn', /* 'مازِرونی', Mazanderani */
        'pnb', /* 'پنجابی', Western Punjabi */
        'ps', /* 'پښتو', Pashto, */
        'sd', /* 'سنڌي', Sindhi */
        'ug', /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
        'ur', /* 'اردو', Urdu */
        'yi', /* 'ייִדיש', Yiddish */
    ],
    writable: false,
    enumerable: true,
    configurable: false
});


module.exports = RtlDetectLib;
