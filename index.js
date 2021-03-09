"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fetch = require('node-fetch');
var fs = require('fs');
var request = require('request');
var prom = require('prompt-sync')();
var cheerio = require('cheerio');
var verb = false;
var verblog = function (mess) {
    if (verb) {
        console.log('[verbose] ' + mess);
    }
};
for (var j = 0; j < process.argv.length; j++) {
    if (process.argv[j] === "-v")
        verb = true;
}
verblog('args : [' + String(process.argv) + ']');
var getImgs = function (u, p, t) { return __awaiter(void 0, void 0, void 0, function () {
    var nu, nnu, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nu = u.split('1');
                nnu = nu.slice(0, nu.length - 1).join('1');
                _loop_1 = function (i) {
                    var upage, response, buffer, zero, m, prefix;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                upage = nnu + String(i + 1) + nu[nu.length - 1];
                                return [4 /*yield*/, fetch(upage)];
                            case 1:
                                response = _b.sent();
                                if (response['status'] === 404) {
                                    console.error("image n\u00B0" + String(i + 1) + " isn't on the server");
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, response.buffer()];
                            case 2:
                                buffer = _b.sent();
                                zero = '';
                                for (m = 0; m < String(p).length - String(i + 1).length; m++) {
                                    zero += '0';
                                }
                                prefix = "./" + t + "/" + (zero + String(i + 1) + nu[nu.length - 1]);
                                fs.writeFile(prefix, buffer, function () { return console.log("image n\u00B0" + (i + 1) + "/" + p + " downloaded !"); });
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < p)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchinfo = function (url) {
    var selcttitle = '#info > h1';
    var selctNpages = '#info > div:nth-child(4)';
    var selcturlimgsatabase = '#image-container > a > img';
    var res = {
        'title': '',
        'pages': 0,
        'dataurl': ''
    };
    request(url, function (error, response, body) {
        if (error)
            throw error;
        var $ = cheerio.load(body);
        res['title'] = $(selcttitle).text();
        res['pages'] = parseInt($(selctNpages).text().split(' ')[0]);
        verblog('responce code : ' + response);
        var ok = 1;
        request(url + '/1', function (errorl, responsel, bodyl) {
            if (errorl)
                throw errorl;
            var l = cheerio.load(bodyl);
            res['dataurl'] = l(selcturlimgsatabase).attr('src');
            console.log("Title: " + res['title'] + "\nPages: " + res['pages']);
            verblog('img database : ' + res['dataurl']);
            var fs = require("fs");
            var path = res['title'];
            fs.access(path, function (error) {
                if (error) {
                    fs.mkdir(path, function (error) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            getImgs(res['dataurl'], res['pages'], res['title']);
                        }
                    });
                }
                else {
                    console.log("You alredy downloaded this hentai");
                    getImgs(res['dataurl'], res['pages'], res['title']);
                }
            });
        });
    });
};
var urlbase = prom('url (just accept url like "https://nhentai.to/g/328483") : ');
var nhinfo = fetchinfo(urlbase);
