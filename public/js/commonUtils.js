/**
 * Utils module
 * @module Utils
 */
// var ambitUtils = require('../../companyAnalysis/ambit/public/js/common_util');
var moment = null;
if (typeof window === undefined && typeof document === undefined) {
    moment = require('moment');
}
var Utils = function () {

    return {

        escapeChar: function (str) {
            const regex = new RegExp(/[^&@$,.w-]/, 'gi');
            return str.replace(regex, '');

        },
        decodeHTML: function (str) {
            return str.replace(/&amp;amp;/g, "&").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
        },

        encodeHTML: function (str) {
            return str.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            // .replace(/"/g, "&quot;")
            // .replace(/'/g, "&#039;")
        },

        /**Get filtered array from Array of Objects by passing to filter key
         * @see filterData
         * @method filterData
         * @param  {Array} data-Array to be filtered
         * @param  {string} key-filter key
         * @param  {string} value-to return keys or data DEFAULT: returns data
         */
        filterData: function (data, key, value, condition) {
            let fdata = this.mapArrJson(data, key, condition);
            let fobj = {
                value: fdata,
                data: function () {
                    if (Object.keys(fdata).length > 0) {
                        if (value != undefined)
                            return fdata[value] ? fdata[value].data : [];
                        else return fdata;
                    } else {
                        return [];
                    }

                },
                keys: function () {
                    return Object.keys(fdata);
                }
            }
            return fobj;
        },
        toProperCase: function (w) {
            if (w != undefined && w != null && w !== '') {
                var res = '';
                let wArr = w.split(' ');
                if (wArr.length > 1) {
                    wArr.forEach((c) => {
                        res += this.toProperCase(c) + ' ';
                    });
                    return res;
                }
                return (w[0] != undefined ? w[0].toUpperCase() : '') + w.substr(1).toLowerCase()
            } else return '';
        },
        escapeSplChar: function (str) {
            return str.replace(/[^\x00-\x7F?!₹]/g, "");
        },
        mapArrJson: function (arr, key, condition) {
            var obj = {};
            if (arr && arr.length != undefined) {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j][key]) {
                        if (!obj.hasOwnProperty(arr[j][key])) {
                            obj[arr[j][key]] = {
                                data: []
                            }
                        }
                        if (condition) {
                            if (eval(`arr[j].${condition}`)) {
                                obj[arr[j][key]].data.push(arr[j]);
                            }
                        } else
                            obj[arr[j][key]].data.push(arr[j]);
                    }
                }
            }
            return obj;
        },
        sortAscArr: function (arr, index) {
            let _arr = arr.sort(function (a, b) {
                if (a[index] > b[index]) {
                    return 1
                } else if (a[index] < b[index]) {
                    return -1
                } else if (a[index] == b[index]) return 0;
            });
            return _arr;
        },
        mapArr: function (arr, key) {
            var obj = {};
            if (arr && arr.length != undefined) {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j][key] !== null) {
                        obj[arr[j][key]] = arr[j];
                    }
                }
            }
            return obj;
        },
        mapKeyVal: function (arr, key, val) {
            var obj = {};
            if (arr && arr.length != undefined) {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j][key] !== null) {
                        obj[arr[j][key]] = arr[j][val];
                    }
                }
            }
            return obj;
        },
        unique: function (value, index, self) {
            if (value)
                return self.indexOf(value) === index;
        },
        formatToPercent: function (irr) {
            if (isNaN(parseFloat(irr)) && !isFinite(irr)) {
                return '-';
            } else {
                return (parseFloat(irr) * 100).toFixed(1) + '%';
            }
        },
        formatNumberIn: function (num, unit = false, commaSeparated = false) {
            let self = this;
            if (typeof num == 'string') {
                num = parseFloat(num);
            }

            let obj = {
                cr: function (dec = 2) {
                    if (typeof num == 'undefined') return '';
                    let val = (num / Math.pow(10, 7)).toFixed(dec);
                    return (commaSeparated ? self.numberWithCommas(val) : val) + (unit ? ' Crs' : '');
                },
                lac: function (dec = 2) {
                    if (typeof num == 'undefined') return '';
                    let val = parseFloat((num / Math.pow(10, 5)).toFixed(dec));
                    return (commaSeparated ? self.numberWithCommas(val) : val) + (unit ? ' Lakhs' : '');
                },
                mill: function (dec = 2) {
                    if (typeof num == 'undefined') return '';
                    let val = parseFloat((num / Math.pow(10, 6)).toFixed(dec));
                    return (commaSeparated ? self.numberWithCommas(val) : val) + (unit ? ' Crs' : 'millions');
                },
                percent: function (dec = 2) {
                    if (typeof num == 'undefined') return '';
                    return (parseFloat(num) * 100).toFixed(dec) + (unit ? ' %' : '');
                },
                num: function (type, dec = 2) {
                    if (typeof num == 'undefined') return '';
                    let res = (parseFloat(num)).toFixed(dec);
                    let val = (commaSeparated ? self.numberWithCommas(res) : res);
                    switch (type) {
                        case 'cr': res = val + (unit ? ' Crs' : '');
                            break;
                        case 'percent': res += (unit ? ' %' : '');
                            break;

                    }
                    return res;
                }
            }
            return obj;
        },
        sortBy: function (array, key, type) {
            /* type=0 ->asc
               type=1->desc */
            let self = this;
            let arr = [];
            if (array && array.length == 0) return arr;
            if (typeof array == 'object' && !Array.isArray(array)) {
                for (let i in array) {
                    arr.push(array[i]);
                }
            } else {
                arr = array;
            }
            if (type == undefined) {
                type = 0
            }
            let keyArr = ['date', 'created_at', 'createdAt', 'updated_at', 'updatedAt'];
            if (typeof key == 'string' && keyArr.indexOf(key.toLowerCase()) > -1) {
                arr.sort(function (a, b) {
                    if (a[key] && b[key]) {
                        let key1 = new Date(self.formatDateIn(a[key], 'YYYY-MM-DD'));
                        let key2 = new Date(self.formatDateIn(b[key], 'YYYY-MM-DD'));
                        if (key1.getTime() > key2.getTime()) {
                            if (type == 0)
                                return 1;
                            else if (type == 1) return -1;
                        } else if (key1.getTime() < key2.getTime()) {
                            if (type == 0)
                                return -1;
                            else if (type == 1) return 1;
                        } else if (key1.getTime() == key2.getTime()) return 0;
                    } else return 0;
                });
            } else {
                arr.sort(function (a, b) {
                    let key1 = a[key];
                    let key2 = b[key]
                    if (key1 > key2) {
                        if (type == 0)
                            return 1;
                        else if (type == 1) return -1;
                    } else if (key1 < key2) {
                        if (type == 0)
                            return -1;
                        else if (type == 1) return 1;
                    } else if (key1 == key2) return 0;
                });
            }
            return arr;
        },
        isValidDate: function (date) {
            if (!date) {
                return false;
            }
            // let format = this.detectDateFormat(date);
            // if (format != 'Unknown format') {

            // if (format == 'DD-MM-YYYY' || format == 'DD/MM/YYYY') {
            //     date = this.getDateFormatted(date);
            // }
            if (typeof date == 'string') {
                date = new Date(date);
            }
            if (date == 'Invalid Date')
                return false;
            return date.getTime() === date.getTime();
            // } else
            //     return false
        },
        findCommon: function (arr1, arr2) {
            return arr1.some(item => arr2.includes(item))
        },
        detectDateFormat: function (dateString) {
            const formats = {
                '\\d{4}-\\d{2}-\\d{2}': 'YYYY-MM-DD',
                '\\d{2}\\/\\d{2}\\/\\d{4}': 'MM/DD/YYYY',
                '\\d{2}-\\d{2}-\\d{4}': 'DD-MM-YYYY',
                '\\d{4}\\/\\d{2}\\/\\d{2}': 'YYYY/MM/DD',
                '\\d{2}\\.\\d{2}\\.\\d{4}': 'MM.DD.YYYY',
                '\\d{2}\\s[a-z]{3}\\s\\d{4}': 'DD MMM YYYY',
                '\\d{1,2}\\s[a-z]{3,}\\s\\d{2}': 'D MMM YY',
                '\\d{1,2}-\\d{2}-\\d{2}': 'DD-MM-YYYY',
                '\\d{1,2}\\/\\d{2}\\/\\d{2}': 'DD/MM/YYYY'
            };

            for (const format in formats) {
                /* console.log(format) */
                let regex = new RegExp(format, "gi");

                if (regex.test(dateString)) {
                    return formats[format];
                }
            }

            return 'Unknown format';
        },
        getDateFormatted: function (date) {
            /* formats dd/mm/yyyy date string Date() and  Date() to yyyy-mm-dd format */
            if (typeof date == 'string') {
                try {
                    var patt = new RegExp("([/-])", 'g');
                    let delArr = patt.exec(date);
                    if (delArr != null && delArr.length > 0)
                        var delimiter = delArr[0];
                    else return date;
                    let dateArr = date.split(delimiter);
                    if (dateArr.length != 3) {
                        return null;
                    }
                    return new Date(`${dateArr[2].length == 2 ? '20' + dateArr[2] : dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
                } catch (E) {
                    console.log(E)
                }
            } else {
                if (Date.parse(date))
                    return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2)
                else return null;
            }

        },
        applysign: function (num) {
            if (parseFloat(num) > 0) {
                return '+' + parseFloat(num);
            } else return parseFloat(num);
        },
        toPercent: function (value) {
            //to be used only for ppt cz values are in multiples of hundered in there
            return (parseFloat(value)).toFixed(2)
        },
        getAssetProducts: function (assetClass, options) {
            let obj = Object.keys(options.product[assetClass]);
            return obj.filter(this.unique);
        },
        getProductCategories: function (assetClass, product, options) {
            let obj = [];
            let productMapping = this.filterData(options[assetClass], 'type', product).data();
            obj = productMapping.map(o => {
                return {
                    id: o.id,
                    category: o.category
                }
            })
            return obj;
        },
        compositeCalc: function (arr1, arr2) {
            let obj = {};
            for (let i in arr1) {
                if (!obj.hasOwnProperty(i))
                    obj[i] = 0;
                obj[i] += arr1[i];
            }
            for (let i in arr2) {
                if (!obj.hasOwnProperty(i))
                    obj[i] = 0;
                obj[i] += arr2[i];
            }
            return obj;
        },
        getUniqueValues: function (array, key) {
            let uniqueArr = [];
            uniqueArr = array.map(o => {
                if (o[key] != undefined && o[key] != null && o[key] !== '')
                    return o[key];
            }).filter(this.unique);
            return uniqueArr;
        },
        jsonToArr: function (json, key) {
            var arr = [];
            for (let element in json) {
                if (key != undefined) {
                    arr.push(json[element][key]);
                } else {
                    arr.push(json[element]);
                }
            }
            return arr;
        },
        checkNumber: function (num) {
            if (num != undefined && isFinite(parseFloat(num)) && !isNaN(parseFloat(num))) return parseFloat(parseFloat(num).toFixed(2));
            else return 0;
        },
        wordsToNum: function (word) {
            let arr = ['0', 'one', 'two', 'three', 'four', 'five', 'six'];
            return arr.indexOf(word);
        },
        getQuarters: function (year) {
            let arr = [];
            var start = new Date((year - 1), 3, 0);
            var end = new Date(year, 3, 0);
            let r = new Date((year - 1), 3, 1);
            arr.push(r);
            for (let i = 3; i < 12; i += 3) {
                let q = new Date(start.getFullYear(), start.getMonth() + i + 1, 0);
                arr.push(q);
            }
            return arr;
        },
        getQuarters1: function (date, numq) {
            let arr = [];
            var start = this.getQuarterNum(date);
            var end = start + numq;
            for (let i = start; i < end; i++) {
                let q = this.getQuarterDate(i);
                let quarterName = '';
                switch (q.getMonth()) {
                    case 2: quarterName = 'Q1';
                        break;
                    case 5: quarterName = 'Q2';
                        break;
                    case 8: quarterName = 'Q3';
                        break;
                    case 11: quarterName = 'Q4';


                }
                arr.push({ [quarterName]: q });
            }
            return arr;
        },
        getQuarterNum: function (date) {
            var d = new Date();
            d.setFullYear(2006, 5);
            var stVal = 50.00;
            var totalMonths = (date.getFullYear() - d.getFullYear()) * 12;
            for (var j = d.getMonth() + 1; j < totalMonths + date.getMonth() - 1; j = j + 3) {
                stVal++;
            }
            return parseInt(stVal);
        },

        getQuarterDate: function (quarterNum) {
            var start = new Date('2006-06-30');
            var quarterStrt = 50.00;
            var date = new Date();
            for (var i = quarterStrt; i < quarterNum; i++) {
                start.setMonth(start.getMonth() + 3);
                // console.log(start);
            }
            date.setFullYear(start.getFullYear(), start.getMonth(), 1);
            return date;
        },
        sortByDate: function (array) {//sorts by dd/mm/yyyy format date
            let self = this;
            array.sort(function (a, b) {
                if (self.getDateFormatted(a).getTime() > self.getDateFormatted(b).getTime()) {
                    return 1
                } else if (self.getDateFormatted(a).getTime() < self.getDateFormatted(b).getTime()) {
                    return -1
                } else if (self.getDateFormatted(a).getTime() == self.getDateFormatted(b).getTime()) return 0;
            });
            return array;
        },
        getCurrentFinYear: function (date) {
            var _today = date ? new Date(date) : new Date();
            let thisYear = _today.getFullYear();
            var _currentFinYear;
            var _startFinYear = new Date(thisYear.toString() + '-04-01');
            var _endFinYear = new Date((thisYear + 1).toString() + '-03-31');
            if (_today >= _startFinYear && _today <= _endFinYear) {
                _currentFinYear = _today.getFullYear();
            } else {
                _currentFinYear = _today.getFullYear() - 1;
            }
            return _currentFinYear + 1;
        },
        formatDateIn: function (date, format) {
            return moment(date).format(format);
        },
        getPrice: function (prices, date, maxTry = 0) {
            if ((prices[date] && prices[date] != null && prices[date].price !== '' && prices[date].price != null)) return parseFloat(prices[date].price);
            else {
                if (maxTry > 6) {
                    return 0;
                }
                maxTry++;
                let thisdate = new Date(date);
                let prevdate = thisdate.setDate(thisdate.getDate() - 1);
                let formattedPrevDate = moment(prevdate).format('YYYY-MM-DD');
                return getPrice(prices, formattedPrevDate, maxTry);
            }
        },
        weightedAverage: function (arr, total = 0) {
            let count = 0, sum = 0;
            arr.forEach(i => {
                if (!isNaN(i) && i != 0) {
                    sum += parseFloat(i);
                    count++;
                }
            })
            return parseFloat(total) ? parseFloat(sum / total).toFixed(1) : (count == 0 ? 0 : parseFloat(sum / count).toFixed(1));
        },
        numberWithCommas: function (x) {
            try {
                x = parseFloat(x);
                return x.toLocaleString('en-IN', { maximumFractionDigits: 2 });
            } catch (e) {
                console.error("numberWithCommas ", e);
                return x;
            }
        },
        removeCommas : function (str) {
            try {
                // Remove commas from the string
                let numberWithoutCommas = str.replace(/,/g, '');
                
                // Convert the string back to a number
                let number = parseFloat(numberWithoutCommas);
                
                // Return the number
                return number;
            } catch (e) {
                console.error("removeCommas ", e);
                return str;
            }
        },
        getAssetClass: function () {
            return ['Cash', 'Fixed Income', 'Equity', 'Alternate', 'Commodity'];
        },
        formatNegitiveNumber: function(num, commaSeparated = false, roundToZero = false) {
            try {
                if (!isNaN(num)) {
                    // Handle negative numbers that round to zero
                    if (roundToZero && num < 0 && Math.round(num) === 0)
                        return `(0)`
                    // General case for negative numbers
                    if (num < 0){
                        if(commaSeparated){
                            return `(${this.numberWithCommas(Math.abs(Math.round(num)))})`
                        }
                        return `(${Math.abs(Math.round(num))})`
                    }
                    // Case for non-negative numbers
                    return commaSeparated ? this.numberWithCommas(Math.round(num)) : Math.round(num);
                }
                return commaSeparated ? this.numberWithCommas(Math.round(num)) : Math.round(num);
            } catch (error) {
                console.error(error)
                return num;
            }
        }
    }
}
try {
    var moment = require('moment');
    module.exports = Utils;
} catch (e) {
    var Utils = new Utils();
}

