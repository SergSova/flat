/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 1.3.3
 *
 * Date formatter utility library that allows formatting date/time variables or Date objects using PHP DateTime format.
 * @see http://php.net/manual/en/function.date.php
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
var clNP = 0;
var DateFormatter;
(function () {
    "use strict";

    var _compare, _lpad, _extend, defaultSettings, DAY, HOUR;

    DAY = 1000 * 60 * 60 * 24;
    HOUR = 3600;

    _compare = function (str1, str2) {
        return typeof(str1) === 'string' && typeof(str2) === 'string' && str1.toLowerCase() === str2.toLowerCase();
    };
    _lpad = function (value, length, char) {
        var chr = char || '0', val = value.toString();
        return val.length < length ? _lpad(chr + val, length) : val;
    };
    _extend = function (out) {
        var i, obj;
        out = out || {};
        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];
            if (!obj) {
                continue;
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        _extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }
        return out;
    };
    defaultSettings = {
        dateSettings: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            meridiem: ['AM', 'PM'],
            ordinal: function (number) {
                var n = number % 10, suffixes = {1: 'st', 2: 'nd', 3: 'rd'};
                return Math.floor(number % 100 / 10) === 1 || !suffixes[n] ? 'th' : suffixes[n];
            }
        },
        separators: /[ \-+\/\.T:@]/g,
        validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
        intParts: /[djwNzmnyYhHgGis]/g,
        tzParts: /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        tzClip: /[^-+\dA-Z]/g
    };

    DateFormatter = function (options) {
        var self = this, config = _extend(defaultSettings, options);
        self.dateSettings = config.dateSettings;
        self.separators = config.separators;
        self.validParts = config.validParts;
        self.intParts = config.intParts;
        self.tzParts = config.tzParts;
        self.tzClip = config.tzClip;
    };

    DateFormatter.prototype = {
        constructor: DateFormatter,
        parseDate: function (vDate, vFormat) {
            var self = this, vFormatParts, vDateParts, i, vDateFlag = false, vTimeFlag = false, vDatePart, iDatePart,
                vSettings = self.dateSettings, vMonth, vMeriIndex, vMeriOffset, len, mer,
                out = {date: null, year: null, month: null, day: null, hour: 0, min: 0, sec: 0};
            if (!vDate) {
                return undefined;
            }
            if (vDate instanceof Date) {
                return vDate;
            }
            if (typeof vDate === 'number') {
                return new Date(vDate);
            }
            if (vFormat === 'U') {
                i = parseInt(vDate);
                return i ? new Date(i * 1000) : vDate;
            }
            if (typeof vDate !== 'string') {
                return '';
            }
            vFormatParts = vFormat.match(self.validParts);
            if (!vFormatParts || vFormatParts.length === 0) {
                throw new Error("Invalid date format definition.");
            }
            vDateParts = vDate.replace(self.separators, '\0').split('\0');
            for (i = 0; i < vDateParts.length; i++) {
                vDatePart = vDateParts[i];
                iDatePart = parseInt(vDatePart);
                switch (vFormatParts[i]) {
                    case 'y':
                    case 'Y':
                        len = vDatePart.length;
                        if (len === 2) {
                            out.year = parseInt((iDatePart < 70 ? '20' : '19') + vDatePart);
                        } else if (len === 4) {
                            out.year = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'm':
                    case 'n':
                    case 'M':
                    case 'F':
                        if (isNaN(vDatePart)) {
                            vMonth = vSettings.monthsShort.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                            vMonth = vSettings.months.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                        } else {
                            if (iDatePart >= 1 && iDatePart <= 12) {
                                out.month = iDatePart;
                            }
                        }
                        vDateFlag = true;
                        break;
                    case 'd':
                    case 'j':
                        if (iDatePart >= 1 && iDatePart <= 31) {
                            out.day = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'g':
                    case 'h':
                        vMeriIndex = (vFormatParts.indexOf('a') > -1) ? vFormatParts.indexOf('a') :
                            (vFormatParts.indexOf('A') > -1) ? vFormatParts.indexOf('A') : -1;
                        mer = vDateParts[vMeriIndex];
                        if (vMeriIndex > -1) {
                            vMeriOffset = _compare(mer, vSettings.meridiem[0]) ? 0 :
                                (_compare(mer, vSettings.meridiem[1]) ? 12 : -1);
                            if (iDatePart >= 1 && iDatePart <= 12 && vMeriOffset > -1) {
                                out.hour = iDatePart + vMeriOffset - 1;
                            } else if (iDatePart >= 0 && iDatePart <= 23) {
                                out.hour = iDatePart;
                            }
                        } else if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'G':
                    case 'H':
                        if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'i':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.min = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 's':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.sec = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                }
            }
            if (vDateFlag === true && out.year && out.month && out.day) {
                out.date = new Date(out.year, out.month - 1, out.day, out.hour, out.min, out.sec, 0);
            } else {
                if (vTimeFlag !== true) {
                    return false;
                }
                out.date = new Date(0, 0, 0, out.hour, out.min, out.sec, 0);
            }
            return out.date;
        },
        guessDate: function (vDateStr, vFormat) {
            if (typeof vDateStr !== 'string') {
                return vDateStr;
            }
            var self = this, vParts = vDateStr.replace(self.separators, '\0').split('\0'), vPattern = /^[djmn]/g,
                vFormatParts = vFormat.match(self.validParts), vDate = new Date(), vDigit = 0, vYear, i, iPart, iSec;

            if (!vPattern.test(vFormatParts[0])) {
                return vDateStr;
            }

            for (i = 0; i < vParts.length; i++) {
                vDigit = 2;
                iPart = vParts[i];
                iSec = parseInt(iPart.substr(0, 2));
                switch (i) {
                    case 0:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setMonth(iSec - 1);
                        } else {
                            vDate.setDate(iSec);
                        }
                        break;
                    case 1:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setDate(iSec);
                        } else {
                            vDate.setMonth(iSec - 1);
                        }
                        break;
                    case 2:
                        vYear = vDate.getFullYear();
                        if (iPart.length < 4) {
                            vDate.setFullYear(parseInt(vYear.toString().substr(0, 4 - iPart.length) + iPart));
                            vDigit = iPart.length;
                        } else {
                            vDate.setFullYear = parseInt(iPart.substr(0, 4));
                            vDigit = 4;
                        }
                        break;
                    case 3:
                        vDate.setHours(iSec);
                        break;
                    case 4:
                        vDate.setMinutes(iSec);
                        break;
                    case 5:
                        vDate.setSeconds(iSec);
                        break;
                }
                if (iPart.substr(vDigit).length > 0) {
                    vParts.splice(i + 1, 0, iPart.substr(vDigit));
                }
            }
            return vDate;
        },
        parseFormat: function (vChar, vDate) {
            var self = this, vSettings = self.dateSettings, fmt, backspace = /\\?(.?)/gi, doFormat = function (t, s) {
                return fmt[t] ? fmt[t]() : s;
            };
            fmt = {
                /////////
                // DAY //
                /////////
                /**
                 * Day of month with leading 0: `01..31`
                 * @return {string}
                 */
                d: function () {
                    return _lpad(fmt.j(), 2);
                },
                /**
                 * Shorthand day name: `Mon...Sun`
                 * @return {string}
                 */
                D: function () {
                    return vSettings.daysShort[fmt.w()];
                },
                /**
                 * Day of month: `1..31`
                 * @return {number}
                 */
                j: function () {
                    return vDate.getDate();
                },
                /**
                 * Full day name: `Monday...Sunday`
                 * @return {number}
                 */
                l: function () {
                    return vSettings.days[fmt.w()];
                },
                /**
                 * ISO-8601 day of week: `1[Mon]..7[Sun]`
                 * @return {number}
                 */
                N: function () {
                    return fmt.w() || 7;
                },
                /**
                 * Day of week: `0[Sun]..6[Sat]`
                 * @return {number}
                 */
                w: function () {
                    return vDate.getDay();
                },
                /**
                 * Day of year: `0..365`
                 * @return {number}
                 */
                z: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j()), b = new Date(fmt.Y(), 0, 1);
                    return Math.round((a - b) / DAY);
                },

                //////////
                // WEEK //
                //////////
                /**
                 * ISO-8601 week number
                 * @return {number}
                 */
                W: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j() - fmt.N() + 3), b = new Date(a.getFullYear(), 0, 4);
                    return _lpad(1 + Math.round((a - b) / DAY / 7), 2);
                },

                ///////////
                // MONTH //
                ///////////
                /**
                 * Full month name: `January...December`
                 * @return {string}
                 */
                F: function () {
                    return vSettings.months[vDate.getMonth()];
                },
                /**
                 * Month w/leading 0: `01..12`
                 * @return {string}
                 */
                m: function () {
                    return _lpad(fmt.n(), 2);
                },
                /**
                 * Shorthand month name; `Jan...Dec`
                 * @return {string}
                 */
                M: function () {
                    return vSettings.monthsShort[vDate.getMonth()];
                },
                /**
                 * Month: `1...12`
                 * @return {number}
                 */
                n: function () {
                    return vDate.getMonth() + 1;
                },
                /**
                 * Days in month: `28...31`
                 * @return {number}
                 */
                t: function () {
                    return (new Date(fmt.Y(), fmt.n(), 0)).getDate();
                },

                //////////
                // YEAR //
                //////////
                /**
                 * Is leap year? `0 or 1`
                 * @return {number}
                 */
                L: function () {
                    var Y = fmt.Y();
                    return (Y % 4 === 0 && Y % 100 !== 0 || Y % 400 === 0) ? 1 : 0;
                },
                /**
                 * ISO-8601 year
                 * @return {number}
                 */
                o: function () {
                    var n = fmt.n(), W = fmt.W(), Y = fmt.Y();
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
                },
                /**
                 * Full year: `e.g. 1980...2010`
                 * @return {number}
                 */
                Y: function () {
                    return vDate.getFullYear();
                },
                /**
                 * Last two digits of year: `00...99`
                 * @return {string}
                 */
                y: function () {
                    return fmt.Y().toString().slice(-2);
                },

                //////////
                // TIME //
                //////////
                /**
                 * Meridian lower: `am or pm`
                 * @return {string}
                 */
                a: function () {
                    return fmt.A().toLowerCase();
                },
                /**
                 * Meridian upper: `AM or PM`
                 * @return {string}
                 */
                A: function () {
                    var n = fmt.G() < 12 ? 0 : 1;
                    return vSettings.meridiem[n];
                },
                /**
                 * Swatch Internet time: `000..999`
                 * @return {string}
                 */
                B: function () {
                    var H = vDate.getUTCHours() * HOUR, i = vDate.getUTCMinutes() * 60, s = vDate.getUTCSeconds();
                    return _lpad(Math.floor((H + i + s + HOUR) / 86.4) % 1000, 3);
                },
                /**
                 * 12-Hours: `1..12`
                 * @return {number}
                 */
                g: function () {
                    return fmt.G() % 12 || 12;
                },
                /**
                 * 24-Hours: `0..23`
                 * @return {number}
                 */
                G: function () {
                    return vDate.getHours();
                },
                /**
                 * 12-Hours with leading 0: `01..12`
                 * @return {string}
                 */
                h: function () {
                    return _lpad(fmt.g(), 2);
                },
                /**
                 * 24-Hours w/leading 0: `00..23`
                 * @return {string}
                 */
                H: function () {
                    return _lpad(fmt.G(), 2);
                },
                /**
                 * Minutes w/leading 0: `00..59`
                 * @return {string}
                 */
                i: function () {
                    return _lpad(vDate.getMinutes(), 2);
                },
                /**
                 * Seconds w/leading 0: `00..59`
                 * @return {string}
                 */
                s: function () {
                    return _lpad(vDate.getSeconds(), 2);
                },
                /**
                 * Microseconds: `000000-999000`
                 * @return {string}
                 */
                u: function () {
                    return _lpad(vDate.getMilliseconds() * 1000, 6);
                },

                //////////////
                // TIMEZONE //
                //////////////
                /**
                 * Timezone identifier: `e.g. Atlantic/Azores, ...`
                 * @return {string}
                 */
                e: function () {
                    var str = /\((.*)\)/.exec(String(vDate))[1];
                    return str || 'Coordinated Universal Time';
                },
                /**
                 * Timezone abbreviation: `e.g. EST, MDT, ...`
                 * @return {string}
                 */
                T: function () {
                    var str = (String(vDate).match(self.tzParts) || [""]).pop().replace(self.tzClip, "");
                    return str || 'UTC';
                },
                /**
                 * DST observed? `0 or 1`
                 * @return {number}
                 */
                I: function () {
                    var a = new Date(fmt.Y(), 0), c = Date.UTC(fmt.Y(), 0),
                        b = new Date(fmt.Y(), 6), d = Date.UTC(fmt.Y(), 6);
                    return ((a - c) !== (b - d)) ? 1 : 0;
                },
                /**
                 * Difference to GMT in hour format: `e.g. +0200`
                 * @return {string}
                 */
                O: function () {
                    var tzo = vDate.getTimezoneOffset(), a = Math.abs(tzo);
                    return (tzo > 0 ? '-' : '+') + _lpad(Math.floor(a / 60) * 100 + a % 60, 4);
                },
                /**
                 * Difference to GMT with colon: `e.g. +02:00`
                 * @return {string}
                 */
                P: function () {
                    var O = fmt.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                /**
                 * Timezone offset in seconds: `-43200...50400`
                 * @return {number}
                 */
                Z: function () {
                    return -vDate.getTimezoneOffset() * 60;
                },

                ////////////////////
                // FULL DATE TIME //
                ////////////////////
                /**
                 * ISO-8601 date
                 * @return {string}
                 */
                c: function () {
                    return 'Y-m-d\\TH:i:sP'.replace(backspace, doFormat);
                },
                /**
                 * RFC 2822 date
                 * @return {string}
                 */
                r: function () {
                    return 'D, d M Y H:i:s O'.replace(backspace, doFormat);
                },
                /**
                 * Seconds since UNIX epoch
                 * @return {number}
                 */
                U: function () {
                    return vDate.getTime() / 1000 || 0;
                }
            };
            return doFormat(vChar, vChar);
        },
        formatDate: function (vDate, vFormat) {
            var self = this, i, n, len, str, vChar, vDateStr = '';
            if (typeof vDate === 'string') {
                vDate = self.parseDate(vDate, vFormat);
                if (vDate === false) {
                    return false;
                }
            }
            if (vDate instanceof Date) {
                len = vFormat.length;
                for (i = 0; i < len; i++) {
                    vChar = vFormat.charAt(i);
                    if (vChar === 'S') {
                        continue;
                    }
                    str = self.parseFormat(vChar, vDate);
                    if (i !== (len - 1) && self.intParts.test(vChar) && vFormat.charAt(i + 1) === 'S') {
                        n = parseInt(str);
                        str += self.dateSettings.ordinal(n);
                    }
                    vDateStr += str;
                }
                return vDateStr;
            }
            return '';
        }
    };
})();/**
 * @preserve jQuery DateTimePicker plugin v2.5.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * @author Chupurnov Valeriy (<chupurnov@gmail.com>)
 */
/*global DateFormatter, document,window,jQuery,setTimeout,clearTimeout,HighlightedDate,getCurrentValue*/
;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'jquery-mousewheel'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    var default_options  = {
        i18n: {
            ar: { // Arabic
                months: [
                    "ГђВ©Г‘вЂњГђВЁГ‚В§ГђВ©Гўв‚¬ ГђВ©ГўвЂљВ¬ГђВ©Гўв‚¬  ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В«ГђВЁГ‚В§ГђВ©Гўв‚¬ ГђВ©ГђвЂ°", "ГђВЁГ’вЂГђВЁГђВЃГђВЁГ‚В§ГђВЁГ‚В·", "ГђВЁГ‘ЕѕГђВЁГ‚В°ГђВЁГ‚В§ГђВЁГ‚В±", "ГђВ©Гўв‚¬ ГђВ©ГђвЂ°ГђВЁГ‘вЂ“ГђВЁГ‚В§ГђВ©Гўв‚¬ ", "ГђВ©Гўв‚¬В¦ГђВЁГ‚В§ГђВ©ГђвЂ°ГђВ©ГўвЂљВ¬", "ГђВЁГ‚В­ГђВЁГђвЂ ГђВ©ГђвЂ°ГђВЁГ‚В±ГђВЁГ‚В§ГђВ©Гўв‚¬ ", "ГђВЁГђвЂћГђВ©Гўв‚¬В¦ГђВ©ГўвЂљВ¬ГђВЁГђвЂ ", "ГђВЁГ‘ЕѕГђВЁГђВЃ", "ГђВЁГђЛ†ГђВ©ГђвЂ°ГђВ©Гўв‚¬ЕѕГђВ©ГўвЂљВ¬ГђВ©Гўв‚¬Еѕ", "ГђВЁГђвЂћГђВЁГ’вЂГђВЁГ‚В±ГђВ©ГђвЂ°ГђВ©Гўв‚¬  ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГђЛ†ГђВ©ГўвЂљВ¬ГђВ©Гўв‚¬Еѕ", "ГђВЁГђвЂћГђВЁГ’вЂГђВЁГ‚В±ГђВ©ГђвЂ°ГђВ©Гўв‚¬  ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В«ГђВЁГ‚В§ГђВ©Гўв‚¬ ГђВ©ГђвЂ°", "ГђВ©Г‘вЂњГђВЁГ‚В§ГђВ©Гўв‚¬ ГђВ©ГўвЂљВ¬ГђВ©Гўв‚¬  ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГђЛ†ГђВ©ГўвЂљВ¬ГђВ©Гўв‚¬Еѕ"
                ],
                dayOfWeekShort: [
                    "ГђВ©Гўв‚¬ ", "ГђВЁГ‚В«", "ГђВЁГўвЂћвЂ“", "ГђВЁГ‚В®", "ГђВЁГ‚В¬", "ГђВЁГ‘вЂ“", "ГђВЁГ‚В­"
                ],
                dayOfWeek: ["ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГђЛ†ГђВЁГ‚В­ГђВЁГђвЂЎ", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В§ГђВЁГ‚В«ГђВ©Гўв‚¬ ГђВ©ГђвЂ°ГђВ©Гўв‚¬ ", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В«ГђВ©Гўв‚¬ЕѕГђВЁГ‚В§ГђВЁГ‚В«ГђВЁГ‚В§ГђВЁГђЕЅ", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГђЛ†ГђВЁГ‚В±ГђВЁГђВЃГђВЁГўвЂћвЂ“ГђВЁГ‚В§ГђВЁГђЕЅ", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В®ГђВ©Гўв‚¬В¦ГђВ©ГђвЂ°ГђВЁГ‘вЂ“", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‚В¬ГђВ©Гўв‚¬В¦ГђВЁГўвЂћвЂ“ГђВЁГ‚В©", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГ‘вЂ“ГђВЁГђВЃГђВЁГђвЂћ", "ГђВЁГ‚В§ГђВ©Гўв‚¬ЕѕГђВЁГђЛ†ГђВЁГ‚В­ГђВЁГђвЂЎ"]
            },
            ro: { // Romanian
                months: [
                    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
                ],
                dayOfWeekShort: [
                    "Du", "Lu", "Ma", "Mi", "Jo", "Vi", "SГђвЂњГ‘Еѕ"
                ],
                dayOfWeek: ["DuminicГђвЂќГ‘вЂњ", "Luni", "MarГђвЂўГђЛ†i", "Miercuri", "Joi", "Vineri", "SГђвЂњГ‘ЕѕmbГђвЂќГ‘вЂњtГђвЂќГ‘вЂњ"]
            },
            id: { // Indonesian
                months: [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeekShort: [
                    "Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"
                ],
                dayOfWeek: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
            },
            is: { // Icelandic
                months: [
                    "JanГђвЂњГ‘вЂќar", "FebrГђвЂњГ‘вЂќar", "Mars", "AprГђвЂњГ‚В­l", "MaГђвЂњГ‚В­", "JГђвЂњГ‘вЂќnГђвЂњГ‚В­", "JГђвЂњГ‘вЂќlГђвЂњГ‚В­", "ГђвЂњГђЖ’gГђвЂњГ‘вЂќst", "September", "OktГђвЂњГ‘вЂ“ber", "NГђвЂњГ‘вЂ“vember", "Desember"
                ],
                dayOfWeekShort: [
                    "Sun", "MГђвЂњГђЕЅn", "ГђвЂњГ‘вЂєriГђвЂњГ‚В°", "MiГђвЂњГ‚В°", "Fim", "FГђвЂњГ‚В¶s", "Lau"
                ],
                dayOfWeek: ["Sunnudagur", "MГђвЂњГђЕЅnudagur", "ГђвЂњГ‘вЂєriГђвЂњГ‚В°judagur", "MiГђвЂњГ‚В°vikudagur", "Fimmtudagur", "FГђвЂњГ‚В¶studagur", "Laugardagur"]
            },
            bg: { // Bulgarian
                months: [
                    "Гђ ГђвЂЎГђ ГђвЂ¦ГђВЎГ‘вЂњГђ Г‚В°ГђВЎГђвЂљГђ Г‘вЂ", "Гђ Г‚В¤Гђ Г‚ВµГђ ГђвЂ ГђВЎГђвЂљГђВЎГ‘вЂњГђ Г‚В°ГђВЎГђвЂљГђ Г‘вЂ", "Гђ Г‘ЕЎГђ Г‚В°ГђВЎГђвЂљГђВЎГўв‚¬ЕЎ", "Гђ Г‘вЂ™Гђ Г‘вЂ”ГђВЎГђвЂљГђ Г‘вЂГђ Г‚В»", "Гђ Г‘ЕЎГђ Г‚В°Гђ ГўвЂћвЂ“", "Гђ Г‚В®Гђ ГђвЂ¦Гђ Г‘вЂ", "Гђ Г‚В®Гђ Г‚В»Гђ Г‘вЂ", "Гђ Г‘вЂ™Гђ ГђвЂ Гђ Г‘вЂ“ГђВЎГ‘вЂњГђВЎГђЖ’ГђВЎГўв‚¬ЕЎ", "Гђ ГђЕЅГђ Г‚ВµГђ Г‘вЂ”ГђВЎГўв‚¬ЕЎГђ Г‚ВµГђ Г‘ЛњГђ ГђвЂ ГђВЎГђвЂљГђ Г‘вЂ", "Гђ Г‘вЂєГђ Г‘вЂќГђВЎГўв‚¬ЕЎГђ Г‘вЂўГђ Г‘ЛњГђ ГђвЂ ГђВЎГђвЂљГђ Г‘вЂ", "Гђ Г‘Е“Гђ Г‘вЂўГђ Г‚ВµГђ Г‘ЛњГђ ГђвЂ ГђВЎГђвЂљГђ Г‘вЂ", "Гђ Гўв‚¬ВќГђ Г‚ВµГђ Г‘вЂќГђ Г‚ВµГђ Г‘ЛњГђ ГђвЂ ГђВЎГђвЂљГђ Г‘вЂ"
                ],
                dayOfWeekShort: [
                    "Гђ Г‘Е“Гђ Г’вЂ", "Гђ Г‘ЕёГђ ГђвЂ¦", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬ЕЎ", "Гђ ГђЕЅГђВЎГђвЂљ", "Гђ Г‚В§ГђВЎГўв‚¬ЕЎ", "Гђ Г‘ЕёГђВЎГўв‚¬ЕЎ", "Гђ ГђЕЅГђ Г‚В±"
                ],
                dayOfWeek: ["Гђ Г‘Е“Гђ Г‚ВµГђ Г’вЂГђ Г‚ВµГђ Г‚В»ГђВЎГђВЏ", "Гђ Г‘ЕёГђ Г‘вЂўГђ ГђвЂ¦Гђ Г‚ВµГђ Г’вЂГђ Г‚ВµГђ Г‚В»Гђ ГђвЂ¦Гђ Г‘вЂГђ Г‘вЂќ", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬ЕЎГђ Г‘вЂўГђВЎГђвЂљГђ ГђвЂ¦Гђ Г‘вЂГђ Г‘вЂќ", "Гђ ГђЕЅГђВЎГђвЂљГђВЎГђВЏГђ Г’вЂГђ Г‚В°", "Гђ Г‚В§Гђ Г‚ВµГђВЎГўв‚¬ЕЎГђ ГђвЂ ГђВЎГђвЂ°ГђВЎГђвЂљГђВЎГўв‚¬ЕЎГђВЎГђвЂ°Гђ Г‘вЂќ", "Гђ Г‘ЕёГђ Г‚ВµГђВЎГўв‚¬ЕЎГђВЎГђвЂ°Гђ Г‘вЂќ", "Гђ ГђЕЅГђВЎГђвЂ°Гђ Г‚В±Гђ Г‘вЂўГђВЎГўв‚¬ЕЎГђ Г‚В°"]
            },
            fa: { // Persian/Farsi
                months: [
                    'ГђВ©ГђЖ’ГђВЁГ‚В±ГђВ©ГўвЂљВ¬ГђВЁГ‚В±ГђВЁГђвЂЎГђВ«ГђЕ ГђВ©Гўв‚¬ ', 'ГђВЁГ‚В§ГђВЁГ‚В±ГђВЁГђвЂЎГђВ«ГђЕ ГђВЁГђВЃГђВ©Гўв‚¬ВЎГђВЁГ’вЂГђВЁГђвЂћ', 'ГђВЁГ‚В®ГђВЁГ‚В±ГђВЁГђвЂЎГђВЁГ‚В§ГђВЁГђвЂЎ', 'ГђВЁГђвЂћГђВ«ГђЕ ГђВЁГ‚В±', 'ГђВ©Гўв‚¬В¦ГђВЁГ‚В±ГђВЁГђвЂЎГђВЁГ‚В§ГђВЁГђвЂЎ', 'ГђВЁГ’вЂГђВ©Гўв‚¬ВЎГђВЁГ‚В±ГђВ«ГђЕ ГђВ©ГўвЂљВ¬ГђВЁГ‚В±', 'ГђВ©Гўв‚¬В¦ГђВ©Гўв‚¬ВЎГђВЁГ‚В±', 'ГђВЁГ‘ЕѕГђВЁГђВЃГђВЁГ‚В§ГђВ©Гўв‚¬ ', 'ГђВЁГ‘ЕѕГђВЁГ‚В°ГђВЁГ‚В±', 'ГђВЁГђвЂЎГђВ«ГђЕ ', 'ГђВЁГђВЃГђВ©Гўв‚¬ВЎГђВ©Гўв‚¬В¦ГђВ©Гўв‚¬ ', 'ГђВЁГ‚В§ГђВЁГ‘вЂ“ГђВ©ГђЖ’ГђВ©Гўв‚¬ ГђВЁГђвЂЎ'
                ],
                dayOfWeekShort: [
                    'ГђВ«ГђЕ ГђВЄГ‚В©ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ', 'ГђВЁГђвЂЎГђВ©ГўвЂљВ¬ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ', 'ГђВЁГ‘вЂ“ГђВ©Гўв‚¬ВЎ ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ', 'ГђВЄГўв‚¬ ГђВ©Гўв‚¬ВЎГђВЁГ‚В§ГђВЁГ‚В±ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ', 'ГђВ©Г‘вЂўГђВ©Гўв‚¬ ГђВЁГ‚В¬ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ', 'ГђВЁГ‚В¬ГђВ©Гўв‚¬В¦ГђВЁГўвЂћвЂ“ГђВ©Гўв‚¬ВЎ', 'ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ'
                ],
                dayOfWeek: ["ГђВ«ГђЕ ГђВЄГ‚В©ГђВІГђвЂљГђЕ ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВЁГђвЂЎГђВ©ГўвЂљВ¬ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВЁГ‘вЂ“ГђВ©Гўв‚¬ВЎГђВІГђвЂљГђЕ ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВЄГўв‚¬ ГђВ©Гўв‚¬ВЎГђВЁГ‚В§ГђВЁГ‚В±ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВ©Г‘вЂўГђВ©Гўв‚¬ ГђВЁГ‚В¬ГђВІГђвЂљГђЕ ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВЁГ‚В¬ГђВ©Гўв‚¬В¦ГђВЁГўвЂћвЂ“ГђВ©Гўв‚¬ВЎ", "ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ", "ГђВ«ГђЕ ГђВЄГ‚В©ГђВІГђвЂљГђЕ ГђВЁГ’вЂГђВ©Гўв‚¬ ГђВЁГђВЃГђВ©Гўв‚¬ВЎ"]
            },
            ru: { // Russian
                months: [
                    'Гђ ГђвЂЎГђ ГђвЂ¦Гђ ГђвЂ Гђ Г‚В°ГђВЎГђвЂљГђВЎГђЕ ', 'Гђ Г‚В¤Гђ Г‚ВµГђ ГђвЂ ГђВЎГђвЂљГђ Г‚В°Гђ Г‚В»ГђВЎГђЕ ', 'Гђ Г‘ЕЎГђ Г‚В°ГђВЎГђвЂљГђВЎГўв‚¬ЕЎ', 'Гђ Г‘вЂ™Гђ Г‘вЂ”ГђВЎГђвЂљГђ Г‚ВµГђ Г‚В»ГђВЎГђЕ ', 'Гђ Г‘ЕЎГђ Г‚В°Гђ ГўвЂћвЂ“', 'Гђ Г‚ЛњГђВЎГђвЂ№Гђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Г‚ЛњГђВЎГђвЂ№Гђ Г‚В»ГђВЎГђЕ ', 'Гђ Г‘вЂ™Гђ ГђвЂ Гђ Г‘вЂ“ГђВЎГ‘вЂњГђВЎГђЖ’ГђВЎГўв‚¬ЕЎ', 'Гђ ГђЕЅГђ Г‚ВµГђ ГђвЂ¦ГђВЎГўв‚¬ЕЎГђВЎГђВЏГђ Г‚В±ГђВЎГђвЂљГђВЎГђЕ ', 'Гђ Г‘вЂєГђ Г‘вЂќГђВЎГўв‚¬ЕЎГђВЎГђВЏГђ Г‚В±ГђВЎГђвЂљГђВЎГђЕ ', 'Гђ Г‘Е“Гђ Г‘вЂўГђВЎГђВЏГђ Г‚В±ГђВЎГђвЂљГђВЎГђЕ ', 'Гђ Гўв‚¬ВќГђ Г‚ВµГђ Г‘вЂќГђ Г‚В°Гђ Г‚В±ГђВЎГђвЂљГђВЎГђЕ '
                ],
                dayOfWeekShort: [
                    "Гђ Гўв‚¬в„ўГђВЎГђЖ’", "Гђ Г‘ЕёГђ ГђвЂ¦", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬ЕЎ", "Гђ ГђЕЅГђВЎГђвЂљ", "Гђ Г‚В§ГђВЎГўв‚¬ЕЎ", "Гђ Г‘ЕёГђВЎГўв‚¬ЕЎ", "Гђ ГђЕЅГђ Г‚В±"
                ],
                dayOfWeek: ["Гђ Гўв‚¬в„ўГђ Г‘вЂўГђВЎГђЖ’Гђ Г‘вЂќГђВЎГђвЂљГђ Г‚ВµГђВЎГђЖ’Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ Гђ Г‚Вµ", "Гђ Г‘ЕёГђ Г‘вЂўГђ ГђвЂ¦Гђ Г‚ВµГђ Г’вЂГђ Г‚ВµГђ Г‚В»ГђВЎГђЕ Гђ ГђвЂ¦Гђ Г‘вЂГђ Г‘вЂќ", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬ЕЎГђ Г‘вЂўГђВЎГђвЂљГђ ГђвЂ¦Гђ Г‘вЂГђ Г‘вЂќ", "Гђ ГђЕЅГђВЎГђвЂљГђ Г‚ВµГђ Г’вЂГђ Г‚В°", "Гђ Г‚В§Гђ Г‚ВµГђВЎГўв‚¬ЕЎГђ ГђвЂ Гђ Г‚ВµГђВЎГђвЂљГђ Г‘вЂ“", "Гђ Г‘ЕёГђВЎГђВЏГђВЎГўв‚¬ЕЎГђ ГђвЂ¦Гђ Г‘вЂГђВЎГўв‚¬ Гђ Г‚В°", "Гђ ГђЕЅГђВЎГ‘вЂњГђ Г‚В±Гђ Г‚В±Гђ Г‘вЂўГђВЎГўв‚¬ЕЎГђ Г‚В°"]
            },
            uk: { // Ukrainian
                months: [
                    'Гђ ГђЕЅГђВЎГўв‚¬вЂњГђВЎГўв‚¬ВЎГђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Гўв‚¬ВєГђВЎГђвЂ№ГђВЎГўв‚¬ЕЎГђ Г‘вЂГђ ГўвЂћвЂ“', 'Гђ Гўв‚¬ЛњГђ Г‚ВµГђВЎГђвЂљГђ Г‚ВµГђ Г‚В·Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Г‘в„ўГђ ГђвЂ ГђВЎГўв‚¬вЂњГђВЎГўв‚¬ЕЎГђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Г‘ЕѕГђВЎГђвЂљГђ Г‚В°Гђ ГђвЂ Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Г‚В§Гђ Г‚ВµГђВЎГђвЂљГђ ГђвЂ Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Гўв‚¬ВєГђ Г‘вЂГђ Г‘вЂ”Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ ГђЕЅГђ Г‚ВµГђВЎГђвЂљГђ Г‘вЂ”Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Гўв‚¬в„ўГђ Г‚ВµГђВЎГђвЂљГђ Г‚ВµГђВЎГђЖ’Гђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Гўв‚¬вЂњГђ Г‘вЂўГђ ГђвЂ ГђВЎГўв‚¬ЕЎГђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ ', 'Гђ Гўв‚¬ВєГђ Г‘вЂГђВЎГђЖ’ГђВЎГўв‚¬ЕЎГђ Г‘вЂўГђ Г‘вЂ”Гђ Г‚В°Гђ Г’вЂ', 'Гђ Гўв‚¬Е“ГђВЎГђвЂљГђВЎГ‘вЂњГђ Г’вЂГђ Г‚ВµГђ ГђвЂ¦ГђВЎГђЕ '
                ],
                dayOfWeekShort: [
                    "Гђ Г‘Е“Гђ Г’вЂГђ Г‚В»", "Гђ Г‘ЕёГђ ГђвЂ¦Гђ Г’вЂ", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬ЕЎГђВЎГђвЂљ", "Гђ ГђЕЅГђВЎГђвЂљГђ Г’вЂ", "Гђ Г‚В§ГђВЎГўв‚¬ЕЎГђ ГђвЂ ", "Гђ Г‘ЕёГђВЎГўв‚¬ЕЎГђ ГђвЂ¦", "Гђ ГђЕЅГђ Г‚В±ГђВЎГўв‚¬ЕЎ"
                ],
                dayOfWeek: ["Гђ Г‘Е“Гђ Г‚ВµГђ Г’вЂГђВЎГўв‚¬вЂњГђ Г‚В»ГђВЎГђВЏ", "Гђ Г‘ЕёГђ Г‘вЂўГђ ГђвЂ¦Гђ Г‚ВµГђ Г’вЂГђВЎГўв‚¬вЂњГђ Г‚В»Гђ Г‘вЂўГђ Г‘вЂќ", "Гђ Гўв‚¬в„ўГђВЎГўв‚¬вЂњГђ ГђвЂ ГђВЎГўв‚¬ЕЎГђ Г‘вЂўГђВЎГђвЂљГђ Г‘вЂўГђ Г‘вЂќ", "Гђ ГђЕЅГђ Г‚ВµГђВЎГђвЂљГђ Г‚ВµГђ Г’вЂГђ Г‚В°", "Гђ Г‚В§Гђ Г‚ВµГђВЎГўв‚¬ЕЎГђ ГђвЂ Гђ Г‚ВµГђВЎГђвЂљ", "Гђ Г‘Её'ГђВЎГђВЏГђВЎГўв‚¬ЕЎГђ ГђвЂ¦Гђ Г‘вЂГђВЎГўв‚¬ ГђВЎГђВЏ", "Гђ ГђЕЅГђВЎГ‘вЂњГђ Г‚В±Гђ Г‘вЂўГђВЎГўв‚¬ЕЎГђ Г‚В°"]
            },
            en: { // English
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ],
                dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            el: { // ГђЕѕГўв‚¬ВўГђЕѕГ‚В»ГђЕѕГ‚В»ГђЕѕГ‚В·ГђЕѕГђвЂ¦ГђЕѕГўвЂћвЂ“ГђЕѕГ‘вЂќГђЕѕГ‚В¬
                months: [
                    "ГђЕѕГўвЂћВўГђЕѕГ‚В±ГђЕѕГђвЂ¦ГђЕѕГ‘вЂ”ГђЕёГўв‚¬В¦ГђЕѕГ‚В¬ГђЕёГђЖ’ГђЕѕГўвЂћвЂ“ГђЕѕГ‘вЂ”ГђЕёГўв‚¬ЕЎ", "ГђЕѕГ‚В¦ГђЕѕГ‚ВµГђЕѕГђвЂ ГђЕёГђЖ’ГђЕѕГ‘вЂ”ГђЕёГўв‚¬В¦ГђЕѕГ‚В¬ГђЕёГђЖ’ГђЕѕГўвЂћвЂ“ГђЕѕГ‘вЂ”ГђЕёГўв‚¬ЕЎ", "ГђЕѕГ‘ЕЎГђЕѕГ‚В¬ГђЕёГђЖ’ГђЕёГўв‚¬ЕѕГђЕѕГўвЂћвЂ“ГђЕѕГ‘вЂ”ГђЕёГўв‚¬ЕЎ", "ГђЕѕГўв‚¬ЛњГђЕёГђвЂљГђЕ该惼捗惻久愨�∶惻久偮幻惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪脩拧脨啪脗卢脨啪芒鈥炩�撁惻久戔�斆惻该⑩偓拧", "脨啪芒鈥灺⒚惻久戔�斆惻该惻捗惻久愨�γ惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪芒鈥灺⒚惻久戔�斆惻该惻捗惻久偮幻惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪芒鈧溍惻该惻捗惻久戔�撁惻久戔�斆惻该⑩偓娄脨鸥脩鈥溍惻该⑩偓啪脨啪脩鈥斆惻该⑩偓拧", "脨啪脨藛脨啪脗碌脨鸥脨鈥毭惻该⑩偓啪脨啪脗颅脨啪脩藴脨啪脨鈥犆惻该惼捗惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪脩鸥脨啪脩鈥澝惻该⑩偓啪脨鸥脨鈥姑惻久愨�犆惻该惼捗惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪脩艙脨啪脩鈥斆惻久偮惻久懰溍惻久愨�犆惻该惼捗惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧", "脨啪芒鈧澝惻久偮得惻久戔�澝惻久偮惻久懰溍惻久愨�犆惻该惼捗惻久⑩�炩�撁惻久戔�斆惻该⑩偓拧"
                ],
                dayOfWeekShort: [
                    "脨啪脩鈩⒚惻该⑩偓娄脨鸥脨茠", "脨啪芒鈧澝惻久偮得惻该⑩偓娄", "脨啪脗陇脨鸥脨茠脨啪芒鈥炩��", "脨啪脗陇脨啪脗碌脨鸥芒鈧�", "脨啪 脨啪脗碌脨啪脩藴", "脨啪 脨啪脗卤脨鸥脨茠", "脨啪脨藛脨啪脗卤脨啪脨鈥�"
                ],
                dayOfWeek: ["脨啪脩鈩⒚惻该⑩偓娄脨鸥脨茠脨啪芒鈥炩�撁惻久偮泵惻久戔�澝惻久偮�", "脨啪芒鈧澝惻久偮得惻该⑩偓娄脨鸥芒鈧久惻久偮惻该惼捗惻久偮�", "脨啪脗陇脨鸥脨茠脨啪脨鈥∶惻该⑩偓啪脨啪脗路", "脨啪脗陇脨啪脗碌脨鸥芒鈧久惻久偮惻该惼捗惻该⑩偓啪脨啪脗路", "脨啪 脨啪脗颅脨啪脩藴脨鸥脨鈥毭惻该⑩偓啪脨啪脗路", "脨啪 脨啪脗卤脨鸥脨茠脨啪脗卤脨鸥脩鈥溍惻久戔�澝惻久偮得惻该⑩偓娄脨啪脗庐", "脨啪脨藛脨啪脗卢脨啪脨鈥犆惻久愨�犆惻久偮泵惻该⑩偓啪脨啪脩鈥�"]
            },
            de: { // German
                months: [
                    'Januar', 'Februar', 'M脨鈥溍偮z', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                ],
                dayOfWeekShort: [
                    "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
                ],
                dayOfWeek: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
            },
            nl: { // Dutch
                months: [
                    "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
                ],
                dayOfWeekShort: [
                    "zo", "ma", "di", "wo", "do", "vr", "za"
                ],
                dayOfWeek: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
            },
            tr: { // Turkish
                months: [
                    "Ocak", "脨鈥⒚戔�簎bat", "Mart", "Nisan", "May脨鈥澝偮眘", "Haziran", "Temmuz", "A脨鈥澝懪竨stos", "Eyl脨鈥溍懰渓", "Ekim", "Kas脨鈥澝偮眒", "Aral脨鈥澝偮眐"
                ],
                dayOfWeekShort: [
                    "Paz", "Pts", "Sal", "脨鈥溍⑩偓隆ar", "Per", "Cum", "Cts"
                ],
                dayOfWeek: ["Pazar", "Pazartesi", "Sal脨鈥澝偮�", "脨鈥溍⑩偓隆ar脨鈥⒚懪竌mba", "Per脨鈥⒚懪竐mbe", "Cuma", "Cumartesi"]
            },
            fr: { //French
                months: [
                    "Janvier", "F脨鈥溍偮﹙rier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao脨鈥溍偮籺", "Septembre", "Octobre", "Novembre", "D脨鈥溍偮ヽembre"
                ],
                dayOfWeekShort: [
                    "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
                ],
                dayOfWeek: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
            },
            es: { // Spanish
                months: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "Mi脨鈥溍偮�", "Jue", "Vie", "S脨鈥溍惻絙"
                ],
                dayOfWeek: ["Domingo", "Lunes", "Martes", "Mi脨鈥溍偮﹔coles", "Jueves", "Viernes", "S脨鈥溍惻絙ado"]
            },
            th: { // Thai
                months: [
                    '脨掳脩鈥樏惻矫惵懊戔�樏惼捗惵懊戔�樏愃喢惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳脩鈥樏惼捗惵懊戔�樏戔�樏惵懊戔�樏惻矫惵懊戔�� 脨掳脩鈥樏愨�犆惵懊戔�樏戔�好惵懊戔�樏偮泵惵懊戔�樏⑩�灺⒚惵懊戔�樏偹溍惵懊⑩�炩�撁惻�', '脨掳脩鈥樏惻矫惵懊戔�樏偮得惵懊戔�樏⑩�灺⒚惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳芒鈥炩�撁愨�毭惵懊戔�樏惻矫惵懊戔�樏偮┟惵懊戔�樏愨�犆惵懊戔�樏懪久惵懊戔�樏⑩�灺�', '脨掳脩鈥樏戔�好惵懊戔�樏偮っ惵懊戔�樏偮┟惵懊戔�� 脨掳脩鈥樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳脩鈥樏惻矫惵懊戔�樏掆�樏惵懊戔�樏⑩偓鈥溍惵懊戔�樏戔�樏惵懊戔�樏⑩�灺⒚惵懊戔�樏愨�犆惵懊戔�樏懪久惵懊戔�樏⑩�灺�', '脨掳脩鈥樏惼捗惵懊戔�樏愃喢惵懊戔�樏惼捗惵懊戔�樏愨�姑惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳脩鈥樏愨�灻惵懊戔�樏掆�樏惵懊戔�樏⑩偓隆脨掳脩鈥樏偮惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳脩鈥樏惼捗惵懊戔�樏偮泵惵懊戔�樏⑩�灺⒚惵懊戔�樏懪久惵懊戔�樏愨�犆惵懊戔�樏懪久惵懊戔�樏⑩�灺�', '脨掳脩鈥樏⑩偓垄脨掳脩鈥樏戔�樏惵懊戔�樏捖惷惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�', '脨掳脩鈥樏戔�好惵懊戔�樏偮っ惵懊戔�樏惵伱惵懊戔�樏⑩�毬惵懊戔�樏掆�樏惵懊戔�樏惼捗惵懊戔�樏愨�犆惵懊戔�樏懪久惵懊戔�樏⑩�灺�', '脨掳脩鈥樏偹溍惵懊戔�樏偮泵惵懊戔�樏⑩�灺⒚惵懊戔�樏偮惵懊戔�樏愨�犆惵懊戔�樏⑩偓啪脨掳脩鈥樏惻�'
                ],
                dayOfWeekShort: [
                    '脨掳脩鈥樏偮惵懊戔�樏愨��.', '脨掳脩鈥樏⑩�毬�.', '脨掳脩鈥樏偮�.', '脨掳脩鈥樏戔��.', '脨掳脩鈥樏戔�好惵懊戔�樏偮�.', '脨掳脩鈥樏惵�.', '脨掳脩鈥樏愨��.'
                ],
                dayOfWeek: ["脨掳脩鈥樏偮惵懊戔�樏愨�犆惵懊戔�樏⑩偓鈥澝惵懊戔�樏掆�樏惵懊戔�樏⑩偓垄脨掳脩鈥樏懪久惵懊⑩�炩�撁惻�", "脨掳脩鈥樏⑩�毬惵懊戔�樏偮泵惵懊戔�樏⑩�灺⒚惵懊戔�樏⑩偓鈥澝惵懊戔�樏愃喢惵懊⑩�炩�撁惻�", "脨掳脩鈥樏偮惵懊戔�樏偮泵惵懊戔�樏⑩偓隆脨掳脩鈥樏⑩偓啪脨掳脩鈥樏愨�犆惵懊戔�樏愃�", "脨掳脩鈥樏戔�好惵懊戔�樏戔�樏惵懊戔�樏偹�", "脨掳脩鈥樏戔�好惵懊戔�樏偮っ惵懊戔�樏偮惵懊戔�樏偮泵惵懊戔�樏愨��", "脨掳脩鈥樏惵伱惵懊戔�樏戔�樏惵懊戔�樏惼捗惵懊戔�樏愃喢惵懊⑩�炩�撁惻�", "脨掳芒鈥炩�撁愨�毭惵懊戔�樏愨�灻惵懊戔�樏愨�犆惵懊戔�樏愃喢惵懊⑩�炩�撁惻�", "脨掳脩鈥樏偮惵懊戔�樏愨�犆惵懊戔�樏⑩偓鈥澝惵懊戔�樏掆�樏惵懊戔�樏⑩偓垄脨掳脩鈥樏懪久惵懊⑩�炩�撁惻�"]
            },
            pl: { // Polish
                months: [
                    "stycze脨鈥⒚⑩偓啪", "luty", "marzec", "kwiecie脨鈥⒚⑩偓啪", "maj", "czerwiec", "lipiec", "sierpie脨鈥⒚⑩偓啪", "wrzesie脨鈥⒚⑩偓啪", "pa脨鈥⒚戔�漝ziernik", "listopad", "grudzie脨鈥⒚⑩偓啪"
                ],
                dayOfWeekShort: [
                    "nd", "pn", "wt", "脨鈥⒚⑩偓潞r", "cz", "pt", "sb"
                ],
                dayOfWeek: ["niedziela", "poniedzia脨鈥⒚⑩偓拧ek", "wtorek", "脨鈥⒚⑩偓潞roda", "czwartek", "pi脨鈥澝⑩偓娄tek", "sobota"]
            },
            pt: { // Portuguese
                months: [
                    "Janeiro", "Fevereiro", "Mar脨鈥溍偮", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeekShort: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
                ],
                dayOfWeek: ["Domingo", "Segunda", "Ter脨鈥溍偮", "Quarta", "Quinta", "Sexta", "S脨鈥溍惻絙ado"]
            },
            ch: { // Simplified Chinese
                months: [
                    "脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�", "脨麓脩鈥樏⑩偓掳脨露脩拧芒鈥毬�", "脨碌芒鈧好⑩偓潞脨露脩拧芒鈥毬�", "脨麓脩鈥澝⑩偓聺脨露脩拧芒鈥毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓脩鈥樏戔�溍惵睹懪∶⑩�毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓芒鈥炩�撁懪撁惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨露脩拧芒鈥毬�", "脨碌脨艗脨茠脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�"
                ],
                dayOfWeekShort: [
                    "脨露芒鈧�澝捖�", "脨麓脩鈥樏愨��", "脨麓脩鈥澝惻�", "脨麓脩鈥樏⑩偓掳", "脨碌芒鈧好⑩偓潞", "脨麓脩鈥澝⑩偓聺", "脨碌芒鈧γ偮�"
                ]
            },
            se: { // Swedish
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September",  "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "S脨鈥溍偮秐", "M脨鈥溍捖恘", "Tis", "Ons", "Tor", "Fre", "L脨鈥溍偮秗"
                ]
            },
            kr: { // Korean
                months: [
                    "1脨录芒鈧好⑩偓聺", "2脨录芒鈧好⑩偓聺", "3脨录芒鈧好⑩偓聺", "4脨录芒鈧好⑩偓聺", "5脨录芒鈧好⑩偓聺", "6脨录芒鈧好⑩偓聺", "7脨录芒鈧好⑩偓聺", "8脨录芒鈧好⑩偓聺", "9脨录芒鈧好⑩偓聺", "10脨录芒鈧好⑩偓聺", "11脨录芒鈧好⑩偓聺", "12脨录芒鈧好⑩偓聺"
                ],
                dayOfWeekShort: [
                    "脨录脩艙脩藴", "脨录芒鈧好⑩偓聺", "脨陆芒鈥灺⒚⑩偓聺", "脨录芒鈥毬偹�", "脨禄脨鈥灻偮�", "脨潞脩鈥樏⑩�毬�", "脨陆芒鈧�  "
                ],
                dayOfWeek: ["脨录脩艙脩藴脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨录芒鈧好⑩偓聺脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨陆芒鈥灺⒚⑩偓聺脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨录芒鈥毬偹溍惵济戔劉芒鈧澝惵济懪撁懰�", "脨禄脨鈥灻偮┟惵济戔劉芒鈧澝惵济懪撁懰�", "脨潞脩鈥樏⑩�毬惵济戔劉芒鈧澝惵济懪撁懰�", "脨陆芒鈧�  脨录脩鈩⒚⑩偓聺脨录脩艙脩藴"]
            },
            it: { // Italian
                months: [
                    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
                ],
                dayOfWeek: ["Domenica", "Luned脨鈥溍偮�", "Marted脨鈥溍偮�", "Mercoled脨鈥溍偮�", "Gioved脨鈥溍偮�", "Venerd脨鈥溍偮�", "Sabato"]
            },
            da: { // Dansk
                months: [
                    "January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "S脨鈥溍戔�榥", "Man", "Tir", "Ons", "Tor", "Fre", "L脨鈥溍戔�榬"
                ],
                dayOfWeek: ["s脨鈥溍戔�榥dag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l脨鈥溍戔�榬dag"]
            },
            no: { // Norwegian
                months: [
                    "Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeekShort: [
                    "S脨鈥溍戔�榥", "Man", "Tir", "Ons", "Tor", "Fre", "L脨鈥溍戔�榬"
                ],
                dayOfWeek: ['S脨鈥溍戔�榥dag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L脨鈥溍戔�榬dag']
            },
            ja: { // Japanese
                months: [
                    "1脨露脩拧芒鈥毬�", "2脨露脩拧芒鈥毬�", "3脨露脩拧芒鈥毬�", "4脨露脩拧芒鈥毬�", "5脨露脩拧芒鈥毬�", "6脨露脩拧芒鈥毬�", "7脨露脩拧芒鈥毬�", "8脨露脩拧芒鈥毬�", "9脨露脩拧芒鈥毬�", "10脨露脩拧芒鈥毬�", "11脨露脩拧芒鈥毬�", "12脨露脩拧芒鈥毬�"
                ],
                dayOfWeekShort: [
                    "脨露芒鈧�澝捖�", "脨露脩拧芒鈥毬�", "脨路脨茠脗芦", "脨露脗掳脪鈥�", "脨露脩拧脨聛", "脨鹿芒鈧∶⑩偓藴", "脨碌脩拧脩鸥"
                ],
                dayOfWeek: ["脨露芒鈧�澝捖惷惵睹⑩偓潞脩拧", "脨露脩拧芒鈥毬惵睹⑩偓潞脩拧", "脨路脨茠脗芦脨露芒鈧好懪�", "脨露脗掳脪鈥樏惵睹⑩偓潞脩拧", "脨露脩拧脨聛脨露芒鈧好懪�", "脨鹿芒鈧∶⑩偓藴脨露芒鈧好懪�", "脨碌脩拧脩鸥脨露芒鈧好懪�"]
            },
            vi: { // Vietnamese
                months: [
                    "Th脨鈥溍惻絥g 1", "Th脨鈥溍惻絥g 2", "Th脨鈥溍惻絥g 3", "Th脨鈥溍惻絥g 4", "Th脨鈥溍惻絥g 5", "Th脨鈥溍惻絥g 6", "Th脨鈥溍惻絥g 7", "Th脨鈥溍惻絥g 8", "Th脨鈥溍惻絥g 9", "Th脨鈥溍惻絥g 10", "Th脨鈥溍惻絥g 11", "Th脨鈥溍惻絥g 12"
                ],
                dayOfWeekShort: [
                    "CN", "T2", "T3", "T4", "T5", "T6", "T7"
                ],
                dayOfWeek: ["Ch脨卤脗禄脗搂 nh脨卤脩鈥澝偮璽", "Th脨卤脗禄脗漏 hai", "Th脨卤脗禄脗漏 ba", "Th脨卤脗禄脗漏 t脨鈥撁偮�", "Th脨卤脗禄脗漏 n脨鈥澝戔�渕", "Th脨卤脗禄脗漏 s脨鈥溍惻絬", "Th脨卤脗禄脗漏 b脨卤脩鈥澝愃唝"]
            },
            sl: { // Sloven脨鈥⒚惻矫愨�澝惻抜na
                months: [
                    "Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Tor", "Sre", "脨鈥澝惻爀t", "Pet", "Sob"
                ],
                dayOfWeek: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "脨鈥澝惻爀trtek", "Petek", "Sobota"]
            },
            cs: { // 脨鈥澝惻爀脨鈥⒚惻絫ina
                months: [
                    "Leden", "脨鈥溍戔劉nor", "B脨鈥⒚⑩�灺zen", "Duben", "Kv脨鈥澝⑩偓潞ten", "脨鈥澝惻爀rven", "脨鈥澝惻爀rvenec", "Srpen", "Z脨鈥溍惻矫愨�⒚⑩�灺⒚愨�溍偮�", "脨鈥⒚偹溍愨�溍偮璲en", "Listopad", "Prosinec"
                ],
                dayOfWeekShort: [
                    "Ne", "Po", "脨鈥溍戔劉t", "St", "脨鈥澝惻爐", "P脨鈥溍惻�", "So"
                ]
            },
            hu: { // Hungarian
                months: [
                    "Janu脨鈥溍惻絩", "Febru脨鈥溍惻絩", "M脨鈥溍惻絩cius", "脨鈥溍惼抪rilis", "M脨鈥溍惻絡us", "J脨鈥溍戔�漬ius", "J脨鈥溍戔�漧ius", "Augusztus", "Szeptember", "Okt脨鈥溍戔�揵er", "November", "December"
                ],
                dayOfWeekShort: [
                    "Va", "H脨鈥溍偮�", "Ke", "Sze", "Cs", "P脨鈥溍偮�", "Szo"
                ],
                dayOfWeek: ["vas脨鈥溍惻絩nap", "h脨鈥溍偮﹖f脨鈥⒚⑩偓藴", "kedd", "szerda", "cs脨鈥溍懰渢脨鈥溍偮秗t脨鈥溍偮秌", "p脨鈥溍偮﹏tek", "szombat"]
            },
            az: { //Azerbaijanian (Azeri)
                months: [
                    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
                ],
                dayOfWeekShort: [
                    "B", "Be", "脨鈥溍⑩偓隆a", "脨鈥溍⑩偓隆", "Ca", "C", "脨鈥⒚戔��"
                ],
                dayOfWeek: ["Bazar", "Bazar ert脨鈩⒚⑩�灺i", "脨鈥溍⑩偓隆脨鈩⒚⑩�灺脨鈥⒚懪该愨劉芒鈥灺b脨鈩⒚⑩�灺� ax脨鈥⒚懪竌m脨鈥澝偮�", "脨鈥溍⑩偓隆脨鈩⒚⑩�灺脨鈥⒚懪该愨劉芒鈥灺b脨鈩⒚⑩�灺�", "C脨鈥溍懰渕脨鈩⒚⑩�灺� ax脨鈥⒚懪竌m脨鈥澝偮�", "C脨鈥溍懰渕脨鈩⒚⑩�灺�", "脨鈥⒚戔�好愨劉芒鈥灺b脨鈩⒚⑩�灺�"]
            },
            bs: { //Bosanski
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sri", "脨鈥澝惻爀t", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedjelja","Ponedjeljak", "Utorak", "Srijeda", "脨鈥澝惻爀tvrtak", "Petak", "Subota"]
            },
            ca: { //Catal脨鈥� 
                months: [
                    "Gener", "Febrer", "Mar脨鈥溍偮�", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
                ],
                dayOfWeekShort: [
                    "Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"
                ],
                dayOfWeek: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"]
            },
            'en-GB': { //English (British)
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ],
                dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            et: { //"Eesti"
                months: [
                    "Jaanuar", "Veebruar", "M脨鈥溍偮ts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"
                ],
                dayOfWeekShort: [
                    "P", "E", "T", "K", "N", "R", "L"
                ],
                dayOfWeek: ["P脨鈥溍懰渉ap脨鈥溍偮v", "Esmasp脨鈥溍偮v", "Teisip脨鈥溍偮v", "Kolmap脨鈥溍偮v", "Neljap脨鈥溍偮v", "Reede", "Laup脨鈥溍偮v"]
            },
            eu: { //Euskara
                months: [
                    "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"
                ],
                dayOfWeekShort: [
                    "Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."
                ],
                dayOfWeek: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata']
            },
            fi: { //Finnish (Suomi)
                months: [
                    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes脨鈥溍偮uu", "Hein脨鈥溍偮uu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
                ],
                dayOfWeekShort: [
                    "Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
                ],
                dayOfWeek: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"]
            },
            gl: { //Galego
                months: [
                    "Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"
                ],
                dayOfWeek: ["Domingo", "Luns", "Martes", "M脨鈥溍偮﹔cores", "Xoves", "Venres", "S脨鈥溍惻絙ado"]
            },
            hr: { //Hrvatski
                months: [
                    "Sije脨鈥澝惻抋nj", "Velja脨鈥澝惻抋", "O脨鈥⒚戔�jak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sri", "脨鈥澝惻爀t", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "脨鈥澝惻爀tvrtak", "Petak", "Subota"]
            },
            ko: { //Korean (脨陆芒鈧⒚懪∶惵好偮得偮惵济⑩偓鈥溍掆��)
                months: [
                    "1脨录芒鈧好⑩偓聺", "2脨录芒鈧好⑩偓聺", "3脨录芒鈧好⑩偓聺", "4脨录芒鈧好⑩偓聺", "5脨录芒鈧好⑩偓聺", "6脨录芒鈧好⑩偓聺", "7脨录芒鈧好⑩偓聺", "8脨录芒鈧好⑩偓聺", "9脨录芒鈧好⑩偓聺", "10脨录芒鈧好⑩偓聺", "11脨录芒鈧好⑩偓聺", "12脨录芒鈧好⑩偓聺"
                ],
                dayOfWeekShort: [
                    "脨录脩艙脩藴", "脨录芒鈧好⑩偓聺", "脨陆芒鈥灺⒚⑩偓聺", "脨录芒鈥毬偹�", "脨禄脨鈥灻偮�", "脨潞脩鈥樏⑩�毬�", "脨陆芒鈧�  "
                ],
                dayOfWeek: ["脨录脩艙脩藴脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨录芒鈧好⑩偓聺脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨陆芒鈥灺⒚⑩偓聺脨录脩鈩⒚⑩偓聺脨录脩艙脩藴", "脨录芒鈥毬偹溍惵济戔劉芒鈧澝惵济懪撁懰�", "脨禄脨鈥灻偮┟惵济戔劉芒鈧澝惵济懪撁懰�", "脨潞脩鈥樏⑩�毬惵济戔劉芒鈧澝惵济懪撁懰�", "脨陆芒鈧�  脨录脩鈩⒚⑩偓聺脨录脩艙脩藴"]
            },
            lt: { //Lithuanian (lietuvi脨鈥⒚戔��)
                months: [
                    "Sausio", "Vasario", "Kovo", "Baland脨鈥⒚戔�o", "Gegu脨鈥⒚戔�⒚愨�澝⑩偓鈥漵", "Bir脨鈥⒚戔�lio", "Liepos", "Rugpj脨鈥⒚偮愨�澝惻抜o", "Rugs脨鈥澝⑩偓鈥漥o", "Spalio", "Lapkri脨鈥澝惻抜o", "Gruod脨鈥⒚戔�o"
                ],
                dayOfWeekShort: [
                    "Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "脨鈥� e脨鈥⒚惻�"
                ],
                dayOfWeek: ["Sekmadienis", "Pirmadienis", "Antradienis", "Tre脨鈥澝惻抜adienis", "Ketvirtadienis", "Penktadienis", "脨鈥� e脨鈥⒚惻絫adienis"]
            },
            lv: { //Latvian (Latvie脨鈥⒚惻絬)
                months: [
                    "Janv脨鈥澝惼抮is", "Febru脨鈥澝惼抮is", "Marts", "Apr脨鈥澝偮玪is ", "Maijs", "J脨鈥⒚偮玭ijs", "J脨鈥⒚偮玪ijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
                ],
                dayOfWeekShort: [
                    "Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"
                ],
                dayOfWeek: ["Sv脨鈥澝⑩偓艙tdiena", "Pirmdiena", "Otrdiena", "Tre脨鈥⒚惻絛iena", "Ceturtdiena", "Piektdiena", "Sestdiena"]
            },
            mk: { //Macedonian (脨 脩拧脨 脗掳脨 脩鈥澝� 脗碌脨 脪鈥樏� 脩鈥⒚� 脨鈥γ惵∶惼捗� 脩鈥澝� 脩鈥�)
                months: [
                    "脨隆脗藴脨 脗掳脨 脨鈥γ惵∶戔�溍� 脗掳脨隆脨鈥毭� 脩鈥�", "脨隆芒鈧久� 脗碌脨 脨鈥犆惵∶愨�毭惵∶戔�溍� 脗掳脨隆脨鈥毭� 脩鈥�", "脨 脩藴脨 脗掳脨隆脨鈥毭惵∶⑩偓拧", "脨 脗掳脨 脩鈥斆惵∶愨�毭� 脩鈥樏� 脗禄", "脨 脩藴脨 脗掳脨隆脗藴", "脨隆脗藴脨隆脩鈥溍� 脨鈥γ� 脩鈥�", "脨隆脗藴脨隆脩鈥溍� 脗禄脨 脩鈥�", "脨 脗掳脨 脨鈥犆� 脩鈥撁惵∶戔�溍惵∶惼捗惵∶⑩偓拧", "脨隆脨茠脨 脗碌脨 脩鈥斆惵∶⑩偓拧脨 脗碌脨 脩藴脨 脨鈥犆惵∶愨�毭� 脩鈥�", "脨 脩鈥⒚� 脩鈥澝惵∶⑩偓拧脨 脩鈥⒚� 脩藴脨 脨鈥犆惵∶愨�毭� 脩鈥�", "脨 脨鈥γ� 脩鈥⒚� 脗碌脨 脩藴脨 脨鈥犆惵∶愨�毭� 脩鈥�", "脨 脪鈥樏� 脗碌脨 脩鈥澝� 脗碌脨 脩藴脨 脨鈥犆惵∶愨�毭� 脩鈥�"
                ],
                dayOfWeekShort: [
                    "脨 脨鈥γ� 脗碌脨 脪鈥�", "脨 脩鈥斆� 脩鈥⒚� 脨鈥�", "脨 脨鈥犆惵∶⑩偓拧脨 脩鈥�", "脨隆脨茠脨隆脨鈥毭� 脗碌", "脨隆芒鈧∶� 脗碌脨隆芒鈧�", "脨 脩鈥斆� 脗碌脨隆芒鈧�", "脨隆脨茠脨 脗掳脨 脗卤"
                ],
                dayOfWeek: ["脨 脩艙脨 脗碌脨 脪鈥樏� 脗碌脨 脗禄脨 脗掳", "脨 脩鸥脨 脩鈥⒚� 脨鈥γ� 脗碌脨 脪鈥樏� 脗碌脨 脗禄脨 脨鈥γ� 脩鈥樏� 脩鈥�", "脨 芒鈧劉脨隆芒鈧∶� 脩鈥⒚惵∶愨�毭� 脨鈥γ� 脩鈥樏� 脩鈥�", "脨 脨沤脨隆脨鈥毭� 脗碌脨 脪鈥樏� 脗掳", "脨 脗搂脨 脗碌脨隆芒鈧∶� 脨鈥犆惵∶愨�毭惵∶⑩偓拧脨 脩鈥⒚� 脩鈥�", "脨 脩鸥脨 脗碌脨隆芒鈧∶� 脩鈥⒚� 脩鈥�", "脨 脨沤脨 脗掳脨 脗卤脨 脩鈥⒚惵∶⑩偓拧脨 脗掳"]
            },
            mn: { //Mongolian (脨 脩拧脨 脩鈥⒚� 脨鈥γ� 脩鈥撁� 脩鈥⒚� 脗禄)
                months: [
                    "1-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "2-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "3-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "4-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "5-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "6-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "7-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "8-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "9-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "10-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "11-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�", "12-脨隆脨鈥� 脨隆脨茠脨 脗掳脨隆脨鈥�"
                ],
                dayOfWeekShort: [
                    "脨 芒鈧澝� 脗掳脨 脨鈥�", "脨 脩拧脨隆脨聫脨 脩鈥�", "脨 芒鈧好惵∶⑩偓娄脨 脗掳", "脨 脩鸥脨垄脨鈥∶惵∶愨��", "脨 芒鈧溍惵∶惼捗� 脨鈥�", "脨 芒鈧溍惵∶惵徝� 脩藴", "脨 脩艙脨隆脨聫脨 脩藴"
                ],
                dayOfWeek: ["脨 芒鈧澝� 脗掳脨 脨鈥犆� 脗掳脨 脗掳", "脨 脩拧脨隆脨聫脨 脩鈥撁� 脩藴脨 脗掳脨隆脨鈥�", "脨 芒鈧好惵∶⑩偓娄脨 脗掳脨 脩鈥撁� 脨鈥犆� 脗掳", "脨 脩鸥脨垄脨鈥∶惵∶愨�毭惵∶惻捗� 脨鈥�", "脨 芒鈧溍� 脗掳脨 脗掳脨隆脨茠脨 脗掳脨 脨鈥�", "脨 芒鈧溍惵∶惵徝� 脩藴脨 脗卤脨 脗掳", "脨 脩艙脨隆脨聫脨 脩藴"]
            },
            'pt-BR': { //Portugu脨鈥溍愨�瀞(Brasil)
                months: [
                    "Janeiro", "Fevereiro", "Mar脨鈥溍偮", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeekShort: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S脨鈥溍惻絙"
                ],
                dayOfWeek: ["Domingo", "Segunda", "Ter脨鈥溍偮", "Quarta", "Quinta", "Sexta", "S脨鈥溍惻絙ado"]
            },
            sk: { //Sloven脨鈥澝惻抜na
                months: [
                    "Janu脨鈥溍惻絩", "Febru脨鈥溍惻絩", "Marec", "Apr脨鈥溍偮璴", "M脨鈥溍惻絡", "J脨鈥溍戔�漬", "J脨鈥溍戔�漧", "August", "September", "Okt脨鈥溍戔�揵er", "November", "December"
                ],
                dayOfWeekShort: [
                    "Ne", "Po", "Ut", "St", "脨鈥� t", "Pi", "So"
                ],
                dayOfWeek: ["Nede脨鈥澝戔�", "Pondelok", "Utorok", "Streda", "脨鈥� tvrtok", "Piatok", "Sobota"]
            },
            sq: { //Albanian (Shqip)
                months: [
                    "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "N脨鈥溍偮玭tor", "Dhjetor"
                ],
                dayOfWeekShort: [
                    "Die", "H脨鈥溍偮玭", "Mar", "M脨鈥溍偮玶", "Enj", "Pre", "Shtu"
                ],
                dayOfWeek: ["E Diel", "E H脨鈥溍偮玭脨鈥溍偮�", "E Mart脨鈥澝⑩偓艙", "E M脨鈥溍偮玶kur脨鈥溍偮�", "E Enjte", "E Premte", "E Shtun脨鈥溍偮�"]
            },
            'sr-YU': { //Serbian (Srpski)
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sre", "脨鈥澝惻抏t", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedelja","Ponedeljak", "Utorak", "Sreda", "脨鈥澝惻爀tvrtak", "Petak", "Subota"]
            },
            sr: { //Serbian Cyrillic (脨 脨沤脨隆脨鈥毭� 脩鈥斆惵∶惼捗� 脩鈥澝� 脩鈥�)
                months: [
                    "脨隆脗藴脨 脗掳脨 脨鈥γ惵∶戔�溍� 脗掳脨隆脨鈥�", "脨隆芒鈧久� 脗碌脨 脗卤脨隆脨鈥毭惵∶戔�溍� 脗掳脨隆脨鈥�", "脨 脩藴脨 脗掳脨隆脨鈥毭惵∶⑩偓拧", "脨 脗掳脨 脩鈥斆惵∶愨�毭� 脩鈥樏� 脗禄", "脨 脩藴脨 脗掳脨隆脗藴", "脨隆脗藴脨隆脩鈥溍� 脨鈥�", "脨隆脗藴脨隆脩鈥溍� 脗禄", "脨 脗掳脨 脨鈥犆� 脩鈥撁惵∶戔�溍惵∶惼捗惵∶⑩偓拧", "脨隆脨茠脨 脗碌脨 脩鈥斆惵∶⑩偓拧脨 脗碌脨 脩藴脨 脗卤脨 脗掳脨隆脨鈥�", "脨 脩鈥⒚� 脩鈥澝惵∶⑩偓拧脨 脩鈥⒚� 脗卤脨 脗掳脨隆脨鈥�", "脨 脨鈥γ� 脩鈥⒚� 脨鈥犆� 脗碌脨 脩藴脨 脗卤脨 脗掳脨隆脨鈥�", "脨 脪鈥樏� 脗碌脨隆芒鈧� 脨 脗碌脨 脩藴脨 脗卤脨 脗掳脨隆脨鈥�"
                ],
                dayOfWeekShort: [
                    "脨 脨鈥γ� 脗碌脨 脪鈥�", "脨 脩鈥斆� 脩鈥⒚� 脨鈥�", "脨隆脩鈥溍惵∶⑩偓拧脨 脩鈥�", "脨隆脨茠脨隆脨鈥毭� 脗碌", "脨隆芒鈧∶� 脗碌脨隆芒鈧�", "脨 脩鈥斆� 脗碌脨隆芒鈧�", "脨隆脨茠脨隆脩鈥溍� 脗卤"
                ],
                dayOfWeek: ["脨 脩艙脨 脗碌脨 脪鈥樏� 脗碌脨隆芒鈥灺⒚� 脗掳","脨 脩鸥脨 脩鈥⒚� 脨鈥γ� 脗碌脨 脪鈥樏� 脗碌脨隆芒鈥灺⒚� 脗掳脨 脩鈥�", "脨 脨藛脨隆芒鈧∶� 脩鈥⒚惵∶愨�毭� 脗掳脨 脩鈥�", "脨 脨沤脨隆脨鈥毭� 脗碌脨 脪鈥樏� 脗掳", "脨 脗搂脨 脗碌脨隆芒鈧∶� 脨鈥犆惵∶愨�毭惵∶⑩偓拧脨 脗掳脨 脩鈥�", "脨 脩鸥脨 脗碌脨隆芒鈧∶� 脗掳脨 脩鈥�", "脨 脨沤脨隆脩鈥溍� 脗卤脨 脩鈥⒚惵∶⑩偓拧脨 脗掳"]
            },
            sv: { //Svenska
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "S脨鈥溍偮秐", "M脨鈥溍捖恘", "Tis", "Ons", "Tor", "Fre", "L脨鈥溍偮秗"
                ],
                dayOfWeek: ["S脨鈥溍偮秐dag", "M脨鈥溍捖恘dag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "L脨鈥溍偮秗dag"]
            },
            'zh-TW': { //Traditional Chinese (脨路芒鈥炩�撁惼捗惵姑偮⑩偓聺脨麓脩鈥樏偮惵睹⑩偓鈥溍⑩偓隆)
                months: [
                    "脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�", "脨麓脩鈥樏⑩偓掳脨露脩拧芒鈥毬�", "脨碌芒鈧好⑩偓潞脨露脩拧芒鈥毬�", "脨麓脩鈥澝⑩偓聺脨露脩拧芒鈥毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓脩鈥樏戔�溍惵睹懪∶⑩�毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓芒鈥炩�撁懪撁惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨露脩拧芒鈥毬�", "脨碌脨艗脨茠脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�"
                ],
                dayOfWeekShort: [
                    "脨露芒鈧�澝捖�", "脨麓脩鈥樏愨��", "脨麓脩鈥澝惻�", "脨麓脩鈥樏⑩偓掳", "脨碌芒鈧好⑩偓潞", "脨麓脩鈥澝⑩偓聺", "脨碌芒鈧γ偮�"
                ],
                dayOfWeek: ["脨露脗藴脩鸥脨露脩拧脩鸥脨露芒鈧�澝捖�", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥樏愨��", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥澝惻�", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥樏⑩偓掳", "脨露脗藴脩鸥脨露脩拧脩鸥脨碌芒鈧好⑩偓潞", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥澝⑩偓聺", "脨露脗藴脩鸥脨露脩拧脩鸥脨碌芒鈧γ偮�"]
            },
            zh: { //Simplified Chinese (脨路脗庐脨鈥毭惵疵愨�γ⑩偓艙脨麓脩鈥樏偮惵睹⑩偓鈥溍⑩偓隆)
                months: [
                    "脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�", "脨麓脩鈥樏⑩偓掳脨露脩拧芒鈥毬�", "脨碌芒鈧好⑩偓潞脨露脩拧芒鈥毬�", "脨麓脩鈥澝⑩偓聺脨露脩拧芒鈥毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓脩鈥樏戔�溍惵睹懪∶⑩�毬�", "脨碌芒鈧γ偮惵睹懪∶⑩�毬�", "脨麓芒鈥炩�撁懪撁惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨露脩拧芒鈥毬�", "脨碌脨艗脨茠脨麓脩鈥樏愨�毭惵睹懪∶⑩�毬�", "脨碌脨艗脨茠脨麓脩鈥澝惻犆惵睹懪∶⑩�毬�"
                ],
                dayOfWeekShort: [
                    "脨露芒鈧�澝捖�", "脨麓脩鈥樏愨��", "脨麓脩鈥澝惻�", "脨麓脩鈥樏⑩偓掳", "脨碌芒鈧好⑩偓潞", "脨麓脩鈥澝⑩偓聺", "脨碌芒鈧γ偮�"
                ],
                dayOfWeek: ["脨露脗藴脩鸥脨露脩拧脩鸥脨露芒鈧�澝捖�", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥樏愨��", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥澝惻�", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥樏⑩偓掳", "脨露脗藴脩鸥脨露脩拧脩鸥脨碌芒鈧好⑩偓潞", "脨露脗藴脩鸥脨露脩拧脩鸥脨麓脩鈥澝⑩偓聺", "脨露脗藴脩鸥脨露脩拧脩鸥脨碌芒鈧γ偮�"]
            },
            he: { //Hebrew (脨搂脩啪脨搂芒鈧溍惵惵伱惵⑩�灺⒚惵愨��)
                months: [
                    '脨搂芒鈥灺⒚惵� 脨搂芒鈧⒚惵戔�櫭惵惵�', '脨搂脗陇脨搂芒鈧溍惵惵伱惵⑩偓垄脨搂脩鈥櫭惵惵�', '脨搂脩鈥好惵惵伱惵捖�', '脨搂脩鈥櫭惵偮っ惵惵伱惵⑩�灺⒚惵懪�', '脨搂脩鈥好惵戔�櫭惵⑩�灺�', '脨搂芒鈥灺⒚惵⑩偓垄脨搂 脨搂芒鈥灺�', '脨搂芒鈥灺⒚惵⑩偓垄脨搂脩拧脨搂芒鈥灺�', '脨搂脩鈥櫭惵⑩偓垄脨搂芒鈧劉脨搂芒鈧⒚惵惻矫惵偹�', '脨搂脨沤脨搂脗陇脨搂脗藴脨搂脩鈥好惵⑩偓藴脨搂脨聛', '脨搂脩鈥櫭惵⑩偓垄脨搂脗搂脨搂脗藴脨搂芒鈧⒚惵⑩偓藴脨搂脨聛', '脨搂 脨搂芒鈧⒚惵⑩偓藴脨搂脩鈥好惵⑩偓藴脨搂脨聛', '脨搂芒鈧撁惵偮γ惵戔�好惵⑩偓藴脨搂脨聛'
                ],
                dayOfWeekShort: [
                    '脨搂脩鈥橽'', '脨搂芒鈧淺'', '脨搂芒鈧劉\'', '脨搂芒鈧揬'', '脨搂芒鈧漒'', '脨搂芒鈧'', '脨搂脗漏脨搂芒鈧溍惵愨��'
                ],
                dayOfWeek: ["脨搂脨聛脨搂脩鈥櫭惵偮┟惵⑩偓垄脨搂脩鸥", "脨搂脗漏脨搂 脨搂芒鈥灺�", "脨搂脗漏脨搂脩拧脨搂芒鈥灺⒚惵偮┟惵⑩�灺�", "脨搂脨聛脨搂芒鈧溍惵⑩�灺⒚惵懪久惵⑩�灺�", "脨搂芒鈧�澝惵戔�好惵⑩�灺⒚惵偮┟惵⑩�灺�", "脨搂脗漏脨搂芒鈥灺⒚惵偮┟惵⑩�灺�", "脨搂脗漏脨搂芒鈧溍惵愨��", "脨搂脨聛脨搂脩鈥櫭惵偮┟惵⑩偓垄脨搂脩鸥"]
            },
            hy: { // Armenian
                months: [
                    "脨楼脨鈥毭惵ッ戔�樏惵γ⑩偓拧脨楼脗露脨楼脩鈥⒚惵ッ惻矫惵γ愨��", "脨楼芒鈧撁惵ッ捖惷惵ッ戔�斆惵γ愨�毭惵ッ戔�⒚惵ッ惻矫惵γ愨��", "脨楼芒鈧久惵ッ惻矫惵γ愨�毭惵ッ戔��", "脨陇脗卤脨楼脩鈥澝惵γ愨�毭惵ッ偮惵ッ偮�", "脨楼芒鈧久惵ッ惻矫惵ッ偮得惵ッ偮惵ッ愨��", "脨楼脨鈥毭惵ッ戔�樏惵γ⑩偓拧脨楼脗露脨楼脗芦脨楼脨鈥�", "脨楼脨鈥毭惵ッ戔�樏惵γ⑩偓拧脨楼脗卢脨楼脗芦脨楼脨鈥�", "脨楼芒鈧⒚惵ッ愃喢惵ッ戔�樏惵ッ愨�γ惵ッ戔�斆惵ッ戔�樏惵ッ愨��", "脨楼脨艗脨楼脪聬脨楼脩鈥澝惵ッ戔�斆惵ッ捖惷惵ッ掆�樏惵ッ懪久惵ッ捖惷惵γ愨��", "脨楼脨鈥毭惵ッ戔�樏惵ッ愨�∶惵ッ戔�斆惵ッ捖惷惵ッ掆�樏惵ッ懪久惵ッ捖惷惵γ愨��", "脨楼芒鈧� 脨楼脩鈥樏惵ッ偮得惵ッ捖惷惵ッ掆�樏惵ッ懪久惵ッ捖惷惵γ愨��", "脨陇脪鈥樏惵ッ捖惷惵ッ愨�∶惵ッ戔�斆惵ッ捖惷惵ッ掆�樏惵ッ懪久惵ッ捖惷惵γ愨��"
                ],
                dayOfWeekShort: [
                    "脨陇脩鈥斆惵ッ偮�", "脨陇脗碌脨娄脨鈥毭惵ッ愨��", "脨陇脗碌脨娄脨鈥毭惵γ⑩偓啪", "脨楼芒鈧懊惵ッ戔�樏惵γ愨��", "脨楼脨鈥毭惵ッ偮睹惵ッ愃�", "脨楼芒鈥毬惵γ⑩偓拧脨娄脨鈥毭惵ッ懪�", "脨楼芒鈧∶惵ッ懪久惵ッ偮�"
                ],
                dayOfWeek: ["脨陇脩鈥斆惵ッ偮惵γ愨�毭惵ッ惻矫惵ッ愨�∶惵ッ偮�", "脨陇脗碌脨娄脨鈥毭惵ッ愨�∶惵ッ戔�樏惵γ⑩偓拧脨楼脗路脨楼脨沤脨楼脩啪脨楼脗漏脨楼脗芦", "脨陇脗碌脨娄脨鈥毭惵ッ捖惷惵γ⑩偓啪脨楼脗路脨楼脨沤脨楼脩啪脨楼脗漏脨楼脗芦", "脨楼芒鈧懊惵ッ戔�樏惵γ愨�毭惵ッ捖惷惵γ⑩偓啪脨楼脗路脨楼脨沤脨楼脩啪脨楼脗漏脨楼脗芦", "脨楼脨鈥毭惵ッ偮惵ッ偮睹惵ッ愃喢惵ッ偮访惵ッ惻矫惵ッ懪久惵ッ偮┟惵ッ偮�", "脨楼芒鈥毬惵γ⑩偓拧脨娄脨鈥毭惵ッ懪久惵ッ惻矫惵ッ偮�", "脨楼芒鈧∶惵ッ惻矫惵ッ懪久惵ッ惻矫惵ッ偮�"]
            },
            kg: { // Kyrgyz
                months: [
                    '脨垄脗庐脨隆芒鈧∶惵∶⑩偓拧脨垄脨鈥∶� 脨鈥� 脨 脗掳脨 芒鈥炩�撁惵∶⑩偓鹿', '脨 芒鈧溍� 脩鈥樏惵∶愨�毭� 脪鈥樏� 脩鈥樏� 脨鈥� 脨 脗掳脨 芒鈥炩�撁惵∶⑩偓鹿', '脨 芒鈧�溍� 脗掳脨 脗禄脨 脩鈥撁� 脗掳脨 脨鈥� 脨 脩鈩⒚惵∶戔�溍惵∶愨�毭� 脗掳脨 脨鈥�', '脨 脗搂脨隆芒鈧姑� 脨鈥� 脨 脩鈩⒚惵∶戔�溍惵∶愨�毭� 脗掳脨 脨鈥�', '脨 芒鈧溍惵∶戔�溍� 脩鈥撁惵∶戔��', '脨 脩鈩⒚惵∶戔�溍� 脗禄脨 脗露脨 脗掳', '脨 脩啪脨 脗碌脨 脩鈥澝� 脗碌', '脨 芒鈧溍� 脗掳脨隆芒鈥毬� 脨 脩鈥好� 脩鈥⒚� 脨鈥γ� 脗掳', '脨 脩鈥櫭惵∶惵徝� 脩鈥� 脨 脩鈥好� 脩鈥⒚� 脨鈥γ� 脗掳', '脨 脩啪脨 脩鈥⒚� 脩鈥撁惵∶戔�溍� 脗路脨 脪鈥樏惵∶戔�溍� 脨鈥� 脨 脗掳脨 芒鈥炩�撁惵∶⑩偓鹿', '脨 芒鈧�溍� 脗碌脨隆芒鈧∶� 脩鈥樏� 脨鈥γ� 脩鈥樏� 脨鈥� 脨 脗掳脨 芒鈥炩�撁惵∶⑩偓鹿', '脨 芒鈧溍� 脗碌脨隆芒鈥毬惵∶⑩偓拧脨 脩鈥樏� 脨鈥� 脨 脗掳脨 芒鈥炩�撁惵∶⑩偓鹿'
                ],
                dayOfWeekShort: [
                    "脨 芒鈧�溍� 脗碌脨 脩鈥�", "脨 芒鈧澝惵⒚愨�∶� 芒鈥炩��", "脨 脨聛脨 脗碌脨 芒鈥炩��", "脨 脨聛脨 脗掳脨隆脨鈥�", "脨 芒鈧溍� 脗碌脨 芒鈥炩��", "脨 芒鈧�溍惵∶戔�溍� 脩藴", "脨 脗藴脨隆芒鈥毬� 脗碌"
                ],
                dayOfWeek: [
                    "脨 芒鈧�溍� 脗碌脨 脩鈥澝惵∶⑩�毬� 脗碌脨 脩藴脨 脗卤", "脨 芒鈧澝惵⒚愨�∶� 芒鈥炩�撁惵∶⑩�毬惵Ｃ偮┟� 脩藴脨 脗卤", "脨 脨聛脨 脗碌脨 芒鈥炩�撁惵∶⑩�毬� 脗碌脨 脩藴脨 脗卤", "脨 脨聛脨 脗掳脨隆脨鈥毭惵∶⑩�毬� 脗碌脨 脩藴脨 脗卤", "脨 芒鈧溍� 脗碌脨 芒鈥炩�撁惵∶⑩�毬� 脗碌脨 脩藴脨 脗卤脨 脩鈥�", "脨 芒鈧�溍惵∶戔�溍� 脩藴脨 脗掳", "脨 脗藴脨隆芒鈥毬� 脗碌脨 脨鈥γ� 脗卤"
                ]
            },
            rm: { // Romansh
                months: [
                    "Schaner", "Favrer", "Mars", "Avrigl", "Matg", "Zercladur", "Fanadur", "Avust", "Settember", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Du", "Gli", "Ma", "Me", "Gie", "Ve", "So"
                ],
                dayOfWeek: [
                    "Dumengia", "Glindesdi", "Mardi", "Mesemna", "Gievgia", "Venderdi", "Sonda"
                ]
            },
        },
        value: '',
        rtl: false,

        format: 'Y/m/d H:i',
        formatTime: 'H:i',
        formatDate: 'Y/m/d',

        startDate:  false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
        step: 60,
        monthChangeSpinner: true,

        closeOnDateSelect: false,
        closeOnTimeSelect: true,
        closeOnWithoutClick: true,
        closeOnInputClick: true,

        timepicker: true,
        datepicker: true,
        weeks: false,

        defaultTime: false, // use formatTime format (ex. '10:00' for formatTime:   'H:i')
        defaultDate: false, // use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

        minDate: false,
        maxDate: false,
        minTime: false,
        maxTime: false,
        disabledMinTime: false,
        disabledMaxTime: false,

        allowTimes: [],
        opened: false,
        initTime: true,
        inline: false,
        theme: '',

        onSelectDate: function () {},
        onSelectTime: function () {},
        onChangeMonth: function () {},
        onGetWeekOfYear: function () {},
        onChangeYear: function () {},
        onChangeDateTime: function () {},
        onShow: function () {},
        onClose: function () {},
        onGenerate: function () {},

        withoutCopyright: true,
        inverseButton: false,
        hours12: false,
        next: 'xdsoft_next',
        prev : 'xdsoft_prev',
        dayOfWeekStart: 0,
        parentID: 'body',
        timeHeightInTimePicker: 25,
        timepickerScrollbar: true,
        todayButton: true,
        prevButton: true,
        nextButton: true,
        defaultSelect: true,

        scrollMonth: true,
        scrollTime: true,
        scrollInput: true,

        lazyInit: false,
        mask: false,
        validateOnBlur: true,
        allowBlank: true,
        yearStart: 2000,
        yearEnd: 2050,
        monthStart: 0,
        monthEnd: 11,
        style: '',
        id: '',
        fixed: false,
        roundTime: 'round', // ceil, floor
        className: '',
        weekends: [],
        highlightedDates: [],
        highlightedPeriods: [],
        allowDates : [],
        allowDateRe : null,
        disabledDates : [],
        disabledWeekDays: [],
        yearOffset: 0,
        beforeShowDay: null,

        enterLikeTab: true,
        showApplyButton: false
    };

    var dateHelper = null,
        globalLocaleDefault = 'en',
        globalLocale = 'en';

    var dateFormatterOptionsDefault = {
        meridiem: ['AM', 'PM']
    };

    var initDateFormatter = function(){
        var locale = default_options.i18n[globalLocale],
            opts = {
                days: locale.dayOfWeek,
                daysShort: locale.dayOfWeekShort,
                months: locale.months,
                monthsShort: $.map(locale.months, function(n){ return n.substring(0, 3) }),
            };

        dateHelper = new DateFormatter({
            dateSettings: $.extend({}, dateFormatterOptionsDefault, opts)
        });
    };

    // for locale settings
    $.datetimepicker = {
        setLocale: function(locale){
            var newLocale = default_options.i18n[locale]?locale:globalLocaleDefault;
            if(globalLocale != newLocale){
                globalLocale = newLocale;
                // reinit date formatter
                initDateFormatter();
            }
        },
        RFC_2822: 'D, d M Y H:i:s O',
        ATOM: 'Y-m-d\TH:i:sP',
        ISO_8601: 'Y-m-d\TH:i:sO',
        RFC_822: 'D, d M y H:i:s O',
        RFC_850: 'l, d-M-y H:i:s T',
        RFC_1036: 'D, d M y H:i:s O',
        RFC_1123: 'D, d M Y H:i:s O',
        RSS: 'D, d M Y H:i:s O',
        W3C: 'Y-m-d\TH:i:sP'
    };

    // first init date formatter
    initDateFormatter();

    // fix for ie8
    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') {
                    prop = 'styleFloat';
                }
                if (re.test(prop)) {
                    prop = prop.replace(re, function (a, b, c) {
                        return c.toUpperCase();
                    });
                }
                return el.currentStyle[prop] || null;
            };
            return this;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            var i, j;
            for (i = (start || 0), j = this.length; i < j; i += 1) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        };
    }
    Date.prototype.countDaysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };
    $.fn.xdsoftScroller = function (percent) {
        return this.each(function () {
            var timeboxparent = $(this),
                pointerEventToXY = function (e) {
                    var out = {x: 0, y: 0},
                        touch;
                    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                        touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        out.x = touch.clientX;
                        out.y = touch.clientY;
                    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                        out.x = e.clientX;
                        out.y = e.clientY;
                    }
                    return out;
                },
                move = 0,
                timebox,
                parentHeight,
                height,
                scrollbar,
                scroller,
                maximumOffset = 100,
                start = false,
                startY = 0,
                startTop = 0,
                h1 = 0,
                touchStart = false,
                startTopScroll = 0,
                calcOffset = function () {};
            if (percent === 'hide') {
                timeboxparent.find('.xdsoft_scrollbar').hide();
                return;
            }
            if (!$(this).hasClass('xdsoft_scroller_box')) {
                timebox = timeboxparent.children().eq(0);
                parentHeight = timeboxparent[0].clientHeight;
                height = timebox[0].offsetHeight;
                scrollbar = $('<div class="xdsoft_scrollbar"></div>');
                scroller = $('<div class="xdsoft_scroller"></div>');
                scrollbar.append(scroller);

                timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
                calcOffset = function calcOffset(event) {
                    var offset = pointerEventToXY(event).y - startY + startTopScroll;
                    if (offset < 0) {
                        offset = 0;
                    }
                    if (offset + scroller[0].offsetHeight > h1) {
                        offset = h1 - scroller[0].offsetHeight;
                    }
                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
                };

                scroller
                    .on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
                        }

                        startY = pointerEventToXY(event).y;
                        startTopScroll = parseInt(scroller.css('margin-top'), 10);
                        h1 = scrollbar[0].offsetHeight;

                        if (event.type === 'mousedown' || event.type === 'touchstart') {
                            if (document) {
                                $(document.body).addClass('xdsoft_noselect');
                            }
                            $([document.body, window]).on('touchend mouseup.xdsoft_scroller', function arguments_callee() {
                                $([document.body, window]).off('touchend mouseup.xdsoft_scroller', arguments_callee)
                                    .off('mousemove.xdsoft_scroller', calcOffset)
                                    .removeClass('xdsoft_noselect');
                            });
                            $(document.body).on('mousemove.xdsoft_scroller', calcOffset);
                        } else {
                            touchStart = true;
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    })
                    .on('touchmove', function (event) {
                        if (touchStart) {
                            event.preventDefault();
                            calcOffset(event);
                        }
                    })
                    .on('touchend touchcancel', function (event) {
                        touchStart =  false;
                        startTopScroll = 0;
                    });

                timeboxparent
                    .on('scroll_element.xdsoft_scroller', function (event, percentage) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
                        }
                        percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

                        scroller.css('margin-top', maximumOffset * percentage);

                        setTimeout(function () {
                            timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
                        }, 10);
                    })
                    .on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
                        var percent, sh;
                        parentHeight = timeboxparent[0].clientHeight;
                        height = timebox[0].offsetHeight;
                        percent = parentHeight / height;
                        sh = percent * scrollbar[0].offsetHeight;
                        if (percent > 1) {
                            scroller.hide();
                        } else {
                            scroller.show();
                            scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
                            maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
                            if (noTriggerScroll !== true) {
                                timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
                            }
                        }
                    });

                timeboxparent.on('mousewheel', function (event) {
                    var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

                    top = top - (event.deltaY * 20);
                    if (top < 0) {
                        top = 0;
                    }

                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
                    event.stopPropagation();
                    return false;
                });

                timeboxparent.on('touchstart', function (event) {
                    start = pointerEventToXY(event);
                    startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
                });

                timeboxparent.on('touchmove', function (event) {
                    if (start) {
                        event.preventDefault();
                        var coord = pointerEventToXY(event);
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
                    }
                });

                timeboxparent.on('touchend touchcancel', function (event) {
                    start = false;
                    startTop = 0;
                });
            }
            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
        });
    };

    $.fn.datetimepicker = function (opt, opt2) {
        var result = this,
            KEY0 = 48,
            KEY9 = 57,
            _KEY0 = 96,
            _KEY9 = 105,
            CTRLKEY = 17,
            DEL = 46,
            ENTER = 13,
            ESC = 27,
            BACKSPACE = 8,
            ARROWLEFT = 37,
            ARROWUP = 38,
            ARROWRIGHT = 39,
            ARROWDOWN = 40,
            TAB = 9,
            F5 = 116,
            AKEY = 65,
            CKEY = 67,
            VKEY = 86,
            ZKEY = 90,
            YKEY = 89,
            ctrlDown    =   false,
            options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

            lazyInitTimer = 0,
            createDateTimePicker,
            destroyDateTimePicker,

            lazyInit = function (input) {
                input
                    .on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function initOnActionCallback(event) {
                        if (input.is(':disabled') || input.data('xdsoft_datetimepicker')) {
                            return;
                        }
                        clearTimeout(lazyInitTimer);
                        lazyInitTimer = setTimeout(function () {

                            if (!input.data('xdsoft_datetimepicker')) {
                                createDateTimePicker(input);
                            }
                            input
                                .off('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', initOnActionCallback)
                                .trigger('open.xdsoft');
                        }, 100);
                    });
            };

        createDateTimePicker = function (input) {
            var datetimepicker = $('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'),
                xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
                datepicker = $('<div class="xdsoft_datepicker active"></div>'),
                mounth_picker = $('<div class="xdsoft_mounthpicker head-of-dateTime"><button type="button" class="xdsoft_prev navigate-arrow nav-prev month-prev"></button><button type="button" class="xdsoft_today_button"></button>' +
                    '<div class="xdsoft_label xdsoft_month"><span></span><i></i></div>' +
                    '<div class="xdsoft_label xdsoft_year"><span></span><i></i></div>' +
                    '<div class="month-year"><div class="mounthes"><div class="wrap-mouth"></div></div><div class="year"></div></div>'+
                    '<button type="button" class="xdsoft_next navigate-arrow nav-next month-next" ></button></div>'),
                calendar = $('<div class="xdsoft_calendar"></div>'),
                timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
                timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
                timebox = $('<div class="xdsoft_time_variant"></div>'),
                applyButton = $('<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'),

                monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
                yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
                triggerAfterOpen = false,
                XDSoft_datetime,

                xchangeTimer,
                timerclick,
                current_time_index,
                setPos,
                timer = 0,
                timer1 = 0,
                _xdsoft_datetime;

            if (options.id) {
                datetimepicker.attr('id', options.id);
            }
            if (options.style) {
                datetimepicker.attr('style', options.style);
            }
            if (options.weeks) {
                datetimepicker.addClass('xdsoft_showweeks');
            }
            if (options.rtl) {
                datetimepicker.addClass('xdsoft_rtl');
            }

            datetimepicker.addClass('xdsoft_' + options.theme);
            datetimepicker.addClass(options.className);

            mounth_picker
                .find('.xdsoft_month span')
                    .after(monthselect);
            mounth_picker
                .find('.xdsoft_year span')
                    .after(yearselect);

            mounth_picker
                .find('.xdsoft_month,.xdsoft_year')
                    .on('touchstart mousedown.xdsoft', function (event) {
                    var select = $(this).find('.xdsoft_select').eq(0),
                        val = 0,
                        top = 0,
                        visible = select.is(':visible'),
                        items,
                        i;

                    mounth_picker
                        .find('.xdsoft_select')
                            .hide();
                    if (_xdsoft_datetime.currentTime) {
                        val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
                    }

                    select[visible ? 'hide' : 'show']();
                    for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
                        if (items.eq(i).data('value') === val) {
                            break;
                        } else {
                            top += items[0].offsetHeight;
                        }
                    }

                    select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
                    event.stopPropagation();

                    return false;
                });

            mounth_picker
                .find('.xdsoft_select')
                    .xdsoftScroller()
                .on('touchstart mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on('touchstart mousedown.xdsoft', '.xdsoft_option', function (event) {
                    if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                    }

                    var year = _xdsoft_datetime.currentTime.getFullYear();
                    if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
                        _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
                    }

                    $(this).parent().parent().hide();

                    datetimepicker.trigger('xchange.xdsoft');
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }

                    if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                });

            datetimepicker.getValue = function () {
                return _xdsoft_datetime.getCurrentTime();
            };

            datetimepicker.setOptions = function (_options) {
                var highlightedDates = {};


                options = $.extend(true, {}, options, _options);

                if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
                    options.allowTimes = $.extend(true, [], _options.allowTimes);
                }

                if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
                    options.weekends = $.extend(true, [], _options.weekends);
                }

                if (_options.allowDates && $.isArray(_options.allowDates) && _options.allowDates.length) {
                    options.allowDates = $.extend(true, [], _options.allowDates);
                }

                if (_options.allowDateRe && Object.prototype.toString.call(_options.allowDateRe)==="[object String]") {
                    options.allowDateRe = new RegExp(_options.allowDateRe);
                }

                if (_options.highlightedDates && $.isArray(_options.highlightedDates) && _options.highlightedDates.length) {
                    $.each(_options.highlightedDates, function (index, value) {
                        var splitData = $.map(value.split(','), $.trim),
                            exDesc,
                            hDate = new HighlightedDate(dateHelper.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]), // date, desc, style
                            keyDate = dateHelper.formatDate(hDate.date, options.formatDate);
                        if (highlightedDates[keyDate] !== undefined) {
                            exDesc = highlightedDates[keyDate].desc;
                            if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
                                highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
                            }
                        } else {
                            highlightedDates[keyDate] = hDate;
                        }
                    });

                    options.highlightedDates = $.extend(true, [], highlightedDates);
                }

                if (_options.highlightedPeriods && $.isArray(_options.highlightedPeriods) && _options.highlightedPeriods.length) {
                    highlightedDates = $.extend(true, [], options.highlightedDates);
                    $.each(_options.highlightedPeriods, function (index, value) {
                        var dateTest, // start date
                            dateEnd,
                            desc,
                            hDate,
                            keyDate,
                            exDesc,
                            style;
                        if ($.isArray(value)) {
                            dateTest = value[0];
                            dateEnd = value[1];
                            desc = value[2];
                            style = value[3];
                        }
                        else {
                            var splitData = $.map(value.split(','), $.trim);
                            dateTest = dateHelper.parseDate(splitData[0], options.formatDate);
                            dateEnd = dateHelper.parseDate(splitData[1], options.formatDate);
                            desc = splitData[2];
                            style = splitData[3];
                        }

                        while (dateTest <= dateEnd) {
                            hDate = new HighlightedDate(dateTest, desc, style);
                            keyDate = dateHelper.formatDate(dateTest, options.formatDate);
                            dateTest.setDate(dateTest.getDate() + 1);
                            if (highlightedDates[keyDate] !== undefined) {
                                exDesc = highlightedDates[keyDate].desc;
                                if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
                                    highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
                                }
                            } else {
                                highlightedDates[keyDate] = hDate;
                            }
                        }
                    });

                    options.highlightedDates = $.extend(true, [], highlightedDates);
                }

                if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
                    options.disabledDates = $.extend(true, [], _options.disabledDates);
                }

                if (_options.disabledWeekDays && $.isArray(_options.disabledWeekDays) && _options.disabledWeekDays.length) {
                    options.disabledWeekDays = $.extend(true, [], _options.disabledWeekDays);
                }

                if ((options.open || options.opened) && (!options.inline)) {
                    input.trigger('open.xdsoft');
                }

                if (options.inline) {
                    triggerAfterOpen = true;
                    datetimepicker.addClass('xdsoft_inline');
                    input.after(datetimepicker).hide();
                }

                if (options.inverseButton) {
                    options.next = 'xdsoft_prev';
                    options.prev = 'xdsoft_next';
                }

                if (options.datepicker) {
                    datepicker.addClass('active');
                } else {
                    datepicker.removeClass('active');
                }

                if (options.timepicker) {
                    timepicker.addClass('active');
                } else {
                    timepicker.removeClass('active');
                }

                if (options.value) {
                    _xdsoft_datetime.setCurrentTime(options.value);
                    if (input && input.val) {
                        input.val(_xdsoft_datetime.str);
                    }
                }

                if (isNaN(options.dayOfWeekStart)) {
                    options.dayOfWeekStart = 0;
                } else {
                    options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
                }

                if (!options.timepickerScrollbar) {
                    timeboxparent.xdsoftScroller('hide');
                }

                if (options.minDate && /^[\+\-](.*)$/.test(options.minDate)) {
                    options.minDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.minDate), options.formatDate);
                }

                if (options.maxDate &&  /^[\+\-](.*)$/.test(options.maxDate)) {
                    options.maxDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.maxDate), options.formatDate);
                }

                applyButton.toggle(options.showApplyButton);

                mounth_picker
                    .find('.xdsoft_today_button')
                        .css('visibility', !options.todayButton ? 'hidden' : 'visible');

                mounth_picker
                    .find('.' + options.prev)
                        .css('visibility', !options.prevButton ? 'hidden' : 'visible');

                mounth_picker
                    .find('.' + options.next)
                        .css('visibility', !options.nextButton ? 'hidden' : 'visible');

                setMask(options);

                if (options.validateOnBlur) {
                    input
                        .off('blur.xdsoft')
                        .on('blur.xdsoft', function () {
                            if (options.allowBlank && (!$.trim($(this).val()).length || $.trim($(this).val()) === options.mask.replace(/[0-9]/g, '_'))) {
                                $(this).val(null);
                                datetimepicker.data('xdsoft_datetime').empty();
                            } else if (!dateHelper.parseDate($(this).val(), options.format)) {
                                var splittedHours   = +([$(this).val()[0], $(this).val()[1]].join('')),
                                    splittedMinutes = +([$(this).val()[2], $(this).val()[3]].join(''));

                                // parse the numbers as 0312 => 03:12
                                if (!options.datepicker && options.timepicker && splittedHours >= 0 && splittedHours < 24 && splittedMinutes >= 0 && splittedMinutes < 60) {
                                    $(this).val([splittedHours, splittedMinutes].map(function (item) {
                                        return item > 9 ? item : '0' + item;
                                    }).join(':'));
                                } else {
                                    $(this).val(dateHelper.formatDate(_xdsoft_datetime.now(), options.format));
                                }

                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            } else {
                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            }

                            datetimepicker.trigger('changedatetime.xdsoft');
                            datetimepicker.trigger('close.xdsoft');
                        });
                }
                options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

                datetimepicker
                    .trigger('xchange.xdsoft')
                    .trigger('afterOpen.xdsoft');
            };

            datetimepicker
                .data('options', options)
                .on('touchstart mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    yearselect.hide();
                    monthselect.hide();
                    return false;
                });

            //scroll_element = timepicker.find('.xdsoft_time_box');
            timeboxparent.append(timebox);
            timeboxparent.xdsoftScroller();

            datetimepicker.on('afterOpen.xdsoft', function () {
                timeboxparent.xdsoftScroller();
            });

            datetimepicker
                .append(datepicker)
                .append(timepicker);

            if (options.withoutCopyright !== true) {
                datetimepicker
                    .append(xdsoft_copyright);
            }

            datepicker
                .append(mounth_picker)
                .append(calendar)
                .append(applyButton);

            $(options.parentID)
                .append(datetimepicker);

            XDSoft_datetime = function () {
                var _this = this;
              
                _this.now = function (norecursion) {
                    var d = new Date(),
                        date,
                        time;

                    if (!norecursion && options.defaultDate) {
                        date = _this.strToDateTime(options.defaultDate);
                        d.setFullYear(date.getFullYear());
                        d.setMonth(date.getMonth());
                        d.setDate(date.getDate());
                    }

                    if (options.yearOffset) {
                        d.setFullYear(d.getFullYear() + options.yearOffset);
                    }

                    if (!norecursion && options.defaultTime) {
                        time = _this.strtotime(options.defaultTime);
                        d.setHours(time.getHours());
                        d.setMinutes(time.getMinutes());
                    }
                    return d;
                };

                _this.isValidDate = function (d) {
                    if (Object.prototype.toString.call(d) !== "[object Date]") {
                        return false;
                    }
                    return !isNaN(d.getTime());
                };

                _this.setCurrentTime = function (dTime) {
                    _this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
                    datetimepicker.trigger('xchange.xdsoft');
                };

                _this.empty = function () {
                    _this.currentTime = null;
                };

                _this.getCurrentTime = function (dTime) {
                    return _this.currentTime;
                };

                _this.nextMonth = function () {
                    clNP = 1;
                    $('.xdsoft_date').each(function(){
                            $(this).addClass('changing')
                    })
                    setTimeout(function(){

                        $('.wrap-mouth').animate({
                            left:'-37.32%'
                        },500, function(){
                            $('.wrap-mouth .month-focus').eq(0).appendTo('.wrap-mouth');
                            $('.wrap-mouth').attr('style', '')
                        })

                        if (_this.currentTime === undefined || _this.currentTime === null) {
                            _this.currentTime = _this.now();
                        }

                        var month = _this.currentTime.getMonth() + 1,
                            year;
                        if (month === 12) {
                            _this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
                            month = 0;
                        }

                        year = _this.currentTime.getFullYear();

                        _this.currentTime.setDate(
                            Math.min(
                                new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                                _this.currentTime.getDate()
                            )
                        );
                        _this.currentTime.setMonth(month);

                        if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                            options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                        }

                        if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                            options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                        }

                        datetimepicker.trigger('xchange.xdsoft');
                        return month;
                    },500)
                };

                _this.prevMonth = function () {
                    clNP = 1
                   $('.xdsoft_date').each(function(){
                        $(this).addClass('changing')
                    })
                    setTimeout(function(){
                        $('.wrap-mouth').animate({
                                left:'33%'
                            },500, function(){
                                $('.wrap-mouth .month-focus').eq($('.wrap-mouth .month-focus').length-1).prependTo('.wrap-mouth');
                                $('.wrap-mouth').attr('style', '')
                            })
                    if (_this.currentTime === undefined || _this.currentTime === null) {
                        _this.currentTime = _this.now();
                    }

                    var month = _this.currentTime.getMonth() - 1;
                    if (month === -1) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
                        month = 11;
                    }
                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    datetimepicker.trigger('xchange.xdsoft');
                    return month;

                 },500)
                };

                _this.getWeekOfYear = function (datetime) {
                    if (options.onGetWeekOfYear && $.isFunction(options.onGetWeekOfYear)) {
                        var week = options.onGetWeekOfYear.call(datetimepicker, datetime);
                        if (typeof week !== 'undefined') {
                            return week;
                        }
                    }
                    var onejan = new Date(datetime.getFullYear(), 0, 1);
                    //First week of the year is th one with the first Thursday according to ISO8601
                    if(onejan.getDay()!=4)
                        onejan.setMonth(0, 1 + ((4 - onejan.getDay()+ 7) % 7));
                    return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                };

                _this.strToDateTime = function (sDateTime) {
                    var tmpDate = [], timeOffset, currentTime;

                    if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
                        return sDateTime;
                    }

                    tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
                    if (tmpDate) {
                        tmpDate[2] = dateHelper.parseDate(tmpDate[2], options.formatDate);
                    }
                    if (tmpDate  && tmpDate[2]) {
                        timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
                        currentTime = new Date((_this.now(true)).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
                    } else {
                        currentTime = sDateTime ? dateHelper.parseDate(sDateTime, options.format) : _this.now();
                    }

                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now();
                    }

                    return currentTime;

                };

                _this.strToDate = function (sDate) {
                    if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
                        return sDate;
                    }

                    var currentTime = sDate ? dateHelper.parseDate(sDate, options.formatDate) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.strtotime = function (sTime) {
                    if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
                        return sTime;
                    }
                    var currentTime = sTime ? dateHelper.parseDate(sTime, options.formatTime) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.str = function () {
                    return dateHelper.formatDate(_this.currentTime, options.format);
                };
                _this.currentTime = this.now();
            };

            _xdsoft_datetime = new XDSoft_datetime();

            applyButton.on('touchend click', function (e) {//pathbrite
                e.preventDefault();
                datetimepicker.data('changed', true);
                _xdsoft_datetime.setCurrentTime(getCurrentValue());
                input.val(_xdsoft_datetime.str());
                datetimepicker.trigger('close.xdsoft');
            });
            mounth_picker
                .find('.xdsoft_today_button')
                .on('touchend mousedown.xdsoft', function () {
                    datetimepicker.data('changed', true);
                    _xdsoft_datetime.setCurrentTime(0);
                    datetimepicker.trigger('afterOpen.xdsoft');
                }).on('dblclick.xdsoft', function () {
                    var currentDate = _xdsoft_datetime.getCurrentTime(), minDate, maxDate;
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                    minDate = _xdsoft_datetime.strToDate(options.minDate);
                    minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                    if (currentDate < minDate) {
                        return;
                    }
                    maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                    maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                    if (currentDate > maxDate) {
                        return;
                    }
                    input.val(_xdsoft_datetime.str());
                    input.trigger('change');
                    datetimepicker.trigger('close.xdsoft');
                });
            mounth_picker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('touchend mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false;

                    (function arguments_callee1(v) {
                        if ($this.hasClass(options.next)) {
                            _xdsoft_datetime.nextMonth();
                        } else if ($this.hasClass(options.prev)) {
                            _xdsoft_datetime.prevMonth();
                        }
                        if (options.monthChangeSpinner) {
                            if (!stop) {
                                timer = setTimeout(arguments_callee1, v || 100);
                            }
                        }
                    }(500));

                    $([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee2() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window]).off('touchend mouseup.xdsoft', arguments_callee2);
                    });
                });

            timepicker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('touchend mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false,
                        period = 110;
                    (function arguments_callee4(v) {
                        var pheight = timeboxparent[0].clientHeight,
                            height = timebox[0].offsetHeight,
                            top = Math.abs(parseInt(timebox.css('marginTop'), 10));
                        if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
                            timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
                        } else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
                            timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
                        }
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
                        period = (period > 10) ? 10 : period - 10;
                        if (!stop) {
                            timer = setTimeout(arguments_callee4, v || period);
                        }
                    }(500));
                    $([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee5() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window])
                            .off('touchend mouseup.xdsoft', arguments_callee5);
                    });
                });

            xchangeTimer = 0;
            // base handler - generating a calendar and timepicker
            datetimepicker
                .on('xchange.xdsoft', function (event) {
                    clearTimeout(xchangeTimer);
                    xchangeTimer = setTimeout(function () {

                        if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
                            _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        }

                        var table = '',
                            start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
                            i = 0,
                            j,
                            today = _xdsoft_datetime.now(),
                            maxDate = false,
                            minDate = false,
                            hDate,
                            day,
                            d,
                            y,
                            m,
                            w,
                            classes = [],
                            customDateSettings,
                            newRow = true,
                            time = '',
                            h = '',
                            line_time,
                            description;

                        while (start.getDay() !== options.dayOfWeekStart) {
                            start.setDate(start.getDate() - 1);
                        }

                        table += '<table><thead><tr>';

                        if (options.weeks) {
                            table += '<th></th>';
                        }

                        for (j = 0; j < 7; j += 1) {
                            table += '<th>' + options.i18n[globalLocale].dayOfWeekShort[(j + options.dayOfWeekStart) % 7] + '</th>';
                        }

                        table += '</tr></thead>';
                        table += '<tbody>';

                        if (options.maxDate !== false) {
                            maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
                        }

                        if (options.minDate !== false) {
                            minDate = _xdsoft_datetime.strToDate(options.minDate);
                            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                        }

                        while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
                            classes = [];
                            i += 1;

                            day = start.getDay();
                            d = start.getDate();
                            y = start.getFullYear();
                            m = start.getMonth();
                            w = _xdsoft_datetime.getWeekOfYear(start);
                            description = '';

                            classes.push('xdsoft_date');

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
                                customDateSettings = options.beforeShowDay.call(datetimepicker, start);
                            } else {
                                customDateSettings = null;
                            }

                            if(options.allowDateRe && Object.prototype.toString.call(options.allowDateRe) === "[object RegExp]"){
                                if(!options.allowDateRe.test(dateHelper.formatDate(start, options.formatDate))){
                                    classes.push('xdsoft_disabled');
                                }
                            } else if(options.allowDates && options.allowDates.length>0){
                                if(options.allowDates.indexOf(dateHelper.formatDate(start, options.formatDate)) === -1){
                                    classes.push('xdsoft_disabled');
                                }
                            } else if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
                                classes.push('xdsoft_disabled');
                            } else if (options.disabledDates.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
                                classes.push('xdsoft_disabled');
                            } else if (options.disabledWeekDays.indexOf(day) !== -1) {
                                classes.push('xdsoft_disabled');
                            }

                            if (customDateSettings && customDateSettings[1] !== "") {
                                classes.push(customDateSettings[1]);
                            }

                            if (_xdsoft_datetime.currentTime.getMonth() !== m) {
                                classes.push('xdsoft_other_month');
                            }

                            if ((options.defaultSelect || datetimepicker.data('changed')) && dateHelper.formatDate(_xdsoft_datetime.currentTime, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
                                classes.push('xdsoft_current');
                            }

                            if (dateHelper.formatDate(today, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
                                classes.push('xdsoft_today');
                            }

                            if (start.getDay() === 0 || start.getDay() === 6 || options.weekends.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
                                classes.push('xdsoft_weekend');
                            }

                            if (options.highlightedDates[dateHelper.formatDate(start, options.formatDate)] !== undefined) {
                                hDate = options.highlightedDates[dateHelper.formatDate(start, options.formatDate)];
                                classes.push(hDate.style === undefined ? 'xdsoft_highlighted_default' : hDate.style);
                                description = hDate.desc === undefined ? '' : hDate.desc;
                            }

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
                                classes.push(options.beforeShowDay(start));
                            }

                            if (newRow) {
                                table += '<tr>';
                                newRow = false;
                                if (options.weeks) {
                                    table += '<th>' + w + '</th>';
                                }
                            }
                            if(clNP!=0) {
                                table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="next-prev xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
                                        '<div>' + d + '<div class="round-border"></div></div>' +
                                    '</td>';
                                
                            }else{
                                table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
                                        '<div>' + d + '<div class="round-border"></div></div>' +
                                    '</td>';
                            }
                            if (start.getDay() === options.dayOfWeekStartPrev) {
                                table += '</tr>';
                                newRow = true;
                            }

                            start.setDate(d + 1);
                        }
                        table += '</tbody></table>';
                      
                        calendar.html(table);
                     
                     

                        mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[globalLocale].months[_xdsoft_datetime.currentTime.getMonth()]);
                        mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

                        // generate timebox
                        time = '';
                        h = '';
                        m = '';

                        line_time = function line_time(h, m) {
                            var now = _xdsoft_datetime.now(), optionDateTime, current_time,
                                isALlowTimesInit = options.allowTimes && $.isArray(options.allowTimes) && options.allowTimes.length;
                            now.setHours(h);
                            h = parseInt(now.getHours(), 10);
                            now.setMinutes(m);
                            m = parseInt(now.getMinutes(), 10);
                            optionDateTime = new Date(_xdsoft_datetime.currentTime);
                            optionDateTime.setHours(h);
                            optionDateTime.setMinutes(m);
                            classes = [];
                            if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
                                classes.push('xdsoft_disabled');
                            }
                            if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || ((options.disabledMinTime !== false && now.getTime() > _xdsoft_datetime.strtotime(options.disabledMinTime).getTime()) && (options.disabledMaxTime !== false && now.getTime() < _xdsoft_datetime.strtotime(options.disabledMaxTime).getTime()))) {
                                classes.push('xdsoft_disabled');
                            }

                            current_time = new Date(_xdsoft_datetime.currentTime);
                            current_time.setHours(parseInt(_xdsoft_datetime.currentTime.getHours(), 10));

                            if (!isALlowTimesInit) {
                                current_time.setMinutes(Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step);
                            }

                            if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && current_time.getHours() === parseInt(h, 10) && ((!isALlowTimesInit && options.step > 59) || current_time.getMinutes() === parseInt(m, 10))) {
                                if (options.defaultSelect || datetimepicker.data('changed')) {
                                    classes.push('xdsoft_current');
                                } else if (options.initTime) {
                                    classes.push('xdsoft_init_time');
                                }
                            }
                            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                                classes.push('xdsoft_today');
                            }
                            time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + dateHelper.formatDate(now, options.formatTime) + '</div>';
                        };

                        if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
                            for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
                                for (j = 0; j < 60; j += options.step) {
                                    h = (i < 10 ? '0' : '') + i;
                                    m = (j < 10 ? '0' : '') + j;
                                    line_time(h, m);
                                }
                            }
                        } else {
                            for (i = 0; i < options.allowTimes.length; i += 1) {
                                h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
                                m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
                                line_time(h, m);
                            }
                        }

                        timebox.html(time);

                        opt = '';
                        i = 0;

                        for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
                        }
                        yearselect.children().eq(0)
                                                .html(opt);

                        for (i = parseInt(options.monthStart, 10), opt = ''; i <= parseInt(options.monthEnd, 10); i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[globalLocale].months[i] + '</div>';
                        }
                        monthselect.children().eq(0).html(opt);
                        $(datetimepicker)
                            .trigger('generate.xdsoft');
                    }, 10);
                    event.stopPropagation();
                })
                .on('afterOpen.xdsoft', function () {
                    if (options.timepicker) {
                        var classType, pheight, height, top;
                        if (timebox.find('.xdsoft_current').length) {
                            classType = '.xdsoft_current';
                        } else if (timebox.find('.xdsoft_init_time').length) {
                            classType = '.xdsoft_init_time';
                        }
                        if (classType) {
                            pheight = timeboxparent[0].clientHeight;
                            height = timebox[0].offsetHeight;
                            top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
                            if ((height - pheight) < top) {
                                top = height - pheight;
                            }
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
                        } else {
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
                        }
                    }
                });

            timerclick = 0;
            calendar
                .on('touchend click.xdsoft', 'td', function (xdevent) {
                    xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
                    timerclick += 1;
                    clNP = 0
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }

                    currentTime.setDate(1);
                    currentTime.setFullYear($this.data('year'));
                    currentTime.setMonth($this.data('month'));
                    currentTime.setDate($this.data('date'));

                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    input.val(_xdsoft_datetime.str());

                    if (options.onSelectDate && $.isFunction(options.onSelectDate)) {
                        options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }

                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                    if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === false && !options.timepicker))) && !options.inline) {
                        datetimepicker.trigger('close.xdsoft');
                    }
                    setTimeout(function () {
                        timerclick = 0;
                    }, 200);
                });

            timebox
                .on('touchend click.xdsoft', 'div', function (xdevent) {
                    xdevent.stopPropagation();
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }
                    currentTime.setHours($this.data('hour'));
                    currentTime.setMinutes($this.data('minute'));
                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    datetimepicker.data('input').val(_xdsoft_datetime.str());

                    if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
                        options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                    if (options.inline !== true && options.closeOnTimeSelect === true) {
                        datetimepicker.trigger('close.xdsoft');
                    }
                });


            datepicker
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollMonth) {
                        return true;
                    }
                    if (event.deltaY < 0) {
                        _xdsoft_datetime.nextMonth();
                    } else {
                        _xdsoft_datetime.prevMonth();
                    }
                    return false;
                });

            input
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollInput) {
                        return true;
                    }
                    if (!options.datepicker && options.timepicker) {
                        current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
                        if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
                            current_time_index += event.deltaY;
                        }
                        if (timebox.children().eq(current_time_index).length) {
                            timebox.children().eq(current_time_index).trigger('mousedown');
                        }
                        return false;
                    }
                    if (options.datepicker && !options.timepicker) {
                        datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
                        if (input.val) {
                            input.val(_xdsoft_datetime.str());
                        }
                        datetimepicker.trigger('changedatetime.xdsoft');
                        return false;
                    }
                });

            datetimepicker
                .on('changedatetime.xdsoft', function (event) {
                    if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
                        var $input = datetimepicker.data('input');
                        options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
                        delete options.value;
                        $input.trigger('change');
                    }
                })
                .on('generate.xdsoft', function () {
                    if (options.onGenerate && $.isFunction(options.onGenerate)) {
                        options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    if (triggerAfterOpen) {
                        datetimepicker.trigger('afterOpen.xdsoft');
                        triggerAfterOpen = false;
                    }
                })
                .on('click.xdsoft', function (xdevent) {
                    xdevent.stopPropagation();
                });

            current_time_index = 0;

            setPos = function () {
                /**
                 * 脨麓脩鈥斆偮惵得偮っ惻捗惵该戔�⒚⑩偓艙脨碌芒鈧γ捖惷惵睹惻矫⑩偓 脨碌脩拧脨聛window脨露脩拧脨鈥毭惵得惵徝戔�撁惵该戔�⒚⑩�炩�撁惵棵懰溍惻犆惵疵戔�樏⑩偓聺脨赂脩鈥⒚⑩偓艙脨碌芒鈧γ捖惷惵睹惻矫⑩偓 脨路脩鈩⒚⑩偓啪脨碌脗庐脨鈥γ惵得戔�澝偮γ惵得偮懊惵徝惵疵戔�澝愨�姑惵睹⑩偓鈥澝捖惷惵睹懪∶懪该惵睹愨�姑偮惵疵偮幻偮睹惵得偮愨�γ惵得戔�澝偮γ惵睹戔�溍⑩偓娄脨碌芒鈧� 脗碌脨麓脩鈥樏⑩偓鹿脨驴脩藴脨艩脨露芒鈧�澝捖惷惵睹懪∶懪该惵睹愨�姑偮惵疵偮幻偮睹惵睹偹溍戔�⒚惵访偮っ戔�澝惵疵戔�樏惻捗惵得⑩偓娄脨聛脨路脩鈩⒚⑩偓啪bug脨鲁脨鈥毭⑩偓拧
                 * Bug fixed - The datetimepicker will overflow-y when the width of the date input less than its, which
                 * could causes part of the datetimepicker being hidden.
                 * by Soon start
                 */
                var offset = datetimepicker.data('input').offset(),
                    datetimepickerelement = datetimepicker.data('input')[0],
                    top = offset.top + datetimepickerelement.offsetHeight - 1,
                    left = offset.left,
                    position = "absolute",
                    node;

                if ((document.documentElement.clientWidth - offset.left) < datepicker.parent().outerWidth(true)) {
                    var diff = datepicker.parent().outerWidth(true) - datetimepickerelement.offsetWidth;
                    left = left - diff;
                }
                /**
                 * by Soon end
                 */
                if (datetimepicker.data('input').parent().css('direction') == 'rtl')
                    left -= (datetimepicker.outerWidth() - datetimepicker.data('input').outerWidth());
                if (options.fixed) {
                    top -= $(window).scrollTop();
                    left -= $(window).scrollLeft();
                    position = "fixed";
                } else {
                    if (top + datetimepickerelement.offsetHeight > $(window).height() + $(window).scrollTop()) {
                        top = offset.top - datetimepickerelement.offsetHeight + 1;
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    if (left + datetimepickerelement.offsetWidth > $(window).width()) {
                        left = $(window).width() - datetimepickerelement.offsetWidth;
                    }
                }

                node = datetimepicker[0];
                do {
                    node = node.parentNode;
                    if (window.getComputedStyle(node).getPropertyValue('position') === 'relative' && $(window).width() >= node.offsetWidth) {
                        left = left - (($(window).width() - node.offsetWidth) / 2);
                        break;
                    }
                } while (node.nodeName !== 'HTML');
                datetimepicker.css({
                    left: left,
                    top: top,
                    position: position
                });

            };
            datetimepicker
                .on('open.xdsoft', function (event) {
                    var onShow = true;
                    if (options.onShow && $.isFunction(options.onShow)) {
                        onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onShow !== false) {
                        datetimepicker.show();
                        setPos();
                        $(window)
                            .off('resize.xdsoft', setPos)
                            .on('resize.xdsoft', setPos);

                        if (options.closeOnWithoutClick) {
                            $([document.body, window]).on('touchstart mousedown.xdsoft', function arguments_callee6() {
                                datetimepicker.trigger('close.xdsoft');
                                $([document.body, window]).off('touchstart mousedown.xdsoft', arguments_callee6);
                            });
                        }
                    }
                })
                .on('close.xdsoft', function (event) {
                    var onClose = true;
                    mounth_picker
                        .find('.xdsoft_month,.xdsoft_year')
                            .find('.xdsoft_select')
                                .hide();
                    if (options.onClose && $.isFunction(options.onClose)) {
                        onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onClose !== false && !options.opened && !options.inline) {
                        datetimepicker.hide();
                    }
                    event.stopPropagation();
                })
                .on('toggle.xdsoft', function (event) {
                    if (datetimepicker.is(':visible')) {
                        datetimepicker.trigger('close.xdsoft');
                    } else {
                        datetimepicker.trigger('open.xdsoft');
                    }
                })
                .data('input', input);

            timer = 0;
            timer1 = 0;

            datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
            datetimepicker.setOptions(options);

            function getCurrentValue() {
                var ct = false, time;

                if (options.startDate) {
                    ct = _xdsoft_datetime.strToDate(options.startDate);
                } else {
                    ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
                    if (ct) {
                        ct = _xdsoft_datetime.strToDateTime(ct);
                    } else if (options.defaultDate) {
                        ct = _xdsoft_datetime.strToDateTime(options.defaultDate);
                        if (options.defaultTime) {
                            time = _xdsoft_datetime.strtotime(options.defaultTime);
                            ct.setHours(time.getHours());
                            ct.setMinutes(time.getMinutes());
                        }
                    }
                }

                if (ct && _xdsoft_datetime.isValidDate(ct)) {
                    datetimepicker.data('changed', true);
                } else {
                    ct = '';
                }

                return ct || 0;
            }

            function setMask(options) {

                var isValidValue = function (mask, value) {
                    var reg = mask
                        .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
                        .replace(/_/g, '{digit+}')
                        .replace(/([0-9]{1})/g, '{digit$1}')
                        .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
                        .replace(/\{digit[\+]\}/g, '[0-9_]{1}');
                    return (new RegExp(reg)).test(value);
                },
                getCaretPos = function (input) {
                    try {
                        if (document.selection && document.selection.createRange) {
                            var range = document.selection.createRange();
                            return range.getBookmark().charCodeAt(2) - 2;
                        }
                        if (input.setSelectionRange) {
                            return input.selectionStart;
                        }
                    } catch (e) {
                        return 0;
                    }
                },
                setCaretPos = function (node, pos) {
                    node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
                    if (!node) {
                        return false;
                    }
                    if (node.createTextRange) {
                        var textRange = node.createTextRange();
                        textRange.collapse(true);
                        textRange.moveEnd('character', pos);
                        textRange.moveStart('character', pos);
                        textRange.select();
                        return true;
                    }
                    if (node.setSelectionRange) {
                        node.setSelectionRange(pos, pos);
                        return true;
                    }
                    return false;
                };
                if(options.mask) {
                    input.off('keydown.xdsoft');
                }
                if (options.mask === true) {
                                                        if (typeof moment != 'undefined') {
                                                                    options.mask = options.format
                                                                            .replace(/Y{4}/g, '9999')
                                                                            .replace(/Y{2}/g, '99')
                                                                            .replace(/M{2}/g, '19')
                                                                            .replace(/D{2}/g, '39')
                                                                            .replace(/H{2}/g, '29')
                                                                            .replace(/m{2}/g, '59')
                                                                            .replace(/s{2}/g, '59');
                                                        } else {
                                                                    options.mask = options.format
                                                                            .replace(/Y/g, '9999')
                                                                            .replace(/F/g, '9999')
                                                                            .replace(/m/g, '19')
                                                                            .replace(/d/g, '39')
                                                                            .replace(/H/g, '29')
                                                                            .replace(/i/g, '59')
                                                                            .replace(/s/g, '59');
                                                        }
                }

                if ($.type(options.mask) === 'string') {
                    if (!isValidValue(options.mask, input.val())) {
                        input.val(options.mask.replace(/[0-9]/g, '_'));
                        setCaretPos(input[0], 0);
                    }

                    input.on('keydown.xdsoft', function (event) {
                        var val = this.value,
                            key = event.which,
                            pos,
                            digit;

                        if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
                            pos = getCaretPos(this);
                            digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

                            if ((key === BACKSPACE || key === DEL) && pos) {
                                pos -= 1;
                                digit = '_';
                            }

                            while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                            }

                            val = val.substr(0, pos) + digit + val.substr(pos + 1);
                            if ($.trim(val) === '') {
                                val = options.mask.replace(/[0-9]/g, '_');
                            } else {
                                if (pos === options.mask.length) {
                                    event.preventDefault();
                                    return false;
                                }
                            }

                            pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
                            while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                            }

                            if (isValidValue(options.mask, val)) {
                                this.value = val;
                                setCaretPos(this, pos);
                            } else if ($.trim(val) === '') {
                                this.value = options.mask.replace(/[0-9]/g, '_');
                            } else {
                                input.trigger('error_input.xdsoft');
                            }
                        } else {
                            if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
                                return true;
                            }
                        }

                        event.preventDefault();
                        return false;
                    });
                }
            }

            _xdsoft_datetime.setCurrentTime(getCurrentValue());

            input
                .data('xdsoft_datetimepicker', datetimepicker)
                .on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function (event) {
                    if (input.is(':disabled') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (input.is(':disabled')) {
                            return;
                        }

                        triggerAfterOpen = true;
                        _xdsoft_datetime.setCurrentTime(getCurrentValue());
                        if(options.mask) {
                            setMask(options);
                        }
                        datetimepicker.trigger('open.xdsoft');
                    }, 100);
                })
                .on('keydown.xdsoft', function (event) {
                    var val = this.value, elementSelector,
                        key = event.which;
                    if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
                        elementSelector = $("input:visible,textarea:visible,button:visible,a:visible");
                        datetimepicker.trigger('close.xdsoft');
                        elementSelector.eq(elementSelector.index(this) + 1).focus();
                        return false;
                    }
                    if ([TAB].indexOf(key) !== -1) {
                        datetimepicker.trigger('close.xdsoft');
                        return true;
                    }
                })
                .on('blur.xdsoft', function () {
                    datetimepicker.trigger('close.xdsoft');
                });
        };
        destroyDateTimePicker = function (input) {
            var datetimepicker = input.data('xdsoft_datetimepicker');
            if (datetimepicker) {
                datetimepicker.data('xdsoft_datetime', null);
                datetimepicker.remove();
                input
                    .data('xdsoft_datetimepicker', null)
                    .off('.xdsoft');
                $(window).off('resize.xdsoft');
                $([window, document.body]).off('mousedown.xdsoft touchstart');
                if (input.unmousewheel) {
                    input.unmousewheel();
                }
            }
        };
        $(document)
            .off('keydown.xdsoftctrl keyup.xdsoftctrl')
            .on('keydown.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = true;
                }
            })
            .on('keyup.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = false;
                }
            });

        this.each(function () {
            var datetimepicker = $(this).data('xdsoft_datetimepicker'), $input;
            if (datetimepicker) {
                if ($.type(opt) === 'string') {
                    switch (opt) {
                    case 'show':
                        $(this).select().focus();
                        datetimepicker.trigger('open.xdsoft');
                        break;
                    case 'hide':
                        datetimepicker.trigger('close.xdsoft');
                        break;
                    case 'toggle':
                        datetimepicker.trigger('toggle.xdsoft');
                        break;
                    case 'destroy':
                        destroyDateTimePicker($(this));
                        break;
                    case 'reset':
                        this.value = this.defaultValue;
                        if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(dateHelper.parseDate(this.value, options.format))) {
                            datetimepicker.data('changed', false);
                        }
                        datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
                        break;
                    case 'validate':
                        $input = datetimepicker.data('input');
                        $input.trigger('blur.xdsoft');
                        break;
                    default:
                        if (datetimepicker[opt] && $.isFunction(datetimepicker[opt])) {
                            result = datetimepicker[opt](opt2);
                        }
                    }
                } else {
                    datetimepicker
                        .setOptions(opt);
                }
                return 0;
            }
            if ($.type(opt) !== 'string') {
                if (!options.lazyInit || options.open || options.inline) {
                    createDateTimePicker($(this));
                } else {
                    lazyInit($(this));
                }
            }
        });

        return result;
    };
    $.fn.datetimepicker.defaults = default_options;

    function HighlightedDate(date, desc, style) {
        "use strict";
        this.date = date;
        this.desc = desc;
        this.style = style;
    }

}));
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));