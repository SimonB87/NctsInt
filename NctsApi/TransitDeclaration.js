(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeclarationWrapper_1 = require("./DeclarationWrapper");
var transitDeclarationMock_1 = require("./transitDeclarationMock");
var logError_1 = require("./logError");
var Api = /** @class */ (function () {
    function Api() {
        this.declaration = undefined;
    }
    Api.prototype.dispose = function () {
        this.declaration = undefined;
    };
    Api.prototype.hasValue = function () {
        return !!this.declaration;
    };
    Api.prototype.clear = function () {
        this.declaration = undefined;
    };
    Api.prototype.fromJson = function (args) {
        try {
            this.declaration = new DeclarationWrapper_1.DeclarationWrapper(args.json);
            return true;
        }
        catch (err) {
            logError_1.logError("TransitDeclaration API object method fromJson failed.");
            return false;
        }
    };
    Api.prototype.toJson = function () {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.toJson();
    };
    Api.prototype.fromMock = function () {
        this.declaration = new DeclarationWrapper_1.DeclarationWrapper(transitDeclarationMock_1.transitDeclarationMock);
    };
    Api.prototype.create = function () {
        this.declaration = new DeclarationWrapper_1.DeclarationWrapper('{}');
    };
    Api.prototype.isEmpty = function () {
        return !this.declaration;
    };
    Api.prototype.getHeader = function () {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getHeader();
    };
    Api.prototype.getHouseConsignmentList = function () {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getHouseConsignmentList();
    };
    Api.prototype.getHouseConsignment = function (args) {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getHouseConsignment(args.sequenceNumber);
    };
    Api.prototype.getConsignmentItemList = function (args) {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getConsignmentItemList(args.sequenceNumber);
    };
    Api.prototype.getConsignmentItem = function (args) {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getConsignmentItem(args.houseConsignmentSequenceNumber, args.goodsItemNumber);
    };
    Api.prototype.setHeader = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.setHeader(args.json);
    };
    Api.prototype.setHouseConsignment = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.setHouseConsignment(args.json);
    };
    Api.prototype.appendNewHouseConsignment = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.appendNewHouseConsignment(args.json);
    };
    Api.prototype.removeHouseConsignment = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.removeHouseConsignment(args.sequenceNumber);
    };
    Api.prototype.setConsignmentItem = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.setConsignmentItem(args.houseConsignmentSequenceNumber, args.json);
    };
    Api.prototype.appendNewConsignmentItem = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.appendNewConsignmentItem(args.houseConsignmentSequenceNumber, args.json);
    };
    Api.prototype.removeConsignmentItem = function (args) {
        if (!this.declaration) {
            return false;
        }
        return this.declaration.removeConsignmentItem(args.houseConsignmentSequenceNumber, args.goodsItemNumber);
    };
    Api.prototype.getDataForNavTree = function () {
        if (!this.declaration) {
            return null;
        }
        return this.declaration.getDataForNavTree();
    };
    return Api;
}());
exports.Api = Api;
if (typeof define !== 'undefined') {
    define(function () { return Api; });
}
},{"./DeclarationWrapper":2,"./logError":3,"./transitDeclarationMock":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logError_1 = require("./logError");
var _ = (typeof window !== 'undefined' ? window._ : require('lodash'));
var DeclarationWrapper = /** @class */ (function () {
    function DeclarationWrapper(json) {
        this.obj = JSON.parse(json);
    }
    DeclarationWrapper.prototype.getHeader = function () {
        return JSON.stringify(this.obj, this.createSkipReplacer('HouseConsignment'));
    };
    DeclarationWrapper.prototype.getHouseConsignmentList = function () {
        var _a, _b;
        var list = ((_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment) || [];
        var transformedList = list.map(function (value) {
            var _a, _b;
            return {
                sequenceNumber: value.sequenceNumber,
                referenceNumberUCR: value.referenceNumberUCR,
                grossMass: value.grossMass,
                consignorName: (_a = value.Consignor) === null || _a === void 0 ? void 0 : _a.name,
                consignmentItemsCount: (_b = value.ConsignmentItem) === null || _b === void 0 ? void 0 : _b.length
            };
        });
        return JSON.stringify(transformedList);
    };
    // returns null if there is no houseConsignment with given index
    DeclarationWrapper.prototype.getHouseConsignment = function (hcIndex) {
        var _a, _b;
        var hc = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment[hcIndex - 1];
        if (hc) {
            return JSON.stringify(hc, this.createSkipReplacer('ConsignmentItem'));
        }
        else {
            return null;
        }
    };
    // returns null if there is no houseConsignment with given index
    DeclarationWrapper.prototype.getConsignmentItemList = function (hcIndex) {
        var _a, _b;
        var hc = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment[hcIndex - 1];
        if (!hc) {
            return null;
        }
        var list = (hc === null || hc === void 0 ? void 0 : hc.ConsignmentItem) || [];
        var transformedList = list.map(function (value) {
            var _a;
            return {
                goodsItemNumber: value.goodsItemNumber,
                consigneeName: (_a = value.Consignee) === null || _a === void 0 ? void 0 : _a.name,
                countryOfDestination: value.countryOfDestination ? {
                    Code: value.countryOfDestination.Code,
                    Description: value.countryOfDestination.Description
                } : undefined,
                declarationType: value.declarationType ? {
                    Code: value.declarationType.Code,
                    Description: value.declarationType.Description
                } : undefined,
                referenceNumberUCR: value.referenceNumberUCR
            };
        });
        return JSON.stringify(transformedList);
    };
    // returns null if there is no consignment item for given indexes
    DeclarationWrapper.prototype.getConsignmentItem = function (hcIndex, ciIndex) {
        var _a, _b, _c;
        var ci = (_c = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment[hcIndex - 1]) === null || _c === void 0 ? void 0 : _c.ConsignmentItem[ciIndex - 1];
        return ci ? JSON.stringify(ci) : null;
    };
    DeclarationWrapper.prototype.setHeader = function (json) {
        var _a, _b;
        try {
            var newObj = JSON.parse(json);
            if (newObj) {
                newObj.Consignment = newObj.Consignment || {};
                newObj.Consignment.HouseConsignment = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment;
            }
            this.obj = newObj;
            return true;
        }
        catch (err) {
            logError_1.logError("TransitDeclaration.setHeader error: " + err);
            return false;
        }
    };
    // returns true if operation was successful or false if it wasn't
    DeclarationWrapper.prototype.setHouseConsignment = function (json) {
        var _a;
        try {
            var hc = JSON.parse(json);
            if (!(_.isFinite(hc.sequenceNumber) && hc.sequenceNumber > 0)) {
                logError_1.logError("TransitDeclaration.setHouseConsignment error: Parameter does not contain valid sequence number.");
                return false;
            }
            var index = hc.sequenceNumber - 1;
            this.obj.Consignment = this.obj.Consignment || {};
            this.obj.Consignment.HouseConsignment = this.obj.Consignment.HouseConsignment || [];
            hc.ConsignmentItem = (_a = this.obj.Consignment.HouseConsignment[index]) === null || _a === void 0 ? void 0 : _a.ConsignmentItem;
            this.obj.Consignment.HouseConsignment[index] = hc;
            return true;
        }
        catch (err) {
            logError_1.logError("TransitDeclaration.setHouseConsignment error: " + err);
            return false;
        }
    };
    DeclarationWrapper.prototype.appendNewHouseConsignment = function (json) {
        try {
            var hc = JSON.parse(json);
            this.obj.Consignment = this.obj.Consignment || {};
            this.obj.Consignment.HouseConsignment = this.obj.Consignment.HouseConsignment || [];
            var hcLength = this.obj.Consignment.HouseConsignment.length;
            this.obj.Consignment.HouseConsignment[hcLength] = hc;
            this.fixHcSequenceNumber();
            return true;
        }
        catch (err) {
            logError_1.logError("appendNewHouseConsignment error: " + err);
            return false;
        }
    };
    DeclarationWrapper.prototype.removeHouseConsignment = function (hcIndex) {
        var _a;
        try {
            if ((_a = this.obj.Consignment) === null || _a === void 0 ? void 0 : _a.HouseConsignment[hcIndex - 1]) {
                this.obj.Consignment.HouseConsignment.splice(hcIndex - 1, 1);
                this.fixHcSequenceNumber();
                return true;
            }
        }
        catch (err) {
            logError_1.logError("removeHouseConsignment error: " + err);
        }
        return false;
    };
    // returns true if operation was successful or false if it wasn't
    DeclarationWrapper.prototype.setConsignmentItem = function (hcIndex, json) {
        try {
            if (!(_.isFinite(hcIndex) && hcIndex > 0)) {
                logError_1.logError("setConsignmentItem error: HouseConsignment index parameter is supposed to be a positive number but it is \"" + hcIndex + "\"");
                return false;
            }
            var ci = JSON.parse(json);
            var ciIndex = ci.goodsItemNumber;
            if (!(_.isFinite(ciIndex) && ciIndex > 0)) {
                logError_1.logError("setConsignmentItem error: goodsItemNumber is supposed to be a positive number but it is \"" + ciIndex + "\"");
                return false;
            }
            var zeroHcIndex = hcIndex - 1;
            var zeroCiIndex = ciIndex - 1;
            this.obj.Consignment = this.obj.Consignment || {};
            this.obj.Consignment.HouseConsignment = this.obj.Consignment.HouseConsignment || [];
            this.obj.Consignment.HouseConsignment[zeroHcIndex].ConsignmentItem = this.obj.Consignment.HouseConsignment[zeroHcIndex].ConsignmentItem || [];
            this.obj.Consignment.HouseConsignment[zeroHcIndex].ConsignmentItem[zeroCiIndex] = ci;
            return true;
        }
        catch (err) {
            logError_1.logError("setConsignmentItem error: " + err);
            return false;
        }
    };
    DeclarationWrapper.prototype.appendNewConsignmentItem = function (hcIndex, json) {
        var _a, _b;
        try {
            var ci = JSON.parse(json);
            var hc = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment[hcIndex - 1];
            if (!hc) {
                throw new Error("HouseConsignment with index " + hcIndex + " does not exist");
            }
            hc.ConsignmentItem = hc.ConsignmentItem || [];
            var ciLength = hc.ConsignmentItem.length;
            hc.ConsignmentItem[ciLength] = ci;
            this.fixHcSequenceNumber();
            this.fixGoodsItemNumber(hcIndex);
            return true;
        }
        catch (err) {
            logError_1.logError("appendNewConsignmentItem error: " + err);
            return false;
        }
    };
    DeclarationWrapper.prototype.removeConsignmentItem = function (hcIndex, ciIndex) {
        var _a, _b;
        try {
            if ((_b = (_a = this.obj.Consignment) === null || _a === void 0 ? void 0 : _a.HouseConsignment[hcIndex - 1]) === null || _b === void 0 ? void 0 : _b.ConsignmentItem[ciIndex - 1]) {
                this.obj.Consignment.HouseConsignment[hcIndex - 1].ConsignmentItem.splice(ciIndex - 1, 1);
                this.fixGoodsItemNumber(hcIndex);
                return true;
            }
        }
        catch (err) {
            logError_1.logError("removeCosignmentItem error: " + err);
        }
        return false;
    };
    DeclarationWrapper.prototype.toJson = function () {
        return JSON.stringify(this.obj);
    };
    DeclarationWrapper.prototype.getDataForNavTree = function () {
        var _a;
        var trimmedHc = _.map(((_a = this.obj.Consignment) === null || _a === void 0 ? void 0 : _a.HouseConsignment) || [], function (hc) {
            var items = _.map(hc.ConsignmentItem || [], function (ci) {
                return { 'ciIndex': ci.goodsItemNumber };
            });
            return { 'hcIndex': hc.sequenceNumber, ConsignmentItem: items };
        });
        return JSON.stringify(trimmedHc);
    };
    /**
     * Creates a replacer function for JSON.stringify that will omit the first occurrence of attName child but if there is more, leaves the rest.
     */
    DeclarationWrapper.prototype.createSkipReplacer = function (attName) {
        var skip = true;
        return function (key, value) {
            if (skip && key === attName) {
                skip = false;
                return undefined;
            }
            return value;
        };
    };
    /**
     * Sets sequenceNumber of all HouseConsignments to be an incremental sequence
     */
    DeclarationWrapper.prototype.fixHcSequenceNumber = function () {
        var _a, _b;
        if (_.isArray((_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment)) {
            for (var i = 0; i < this.obj.Consignment.HouseConsignment.length; i += 1) {
                this.obj.Consignment.HouseConsignment[i].sequenceNumber = i + 1;
            }
        }
    };
    /**
     * Sets goodsItemNumber of all ConsignmentItems in given HouseConsignment to be an incremental sequence
     * @param  {number} hcIndex Index of HouseConsignment
     */
    DeclarationWrapper.prototype.fixGoodsItemNumber = function (hcIndex) {
        var _a, _b, _c;
        var zeroHcIndex = hcIndex - 1;
        if (_.isArray((_c = (_b = (_a = this.obj) === null || _a === void 0 ? void 0 : _a.Consignment) === null || _b === void 0 ? void 0 : _b.HouseConsignment[zeroHcIndex]) === null || _c === void 0 ? void 0 : _c.ConsignmentItem)) {
            for (var i = 0; i < this.obj.Consignment.HouseConsignment[zeroHcIndex].ConsignmentItem.length; i += 1) {
                this.obj.Consignment.HouseConsignment[zeroHcIndex].ConsignmentItem[i].goodsItemNumber = i + 1;
            }
        }
    };
    return DeclarationWrapper;
}());
exports.DeclarationWrapper = DeclarationWrapper;
},{"./logError":3,"lodash":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logError(errMessage) {
    if (console && console.error && typeof window !== 'undefined') {
        console.error(errMessage);
    }
}
exports.logError = logError;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitDeclarationMock = JSON.stringify({
    "GUID": "33107a15-395e-4205-849e-1b5bde10035f",
    "TransitOperation": {
        "LRN": "ultrices Cras consect",
        "fallbackProcedure": true,
        "MRN": "Pellentesque sempe",
        "releaseDate": "2021-01-23",
        "declarationType": {
            "Code": "nisi",
            "Description": "condimentum eros Cras facilisis Ut hendrerit ac vestibulum quis adipiscing nec egestas feugiat metus leo turpis Cras in augue rutrum sit condimentum elit consequat vestibulum nunc a vehicula justo risus pretium massa ligula egestas lorem Vestibulum id aliquam vel est Suspendisse hendrerit Cras eget pellentesque nec nec augue accumsan fermentum viverra sit in orci eu ligula amet potenti molestie pretium et vitae sapien Ut tincidunt eget In laoreet velit pretium augue mi ultricies",
            "ValidFrom": "2021-04-28T22:37:44Z",
            "ValidTo": "2019-07-11T22:37:44Z"
        },
        "additionalDeclarationType": {
            "Code": "a",
            "Description": "quis risus tempus ac Cras Sed vel Nunc vel Integer leo metus dignissim Maecenas sollicitudin sapien posuere pulvinar ligula ligula ipsum mi suscipit tincidunt Pellentesque pulvinar turpis pulvinar mauris suscipit Etiam velit Quisque Duis vitae nibh elit",
            "ValidFrom": "2020-01-29T22:37:44Z",
            "ValidTo": "2019-02-19T22:37:44Z"
        },
        "TIRCarnetNumber": "amet ut mol",
        "TIRvalidityDate": "2020-11-02",
        "security": {
            "Code": 1.50263002212282,
            "Description": "et eu sapien pretium sed per condimentum urna nunc nec tempor Etiam adipiscing fermentum Duis commodo metus facilisis varius pretium rhoncus amet Vestibulum Maecenas justo ac In sit ligula posuere odio sagittis justo quis tellus eget posuere enim amet ligula fringilla in ac sollicitudin dapibus mi nisi lobortis amet placerat est odio felis dolor sollicitudin blandit",
            "ValidFrom": "2019-06-10T22:37:44Z",
            "ValidTo": "2020-09-17T22:37:44Z"
        },
        "reducedDatasetIndicator": true,
        "specificCircumstanceIndicator": {
            "Code": "vel",
            "Description": "eget elit pharetra eros felis In dolor eros ac Pellentesque posuere sapien sollicitudin Sed vestibulum id rhoncus pellentesque vulputate Phasellus vel tristique vitae turpis Integer Etiam blandit est velit sollicitudin porta Sed at mattis magna mi non condimentum faucibus vel egestas tristique Vivamus Nulla blandit odio Morbi Ut amet Nunc",
            "ValidFrom": "2019-02-09T22:37:44Z",
            "ValidTo": "2020-05-26T22:37:44Z"
        },
        "totalValueOfGoods": 12.461883859924,
        "communicationLanguageAtDeparture": {
            "Country": "id",
            "Language": "ac",
            "Description": "risus Sed quis dui Integer amet risus amet",
            "ValidFrom": "2019-07-04T22:37:44Z",
            "ValidTo": "2019-12-17T22:37:44Z"
        },
        "bindingItinerary": false,
        "limitDate": "2019-02-02T22:37:44Z"
    },
    "Authorisation": [
        {
            "sequenceNumber": 56078,
            "type": {
                "Code": "nisi",
                "Description": "ultricies tincidunt vestibulum sem dapibus pharetra",
                "ValidFrom": "2021-09-30T22:37:44Z",
                "ValidTo": "2019-08-18T22:37:44Z"
            },
            "referenceNumber": "sodales hendrerit faucibus"
        },
        {
            "sequenceNumber": 32926,
            "type": {
                "Code": "Ut",
                "Description": "Nunc amet ut egestas Phasellus faucibus Donec fermentum ac",
                "ValidFrom": "2019-08-10T22:37:44Z",
                "ValidTo": "2020-11-17T22:37:44Z"
            },
            "referenceNumber": "fringilla orci vel"
        }
    ],
    "CustomsOfficeOfDeparture": {
        "referenceNumber": {
            "Code": "Maecenas",
            "Description": "consectetur metus eros condimentum Proin Curabitur sapien feugiat cursus Suspendisse",
            "ValidFrom": "2019-05-10T22:37:44Z",
            "ValidTo": "2019-11-01T22:37:44Z"
        }
    },
    "CustomsOfficeOfDestinationDeclared": {
        "referenceNumber": {
            "Code": "pharetra",
            "Description": "id urna aliquam eget tincidunt lacinia hendrerit posuere Donec vitae congue Etiam lacinia rhoncus",
            "ValidFrom": "2021-07-27T22:37:44Z",
            "ValidTo": "2019-11-19T22:37:44Z"
        }
    },
    "CustomsOfficeOfTransitDeclared": [
        {
            "sequenceNumber": 6683,
            "referenceNumber": {
                "Code": "pulvinar",
                "Description": "non mi massa erat elit pharetra pellentesque ipsum adipiscing vitae metus nulla nec mauris sed Sed",
                "ValidFrom": "2020-03-27T22:37:44Z",
                "ValidTo": "2019-03-16T22:37:44Z"
            },
            "arrivalDateAndTimeEstimated": "2019-09-20T22:37:44Z"
        },
        {
            "sequenceNumber": 25127,
            "referenceNumber": {
                "Code": "Maecenas",
                "Description": "mi dictum tempus Donec est lectus Sed Nulla sed eget ante id consectetur porttitor tortor Morbi id lacus adipiscing adipiscing vitae Proin quam Nam enim nisi amet sit vitae sed tristique pellentesque faucibus placerat lacus Praesent lorem sit vehicula",
                "ValidFrom": "2020-07-18T22:37:44Z",
                "ValidTo": "2019-01-28T22:37:44Z"
            },
            "arrivalDateAndTimeEstimated": "2019-03-04T22:37:44Z"
        }
    ],
    "CustomsOfficeOfExitForTransitDeclared": [
        {
            "sequenceNumber": 87337,
            "referenceNumber": {
                "Code": "Maecenas",
                "Description": "eleifend turpis Curabitur risus porta semper Donec sollicitudin sagittis Pellentesque molestie diam metus leo risus non in Cras augue dictum Pellentesque nibh porttitor amet Nunc mollis vulputate dapibus ultrices enim nunc justo mauris Fusce nec dapibus diam iaculis litora non posuere sollicitudin massa amet eros molestie Pellentesque Nam eros aliquam nisi Ut vehicula semper lacinia",
                "ValidFrom": "2020-12-22T22:37:44Z",
                "ValidTo": "2021-04-01T22:37:44Z"
            }
        },
        {
            "sequenceNumber": 38474,
            "referenceNumber": {
                "Code": "molestie",
                "Description": "vel condimentum posuere fringilla elit nulla justo dictum egestas sagittis justo Suspendisse auctor placerat sit ut ultricies velit Sed eget ante vitae lorem iaculis ut facilisis nisi blandit vulputate sit Aenean nulla laoreet ante eget ligula molestie Nunc blandit posuere risus posuere sit ultricies mi Vestibulum consectetur Quisque ultricies accumsan sit mauris Praesent",
                "ValidFrom": "2021-07-12T22:37:44Z",
                "ValidTo": "2019-12-13T22:37:44Z"
            }
        }
    ],
    "HolderOfTheTransitProcedure": {
        "identificationNumber": "venenatis",
        "TIRHolderIdentificationNumber": "",
        "name": "imperdiet dictum nibh eget Lorem ante ante ac",
        "Address": {
            "streetAndNumber": "dolor tempus condimentum quis neque",
            "postcode": "sed sit tempor",
            "city": "metus eget quis",
            "country": {
                "Code": "id",
                "Description": "dapibus",
                "ValidFrom": "2021-09-04T22:37:44Z",
                "ValidTo": "2020-07-14T22:37:44Z"
            }
        },
        "ContactPerson": {
            "name": "Curabitur convallis",
            "phoneNumber": "pharetra feugiat",
            "eMailAddress": "ut imperdiet tellus Sed vehicula eu non Nulla aliquam amet tellus pulvinar lacinia conubia auctor bibendum Sed erat augue porta Ut Phasellus adipiscing venenatis sociosqu eget"
        }
    },
    "Representative": {
        "identificationNumber": "vestibulum",
        "status": {
            "Code": 0.0000564802514186503,
            "Description": "dictum quam gravida vel vitae pharetra nec nisi id amet fringilla volutpat facilisis sagittis erat Aliquam pharetra nibh velit erat Praesent Sed convallis vestibulum Morbi non Phasellus posuere orci ornare ullamcorper In lobortis Praesent hendrerit justo metus per condimentum ullamcorper nibh Cras elementum eu sed vestibulum",
            "ValidFrom": "2020-08-22T22:37:44Z",
            "ValidTo": "2020-01-06T22:37:44Z"
        },
        "ContactPerson": {
            "name": "vel mauris nec porta accumsan a vestibulum Maecenas",
            "phoneNumber": "purus ligula egestas In convallis",
            "eMailAddress": "cursus neque ornare enim justo eget fermentum mauris volutpat taciti ligula Phasellus vel Phasellus posuere laoreet hendrerit non pharetra sed sem elit quis quis molestie ipsum"
        }
    },
    "Guarantee": [
        {
            "sequenceNumber": 48390,
            "guaranteeType": {
                "Code": "a",
                "Description": "condimentum ac non In laoreet Praesent lacinia dapibus Nunc eros tellus nibh sed placerat feugiat est Sed faucibus",
                "ValidFrom": "2020-02-08T22:37:44Z",
                "ValidTo": "2020-10-05T22:37:44Z"
            },
            "otherGuaranteeReference": "Nunc",
            "GuaranteeReference": [
                {
                    "sequenceNumber": 57550,
                    "GRN": "ligula dictum consectet",
                    "accessCode": "Sed",
                    "amountToBeCovered": 4.12663406884607,
                    "currency": {
                        "Code": "vel",
                        "RateValue": 0.000853874101701134,
                        "Description": "dictum tristique eu vel vel sapien adipiscing eu felis eget sit condimentum nec Phasellus massa imperdiet diam id sem ac non facilisis mi porta sit viverra a molestie sed vehicula ornare",
                        "ValidFrom": "2020-05-29T22:37:44Z",
                        "ValidTo": "2019-05-26T22:37:44Z"
                    }
                },
                {
                    "sequenceNumber": 70006,
                    "GRN": "ut fringilla",
                    "accessCode": "sit",
                    "amountToBeCovered": 97.7963515081426,
                    "currency": {
                        "Code": "sed",
                        "RateValue": 0.0540686357086844,
                        "Description": "non Maecenas metus",
                        "ValidFrom": "2019-12-29T22:37:44Z",
                        "ValidTo": "2019-08-27T22:37:44Z"
                    }
                }
            ]
        },
        {
            "sequenceNumber": 53849,
            "guaranteeType": {
                "Code": "a",
                "Description": "sodales sit vitae in Sed quis sit sodales suscipit vel quis sapien vel nibh venenatis",
                "ValidFrom": "2019-07-16T22:37:44Z",
                "ValidTo": "2020-11-03T22:37:44Z"
            },
            "otherGuaranteeReference": "pellentesque fermentum",
            "GuaranteeReference": [
                {
                    "sequenceNumber": 33398,
                    "GRN": "lacus dui Ut condimentum",
                    "accessCode": "amet",
                    "amountToBeCovered": 0.355667596848527,
                    "currency": {
                        "Code": "sit",
                        "RateValue": 0.000322420437504733,
                        "Description": "vel consectetur ac ante sociosqu sit est eu dolor at pretium sit condimentum Nunc vestibulum tempus vehicula nisl tristique dapibus congue nec porta condimentum molestie porta sed a volutpat facilisis taciti conubia facilisis feugiat pharetra elit porttitor iaculis id Aenean est non vel vestibulum elementum a id facilisis",
                        "ValidFrom": "2020-09-26T22:37:44Z",
                        "ValidTo": "2019-06-08T22:37:44Z"
                    }
                },
                {
                    "sequenceNumber": 93104,
                    "GRN": "urna turpis",
                    "accessCode": "sed",
                    "amountToBeCovered": 5.0092180003455,
                    "currency": {
                        "Code": "sit",
                        "RateValue": 0.000054523600197641,
                        "Description": "id sagittis in sit sem mauris dapibus ac amet ligula Sed elit molestie sem sapien pharetra et feugiat tellus nulla vulputate scelerisque vitae adipiscing semper a Donec nibh molestie Mauris hendrerit adipiscing vestibulum consectetur a quis metus suscipit nisl sit tristique ante nec quis Cras Nunc hendrerit Donec Maecenas eros vel sed Sed lacus nec varius pharetra Cras eu sollicitudin dolor Mauris non ut semper elit facilisis",
                        "ValidFrom": "2021-07-23T22:37:44Z",
                        "ValidTo": "2019-02-22T22:37:44Z"
                    }
                }
            ]
        }
    ],
    "Consignment": {
        "countryOfDispatch": {
            "Code": "ac",
            "TccEntryDate": "2020-08-24",
            "NctsEntryDate": "2021-03-01",
            "GeoNomenclatureCode": 3.87118017015568,
            "CountryRegimeCode": "non",
            "Description": "quis Etiam interdum diam orci lacus interdum quam Nunc elit fermentum dictum Etiam ullamcorper Sed sem nec magna volutpat sed imperdiet suscipit adipiscing ac in accumsan egestas accumsan Curabitur consequat vehicula nisi eu a risus Nulla leo quis amet dolor vehicula Duis molestie feugiat hendrerit risus sapien quis est sapien gravida dictum Sed ac hendrerit pellentesque ut elit dapibus ut vestibulum Praesent consectetur erat ipsum id sollicitudin vulputate suscipit Duis rutrum vitae eu",
            "ValidFrom": "2019-10-09T22:37:44Z",
            "ValidTo": "2019-03-02T22:37:44Z"
        },
        "countryOfDestination": {
            "Code": "mi",
            "TccEntryDate": "2021-03-15",
            "NctsEntryDate": "2020-03-10",
            "GeoNomenclatureCode": 0.0515183114220939,
            "CountryRegimeCode": "vel",
            "Description": "elit urna amet hendrerit aliquam vestibulum erat justo tristique libero tincidunt in orci condimentum elit commodo vitae congue leo lacus nec cursus tortor odio mollis sodales est vestibulum a Praesent Sed ipsum turpis suscipit interdum dapibus",
            "ValidFrom": "2021-03-13T22:37:44Z",
            "ValidTo": "2020-10-13T22:37:44Z"
        },
        "containerIndicator": false,
        "inlandModeOfTransport": {
            "Code": 6,
            "Description": "nulla consequat Vivamus tincidunt sodales sem tristique nunc nisi In Vestibulum sapien vestibulum Etiam Etiam eros ut lacinia Donec laoreet ac risus Lorem adipiscing vehicula Duis pharetra metus Pellentesque sed eget vestibulum Quisque ut a a convallis in urna adipiscing vel fringilla Duis amet urna Maecenas augue Curabitur sollicitudin mauris pretium egestas odio odio id Suspendisse libero a nec ante urna quis mauris volutpat",
            "ValidFrom": "2019-10-07T22:37:44Z",
            "ValidTo": "2021-01-19T22:37:44Z"
        },
        "modeOfTransportAtTheBorder": {
            "Code": 7,
            "Description": "turpis ante ut eu faucibus ut ligula pharetra a metus Ut Mauris inceptos fringilla risus Integer molestie iaculis id quis nibh sodales semper tincidunt purus Duis consequat tincidunt erat sem tortor velit Sed Praesent eros neque commodo dolor",
            "ValidFrom": "2019-01-31T22:37:44Z",
            "ValidTo": "2019-05-06T22:37:44Z"
        },
        "grossMass": 7.60843004919981,
        "referenceNumberUCR": "pharetra amet gravida",
        "Carrier": {
            "identificationNumber": "ipsum Praesent",
            "ContactPerson": {
                "name": "Donec nisi nec facilisis Vivamus risus ut elit dui Ut eros vel",
                "phoneNumber": "adipiscing tempus vel eget",
                "eMailAddress": "Etiam Duis commodo ac erat nisi massa"
            }
        },
        "Consignor": {
            "identificationNumber": "id odio facilisis",
            "name": "metus massa sit Donec eros",
            "Address": {
                "streetAndNumber": "molestie",
                "postcode": "Integer sem",
                "city": "elit magna faucibus Ut",
                "country": {
                    "Code": "eu",
                    "Description": "Class Nam erat mauris venenatis",
                    "ValidFrom": "2019-02-15T22:37:44Z",
                    "ValidTo": "2020-10-11T22:37:44Z"
                }
            },
            "ContactPerson": {
                "name": "mauris placerat",
                "phoneNumber": "rhoncus",
                "eMailAddress": "vel molestie velit Aenean pretium"
            }
        },
        "Consignee": {
            "identificationNumber": "eu Etiam",
            "name": "viverra mauris id augue nunc et Suspendisse",
            "Address": {
                "streetAndNumber": "magna sit nec vel mi vel Proin gravida metus ante",
                "postcode": "urna congue",
                "city": "felis dictum",
                "country": {
                    "Code": "mi",
                    "Description": "odio leo sapien nec rhoncus Praesent enim vel congue nisi sem fermentum",
                    "ValidFrom": "2020-06-16T22:37:44Z",
                    "ValidTo": "2019-10-08T22:37:44Z"
                }
            }
        },
        "AdditionalSupplyChainActor": [
            {
                "sequenceNumber": 87218,
                "role": {
                    "Code": "per",
                    "Description": "nisl et sem feugiat Vestibulum risus risus Donec turpis justo sed nec metus sit varius sit Vestibulum dolor enim Aliquam ac Nam posuere per ac id ac sit nec nec aliquam metus vulputate Sed in",
                    "ValidFrom": "2021-06-25T22:37:44Z",
                    "ValidTo": "2020-01-23T22:37:44Z"
                },
                "identificationNumber": ""
            },
            {
                "sequenceNumber": 81987,
                "role": {
                    "Code": "id",
                    "Description": "condimentum lacinia sem Nulla leo tortor mi laoreet velit id bibendum amet sed accumsan vel massa dapibus porta Suspendisse mauris urna ut convallis leo vehicula tincidunt ultricies Ut tellus amet amet pretium ut amet elit aliquet mauris eget mi vestibulum nec id adipiscing ac pretium id aliquam massa ultrices vel Donec Cras",
                    "ValidFrom": "2019-07-14T22:37:44Z",
                    "ValidTo": "2020-04-11T22:37:44Z"
                },
                "identificationNumber": "interdum"
            }
        ],
        "TransportEquipment": [
            {
                "sequenceNumber": 66423,
                "containerIdentificationNumber": "conubia Pellente",
                "numberOfSeals": 9468,
                "Seal": [
                    {
                        "sequenceNumber": 13521,
                        "identifier": "accumsan tincidunt "
                    },
                    {
                        "sequenceNumber": 45492,
                        "identifier": "leo mollis"
                    }
                ],
                "GoodsReference": [
                    {
                        "sequenceNumber": 40831,
                        "declarationGoodsItemNumber": 62573
                    },
                    {
                        "sequenceNumber": 39914,
                        "declarationGoodsItemNumber": 87035
                    }
                ]
            },
            {
                "sequenceNumber": 53787,
                "containerIdentificationNumber": "Cras justo sit j",
                "numberOfSeals": 6186,
                "Seal": [
                    {
                        "sequenceNumber": 91589,
                        "identifier": "sollicitudin elemen"
                    },
                    {
                        "sequenceNumber": 60694,
                        "identifier": "Sed"
                    }
                ],
                "GoodsReference": [
                    {
                        "sequenceNumber": 8159,
                        "declarationGoodsItemNumber": 51941
                    },
                    {
                        "sequenceNumber": 51459,
                        "declarationGoodsItemNumber": 35881
                    }
                ]
            }
        ],
        "LocationOfGoods": {
            "typeOfLocation": {
                "Code": "a",
                "Description": "tellus Duis sit eget mauris ut pretium Duis adipiscing porta felis lectus ut nisi",
                "ValidFrom": "2021-03-22T22:37:44Z",
                "ValidTo": "2020-03-31T22:37:44Z"
            },
            "qualifierOfIdentification": {
                "Code": "a",
                "Description": "ligula metus Praesent pulvinar elementum ac Nam Praesent odio euismod id feugiat sit pharetra erat ut imperdiet condimentum tellus pellentesque Nulla tellus ultricies tellus dolor nulla Ut at nisi Vivamus eget congue Lorem ornare sed pellentesque urna molestie tempus eget sodales pretium diam laoreet sodales nec vestibulum ut fermentum Suspendisse volutpat ullamcorper vehicula",
                "ValidFrom": "2019-09-17T22:37:44Z",
                "ValidTo": "2020-10-24T22:37:44Z"
            },
            "authorisationNumber": "Cras tristique",
            "additionalIdentifier": "nibh",
            "UNLocode": {
                "Code": "Donec",
                "Name": "ac Nulla fermentum justo",
                "Change": "a",
                "Subdivision": "non",
                "Function": "volutpat",
                "Status": "ut",
                "Date_": 0.00955775275340199,
                "Coordinates": "pellentesque",
                "Comment_": "Phasellus lacinia Praesent quis condimentum porta sit rutrum gravida Nullam est ullamcorper augue Cras Vivamus sit at Etiam non condimentum eu mauris eleifend eleifend",
                "Description": "sollicitudin in dolor Pellentesque dapibus feugiat lobortis Donec laoreet fermentum laoreet rhoncus vulputate ligula fringilla quis blandit aliquet id cursus convallis condimentum nibh fringilla eget amet ultrices lectus",
                "ValidFrom": "2020-01-26T22:37:44Z",
                "ValidTo": "2020-11-30T22:37:44Z"
            },
            "CustomsOffice": {
                "referenceNumber": {
                    "Code": "vehicula",
                    "Description": "sit vel sem vestibulum risus semper egestas dapibus et dignissim eu ante Nam Nullam adipiscing Proin quis tincidunt ipsum risus ac id In cursus ante Phasellus in magna vestibulum fermentum vel augue scelerisque amet purus nec leo erat diam tempor amet erat porttitor vulputate fringilla Praesent porttitor placerat orci lobortis dictum vel vehicula per velit varius",
                    "ValidFrom": "2019-08-16T22:37:44Z",
                    "ValidTo": "2019-07-29T22:37:44Z"
                }
            },
            "GNSS": {
                "latitude": "scelerisque",
                "longitude": "ac metus erat a"
            },
            "EconomicOperator": {
                "identificationNumber": "sollicitudin"
            },
            "Address": {
                "streetAndNumber": "Sed sit pulvinar Duis Vivamus",
                "postcode": "a Quisque",
                "city": "risus",
                "country": {
                    "Code": "in",
                    "TccEntryDate": "2019-02-25",
                    "NctsEntryDate": "2020-02-14",
                    "GeoNomenclatureCode": 0.507772824032126,
                    "CountryRegimeCode": "nec",
                    "Description": "augue nisl sed odio justo fermentum non Maecenas sodales Praesent elementum leo ac Donec posuere a condimentum ut fermentum accumsan nulla a fermentum nec feugiat fermentum et varius varius posuere massa commodo vitae leo hendrerit volutpat fermentum",
                    "ValidFrom": "2019-03-01T22:37:44Z",
                    "ValidTo": "2021-03-02T22:37:44Z"
                }
            },
            "AddressT": {
                "houseNumber": "erat non Donec",
                "postcode": "Aenean semper",
                "country": {
                    "Code": "ac",
                    "Description": "Curabitur amet odio ligula urna sollicitudin ac dolor in eget fringilla tempor et eu tristique pulvinar dictum varius iaculis laoreet gravida velit sagittis in faucibus eros ultrices cursus metus vel ac dictum congue elementum sit amet sapien Donec eget amet posuere eget Sed adipiscing at sit elit odio commodo nulla arcu nec suscipit quam viverra Praesent magna tortor id feugiat Sed fermentum Sed aptent vel quis amet sem sem lacinia turpis Sed",
                    "ValidFrom": "2020-12-07T22:37:44Z",
                    "ValidTo": "2021-05-27T22:37:44Z"
                }
            },
            "ContactPerson": {
                "name": "sagittis In viverra Maecenas posuere viverra",
                "phoneNumber": "pellentesque",
                "eMailAddress": "nec hendrerit Sed facilisis pretium id non ultrices justo vehicula lobortis ut per sem eleifend vel sed condimentum magna facilisis"
            }
        },
        "DepartureTransportMeans": [
            {
                "sequenceNumber": 90924,
                "typeOfIdentification": {
                    "Code": 0.00113605591521415,
                    "Description": "ullamcorper amet eget tristique diam enim laoreet mauris Quisque Sed lacinia non Vivamus mi sodales varius urna Curabitur Nulla ut quam pulvinar pulvinar ultrices condimentum neque ligula pulvinar dolor ultricies justo nec urna Suspendisse ante justo sed enim dapibus nulla accumsan pulvinar amet pellentesque feugiat ligula",
                    "ValidFrom": "2021-05-25T22:37:44Z",
                    "ValidTo": "2019-07-08T22:37:44Z"
                },
                "identificationNumber": "feugiat consequat accumsan ipsum",
                "nationality": {
                    "Code": "ac",
                    "TccEntryDate": "2020-02-05",
                    "NctsEntryDate": "2019-12-04",
                    "GeoNomenclatureCode": 7.84323696877958,
                    "CountryRegimeCode": "non",
                    "Description": "dictum egestas porta porta cursus non aptent Curabitur vel sem pellentesque pulvinar bibendum erat eget tellus quis pellentesque mi quam convallis dolor pretium ipsum at Pellentesque ante eros Sed Donec ad nisl tincidunt fermentum amet sem ultrices non Praesent ultricies Etiam consectetur nisi augue in a a",
                    "ValidFrom": "2019-07-18T22:37:44Z",
                    "ValidTo": "2019-05-09T22:37:44Z"
                }
            },
            {
                "sequenceNumber": 1432,
                "typeOfIdentification": {
                    "Code": 0.0000162689724547178,
                    "Description": "commodo aliquam egestas Proin lacus quis eget amet",
                    "ValidFrom": "2021-09-04T22:37:44Z",
                    "ValidTo": "2021-01-13T22:37:44Z"
                },
                "identificationNumber": "sem",
                "nationality": {
                    "Code": "ac",
                    "TccEntryDate": "2020-11-07",
                    "NctsEntryDate": "2021-07-13",
                    "GeoNomenclatureCode": 0.000876338380796992,
                    "CountryRegimeCode": "sit",
                    "Description": "sem dui bibendum dolor amet nec vel Donec ante quis nec dolor tincidunt pulvinar nisi eget justo vitae quis mauris Sed at elit ornare sem Cras",
                    "ValidFrom": "2021-08-07T22:37:44Z",
                    "ValidTo": "2019-01-23T22:37:44Z"
                }
            }
        ],
        "CountryOfRoutingOfConsignment": [
            {
                "sequenceNumber": 89481,
                "country": {
                    "Code": "at",
                    "TccEntryDate": "2021-08-11",
                    "NctsEntryDate": "2021-09-22",
                    "GeoNomenclatureCode": 0.0890092125111302,
                    "CountryRegimeCode": "sem",
                    "Description": "adipiscing a Sed non ac quis sociosqu ac nec id quis et condimentum sed sit eu tortor rhoncus vitae ac nisi felis mauris pulvinar porta nec sollicitudin tellus ante erat Sed mi dui porttitor condimentum ut facilisis ac egestas Nunc eu risus eu feugiat quam convallis accumsan vel vehicula lacinia elit Donec sit est mi sem nulla tincidunt leo faucibus blandit tristique augue convallis elementum est et pharetra rutrum nulla vel vulputate Proin Duis ac fermentum Sed odio adipiscing",
                    "ValidFrom": "2021-01-31T22:37:44Z",
                    "ValidTo": "2019-03-14T22:37:44Z"
                }
            },
            {
                "sequenceNumber": 70042,
                "country": {
                    "Code": "in",
                    "TccEntryDate": "2019-07-20",
                    "NctsEntryDate": "2019-03-22",
                    "GeoNomenclatureCode": 0.842414582540474,
                    "CountryRegimeCode": "sit",
                    "Description": "massa erat quis quam nec diam gravida",
                    "ValidFrom": "2021-06-30T22:37:44Z",
                    "ValidTo": "2020-05-19T22:37:44Z"
                }
            }
        ],
        "ActiveBorderTransportMeans": {
            "typeOfIdentification": {
                "Code": 235.220142749706,
                "Description": "amet eget sit adipiscing tristique Nunc eleifend at augue augue porttitor tempor sit Proin sapien urna congue sodales Phasellus ante nec et accumsan",
                "ValidFrom": "2020-10-07T22:37:44Z",
                "ValidTo": "2020-08-05T22:37:44Z"
            },
            "identificationNumber": "enim accumsan leo elit enim ipsum",
            "nationality": {
                "Code": "In",
                "TccEntryDate": "2020-04-15",
                "NctsEntryDate": "2019-10-07",
                "GeoNomenclatureCode": 0.0883581471109568,
                "CountryRegimeCode": "vel",
                "Description": "ac consequat",
                "ValidFrom": "2020-08-31T22:37:44Z",
                "ValidTo": "2019-12-15T22:37:44Z"
            },
            "conveyanceReferenceNumber": "purus porttitor"
        },
        "PlaceOfLoading": {
            "UNLocode": {
                "Code": "porta",
                "Name": "pharetra sit pellentesque faucibus eget et metus massa pellentesque dapibus purus eget consectetur",
                "Change": "a",
                "Subdivision": "a",
                "Function": "pharetra",
                "Status": "Ut",
                "Date_": 3.00558914570398,
                "Coordinates": "Pellentesque",
                "Comment_": "pharetra et tristique congue convallis Morbi tincidunt pellentesque vulputate diam augue tristique Sed est varius ullamcorper nibh vestibulum fermentum non varius adipiscing felis ut Pellentesque Maecenas tellus nec commodo amet justo vitae Cras tellus fermentum euismod erat Morbi adipiscing nec id placerat pretium sem accumsan convallis vehicula",
                "Description": "ligula justo Etiam tellus sollicitudin Sed semper ornare nisl mauris non euismod sem blandit fringilla viverra erat sed erat Etiam vitae euismod vestibulum fermentum erat sit vel porttitor turpis eleifend vitae elementum massa velit ac amet sollicitudin turpis urna eget Nam sodales risus mi dapibus ac pulvinar adipiscing tellus eleifend taciti semper lectus dolor mollis justo aliquam adipiscing aliquam risus eget sit sodales egestas vestibulum vitae ligula vel porttitor velit nec",
                "ValidFrom": "2020-12-16T22:37:44Z",
                "ValidTo": "2020-01-03T22:37:44Z"
            },
            "country": {
                "Code": "et",
                "TccEntryDate": "2021-01-29",
                "NctsEntryDate": "2019-11-11",
                "GeoNomenclatureCode": 7.71984369853504,
                "CountryRegimeCode": "vel",
                "Description": "Donec velit Maecenas pretium Suspendisse tristique metus consequat Quisque diam diam sapien est Vestibulum lacus velit posuere Maecenas Duis posuere sit Quisque tristique accumsan porttitor dignissim mauris lobortis et Curabitur at faucibus lacinia sit condimentum",
                "ValidFrom": "2019-08-01T22:37:44Z",
                "ValidTo": "2021-05-22T22:37:44Z"
            },
            "location": "Vestibulum"
        },
        "PlaceOfUnloading": {
            "UNLocode": {
                "Code": "lacus",
                "Name": "vulputate tellus Pellentesque",
                "Change": "a",
                "Subdivision": "non",
                "Function": "eleifend",
                "Status": "ut",
                "Date_": 0.0831381199337254,
                "Coordinates": "pellentesque",
                "Comment_": "tempus Vivamus Suspendisse eu sed commodo aliquet consectetur amet in cursus quis eget id Etiam felis viverra sit Nunc ultrices vel ac metus erat augue dictum Curabitur",
                "Description": "id Curabitur Curabitur vulputate augue sed est urna dapibus tempus ipsum vestibulum fringilla sem dapibus feugiat sed fringilla sollicitudin",
                "ValidFrom": "2021-04-27T22:37:44Z",
                "ValidTo": "2019-07-23T22:37:44Z"
            },
            "country": {
                "Code": "id",
                "TccEntryDate": "2019-10-27",
                "NctsEntryDate": "2019-10-24",
                "GeoNomenclatureCode": 0.338882442255915,
                "CountryRegimeCode": "leo",
                "Description": "hendrerit odio vitae eleifend cursus Donec sed dapibus Vivamus id non porttitor sodales vitae elit nisl pellentesque",
                "ValidFrom": "2019-05-31T22:37:44Z",
                "ValidTo": "2021-07-04T22:37:44Z"
            },
            "location": "libero sapien"
        },
        "PreviousDocument": [
            {
                "sequenceNumber": 55959,
                "type": {
                    "Code": "Cras",
                    "Description": "tristique fringilla egestas ullamcorper id himenaeos ante ultrices quam ac molestie Phasellus egestas mattis lorem Lorem tincidunt eleifend sagittis leo porttitor ut ac justo",
                    "ValidFrom": "2019-07-02T22:37:44Z",
                    "ValidTo": "2019-07-20T22:37:44Z"
                },
                "referenceNumber": "lectus condimentum Proin metus lacus non massa",
                "complementOfInformation": "in elit elit"
            },
            {
                "sequenceNumber": 3443,
                "type": {
                    "Code": "erat",
                    "Description": "adipiscing nec condimentum quis arcu gravida erat pellentesque libero Duis consectetur Curabitur a non Sed Cras tincidunt",
                    "ValidFrom": "2020-12-17T22:37:44Z",
                    "ValidTo": "2021-06-15T22:37:44Z"
                },
                "referenceNumber": "tortor potenti id felis metus nibh aliquam placerat Sed ac id",
                "complementOfInformation": "dapibus"
            }
        ],
        "SupportingDocument": [
            {
                "sequenceNumber": 14626,
                "type": {
                    "Code": "nibh",
                    "Description": "arcu in eu Nunc facilisis dapibus semper Curabitur tempus nisl id sit iaculis pellentesque molestie mauris sit ante per amet augue nec elementum quam metus sagittis semper vel turpis bibendum nec nisi vulputate auctor vehicula egestas elit sit egestas Nam leo pulvinar Suspendisse Nam velit mollis Lorem odio Quisque Nunc fermentum sit adipiscing porttitor eros commodo sit vehicula tincidunt imperdiet euismod molestie ligula augue gravida tincidunt Nam Sed",
                    "ValidFrom": "2019-12-13T22:37:44Z",
                    "ValidTo": "2019-03-16T22:37:44Z"
                },
                "referenceNumber": "iaculis ipsum vel velit imperdiet egestas sed blandit magna Quisque",
                "documentLineItemNumber": 86044,
                "complementOfInformation": "non scelerisque lacus urna eleifend"
            },
            {
                "sequenceNumber": 98474,
                "type": {
                    "Code": "diam",
                    "Description": "a libero sapien ut Sed nibh",
                    "ValidFrom": "2020-05-03T22:37:44Z",
                    "ValidTo": "2020-07-27T22:37:44Z"
                },
                "referenceNumber": "congue Sed et molestie Duis Phasellus purus nibh vulputate",
                "documentLineItemNumber": 29645,
                "complementOfInformation": "Ut a elit ac diam"
            }
        ],
        "TransportDocument": [
            {
                "sequenceNumber": 27987,
                "type": {
                    "Code": "eget",
                    "Description": "Donec Aenean tincidunt odio Integer eu vestibulum eget Ut Donec interdum ligula enim odio non elit nec ac vulputate pharetra leo justo vitae dui mauris Integer Ut sodales sagittis ornare interdum tellus id pharetra enim vehicula tempus nibh ipsum interdum ligula vulputate",
                    "ValidFrom": "2021-10-02T22:37:44Z",
                    "ValidTo": "2021-02-24T22:37:44Z"
                },
                "referenceNumber": "euismod"
            },
            {
                "sequenceNumber": 52962,
                "type": {
                    "Code": "amet",
                    "Description": "risus condimentum tempus",
                    "ValidFrom": "2020-08-10T22:37:44Z",
                    "ValidTo": "2019-06-23T22:37:44Z"
                },
                "referenceNumber": "odio eget magna"
            }
        ],
        "AdditionalReference": [
            {
                "sequenceNumber": 54917,
                "type": {
                    "Code": "sed",
                    "Description": "sollicitudin Donec elit vitae tortor dolor dapibus sollicitudin Vivamus ut Vivamus id ac Pellentesque Cras vehicula posuere vehicula augue tincidunt at non dolor est Curabitur molestie nec pellentesque imperdiet scelerisque ullamcorper pretium ipsum Sed convallis vitae sed scelerisque ut aliquam sit consequat eget porttitor pulvinar justo fermentum fringilla Suspendisse faucibus Integer lacus posuere pulvinar pellentesque tincidunt elementum Nam sollicitudin vulputate",
                    "ValidFrom": "2019-04-28T22:37:44Z",
                    "ValidTo": "2021-08-06T22:37:44Z"
                },
                "referenceNumber": "amet nulla nec pellentesque amet eget facilisis"
            },
            {
                "sequenceNumber": 25537,
                "type": {
                    "Code": "sed",
                    "Description": "ac elit facilisis risus erat et vitae amet fringilla Quisque condimentum lacus feugiat dui sollicitudin congue tristique Maecenas a interdum Nullam",
                    "ValidFrom": "2020-02-26T22:37:44Z",
                    "ValidTo": "2020-03-25T22:37:44Z"
                },
                "referenceNumber": "in sollicitudin enim sodales odio amet pulvinar elit Duis dignissim"
            }
        ],
        "AdditionalInformation": [
            {
                "sequenceNumber": 71375,
                "code": {
                    "Code": "eros",
                    "Description": "vestibulum euismod pulvinar fringilla suscipit Sed turpis mi nec auctor vel dignissim Nulla faucibus tristique mauris fermentum Lorem tempus blandit pharetra at faucibus adipiscing posuere eget pretium odio vitae vel fermentum nulla commodo taciti vehicula hendrerit nibh Duis viverra",
                    "ValidFrom": "2020-04-17T22:37:44Z",
                    "ValidTo": "2019-01-16T22:37:44Z"
                },
                "text": "Nulla metus eu aliquet volutpat gravida ornare egestas eu ligula eu Sed velit pulvinar fringilla sollicitudin pulvinar"
            },
            {
                "sequenceNumber": 60899,
                "code": {
                    "Code": "et",
                    "Description": "varius vel facilisis eros Donec enim In placerat augue metus Cras commodo Vivamus Aliquam adipiscing at elementum convallis vel in condimentum leo adipiscing Nunc mauris ligula eget amet Vivamus nec porta velit amet ligula ante sapien elementum pharetra pharetra non Nam consequat posuere nibh leo sem Proin arcu eu nec et tortor molestie felis justo placerat sem lectus id ut Nunc volutpat Ut quis faucibus sit feugiat",
                    "ValidFrom": "2020-12-07T22:37:44Z",
                    "ValidTo": "2019-04-26T22:37:44Z"
                },
                "text": "ac dapibus Donec sodales metus Nunc id consequat lobortis eros aliquet fermentum facilisis nec eleifend vulputate Nunc blandit mauris leo eget metus suscipit varius odio fermentum est facilisis eleifend"
            }
        ],
        "HouseConsignment": [
            {
                "sequenceNumber": 1,
                "countryOfDispatch": {
                    "Code": "et",
                    "TccEntryDate": "2020-08-15",
                    "NctsEntryDate": "2021-07-09",
                    "GeoNomenclatureCode": 3.13647134841255,
                    "CountryRegimeCode": "leo",
                    "Description": "eget fringilla metus sapien ante Donec ac faucibus porta mollis Quisque eleifend vel congue urna est sapien sapien pretium litora condimentum nibh scelerisque Donec nulla Nullam risus lobortis viverra non suscipit tincidunt Nam pulvinar vitae sodales conubia et elementum viverra lorem sed mattis posuere quis hendrerit justo Sed non rhoncus non commodo ligula dapibus non arcu accumsan elit pellentesque ac",
                    "ValidFrom": "2019-03-11T22:37:44Z",
                    "ValidTo": "2019-11-24T22:37:44Z"
                },
                "grossMass": 0.864624017786525,
                "referenceNumberUCR": "vel Duis venenatis quis",
                "Consignor": {
                    "identificationNumber": "sollicitudin lig",
                    "name": "ligula lectus mauris non elementum auctor augue amet vel sem sagittis",
                    "Address": {
                        "streetAndNumber": "molestie faucibus sed ut Proin rhoncus hendrerit ac",
                        "postcode": "Nam in elit leo ",
                        "city": "lorem",
                        "country": {
                            "Code": "mi",
                            "Description": "blandit nisi nisi amet aliquam",
                            "ValidFrom": "2020-06-12T22:37:44Z",
                            "ValidTo": "2021-09-30T22:37:44Z"
                        }
                    },
                    "ContactPerson": {
                        "name": "bibendum sit lacus sem tincidunt ultricies nulla",
                        "phoneNumber": "sit id elit fermentum metus leo",
                        "eMailAddress": "metus metus sollicitudin vitae dapibus"
                    }
                },
                "Consignee": {
                    "identificationNumber": "vel lectus",
                    "name": "dictum pharetra In Phasellus pellentesque",
                    "Address": {
                        "streetAndNumber": "Donec Phasellus quis",
                        "postcode": "Quisque",
                        "city": "vehicula nisi mi lobortis mi",
                        "country": {
                            "Code": "In",
                            "Description": "Quisque nisi nisl quis nibh pretium quam sapien justo velit blandit neque tortor tincidunt eget facilisis egestas velit sit suscipit risus eget ligula condimentum odio tortor tincidunt amet vitae tellus in Phasellus eget eget commodo ullamcorper Aliquam pellentesque nec metus id Integer elementum sapien massa urna vel tristique Sed sit vehicula Curabitur enim tristique sagittis accumsan sollicitudin",
                            "ValidFrom": "2019-12-05T22:37:44Z",
                            "ValidTo": "2019-08-17T22:37:44Z"
                        }
                    }
                },
                "AdditionalSupplyChainActor": [
                    {
                        "sequenceNumber": 63835,
                        "role": {
                            "Code": "vel",
                            "Description": "id hendrerit Cras metus ultricies mauris quam orci molestie ac Ut sed erat ligula nibh eget quis facilisis Nunc suscipit accumsan massa tortor ultricies at tempus mi sit Ut in mauris quis porta diam mi ipsum erat placerat",
                            "ValidFrom": "2019-07-22T22:37:44Z",
                            "ValidTo": "2020-10-30T22:37:44Z"
                        },
                        "identificationNumber": "dictum Mauris"
                    },
                    {
                        "sequenceNumber": 24939,
                        "role": {
                            "Code": "ut",
                            "Description": "feugiat sem non porta eget Sed vitae Ut laoreet risus molestie quam gravida eget mi",
                            "ValidFrom": "2019-07-12T22:37:44Z",
                            "ValidTo": "2020-07-01T22:37:44Z"
                        },
                        "identificationNumber": "id Nunc"
                    }
                ],
                "DepartureTransportMeans": [
                    {
                        "sequenceNumber": 20817,
                        "typeOfIdentification": {
                            "Code": 0.0220534512875851,
                            "Description": "interdum eros Sed ipsum metus blandit In Vivamus pellentesque Cras eget odio hendrerit eget Sed lobortis tincidunt mollis Sed sit in commodo ultrices aptent pretium Suspendisse nec vestibulum velit enim mi sit Etiam ligula elementum faucibus ipsum mi interdum mauris ut sem Donec Cras Cras adipiscing sed Suspendisse mi lacinia ut Integer Cras id Sed Curabitur mollis justo ut ac accumsan sapien Etiam amet non sapien feugiat Ut sit lobortis iaculis adipiscing Curabitur fringilla odio vehicula ligula non",
                            "ValidFrom": "2019-07-17T22:37:44Z",
                            "ValidTo": "2020-09-12T22:37:44Z"
                        },
                        "identificationNumber": "interdum",
                        "nationality": {
                            "Code": "ut",
                            "TccEntryDate": "2021-08-09",
                            "NctsEntryDate": "2021-06-16",
                            "GeoNomenclatureCode": 0.0000548108221286958,
                            "CountryRegimeCode": "non",
                            "Description": "ut sollicitudin eros nisl mi scelerisque Phasellus fringilla ipsum eros et Class quis nunc sodales vulputate nunc sem sed sit quis vehicula dolor sollicitudin vehicula facilisis mauris pellentesque facilisis sem urna eget Curabitur at hendrerit Sed pulvinar sit vehicula ligula tortor metus scelerisque Ut porta amet Nulla tristique sagittis non ullamcorper iaculis Vestibulum nec orci sociosqu tempor ad elit sem erat mi eleifend augue Donec molestie ullamcorper",
                            "ValidFrom": "2019-12-30T22:37:44Z",
                            "ValidTo": "2019-07-31T22:37:44Z"
                        }
                    },
                    {
                        "sequenceNumber": 96299,
                        "typeOfIdentification": {
                            "Code": 0.0469405465046598,
                            "Description": "Donec elementum quis fringilla pulvinar consequat eros Nam eu massa ac sapien quis nulla non eget egestas litora lacinia vel quam eu vitae eu pharetra in vel molestie Pellentesque Nam",
                            "ValidFrom": "2020-07-12T22:37:44Z",
                            "ValidTo": "2020-05-29T22:37:44Z"
                        },
                        "identificationNumber": "vitae Aliquam molestie volutpat",
                        "nationality": {
                            "Code": "at",
                            "TccEntryDate": "2020-03-14",
                            "NctsEntryDate": "2019-09-06",
                            "GeoNomenclatureCode": 0.0848572372854022,
                            "CountryRegimeCode": "leo",
                            "Description": "sit gravida sit facilisis sagittis dapibus sapien In neque dictum eu sit ut ligula egestas tortor Vivamus Sed turpis vehicula non arcu Lorem odio auctor",
                            "ValidFrom": "2020-12-21T22:37:44Z",
                            "ValidTo": "2019-11-16T22:37:44Z"
                        }
                    }
                ],
                "PreviousDocument": [
                    {
                        "sequenceNumber": 226,
                        "type": {
                            "Code": "amet",
                            "Description": "blandit Sed mollis vehicula quam sagittis mollis enim vel ultricies felis in a ut nec nulla mollis purus Integer Sed id Maecenas molestie eu consectetur gravida tortor vitae nec vestibulum tincidunt egestas tincidunt augue eget Vestibulum pulvinar mollis facilisis pharetra dolor magna tristique purus Sed ligula dignissim augue ut sed nisi consectetur risus Praesent fringilla",
                            "ValidFrom": "2019-10-20T22:37:44Z",
                            "ValidTo": "2020-05-06T22:37:44Z"
                        },
                        "referenceNumber": "urna fermentum vulputate mauris ac"
                    },
                    {
                        "sequenceNumber": 75375,
                        "type": {
                            "Code": "Duis",
                            "Description": "massa Suspendisse egestas elit lectus lacus conubia tincidunt non lacus nec vitae vestibulum Ut erat egestas nec ipsum lacinia facilisis nibh id odio convallis Suspendisse turpis hendrerit id erat diam odio adipiscing justo risus molestie Cras vel Nam metus",
                            "ValidFrom": "2020-02-26T22:37:44Z",
                            "ValidTo": "2020-07-28T22:37:44Z"
                        },
                        "referenceNumber": "urna Suspendisse elit varius velit"
                    }
                ],
                "TransportDocument": [
                    {
                        "sequenceNumber": 69885,
                        "type": {
                            "Code": "Nunc",
                            "Description": "nulla nec volutpat ultricies massa metus fringilla mauris elementum egestas massa Vivamus ante ultricies risus Sed condimentum eget sem Donec enim mi Donec blandit",
                            "ValidFrom": "2019-05-01T22:37:44Z",
                            "ValidTo": "2020-01-21T22:37:44Z"
                        },
                        "referenceNumber": "venenatis amet et eget tristique vulputate"
                    },
                    {
                        "sequenceNumber": 27356,
                        "type": {
                            "Code": "diam",
                            "Description": "vel Suspendisse sit sit consectetur molestie urna est vel nisi Curabitur sem eleifend egestas vehicula gravida velit lorem elit gravida nulla ut mollis leo ante iaculis Phasellus Pellentesque in ac congue pellentesque lobortis Ut sed",
                            "ValidFrom": "2020-09-21T22:37:44Z",
                            "ValidTo": "2020-11-30T22:37:44Z"
                        },
                        "referenceNumber": "semper"
                    }
                ],
                "AdditionalReference": [
                    {
                        "sequenceNumber": 46547,
                        "type": {
                            "Code": "eu",
                            "Description": "Class consequat lacus consectetur Nulla vestibulum pellentesque elementum vel dolor Sed mollis Vivamus Aenean sit vel tempus mollis Quisque auctor",
                            "ValidFrom": "2019-02-15T22:37:44Z",
                            "ValidTo": "2020-10-05T22:37:44Z"
                        },
                        "referenceNumber": "nibh Nullam"
                    },
                    {
                        "sequenceNumber": 29965,
                        "type": {
                            "Code": "nisl",
                            "Description": "elementum enim cursus eget ultrices Morbi commodo adipiscing lobortis turpis amet In in a Quisque placerat id Phasellus eu at sed sapien ligula ipsum nisi",
                            "ValidFrom": "2020-07-31T22:37:44Z",
                            "ValidTo": "2019-08-31T22:37:44Z"
                        },
                        "referenceNumber": "pulvinar pellentesque condimentum augue id est Lorem quis"
                    }
                ],
                "TransportCharges": {
                    "methodOfPayment": {
                        "Code": "a",
                        "Description": "scelerisque congue quis ante ipsum elit Nunc posuere mauris ac metus metus Nunc mauris Praesent iaculis amet suscipit felis nulla varius sit placerat tellus molestie tincidunt eget mi Cras accumsan dapibus sit id pellentesque Sed lacus Nunc id dapibus elementum accumsan suscipit sem elementum mauris ut sodales ante Nulla porta In condimentum Cras pellentesque Cras suscipit metus pulvinar velit mi eleifend porta sem cursus",
                        "ValidFrom": "2020-03-12T22:37:44Z",
                        "ValidTo": "2019-08-30T22:37:44Z"
                    }
                },
                "ConsignmentItem": [
                    {
                        "goodsItemNumber": 1,
                        "declarationGoodsItemNumber": 42069,
                        "declarationType": {
                            "Code": "in",
                            "Description": "tincidunt porta placerat sapien faucibus condimentum Vivamus vel commodo lobortis mi Proin vel nec feugiat mauris tellus ligula quis odio Sed congue nibh vehicula sed himenaeos condimentum sodales suscipit feugiat amet volutpat ligula lacinia amet blandit",
                            "ValidFrom": "2021-08-14T22:37:44Z",
                            "ValidTo": "2019-05-11T22:37:44Z"
                        },
                        "countryOfDispatch": {
                            "Code": "Ut",
                            "TccEntryDate": "2020-07-13",
                            "NctsEntryDate": "2019-10-08",
                            "GeoNomenclatureCode": 92.215862633761,
                            "CountryRegimeCode": "nec",
                            "Description": "nibh suscipit a eget pharetra nisi est vestibulum orci sagittis tellus In sapien",
                            "ValidFrom": "2019-01-10T22:37:44Z",
                            "ValidTo": "2021-09-17T22:37:44Z"
                        },
                        "countryOfDestination": {
                            "Code": "Ut",
                            "TccEntryDate": "2019-03-14",
                            "NctsEntryDate": "2020-03-25",
                            "GeoNomenclatureCode": 0.0361009143461012,
                            "CountryRegimeCode": "leo",
                            "Description": "Vivamus leo nibh tristique et quis mauris blandit Donec fermentum Vivamus aliquam commodo tempor fringilla sed Donec mauris erat lacus nec vestibulum ut vestibulum Pellentesque rhoncus ut pulvinar metus pulvinar laoreet litora non condimentum posuere nec feugiat dolor nibh torquent feugiat risus eros Duis Class dui nulla velit taciti consectetur nibh sit felis tellus sit",
                            "ValidFrom": "2020-06-20T22:37:44Z",
                            "ValidTo": "2019-10-09T22:37:44Z"
                        },
                        "referenceNumberUCR": "ac sapien quis sit vulputate",
                        "itemPriceEUR": 57.6523627422994,
                        "Consignee": {
                            "identificationNumber": "fringilla pharet",
                            "name": "elit ultricies risus ante",
                            "Address": {
                                "streetAndNumber": "dui et sagittis mollis Quisque vehicula facilisis mollis In Donec sed",
                                "postcode": "tortor",
                                "city": "litora Nulla sapien",
                                "country": {
                                    "Code": "ut",
                                    "Description": "risus at non Sed nec Curabitur Maecenas tincidunt arcu vehicula fringilla ac Vestibulum Donec Donec lacus condimentum nec quis facilisis ac commodo ligula facilisis sollicitudin elementum laoreet condimentum Vivamus eros aliquam facilisis vulputate magna facilisis porta blandit eleifend",
                                    "ValidFrom": "2019-02-28T22:37:44Z",
                                    "ValidTo": "2020-05-02T22:37:44Z"
                                }
                            }
                        },
                        "AdditionalSupplyChainActor": [
                            {
                                "sequenceNumber": 35766,
                                "role": {
                                    "Code": "sed",
                                    "Description": "sem mauris vel et et vitae quis pulvinar metus quis feugiat ipsum vulputate nec eget diam semper nunc ligula ante sed Nullam placerat Maecenas fringilla pellentesque sed Proin",
                                    "ValidFrom": "2020-07-02T22:37:44Z",
                                    "ValidTo": "2020-11-24T22:37:44Z"
                                },
                                "identificationNumber": "laoreet"
                            },
                            {
                                "sequenceNumber": 57960,
                                "role": {
                                    "Code": "sed",
                                    "Description": "nulla ac est Vivamus tristique sodales massa Duis quam feugiat at condimentum viverra elit consectetur justo tempus vitae rhoncus tristique eros sed",
                                    "ValidFrom": "2020-08-01T22:37:44Z",
                                    "ValidTo": "2020-08-21T22:37:44Z"
                                },
                                "identificationNumber": "vitae vitae"
                            }
                        ],
                        "Commodity": {
                            "descriptionOfGoods": "leo dolor vel est sapien condimentum nibh nulla sapien tellus diam eleifend vehicula elementum ac vitae vehicula Praesent faucibus amet vitae et pretium Vivamus laoreet metus faucibus porta Aliquam pharetra condimentum taciti quis elit felis consectetur laoreet Pellentesque risus Class massa sit feugiat sodales sit risus dolor egestas Sed odio Quisque id a nibh sed Duis dapibus facilisis nostra sit Integer Pellentesque lacus lacinia est eros elit mauris Nam egestas ullamcorper",
                            "cusCode": {
                                "Code": "elementum",
                                "Description": "velit bibendum sem dolor ultricies metus imperdiet consequat Curabitur convallis nisl vel blandit id urna eu lorem scelerisque nibh blandit diam erat risus Morbi imperdiet sit vehicula gravida id pretium sit Aenean commodo hendrerit",
                                "ValidFrom": "2020-08-18T22:37:44Z",
                                "ValidTo": "2020-11-23T22:37:44Z"
                            },
                            "CommodityCode": {
                                "harmonisedSystemSubHeadingCode": {
                                    "Code": "sapien",
                                    "Description": "eu posuere dictum massa eleifend ipsum nec Cras aliquet nibh ipsum vel ipsum nibh laoreet vestibulum vehicula suscipit odio litora urna eu gravida adipiscing vulputate ultrices nibh lectus sit sit molestie Ut lacinia eros Mauris hendrerit Duis Maecenas quis sit nec pretium sapien sagittis mauris porta vulputate",
                                    "ValidFrom": "2020-04-19T22:37:44Z",
                                    "ValidTo": "2020-04-16T22:37:44Z"
                                },
                                "combinedNomenclatureCode": "ac",
                                "nacionalCode": "at",
                                "exciseGoodsQuantity": 9.23306732402792
                            },
                            "DangerousGoods": [
                                {
                                    "sequenceNumber": 47522,
                                    "UNNumber": {
                                        "Code": "nisi",
                                        "Description": "Donec vel ut porttitor laoreet mi Donec Cras nibh vitae in amet Nullam sapien venenatis Phasellus vulputate gravida elementum eget Ut condimentum hendrerit fermentum interdum vel dolor scelerisque adipiscing laoreet lobortis tristique vitae amet urna mi varius tempus Proin adipiscing amet ullamcorper id sed nec leo ante elit amet massa amet venenatis dictum amet mauris ullamcorper eu Lorem est id mi condimentum pulvinar feugiat molestie Sed quis Etiam Etiam Integer",
                                        "ValidFrom": "2019-07-07T22:37:44Z",
                                        "ValidTo": "2019-09-21T22:37:44Z"
                                    }
                                },
                                {
                                    "sequenceNumber": 56013,
                                    "UNNumber": {
                                        "Code": "eget",
                                        "Description": "amet vitae gravida elit sit mauris quam lorem eu Phasellus dui ut orci amet metus semper sed pellentesque laoreet vitae Quisque a gravida dignissim sapien ultricies sit ut eget tristique elit Curabitur metus id sapien sapien quis fringilla auctor vestibulum non Quisque metus justo Vivamus nec ut eget accumsan Maecenas ac justo pharetra Sed posuere nibh felis id ut facilisis at sapien erat Class sapien nec porta Maecenas Pellentesque Vivamus diam Nulla Sed",
                                        "ValidFrom": "2021-01-14T22:37:44Z",
                                        "ValidTo": "2019-10-12T22:37:44Z"
                                    }
                                }
                            ],
                            "GoodsMeasure": {
                                "grossMass": 0.999456609133378,
                                "netMass": 0.668137114340503,
                                "supplementaryUnits": 0.0000911727490793787
                            }
                        },
                        "Packaging": [
                            {
                                "sequenceNumber": 55030,
                                "typeOfPackages": {
                                    "Code": "mi",
                                    "Description": "vitae vulputate amet Nunc condimentum sit sed vel felis Proin egestas hendrerit erat per metus elementum amet tellus Sed metus sed sit suscipit in pulvinar massa at quam elementum dapibus ut ante Integer Maecenas ullamcorper nec amet porta elit sollicitudin augue massa egestas ultricies suscipit pellentesque",
                                    "ValidFrom": "2021-04-13T22:37:44Z",
                                    "ValidTo": "2019-08-26T22:37:44Z"
                                },
                                "numberOfPackages": 41653386,
                                "shippingMarks": "vitae ipsum diam elementum velit sed nec quis eget accumsan elit lacus volutpat Proin rhoncus tortor Morbi eu pharetra sit vel suscipit elementum blandit dolor gravida id tempus sit adipiscing nec Duis tristique"
                            },
                            {
                                "sequenceNumber": 5801,
                                "typeOfPackages": {
                                    "Code": "in",
                                    "Description": "dui metus erat erat Aliquam Nulla commodo Praesent in vulputate consequat Donec Integer risus ullamcorper ante sem sodales tempor",
                                    "ValidFrom": "2019-08-01T22:37:44Z",
                                    "ValidTo": "2020-09-29T22:37:44Z"
                                },
                                "numberOfPackages": 39833970,
                                "shippingMarks": "eget risus purus Donec egestas potenti sed sed sapien vulputate accumsan arcu erat ut sapien Maecenas mi sed id auctor nec scelerisque egestas at pulvinar est pretium euismod tortor convallis Nulla Sed ac eget elementum eget neque Vestibulum diam lacus mauris vestibulum sagittis tincidunt cursus at in eget ipsum pharetra accumsan"
                            }
                        ],
                        "PreviousDocument": [
                            {
                                "sequenceNumber": 90623,
                                "type": {
                                    "Code": "odio",
                                    "Description": "metus dapibus lobortis est quis vehicula dui dui dictum diam nibh mi Maecenas ante ante blandit commodo vehicula sem aliquam porta Aliquam Sed lorem Vivamus id sit dolor urna quam elementum ante odio convallis vestibulum Nunc Phasellus vehicula tellus hendrerit Nulla magna ut ullamcorper Aenean Pellentesque Donec egestas risus porta tristique eget vehicula ac nunc Suspendisse vitae non mi eros dapibus pellentesque ultricies rhoncus sem vehicula faucibus consequat",
                                    "ValidFrom": "2020-11-17T22:37:44Z",
                                    "ValidTo": "2020-08-18T22:37:44Z"
                                },
                                "referenceNumber": "id commodo",
                                "goodsItemNumber": 23085,
                                "typeOfPackages": {
                                    "Code": "in",
                                    "Description": "turpis id nisi suscipit taciti nisi",
                                    "ValidFrom": "2019-03-06T22:37:44Z",
                                    "ValidTo": "2021-05-03T22:37:44Z"
                                },
                                "numberOfPackages": 89299157,
                                "measurementUnitAndQualifier": {
                                    "Code": "nec",
                                    "Description": "rhoncus Proin vulputate dictum sem gravida sed a auctor vestibulum ornare ligula purus aliquam quis varius Duis sapien Cras Praesent Curabitur vestibulum eleifend placerat Aliquam accumsan mattis ac vitae lacus Praesent Nullam ligula Nunc Donec Phasellus sapien pulvinar euismod semper urna est eleifend sapien Lorem Maecenas commodo amet ac id imperdiet lacus mauris tortor ante Vestibulum posuere amet vel Sed nisl Curabitur vehicula Pellentesque in bibendum Lorem augue ante",
                                    "ValidFrom": "2021-09-18T22:37:44Z",
                                    "ValidTo": "2021-09-13T22:37:44Z"
                                },
                                "quantity": 0.00911730038892352,
                                "complementOfInformation": "eu lacinia justo ligula commodo eg"
                            },
                            {
                                "sequenceNumber": 35627,
                                "type": {
                                    "Code": "erat",
                                    "Description": "sed blandit nunc tellus gravida Nulla Sed a bibendum sit Duis molestie condimentum Etiam adipiscing vel justo turpis eros vel mattis condimentum massa consectetur nec elit Sed convallis volutpat Quisque porta eu Cras Curabitur Donec orci sit nisi Duis Praesent ipsum non consequat Suspendisse bibendum lectus Nunc pharetra Duis non Sed neque vitae sit blandit Sed urna Praesent pulvinar Donec eros Curabitur Proin elit Curabitur dictum In Nunc Pellentesque auctor urna massa tristique scelerisque non egestas vel",
                                    "ValidFrom": "2019-02-04T22:37:44Z",
                                    "ValidTo": "2021-01-22T22:37:44Z"
                                },
                                "referenceNumber": "eu conubia laoreet congue sodales sit adipiscing pellentesque diam",
                                "goodsItemNumber": 81794,
                                "typeOfPackages": {
                                    "Code": "vel",
                                    "Description": "condimentum dui commodo venenatis justo dictum Curabitur ligula elit Aenean ullamcorper tellus metus at sodales nulla vel mauris posuere lacus Nullam suscipit sem et vitae tristique sit fringilla amet dapibus urna",
                                    "ValidFrom": "2021-06-11T22:37:44Z",
                                    "ValidTo": "2020-07-06T22:37:44Z"
                                },
                                "numberOfPackages": 40390540,
                                "measurementUnitAndQualifier": {
                                    "Code": "mi",
                                    "Description": "semper dui eget tincidunt semper ultricies risus mattis justo mi ligula vehicula imperdiet suscipit ut est purus",
                                    "ValidFrom": "2020-08-31T22:37:44Z",
                                    "ValidTo": "2021-05-16T22:37:44Z"
                                },
                                "quantity": 0.0656177046548658,
                                "complementOfInformation": "pellentesque interdum"
                            }
                        ],
                        "SupportingDocument": [
                            {
                                "sequenceNumber": 18383,
                                "type": {
                                    "Code": "nunc",
                                    "Description": "nisi egestas condimentum adipiscing adipiscing Proin iaculis elementum litora porta eget justo dapibus porttitor Donec molestie non suscipit eros mauris vel hendrerit Donec augue vitae Curabitur nec egestas amet Etiam metus ac Ut arcu sodales pellentesque augue interdum",
                                    "ValidFrom": "2021-09-10T22:37:44Z",
                                    "ValidTo": "2021-02-24T22:37:44Z"
                                },
                                "referenceNumber": "himenaeos orci",
                                "documentLineItemNumber": 37963,
                                "complementOfInformation": "egestas sit amet purus"
                            },
                            {
                                "sequenceNumber": 79598,
                                "type": {
                                    "Code": "eget",
                                    "Description": "Morbi metus adipiscing ante adipiscing mi est blandit diam Sed mattis ipsum blandit eget gravida nec adipiscing Cras eget feugiat rutrum sollicitudin a et dictum gravida nibh mauris tristique Sed ligula eu nibh egestas facilisis nunc feugiat erat",
                                    "ValidFrom": "2021-05-26T22:37:44Z",
                                    "ValidTo": "2020-10-16T22:37:44Z"
                                },
                                "referenceNumber": "mauris auctor condimentum sodales ac pharetra ac nibh",
                                "documentLineItemNumber": 64001,
                                "complementOfInformation": "rhoncus mi massa non Sed"
                            }
                        ],
                        "AdditionalReference": [
                            {
                                "sequenceNumber": 33504,
                                "type": {
                                    "Code": "eget",
                                    "Description": "vel ipsum amet sit sit Pellentesque pellentesque posuere vulputate ultricies Pellentesque mauris ligula velit lacus felis Etiam lorem ante vitae eget fringilla Nunc amet condimentum mollis ultricies placerat et condimentum facilisis fermentum ullamcorper",
                                    "ValidFrom": "2020-01-24T22:37:44Z",
                                    "ValidTo": "2021-04-22T22:37:44Z"
                                },
                                "referenceNumber": "dictum nunc non Suspendisse vulputate faucibus pharetra commodo eget"
                            },
                            {
                                "sequenceNumber": 40297,
                                "type": {
                                    "Code": "erat",
                                    "Description": "laoreet condimentum sem condimentum sem mi sodales turpis rutrum interdum eleifend Donec a diam justo lacus nulla elit aptent convallis tellus molestie aliquet facilisis posuere vitae imperdiet",
                                    "ValidFrom": "2021-03-13T22:37:44Z",
                                    "ValidTo": "2020-03-20T22:37:44Z"
                                },
                                "referenceNumber": "et lacus adipiscing tristique elementum Nulla quis Sed dignissim"
                            }
                        ],
                        "AdditionalInformation": [
                            {
                                "sequenceNumber": 71271,
                                "code": {
                                    "Code": "elit",
                                    "Description": "diam eleifend diam placerat tristique sem accumsan lorem nibh vestibulum metus a elit tempor dictum nec vitae tellus imperdiet augue erat Cras tortor elit accumsan amet tristique urna lacus hendrerit at eget nulla erat fermentum Integer metus amet",
                                    "ValidFrom": "2021-05-07T22:37:44Z",
                                    "ValidTo": "2021-05-28T22:37:44Z"
                                },
                                "text": "nec condimentum elementum ullamcorper sapien pretium mauris eu ligula in lacus turpis dui eros eget Cras adipiscing In egestas pellentesque elementum laoreet nec Aliquam pharetra"
                            },
                            {
                                "sequenceNumber": 95422,
                                "code": {
                                    "Code": "non",
                                    "Description": "vitae laoreet adipiscing sed ipsum mauris Nullam condimentum",
                                    "ValidFrom": "2020-07-11T22:37:44Z",
                                    "ValidTo": "2019-02-22T22:37:44Z"
                                },
                                "text": "Etiam neque vulputate Praesent Curabitur leo a ullamcorper amet vel sit vulputate Fusce sem euismod molestie amet Aenean enim augue metus Pellentesque amet metus eu In sed mollis aliquet amet odio dui risus nisi eleifend Sed id laoreet a gravida diam tellus et in quis egestas diam Sed pharetra porta Proin vestibulum at non pellentesque ut Ut dapibus lorem massa eleifend magna rhoncus blandit pulvinar nisi tincidunt orci dapibus lectus justo tristique laoreet sit Vivamus eget condimentum mi est eget sit pel"
                            }
                        ],
                        "TransportCharges": {
                            "methodOfPayment": {
                                "Code": "a",
                                "Description": "egestas quis himenaeos elementum Etiam vestibulum Donec molestie dictum pellentesque",
                                "ValidFrom": "2019-05-18T22:37:44Z",
                                "ValidTo": "2019-02-17T22:37:44Z"
                            }
                        }
                    },
                    {
                        "goodsItemNumber": 2,
                        "declarationGoodsItemNumber": 47025,
                        "declarationType": {
                            "Code": "erat",
                            "Description": "faucibus velit nec laoreet non sem felis egestas metus nulla Aliquam lacus Donec elementum ipsum interdum tellus tortor ante mauris eget nec mi nec Morbi Suspendisse tempor risus nec porttitor ornare Nunc tellus ante vitae sit velit amet augue a mauris laoreet vitae at elit nunc consectetur taciti adipiscing ut a vel quam eu tellus aliquam",
                            "ValidFrom": "2021-08-09T22:37:44Z",
                            "ValidTo": "2019-09-28T22:37:44Z"
                        },
                        "countryOfDispatch": {
                            "Code": "id",
                            "TccEntryDate": "2021-02-08",
                            "NctsEntryDate": "2019-01-19",
                            "GeoNomenclatureCode": 0.0022537909505208,
                            "CountryRegimeCode": "non",
                            "Description": "Lorem pulvinar ligula turpis suscipit condimentum at eu hendrerit magna per Praesent",
                            "ValidFrom": "2019-11-11T22:37:44Z",
                            "ValidTo": "2021-02-12T22:37:44Z"
                        },
                        "countryOfDestination": {
                            "Code": "at",
                            "TccEntryDate": "2021-04-22",
                            "NctsEntryDate": "2020-05-01",
                            "GeoNomenclatureCode": 2.72589725103504,
                            "CountryRegimeCode": "vel",
                            "Description": "nisl euismod ultricies Nunc quis quis tristique sit felis Suspendisse molestie eros suscipit pharetra non justo adipiscing tristique nisi condimentum nibh vel pulvinar mi tempor viverra urna",
                            "ValidFrom": "2021-02-12T22:37:44Z",
                            "ValidTo": "2021-07-22T22:37:44Z"
                        },
                        "referenceNumberUCR": "ultricies erat in adipiscing",
                        "itemPriceEUR": 0.000596667801773486,
                        "Consignee": {
                            "identificationNumber": "at tristique",
                            "name": "nisl",
                            "Address": {
                                "streetAndNumber": "ipsum metus gravida Vivamus eu non laoreet sem molestie",
                                "postcode": "mauris eros",
                                "city": "nec nisi rutrum vitae hendrerit",
                                "country": {
                                    "Code": "at",
                                    "Description": "nisl quis augue Donec consequat orci augue hendrerit pulvinar Sed ipsum vitae massa at Duis adipiscing vel adipiscing eget justo non facilisis Sed",
                                    "ValidFrom": "2020-05-27T22:37:44Z",
                                    "ValidTo": "2020-04-20T22:37:44Z"
                                }
                            }
                        },
                        "AdditionalSupplyChainActor": [
                            {
                                "sequenceNumber": 6698,
                                "role": {
                                    "Code": "ad",
                                    "Description": "nibh vel ac Pellentesque eros non tellus vehicula In mauris Etiam blandit sem vitae vitae facilisis risus elit varius Donec purus ac egestas diam eu Nullam non tortor sed arcu scelerisque at pharetra pharetra elit laoreet Duis arcu molestie ut odio tristique sem nulla neque lobortis at vel pellentesque massa Etiam elementum at Phasellus Donec Sed facilisis condimentum tellus amet sapien blandit massa",
                                    "ValidFrom": "2020-12-19T22:37:44Z",
                                    "ValidTo": "2021-09-14T22:37:44Z"
                                },
                                "identificationNumber": "augue lacinia Ph"
                            },
                            {
                                "sequenceNumber": 64099,
                                "role": {
                                    "Code": "vel",
                                    "Description": "pellentesque sapien ut a elit ac dui elit quam pellentesque leo convallis",
                                    "ValidFrom": "2019-03-05T22:37:44Z",
                                    "ValidTo": "2020-07-30T22:37:44Z"
                                },
                                "identificationNumber": "Proin Ut amet"
                            }
                        ],
                        "Commodity": {
                            "descriptionOfGoods": "metus ornare fringilla eros est varius Morbi diam elementum neque Quisque nibh elit sed massa nisi lorem tempor id odio ipsum eleifend urna dui tincidunt Phasellus feugiat aliquet metus facilisis gravida at suscipit leo molestie amet condimentum Praesent at semper facilisis Maecenas facilisis ut per ut ut erat nunc sit sem porta risus tristique quam id torquent posuere adipiscing vitae tellus ligula vitae felis vulputate Sed nibh ut dapibus mi",
                            "cusCode": {
                                "Code": "Phasellus",
                                "Description": "elementum eleifend Phasellus id Phasellus accumsan Cras felis ac Sed justo eget sed nibh eros metus non pellentesque ut imperdiet sodales vitae lorem lorem amet orci nibh congue varius nunc vel elit Curabitur lobortis eget interdum id porta taciti fringilla tempus nec arcu Vivamus id gravida rutrum eu augue",
                                "ValidFrom": "2020-01-03T22:37:44Z",
                                "ValidTo": "2020-03-20T22:37:44Z"
                            },
                            "CommodityCode": {
                                "harmonisedSystemSubHeadingCode": {
                                    "Code": "auctor",
                                    "Description": "rhoncus dictum Pellentesque sapien est",
                                    "ValidFrom": "2021-02-27T22:37:44Z",
                                    "ValidTo": "2020-03-11T22:37:44Z"
                                },
                                "combinedNomenclatureCode": "eu",
                                "nacionalCode": "id",
                                "exciseGoodsQuantity": 0.110718916221857
                            },
                            "DangerousGoods": [
                                {
                                    "sequenceNumber": 11959,
                                    "UNNumber": {
                                        "Code": "erat",
                                        "Description": "dictum vitae faucibus Pellentesque at pulvinar molestie faucibus Ut Etiam feugiat tellus sodales Nullam eget per in est blandit volutpat Sed",
                                        "ValidFrom": "2019-06-07T22:37:44Z",
                                        "ValidTo": "2019-04-23T22:37:44Z"
                                    }
                                },
                                {
                                    "sequenceNumber": 710,
                                    "UNNumber": {
                                        "Code": "Nunc",
                                        "Description": "",
                                        "ValidFrom": "2020-03-14T22:37:44Z",
                                        "ValidTo": "2020-08-13T22:37:44Z"
                                    }
                                }
                            ],
                            "GoodsMeasure": {
                                "grossMass": 771.752454234172,
                                "netMass": 0.000062979480280997,
                                "supplementaryUnits": 0.0000900977273425542
                            }
                        },
                        "Packaging": [
                            {
                                "sequenceNumber": 97567,
                                "typeOfPackages": {
                                    "Code": "in",
                                    "Description": "odio Vivamus Maecenas",
                                    "ValidFrom": "2021-05-13T22:37:44Z",
                                    "ValidTo": "2021-05-29T22:37:44Z"
                                },
                                "numberOfPackages": 18677436,
                                "shippingMarks": "sapien blandit ut nec sodales tortor amet purus risus gravida condimentum sed dui sapien lobortis hendrerit euismod facilisis ultricies pretium feugiat lacus commodo In nisl ac Praesent ut semper Nunc dui nec tortor odio vestibulum justo eget aliquet justo pulvinar condimentum molestie ut ut in nulla consectetur at Pellentesque turpis magna ornare facilisis ac Donec vulputate ut pellentesque ac egestas id condimentum Quisque risus rhoncus vitae a justo sed Donec nec non nunc pharetra Sed dolor eget"
                            },
                            {
                                "sequenceNumber": 58480,
                                "typeOfPackages": {
                                    "Code": "sem",
                                    "Description": "ac leo pulvinar vestibulum ut mi et adipiscing pretium congue diam posuere nostra mauris sagittis lacus commodo id eget facilisis non vel eget pellentesque nisl congue nec sed Etiam Sed Aliquam at Praesent tellus Curabitur pretium condimentum fermentum tortor mi ligula varius convallis urna egestas enim molestie",
                                    "ValidFrom": "2019-01-28T22:37:44Z",
                                    "ValidTo": "2020-05-02T22:37:44Z"
                                },
                                "numberOfPackages": 34688568,
                                "shippingMarks": "Maecenas amet non eget taciti"
                            }
                        ],
                        "PreviousDocument": [
                            {
                                "sequenceNumber": 89731,
                                "type": {
                                    "Code": "urna",
                                    "Description": "sed lacinia diam elit augue vehicula accumsan condimentum nisi magna metus ut nunc semper tincidunt leo dictum ipsum non ligula pellentesque vehicula Quisque arcu ultricies vulputate a Sed consequat sem quis non tristique ligula Donec magna sodales venenatis pretium imperdiet leo lectus auctor mauris ac dapibus nec sollicitudin mauris fermentum leo ultricies varius laoreet enim eu augue",
                                    "ValidFrom": "2019-11-16T22:37:44Z",
                                    "ValidTo": "2020-04-01T22:37:44Z"
                                },
                                "referenceNumber": "nec ac",
                                "goodsItemNumber": 63119,
                                "typeOfPackages": {
                                    "Code": "ac",
                                    "Description": "massa condimentum tempor suscipit consequat sollicitudin tellus et ligula ante Fusce ullamcorper mauris Praesent sagittis nec In In vitae lacinia erat Integer sed non lacus pulvinar blandit non In elit feugiat tincidunt ut dui nibh elit ipsum rhoncus dui Proin Maecenas",
                                    "ValidFrom": "2021-09-22T22:37:44Z",
                                    "ValidTo": "2020-08-10T22:37:44Z"
                                },
                                "numberOfPackages": 59406441,
                                "measurementUnitAndQualifier": {
                                    "Code": "nec",
                                    "Description": "facilisis Duis sagittis dui Donec facilisis nec leo sit sit Sed interdum velit erat sed erat ipsum lorem tortor vitae condimentum Nulla In ullamcorper sem tristique",
                                    "ValidFrom": "2020-03-12T22:37:44Z",
                                    "ValidTo": "2021-01-23T22:37:44Z"
                                },
                                "quantity": 6.87989825703199,
                                "complementOfInformation": "diam amet mauris ut nibh pretium"
                            },
                            {
                                "sequenceNumber": 84270,
                                "type": {
                                    "Code": "Duis",
                                    "Description": "Donec est elit Nunc condimentum dictum congue sit gravida vestibulum justo arcu in fermentum feugiat risus vehicula elementum quis vulputate euismod facilisis amet ullamcorper faucibus sapien orci sollicitudin adipiscing Suspendisse feugiat Maecenas semper vitae egestas quis justo adipiscing commodo Suspendisse Nunc accumsan tincidunt eu pharetra augue Nam Mauris Ut enim pellentesque sem Aliquam Ut metus fermentum eleifend Proin mauris Praesent Etiam Duis vitae eu metus pharetra",
                                    "ValidFrom": "2019-12-31T22:37:44Z",
                                    "ValidTo": "2019-01-11T22:37:44Z"
                                },
                                "referenceNumber": "leo diam tristique laoreet sapien sodales Ut tempus",
                                "goodsItemNumber": 45055,
                                "typeOfPackages": {
                                    "Code": "id",
                                    "Description": "justo leo ullamcorper tincidunt Donec a enim interdum ligula lacus pulvinar hendrerit urna condimentum in eleifend Pellentesque odio cursus Lorem eros risus nibh eu odio tortor",
                                    "ValidFrom": "2021-08-05T22:37:44Z",
                                    "ValidTo": "2019-03-16T22:37:44Z"
                                },
                                "numberOfPackages": 28016431,
                                "measurementUnitAndQualifier": {
                                    "Code": "nisl",
                                    "Description": "condimentum et lacus amet tortor feugiat sapien metus eros In convallis sem molestie placerat faucibus Vivamus ultricies porttitor commodo nibh dapibus",
                                    "ValidFrom": "2021-06-30T22:37:44Z",
                                    "ValidTo": "2019-03-04T22:37:44Z"
                                },
                                "quantity": 0.0426683585358171,
                                "complementOfInformation": "ipsum dapibus Quisque"
                            }
                        ],
                        "SupportingDocument": [
                            {
                                "sequenceNumber": 23351,
                                "type": {
                                    "Code": "nibh",
                                    "Description": "laoreet commodo pulvinar auctor Vivamus tortor amet mauris at Quisque Integer mauris tristique Suspendisse ultrices sit est Sed tempor odio hendrerit eu eget ac sollicitudin velit vitae sed risus tincidunt sit pretium tortor semper semper",
                                    "ValidFrom": "2021-03-28T22:37:44Z",
                                    "ValidTo": "2019-03-08T22:37:44Z"
                                },
                                "referenceNumber": "pellentesque consectetur accumsan Curabitur quam tempus ac tincidunt",
                                "documentLineItemNumber": 59448,
                                "complementOfInformation": "sed est velit nec pretium nunc"
                            },
                            {
                                "sequenceNumber": 42503,
                                "type": {
                                    "Code": "eget",
                                    "Description": "risus volutpat diam diam tempus orci eu Phasellus ut Nullam elit id ullamcorper vulputate Sed neque eleifend nec In ut adipiscing Pellentesque scelerisque mi Integer eget in sollicitudin Pellentesque non ultrices vestibulum eget odio semper vitae Donec in metus nec vitae",
                                    "ValidFrom": "2020-11-18T22:37:44Z",
                                    "ValidTo": "2020-02-16T22:37:44Z"
                                },
                                "referenceNumber": "vel quis",
                                "documentLineItemNumber": 19119,
                                "complementOfInformation": "urna ligula nibh elementum"
                            }
                        ],
                        "AdditionalReference": [
                            {
                                "sequenceNumber": 59073,
                                "type": {
                                    "Code": "In",
                                    "Description": "turpis egestas eu augue elementum neque litora Nullam sodales porttitor Sed tellus Curabitur sapien Etiam ultricies elit egestas nec Vivamus justo sit scelerisque mi Suspendisse sit dolor nisl mi risus ultricies commodo suscipit vel nec faucibus vel at Integer Nunc augue ipsum nisl scelerisque pretium",
                                    "ValidFrom": "2019-05-21T22:37:44Z",
                                    "ValidTo": "2021-04-10T22:37:44Z"
                                },
                                "referenceNumber": "viverra justo eros"
                            },
                            {
                                "sequenceNumber": 34848,
                                "type": {
                                    "Code": "id",
                                    "Description": "lacus erat mi id pretium molestie mi mauris ut augue fermentum Sed aliquam sem ut sed mauris Vestibulum molestie Quisque risus justo nunc pharetra tincidunt arcu dolor ligula eget feugiat fermentum Mauris eu a blandit pellentesque risus Cras adipiscing pharetra vel ullamcorper vel eget eu eget vehicula aliquet Vestibulum dui quis elit",
                                    "ValidFrom": "2019-02-26T22:37:44Z",
                                    "ValidTo": "2019-12-20T22:37:44Z"
                                },
                                "referenceNumber": "faucibus torquent Morbi accumsan metus consectetur Ut elit"
                            }
                        ],
                        "AdditionalInformation": [
                            {
                                "sequenceNumber": 49845,
                                "code": {
                                    "Code": "Duis",
                                    "Description": "Sed nec laoreet ac justo commodo elementum Sed nibh sed faucibus risus Phasellus Donec cursus cursus metus ligula quis Sed Cras Donec quis Phasellus Sed Vestibulum tincidunt pretium",
                                    "ValidFrom": "2020-08-23T22:37:44Z",
                                    "ValidTo": "2021-01-02T22:37:44Z"
                                },
                                "text": "ut porttitor pulvinar nec hendrerit magna tristique nec eros elit laoreet diam sit Nulla Cras risus nec justo sem gravida faucibus vitae nec facilisis"
                            },
                            {
                                "sequenceNumber": 57102,
                                "code": {
                                    "Code": "nunc",
                                    "Description": "sit pulvinar eleifend sit gravida ut auctor amet sagittis velit sollicitudin tincidunt ac dictum quam et dictum amet pharetra Integer commodo leo congue vitae enim sodales dapibus Aenean odio risus Cras amet tempus facilisis ut odio ornare In eros a eu nisl suscipit fermentum litora In lacus adipiscing ut aliquet nibh Curabitur tellus ac facilisis Integer tristique mauris nisi eu id lorem Donec elit sem",
                                    "ValidFrom": "2020-10-05T22:37:44Z",
                                    "ValidTo": "2020-09-06T22:37:44Z"
                                },
                                "text": "consectetur mauris odio dictum pulvinar ultricies amet Maecenas egestas ut torquent volutpat vestibulum convallis quis fermentum tellus Quisque laoreet diam elit ac adipiscing libero elit tincidunt consequat"
                            }
                        ],
                        "TransportCharges": {
                            "methodOfPayment": {
                                "Code": "a",
                                "Description": "eget elit Curabitur porta nulla fringilla fringilla",
                                "ValidFrom": "2019-06-10T22:37:44Z",
                                "ValidTo": "2021-03-13T22:37:44Z"
                            }
                        }
                    }
                ]
            },
            {
                "sequenceNumber": 2,
                "countryOfDispatch": {
                    "Code": "eu",
                    "TccEntryDate": "2021-01-30",
                    "NctsEntryDate": "2019-02-28",
                    "GeoNomenclatureCode": 0.00792363585341891,
                    "CountryRegimeCode": "sit",
                    "Description": "gravida",
                    "ValidFrom": "2021-08-05T22:37:44Z",
                    "ValidTo": "2020-10-22T22:37:44Z"
                },
                "grossMass": 495.269288539546,
                "referenceNumberUCR": "feugiat condimentum posuere amet S",
                "Consignor": {
                    "identificationNumber": "condimentum metus",
                    "name": "augue volutpat",
                    "Address": {
                        "streetAndNumber": "Etiam dapibus Integer",
                        "postcode": "molestie",
                        "city": "pulvinar elit enim lobortis",
                        "country": {
                            "Code": "In",
                            "Description": "est accumsan vel vel semper egestas metus a eleifend egestas in consequat tincidunt id amet sociosqu urna condimentum Nullam sed vel pulvinar nec turpis turpis vitae turpis metus fringilla Vivamus Praesent ornare diam eros eget nec at sed auctor egestas porttitor eu fringilla Suspendisse ac inceptos eget nec sit hendrerit Donec Quisque ut dapibus sit erat molestie fringilla suscipit",
                            "ValidFrom": "2019-12-29T22:37:44Z",
                            "ValidTo": "2019-04-11T22:37:44Z"
                        }
                    },
                    "ContactPerson": {
                        "name": "torquent Sed dui diam sit tempus nibh porta vel semper Vivamus gravida",
                        "phoneNumber": "eros vestibulum",
                        "eMailAddress": "nisl metus ipsum feugiat vel adipiscing dapibus interdum leo ultricies"
                    }
                },
                "Consignee": {
                    "identificationNumber": "condimentum Donec",
                    "name": "a Curabitur nisi",
                    "Address": {
                        "streetAndNumber": "accumsan sem amet vitae",
                        "postcode": "diam diam",
                        "city": "tellus",
                        "country": {
                            "Code": "id",
                            "Description": "mollis ipsum quis tempus nulla vitae ac sagittis in ipsum Curabitur dictum volutpat placerat pharetra eget vestibulum lacus gravida nec adipiscing in Morbi lectus laoreet vel consequat dolor sapien ultricies hendrerit nibh quis facilisis tempor pellentesque quis Sed felis tortor vel dictum ultricies nibh tellus scelerisque adipiscing leo feugiat Cras lectus massa et varius eget Praesent felis Curabitur Phasellus condimentum lorem a adipiscing diam pharetra adipiscing Nam viverra justo",
                            "ValidFrom": "2020-12-20T22:37:44Z",
                            "ValidTo": "2020-01-14T22:37:44Z"
                        }
                    }
                },
                "AdditionalSupplyChainActor": [
                    {
                        "sequenceNumber": 4776,
                        "role": {
                            "Code": "ac",
                            "Description": "sit egestas sit Quisque et adipiscing nunc vitae eu nec convallis ipsum potenti sit consectetur ac in justo adipiscing vehicula tellus odio sollicitudin",
                            "ValidFrom": "2019-08-10T22:37:44Z",
                            "ValidTo": "2021-01-04T22:37:44Z"
                        },
                        "identificationNumber": "eleifend pellent"
                    },
                    {
                        "sequenceNumber": 42508,
                        "role": {
                            "Code": "non",
                            "Description": "amet lorem ut viverra Etiam volutpat ante Praesent Pellentesque ac pharetra congue est Proin consequat blandit Vivamus porttitor vel",
                            "ValidFrom": "2019-01-08T22:37:44Z",
                            "ValidTo": "2020-09-11T22:37:44Z"
                        },
                        "identificationNumber": "nunc massa Sed"
                    }
                ],
                "DepartureTransportMeans": [
                    {
                        "sequenceNumber": 34613,
                        "typeOfIdentification": {
                            "Code": 0.0205926940406639,
                            "Description": "non turpis tempor nec per Nullam porta sem eros rhoncus sed adipiscing Sed sed sit Sed congue lobortis Cras Mauris accumsan vehicula aliquam",
                            "ValidFrom": "2020-11-08T22:37:44Z",
                            "ValidTo": "2020-10-12T22:37:44Z"
                        },
                        "identificationNumber": "Etiam Duis convallis ligula Vestib",
                        "nationality": {
                            "Code": "ac",
                            "TccEntryDate": "2021-06-21",
                            "NctsEntryDate": "2020-07-13",
                            "GeoNomenclatureCode": 0.204420111702951,
                            "CountryRegimeCode": "sit",
                            "Description": "in adipiscing",
                            "ValidFrom": "2020-04-16T22:37:44Z",
                            "ValidTo": "2020-01-21T22:37:44Z"
                        }
                    },
                    {
                        "sequenceNumber": 42447,
                        "typeOfIdentification": {
                            "Code": 0.0907556869977879,
                            "Description": "suscipit at Duis dui eu odio gravida amet quis rhoncus amet molestie placerat Mauris justo rutrum eget vestibulum vestibulum risus mollis amet a condimentum Vestibulum posuere condimentum nostra velit massa hendrerit conubia ut ipsum Fusce Suspendisse Sed ac commodo hendrerit sodales accumsan id Nunc torquent ultricies metus at dui gravida nibh ut id ullamcorper tortor feugiat Mauris euismod nibh tincidunt lacus tincidunt",
                            "ValidFrom": "2020-10-20T22:37:44Z",
                            "ValidTo": "2019-03-31T22:37:44Z"
                        },
                        "identificationNumber": "placerat tempus vel a est non",
                        "nationality": {
                            "Code": "et",
                            "TccEntryDate": "2019-01-29",
                            "NctsEntryDate": "2019-01-30",
                            "GeoNomenclatureCode": 18.1964174463397,
                            "CountryRegimeCode": "sem",
                            "Description": "Duis facilisis sed Pellentesque ut dapibus pharetra adipiscing diam tempor eros egestas rhoncus lobortis et mi vehicula",
                            "ValidFrom": "2019-05-08T22:37:44Z",
                            "ValidTo": "2020-04-02T22:37:44Z"
                        }
                    }
                ],
                "PreviousDocument": [
                    {
                        "sequenceNumber": 30986,
                        "type": {
                            "Code": "amet",
                            "Description": "bibendum posuere orci volutpat vel vestibulum sit aliquet sem consequat rutrum sem Nunc nunc ligula Curabitur est eget vel mollis ultrices diam Vivamus tincidunt vehicula eu Praesent tincidunt laoreet pulvinar Vivamus tempor sed Curabitur mollis fermentum eget turpis Sed ut Etiam vel lectus faucibus feugiat enim non pellentesque sem vestibulum ultricies enim ac placerat erat velit Curabitur hendrerit dui eros odio ut semper vel id tempus id Phasellus pellentesque odio in nibh sit sed id",
                            "ValidFrom": "2019-03-17T22:37:44Z",
                            "ValidTo": "2019-07-01T22:37:44Z"
                        },
                        "referenceNumber": "massa vestibulum Suspendisse commodo risus commodo"
                    },
                    {
                        "sequenceNumber": 39162,
                        "type": {
                            "Code": "quam",
                            "Description": "at vestibulum Nulla est porta risus mauris pharetra tortor fringilla ipsum accumsan augue tristique",
                            "ValidFrom": "2020-05-25T22:37:44Z",
                            "ValidTo": "2020-08-18T22:37:44Z"
                        },
                        "referenceNumber": "ultricies gravida tincidunt non gravida nec nec non eros est odio"
                    }
                ],
                "TransportDocument": [
                    {
                        "sequenceNumber": 34478,
                        "type": {
                            "Code": "amet",
                            "Description": "sodales pretium pulvinar Sed a mi eleifend consequat blandit elementum id ante sit In ut est mi nibh sapien sit pharetra Suspendisse mauris ullamcorper porttitor Ut facilisis laoreet molestie feugiat",
                            "ValidFrom": "2019-09-29T22:37:44Z",
                            "ValidTo": "2021-07-12T22:37:44Z"
                        },
                        "referenceNumber": "tempor"
                    },
                    {
                        "sequenceNumber": 61186,
                        "type": {
                            "Code": "quam",
                            "Description": "erat tempor Donec blandit lectus tellus Etiam id nulla vitae Maecenas lacus vel facilisis nulla nisi nibh sapien pretium lacus sed eleifend tellus elit augue vestibulum Ut ornare quis in sit adipiscing augue mi eget elementum at sed molestie Cras ligula turpis vitae molestie auctor quis ut porttitor risus facilisis lacus tristique Ut congue nisi laoreet ac semper Praesent laoreet aptent pulvinar et a diam suscipit eleifend aliquam non ut Pellentesque non vestibulum sapien convallis leo vel tincidunt",
                            "ValidFrom": "2019-11-05T22:37:44Z",
                            "ValidTo": "2021-04-30T22:37:44Z"
                        },
                        "referenceNumber": "est congue id mi Cras vestibulum est congue interdum est"
                    }
                ],
                "AdditionalReference": [
                    {
                        "sequenceNumber": 20342,
                        "type": {
                            "Code": "Nunc",
                            "Description": "placerat non justo amet Donec aliquam vel facilisis hendrerit justo id nulla amet quam Proin placerat porta Proin vel Phasellus elit massa vehicula Vivamus nibh Vivamus himenaeos Praesent facilisis facilisis tristique urna pretium vitae Nullam Sed Sed vestibulum Nam est massa nec vitae mauris sit feugiat nostra id ultricies arcu rhoncus faucibus vulputate vel felis amet quis pharetra Pellentesque amet massa condimentum",
                            "ValidFrom": "2021-01-15T22:37:44Z",
                            "ValidTo": "2020-05-02T22:37:44Z"
                        },
                        "referenceNumber": "a urna eget"
                    },
                    {
                        "sequenceNumber": 98132,
                        "type": {
                            "Code": "elit",
                            "Description": "dapibus mollis volutpat Praesent odio tempor in urna pharetra eu Praesent lacus accumsan",
                            "ValidFrom": "2020-05-02T22:37:44Z",
                            "ValidTo": "2021-02-19T22:37:44Z"
                        },
                        "referenceNumber": "tempus augue in a ac mi lacus"
                    }
                ],
                "TransportCharges": {
                    "methodOfPayment": {
                        "Code": "a",
                        "Description": "vestibulum id adipiscing ut condimentum pretium Donec mauris est porta Proin nisl nibh tempus rhoncus Nulla interdum hendrerit sodales interdum eu semper Lorem amet sapien eget imperdiet sed Quisque Etiam Donec vitae nulla blandit amet faucibus amet amet ligula Nam vestibulum adipiscing Praesent convallis amet id scelerisque dolor ullamcorper iaculis rhoncus nec nec gravida adipiscing accumsan id quis sem pulvinar ligula non eu Donec adipiscing risus venenatis Morbi ipsum cursus nulla",
                        "ValidFrom": "2021-02-22T22:37:44Z",
                        "ValidTo": "2019-05-14T22:37:44Z"
                    }
                },
                "ConsignmentItem": [
                    {
                        "goodsItemNumber": 1,
                        "declarationGoodsItemNumber": 74119,
                        "declarationType": {
                            "Code": "eros",
                            "Description": "cursus sollicitudin vel odio diam turpis amet rhoncus quam dictum semper in dictum consectetur blandit ullamcorper eu vel gravida varius molestie in Sed Morbi metus egestas Curabitur",
                            "ValidFrom": "2021-06-30T22:37:44Z",
                            "ValidTo": "2021-01-31T22:37:44Z"
                        },
                        "countryOfDispatch": {
                            "Code": "ac",
                            "TccEntryDate": "2020-05-31",
                            "NctsEntryDate": "2019-09-30",
                            "GeoNomenclatureCode": 0.000108547146016987,
                            "CountryRegimeCode": "vel",
                            "Description": "urna Morbi nulla vel sodales vehicula ut vehicula adipiscing interdum a sed nisi tincidunt sapien vitae facilisis elit quam erat cursus ac pellentesque Mauris Donec condimentum condimentum accumsan ligula",
                            "ValidFrom": "2021-03-30T22:37:44Z",
                            "ValidTo": "2019-04-28T22:37:44Z"
                        },
                        "countryOfDestination": {
                            "Code": "ut",
                            "TccEntryDate": "2019-03-27",
                            "NctsEntryDate": "2020-06-05",
                            "GeoNomenclatureCode": 0.0000719033491201249,
                            "CountryRegimeCode": "sed",
                            "Description": "tellus adipiscing pharetra nibh semper Suspendisse Cras mi urna sagittis at dui velit mi leo tempor mi a molestie amet tristique eleifend nisl cursus volutpat elit ut cursus Sed venenatis arcu Pellentesque dapibus posuere eleifend Aenean sed sem eu feugiat diam Duis augue hendrerit In tempor enim tristique Lorem eget sodales eget euismod condimentum justo volutpat commodo non blandit Vivamus Nulla sit dignissim Nunc justo In sapien Sed Etiam condimentum accumsan",
                            "ValidFrom": "2020-10-30T22:37:44Z",
                            "ValidTo": "2020-11-04T22:37:44Z"
                        },
                        "referenceNumberUCR": "Etiam",
                        "itemPriceEUR": 79.8129733092212,
                        "Consignee": {
                            "identificationNumber": "elit",
                            "name": "fringilla consequat vel turpis tempus fringilla diam adipiscing",
                            "Address": {
                                "streetAndNumber": "odio semper vestibulum non amet tristique nec felis egestas",
                                "postcode": "ad lobortis ac a",
                                "city": "Sed elit sit ut",
                                "country": {
                                    "Code": "ac",
                                    "Description": "ipsum augue vestibulum elit Phasellus sit quis Nullam justo Nunc augue pellentesque eget ac condimentum vitae torquent non ipsum risus Nullam purus tellus",
                                    "ValidFrom": "2019-06-05T22:37:44Z",
                                    "ValidTo": "2021-01-23T22:37:44Z"
                                }
                            }
                        },
                        "AdditionalSupplyChainActor": [
                            {
                                "sequenceNumber": 16632,
                                "role": {
                                    "Code": "vel",
                                    "Description": "elementum Nullam ut consequat condimentum Sed amet hendrerit orci pellentesque porta quis sit consequat faucibus sapien vel Pellentesque dictum id Vivamus Ut purus Pellentesque a amet est vestibulum",
                                    "ValidFrom": "2021-04-09T22:37:44Z",
                                    "ValidTo": "2020-02-25T22:37:44Z"
                                },
                                "identificationNumber": "non Suspendisse"
                            },
                            {
                                "sequenceNumber": 35305,
                                "role": {
                                    "Code": "sit",
                                    "Description": "risus ultricies tincidunt Donec Curabitur sapien pharetra sed consequat vel augue congue lectus In vitae tellus litora tortor urna felis Sed ligula litora Praesent sapien sagittis eleifend pellentesque Praesent justo amet Duis vestibulum sit laoreet amet sapien est sapien mauris in leo consequat molestie in Pellentesque ac nisi sed enim pulvinar a tempus ornare tortor Donec in tristique facilisis vitae aliquam",
                                    "ValidFrom": "2020-12-29T22:37:44Z",
                                    "ValidTo": "2020-06-28T22:37:44Z"
                                },
                                "identificationNumber": "accumsan"
                            }
                        ],
                        "Commodity": {
                            "descriptionOfGoods": "mauris Sed id Vivamus quam quam adipiscing risus eros feugiat imperdiet quam quis Quisque ut posuere ornare condimentum neque Pellentesque ut condimentum nisi sapien consequat per semper rutrum faucibus rutrum ligula ipsum facilisis nulla Integer Curabitur ut sem et Sed molestie mauris Praesent amet eu vitae sit metus tellus risus tortor Phasellus magna eros Nulla sapien Vestibulum",
                            "cusCode": {
                                "Code": "facilisis",
                                "Description": "ultricies nec rhoncus eget Class blandit dictum sapien lorem vel facilisis erat accumsan molestie id egestas Donec ullamcorper vel augue urna sociosqu condimentum nec Vivamus blandit et rhoncus vestibulum odio sit ligula dictum id molestie pharetra Nunc vel erat feugiat nec euismod sem euismod pellentesque massa at a vestibulum dictum sapien sagittis et Maecenas lorem tortor id nisi sed tempus gravida nulla orci condimentum",
                                "ValidFrom": "2020-02-02T22:37:44Z",
                                "ValidTo": "2019-09-09T22:37:44Z"
                            },
                            "CommodityCode": {
                                "harmonisedSystemSubHeadingCode": {
                                    "Code": "nostra",
                                    "Description": "lacus elementum in vulputate non consequat Praesent adipiscing condimentum Donec risus ipsum consectetur faucibus porta Lorem hendrerit egestas bibendum himenaeos eget felis ultricies augue vestibulum non Proin",
                                    "ValidFrom": "2019-10-31T22:37:44Z",
                                    "ValidTo": "2020-11-30T22:37:44Z"
                                },
                                "combinedNomenclatureCode": "In",
                                "nacionalCode": "id",
                                "exciseGoodsQuantity": 0.0493990642248649
                            },
                            "DangerousGoods": [
                                {
                                    "sequenceNumber": 94205,
                                    "UNNumber": {
                                        "Code": "orci",
                                        "Description": "pellentesque interdum pulvinar cursus congue",
                                        "ValidFrom": "2019-04-04T22:37:44Z",
                                        "ValidTo": "2019-06-17T22:37:44Z"
                                    }
                                },
                                {
                                    "sequenceNumber": 58152,
                                    "UNNumber": {
                                        "Code": "amet",
                                        "Description": "facilisis volutpat venenatis nec vestibulum ullamcorper congue risus velit",
                                        "ValidFrom": "2019-04-11T22:37:44Z",
                                        "ValidTo": "2021-07-01T22:37:44Z"
                                    }
                                }
                            ],
                            "GoodsMeasure": {
                                "grossMass": 0.40095513099849,
                                "netMass": 244.421469161483,
                                "supplementaryUnits": 3.13769145549168
                            }
                        },
                        "Packaging": [
                            {
                                "sequenceNumber": 65689,
                                "typeOfPackages": {
                                    "Code": "nec",
                                    "Description": "vel commodo adipiscing suscipit Aliquam Curabitur mollis",
                                    "ValidFrom": "2020-01-17T22:37:44Z",
                                    "ValidTo": "2019-01-26T22:37:44Z"
                                },
                                "numberOfPackages": 79156285,
                                "shippingMarks": "interdum Cras odio nostra Phasellus viverra ultricies eget et Nulla Quisque justo Curabitur pellentesque non Etiam nibh feugiat magna Curabitur sem egestas pretium ipsum felis egestas tincidunt"
                            },
                            {
                                "sequenceNumber": 65999,
                                "typeOfPackages": {
                                    "Code": "non",
                                    "Description": "posuere imperdiet odio cursus amet lobortis Cras cursus Vivamus orci dictum eu",
                                    "ValidFrom": "2019-03-26T22:37:44Z",
                                    "ValidTo": "2021-05-16T22:37:44Z"
                                },
                                "numberOfPackages": 2960431,
                                "shippingMarks": "In semper vitae tristique amet dapibus dictum scelerisque per leo tortor sem turpis pulvinar ac Donec Suspendisse mauris placerat amet nisi congue eget vitae risus gravida eget Suspendisse sed gravida ut odio vel ac"
                            }
                        ],
                        "PreviousDocument": [
                            {
                                "sequenceNumber": 51256,
                                "type": {
                                    "Code": "Nunc",
                                    "Description": "non vitae eu Donec ac ac congue mauris Suspendisse congue Duis justo",
                                    "ValidFrom": "2020-01-11T22:37:44Z",
                                    "ValidTo": "2021-05-30T22:37:44Z"
                                },
                                "referenceNumber": "pellentesque commodo",
                                "goodsItemNumber": 89594,
                                "typeOfPackages": {
                                    "Code": "et",
                                    "Description": "Etiam convallis adipiscing vel elementum condimentum massa hendrerit",
                                    "ValidFrom": "2020-01-11T22:37:44Z",
                                    "ValidTo": "2021-08-26T22:37:44Z"
                                },
                                "numberOfPackages": 80425995,
                                "measurementUnitAndQualifier": {
                                    "Code": "urna",
                                    "Description": "nostra Donec vulputate Etiam bibendum Ut elementum sit aliquam Phasellus sit dolor libero Cras magna nec nec gravida Ut amet cursus enim ad adipiscing",
                                    "ValidFrom": "2019-11-12T22:37:44Z",
                                    "ValidTo": "2020-01-16T22:37:44Z"
                                },
                                "quantity": 0.000658223512423329,
                                "complementOfInformation": ""
                            },
                            {
                                "sequenceNumber": 66693,
                                "type": {
                                    "Code": "eget",
                                    "Description": "per quis metus bibendum vitae quis mollis pharetra porta Sed felis odio dolor metus pharetra Pellentesque odio velit metus Donec",
                                    "ValidFrom": "2020-10-25T22:37:44Z",
                                    "ValidTo": "2019-10-26T22:37:44Z"
                                },
                                "referenceNumber": "nibh quam elementum cursus sapien vel sem vehicula elementum",
                                "goodsItemNumber": 81278,
                                "typeOfPackages": {
                                    "Code": "id",
                                    "Description": "porttitor dui eros metus vestibulum amet ullamcorper lacus Duis eget quam quis dictum venenatis tristique at nec sapien",
                                    "ValidFrom": "2021-07-28T22:37:44Z",
                                    "ValidTo": "2020-08-16T22:37:44Z"
                                },
                                "numberOfPackages": 14426514,
                                "measurementUnitAndQualifier": {
                                    "Code": "nibh",
                                    "Description": "fermentum Cras faucibus commodo gravida sodales diam ac amet Donec risus ac convallis velit a conubia quam nec ultricies sodales scelerisque Ut pulvinar suscipit risus pretium commodo quam est nibh In Nunc tortor sit enim sem nibh pulvinar dictum Aliquam pretium elit Sed nisl vel laoreet risus accumsan Nulla quam sed adipiscing nisl conubia Aenean amet nec ipsum odio elementum aliquet tincidunt consequat sapien tellus ac vel conubia vitae pretium accumsan ut sapien neque massa quis sem eu eget tortor",
                                    "ValidFrom": "2019-12-31T22:37:44Z",
                                    "ValidTo": "2021-08-26T22:37:44Z"
                                },
                                "quantity": 0.532004343593495,
                                "complementOfInformation": "semper ante in pulvinar"
                            }
                        ],
                        "SupportingDocument": [
                            {
                                "sequenceNumber": 65506,
                                "type": {
                                    "Code": "nisi",
                                    "Description": "erat et id vehicula nisi in vel Maecenas pharetra sed justo vulputate vel et vestibulum elit laoreet nec porttitor condimentum quis ac urna varius suscipit Pellentesque varius Vivamus a pulvinar vitae Etiam Vestibulum eget urna erat Quisque",
                                    "ValidFrom": "2021-02-20T22:37:44Z",
                                    "ValidTo": "2019-02-12T22:37:44Z"
                                },
                                "referenceNumber": "nec lectus pharetra augue molestie",
                                "documentLineItemNumber": 67998,
                                "complementOfInformation": "urna"
                            },
                            {
                                "sequenceNumber": 83387,
                                "type": {
                                    "Code": "quis",
                                    "Description": "In sapien consequat velit augue sed tellus quis eu laoreet erat quis accumsan fermentum sit feugiat Mauris accumsan magna quam dictum posuere eget volutpat Curabitur sagittis Sed arcu blandit tempus condimentum dapibus",
                                    "ValidFrom": "2021-05-24T22:37:44Z",
                                    "ValidTo": "2020-07-01T22:37:44Z"
                                },
                                "referenceNumber": "in Mauris",
                                "documentLineItemNumber": 17674,
                                "complementOfInformation": "eget"
                            }
                        ],
                        "AdditionalReference": [
                            {
                                "sequenceNumber": 96818,
                                "type": {
                                    "Code": "sit",
                                    "Description": "sem ornare Pellentesque Quisque Vestibulum gravida mauris accumsan Sed aliquet sit sit pulvinar porta pretium erat vestibulum facilisis hendrerit suscipit tempor vestibulum hendrerit Vivamus Cras magna vestibulum Class",
                                    "ValidFrom": "2019-06-09T22:37:44Z",
                                    "ValidTo": "2019-12-30T22:37:44Z"
                                },
                                "referenceNumber": "porttitor"
                            },
                            {
                                "sequenceNumber": 8101,
                                "type": {
                                    "Code": "vel",
                                    "Description": "nec eleifend mollis gravida et",
                                    "ValidFrom": "2019-06-11T22:37:44Z",
                                    "ValidTo": "2019-07-04T22:37:44Z"
                                },
                                "referenceNumber": "commodo In Ut in pellentesque nec quis ante velit commodo"
                            }
                        ],
                        "AdditionalInformation": [
                            {
                                "sequenceNumber": 50704,
                                "code": {
                                    "Code": "erat",
                                    "Description": "justo lobortis tempor vel justo nec in volutpat quam in posuere",
                                    "ValidFrom": "2019-10-18T22:37:44Z",
                                    "ValidTo": "2019-05-06T22:37:44Z"
                                },
                                "text": "justo suscipit tempus Class ac pellentesque vulputate tincidunt diam nisl vel vitae dictum Donec eget commodo vitae laoreet elit turpis risus nec nec ligula Donec nostra vitae sit sem dapibus nec ac porta viverra ultricies pharetra sem viverra vehicula neque fringilla euismod venenatis"
                            },
                            {
                                "sequenceNumber": 83504,
                                "code": {
                                    "Code": "Proin",
                                    "Description": "consectetur adipiscing Curabitur id eros eget Duis ultricies Integer",
                                    "ValidFrom": "2021-01-31T22:37:44Z",
                                    "ValidTo": "2021-04-04T22:37:44Z"
                                },
                                "text": "lobortis pretium non sodales vel vulputate in orci Curabitur id in himenaeos sem ut turpis sit condimentum sodales Praesent leo ornare tortor ad eget lacus Integer velit facilisis Quisque vulputate erat ante odio pulvinar id Sed Praesent augue sit sociosqu amet Aliquam consequat lectus sem quis himenaeos elit commodo viverra ac semper diam lorem ac porttitor Phasellus lobortis suscipit augue vel elit eget"
                            }
                        ],
                        "TransportCharges": {
                            "methodOfPayment": {
                                "Code": "a",
                                "Description": "pulvinar elit ipsum In consequat ac sapien vel non volutpat lacus tortor odio gravida nulla libero odio massa mauris odio pharetra ut ligula Vivamus eget purus ac at pretium faucibus vehicula mauris elit amet non Phasellus eget eget",
                                "ValidFrom": "2019-12-13T22:37:44Z",
                                "ValidTo": "2021-02-24T22:37:44Z"
                            }
                        }
                    },
                    {
                        "goodsItemNumber": 2,
                        "declarationGoodsItemNumber": 86933,
                        "declarationType": {
                            "Code": "elit",
                            "Description": "felis Cras eros accumsan vel velit tellus Pellentesque Pellentesque ipsum tempus dignissim a dapibus volutpat ante consectetur ut Lorem eget adipiscing eu ipsum mi justo aliquet accumsan sociosqu amet eu fermentum massa Phasellus sed molestie nisi pretium vel taciti lectus placerat iaculis Nunc sapien Nullam non justo interdum amet",
                            "ValidFrom": "2020-04-01T22:37:44Z",
                            "ValidTo": "2020-04-02T22:37:44Z"
                        },
                        "countryOfDispatch": {
                            "Code": "eu",
                            "TccEntryDate": "2021-05-24",
                            "NctsEntryDate": "2019-11-30",
                            "GeoNomenclatureCode": 0.0872624459151469,
                            "CountryRegimeCode": "vel",
                            "Description": "sem amet",
                            "ValidFrom": "2019-08-06T22:37:44Z",
                            "ValidTo": "2021-06-20T22:37:44Z"
                        },
                        "countryOfDestination": {
                            "Code": "id",
                            "TccEntryDate": "2020-06-14",
                            "NctsEntryDate": "2019-05-03",
                            "GeoNomenclatureCode": 0.0829900387595361,
                            "CountryRegimeCode": "per",
                            "Description": "Donec in amet feugiat posuere pulvinar magna nisi mauris ut eget velit quis Etiam sit Aliquam Morbi massa amet quis posuere aliquet hendrerit nibh Donec gravida elit Curabitur molestie Curabitur mauris erat nec eros erat diam pretium tincidunt tristique elementum Vivamus augue sem a at interdum accumsan semper ultrices egestas nec orci mauris mauris vitae in quam sagittis fermentum",
                            "ValidFrom": "2021-06-29T22:37:44Z",
                            "ValidTo": "2019-06-19T22:37:44Z"
                        },
                        "referenceNumberUCR": "nec nec vulputate",
                        "itemPriceEUR": 0.000209125867676514,
                        "Consignee": {
                            "identificationNumber": "amet consequat",
                            "name": "dui lobortis sapien",
                            "Address": {
                                "streetAndNumber": "Donec vel justo faucibus vel Quisque quam metus gravida orci",
                                "postcode": "ut vestibulum",
                                "city": "rutrum sit felis dictum gravida ma",
                                "country": {
                                    "Code": "ac",
                                    "Description": "sodales Nullam Donec faucibus ad faucibus dapibus ad amet nec vitae imperdiet condimentum suscipit fermentum nec urna pellentesque Curabitur pretium adipiscing vel mattis eleifend tortor urna sit elit mi lacus non Aenean ullamcorper metus commodo eget hendrerit nec tellus sit massa rhoncus massa Nullam laoreet nibh lacus imperdiet tellus leo congue at eros auctor porttitor Proin ligula felis ac leo eleifend lacinia eu sapien Sed Mauris consectetur",
                                    "ValidFrom": "2020-09-12T22:37:44Z",
                                    "ValidTo": "2021-08-22T22:37:44Z"
                                }
                            }
                        },
                        "AdditionalSupplyChainActor": [
                            {
                                "sequenceNumber": 46440,
                                "role": {
                                    "Code": "Sed",
                                    "Description": "velit accumsan justo elit elit quam vel venenatis rhoncus Donec lobortis amet ac adipiscing felis gravida massa urna dictum",
                                    "ValidFrom": "2021-01-19T22:37:44Z",
                                    "ValidTo": "2020-11-17T22:37:44Z"
                                },
                                "identificationNumber": ""
                            },
                            {
                                "sequenceNumber": 84657,
                                "role": {
                                    "Code": "non",
                                    "Description": "sollicitudin Mauris eros sodales erat odio molestie eget sollicitudin risus velit sagittis Nunc vestibulum accumsan eros eros vehicula Cras tristique vel ut tristique rhoncus ut ornare dapibus ut elementum Sed turpis torquent augue risus sed tortor accumsan Pellentesque dictum non Fusce erat Nulla pellentesque ac feugiat metus laoreet urna semper justo ultricies interdum Nullam feugiat nec adipiscing ut eleifend ligula tempus vehicula amet nisi lacus adipiscing vestibulum quis volutpat sollicitudin",
                                    "ValidFrom": "2021-07-14T22:37:44Z",
                                    "ValidTo": "2021-01-22T22:37:44Z"
                                },
                                "identificationNumber": "conubia"
                            }
                        ],
                        "Commodity": {
                            "descriptionOfGoods": "laoreet a pellentesque risus Integer nulla dapibus Nunc nec porttitor risus sit eros et eros taciti nunc varius Vestibulum Nunc sed Nulla posuere id risus id placerat a leo at ultrices non quis sollicitudin non porta Sed sit nibh Lorem condimentum Quisque at Duis leo Morbi",
                            "cusCode": {
                                "Code": "fringilla",
                                "Description": "Etiam egestas est vulputate ultricies et felis feugiat vitae sagittis sit in Praesent ut ultricies Etiam non Mauris accumsan mauris Nulla mi vehicula Praesent fringilla non leo leo vitae Cras Aenean consequat viverra Etiam sollicitudin",
                                "ValidFrom": "2019-08-02T22:37:44Z",
                                "ValidTo": "2021-01-21T22:37:44Z"
                            },
                            "CommodityCode": {
                                "harmonisedSystemSubHeadingCode": {
                                    "Code": "tellus",
                                    "Description": "vel amet tempor ullamcorper vulputate facilisis fringilla turpis amet dui eu tempor lectus consectetur nec non Nunc non molestie erat accumsan",
                                    "ValidFrom": "2021-06-23T22:37:44Z",
                                    "ValidTo": "2019-10-02T22:37:44Z"
                                },
                                "combinedNomenclatureCode": "et",
                                "nacionalCode": "ac",
                                "exciseGoodsQuantity": 0.632782114964343
                            },
                            "DangerousGoods": [
                                {
                                    "sequenceNumber": 5522,
                                    "UNNumber": {
                                        "Code": "nibh",
                                        "Description": "velit augue Maecenas posuere condimentum ligula nibh justo aptent Lorem cursus tellus est nec elementum id dictum dolor elit felis In odio vehicula vel sollicitudin nec amet suscipit pharetra ut leo nisl at Donec ut Cras condimentum Integer accumsan eget tempus amet Praesent erat potenti sed urna odio taciti faucibus blandit magna vehicula metus ullamcorper Sed hendrerit tincidunt",
                                        "ValidFrom": "2021-07-27T22:37:44Z",
                                        "ValidTo": "2019-07-13T22:37:44Z"
                                    }
                                },
                                {
                                    "sequenceNumber": 18497,
                                    "UNNumber": {
                                        "Code": "nibh",
                                        "Description": "nunc rhoncus tincidunt erat",
                                        "ValidFrom": "2020-01-07T22:37:44Z",
                                        "ValidTo": "2020-06-02T22:37:44Z"
                                    }
                                }
                            ],
                            "GoodsMeasure": {
                                "grossMass": 0.0459763164380455,
                                "netMass": 60.3390944471299,
                                "supplementaryUnits": 0.0268601579716709
                            }
                        },
                        "Packaging": [
                            {
                                "sequenceNumber": 24583,
                                "typeOfPackages": {
                                    "Code": "a",
                                    "Description": "pulvinar Duis rutrum pharetra ac vulputate vitae condimentum pharetra metus Maecenas neque fermentum conubia sapien tincidunt sem accumsan",
                                    "ValidFrom": "2020-09-12T22:37:44Z",
                                    "ValidTo": "2019-07-03T22:37:44Z"
                                },
                                "numberOfPackages": 26094175,
                                "shippingMarks": "elit Ut pretium enim sit amet Curabitur a Etiam sem venenatis orci metus risus sit scelerisque torquent tellus fermentum non accumsan torquent Vivamus vestibulum non Donec rhoncus mauris sem pharetra Suspendisse bibendum elit turpis eu Duis sit egestas lobortis auctor tristique semper gravida nibh sed vulputate commodo mauris fermentum Mauris fermentum diam Proin pharetra eu porta ipsum nec ultrices commodo justo eros Integer a ante leo tellus"
                            },
                            {
                                "sequenceNumber": 11274,
                                "typeOfPackages": {
                                    "Code": "in",
                                    "Description": "id vel eget Quisque nisl ut convallis id est bibendum volutpat Aenean quam sapien quam Cras mauris urna pellentesque accumsan Donec Sed est egestas Praesent lectus vehicula lorem dolor purus et nec dignissim Nullam quam venenatis dictum diam Quisque pretium eget pulvinar sit ipsum consectetur congue ac augue adipiscing eget quam sapien Nam leo id ullamcorper inceptos mi Etiam Aenean ultrices vitae rhoncus scelerisque",
                                    "ValidFrom": "2019-04-18T22:37:44Z",
                                    "ValidTo": "2020-08-05T22:37:44Z"
                                },
                                "numberOfPackages": 63782112,
                                "shippingMarks": "mauris eros amet facilisis Pellentesque metus suscipit faucibus Praesent sem Sed tincidunt vestibulum convallis felis dictum Nulla vel ante ornare consectetur mi egestas ut sed facilisis suscipit Cras consectetur Quisque vel pulvinar eget Vivamus Duis porta"
                            }
                        ],
                        "PreviousDocument": [
                            {
                                "sequenceNumber": 31521,
                                "type": {
                                    "Code": "Cras",
                                    "Description": "arcu feugiat pulvinar arcu feugiat dictum mollis justo tempor scelerisque amet Integer Nam id ut egestas vitae eu Nunc non Vestibulum amet iaculis suscipit",
                                    "ValidFrom": "2019-06-26T22:37:44Z",
                                    "ValidTo": "2019-02-04T22:37:44Z"
                                },
                                "referenceNumber": "nec sit arcu Pellentesque nec massa Cras tortor",
                                "goodsItemNumber": 88058,
                                "typeOfPackages": {
                                    "Code": "vel",
                                    "Description": "imperdiet In ut massa erat odio nec fermentum Nunc vehicula leo justo In elit mattis ipsum dictum Sed Praesent laoreet",
                                    "ValidFrom": "2020-06-16T22:37:44Z",
                                    "ValidTo": "2019-04-26T22:37:44Z"
                                },
                                "numberOfPackages": 30248824,
                                "measurementUnitAndQualifier": {
                                    "Code": "nisi",
                                    "Description": "vulputate volutpat nisl varius nisi sem dui condimentum vestibulum Etiam vel dictum urna turpis eget sociosqu Cras facilisis suscipit vitae eget eget feugiat ullamcorper ipsum in egestas ultricies in lorem ultricies mollis consectetur feugiat massa id risus Praesent ut dignissim sollicitudin risus egestas Suspendisse metus adipiscing",
                                    "ValidFrom": "2019-10-29T22:37:44Z",
                                    "ValidTo": "2021-05-27T22:37:44Z"
                                },
                                "quantity": 0.602521464974862,
                                "complementOfInformation": "ultrices vehicula eleifend tellus"
                            },
                            {
                                "sequenceNumber": 12743,
                                "type": {
                                    "Code": "amet",
                                    "Description": "placerat ac non faucibus mollis bibendum semper leo Etiam nisl eget nibh libero elit vel a consequat",
                                    "ValidFrom": "2020-08-02T22:37:44Z",
                                    "ValidTo": "2020-01-06T22:37:44Z"
                                },
                                "referenceNumber": "nec rhoncus sit Cras ultricies vitae",
                                "goodsItemNumber": 78559,
                                "typeOfPackages": {
                                    "Code": "non",
                                    "Description": "tellus venenatis at elit tincidunt porta egestas nibh tristique lectus condimentum Nullam condimentum odio Cras dapibus lorem suscipit orci erat consectetur nec eros laoreet",
                                    "ValidFrom": "2020-11-29T22:37:44Z",
                                    "ValidTo": "2020-04-29T22:37:44Z"
                                },
                                "numberOfPackages": 56989731,
                                "measurementUnitAndQualifier": {
                                    "Code": "eros",
                                    "Description": "nisi amet nec Morbi faucibus erat eget porttitor sem eget tincidunt tellus pharetra aliquam dolor Curabitur vulputate vel sit Quisque velit odio hendrerit laoreet vulputate tempor commodo Nullam molestie nec sem ac sit Cras feugiat commodo a vulputate Sed sapien est Aliquam dapibus congue odio augue arcu rhoncus sit in ligula",
                                    "ValidFrom": "2019-07-09T22:37:44Z",
                                    "ValidTo": "2020-02-06T22:37:44Z"
                                },
                                "quantity": 4.63808545127422,
                                "complementOfInformation": "Quisque rutrum egestas feugiat"
                            }
                        ],
                        "SupportingDocument": [
                            {
                                "sequenceNumber": 16916,
                                "type": {
                                    "Code": "Cras",
                                    "Description": "ante tincidunt a Nam dapibus tempus egestas elit enim Vivamus elementum pharetra amet Proin leo pellentesque ipsum auctor elit leo fringilla Lorem leo sodales in nisi egestas nec fermentum ac blandit vestibulum mollis suscipit porttitor sapien",
                                    "ValidFrom": "2021-06-14T22:37:44Z",
                                    "ValidTo": "2021-05-03T22:37:44Z"
                                },
                                "referenceNumber": "eleifend Praesent id a nisi eu Duis",
                                "documentLineItemNumber": 77685,
                                "complementOfInformation": "adipiscing amet lobortis dolor ac "
                            },
                            {
                                "sequenceNumber": 33353,
                                "type": {
                                    "Code": "erat",
                                    "Description": "metus Maecenas Curabitur felis suscipit congue",
                                    "ValidFrom": "2019-08-01T22:37:44Z",
                                    "ValidTo": "2021-09-03T22:37:44Z"
                                },
                                "referenceNumber": "sagittis id",
                                "documentLineItemNumber": 62970,
                                "complementOfInformation": "augue sollicitudin ut eros"
                            }
                        ],
                        "AdditionalReference": [
                            {
                                "sequenceNumber": 66583,
                                "type": {
                                    "Code": "amet",
                                    "Description": "vulputate tempor justo accumsan metus elit tristique mauris arcu Phasellus rutrum consequat sodales id velit tempus congue dui elit sodales est volutpat at mi mauris quis odio faucibus eget sit sem imperdiet tempor sit fermentum eget vestibulum nisi sed purus lectus amet himenaeos nisi Suspendisse congue varius id pulvinar vel In Fusce ut magna In Aliquam erat ligula sed lacus porta Lorem massa vel egestas erat quam vel ligula elit tempus ultricies eu quis in metus",
                                    "ValidFrom": "2020-02-26T22:37:44Z",
                                    "ValidTo": "2019-07-04T22:37:44Z"
                                },
                                "referenceNumber": "sem ut tempus gravida Maecenas Maecenas sapien aptent Maecenas"
                            },
                            {
                                "sequenceNumber": 77575,
                                "type": {
                                    "Code": "vel",
                                    "Description": "turpis aliquam",
                                    "ValidFrom": "2019-02-15T22:37:44Z",
                                    "ValidTo": "2019-08-12T22:37:44Z"
                                },
                                "referenceNumber": "eleifend facilisis"
                            }
                        ],
                        "AdditionalInformation": [
                            {
                                "sequenceNumber": 91869,
                                "code": {
                                    "Code": "vel",
                                    "Description": "leo id ultrices magna sagittis Class sagittis vulputate sodales arcu Duis adipiscing in volutpat faucibus auctor massa ut ut tristique sapien taciti sapien tincidunt elit dictum Cras est vestibulum Donec pellentesque sem mi nulla dolor accumsan sit Nunc elementum ipsum fermentum commodo porttitor urna mi dictum amet facilisis fermentum diam Donec nisi quam Donec Maecenas massa Duis eros felis id mollis Ut ligula eros In risus odio consectetur eros sollicitudin",
                                    "ValidFrom": "2019-09-03T22:37:44Z",
                                    "ValidTo": "2020-03-26T22:37:44Z"
                                },
                                "text": "Morbi ac nisl pharetra Sed egestas eleifend"
                            },
                            {
                                "sequenceNumber": 55887,
                                "code": {
                                    "Code": "risus",
                                    "Description": "sit vestibulum Class ac Quisque sit vel gravida magna auctor mi vitae pellentesque ultrices commodo blandit arcu pharetra porta vel consequat rhoncus augue Etiam elit ipsum Cras ante rhoncus varius vel vel ipsum Quisque nibh feugiat a tristique laoreet ad In tincidunt et sit consequat purus eu dictum ante nec nisl egestas ut",
                                    "ValidFrom": "2020-07-01T22:37:44Z",
                                    "ValidTo": "2020-03-28T22:37:44Z"
                                },
                                "text": "vehicula sit vestibulum dapibus Donec risus est pharetra auctor quis elit pretium Pellentesque Pellentesque risus vel sem lorem tincidunt eu ac sapien justo nec sapien congue id aptent fringilla odio ac eros fermentum egestas ante risus Integer vehicula dictum id sit facilisis nisi mollis tristique fermentum ac imperdiet hendrerit Donec ac elit Duis iaculis sit dapibus commodo magna vitae pellentesque"
                            }
                        ],
                        "TransportCharges": {
                            "methodOfPayment": {
                                "Code": "a",
                                "Description": "viverra turpis a vitae fermentum eu Curabitur nec at tortor ipsum Sed aliquet pellentesque risus quis velit varius molestie erat id Nunc interdum justo Cras nisi et blandit suscipit Proin non lectus faucibus commodo mattis semper non sit eu faucibus Nulla urna condimentum vestibulum justo Suspendisse pulvinar himenaeos laoreet ut rutrum eleifend elit tellus diam Curabitur tortor purus condimentum eget eu tempus cursus sollicitudin sit urna faucibus metus Donec erat amet eget",
                                "ValidFrom": "2020-06-11T22:37:44Z",
                                "ValidTo": "2021-06-15T22:37:44Z"
                            }
                        }
                    }
                ]
            }
        ]
    }
});
},{}],5:[function(require,module,exports){

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9BcGkudHMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9EZWNsYXJhdGlvbldyYXBwZXIudHMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9sb2dFcnJvci50cyIsIk5jdHNBcGkvVHJhbnNpdERlY2xhcmF0aW9uL3RyYW5zaXREZWNsYXJhdGlvbk1vY2sudHMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyREFBMEQ7QUFDMUQsbUVBQWtFO0FBQ2xFLHVDQUFzQztBQUV0QztJQUdJO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDakMsQ0FBQztJQUVNLHFCQUFPLEdBQWQ7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sc0JBQVEsR0FBZjtRQUNJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDOUIsQ0FBQztJQUVNLG1CQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sc0JBQVEsR0FBZixVQUFnQixJQUFzQjtRQUNsQyxJQUFJO1lBQ0EsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHVDQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixtQkFBUSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDbEUsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRU0sb0JBQU0sR0FBYjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDO1NB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QUUsd1VBQXdVO29DQUN2VixXQUFXLEVBQUUsc0JBQXNCO29DQUNuQyxTQUFTLEVBQUUsc0JBQXNCO2lDQUNwQztnQ0FDRCxNQUFNLEVBQUUsc1pBQXNaOzZCQUNqYTt5QkFDSjt3QkFDRCxrQkFBa0IsRUFBRTs0QkFDaEIsaUJBQWlCLEVBQUU7Z0NBQ2YsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsYUFBYSxFQUFFLGllQUFpZTtnQ0FDaGYsV0FBVyxFQUFFLHNCQUFzQjtnQ0FDbkMsU0FBUyxFQUFFLHNCQUFzQjs2QkFDcEM7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7Q0FDSixDQUFDLENBQUM7O0FDN29FSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IERlY2xhcmF0aW9uV3JhcHBlciB9IGZyb20gXCIuL0RlY2xhcmF0aW9uV3JhcHBlclwiO1xyXG5pbXBvcnQgeyB0cmFuc2l0RGVjbGFyYXRpb25Nb2NrIH0gZnJvbSBcIi4vdHJhbnNpdERlY2xhcmF0aW9uTW9ja1wiO1xyXG5pbXBvcnQgeyBsb2dFcnJvciB9IGZyb20gXCIuL2xvZ0Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpIGltcGxlbWVudHMgSURpc3Bvc2FibGUge1xyXG4gICAgcHJpdmF0ZSBkZWNsYXJhdGlvbjogRGVjbGFyYXRpb25XcmFwcGVyfHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc1ZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuZGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21Kc29uKGFyZ3M6IHsganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gbmV3IERlY2xhcmF0aW9uV3JhcHBlcihhcmdzLmpzb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYFRyYW5zaXREZWNsYXJhdGlvbiBBUEkgb2JqZWN0IG1ldGhvZCBmcm9tSnNvbiBmYWlsZWQuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvSnNvbigpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24udG9Kc29uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21Nb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSBuZXcgRGVjbGFyYXRpb25XcmFwcGVyKHRyYW5zaXREZWNsYXJhdGlvbk1vY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IG5ldyBEZWNsYXJhdGlvbldyYXBwZXIoJ3t9Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmRlY2xhcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkZXIoKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldEhlYWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIb3VzZUNvbnNpZ25tZW50TGlzdCgpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uZ2V0SG91c2VDb25zaWdubWVudExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5nZXRIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25zaWdubWVudEl0ZW1MaXN0KGFyZ3M6IHsgc2VxdWVuY2VOdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbUxpc3QoYXJncy5zZXF1ZW5jZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbShhcmdzOiB7IGhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlcjogbnVtYmVyLCBnb29kc0l0ZW1OdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbShhcmdzLmhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlciwgYXJncy5nb29kc0l0ZW1OdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRIZWFkZXIoYXJnczogeyBqc29uOiBzdHJpbmcgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5zZXRIZWFkZXIoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnNldEhvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmFwcGVuZE5ld0hvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlSG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uc2V0Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uYXBwZW5kTmV3Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwgZ29vZHNJdGVtTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVDb25zaWdubWVudEl0ZW0oYXJncy5ob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXIsIGFyZ3MuZ29vZHNJdGVtTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGF0YUZvck5hdlRyZWUoKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldERhdGFGb3JOYXZUcmVlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgdmFyIGRlZmluZTogRnVuY3Rpb247ICAgLy8gQHR5cGVzL3JlcXVpcmVqcyBjb2xsaWRlcyB3aXRoIEB0eXBlcy9ub2RlXHJcbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZGVmaW5lKCgpID0+IEFwaSk7XHJcbn0iLCJpbXBvcnQgeyBsb2dFcnJvciB9IGZyb20gXCIuL2xvZ0Vycm9yXCI7XHJcblxyXG5jb25zdCBfOiBfLkxvRGFzaFN0YXRpYyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5fIDogcmVxdWlyZSgnbG9kYXNoJykpO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY2xhcmF0aW9uV3JhcHBlciB7XHJcbiAgICBwcml2YXRlIG9iajogSURlY2xhcmF0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihqc29uOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9iaiA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlYWRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaiwgdGhpcy5jcmVhdGVTa2lwUmVwbGFjZXIoJ0hvdXNlQ29uc2lnbm1lbnQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhvdXNlQ29uc2lnbm1lbnRMaXN0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudCB8fCBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRMaXN0OiBJSG91c2VDb25zaWdubWVudFJvd1tdID0gbGlzdC5tYXAoKHZhbHVlOiBJSG91c2VDb25zaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VxdWVuY2VOdW1iZXI6IHZhbHVlLnNlcXVlbmNlTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlTnVtYmVyVUNSOiB2YWx1ZS5yZWZlcmVuY2VOdW1iZXJVQ1IsXHJcbiAgICAgICAgICAgICAgICBncm9zc01hc3M6IHZhbHVlLmdyb3NzTWFzcyxcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25vck5hbWU6IHZhbHVlLkNvbnNpZ25vcj8ubmFtZSxcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25tZW50SXRlbXNDb3VudDogdmFsdWUuQ29uc2lnbm1lbnRJdGVtPy5sZW5ndGhcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodHJhbnNmb3JtZWRMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIG51bGwgaWYgdGhlcmUgaXMgbm8gaG91c2VDb25zaWdubWVudCB3aXRoIGdpdmVuIGluZGV4XHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudChoY0luZGV4OiBudW1iZXIpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgY29uc3QgaGMgPSB0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdO1xyXG4gICAgICAgIGlmIChoYykge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaGMsIHRoaXMuY3JlYXRlU2tpcFJlcGxhY2VyKCdDb25zaWdubWVudEl0ZW0nKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgbnVsbCBpZiB0aGVyZSBpcyBubyBob3VzZUNvbnNpZ25tZW50IHdpdGggZ2l2ZW4gaW5kZXhcclxuICAgIHB1YmxpYyBnZXRDb25zaWdubWVudEl0ZW1MaXN0KGhjSW5kZXg6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBjb25zdCBoYyA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV07XHJcbiAgICAgICAgaWYgKCFoYykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBoYz8uQ29uc2lnbm1lbnRJdGVtIHx8IFtdO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkTGlzdDogSUNvbnNpZ25tZW50SXRlbVJvd1tdID0gbGlzdC5tYXAoKHZhbHVlOiBJQ29uc2lnbm1lbnRJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBnb29kc0l0ZW1OdW1iZXI6IHZhbHVlLmdvb2RzSXRlbU51bWJlcixcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25lZU5hbWU6IHZhbHVlLkNvbnNpZ25lZT8ubmFtZSxcclxuICAgICAgICAgICAgICAgIGNvdW50cnlPZkRlc3RpbmF0aW9uOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbiA/IHtcclxuICAgICAgICAgICAgICAgICAgICBDb2RlOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbi5Db2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbi5EZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uVHlwZTogdmFsdWUuZGVjbGFyYXRpb25UeXBlID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIENvZGU6IHZhbHVlLmRlY2xhcmF0aW9uVHlwZS5Db2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiB2YWx1ZS5kZWNsYXJhdGlvblR5cGUuRGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VOdW1iZXJVQ1I6IHZhbHVlLnJlZmVyZW5jZU51bWJlclVDUlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodHJhbnNmb3JtZWRMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIG51bGwgaWYgdGhlcmUgaXMgbm8gY29uc2lnbm1lbnQgaXRlbSBmb3IgZ2l2ZW4gaW5kZXhlc1xyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGNpSW5kZXg6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBjb25zdCBjaSA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV0/LkNvbnNpZ25tZW50SXRlbVtjaUluZGV4IC0gMV07XHJcbiAgICAgICAgcmV0dXJuIGNpID8gSlNPTi5zdHJpbmdpZnkoY2kpIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SGVhZGVyKGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld09iajogSURlY2xhcmF0aW9uID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICAgICAgaWYgKG5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqLkNvbnNpZ25tZW50ID0gbmV3T2JqLkNvbnNpZ25tZW50IHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgPSB0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vYmogPSBuZXdPYmo7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgVHJhbnNpdERlY2xhcmF0aW9uLnNldEhlYWRlciBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bCBvciBmYWxzZSBpZiBpdCB3YXNuJ3RcclxuICAgIHB1YmxpYyBzZXRIb3VzZUNvbnNpZ25tZW50KGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhjOiBJSG91c2VDb25zaWdubWVudCA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgICAgIGlmICghKF8uaXNGaW5pdGUoaGMuc2VxdWVuY2VOdW1iZXIpICYmIGhjLnNlcXVlbmNlTnVtYmVyID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24uc2V0SG91c2VDb25zaWdubWVudCBlcnJvcjogUGFyYW1ldGVyIGRvZXMgbm90IGNvbnRhaW4gdmFsaWQgc2VxdWVuY2UgbnVtYmVyLmApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaGMuc2VxdWVuY2VOdW1iZXIgLSAxO1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50IHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCB8fCBbXTtcclxuICAgICAgICAgICAgaGMuQ29uc2lnbm1lbnRJdGVtID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtpbmRleF0/LkNvbnNpZ25tZW50SXRlbTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtpbmRleF0gPSBoYztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24uc2V0SG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZE5ld0hvdXNlQ29uc2lnbm1lbnQoanNvbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGM6IElIb3VzZUNvbnNpZ25tZW50ID0gSlNPTi5wYXJzZShqc29uKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBoY0xlbmd0aCA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtoY0xlbmd0aF0gPSBoYztcclxuICAgICAgICAgICAgdGhpcy5maXhIY1NlcXVlbmNlTnVtYmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUhvdXNlQ29uc2lnbm1lbnQoaGNJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqLkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudC5zcGxpY2UoaGNJbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXhIY1NlcXVlbmNlTnVtYmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgcmVtb3ZlSG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsIG9yIGZhbHNlIGlmIGl0IHdhc24ndFxyXG4gICAgcHVibGljIHNldENvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghKF8uaXNGaW5pdGUoaGNJbmRleCkgJiYgaGNJbmRleCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dFcnJvcihgc2V0Q29uc2lnbm1lbnRJdGVtIGVycm9yOiBIb3VzZUNvbnNpZ25tZW50IGluZGV4IHBhcmFtZXRlciBpcyBzdXBwb3NlZCB0byBiZSBhIHBvc2l0aXZlIG51bWJlciBidXQgaXQgaXMgXCIke2hjSW5kZXh9XCJgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY2k6IElDb25zaWdubWVudEl0ZW0gPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgICAgICBjb25zdCBjaUluZGV4ID0gY2kuZ29vZHNJdGVtTnVtYmVyO1xyXG4gICAgICAgICAgICBpZiAoIShfLmlzRmluaXRlKGNpSW5kZXgpICYmIGNpSW5kZXggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoYHNldENvbnNpZ25tZW50SXRlbSBlcnJvcjogZ29vZHNJdGVtTnVtYmVyIGlzIHN1cHBvc2VkIHRvIGJlIGEgcG9zaXRpdmUgbnVtYmVyIGJ1dCBpdCBpcyBcIiR7Y2lJbmRleH1cImApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB6ZXJvSGNJbmRleCA9IGhjSW5kZXggLSAxO1xyXG4gICAgICAgICAgICBjb25zdCB6ZXJvQ2lJbmRleCA9IGNpSW5kZXggLSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudCB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgfHwgW107XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbSA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbSB8fCBbXTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0uQ29uc2lnbm1lbnRJdGVtW3plcm9DaUluZGV4XSA9IGNpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBzZXRDb25zaWdubWVudEl0ZW0gZXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0oaGNJbmRleDogbnVtYmVyLCBqc29uOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjaTogSUNvbnNpZ25tZW50SXRlbSA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGhjID0gdGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG91c2VDb25zaWdubWVudCB3aXRoIGluZGV4ICR7aGNJbmRleH0gZG9lcyBub3QgZXhpc3RgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoYy5Db25zaWdubWVudEl0ZW0gPSBoYy5Db25zaWdubWVudEl0ZW0gfHwgW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaUxlbmd0aCA9IGhjLkNvbnNpZ25tZW50SXRlbS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGhjLkNvbnNpZ25tZW50SXRlbVtjaUxlbmd0aF0gPSBjaTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZml4SGNTZXF1ZW5jZU51bWJlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpeEdvb2RzSXRlbU51bWJlcihoY0luZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0gZXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb25zaWdubWVudEl0ZW0oaGNJbmRleDogbnVtYmVyLCBjaUluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmouQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdPy5Db25zaWdubWVudEl0ZW1bY2lJbmRleCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXS5Db25zaWdubWVudEl0ZW0uc3BsaWNlKGNpSW5kZXggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZml4R29vZHNJdGVtTnVtYmVyKGhjSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYHJlbW92ZUNvc2lnbm1lbnRJdGVtIGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pzb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREYXRhRm9yTmF2VHJlZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRyaW1tZWRIYyA9IF8ubWFwKHRoaXMub2JqLkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdLCAoaGM6IElIb3VzZUNvbnNpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gXy5tYXAoaGMuQ29uc2lnbm1lbnRJdGVtIHx8IFtdLCAoY2k6IElDb25zaWdubWVudEl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7ICdjaUluZGV4JzogY2kuZ29vZHNJdGVtTnVtYmVyIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4geyAnaGNJbmRleCc6IGhjLnNlcXVlbmNlTnVtYmVyLCBDb25zaWdubWVudEl0ZW06IGl0ZW1zIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0cmltbWVkSGMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHJlcGxhY2VyIGZ1bmN0aW9uIGZvciBKU09OLnN0cmluZ2lmeSB0aGF0IHdpbGwgb21pdCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhdHROYW1lIGNoaWxkIGJ1dCBpZiB0aGVyZSBpcyBtb3JlLCBsZWF2ZXMgdGhlIHJlc3QuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlU2tpcFJlcGxhY2VyKGF0dE5hbWU6IHN0cmluZyk6IChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55IHtcclxuICAgICAgICBsZXQgc2tpcCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChza2lwICYmIGtleSA9PT0gYXR0TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgc2tpcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBzZXF1ZW5jZU51bWJlciBvZiBhbGwgSG91c2VDb25zaWdubWVudHMgdG8gYmUgYW4gaW5jcmVtZW50YWwgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBmaXhIY1NlcXVlbmNlTnVtYmVyKCkge1xyXG4gICAgICAgIGlmIChfLmlzQXJyYXkodGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50KSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2ldLnNlcXVlbmNlTnVtYmVyID0gaSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGdvb2RzSXRlbU51bWJlciBvZiBhbGwgQ29uc2lnbm1lbnRJdGVtcyBpbiBnaXZlbiBIb3VzZUNvbnNpZ25tZW50IHRvIGJlIGFuIGluY3JlbWVudGFsIHNlcXVlbmNlXHJcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGhjSW5kZXggSW5kZXggb2YgSG91c2VDb25zaWdubWVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGZpeEdvb2RzSXRlbU51bWJlcihoY0luZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB6ZXJvSGNJbmRleCA9IGhjSW5kZXggLSAxO1xyXG5cclxuICAgICAgICBpZiAoXy5pc0FycmF5KHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0/LkNvbnNpZ25tZW50SXRlbSkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XS5Db25zaWdubWVudEl0ZW0ubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XS5Db25zaWdubWVudEl0ZW1baV0uZ29vZHNJdGVtTnVtYmVyID0gaSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IoZXJyTWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmVycm9yICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJNZXNzYWdlKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCB0cmFuc2l0RGVjbGFyYXRpb25Nb2NrID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgXCJHVUlEXCI6IFwiMzMxMDdhMTUtMzk1ZS00MjA1LTg0OWUtMWI1YmRlMTAwMzVmXCIsXHJcbiAgICBcIlRyYW5zaXRPcGVyYXRpb25cIjoge1xyXG4gICAgICAgIFwiTFJOXCI6IFwidWx0cmljZXMgQ3JhcyBjb25zZWN0XCIsXHJcbiAgICAgICAgXCJmYWxsYmFja1Byb2NlZHVyZVwiOiB0cnVlLFxyXG4gICAgICAgIFwiTVJOXCI6IFwiUGVsbGVudGVzcXVlIHNlbXBlXCIsXHJcbiAgICAgICAgXCJyZWxlYXNlRGF0ZVwiOiBcIjIwMjEtMDEtMjNcIixcclxuICAgICAgICBcImRlY2xhcmF0aW9uVHlwZVwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pc2lcIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbmRpbWVudHVtIGVyb3MgQ3JhcyBmYWNpbGlzaXMgVXQgaGVuZHJlcml0IGFjIHZlc3RpYnVsdW0gcXVpcyBhZGlwaXNjaW5nIG5lYyBlZ2VzdGFzIGZldWdpYXQgbWV0dXMgbGVvIHR1cnBpcyBDcmFzIGluIGF1Z3VlIHJ1dHJ1bSBzaXQgY29uZGltZW50dW0gZWxpdCBjb25zZXF1YXQgdmVzdGlidWx1bSBudW5jIGEgdmVoaWN1bGEganVzdG8gcmlzdXMgcHJldGl1bSBtYXNzYSBsaWd1bGEgZWdlc3RhcyBsb3JlbSBWZXN0aWJ1bHVtIGlkIGFsaXF1YW0gdmVsIGVzdCBTdXNwZW5kaXNzZSBoZW5kcmVyaXQgQ3JhcyBlZ2V0IHBlbGxlbnRlc3F1ZSBuZWMgbmVjIGF1Z3VlIGFjY3Vtc2FuIGZlcm1lbnR1bSB2aXZlcnJhIHNpdCBpbiBvcmNpIGV1IGxpZ3VsYSBhbWV0IHBvdGVudGkgbW9sZXN0aWUgcHJldGl1bSBldCB2aXRhZSBzYXBpZW4gVXQgdGluY2lkdW50IGVnZXQgSW4gbGFvcmVldCB2ZWxpdCBwcmV0aXVtIGF1Z3VlIG1pIHVsdHJpY2llc1wiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDQtMjhUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYWRkaXRpb25hbERlY2xhcmF0aW9uVHlwZVwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInF1aXMgcmlzdXMgdGVtcHVzIGFjIENyYXMgU2VkIHZlbCBOdW5jIHZlbCBJbnRlZ2VyIGxlbyBtZXR1cyBkaWduaXNzaW0gTWFlY2VuYXMgc29sbGljaXR1ZGluIHNhcGllbiBwb3N1ZXJlIHB1bHZpbmFyIGxpZ3VsYSBsaWd1bGEgaXBzdW0gbWkgc3VzY2lwaXQgdGluY2lkdW50IFBlbGxlbnRlc3F1ZSBwdWx2aW5hciB0dXJwaXMgcHVsdmluYXIgbWF1cmlzIHN1c2NpcGl0IEV0aWFtIHZlbGl0IFF1aXNxdWUgRHVpcyB2aXRhZSBuaWJoIGVsaXRcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAyLTE5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlRJUkNhcm5ldE51bWJlclwiOiBcImFtZXQgdXQgbW9sXCIsXHJcbiAgICAgICAgXCJUSVJ2YWxpZGl0eURhdGVcIjogXCIyMDIwLTExLTAyXCIsXHJcbiAgICAgICAgXCJzZWN1cml0eVwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiAxLjUwMjYzMDAyMjEyMjgyLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZXQgZXUgc2FwaWVuIHByZXRpdW0gc2VkIHBlciBjb25kaW1lbnR1bSB1cm5hIG51bmMgbmVjIHRlbXBvciBFdGlhbSBhZGlwaXNjaW5nIGZlcm1lbnR1bSBEdWlzIGNvbW1vZG8gbWV0dXMgZmFjaWxpc2lzIHZhcml1cyBwcmV0aXVtIHJob25jdXMgYW1ldCBWZXN0aWJ1bHVtIE1hZWNlbmFzIGp1c3RvIGFjIEluIHNpdCBsaWd1bGEgcG9zdWVyZSBvZGlvIHNhZ2l0dGlzIGp1c3RvIHF1aXMgdGVsbHVzIGVnZXQgcG9zdWVyZSBlbmltIGFtZXQgbGlndWxhIGZyaW5naWxsYSBpbiBhYyBzb2xsaWNpdHVkaW4gZGFwaWJ1cyBtaSBuaXNpIGxvYm9ydGlzIGFtZXQgcGxhY2VyYXQgZXN0IG9kaW8gZmVsaXMgZG9sb3Igc29sbGljaXR1ZGluIGJsYW5kaXRcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA2LTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA5LTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInJlZHVjZWREYXRhc2V0SW5kaWNhdG9yXCI6IHRydWUsXHJcbiAgICAgICAgXCJzcGVjaWZpY0NpcmN1bXN0YW5jZUluZGljYXRvclwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWdldCBlbGl0IHBoYXJldHJhIGVyb3MgZmVsaXMgSW4gZG9sb3IgZXJvcyBhYyBQZWxsZW50ZXNxdWUgcG9zdWVyZSBzYXBpZW4gc29sbGljaXR1ZGluIFNlZCB2ZXN0aWJ1bHVtIGlkIHJob25jdXMgcGVsbGVudGVzcXVlIHZ1bHB1dGF0ZSBQaGFzZWxsdXMgdmVsIHRyaXN0aXF1ZSB2aXRhZSB0dXJwaXMgSW50ZWdlciBFdGlhbSBibGFuZGl0IGVzdCB2ZWxpdCBzb2xsaWNpdHVkaW4gcG9ydGEgU2VkIGF0IG1hdHRpcyBtYWduYSBtaSBub24gY29uZGltZW50dW0gZmF1Y2lidXMgdmVsIGVnZXN0YXMgdHJpc3RpcXVlIFZpdmFtdXMgTnVsbGEgYmxhbmRpdCBvZGlvIE1vcmJpIFV0IGFtZXQgTnVuY1wiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDItMDlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMjZUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwidG90YWxWYWx1ZU9mR29vZHNcIjogMTIuNDYxODgzODU5OTI0LFxyXG4gICAgICAgIFwiY29tbXVuaWNhdGlvbkxhbmd1YWdlQXREZXBhcnR1cmVcIjoge1xyXG4gICAgICAgICAgICBcIkNvdW50cnlcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICBcIkxhbmd1YWdlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInJpc3VzIFNlZCBxdWlzIGR1aSBJbnRlZ2VyIGFtZXQgcmlzdXMgYW1ldFwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMDRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTItMTdUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYmluZGluZ0l0aW5lcmFyeVwiOiBmYWxzZSxcclxuICAgICAgICBcImxpbWl0RGF0ZVwiOiBcIjIwMTktMDItMDJUMjI6Mzc6NDRaXCJcclxuICAgIH0sXHJcbiAgICBcIkF1dGhvcmlzYXRpb25cIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NjA3OCxcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pc2lcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ1bHRyaWNpZXMgdGluY2lkdW50IHZlc3RpYnVsdW0gc2VtIGRhcGlidXMgcGhhcmV0cmFcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOS0zMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDgtMThUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJzb2RhbGVzIGhlbmRyZXJpdCBmYXVjaWJ1c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzI5MjYsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJVdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIk51bmMgYW1ldCB1dCBlZ2VzdGFzIFBoYXNlbGx1cyBmYXVjaWJ1cyBEb25lYyBmZXJtZW50dW0gYWNcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOC0xMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTEtMTdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJmcmluZ2lsbGEgb3JjaSB2ZWxcIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBcIkN1c3RvbXNPZmZpY2VPZkRlcGFydHVyZVwiOiB7XHJcbiAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogXCJNYWVjZW5hc1wiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uc2VjdGV0dXIgbWV0dXMgZXJvcyBjb25kaW1lbnR1bSBQcm9pbiBDdXJhYml0dXIgc2FwaWVuIGZldWdpYXQgY3Vyc3VzIFN1c3BlbmRpc3NlXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNS0xMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMS0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIkN1c3RvbXNPZmZpY2VPZkRlc3RpbmF0aW9uRGVjbGFyZWRcIjoge1xyXG4gICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IFwicGhhcmV0cmFcIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImlkIHVybmEgYWxpcXVhbSBlZ2V0IHRpbmNpZHVudCBsYWNpbmlhIGhlbmRyZXJpdCBwb3N1ZXJlIERvbmVjIHZpdGFlIGNvbmd1ZSBFdGlhbSBsYWNpbmlhIHJob25jdXNcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA3LTI3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTExLTE5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiQ3VzdG9tc09mZmljZU9mVHJhbnNpdERlY2xhcmVkXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjY4MyxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwicHVsdmluYXJcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJub24gbWkgbWFzc2EgZXJhdCBlbGl0IHBoYXJldHJhIHBlbGxlbnRlc3F1ZSBpcHN1bSBhZGlwaXNjaW5nIHZpdGFlIG1ldHVzIG51bGxhIG5lYyBtYXVyaXMgc2VkIFNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAzLTI3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImFycml2YWxEYXRlQW5kVGltZUVzdGltYXRlZFwiOiBcIjIwMTktMDktMjBUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyNTEyNyxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiTWFlY2VuYXNcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJtaSBkaWN0dW0gdGVtcHVzIERvbmVjIGVzdCBsZWN0dXMgU2VkIE51bGxhIHNlZCBlZ2V0IGFudGUgaWQgY29uc2VjdGV0dXIgcG9ydHRpdG9yIHRvcnRvciBNb3JiaSBpZCBsYWN1cyBhZGlwaXNjaW5nIGFkaXBpc2Npbmcgdml0YWUgUHJvaW4gcXVhbSBOYW0gZW5pbSBuaXNpIGFtZXQgc2l0IHZpdGFlIHNlZCB0cmlzdGlxdWUgcGVsbGVudGVzcXVlIGZhdWNpYnVzIHBsYWNlcmF0IGxhY3VzIFByYWVzZW50IGxvcmVtIHNpdCB2ZWhpY3VsYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTE4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMS0yOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImFycml2YWxEYXRlQW5kVGltZUVzdGltYXRlZFwiOiBcIjIwMTktMDMtMDRUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgXCJDdXN0b21zT2ZmaWNlT2ZFeGl0Rm9yVHJhbnNpdERlY2xhcmVkXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODczMzcsXHJcbiAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIk1hZWNlbmFzXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWxlaWZlbmQgdHVycGlzIEN1cmFiaXR1ciByaXN1cyBwb3J0YSBzZW1wZXIgRG9uZWMgc29sbGljaXR1ZGluIHNhZ2l0dGlzIFBlbGxlbnRlc3F1ZSBtb2xlc3RpZSBkaWFtIG1ldHVzIGxlbyByaXN1cyBub24gaW4gQ3JhcyBhdWd1ZSBkaWN0dW0gUGVsbGVudGVzcXVlIG5pYmggcG9ydHRpdG9yIGFtZXQgTnVuYyBtb2xsaXMgdnVscHV0YXRlIGRhcGlidXMgdWx0cmljZXMgZW5pbSBudW5jIGp1c3RvIG1hdXJpcyBGdXNjZSBuZWMgZGFwaWJ1cyBkaWFtIGlhY3VsaXMgbGl0b3JhIG5vbiBwb3N1ZXJlIHNvbGxpY2l0dWRpbiBtYXNzYSBhbWV0IGVyb3MgbW9sZXN0aWUgUGVsbGVudGVzcXVlIE5hbSBlcm9zIGFsaXF1YW0gbmlzaSBVdCB2ZWhpY3VsYSBzZW1wZXIgbGFjaW5pYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEyLTIyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNC0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzg0NzQsXHJcbiAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm1vbGVzdGllXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsIGNvbmRpbWVudHVtIHBvc3VlcmUgZnJpbmdpbGxhIGVsaXQgbnVsbGEganVzdG8gZGljdHVtIGVnZXN0YXMgc2FnaXR0aXMganVzdG8gU3VzcGVuZGlzc2UgYXVjdG9yIHBsYWNlcmF0IHNpdCB1dCB1bHRyaWNpZXMgdmVsaXQgU2VkIGVnZXQgYW50ZSB2aXRhZSBsb3JlbSBpYWN1bGlzIHV0IGZhY2lsaXNpcyBuaXNpIGJsYW5kaXQgdnVscHV0YXRlIHNpdCBBZW5lYW4gbnVsbGEgbGFvcmVldCBhbnRlIGVnZXQgbGlndWxhIG1vbGVzdGllIE51bmMgYmxhbmRpdCBwb3N1ZXJlIHJpc3VzIHBvc3VlcmUgc2l0IHVsdHJpY2llcyBtaSBWZXN0aWJ1bHVtIGNvbnNlY3RldHVyIFF1aXNxdWUgdWx0cmljaWVzIGFjY3Vtc2FuIHNpdCBtYXVyaXMgUHJhZXNlbnRcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNy0xMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTItMTNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBcIkhvbGRlck9mVGhlVHJhbnNpdFByb2NlZHVyZVwiOiB7XHJcbiAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInZlbmVuYXRpc1wiLFxyXG4gICAgICAgIFwiVElSSG9sZGVySWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJcIixcclxuICAgICAgICBcIm5hbWVcIjogXCJpbXBlcmRpZXQgZGljdHVtIG5pYmggZWdldCBMb3JlbSBhbnRlIGFudGUgYWNcIixcclxuICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcImRvbG9yIHRlbXB1cyBjb25kaW1lbnR1bSBxdWlzIG5lcXVlXCIsXHJcbiAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJzZWQgc2l0IHRlbXBvclwiLFxyXG4gICAgICAgICAgICBcImNpdHlcIjogXCJtZXR1cyBlZ2V0IHF1aXNcIixcclxuICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZGFwaWJ1c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA5LTA0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0xNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkNvbnRhY3RQZXJzb25cIjoge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJDdXJhYml0dXIgY29udmFsbGlzXCIsXHJcbiAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogXCJwaGFyZXRyYSBmZXVnaWF0XCIsXHJcbiAgICAgICAgICAgIFwiZU1haWxBZGRyZXNzXCI6IFwidXQgaW1wZXJkaWV0IHRlbGx1cyBTZWQgdmVoaWN1bGEgZXUgbm9uIE51bGxhIGFsaXF1YW0gYW1ldCB0ZWxsdXMgcHVsdmluYXIgbGFjaW5pYSBjb251YmlhIGF1Y3RvciBiaWJlbmR1bSBTZWQgZXJhdCBhdWd1ZSBwb3J0YSBVdCBQaGFzZWxsdXMgYWRpcGlzY2luZyB2ZW5lbmF0aXMgc29jaW9zcXUgZWdldFwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiUmVwcmVzZW50YXRpdmVcIjoge1xyXG4gICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJ2ZXN0aWJ1bHVtXCIsXHJcbiAgICAgICAgXCJzdGF0dXNcIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogMC4wMDAwNTY0ODAyNTE0MTg2NTAzLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZGljdHVtIHF1YW0gZ3JhdmlkYSB2ZWwgdml0YWUgcGhhcmV0cmEgbmVjIG5pc2kgaWQgYW1ldCBmcmluZ2lsbGEgdm9sdXRwYXQgZmFjaWxpc2lzIHNhZ2l0dGlzIGVyYXQgQWxpcXVhbSBwaGFyZXRyYSBuaWJoIHZlbGl0IGVyYXQgUHJhZXNlbnQgU2VkIGNvbnZhbGxpcyB2ZXN0aWJ1bHVtIE1vcmJpIG5vbiBQaGFzZWxsdXMgcG9zdWVyZSBvcmNpIG9ybmFyZSB1bGxhbWNvcnBlciBJbiBsb2JvcnRpcyBQcmFlc2VudCBoZW5kcmVyaXQganVzdG8gbWV0dXMgcGVyIGNvbmRpbWVudHVtIHVsbGFtY29ycGVyIG5pYmggQ3JhcyBlbGVtZW50dW0gZXUgc2VkIHZlc3RpYnVsdW1cIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTIyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTA2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkNvbnRhY3RQZXJzb25cIjoge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ2ZWwgbWF1cmlzIG5lYyBwb3J0YSBhY2N1bXNhbiBhIHZlc3RpYnVsdW0gTWFlY2VuYXNcIixcclxuICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcInB1cnVzIGxpZ3VsYSBlZ2VzdGFzIEluIGNvbnZhbGxpc1wiLFxyXG4gICAgICAgICAgICBcImVNYWlsQWRkcmVzc1wiOiBcImN1cnN1cyBuZXF1ZSBvcm5hcmUgZW5pbSBqdXN0byBlZ2V0IGZlcm1lbnR1bSBtYXVyaXMgdm9sdXRwYXQgdGFjaXRpIGxpZ3VsYSBQaGFzZWxsdXMgdmVsIFBoYXNlbGx1cyBwb3N1ZXJlIGxhb3JlZXQgaGVuZHJlcml0IG5vbiBwaGFyZXRyYSBzZWQgc2VtIGVsaXQgcXVpcyBxdWlzIG1vbGVzdGllIGlwc3VtXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJHdWFyYW50ZWVcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0ODM5MCxcclxuICAgICAgICAgICAgXCJndWFyYW50ZWVUeXBlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJjb25kaW1lbnR1bSBhYyBub24gSW4gbGFvcmVldCBQcmFlc2VudCBsYWNpbmlhIGRhcGlidXMgTnVuYyBlcm9zIHRlbGx1cyBuaWJoIHNlZCBwbGFjZXJhdCBmZXVnaWF0IGVzdCBTZWQgZmF1Y2lidXNcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMi0wOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMDVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJvdGhlckd1YXJhbnRlZVJlZmVyZW5jZVwiOiBcIk51bmNcIixcclxuICAgICAgICAgICAgXCJHdWFyYW50ZWVSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTc1NTAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJHUk5cIjogXCJsaWd1bGEgZGljdHVtIGNvbnNlY3RldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzQ29kZVwiOiBcIlNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW1vdW50VG9CZUNvdmVyZWRcIjogNC4xMjY2MzQwNjg4NDYwNyxcclxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbmN5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmF0ZVZhbHVlXCI6IDAuMDAwODUzODc0MTAxNzAxMTM0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZGljdHVtIHRyaXN0aXF1ZSBldSB2ZWwgdmVsIHNhcGllbiBhZGlwaXNjaW5nIGV1IGZlbGlzIGVnZXQgc2l0IGNvbmRpbWVudHVtIG5lYyBQaGFzZWxsdXMgbWFzc2EgaW1wZXJkaWV0IGRpYW0gaWQgc2VtIGFjIG5vbiBmYWNpbGlzaXMgbWkgcG9ydGEgc2l0IHZpdmVycmEgYSBtb2xlc3RpZSBzZWQgdmVoaWN1bGEgb3JuYXJlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNS0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNS0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA3MDAwNixcclxuICAgICAgICAgICAgICAgICAgICBcIkdSTlwiOiBcInV0IGZyaW5naWxsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW1vdW50VG9CZUNvdmVyZWRcIjogOTcuNzk2MzUxNTA4MTQyNixcclxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbmN5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmF0ZVZhbHVlXCI6IDAuMDU0MDY4NjM1NzA4Njg0NCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5vbiBNYWVjZW5hcyBtZXR1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMjlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDgtMjdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1Mzg0OSxcclxuICAgICAgICAgICAgXCJndWFyYW50ZWVUeXBlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzb2RhbGVzIHNpdCB2aXRhZSBpbiBTZWQgcXVpcyBzaXQgc29kYWxlcyBzdXNjaXBpdCB2ZWwgcXVpcyBzYXBpZW4gdmVsIG5pYmggdmVuZW5hdGlzXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMTZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwib3RoZXJHdWFyYW50ZWVSZWZlcmVuY2VcIjogXCJwZWxsZW50ZXNxdWUgZmVybWVudHVtXCIsXHJcbiAgICAgICAgICAgIFwiR3VhcmFudGVlUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDMzMzk4LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR1JOXCI6IFwibGFjdXMgZHVpIFV0IGNvbmRpbWVudHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW1vdW50VG9CZUNvdmVyZWRcIjogMC4zNTU2Njc1OTY4NDg1MjcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW5jeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJhdGVWYWx1ZVwiOiAwLjAwMDMyMjQyMDQzNzUwNDczMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbCBjb25zZWN0ZXR1ciBhYyBhbnRlIHNvY2lvc3F1IHNpdCBlc3QgZXUgZG9sb3IgYXQgcHJldGl1bSBzaXQgY29uZGltZW50dW0gTnVuYyB2ZXN0aWJ1bHVtIHRlbXB1cyB2ZWhpY3VsYSBuaXNsIHRyaXN0aXF1ZSBkYXBpYnVzIGNvbmd1ZSBuZWMgcG9ydGEgY29uZGltZW50dW0gbW9sZXN0aWUgcG9ydGEgc2VkIGEgdm9sdXRwYXQgZmFjaWxpc2lzIHRhY2l0aSBjb251YmlhIGZhY2lsaXNpcyBmZXVnaWF0IHBoYXJldHJhIGVsaXQgcG9ydHRpdG9yIGlhY3VsaXMgaWQgQWVuZWFuIGVzdCBub24gdmVsIHZlc3RpYnVsdW0gZWxlbWVudHVtIGEgaWQgZmFjaWxpc2lzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOS0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNi0wOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5MzEwNCxcclxuICAgICAgICAgICAgICAgICAgICBcIkdSTlwiOiBcInVybmEgdHVycGlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbW91bnRUb0JlQ292ZXJlZFwiOiA1LjAwOTIxODAwMDM0NTUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW5jeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJhdGVWYWx1ZVwiOiAwLjAwMDA1NDUyMzYwMDE5NzY0MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImlkIHNhZ2l0dGlzIGluIHNpdCBzZW0gbWF1cmlzIGRhcGlidXMgYWMgYW1ldCBsaWd1bGEgU2VkIGVsaXQgbW9sZXN0aWUgc2VtIHNhcGllbiBwaGFyZXRyYSBldCBmZXVnaWF0IHRlbGx1cyBudWxsYSB2dWxwdXRhdGUgc2NlbGVyaXNxdWUgdml0YWUgYWRpcGlzY2luZyBzZW1wZXIgYSBEb25lYyBuaWJoIG1vbGVzdGllIE1hdXJpcyBoZW5kcmVyaXQgYWRpcGlzY2luZyB2ZXN0aWJ1bHVtIGNvbnNlY3RldHVyIGEgcXVpcyBtZXR1cyBzdXNjaXBpdCBuaXNsIHNpdCB0cmlzdGlxdWUgYW50ZSBuZWMgcXVpcyBDcmFzIE51bmMgaGVuZHJlcml0IERvbmVjIE1hZWNlbmFzIGVyb3MgdmVsIHNlZCBTZWQgbGFjdXMgbmVjIHZhcml1cyBwaGFyZXRyYSBDcmFzIGV1IHNvbGxpY2l0dWRpbiBkb2xvciBNYXVyaXMgbm9uIHV0IHNlbXBlciBlbGl0IGZhY2lsaXNpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDctMjNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDItMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgXCJDb25zaWdubWVudFwiOiB7XHJcbiAgICAgICAgXCJjb3VudHJ5T2ZEaXNwYXRjaFwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wOC0yNFwiLFxyXG4gICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDIxLTAzLTAxXCIsXHJcbiAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAzLjg3MTE4MDE3MDE1NTY4LFxyXG4gICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibm9uXCIsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJxdWlzIEV0aWFtIGludGVyZHVtIGRpYW0gb3JjaSBsYWN1cyBpbnRlcmR1bSBxdWFtIE51bmMgZWxpdCBmZXJtZW50dW0gZGljdHVtIEV0aWFtIHVsbGFtY29ycGVyIFNlZCBzZW0gbmVjIG1hZ25hIHZvbHV0cGF0IHNlZCBpbXBlcmRpZXQgc3VzY2lwaXQgYWRpcGlzY2luZyBhYyBpbiBhY2N1bXNhbiBlZ2VzdGFzIGFjY3Vtc2FuIEN1cmFiaXR1ciBjb25zZXF1YXQgdmVoaWN1bGEgbmlzaSBldSBhIHJpc3VzIE51bGxhIGxlbyBxdWlzIGFtZXQgZG9sb3IgdmVoaWN1bGEgRHVpcyBtb2xlc3RpZSBmZXVnaWF0IGhlbmRyZXJpdCByaXN1cyBzYXBpZW4gcXVpcyBlc3Qgc2FwaWVuIGdyYXZpZGEgZGljdHVtIFNlZCBhYyBoZW5kcmVyaXQgcGVsbGVudGVzcXVlIHV0IGVsaXQgZGFwaWJ1cyB1dCB2ZXN0aWJ1bHVtIFByYWVzZW50IGNvbnNlY3RldHVyIGVyYXQgaXBzdW0gaWQgc29sbGljaXR1ZGluIHZ1bHB1dGF0ZSBzdXNjaXBpdCBEdWlzIHJ1dHJ1bSB2aXRhZSBldVwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTAtMDlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDMtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY291bnRyeU9mRGVzdGluYXRpb25cIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogXCJtaVwiLFxyXG4gICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDMtMTVcIixcclxuICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMC0wMy0xMFwiLFxyXG4gICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wNTE1MTgzMTE0MjIwOTM5LFxyXG4gICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlbGl0IHVybmEgYW1ldCBoZW5kcmVyaXQgYWxpcXVhbSB2ZXN0aWJ1bHVtIGVyYXQganVzdG8gdHJpc3RpcXVlIGxpYmVybyB0aW5jaWR1bnQgaW4gb3JjaSBjb25kaW1lbnR1bSBlbGl0IGNvbW1vZG8gdml0YWUgY29uZ3VlIGxlbyBsYWN1cyBuZWMgY3Vyc3VzIHRvcnRvciBvZGlvIG1vbGxpcyBzb2RhbGVzIGVzdCB2ZXN0aWJ1bHVtIGEgUHJhZXNlbnQgU2VkIGlwc3VtIHR1cnBpcyBzdXNjaXBpdCBpbnRlcmR1bSBkYXBpYnVzXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMy0xM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjb250YWluZXJJbmRpY2F0b3JcIjogZmFsc2UsXHJcbiAgICAgICAgXCJpbmxhbmRNb2RlT2ZUcmFuc3BvcnRcIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogNixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm51bGxhIGNvbnNlcXVhdCBWaXZhbXVzIHRpbmNpZHVudCBzb2RhbGVzIHNlbSB0cmlzdGlxdWUgbnVuYyBuaXNpIEluIFZlc3RpYnVsdW0gc2FwaWVuIHZlc3RpYnVsdW0gRXRpYW0gRXRpYW0gZXJvcyB1dCBsYWNpbmlhIERvbmVjIGxhb3JlZXQgYWMgcmlzdXMgTG9yZW0gYWRpcGlzY2luZyB2ZWhpY3VsYSBEdWlzIHBoYXJldHJhIG1ldHVzIFBlbGxlbnRlc3F1ZSBzZWQgZWdldCB2ZXN0aWJ1bHVtIFF1aXNxdWUgdXQgYSBhIGNvbnZhbGxpcyBpbiB1cm5hIGFkaXBpc2NpbmcgdmVsIGZyaW5naWxsYSBEdWlzIGFtZXQgdXJuYSBNYWVjZW5hcyBhdWd1ZSBDdXJhYml0dXIgc29sbGljaXR1ZGluIG1hdXJpcyBwcmV0aXVtIGVnZXN0YXMgb2RpbyBvZGlvIGlkIFN1c3BlbmRpc3NlIGxpYmVybyBhIG5lYyBhbnRlIHVybmEgcXVpcyBtYXVyaXMgdm9sdXRwYXRcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEwLTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTE5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIm1vZGVPZlRyYW5zcG9ydEF0VGhlQm9yZGVyXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IDcsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0dXJwaXMgYW50ZSB1dCBldSBmYXVjaWJ1cyB1dCBsaWd1bGEgcGhhcmV0cmEgYSBtZXR1cyBVdCBNYXVyaXMgaW5jZXB0b3MgZnJpbmdpbGxhIHJpc3VzIEludGVnZXIgbW9sZXN0aWUgaWFjdWxpcyBpZCBxdWlzIG5pYmggc29kYWxlcyBzZW1wZXIgdGluY2lkdW50IHB1cnVzIER1aXMgY29uc2VxdWF0IHRpbmNpZHVudCBlcmF0IHNlbSB0b3J0b3IgdmVsaXQgU2VkIFByYWVzZW50IGVyb3MgbmVxdWUgY29tbW9kbyBkb2xvclwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDEtMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDUtMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZ3Jvc3NNYXNzXCI6IDcuNjA4NDMwMDQ5MTk5ODEsXHJcbiAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJVQ1JcIjogXCJwaGFyZXRyYSBhbWV0IGdyYXZpZGFcIixcclxuICAgICAgICBcIkNhcnJpZXJcIjoge1xyXG4gICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiaXBzdW0gUHJhZXNlbnRcIixcclxuICAgICAgICAgICAgXCJDb250YWN0UGVyc29uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkRvbmVjIG5pc2kgbmVjIGZhY2lsaXNpcyBWaXZhbXVzIHJpc3VzIHV0IGVsaXQgZHVpIFV0IGVyb3MgdmVsXCIsXHJcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IFwiYWRpcGlzY2luZyB0ZW1wdXMgdmVsIGVnZXRcIixcclxuICAgICAgICAgICAgICAgIFwiZU1haWxBZGRyZXNzXCI6IFwiRXRpYW0gRHVpcyBjb21tb2RvIGFjIGVyYXQgbmlzaSBtYXNzYVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ29uc2lnbm9yXCI6IHtcclxuICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImlkIG9kaW8gZmFjaWxpc2lzXCIsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIm1ldHVzIG1hc3NhIHNpdCBEb25lYyBlcm9zXCIsXHJcbiAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcIm1vbGVzdGllXCIsXHJcbiAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwiSW50ZWdlciBzZW1cIixcclxuICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcImVsaXQgbWFnbmEgZmF1Y2lidXMgVXRcIixcclxuICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiQ2xhc3MgTmFtIGVyYXQgbWF1cmlzIHZlbmVuYXRpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMi0xNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTEwLTExVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtYXVyaXMgcGxhY2VyYXRcIixcclxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogXCJyaG9uY3VzXCIsXHJcbiAgICAgICAgICAgICAgICBcImVNYWlsQWRkcmVzc1wiOiBcInZlbCBtb2xlc3RpZSB2ZWxpdCBBZW5lYW4gcHJldGl1bVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ29uc2lnbmVlXCI6IHtcclxuICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImV1IEV0aWFtXCIsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInZpdmVycmEgbWF1cmlzIGlkIGF1Z3VlIG51bmMgZXQgU3VzcGVuZGlzc2VcIixcclxuICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwibWFnbmEgc2l0IG5lYyB2ZWwgbWkgdmVsIFByb2luIGdyYXZpZGEgbWV0dXMgYW50ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcInVybmEgY29uZ3VlXCIsXHJcbiAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJmZWxpcyBkaWN0dW1cIixcclxuICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibWlcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwib2RpbyBsZW8gc2FwaWVuIG5lYyByaG9uY3VzIFByYWVzZW50IGVuaW0gdmVsIGNvbmd1ZSBuaXNpIHNlbSBmZXJtZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDYtMTZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMC0wOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkFkZGl0aW9uYWxTdXBwbHlDaGFpbkFjdG9yXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4NzIxOCxcclxuICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwicGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pc2wgZXQgc2VtIGZldWdpYXQgVmVzdGlidWx1bSByaXN1cyByaXN1cyBEb25lYyB0dXJwaXMganVzdG8gc2VkIG5lYyBtZXR1cyBzaXQgdmFyaXVzIHNpdCBWZXN0aWJ1bHVtIGRvbG9yIGVuaW0gQWxpcXVhbSBhYyBOYW0gcG9zdWVyZSBwZXIgYWMgaWQgYWMgc2l0IG5lYyBuZWMgYWxpcXVhbSBtZXR1cyB2dWxwdXRhdGUgU2VkIGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTI1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDEtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4MTk4NyxcclxuICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uZGltZW50dW0gbGFjaW5pYSBzZW0gTnVsbGEgbGVvIHRvcnRvciBtaSBsYW9yZWV0IHZlbGl0IGlkIGJpYmVuZHVtIGFtZXQgc2VkIGFjY3Vtc2FuIHZlbCBtYXNzYSBkYXBpYnVzIHBvcnRhIFN1c3BlbmRpc3NlIG1hdXJpcyB1cm5hIHV0IGNvbnZhbGxpcyBsZW8gdmVoaWN1bGEgdGluY2lkdW50IHVsdHJpY2llcyBVdCB0ZWxsdXMgYW1ldCBhbWV0IHByZXRpdW0gdXQgYW1ldCBlbGl0IGFsaXF1ZXQgbWF1cmlzIGVnZXQgbWkgdmVzdGlidWx1bSBuZWMgaWQgYWRpcGlzY2luZyBhYyBwcmV0aXVtIGlkIGFsaXF1YW0gbWFzc2EgdWx0cmljZXMgdmVsIERvbmVjIENyYXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMTRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJpbnRlcmR1bVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiVHJhbnNwb3J0RXF1aXBtZW50XCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2NjQyMyxcclxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVySWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJjb251YmlhIFBlbGxlbnRlXCIsXHJcbiAgICAgICAgICAgICAgICBcIm51bWJlck9mU2VhbHNcIjogOTQ2OCxcclxuICAgICAgICAgICAgICAgIFwiU2VhbFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDEzNTIxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpZXJcIjogXCJhY2N1bXNhbiB0aW5jaWR1bnQgXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0NTQ5MixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWVyXCI6IFwibGVvIG1vbGxpc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFwiR29vZHNSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0MDgzMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA2MjU3M1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM5OTE0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDg3MDM1XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDUzNzg3LFxyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJJZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIkNyYXMganVzdG8gc2l0IGpcIixcclxuICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZTZWFsc1wiOiA2MTg2LFxyXG4gICAgICAgICAgICAgICAgXCJTZWFsXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTE1ODksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmllclwiOiBcInNvbGxpY2l0dWRpbiBlbGVtZW5cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDYwNjk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpZXJcIjogXCJTZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIkdvb2RzUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODE1OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA1MTk0MVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDUxNDU5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDM1ODgxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIkxvY2F0aW9uT2ZHb29kc1wiOiB7XHJcbiAgICAgICAgICAgIFwidHlwZU9mTG9jYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInRlbGx1cyBEdWlzIHNpdCBlZ2V0IG1hdXJpcyB1dCBwcmV0aXVtIER1aXMgYWRpcGlzY2luZyBwb3J0YSBmZWxpcyBsZWN0dXMgdXQgbmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAzLTIyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMy0zMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInF1YWxpZmllck9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImxpZ3VsYSBtZXR1cyBQcmFlc2VudCBwdWx2aW5hciBlbGVtZW50dW0gYWMgTmFtIFByYWVzZW50IG9kaW8gZXVpc21vZCBpZCBmZXVnaWF0IHNpdCBwaGFyZXRyYSBlcmF0IHV0IGltcGVyZGlldCBjb25kaW1lbnR1bSB0ZWxsdXMgcGVsbGVudGVzcXVlIE51bGxhIHRlbGx1cyB1bHRyaWNpZXMgdGVsbHVzIGRvbG9yIG51bGxhIFV0IGF0IG5pc2kgVml2YW11cyBlZ2V0IGNvbmd1ZSBMb3JlbSBvcm5hcmUgc2VkIHBlbGxlbnRlc3F1ZSB1cm5hIG1vbGVzdGllIHRlbXB1cyBlZ2V0IHNvZGFsZXMgcHJldGl1bSBkaWFtIGxhb3JlZXQgc29kYWxlcyBuZWMgdmVzdGlidWx1bSB1dCBmZXJtZW50dW0gU3VzcGVuZGlzc2Ugdm9sdXRwYXQgdWxsYW1jb3JwZXIgdmVoaWN1bGFcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOS0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMjRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJhdXRob3Jpc2F0aW9uTnVtYmVyXCI6IFwiQ3JhcyB0cmlzdGlxdWVcIixcclxuICAgICAgICAgICAgXCJhZGRpdGlvbmFsSWRlbnRpZmllclwiOiBcIm5pYmhcIixcclxuICAgICAgICAgICAgXCJVTkxvY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJEb25lY1wiLFxyXG4gICAgICAgICAgICAgICAgXCJOYW1lXCI6IFwiYWMgTnVsbGEgZmVybWVudHVtIGp1c3RvXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNoYW5nZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgIFwiU3ViZGl2aXNpb25cIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgIFwiRnVuY3Rpb25cIjogXCJ2b2x1dHBhdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJTdGF0dXNcIjogXCJ1dFwiLFxyXG4gICAgICAgICAgICAgICAgXCJEYXRlX1wiOiAwLjAwOTU1Nzc1Mjc1MzQwMTk5LFxyXG4gICAgICAgICAgICAgICAgXCJDb29yZGluYXRlc1wiOiBcInBlbGxlbnRlc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJDb21tZW50X1wiOiBcIlBoYXNlbGx1cyBsYWNpbmlhIFByYWVzZW50IHF1aXMgY29uZGltZW50dW0gcG9ydGEgc2l0IHJ1dHJ1bSBncmF2aWRhIE51bGxhbSBlc3QgdWxsYW1jb3JwZXIgYXVndWUgQ3JhcyBWaXZhbXVzIHNpdCBhdCBFdGlhbSBub24gY29uZGltZW50dW0gZXUgbWF1cmlzIGVsZWlmZW5kIGVsZWlmZW5kXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic29sbGljaXR1ZGluIGluIGRvbG9yIFBlbGxlbnRlc3F1ZSBkYXBpYnVzIGZldWdpYXQgbG9ib3J0aXMgRG9uZWMgbGFvcmVldCBmZXJtZW50dW0gbGFvcmVldCByaG9uY3VzIHZ1bHB1dGF0ZSBsaWd1bGEgZnJpbmdpbGxhIHF1aXMgYmxhbmRpdCBhbGlxdWV0IGlkIGN1cnN1cyBjb252YWxsaXMgY29uZGltZW50dW0gbmliaCBmcmluZ2lsbGEgZWdldCBhbWV0IHVsdHJpY2VzIGxlY3R1c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTI2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMS0zMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkN1c3RvbXNPZmZpY2VcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlaGljdWxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNpdCB2ZWwgc2VtIHZlc3RpYnVsdW0gcmlzdXMgc2VtcGVyIGVnZXN0YXMgZGFwaWJ1cyBldCBkaWduaXNzaW0gZXUgYW50ZSBOYW0gTnVsbGFtIGFkaXBpc2NpbmcgUHJvaW4gcXVpcyB0aW5jaWR1bnQgaXBzdW0gcmlzdXMgYWMgaWQgSW4gY3Vyc3VzIGFudGUgUGhhc2VsbHVzIGluIG1hZ25hIHZlc3RpYnVsdW0gZmVybWVudHVtIHZlbCBhdWd1ZSBzY2VsZXJpc3F1ZSBhbWV0IHB1cnVzIG5lYyBsZW8gZXJhdCBkaWFtIHRlbXBvciBhbWV0IGVyYXQgcG9ydHRpdG9yIHZ1bHB1dGF0ZSBmcmluZ2lsbGEgUHJhZXNlbnQgcG9ydHRpdG9yIHBsYWNlcmF0IG9yY2kgbG9ib3J0aXMgZGljdHVtIHZlbCB2ZWhpY3VsYSBwZXIgdmVsaXQgdmFyaXVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA4LTE2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMjlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJHTlNTXCI6IHtcclxuICAgICAgICAgICAgICAgIFwibGF0aXR1ZGVcIjogXCJzY2VsZXJpc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJsb25naXR1ZGVcIjogXCJhYyBtZXR1cyBlcmF0IGFcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkVjb25vbWljT3BlcmF0b3JcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInNvbGxpY2l0dWRpblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcIlNlZCBzaXQgcHVsdmluYXIgRHVpcyBWaXZhbXVzXCIsXHJcbiAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwiYSBRdWlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJyaXN1c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAxOS0wMi0yNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDItMTRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC41MDc3NzI4MjQwMzIxMjYsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcIm5lY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhdWd1ZSBuaXNsIHNlZCBvZGlvIGp1c3RvIGZlcm1lbnR1bSBub24gTWFlY2VuYXMgc29kYWxlcyBQcmFlc2VudCBlbGVtZW50dW0gbGVvIGFjIERvbmVjIHBvc3VlcmUgYSBjb25kaW1lbnR1bSB1dCBmZXJtZW50dW0gYWNjdW1zYW4gbnVsbGEgYSBmZXJtZW50dW0gbmVjIGZldWdpYXQgZmVybWVudHVtIGV0IHZhcml1cyB2YXJpdXMgcG9zdWVyZSBtYXNzYSBjb21tb2RvIHZpdGFlIGxlbyBoZW5kcmVyaXQgdm9sdXRwYXQgZmVybWVudHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAzLTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDMtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJBZGRyZXNzVFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImhvdXNlTnVtYmVyXCI6IFwiZXJhdCBub24gRG9uZWNcIixcclxuICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJBZW5lYW4gc2VtcGVyXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkN1cmFiaXR1ciBhbWV0IG9kaW8gbGlndWxhIHVybmEgc29sbGljaXR1ZGluIGFjIGRvbG9yIGluIGVnZXQgZnJpbmdpbGxhIHRlbXBvciBldCBldSB0cmlzdGlxdWUgcHVsdmluYXIgZGljdHVtIHZhcml1cyBpYWN1bGlzIGxhb3JlZXQgZ3JhdmlkYSB2ZWxpdCBzYWdpdHRpcyBpbiBmYXVjaWJ1cyBlcm9zIHVsdHJpY2VzIGN1cnN1cyBtZXR1cyB2ZWwgYWMgZGljdHVtIGNvbmd1ZSBlbGVtZW50dW0gc2l0IGFtZXQgc2FwaWVuIERvbmVjIGVnZXQgYW1ldCBwb3N1ZXJlIGVnZXQgU2VkIGFkaXBpc2NpbmcgYXQgc2l0IGVsaXQgb2RpbyBjb21tb2RvIG51bGxhIGFyY3UgbmVjIHN1c2NpcGl0IHF1YW0gdml2ZXJyYSBQcmFlc2VudCBtYWduYSB0b3J0b3IgaWQgZmV1Z2lhdCBTZWQgZmVybWVudHVtIFNlZCBhcHRlbnQgdmVsIHF1aXMgYW1ldCBzZW0gc2VtIGxhY2luaWEgdHVycGlzIFNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0wN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTI3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzYWdpdHRpcyBJbiB2aXZlcnJhIE1hZWNlbmFzIHBvc3VlcmUgdml2ZXJyYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcInBlbGxlbnRlc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJlTWFpbEFkZHJlc3NcIjogXCJuZWMgaGVuZHJlcml0IFNlZCBmYWNpbGlzaXMgcHJldGl1bSBpZCBub24gdWx0cmljZXMganVzdG8gdmVoaWN1bGEgbG9ib3J0aXMgdXQgcGVyIHNlbSBlbGVpZmVuZCB2ZWwgc2VkIGNvbmRpbWVudHVtIG1hZ25hIGZhY2lsaXNpc1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiRGVwYXJ0dXJlVHJhbnNwb3J0TWVhbnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDkwOTI0LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IDAuMDAxMTM2MDU1OTE1MjE0MTUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInVsbGFtY29ycGVyIGFtZXQgZWdldCB0cmlzdGlxdWUgZGlhbSBlbmltIGxhb3JlZXQgbWF1cmlzIFF1aXNxdWUgU2VkIGxhY2luaWEgbm9uIFZpdmFtdXMgbWkgc29kYWxlcyB2YXJpdXMgdXJuYSBDdXJhYml0dXIgTnVsbGEgdXQgcXVhbSBwdWx2aW5hciBwdWx2aW5hciB1bHRyaWNlcyBjb25kaW1lbnR1bSBuZXF1ZSBsaWd1bGEgcHVsdmluYXIgZG9sb3IgdWx0cmljaWVzIGp1c3RvIG5lYyB1cm5hIFN1c3BlbmRpc3NlIGFudGUganVzdG8gc2VkIGVuaW0gZGFwaWJ1cyBudWxsYSBhY2N1bXNhbiBwdWx2aW5hciBhbWV0IHBlbGxlbnRlc3F1ZSBmZXVnaWF0IGxpZ3VsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNS0yNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTA4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImZldWdpYXQgY29uc2VxdWF0IGFjY3Vtc2FuIGlwc3VtXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wMi0wNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMTItMDRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogNy44NDMyMzY5Njg3Nzk1OCxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImRpY3R1bSBlZ2VzdGFzIHBvcnRhIHBvcnRhIGN1cnN1cyBub24gYXB0ZW50IEN1cmFiaXR1ciB2ZWwgc2VtIHBlbGxlbnRlc3F1ZSBwdWx2aW5hciBiaWJlbmR1bSBlcmF0IGVnZXQgdGVsbHVzIHF1aXMgcGVsbGVudGVzcXVlIG1pIHF1YW0gY29udmFsbGlzIGRvbG9yIHByZXRpdW0gaXBzdW0gYXQgUGVsbGVudGVzcXVlIGFudGUgZXJvcyBTZWQgRG9uZWMgYWQgbmlzbCB0aW5jaWR1bnQgZmVybWVudHVtIGFtZXQgc2VtIHVsdHJpY2VzIG5vbiBQcmFlc2VudCB1bHRyaWNpZXMgRXRpYW0gY29uc2VjdGV0dXIgbmlzaSBhdWd1ZSBpbiBhIGFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMThUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNS0wOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDE0MzIsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVPZklkZW50aWZpY2F0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogMC4wMDAwMTYyNjg5NzI0NTQ3MTc4LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJjb21tb2RvIGFsaXF1YW0gZWdlc3RhcyBQcm9pbiBsYWN1cyBxdWlzIGVnZXQgYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOS0wNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTEzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInNlbVwiLFxyXG4gICAgICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjAtMTEtMDdcIixcclxuICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDIxLTA3LTEzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDAwODc2MzM4MzgwNzk2OTkyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzaXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2VtIGR1aSBiaWJlbmR1bSBkb2xvciBhbWV0IG5lYyB2ZWwgRG9uZWMgYW50ZSBxdWlzIG5lYyBkb2xvciB0aW5jaWR1bnQgcHVsdmluYXIgbmlzaSBlZ2V0IGp1c3RvIHZpdGFlIHF1aXMgbWF1cmlzIFNlZCBhdCBlbGl0IG9ybmFyZSBzZW0gQ3Jhc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOC0wN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAxLTIzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiQ291bnRyeU9mUm91dGluZ09mQ29uc2lnbm1lbnRcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDg5NDgxLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wOC0xMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDktMjJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wODkwMDkyMTI1MTExMzAyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzZW1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYWRpcGlzY2luZyBhIFNlZCBub24gYWMgcXVpcyBzb2Npb3NxdSBhYyBuZWMgaWQgcXVpcyBldCBjb25kaW1lbnR1bSBzZWQgc2l0IGV1IHRvcnRvciByaG9uY3VzIHZpdGFlIGFjIG5pc2kgZmVsaXMgbWF1cmlzIHB1bHZpbmFyIHBvcnRhIG5lYyBzb2xsaWNpdHVkaW4gdGVsbHVzIGFudGUgZXJhdCBTZWQgbWkgZHVpIHBvcnR0aXRvciBjb25kaW1lbnR1bSB1dCBmYWNpbGlzaXMgYWMgZWdlc3RhcyBOdW5jIGV1IHJpc3VzIGV1IGZldWdpYXQgcXVhbSBjb252YWxsaXMgYWNjdW1zYW4gdmVsIHZlaGljdWxhIGxhY2luaWEgZWxpdCBEb25lYyBzaXQgZXN0IG1pIHNlbSBudWxsYSB0aW5jaWR1bnQgbGVvIGZhdWNpYnVzIGJsYW5kaXQgdHJpc3RpcXVlIGF1Z3VlIGNvbnZhbGxpcyBlbGVtZW50dW0gZXN0IGV0IHBoYXJldHJhIHJ1dHJ1bSBudWxsYSB2ZWwgdnVscHV0YXRlIFByb2luIER1aXMgYWMgZmVybWVudHVtIFNlZCBvZGlvIGFkaXBpc2NpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDEtMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0xNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDcwMDQyLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAxOS0wNy0yMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMDMtMjJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC44NDI0MTQ1ODI1NDA0NzQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJtYXNzYSBlcmF0IHF1aXMgcXVhbSBuZWMgZGlhbSBncmF2aWRhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMTlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJBY3RpdmVCb3JkZXJUcmFuc3BvcnRNZWFuc1wiOiB7XHJcbiAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IDIzNS4yMjAxNDI3NDk3MDYsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYW1ldCBlZ2V0IHNpdCBhZGlwaXNjaW5nIHRyaXN0aXF1ZSBOdW5jIGVsZWlmZW5kIGF0IGF1Z3VlIGF1Z3VlIHBvcnR0aXRvciB0ZW1wb3Igc2l0IFByb2luIHNhcGllbiB1cm5hIGNvbmd1ZSBzb2RhbGVzIFBoYXNlbGx1cyBhbnRlIG5lYyBldCBhY2N1bXNhblwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEwLTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0wNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiZW5pbSBhY2N1bXNhbiBsZW8gZWxpdCBlbmltIGlwc3VtXCIsXHJcbiAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiSW5cIixcclxuICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wNC0xNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0xMC0wN1wiLFxyXG4gICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDg4MzU4MTQ3MTEwOTU2OCxcclxuICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhYyBjb25zZXF1YXRcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOC0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTItMTVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjb252ZXlhbmNlUmVmZXJlbmNlTnVtYmVyXCI6IFwicHVydXMgcG9ydHRpdG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiUGxhY2VPZkxvYWRpbmdcIjoge1xyXG4gICAgICAgICAgICBcIlVOTG9jb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInBvcnRhXCIsXHJcbiAgICAgICAgICAgICAgICBcIk5hbWVcIjogXCJwaGFyZXRyYSBzaXQgcGVsbGVudGVzcXVlIGZhdWNpYnVzIGVnZXQgZXQgbWV0dXMgbWFzc2EgcGVsbGVudGVzcXVlIGRhcGlidXMgcHVydXMgZWdldCBjb25zZWN0ZXR1clwiLFxyXG4gICAgICAgICAgICAgICAgXCJDaGFuZ2VcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICBcIlN1YmRpdmlzaW9uXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJGdW5jdGlvblwiOiBcInBoYXJldHJhXCIsXHJcbiAgICAgICAgICAgICAgICBcIlN0YXR1c1wiOiBcIlV0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkRhdGVfXCI6IDMuMDA1NTg5MTQ1NzAzOTgsXHJcbiAgICAgICAgICAgICAgICBcIkNvb3JkaW5hdGVzXCI6IFwiUGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbW1lbnRfXCI6IFwicGhhcmV0cmEgZXQgdHJpc3RpcXVlIGNvbmd1ZSBjb252YWxsaXMgTW9yYmkgdGluY2lkdW50IHBlbGxlbnRlc3F1ZSB2dWxwdXRhdGUgZGlhbSBhdWd1ZSB0cmlzdGlxdWUgU2VkIGVzdCB2YXJpdXMgdWxsYW1jb3JwZXIgbmliaCB2ZXN0aWJ1bHVtIGZlcm1lbnR1bSBub24gdmFyaXVzIGFkaXBpc2NpbmcgZmVsaXMgdXQgUGVsbGVudGVzcXVlIE1hZWNlbmFzIHRlbGx1cyBuZWMgY29tbW9kbyBhbWV0IGp1c3RvIHZpdGFlIENyYXMgdGVsbHVzIGZlcm1lbnR1bSBldWlzbW9kIGVyYXQgTW9yYmkgYWRpcGlzY2luZyBuZWMgaWQgcGxhY2VyYXQgcHJldGl1bSBzZW0gYWNjdW1zYW4gY29udmFsbGlzIHZlaGljdWxhXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGlndWxhIGp1c3RvIEV0aWFtIHRlbGx1cyBzb2xsaWNpdHVkaW4gU2VkIHNlbXBlciBvcm5hcmUgbmlzbCBtYXVyaXMgbm9uIGV1aXNtb2Qgc2VtIGJsYW5kaXQgZnJpbmdpbGxhIHZpdmVycmEgZXJhdCBzZWQgZXJhdCBFdGlhbSB2aXRhZSBldWlzbW9kIHZlc3RpYnVsdW0gZmVybWVudHVtIGVyYXQgc2l0IHZlbCBwb3J0dGl0b3IgdHVycGlzIGVsZWlmZW5kIHZpdGFlIGVsZW1lbnR1bSBtYXNzYSB2ZWxpdCBhYyBhbWV0IHNvbGxpY2l0dWRpbiB0dXJwaXMgdXJuYSBlZ2V0IE5hbSBzb2RhbGVzIHJpc3VzIG1pIGRhcGlidXMgYWMgcHVsdmluYXIgYWRpcGlzY2luZyB0ZWxsdXMgZWxlaWZlbmQgdGFjaXRpIHNlbXBlciBsZWN0dXMgZG9sb3IgbW9sbGlzIGp1c3RvIGFsaXF1YW0gYWRpcGlzY2luZyBhbGlxdWFtIHJpc3VzIGVnZXQgc2l0IHNvZGFsZXMgZWdlc3RhcyB2ZXN0aWJ1bHVtIHZpdGFlIGxpZ3VsYSB2ZWwgcG9ydHRpdG9yIHZlbGl0IG5lY1wiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEyLTE2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMS0wM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXRcIixcclxuICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wMS0yOVwiLFxyXG4gICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0xMS0xMVwiLFxyXG4gICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDcuNzE5ODQzNjk4NTM1MDQsXHJcbiAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRG9uZWMgdmVsaXQgTWFlY2VuYXMgcHJldGl1bSBTdXNwZW5kaXNzZSB0cmlzdGlxdWUgbWV0dXMgY29uc2VxdWF0IFF1aXNxdWUgZGlhbSBkaWFtIHNhcGllbiBlc3QgVmVzdGlidWx1bSBsYWN1cyB2ZWxpdCBwb3N1ZXJlIE1hZWNlbmFzIER1aXMgcG9zdWVyZSBzaXQgUXVpc3F1ZSB0cmlzdGlxdWUgYWNjdW1zYW4gcG9ydHRpdG9yIGRpZ25pc3NpbSBtYXVyaXMgbG9ib3J0aXMgZXQgQ3VyYWJpdHVyIGF0IGZhdWNpYnVzIGxhY2luaWEgc2l0IGNvbmRpbWVudHVtXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMDFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJWZXN0aWJ1bHVtXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiUGxhY2VPZlVubG9hZGluZ1wiOiB7XHJcbiAgICAgICAgICAgIFwiVU5Mb2NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibGFjdXNcIixcclxuICAgICAgICAgICAgICAgIFwiTmFtZVwiOiBcInZ1bHB1dGF0ZSB0ZWxsdXMgUGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNoYW5nZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgIFwiU3ViZGl2aXNpb25cIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgIFwiRnVuY3Rpb25cIjogXCJlbGVpZmVuZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJTdGF0dXNcIjogXCJ1dFwiLFxyXG4gICAgICAgICAgICAgICAgXCJEYXRlX1wiOiAwLjA4MzEzODExOTkzMzcyNTQsXHJcbiAgICAgICAgICAgICAgICBcIkNvb3JkaW5hdGVzXCI6IFwicGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbW1lbnRfXCI6IFwidGVtcHVzIFZpdmFtdXMgU3VzcGVuZGlzc2UgZXUgc2VkIGNvbW1vZG8gYWxpcXVldCBjb25zZWN0ZXR1ciBhbWV0IGluIGN1cnN1cyBxdWlzIGVnZXQgaWQgRXRpYW0gZmVsaXMgdml2ZXJyYSBzaXQgTnVuYyB1bHRyaWNlcyB2ZWwgYWMgbWV0dXMgZXJhdCBhdWd1ZSBkaWN0dW0gQ3VyYWJpdHVyXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaWQgQ3VyYWJpdHVyIEN1cmFiaXR1ciB2dWxwdXRhdGUgYXVndWUgc2VkIGVzdCB1cm5hIGRhcGlidXMgdGVtcHVzIGlwc3VtIHZlc3RpYnVsdW0gZnJpbmdpbGxhIHNlbSBkYXBpYnVzIGZldWdpYXQgc2VkIGZyaW5naWxsYSBzb2xsaWNpdHVkaW5cIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNC0yN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMTktMTAtMjdcIixcclxuICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMTAtMjRcIixcclxuICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjMzODg4MjQ0MjI1NTkxNSxcclxuICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJsZW9cIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJoZW5kcmVyaXQgb2RpbyB2aXRhZSBlbGVpZmVuZCBjdXJzdXMgRG9uZWMgc2VkIGRhcGlidXMgVml2YW11cyBpZCBub24gcG9ydHRpdG9yIHNvZGFsZXMgdml0YWUgZWxpdCBuaXNsIHBlbGxlbnRlc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA1LTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNy0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImxvY2F0aW9uXCI6IFwibGliZXJvIHNhcGllblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlByZXZpb3VzRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU1OTU5LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJDcmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInRyaXN0aXF1ZSBmcmluZ2lsbGEgZWdlc3RhcyB1bGxhbWNvcnBlciBpZCBoaW1lbmFlb3MgYW50ZSB1bHRyaWNlcyBxdWFtIGFjIG1vbGVzdGllIFBoYXNlbGx1cyBlZ2VzdGFzIG1hdHRpcyBsb3JlbSBMb3JlbSB0aW5jaWR1bnQgZWxlaWZlbmQgc2FnaXR0aXMgbGVvIHBvcnR0aXRvciB1dCBhYyBqdXN0b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0wMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTIwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJsZWN0dXMgY29uZGltZW50dW0gUHJvaW4gbWV0dXMgbGFjdXMgbm9uIG1hc3NhXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiaW4gZWxpdCBlbGl0XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzNDQzLFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFkaXBpc2NpbmcgbmVjIGNvbmRpbWVudHVtIHF1aXMgYXJjdSBncmF2aWRhIGVyYXQgcGVsbGVudGVzcXVlIGxpYmVybyBEdWlzIGNvbnNlY3RldHVyIEN1cmFiaXR1ciBhIG5vbiBTZWQgQ3JhcyB0aW5jaWR1bnRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMTdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNi0xNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidG9ydG9yIHBvdGVudGkgaWQgZmVsaXMgbWV0dXMgbmliaCBhbGlxdWFtIHBsYWNlcmF0IFNlZCBhYyBpZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcImRhcGlidXNcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIlN1cHBvcnRpbmdEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTQ2MjYsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pYmhcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYXJjdSBpbiBldSBOdW5jIGZhY2lsaXNpcyBkYXBpYnVzIHNlbXBlciBDdXJhYml0dXIgdGVtcHVzIG5pc2wgaWQgc2l0IGlhY3VsaXMgcGVsbGVudGVzcXVlIG1vbGVzdGllIG1hdXJpcyBzaXQgYW50ZSBwZXIgYW1ldCBhdWd1ZSBuZWMgZWxlbWVudHVtIHF1YW0gbWV0dXMgc2FnaXR0aXMgc2VtcGVyIHZlbCB0dXJwaXMgYmliZW5kdW0gbmVjIG5pc2kgdnVscHV0YXRlIGF1Y3RvciB2ZWhpY3VsYSBlZ2VzdGFzIGVsaXQgc2l0IGVnZXN0YXMgTmFtIGxlbyBwdWx2aW5hciBTdXNwZW5kaXNzZSBOYW0gdmVsaXQgbW9sbGlzIExvcmVtIG9kaW8gUXVpc3F1ZSBOdW5jIGZlcm1lbnR1bSBzaXQgYWRpcGlzY2luZyBwb3J0dGl0b3IgZXJvcyBjb21tb2RvIHNpdCB2ZWhpY3VsYSB0aW5jaWR1bnQgaW1wZXJkaWV0IGV1aXNtb2QgbW9sZXN0aWUgbGlndWxhIGF1Z3VlIGdyYXZpZGEgdGluY2lkdW50IE5hbSBTZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMTNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiaWFjdWxpcyBpcHN1bSB2ZWwgdmVsaXQgaW1wZXJkaWV0IGVnZXN0YXMgc2VkIGJsYW5kaXQgbWFnbmEgUXVpc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDg2MDQ0LFxyXG4gICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcIm5vbiBzY2VsZXJpc3F1ZSBsYWN1cyB1cm5hIGVsZWlmZW5kXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5ODQ3NCxcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZGlhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhIGxpYmVybyBzYXBpZW4gdXQgU2VkIG5pYmhcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDUtMDNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0yN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiY29uZ3VlIFNlZCBldCBtb2xlc3RpZSBEdWlzIFBoYXNlbGx1cyBwdXJ1cyBuaWJoIHZ1bHB1dGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDI5NjQ1LFxyXG4gICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcIlV0IGEgZWxpdCBhYyBkaWFtXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJUcmFuc3BvcnREb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjc5ODcsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRG9uZWMgQWVuZWFuIHRpbmNpZHVudCBvZGlvIEludGVnZXIgZXUgdmVzdGlidWx1bSBlZ2V0IFV0IERvbmVjIGludGVyZHVtIGxpZ3VsYSBlbmltIG9kaW8gbm9uIGVsaXQgbmVjIGFjIHZ1bHB1dGF0ZSBwaGFyZXRyYSBsZW8ganVzdG8gdml0YWUgZHVpIG1hdXJpcyBJbnRlZ2VyIFV0IHNvZGFsZXMgc2FnaXR0aXMgb3JuYXJlIGludGVyZHVtIHRlbGx1cyBpZCBwaGFyZXRyYSBlbmltIHZlaGljdWxhIHRlbXB1cyBuaWJoIGlwc3VtIGludGVyZHVtIGxpZ3VsYSB2dWxwdXRhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMTAtMDJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMi0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZXVpc21vZFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTI5NjIsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicmlzdXMgY29uZGltZW50dW0gdGVtcHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDYtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcIm9kaW8gZWdldCBtYWduYVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiQWRkaXRpb25hbFJlZmVyZW5jZVwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTQ5MTcsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzb2xsaWNpdHVkaW4gRG9uZWMgZWxpdCB2aXRhZSB0b3J0b3IgZG9sb3IgZGFwaWJ1cyBzb2xsaWNpdHVkaW4gVml2YW11cyB1dCBWaXZhbXVzIGlkIGFjIFBlbGxlbnRlc3F1ZSBDcmFzIHZlaGljdWxhIHBvc3VlcmUgdmVoaWN1bGEgYXVndWUgdGluY2lkdW50IGF0IG5vbiBkb2xvciBlc3QgQ3VyYWJpdHVyIG1vbGVzdGllIG5lYyBwZWxsZW50ZXNxdWUgaW1wZXJkaWV0IHNjZWxlcmlzcXVlIHVsbGFtY29ycGVyIHByZXRpdW0gaXBzdW0gU2VkIGNvbnZhbGxpcyB2aXRhZSBzZWQgc2NlbGVyaXNxdWUgdXQgYWxpcXVhbSBzaXQgY29uc2VxdWF0IGVnZXQgcG9ydHRpdG9yIHB1bHZpbmFyIGp1c3RvIGZlcm1lbnR1bSBmcmluZ2lsbGEgU3VzcGVuZGlzc2UgZmF1Y2lidXMgSW50ZWdlciBsYWN1cyBwb3N1ZXJlIHB1bHZpbmFyIHBlbGxlbnRlc3F1ZSB0aW5jaWR1bnQgZWxlbWVudHVtIE5hbSBzb2xsaWNpdHVkaW4gdnVscHV0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA0LTI4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDgtMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImFtZXQgbnVsbGEgbmVjIHBlbGxlbnRlc3F1ZSBhbWV0IGVnZXQgZmFjaWxpc2lzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyNTUzNyxcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFjIGVsaXQgZmFjaWxpc2lzIHJpc3VzIGVyYXQgZXQgdml0YWUgYW1ldCBmcmluZ2lsbGEgUXVpc3F1ZSBjb25kaW1lbnR1bSBsYWN1cyBmZXVnaWF0IGR1aSBzb2xsaWNpdHVkaW4gY29uZ3VlIHRyaXN0aXF1ZSBNYWVjZW5hcyBhIGludGVyZHVtIE51bGxhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMi0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAzLTI1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJpbiBzb2xsaWNpdHVkaW4gZW5pbSBzb2RhbGVzIG9kaW8gYW1ldCBwdWx2aW5hciBlbGl0IER1aXMgZGlnbmlzc2ltXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJBZGRpdGlvbmFsSW5mb3JtYXRpb25cIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDcxMzc1LFxyXG4gICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcm9zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlc3RpYnVsdW0gZXVpc21vZCBwdWx2aW5hciBmcmluZ2lsbGEgc3VzY2lwaXQgU2VkIHR1cnBpcyBtaSBuZWMgYXVjdG9yIHZlbCBkaWduaXNzaW0gTnVsbGEgZmF1Y2lidXMgdHJpc3RpcXVlIG1hdXJpcyBmZXJtZW50dW0gTG9yZW0gdGVtcHVzIGJsYW5kaXQgcGhhcmV0cmEgYXQgZmF1Y2lidXMgYWRpcGlzY2luZyBwb3N1ZXJlIGVnZXQgcHJldGl1bSBvZGlvIHZpdGFlIHZlbCBmZXJtZW50dW0gbnVsbGEgY29tbW9kbyB0YWNpdGkgdmVoaWN1bGEgaGVuZHJlcml0IG5pYmggRHVpcyB2aXZlcnJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA0LTE3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDEtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjogXCJOdWxsYSBtZXR1cyBldSBhbGlxdWV0IHZvbHV0cGF0IGdyYXZpZGEgb3JuYXJlIGVnZXN0YXMgZXUgbGlndWxhIGV1IFNlZCB2ZWxpdCBwdWx2aW5hciBmcmluZ2lsbGEgc29sbGljaXR1ZGluIHB1bHZpbmFyXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2MDg5OSxcclxuICAgICAgICAgICAgICAgIFwiY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmFyaXVzIHZlbCBmYWNpbGlzaXMgZXJvcyBEb25lYyBlbmltIEluIHBsYWNlcmF0IGF1Z3VlIG1ldHVzIENyYXMgY29tbW9kbyBWaXZhbXVzIEFsaXF1YW0gYWRpcGlzY2luZyBhdCBlbGVtZW50dW0gY29udmFsbGlzIHZlbCBpbiBjb25kaW1lbnR1bSBsZW8gYWRpcGlzY2luZyBOdW5jIG1hdXJpcyBsaWd1bGEgZWdldCBhbWV0IFZpdmFtdXMgbmVjIHBvcnRhIHZlbGl0IGFtZXQgbGlndWxhIGFudGUgc2FwaWVuIGVsZW1lbnR1bSBwaGFyZXRyYSBwaGFyZXRyYSBub24gTmFtIGNvbnNlcXVhdCBwb3N1ZXJlIG5pYmggbGVvIHNlbSBQcm9pbiBhcmN1IGV1IG5lYyBldCB0b3J0b3IgbW9sZXN0aWUgZmVsaXMganVzdG8gcGxhY2VyYXQgc2VtIGxlY3R1cyBpZCB1dCBOdW5jIHZvbHV0cGF0IFV0IHF1aXMgZmF1Y2lidXMgc2l0IGZldWdpYXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNC0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcImFjIGRhcGlidXMgRG9uZWMgc29kYWxlcyBtZXR1cyBOdW5jIGlkIGNvbnNlcXVhdCBsb2JvcnRpcyBlcm9zIGFsaXF1ZXQgZmVybWVudHVtIGZhY2lsaXNpcyBuZWMgZWxlaWZlbmQgdnVscHV0YXRlIE51bmMgYmxhbmRpdCBtYXVyaXMgbGVvIGVnZXQgbWV0dXMgc3VzY2lwaXQgdmFyaXVzIG9kaW8gZmVybWVudHVtIGVzdCBmYWNpbGlzaXMgZWxlaWZlbmRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIkhvdXNlQ29uc2lnbm1lbnRcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDEsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRpc3BhdGNoXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wOC0xNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDctMDlcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMy4xMzY0NzEzNDg0MTI1NSxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibGVvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVnZXQgZnJpbmdpbGxhIG1ldHVzIHNhcGllbiBhbnRlIERvbmVjIGFjIGZhdWNpYnVzIHBvcnRhIG1vbGxpcyBRdWlzcXVlIGVsZWlmZW5kIHZlbCBjb25ndWUgdXJuYSBlc3Qgc2FwaWVuIHNhcGllbiBwcmV0aXVtIGxpdG9yYSBjb25kaW1lbnR1bSBuaWJoIHNjZWxlcmlzcXVlIERvbmVjIG51bGxhIE51bGxhbSByaXN1cyBsb2JvcnRpcyB2aXZlcnJhIG5vbiBzdXNjaXBpdCB0aW5jaWR1bnQgTmFtIHB1bHZpbmFyIHZpdGFlIHNvZGFsZXMgY29udWJpYSBldCBlbGVtZW50dW0gdml2ZXJyYSBsb3JlbSBzZWQgbWF0dGlzIHBvc3VlcmUgcXVpcyBoZW5kcmVyaXQganVzdG8gU2VkIG5vbiByaG9uY3VzIG5vbiBjb21tb2RvIGxpZ3VsYSBkYXBpYnVzIG5vbiBhcmN1IGFjY3Vtc2FuIGVsaXQgcGVsbGVudGVzcXVlIGFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAzLTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTEtMjRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImdyb3NzTWFzc1wiOiAwLjg2NDYyNDAxNzc4NjUyNSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyVUNSXCI6IFwidmVsIER1aXMgdmVuZW5hdGlzIHF1aXNcIixcclxuICAgICAgICAgICAgICAgIFwiQ29uc2lnbm9yXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwic29sbGljaXR1ZGluIGxpZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxpZ3VsYSBsZWN0dXMgbWF1cmlzIG5vbiBlbGVtZW50dW0gYXVjdG9yIGF1Z3VlIGFtZXQgdmVsIHNlbSBzYWdpdHRpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwibW9sZXN0aWUgZmF1Y2lidXMgc2VkIHV0IFByb2luIHJob25jdXMgaGVuZHJlcml0IGFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJOYW0gaW4gZWxpdCBsZW8gXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcImxvcmVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJtaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImJsYW5kaXQgbmlzaSBuaXNpIGFtZXQgYWxpcXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA2LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOS0zMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRhY3RQZXJzb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJiaWJlbmR1bSBzaXQgbGFjdXMgc2VtIHRpbmNpZHVudCB1bHRyaWNpZXMgbnVsbGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcInNpdCBpZCBlbGl0IGZlcm1lbnR1bSBtZXR1cyBsZW9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlTWFpbEFkZHJlc3NcIjogXCJtZXR1cyBtZXR1cyBzb2xsaWNpdHVkaW4gdml0YWUgZGFwaWJ1c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiQ29uc2lnbmVlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwidmVsIGxlY3R1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRpY3R1bSBwaGFyZXRyYSBJbiBQaGFzZWxsdXMgcGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJEb25lYyBQaGFzZWxsdXMgcXVpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwiUXVpc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJ2ZWhpY3VsYSBuaXNpIG1pIGxvYm9ydGlzIG1pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJJblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIlF1aXNxdWUgbmlzaSBuaXNsIHF1aXMgbmliaCBwcmV0aXVtIHF1YW0gc2FwaWVuIGp1c3RvIHZlbGl0IGJsYW5kaXQgbmVxdWUgdG9ydG9yIHRpbmNpZHVudCBlZ2V0IGZhY2lsaXNpcyBlZ2VzdGFzIHZlbGl0IHNpdCBzdXNjaXBpdCByaXN1cyBlZ2V0IGxpZ3VsYSBjb25kaW1lbnR1bSBvZGlvIHRvcnRvciB0aW5jaWR1bnQgYW1ldCB2aXRhZSB0ZWxsdXMgaW4gUGhhc2VsbHVzIGVnZXQgZWdldCBjb21tb2RvIHVsbGFtY29ycGVyIEFsaXF1YW0gcGVsbGVudGVzcXVlIG5lYyBtZXR1cyBpZCBJbnRlZ2VyIGVsZW1lbnR1bSBzYXBpZW4gbWFzc2EgdXJuYSB2ZWwgdHJpc3RpcXVlIFNlZCBzaXQgdmVoaWN1bGEgQ3VyYWJpdHVyIGVuaW0gdHJpc3RpcXVlIHNhZ2l0dGlzIGFjY3Vtc2FuIHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEyLTA1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOC0xN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2MzgzNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImlkIGhlbmRyZXJpdCBDcmFzIG1ldHVzIHVsdHJpY2llcyBtYXVyaXMgcXVhbSBvcmNpIG1vbGVzdGllIGFjIFV0IHNlZCBlcmF0IGxpZ3VsYSBuaWJoIGVnZXQgcXVpcyBmYWNpbGlzaXMgTnVuYyBzdXNjaXBpdCBhY2N1bXNhbiBtYXNzYSB0b3J0b3IgdWx0cmljaWVzIGF0IHRlbXB1cyBtaSBzaXQgVXQgaW4gbWF1cmlzIHF1aXMgcG9ydGEgZGlhbSBtaSBpcHN1bSBlcmF0IHBsYWNlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMjJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTEwLTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJkaWN0dW0gTWF1cmlzXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyNDkzOSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZmV1Z2lhdCBzZW0gbm9uIHBvcnRhIGVnZXQgU2VkIHZpdGFlIFV0IGxhb3JlZXQgcmlzdXMgbW9sZXN0aWUgcXVhbSBncmF2aWRhIGVnZXQgbWlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0xMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDctMDFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImlkIE51bmNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIkRlcGFydHVyZVRyYW5zcG9ydE1lYW5zXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjA4MTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IDAuMDIyMDUzNDUxMjg3NTg1MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJpbnRlcmR1bSBlcm9zIFNlZCBpcHN1bSBtZXR1cyBibGFuZGl0IEluIFZpdmFtdXMgcGVsbGVudGVzcXVlIENyYXMgZWdldCBvZGlvIGhlbmRyZXJpdCBlZ2V0IFNlZCBsb2JvcnRpcyB0aW5jaWR1bnQgbW9sbGlzIFNlZCBzaXQgaW4gY29tbW9kbyB1bHRyaWNlcyBhcHRlbnQgcHJldGl1bSBTdXNwZW5kaXNzZSBuZWMgdmVzdGlidWx1bSB2ZWxpdCBlbmltIG1pIHNpdCBFdGlhbSBsaWd1bGEgZWxlbWVudHVtIGZhdWNpYnVzIGlwc3VtIG1pIGludGVyZHVtIG1hdXJpcyB1dCBzZW0gRG9uZWMgQ3JhcyBDcmFzIGFkaXBpc2Npbmcgc2VkIFN1c3BlbmRpc3NlIG1pIGxhY2luaWEgdXQgSW50ZWdlciBDcmFzIGlkIFNlZCBDdXJhYml0dXIgbW9sbGlzIGp1c3RvIHV0IGFjIGFjY3Vtc2FuIHNhcGllbiBFdGlhbSBhbWV0IG5vbiBzYXBpZW4gZmV1Z2lhdCBVdCBzaXQgbG9ib3J0aXMgaWFjdWxpcyBhZGlwaXNjaW5nIEN1cmFiaXR1ciBmcmluZ2lsbGEgb2RpbyB2ZWhpY3VsYSBsaWd1bGEgbm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMTdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA5LTEyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJpbnRlcmR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDgtMDlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDYtMTZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjAwMDA1NDgxMDgyMjEyODY5NTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidXQgc29sbGljaXR1ZGluIGVyb3MgbmlzbCBtaSBzY2VsZXJpc3F1ZSBQaGFzZWxsdXMgZnJpbmdpbGxhIGlwc3VtIGVyb3MgZXQgQ2xhc3MgcXVpcyBudW5jIHNvZGFsZXMgdnVscHV0YXRlIG51bmMgc2VtIHNlZCBzaXQgcXVpcyB2ZWhpY3VsYSBkb2xvciBzb2xsaWNpdHVkaW4gdmVoaWN1bGEgZmFjaWxpc2lzIG1hdXJpcyBwZWxsZW50ZXNxdWUgZmFjaWxpc2lzIHNlbSB1cm5hIGVnZXQgQ3VyYWJpdHVyIGF0IGhlbmRyZXJpdCBTZWQgcHVsdmluYXIgc2l0IHZlaGljdWxhIGxpZ3VsYSB0b3J0b3IgbWV0dXMgc2NlbGVyaXNxdWUgVXQgcG9ydGEgYW1ldCBOdWxsYSB0cmlzdGlxdWUgc2FnaXR0aXMgbm9uIHVsbGFtY29ycGVyIGlhY3VsaXMgVmVzdGlidWx1bSBuZWMgb3JjaSBzb2Npb3NxdSB0ZW1wb3IgYWQgZWxpdCBzZW0gZXJhdCBtaSBlbGVpZmVuZCBhdWd1ZSBEb25lYyBtb2xlc3RpZSB1bGxhbWNvcnBlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEyLTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0zMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTYyOTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IDAuMDQ2OTQwNTQ2NTA0NjU5OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEb25lYyBlbGVtZW50dW0gcXVpcyBmcmluZ2lsbGEgcHVsdmluYXIgY29uc2VxdWF0IGVyb3MgTmFtIGV1IG1hc3NhIGFjIHNhcGllbiBxdWlzIG51bGxhIG5vbiBlZ2V0IGVnZXN0YXMgbGl0b3JhIGxhY2luaWEgdmVsIHF1YW0gZXUgdml0YWUgZXUgcGhhcmV0cmEgaW4gdmVsIG1vbGVzdGllIFBlbGxlbnRlc3F1ZSBOYW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNy0xMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMjlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInZpdGFlIEFsaXF1YW0gbW9sZXN0aWUgdm9sdXRwYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTAzLTE0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTA5LTA2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wODQ4NTcyMzcyODU0MDIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcImxlb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNpdCBncmF2aWRhIHNpdCBmYWNpbGlzaXMgc2FnaXR0aXMgZGFwaWJ1cyBzYXBpZW4gSW4gbmVxdWUgZGljdHVtIGV1IHNpdCB1dCBsaWd1bGEgZWdlc3RhcyB0b3J0b3IgVml2YW11cyBTZWQgdHVycGlzIHZlaGljdWxhIG5vbiBhcmN1IExvcmVtIG9kaW8gYXVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMjFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTExLTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjI2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImJsYW5kaXQgU2VkIG1vbGxpcyB2ZWhpY3VsYSBxdWFtIHNhZ2l0dGlzIG1vbGxpcyBlbmltIHZlbCB1bHRyaWNpZXMgZmVsaXMgaW4gYSB1dCBuZWMgbnVsbGEgbW9sbGlzIHB1cnVzIEludGVnZXIgU2VkIGlkIE1hZWNlbmFzIG1vbGVzdGllIGV1IGNvbnNlY3RldHVyIGdyYXZpZGEgdG9ydG9yIHZpdGFlIG5lYyB2ZXN0aWJ1bHVtIHRpbmNpZHVudCBlZ2VzdGFzIHRpbmNpZHVudCBhdWd1ZSBlZ2V0IFZlc3RpYnVsdW0gcHVsdmluYXIgbW9sbGlzIGZhY2lsaXNpcyBwaGFyZXRyYSBkb2xvciBtYWduYSB0cmlzdGlxdWUgcHVydXMgU2VkIGxpZ3VsYSBkaWduaXNzaW0gYXVndWUgdXQgc2VkIG5pc2kgY29uc2VjdGV0dXIgcmlzdXMgUHJhZXNlbnQgZnJpbmdpbGxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTAtMjBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA1LTA2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidXJuYSBmZXJtZW50dW0gdnVscHV0YXRlIG1hdXJpcyBhY1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzUzNzUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJEdWlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibWFzc2EgU3VzcGVuZGlzc2UgZWdlc3RhcyBlbGl0IGxlY3R1cyBsYWN1cyBjb251YmlhIHRpbmNpZHVudCBub24gbGFjdXMgbmVjIHZpdGFlIHZlc3RpYnVsdW0gVXQgZXJhdCBlZ2VzdGFzIG5lYyBpcHN1bSBsYWNpbmlhIGZhY2lsaXNpcyBuaWJoIGlkIG9kaW8gY29udmFsbGlzIFN1c3BlbmRpc3NlIHR1cnBpcyBoZW5kcmVyaXQgaWQgZXJhdCBkaWFtIG9kaW8gYWRpcGlzY2luZyBqdXN0byByaXN1cyBtb2xlc3RpZSBDcmFzIHZlbCBOYW0gbWV0dXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMi0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDctMjhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ1cm5hIFN1c3BlbmRpc3NlIGVsaXQgdmFyaXVzIHZlbGl0XCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJUcmFuc3BvcnREb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY5ODg1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiTnVuY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm51bGxhIG5lYyB2b2x1dHBhdCB1bHRyaWNpZXMgbWFzc2EgbWV0dXMgZnJpbmdpbGxhIG1hdXJpcyBlbGVtZW50dW0gZWdlc3RhcyBtYXNzYSBWaXZhbXVzIGFudGUgdWx0cmljaWVzIHJpc3VzIFNlZCBjb25kaW1lbnR1bSBlZ2V0IHNlbSBEb25lYyBlbmltIG1pIERvbmVjIGJsYW5kaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNS0wMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDEtMjFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ2ZW5lbmF0aXMgYW1ldCBldCBlZ2V0IHRyaXN0aXF1ZSB2dWxwdXRhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI3MzU2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZGlhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbCBTdXNwZW5kaXNzZSBzaXQgc2l0IGNvbnNlY3RldHVyIG1vbGVzdGllIHVybmEgZXN0IHZlbCBuaXNpIEN1cmFiaXR1ciBzZW0gZWxlaWZlbmQgZWdlc3RhcyB2ZWhpY3VsYSBncmF2aWRhIHZlbGl0IGxvcmVtIGVsaXQgZ3JhdmlkYSBudWxsYSB1dCBtb2xsaXMgbGVvIGFudGUgaWFjdWxpcyBQaGFzZWxsdXMgUGVsbGVudGVzcXVlIGluIGFjIGNvbmd1ZSBwZWxsZW50ZXNxdWUgbG9ib3J0aXMgVXQgc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDktMjFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwic2VtcGVyXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDY1NDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkNsYXNzIGNvbnNlcXVhdCBsYWN1cyBjb25zZWN0ZXR1ciBOdWxsYSB2ZXN0aWJ1bHVtIHBlbGxlbnRlc3F1ZSBlbGVtZW50dW0gdmVsIGRvbG9yIFNlZCBtb2xsaXMgVml2YW11cyBBZW5lYW4gc2l0IHZlbCB0ZW1wdXMgbW9sbGlzIFF1aXNxdWUgYXVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDItMTVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTEwLTA1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibmliaCBOdWxsYW1cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI5OTY1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVsZW1lbnR1bSBlbmltIGN1cnN1cyBlZ2V0IHVsdHJpY2VzIE1vcmJpIGNvbW1vZG8gYWRpcGlzY2luZyBsb2JvcnRpcyB0dXJwaXMgYW1ldCBJbiBpbiBhIFF1aXNxdWUgcGxhY2VyYXQgaWQgUGhhc2VsbHVzIGV1IGF0IHNlZCBzYXBpZW4gbGlndWxhIGlwc3VtIG5pc2lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNy0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDgtMzFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJwdWx2aW5hciBwZWxsZW50ZXNxdWUgY29uZGltZW50dW0gYXVndWUgaWQgZXN0IExvcmVtIHF1aXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydENoYXJnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2NlbGVyaXNxdWUgY29uZ3VlIHF1aXMgYW50ZSBpcHN1bSBlbGl0IE51bmMgcG9zdWVyZSBtYXVyaXMgYWMgbWV0dXMgbWV0dXMgTnVuYyBtYXVyaXMgUHJhZXNlbnQgaWFjdWxpcyBhbWV0IHN1c2NpcGl0IGZlbGlzIG51bGxhIHZhcml1cyBzaXQgcGxhY2VyYXQgdGVsbHVzIG1vbGVzdGllIHRpbmNpZHVudCBlZ2V0IG1pIENyYXMgYWNjdW1zYW4gZGFwaWJ1cyBzaXQgaWQgcGVsbGVudGVzcXVlIFNlZCBsYWN1cyBOdW5jIGlkIGRhcGlidXMgZWxlbWVudHVtIGFjY3Vtc2FuIHN1c2NpcGl0IHNlbSBlbGVtZW50dW0gbWF1cmlzIHV0IHNvZGFsZXMgYW50ZSBOdWxsYSBwb3J0YSBJbiBjb25kaW1lbnR1bSBDcmFzIHBlbGxlbnRlc3F1ZSBDcmFzIHN1c2NpcGl0IG1ldHVzIHB1bHZpbmFyIHZlbGl0IG1pIGVsZWlmZW5kIHBvcnRhIHNlbSBjdXJzdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAzLTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA4LTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiQ29uc2lnbm1lbnRJdGVtXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25Hb29kc0l0ZW1OdW1iZXJcIjogNDIwNjksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25UeXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidGluY2lkdW50IHBvcnRhIHBsYWNlcmF0IHNhcGllbiBmYXVjaWJ1cyBjb25kaW1lbnR1bSBWaXZhbXVzIHZlbCBjb21tb2RvIGxvYm9ydGlzIG1pIFByb2luIHZlbCBuZWMgZmV1Z2lhdCBtYXVyaXMgdGVsbHVzIGxpZ3VsYSBxdWlzIG9kaW8gU2VkIGNvbmd1ZSBuaWJoIHZlaGljdWxhIHNlZCBoaW1lbmFlb3MgY29uZGltZW50dW0gc29kYWxlcyBzdXNjaXBpdCBmZXVnaWF0IGFtZXQgdm9sdXRwYXQgbGlndWxhIGxhY2luaWEgYW1ldCBibGFuZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDgtMTRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA1LTExVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGlzcGF0Y2hcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiVXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wNy0xM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0xMC0wOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDkyLjIxNTg2MjYzMzc2MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJuZWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJuaWJoIHN1c2NpcGl0IGEgZWdldCBwaGFyZXRyYSBuaXNpIGVzdCB2ZXN0aWJ1bHVtIG9yY2kgc2FnaXR0aXMgdGVsbHVzIEluIHNhcGllblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAxLTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOS0xN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRlc3RpbmF0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIlV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMTktMDMtMTRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDMtMjVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjAzNjEwMDkxNDM0NjEwMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibGVvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiVml2YW11cyBsZW8gbmliaCB0cmlzdGlxdWUgZXQgcXVpcyBtYXVyaXMgYmxhbmRpdCBEb25lYyBmZXJtZW50dW0gVml2YW11cyBhbGlxdWFtIGNvbW1vZG8gdGVtcG9yIGZyaW5naWxsYSBzZWQgRG9uZWMgbWF1cmlzIGVyYXQgbGFjdXMgbmVjIHZlc3RpYnVsdW0gdXQgdmVzdGlidWx1bSBQZWxsZW50ZXNxdWUgcmhvbmN1cyB1dCBwdWx2aW5hciBtZXR1cyBwdWx2aW5hciBsYW9yZWV0IGxpdG9yYSBub24gY29uZGltZW50dW0gcG9zdWVyZSBuZWMgZmV1Z2lhdCBkb2xvciBuaWJoIHRvcnF1ZW50IGZldWdpYXQgcmlzdXMgZXJvcyBEdWlzIENsYXNzIGR1aSBudWxsYSB2ZWxpdCB0YWNpdGkgY29uc2VjdGV0dXIgbmliaCBzaXQgZmVsaXMgdGVsbHVzIHNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA2LTIwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMC0wOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclVDUlwiOiBcImFjIHNhcGllbiBxdWlzIHNpdCB2dWxwdXRhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtUHJpY2VFVVJcIjogNTcuNjUyMzYyNzQyMjk5NCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImZyaW5naWxsYSBwaGFyZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVsaXQgdWx0cmljaWVzIHJpc3VzIGFudGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJkdWkgZXQgc2FnaXR0aXMgbW9sbGlzIFF1aXNxdWUgdmVoaWN1bGEgZmFjaWxpc2lzIG1vbGxpcyBJbiBEb25lYyBzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwidG9ydG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwibGl0b3JhIE51bGxhIHNhcGllblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJyaXN1cyBhdCBub24gU2VkIG5lYyBDdXJhYml0dXIgTWFlY2VuYXMgdGluY2lkdW50IGFyY3UgdmVoaWN1bGEgZnJpbmdpbGxhIGFjIFZlc3RpYnVsdW0gRG9uZWMgRG9uZWMgbGFjdXMgY29uZGltZW50dW0gbmVjIHF1aXMgZmFjaWxpc2lzIGFjIGNvbW1vZG8gbGlndWxhIGZhY2lsaXNpcyBzb2xsaWNpdHVkaW4gZWxlbWVudHVtIGxhb3JlZXQgY29uZGltZW50dW0gVml2YW11cyBlcm9zIGFsaXF1YW0gZmFjaWxpc2lzIHZ1bHB1dGF0ZSBtYWduYSBmYWNpbGlzaXMgcG9ydGEgYmxhbmRpdCBlbGVpZmVuZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDItMjhUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzU3NjYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzZW0gbWF1cmlzIHZlbCBldCBldCB2aXRhZSBxdWlzIHB1bHZpbmFyIG1ldHVzIHF1aXMgZmV1Z2lhdCBpcHN1bSB2dWxwdXRhdGUgbmVjIGVnZXQgZGlhbSBzZW1wZXIgbnVuYyBsaWd1bGEgYW50ZSBzZWQgTnVsbGFtIHBsYWNlcmF0IE1hZWNlbmFzIGZyaW5naWxsYSBwZWxsZW50ZXNxdWUgc2VkIFByb2luXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNy0wMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMS0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImxhb3JlZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU3OTYwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibnVsbGEgYWMgZXN0IFZpdmFtdXMgdHJpc3RpcXVlIHNvZGFsZXMgbWFzc2EgRHVpcyBxdWFtIGZldWdpYXQgYXQgY29uZGltZW50dW0gdml2ZXJyYSBlbGl0IGNvbnNlY3RldHVyIGp1c3RvIHRlbXB1cyB2aXRhZSByaG9uY3VzIHRyaXN0aXF1ZSBlcm9zIHNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDgtMDFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDgtMjFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJ2aXRhZSB2aXRhZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29tbW9kaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25PZkdvb2RzXCI6IFwibGVvIGRvbG9yIHZlbCBlc3Qgc2FwaWVuIGNvbmRpbWVudHVtIG5pYmggbnVsbGEgc2FwaWVuIHRlbGx1cyBkaWFtIGVsZWlmZW5kIHZlaGljdWxhIGVsZW1lbnR1bSBhYyB2aXRhZSB2ZWhpY3VsYSBQcmFlc2VudCBmYXVjaWJ1cyBhbWV0IHZpdGFlIGV0IHByZXRpdW0gVml2YW11cyBsYW9yZWV0IG1ldHVzIGZhdWNpYnVzIHBvcnRhIEFsaXF1YW0gcGhhcmV0cmEgY29uZGltZW50dW0gdGFjaXRpIHF1aXMgZWxpdCBmZWxpcyBjb25zZWN0ZXR1ciBsYW9yZWV0IFBlbGxlbnRlc3F1ZSByaXN1cyBDbGFzcyBtYXNzYSBzaXQgZmV1Z2lhdCBzb2RhbGVzIHNpdCByaXN1cyBkb2xvciBlZ2VzdGFzIFNlZCBvZGlvIFF1aXNxdWUgaWQgYSBuaWJoIHNlZCBEdWlzIGRhcGlidXMgZmFjaWxpc2lzIG5vc3RyYSBzaXQgSW50ZWdlciBQZWxsZW50ZXNxdWUgbGFjdXMgbGFjaW5pYSBlc3QgZXJvcyBlbGl0IG1hdXJpcyBOYW0gZWdlc3RhcyB1bGxhbWNvcnBlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXNDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlbGVtZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsaXQgYmliZW5kdW0gc2VtIGRvbG9yIHVsdHJpY2llcyBtZXR1cyBpbXBlcmRpZXQgY29uc2VxdWF0IEN1cmFiaXR1ciBjb252YWxsaXMgbmlzbCB2ZWwgYmxhbmRpdCBpZCB1cm5hIGV1IGxvcmVtIHNjZWxlcmlzcXVlIG5pYmggYmxhbmRpdCBkaWFtIGVyYXQgcmlzdXMgTW9yYmkgaW1wZXJkaWV0IHNpdCB2ZWhpY3VsYSBncmF2aWRhIGlkIHByZXRpdW0gc2l0IEFlbmVhbiBjb21tb2RvIGhlbmRyZXJpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOC0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTIzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImhhcm1vbmlzZWRTeXN0ZW1TdWJIZWFkaW5nQ29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNhcGllblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZXUgcG9zdWVyZSBkaWN0dW0gbWFzc2EgZWxlaWZlbmQgaXBzdW0gbmVjIENyYXMgYWxpcXVldCBuaWJoIGlwc3VtIHZlbCBpcHN1bSBuaWJoIGxhb3JlZXQgdmVzdGlidWx1bSB2ZWhpY3VsYSBzdXNjaXBpdCBvZGlvIGxpdG9yYSB1cm5hIGV1IGdyYXZpZGEgYWRpcGlzY2luZyB2dWxwdXRhdGUgdWx0cmljZXMgbmliaCBsZWN0dXMgc2l0IHNpdCBtb2xlc3RpZSBVdCBsYWNpbmlhIGVyb3MgTWF1cmlzIGhlbmRyZXJpdCBEdWlzIE1hZWNlbmFzIHF1aXMgc2l0IG5lYyBwcmV0aXVtIHNhcGllbiBzYWdpdHRpcyBtYXVyaXMgcG9ydGEgdnVscHV0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNC0xOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21iaW5lZE5vbWVuY2xhdHVyZUNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFjaW9uYWxDb2RlXCI6IFwiYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImV4Y2lzZUdvb2RzUXVhbnRpdHlcIjogOS4yMzMwNjczMjQwMjc5MlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGFuZ2Vyb3VzR29vZHNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0NzUyMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVTk51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaXNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRG9uZWMgdmVsIHV0IHBvcnR0aXRvciBsYW9yZWV0IG1pIERvbmVjIENyYXMgbmliaCB2aXRhZSBpbiBhbWV0IE51bGxhbSBzYXBpZW4gdmVuZW5hdGlzIFBoYXNlbGx1cyB2dWxwdXRhdGUgZ3JhdmlkYSBlbGVtZW50dW0gZWdldCBVdCBjb25kaW1lbnR1bSBoZW5kcmVyaXQgZmVybWVudHVtIGludGVyZHVtIHZlbCBkb2xvciBzY2VsZXJpc3F1ZSBhZGlwaXNjaW5nIGxhb3JlZXQgbG9ib3J0aXMgdHJpc3RpcXVlIHZpdGFlIGFtZXQgdXJuYSBtaSB2YXJpdXMgdGVtcHVzIFByb2luIGFkaXBpc2NpbmcgYW1ldCB1bGxhbWNvcnBlciBpZCBzZWQgbmVjIGxlbyBhbnRlIGVsaXQgYW1ldCBtYXNzYSBhbWV0IHZlbmVuYXRpcyBkaWN0dW0gYW1ldCBtYXVyaXMgdWxsYW1jb3JwZXIgZXUgTG9yZW0gZXN0IGlkIG1pIGNvbmRpbWVudHVtIHB1bHZpbmFyIGZldWdpYXQgbW9sZXN0aWUgU2VkIHF1aXMgRXRpYW0gRXRpYW0gSW50ZWdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA3LTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOS0yMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTYwMTMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFtZXQgdml0YWUgZ3JhdmlkYSBlbGl0IHNpdCBtYXVyaXMgcXVhbSBsb3JlbSBldSBQaGFzZWxsdXMgZHVpIHV0IG9yY2kgYW1ldCBtZXR1cyBzZW1wZXIgc2VkIHBlbGxlbnRlc3F1ZSBsYW9yZWV0IHZpdGFlIFF1aXNxdWUgYSBncmF2aWRhIGRpZ25pc3NpbSBzYXBpZW4gdWx0cmljaWVzIHNpdCB1dCBlZ2V0IHRyaXN0aXF1ZSBlbGl0IEN1cmFiaXR1ciBtZXR1cyBpZCBzYXBpZW4gc2FwaWVuIHF1aXMgZnJpbmdpbGxhIGF1Y3RvciB2ZXN0aWJ1bHVtIG5vbiBRdWlzcXVlIG1ldHVzIGp1c3RvIFZpdmFtdXMgbmVjIHV0IGVnZXQgYWNjdW1zYW4gTWFlY2VuYXMgYWMganVzdG8gcGhhcmV0cmEgU2VkIHBvc3VlcmUgbmliaCBmZWxpcyBpZCB1dCBmYWNpbGlzaXMgYXQgc2FwaWVuIGVyYXQgQ2xhc3Mgc2FwaWVuIG5lYyBwb3J0YSBNYWVjZW5hcyBQZWxsZW50ZXNxdWUgVml2YW11cyBkaWFtIE51bGxhIFNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAxLTE0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMC0xMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR29vZHNNZWFzdXJlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdyb3NzTWFzc1wiOiAwLjk5OTQ1NjYwOTEzMzM3OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5ldE1hc3NcIjogMC42NjgxMzcxMTQzNDA1MDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdXBwbGVtZW50YXJ5VW5pdHNcIjogMC4wMDAwOTExNzI3NDkwNzkzNzg3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUGFja2FnaW5nXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU1MDMwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJtaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidml0YWUgdnVscHV0YXRlIGFtZXQgTnVuYyBjb25kaW1lbnR1bSBzaXQgc2VkIHZlbCBmZWxpcyBQcm9pbiBlZ2VzdGFzIGhlbmRyZXJpdCBlcmF0IHBlciBtZXR1cyBlbGVtZW50dW0gYW1ldCB0ZWxsdXMgU2VkIG1ldHVzIHNlZCBzaXQgc3VzY2lwaXQgaW4gcHVsdmluYXIgbWFzc2EgYXQgcXVhbSBlbGVtZW50dW0gZGFwaWJ1cyB1dCBhbnRlIEludGVnZXIgTWFlY2VuYXMgdWxsYW1jb3JwZXIgbmVjIGFtZXQgcG9ydGEgZWxpdCBzb2xsaWNpdHVkaW4gYXVndWUgbWFzc2EgZWdlc3RhcyB1bHRyaWNpZXMgc3VzY2lwaXQgcGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNC0xM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOC0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDQxNjUzMzg2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcInZpdGFlIGlwc3VtIGRpYW0gZWxlbWVudHVtIHZlbGl0IHNlZCBuZWMgcXVpcyBlZ2V0IGFjY3Vtc2FuIGVsaXQgbGFjdXMgdm9sdXRwYXQgUHJvaW4gcmhvbmN1cyB0b3J0b3IgTW9yYmkgZXUgcGhhcmV0cmEgc2l0IHZlbCBzdXNjaXBpdCBlbGVtZW50dW0gYmxhbmRpdCBkb2xvciBncmF2aWRhIGlkIHRlbXB1cyBzaXQgYWRpcGlzY2luZyBuZWMgRHVpcyB0cmlzdGlxdWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU4MDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkdWkgbWV0dXMgZXJhdCBlcmF0IEFsaXF1YW0gTnVsbGEgY29tbW9kbyBQcmFlc2VudCBpbiB2dWxwdXRhdGUgY29uc2VxdWF0IERvbmVjIEludGVnZXIgcmlzdXMgdWxsYW1jb3JwZXIgYW50ZSBzZW0gc29kYWxlcyB0ZW1wb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA4LTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA5LTI5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMzk4MzM5NzAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwiZWdldCByaXN1cyBwdXJ1cyBEb25lYyBlZ2VzdGFzIHBvdGVudGkgc2VkIHNlZCBzYXBpZW4gdnVscHV0YXRlIGFjY3Vtc2FuIGFyY3UgZXJhdCB1dCBzYXBpZW4gTWFlY2VuYXMgbWkgc2VkIGlkIGF1Y3RvciBuZWMgc2NlbGVyaXNxdWUgZWdlc3RhcyBhdCBwdWx2aW5hciBlc3QgcHJldGl1bSBldWlzbW9kIHRvcnRvciBjb252YWxsaXMgTnVsbGEgU2VkIGFjIGVnZXQgZWxlbWVudHVtIGVnZXQgbmVxdWUgVmVzdGlidWx1bSBkaWFtIGxhY3VzIG1hdXJpcyB2ZXN0aWJ1bHVtIHNhZ2l0dGlzIHRpbmNpZHVudCBjdXJzdXMgYXQgaW4gZWdldCBpcHN1bSBwaGFyZXRyYSBhY2N1bXNhblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUHJldmlvdXNEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5MDYyMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJvZGlvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJtZXR1cyBkYXBpYnVzIGxvYm9ydGlzIGVzdCBxdWlzIHZlaGljdWxhIGR1aSBkdWkgZGljdHVtIGRpYW0gbmliaCBtaSBNYWVjZW5hcyBhbnRlIGFudGUgYmxhbmRpdCBjb21tb2RvIHZlaGljdWxhIHNlbSBhbGlxdWFtIHBvcnRhIEFsaXF1YW0gU2VkIGxvcmVtIFZpdmFtdXMgaWQgc2l0IGRvbG9yIHVybmEgcXVhbSBlbGVtZW50dW0gYW50ZSBvZGlvIGNvbnZhbGxpcyB2ZXN0aWJ1bHVtIE51bmMgUGhhc2VsbHVzIHZlaGljdWxhIHRlbGx1cyBoZW5kcmVyaXQgTnVsbGEgbWFnbmEgdXQgdWxsYW1jb3JwZXIgQWVuZWFuIFBlbGxlbnRlc3F1ZSBEb25lYyBlZ2VzdGFzIHJpc3VzIHBvcnRhIHRyaXN0aXF1ZSBlZ2V0IHZlaGljdWxhIGFjIG51bmMgU3VzcGVuZGlzc2Ugdml0YWUgbm9uIG1pIGVyb3MgZGFwaWJ1cyBwZWxsZW50ZXNxdWUgdWx0cmljaWVzIHJob25jdXMgc2VtIHZlaGljdWxhIGZhdWNpYnVzIGNvbnNlcXVhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTEtMTdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDgtMThUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiaWQgY29tbW9kb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDIzMDg1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidHVycGlzIGlkIG5pc2kgc3VzY2lwaXQgdGFjaXRpIG5pc2lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAzLTA2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogODkyOTkxNTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuZWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInJob25jdXMgUHJvaW4gdnVscHV0YXRlIGRpY3R1bSBzZW0gZ3JhdmlkYSBzZWQgYSBhdWN0b3IgdmVzdGlidWx1bSBvcm5hcmUgbGlndWxhIHB1cnVzIGFsaXF1YW0gcXVpcyB2YXJpdXMgRHVpcyBzYXBpZW4gQ3JhcyBQcmFlc2VudCBDdXJhYml0dXIgdmVzdGlidWx1bSBlbGVpZmVuZCBwbGFjZXJhdCBBbGlxdWFtIGFjY3Vtc2FuIG1hdHRpcyBhYyB2aXRhZSBsYWN1cyBQcmFlc2VudCBOdWxsYW0gbGlndWxhIE51bmMgRG9uZWMgUGhhc2VsbHVzIHNhcGllbiBwdWx2aW5hciBldWlzbW9kIHNlbXBlciB1cm5hIGVzdCBlbGVpZmVuZCBzYXBpZW4gTG9yZW0gTWFlY2VuYXMgY29tbW9kbyBhbWV0IGFjIGlkIGltcGVyZGlldCBsYWN1cyBtYXVyaXMgdG9ydG9yIGFudGUgVmVzdGlidWx1bSBwb3N1ZXJlIGFtZXQgdmVsIFNlZCBuaXNsIEN1cmFiaXR1ciB2ZWhpY3VsYSBQZWxsZW50ZXNxdWUgaW4gYmliZW5kdW0gTG9yZW0gYXVndWUgYW50ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDktMThUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDktMTNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogMC4wMDkxMTczMDAzODg5MjM1MixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiZXUgbGFjaW5pYSBqdXN0byBsaWd1bGEgY29tbW9kbyBlZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzU2MjcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2VkIGJsYW5kaXQgbnVuYyB0ZWxsdXMgZ3JhdmlkYSBOdWxsYSBTZWQgYSBiaWJlbmR1bSBzaXQgRHVpcyBtb2xlc3RpZSBjb25kaW1lbnR1bSBFdGlhbSBhZGlwaXNjaW5nIHZlbCBqdXN0byB0dXJwaXMgZXJvcyB2ZWwgbWF0dGlzIGNvbmRpbWVudHVtIG1hc3NhIGNvbnNlY3RldHVyIG5lYyBlbGl0IFNlZCBjb252YWxsaXMgdm9sdXRwYXQgUXVpc3F1ZSBwb3J0YSBldSBDcmFzIEN1cmFiaXR1ciBEb25lYyBvcmNpIHNpdCBuaXNpIER1aXMgUHJhZXNlbnQgaXBzdW0gbm9uIGNvbnNlcXVhdCBTdXNwZW5kaXNzZSBiaWJlbmR1bSBsZWN0dXMgTnVuYyBwaGFyZXRyYSBEdWlzIG5vbiBTZWQgbmVxdWUgdml0YWUgc2l0IGJsYW5kaXQgU2VkIHVybmEgUHJhZXNlbnQgcHVsdmluYXIgRG9uZWMgZXJvcyBDdXJhYml0dXIgUHJvaW4gZWxpdCBDdXJhYml0dXIgZGljdHVtIEluIE51bmMgUGVsbGVudGVzcXVlIGF1Y3RvciB1cm5hIG1hc3NhIHRyaXN0aXF1ZSBzY2VsZXJpc3F1ZSBub24gZWdlc3RhcyB2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAyLTA0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImV1IGNvbnViaWEgbGFvcmVldCBjb25ndWUgc29kYWxlcyBzaXQgYWRpcGlzY2luZyBwZWxsZW50ZXNxdWUgZGlhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDgxNzk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbmRpbWVudHVtIGR1aSBjb21tb2RvIHZlbmVuYXRpcyBqdXN0byBkaWN0dW0gQ3VyYWJpdHVyIGxpZ3VsYSBlbGl0IEFlbmVhbiB1bGxhbWNvcnBlciB0ZWxsdXMgbWV0dXMgYXQgc29kYWxlcyBudWxsYSB2ZWwgbWF1cmlzIHBvc3VlcmUgbGFjdXMgTnVsbGFtIHN1c2NpcGl0IHNlbSBldCB2aXRhZSB0cmlzdGlxdWUgc2l0IGZyaW5naWxsYSBhbWV0IGRhcGlidXMgdXJuYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMTFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDctMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiA0MDM5MDU0MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lYXN1cmVtZW50VW5pdEFuZFF1YWxpZmllclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm1pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzZW1wZXIgZHVpIGVnZXQgdGluY2lkdW50IHNlbXBlciB1bHRyaWNpZXMgcmlzdXMgbWF0dGlzIGp1c3RvIG1pIGxpZ3VsYSB2ZWhpY3VsYSBpbXBlcmRpZXQgc3VzY2lwaXQgdXQgZXN0IHB1cnVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOC0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNS0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiOiAwLjA2NTYxNzcwNDY1NDg2NTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInBlbGxlbnRlc3F1ZSBpbnRlcmR1bVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU3VwcG9ydGluZ0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDE4MzgzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm51bmNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pc2kgZWdlc3RhcyBjb25kaW1lbnR1bSBhZGlwaXNjaW5nIGFkaXBpc2NpbmcgUHJvaW4gaWFjdWxpcyBlbGVtZW50dW0gbGl0b3JhIHBvcnRhIGVnZXQganVzdG8gZGFwaWJ1cyBwb3J0dGl0b3IgRG9uZWMgbW9sZXN0aWUgbm9uIHN1c2NpcGl0IGVyb3MgbWF1cmlzIHZlbCBoZW5kcmVyaXQgRG9uZWMgYXVndWUgdml0YWUgQ3VyYWJpdHVyIG5lYyBlZ2VzdGFzIGFtZXQgRXRpYW0gbWV0dXMgYWMgVXQgYXJjdSBzb2RhbGVzIHBlbGxlbnRlc3F1ZSBhdWd1ZSBpbnRlcmR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDktMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDItMjRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiaGltZW5hZW9zIG9yY2lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogMzc5NjMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcImVnZXN0YXMgc2l0IGFtZXQgcHVydXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDc5NTk4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIk1vcmJpIG1ldHVzIGFkaXBpc2NpbmcgYW50ZSBhZGlwaXNjaW5nIG1pIGVzdCBibGFuZGl0IGRpYW0gU2VkIG1hdHRpcyBpcHN1bSBibGFuZGl0IGVnZXQgZ3JhdmlkYSBuZWMgYWRpcGlzY2luZyBDcmFzIGVnZXQgZmV1Z2lhdCBydXRydW0gc29sbGljaXR1ZGluIGEgZXQgZGljdHVtIGdyYXZpZGEgbmliaCBtYXVyaXMgdHJpc3RpcXVlIFNlZCBsaWd1bGEgZXUgbmliaCBlZ2VzdGFzIGZhY2lsaXNpcyBudW5jIGZldWdpYXQgZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDUtMjZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibWF1cmlzIGF1Y3RvciBjb25kaW1lbnR1bSBzb2RhbGVzIGFjIHBoYXJldHJhIGFjIG5pYmhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogNjQwMDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInJob25jdXMgbWkgbWFzc2Egbm9uIFNlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFJlZmVyZW5jZVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzMzUwNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2ZWwgaXBzdW0gYW1ldCBzaXQgc2l0IFBlbGxlbnRlc3F1ZSBwZWxsZW50ZXNxdWUgcG9zdWVyZSB2dWxwdXRhdGUgdWx0cmljaWVzIFBlbGxlbnRlc3F1ZSBtYXVyaXMgbGlndWxhIHZlbGl0IGxhY3VzIGZlbGlzIEV0aWFtIGxvcmVtIGFudGUgdml0YWUgZWdldCBmcmluZ2lsbGEgTnVuYyBhbWV0IGNvbmRpbWVudHVtIG1vbGxpcyB1bHRyaWNpZXMgcGxhY2VyYXQgZXQgY29uZGltZW50dW0gZmFjaWxpc2lzIGZlcm1lbnR1bSB1bGxhbWNvcnBlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMjRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDQtMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZGljdHVtIG51bmMgbm9uIFN1c3BlbmRpc3NlIHZ1bHB1dGF0ZSBmYXVjaWJ1cyBwaGFyZXRyYSBjb21tb2RvIGVnZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQwMjk3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVyYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImxhb3JlZXQgY29uZGltZW50dW0gc2VtIGNvbmRpbWVudHVtIHNlbSBtaSBzb2RhbGVzIHR1cnBpcyBydXRydW0gaW50ZXJkdW0gZWxlaWZlbmQgRG9uZWMgYSBkaWFtIGp1c3RvIGxhY3VzIG51bGxhIGVsaXQgYXB0ZW50IGNvbnZhbGxpcyB0ZWxsdXMgbW9sZXN0aWUgYWxpcXVldCBmYWNpbGlzaXMgcG9zdWVyZSB2aXRhZSBpbXBlcmRpZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAzLTEzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAzLTIwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImV0IGxhY3VzIGFkaXBpc2NpbmcgdHJpc3RpcXVlIGVsZW1lbnR1bSBOdWxsYSBxdWlzIFNlZCBkaWduaXNzaW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxJbmZvcm1hdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA3MTI3MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlbGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkaWFtIGVsZWlmZW5kIGRpYW0gcGxhY2VyYXQgdHJpc3RpcXVlIHNlbSBhY2N1bXNhbiBsb3JlbSBuaWJoIHZlc3RpYnVsdW0gbWV0dXMgYSBlbGl0IHRlbXBvciBkaWN0dW0gbmVjIHZpdGFlIHRlbGx1cyBpbXBlcmRpZXQgYXVndWUgZXJhdCBDcmFzIHRvcnRvciBlbGl0IGFjY3Vtc2FuIGFtZXQgdHJpc3RpcXVlIHVybmEgbGFjdXMgaGVuZHJlcml0IGF0IGVnZXQgbnVsbGEgZXJhdCBmZXJtZW50dW0gSW50ZWdlciBtZXR1cyBhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNS0wN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNS0yOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwibmVjIGNvbmRpbWVudHVtIGVsZW1lbnR1bSB1bGxhbWNvcnBlciBzYXBpZW4gcHJldGl1bSBtYXVyaXMgZXUgbGlndWxhIGluIGxhY3VzIHR1cnBpcyBkdWkgZXJvcyBlZ2V0IENyYXMgYWRpcGlzY2luZyBJbiBlZ2VzdGFzIHBlbGxlbnRlc3F1ZSBlbGVtZW50dW0gbGFvcmVldCBuZWMgQWxpcXVhbSBwaGFyZXRyYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTU0MjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2aXRhZSBsYW9yZWV0IGFkaXBpc2Npbmcgc2VkIGlwc3VtIG1hdXJpcyBOdWxsYW0gY29uZGltZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAyLTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJFdGlhbSBuZXF1ZSB2dWxwdXRhdGUgUHJhZXNlbnQgQ3VyYWJpdHVyIGxlbyBhIHVsbGFtY29ycGVyIGFtZXQgdmVsIHNpdCB2dWxwdXRhdGUgRnVzY2Ugc2VtIGV1aXNtb2QgbW9sZXN0aWUgYW1ldCBBZW5lYW4gZW5pbSBhdWd1ZSBtZXR1cyBQZWxsZW50ZXNxdWUgYW1ldCBtZXR1cyBldSBJbiBzZWQgbW9sbGlzIGFsaXF1ZXQgYW1ldCBvZGlvIGR1aSByaXN1cyBuaXNpIGVsZWlmZW5kIFNlZCBpZCBsYW9yZWV0IGEgZ3JhdmlkYSBkaWFtIHRlbGx1cyBldCBpbiBxdWlzIGVnZXN0YXMgZGlhbSBTZWQgcGhhcmV0cmEgcG9ydGEgUHJvaW4gdmVzdGlidWx1bSBhdCBub24gcGVsbGVudGVzcXVlIHV0IFV0IGRhcGlidXMgbG9yZW0gbWFzc2EgZWxlaWZlbmQgbWFnbmEgcmhvbmN1cyBibGFuZGl0IHB1bHZpbmFyIG5pc2kgdGluY2lkdW50IG9yY2kgZGFwaWJ1cyBsZWN0dXMganVzdG8gdHJpc3RpcXVlIGxhb3JlZXQgc2l0IFZpdmFtdXMgZWdldCBjb25kaW1lbnR1bSBtaSBlc3QgZWdldCBzaXQgcGVsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJUcmFuc3BvcnRDaGFyZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVnZXN0YXMgcXVpcyBoaW1lbmFlb3MgZWxlbWVudHVtIEV0aWFtIHZlc3RpYnVsdW0gRG9uZWMgbW9sZXN0aWUgZGljdHVtIHBlbGxlbnRlc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNS0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAyLTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA0NzAyNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvblR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImZhdWNpYnVzIHZlbGl0IG5lYyBsYW9yZWV0IG5vbiBzZW0gZmVsaXMgZWdlc3RhcyBtZXR1cyBudWxsYSBBbGlxdWFtIGxhY3VzIERvbmVjIGVsZW1lbnR1bSBpcHN1bSBpbnRlcmR1bSB0ZWxsdXMgdG9ydG9yIGFudGUgbWF1cmlzIGVnZXQgbmVjIG1pIG5lYyBNb3JiaSBTdXNwZW5kaXNzZSB0ZW1wb3IgcmlzdXMgbmVjIHBvcnR0aXRvciBvcm5hcmUgTnVuYyB0ZWxsdXMgYW50ZSB2aXRhZSBzaXQgdmVsaXQgYW1ldCBhdWd1ZSBhIG1hdXJpcyBsYW9yZWV0IHZpdGFlIGF0IGVsaXQgbnVuYyBjb25zZWN0ZXR1ciB0YWNpdGkgYWRpcGlzY2luZyB1dCBhIHZlbCBxdWFtIGV1IHRlbGx1cyBhbGlxdWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDgtMDlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA5LTI4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGlzcGF0Y2hcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wMi0wOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0wMS0xOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDAyMjUzNzkwOTUwNTIwOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJMb3JlbSBwdWx2aW5hciBsaWd1bGEgdHVycGlzIHN1c2NpcGl0IGNvbmRpbWVudHVtIGF0IGV1IGhlbmRyZXJpdCBtYWduYSBwZXIgUHJhZXNlbnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMS0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDItMTJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEZXN0aW5hdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTA0LTIyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDIwLTA1LTAxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMi43MjU4OTcyNTEwMzUwNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJuaXNsIGV1aXNtb2QgdWx0cmljaWVzIE51bmMgcXVpcyBxdWlzIHRyaXN0aXF1ZSBzaXQgZmVsaXMgU3VzcGVuZGlzc2UgbW9sZXN0aWUgZXJvcyBzdXNjaXBpdCBwaGFyZXRyYSBub24ganVzdG8gYWRpcGlzY2luZyB0cmlzdGlxdWUgbmlzaSBjb25kaW1lbnR1bSBuaWJoIHZlbCBwdWx2aW5hciBtaSB0ZW1wb3Igdml2ZXJyYSB1cm5hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDItMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA3LTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyVUNSXCI6IFwidWx0cmljaWVzIGVyYXQgaW4gYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1QcmljZUVVUlwiOiAwLjAwMDU5NjY2NzgwMTc3MzQ4NixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImF0IHRyaXN0aXF1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmlzbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcImlwc3VtIG1ldHVzIGdyYXZpZGEgVml2YW11cyBldSBub24gbGFvcmVldCBzZW0gbW9sZXN0aWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwibWF1cmlzIGVyb3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJuZWMgbmlzaSBydXRydW0gdml0YWUgaGVuZHJlcml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pc2wgcXVpcyBhdWd1ZSBEb25lYyBjb25zZXF1YXQgb3JjaSBhdWd1ZSBoZW5kcmVyaXQgcHVsdmluYXIgU2VkIGlwc3VtIHZpdGFlIG1hc3NhIGF0IER1aXMgYWRpcGlzY2luZyB2ZWwgYWRpcGlzY2luZyBlZ2V0IGp1c3RvIG5vbiBmYWNpbGlzaXMgU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNS0yN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0yMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsU3VwcGx5Q2hhaW5BY3RvclwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2Njk4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJuaWJoIHZlbCBhYyBQZWxsZW50ZXNxdWUgZXJvcyBub24gdGVsbHVzIHZlaGljdWxhIEluIG1hdXJpcyBFdGlhbSBibGFuZGl0IHNlbSB2aXRhZSB2aXRhZSBmYWNpbGlzaXMgcmlzdXMgZWxpdCB2YXJpdXMgRG9uZWMgcHVydXMgYWMgZWdlc3RhcyBkaWFtIGV1IE51bGxhbSBub24gdG9ydG9yIHNlZCBhcmN1IHNjZWxlcmlzcXVlIGF0IHBoYXJldHJhIHBoYXJldHJhIGVsaXQgbGFvcmVldCBEdWlzIGFyY3UgbW9sZXN0aWUgdXQgb2RpbyB0cmlzdGlxdWUgc2VtIG51bGxhIG5lcXVlIGxvYm9ydGlzIGF0IHZlbCBwZWxsZW50ZXNxdWUgbWFzc2EgRXRpYW0gZWxlbWVudHVtIGF0IFBoYXNlbGx1cyBEb25lYyBTZWQgZmFjaWxpc2lzIGNvbmRpbWVudHVtIHRlbGx1cyBhbWV0IHNhcGllbiBibGFuZGl0IG1hc3NhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0xOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOS0xNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImF1Z3VlIGxhY2luaWEgUGhcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY0MDk5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicGVsbGVudGVzcXVlIHNhcGllbiB1dCBhIGVsaXQgYWMgZHVpIGVsaXQgcXVhbSBwZWxsZW50ZXNxdWUgbGVvIGNvbnZhbGxpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDctMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJQcm9pbiBVdCBhbWV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvbk9mR29vZHNcIjogXCJtZXR1cyBvcm5hcmUgZnJpbmdpbGxhIGVyb3MgZXN0IHZhcml1cyBNb3JiaSBkaWFtIGVsZW1lbnR1bSBuZXF1ZSBRdWlzcXVlIG5pYmggZWxpdCBzZWQgbWFzc2EgbmlzaSBsb3JlbSB0ZW1wb3IgaWQgb2RpbyBpcHN1bSBlbGVpZmVuZCB1cm5hIGR1aSB0aW5jaWR1bnQgUGhhc2VsbHVzIGZldWdpYXQgYWxpcXVldCBtZXR1cyBmYWNpbGlzaXMgZ3JhdmlkYSBhdCBzdXNjaXBpdCBsZW8gbW9sZXN0aWUgYW1ldCBjb25kaW1lbnR1bSBQcmFlc2VudCBhdCBzZW1wZXIgZmFjaWxpc2lzIE1hZWNlbmFzIGZhY2lsaXNpcyB1dCBwZXIgdXQgdXQgZXJhdCBudW5jIHNpdCBzZW0gcG9ydGEgcmlzdXMgdHJpc3RpcXVlIHF1YW0gaWQgdG9ycXVlbnQgcG9zdWVyZSBhZGlwaXNjaW5nIHZpdGFlIHRlbGx1cyBsaWd1bGEgdml0YWUgZmVsaXMgdnVscHV0YXRlIFNlZCBuaWJoIHV0IGRhcGlidXMgbWlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3VzQ29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiUGhhc2VsbHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVsZW1lbnR1bSBlbGVpZmVuZCBQaGFzZWxsdXMgaWQgUGhhc2VsbHVzIGFjY3Vtc2FuIENyYXMgZmVsaXMgYWMgU2VkIGp1c3RvIGVnZXQgc2VkIG5pYmggZXJvcyBtZXR1cyBub24gcGVsbGVudGVzcXVlIHV0IGltcGVyZGlldCBzb2RhbGVzIHZpdGFlIGxvcmVtIGxvcmVtIGFtZXQgb3JjaSBuaWJoIGNvbmd1ZSB2YXJpdXMgbnVuYyB2ZWwgZWxpdCBDdXJhYml0dXIgbG9ib3J0aXMgZWdldCBpbnRlcmR1bSBpZCBwb3J0YSB0YWNpdGkgZnJpbmdpbGxhIHRlbXB1cyBuZWMgYXJjdSBWaXZhbXVzIGlkIGdyYXZpZGEgcnV0cnVtIGV1IGF1Z3VlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTAzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMjBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbW1vZGl0eUNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFybW9uaXNlZFN5c3RlbVN1YkhlYWRpbmdDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYXVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJyaG9uY3VzIGRpY3R1bSBQZWxsZW50ZXNxdWUgc2FwaWVuIGVzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDItMjdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tYmluZWROb21lbmNsYXR1cmVDb2RlXCI6IFwiZXVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hY2lvbmFsQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJleGNpc2VHb29kc1F1YW50aXR5XCI6IDAuMTEwNzE4OTE2MjIxODU3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEYW5nZXJvdXNHb29kc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDExOTU5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVOTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVyYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkaWN0dW0gdml0YWUgZmF1Y2lidXMgUGVsbGVudGVzcXVlIGF0IHB1bHZpbmFyIG1vbGVzdGllIGZhdWNpYnVzIFV0IEV0aWFtIGZldWdpYXQgdGVsbHVzIHNvZGFsZXMgTnVsbGFtIGVnZXQgcGVyIGluIGVzdCBibGFuZGl0IHZvbHV0cGF0IFNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA2LTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNC0yM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVOTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIk51bmNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMy0xNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDgtMTNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdvb2RzTWVhc3VyZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJncm9zc01hc3NcIjogNzcxLjc1MjQ1NDIzNDE3MixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5ldE1hc3NcIjogMC4wMDAwNjI5Nzk0ODAyODA5OTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdXBwbGVtZW50YXJ5VW5pdHNcIjogMC4wMDAwOTAwOTc3MjczNDI1NTQyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUGFja2FnaW5nXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDk3NTY3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwib2RpbyBWaXZhbXVzIE1hZWNlbmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNS0xM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNS0yOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDE4Njc3NDM2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcInNhcGllbiBibGFuZGl0IHV0IG5lYyBzb2RhbGVzIHRvcnRvciBhbWV0IHB1cnVzIHJpc3VzIGdyYXZpZGEgY29uZGltZW50dW0gc2VkIGR1aSBzYXBpZW4gbG9ib3J0aXMgaGVuZHJlcml0IGV1aXNtb2QgZmFjaWxpc2lzIHVsdHJpY2llcyBwcmV0aXVtIGZldWdpYXQgbGFjdXMgY29tbW9kbyBJbiBuaXNsIGFjIFByYWVzZW50IHV0IHNlbXBlciBOdW5jIGR1aSBuZWMgdG9ydG9yIG9kaW8gdmVzdGlidWx1bSBqdXN0byBlZ2V0IGFsaXF1ZXQganVzdG8gcHVsdmluYXIgY29uZGltZW50dW0gbW9sZXN0aWUgdXQgdXQgaW4gbnVsbGEgY29uc2VjdGV0dXIgYXQgUGVsbGVudGVzcXVlIHR1cnBpcyBtYWduYSBvcm5hcmUgZmFjaWxpc2lzIGFjIERvbmVjIHZ1bHB1dGF0ZSB1dCBwZWxsZW50ZXNxdWUgYWMgZWdlc3RhcyBpZCBjb25kaW1lbnR1bSBRdWlzcXVlIHJpc3VzIHJob25jdXMgdml0YWUgYSBqdXN0byBzZWQgRG9uZWMgbmVjIG5vbiBudW5jIHBoYXJldHJhIFNlZCBkb2xvciBlZ2V0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1ODQ4MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhYyBsZW8gcHVsdmluYXIgdmVzdGlidWx1bSB1dCBtaSBldCBhZGlwaXNjaW5nIHByZXRpdW0gY29uZ3VlIGRpYW0gcG9zdWVyZSBub3N0cmEgbWF1cmlzIHNhZ2l0dGlzIGxhY3VzIGNvbW1vZG8gaWQgZWdldCBmYWNpbGlzaXMgbm9uIHZlbCBlZ2V0IHBlbGxlbnRlc3F1ZSBuaXNsIGNvbmd1ZSBuZWMgc2VkIEV0aWFtIFNlZCBBbGlxdWFtIGF0IFByYWVzZW50IHRlbGx1cyBDdXJhYml0dXIgcHJldGl1bSBjb25kaW1lbnR1bSBmZXJtZW50dW0gdG9ydG9yIG1pIGxpZ3VsYSB2YXJpdXMgY29udmFsbGlzIHVybmEgZWdlc3RhcyBlbmltIG1vbGVzdGllXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMS0yOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDM0Njg4NTY4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcIk1hZWNlbmFzIGFtZXQgbm9uIGVnZXQgdGFjaXRpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDg5NzMxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInVybmFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNlZCBsYWNpbmlhIGRpYW0gZWxpdCBhdWd1ZSB2ZWhpY3VsYSBhY2N1bXNhbiBjb25kaW1lbnR1bSBuaXNpIG1hZ25hIG1ldHVzIHV0IG51bmMgc2VtcGVyIHRpbmNpZHVudCBsZW8gZGljdHVtIGlwc3VtIG5vbiBsaWd1bGEgcGVsbGVudGVzcXVlIHZlaGljdWxhIFF1aXNxdWUgYXJjdSB1bHRyaWNpZXMgdnVscHV0YXRlIGEgU2VkIGNvbnNlcXVhdCBzZW0gcXVpcyBub24gdHJpc3RpcXVlIGxpZ3VsYSBEb25lYyBtYWduYSBzb2RhbGVzIHZlbmVuYXRpcyBwcmV0aXVtIGltcGVyZGlldCBsZW8gbGVjdHVzIGF1Y3RvciBtYXVyaXMgYWMgZGFwaWJ1cyBuZWMgc29sbGljaXR1ZGluIG1hdXJpcyBmZXJtZW50dW0gbGVvIHVsdHJpY2llcyB2YXJpdXMgbGFvcmVldCBlbmltIGV1IGF1Z3VlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMS0xNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJuZWMgYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiA2MzExOSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1hc3NhIGNvbmRpbWVudHVtIHRlbXBvciBzdXNjaXBpdCBjb25zZXF1YXQgc29sbGljaXR1ZGluIHRlbGx1cyBldCBsaWd1bGEgYW50ZSBGdXNjZSB1bGxhbWNvcnBlciBtYXVyaXMgUHJhZXNlbnQgc2FnaXR0aXMgbmVjIEluIEluIHZpdGFlIGxhY2luaWEgZXJhdCBJbnRlZ2VyIHNlZCBub24gbGFjdXMgcHVsdmluYXIgYmxhbmRpdCBub24gSW4gZWxpdCBmZXVnaWF0IHRpbmNpZHVudCB1dCBkdWkgbmliaCBlbGl0IGlwc3VtIHJob25jdXMgZHVpIFByb2luIE1hZWNlbmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOS0yMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0xMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDU5NDA2NDQxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmVjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJmYWNpbGlzaXMgRHVpcyBzYWdpdHRpcyBkdWkgRG9uZWMgZmFjaWxpc2lzIG5lYyBsZW8gc2l0IHNpdCBTZWQgaW50ZXJkdW0gdmVsaXQgZXJhdCBzZWQgZXJhdCBpcHN1bSBsb3JlbSB0b3J0b3Igdml0YWUgY29uZGltZW50dW0gTnVsbGEgSW4gdWxsYW1jb3JwZXIgc2VtIHRyaXN0aXF1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDMtMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogNi44Nzk4OTgyNTcwMzE5OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiZGlhbSBhbWV0IG1hdXJpcyB1dCBuaWJoIHByZXRpdW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDg0MjcwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkR1aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkRvbmVjIGVzdCBlbGl0IE51bmMgY29uZGltZW50dW0gZGljdHVtIGNvbmd1ZSBzaXQgZ3JhdmlkYSB2ZXN0aWJ1bHVtIGp1c3RvIGFyY3UgaW4gZmVybWVudHVtIGZldWdpYXQgcmlzdXMgdmVoaWN1bGEgZWxlbWVudHVtIHF1aXMgdnVscHV0YXRlIGV1aXNtb2QgZmFjaWxpc2lzIGFtZXQgdWxsYW1jb3JwZXIgZmF1Y2lidXMgc2FwaWVuIG9yY2kgc29sbGljaXR1ZGluIGFkaXBpc2NpbmcgU3VzcGVuZGlzc2UgZmV1Z2lhdCBNYWVjZW5hcyBzZW1wZXIgdml0YWUgZWdlc3RhcyBxdWlzIGp1c3RvIGFkaXBpc2NpbmcgY29tbW9kbyBTdXNwZW5kaXNzZSBOdW5jIGFjY3Vtc2FuIHRpbmNpZHVudCBldSBwaGFyZXRyYSBhdWd1ZSBOYW0gTWF1cmlzIFV0IGVuaW0gcGVsbGVudGVzcXVlIHNlbSBBbGlxdWFtIFV0IG1ldHVzIGZlcm1lbnR1bSBlbGVpZmVuZCBQcm9pbiBtYXVyaXMgUHJhZXNlbnQgRXRpYW0gRHVpcyB2aXRhZSBldSBtZXR1cyBwaGFyZXRyYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDEtMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibGVvIGRpYW0gdHJpc3RpcXVlIGxhb3JlZXQgc2FwaWVuIHNvZGFsZXMgVXQgdGVtcHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogNDUwNTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJqdXN0byBsZW8gdWxsYW1jb3JwZXIgdGluY2lkdW50IERvbmVjIGEgZW5pbSBpbnRlcmR1bSBsaWd1bGEgbGFjdXMgcHVsdmluYXIgaGVuZHJlcml0IHVybmEgY29uZGltZW50dW0gaW4gZWxlaWZlbmQgUGVsbGVudGVzcXVlIG9kaW8gY3Vyc3VzIExvcmVtIGVyb3MgcmlzdXMgbmliaCBldSBvZGlvIHRvcnRvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDgtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDMtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiAyODAxNjQzMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lYXN1cmVtZW50VW5pdEFuZFF1YWxpZmllclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pc2xcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbmRpbWVudHVtIGV0IGxhY3VzIGFtZXQgdG9ydG9yIGZldWdpYXQgc2FwaWVuIG1ldHVzIGVyb3MgSW4gY29udmFsbGlzIHNlbSBtb2xlc3RpZSBwbGFjZXJhdCBmYXVjaWJ1cyBWaXZhbXVzIHVsdHJpY2llcyBwb3J0dGl0b3IgY29tbW9kbyBuaWJoIGRhcGlidXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAzLTA0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCI6IDAuMDQyNjY4MzU4NTM1ODE3MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiaXBzdW0gZGFwaWJ1cyBRdWlzcXVlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTdXBwb3J0aW5nRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjMzNTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGFvcmVldCBjb21tb2RvIHB1bHZpbmFyIGF1Y3RvciBWaXZhbXVzIHRvcnRvciBhbWV0IG1hdXJpcyBhdCBRdWlzcXVlIEludGVnZXIgbWF1cmlzIHRyaXN0aXF1ZSBTdXNwZW5kaXNzZSB1bHRyaWNlcyBzaXQgZXN0IFNlZCB0ZW1wb3Igb2RpbyBoZW5kcmVyaXQgZXUgZWdldCBhYyBzb2xsaWNpdHVkaW4gdmVsaXQgdml0YWUgc2VkIHJpc3VzIHRpbmNpZHVudCBzaXQgcHJldGl1bSB0b3J0b3Igc2VtcGVyIHNlbXBlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDMtMjhUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDMtMDhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwicGVsbGVudGVzcXVlIGNvbnNlY3RldHVyIGFjY3Vtc2FuIEN1cmFiaXR1ciBxdWFtIHRlbXB1cyBhYyB0aW5jaWR1bnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogNTk0NDgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInNlZCBlc3QgdmVsaXQgbmVjIHByZXRpdW0gbnVuY1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDI1MDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicmlzdXMgdm9sdXRwYXQgZGlhbSBkaWFtIHRlbXB1cyBvcmNpIGV1IFBoYXNlbGx1cyB1dCBOdWxsYW0gZWxpdCBpZCB1bGxhbWNvcnBlciB2dWxwdXRhdGUgU2VkIG5lcXVlIGVsZWlmZW5kIG5lYyBJbiB1dCBhZGlwaXNjaW5nIFBlbGxlbnRlc3F1ZSBzY2VsZXJpc3F1ZSBtaSBJbnRlZ2VyIGVnZXQgaW4gc29sbGljaXR1ZGluIFBlbGxlbnRlc3F1ZSBub24gdWx0cmljZXMgdmVzdGlidWx1bSBlZ2V0IG9kaW8gc2VtcGVyIHZpdGFlIERvbmVjIGluIG1ldHVzIG5lYyB2aXRhZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTEtMThUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDItMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidmVsIHF1aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogMTkxMTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInVybmEgbGlndWxhIG5pYmggZWxlbWVudHVtXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU5MDczLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0dXJwaXMgZWdlc3RhcyBldSBhdWd1ZSBlbGVtZW50dW0gbmVxdWUgbGl0b3JhIE51bGxhbSBzb2RhbGVzIHBvcnR0aXRvciBTZWQgdGVsbHVzIEN1cmFiaXR1ciBzYXBpZW4gRXRpYW0gdWx0cmljaWVzIGVsaXQgZWdlc3RhcyBuZWMgVml2YW11cyBqdXN0byBzaXQgc2NlbGVyaXNxdWUgbWkgU3VzcGVuZGlzc2Ugc2l0IGRvbG9yIG5pc2wgbWkgcmlzdXMgdWx0cmljaWVzIGNvbW1vZG8gc3VzY2lwaXQgdmVsIG5lYyBmYXVjaWJ1cyB2ZWwgYXQgSW50ZWdlciBOdW5jIGF1Z3VlIGlwc3VtIG5pc2wgc2NlbGVyaXNxdWUgcHJldGl1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDUtMjFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDQtMTBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidml2ZXJyYSBqdXN0byBlcm9zXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzNDg0OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGFjdXMgZXJhdCBtaSBpZCBwcmV0aXVtIG1vbGVzdGllIG1pIG1hdXJpcyB1dCBhdWd1ZSBmZXJtZW50dW0gU2VkIGFsaXF1YW0gc2VtIHV0IHNlZCBtYXVyaXMgVmVzdGlidWx1bSBtb2xlc3RpZSBRdWlzcXVlIHJpc3VzIGp1c3RvIG51bmMgcGhhcmV0cmEgdGluY2lkdW50IGFyY3UgZG9sb3IgbGlndWxhIGVnZXQgZmV1Z2lhdCBmZXJtZW50dW0gTWF1cmlzIGV1IGEgYmxhbmRpdCBwZWxsZW50ZXNxdWUgcmlzdXMgQ3JhcyBhZGlwaXNjaW5nIHBoYXJldHJhIHZlbCB1bGxhbWNvcnBlciB2ZWwgZWdldCBldSBlZ2V0IHZlaGljdWxhIGFsaXF1ZXQgVmVzdGlidWx1bSBkdWkgcXVpcyBlbGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMi0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMi0yMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJmYXVjaWJ1cyB0b3JxdWVudCBNb3JiaSBhY2N1bXNhbiBtZXR1cyBjb25zZWN0ZXR1ciBVdCBlbGl0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsSW5mb3JtYXRpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDk4NDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiRHVpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiU2VkIG5lYyBsYW9yZWV0IGFjIGp1c3RvIGNvbW1vZG8gZWxlbWVudHVtIFNlZCBuaWJoIHNlZCBmYXVjaWJ1cyByaXN1cyBQaGFzZWxsdXMgRG9uZWMgY3Vyc3VzIGN1cnN1cyBtZXR1cyBsaWd1bGEgcXVpcyBTZWQgQ3JhcyBEb25lYyBxdWlzIFBoYXNlbGx1cyBTZWQgVmVzdGlidWx1bSB0aW5jaWR1bnQgcHJldGl1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDgtMjNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcInV0IHBvcnR0aXRvciBwdWx2aW5hciBuZWMgaGVuZHJlcml0IG1hZ25hIHRyaXN0aXF1ZSBuZWMgZXJvcyBlbGl0IGxhb3JlZXQgZGlhbSBzaXQgTnVsbGEgQ3JhcyByaXN1cyBuZWMganVzdG8gc2VtIGdyYXZpZGEgZmF1Y2lidXMgdml0YWUgbmVjIGZhY2lsaXNpc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTcxMDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibnVuY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2l0IHB1bHZpbmFyIGVsZWlmZW5kIHNpdCBncmF2aWRhIHV0IGF1Y3RvciBhbWV0IHNhZ2l0dGlzIHZlbGl0IHNvbGxpY2l0dWRpbiB0aW5jaWR1bnQgYWMgZGljdHVtIHF1YW0gZXQgZGljdHVtIGFtZXQgcGhhcmV0cmEgSW50ZWdlciBjb21tb2RvIGxlbyBjb25ndWUgdml0YWUgZW5pbSBzb2RhbGVzIGRhcGlidXMgQWVuZWFuIG9kaW8gcmlzdXMgQ3JhcyBhbWV0IHRlbXB1cyBmYWNpbGlzaXMgdXQgb2RpbyBvcm5hcmUgSW4gZXJvcyBhIGV1IG5pc2wgc3VzY2lwaXQgZmVybWVudHVtIGxpdG9yYSBJbiBsYWN1cyBhZGlwaXNjaW5nIHV0IGFsaXF1ZXQgbmliaCBDdXJhYml0dXIgdGVsbHVzIGFjIGZhY2lsaXNpcyBJbnRlZ2VyIHRyaXN0aXF1ZSBtYXVyaXMgbmlzaSBldSBpZCBsb3JlbSBEb25lYyBlbGl0IHNlbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTAtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDktMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcImNvbnNlY3RldHVyIG1hdXJpcyBvZGlvIGRpY3R1bSBwdWx2aW5hciB1bHRyaWNpZXMgYW1ldCBNYWVjZW5hcyBlZ2VzdGFzIHV0IHRvcnF1ZW50IHZvbHV0cGF0IHZlc3RpYnVsdW0gY29udmFsbGlzIHF1aXMgZmVybWVudHVtIHRlbGx1cyBRdWlzcXVlIGxhb3JlZXQgZGlhbSBlbGl0IGFjIGFkaXBpc2NpbmcgbGliZXJvIGVsaXQgdGluY2lkdW50IGNvbnNlcXVhdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVHJhbnNwb3J0Q2hhcmdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1ldGhvZE9mUGF5bWVudFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlZ2V0IGVsaXQgQ3VyYWJpdHVyIHBvcnRhIG51bGxhIGZyaW5naWxsYSBmcmluZ2lsbGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMy0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDIsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRpc3BhdGNoXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wMS0zMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMDItMjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wMDc5MjM2MzU4NTM0MTg5MSxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImdyYXZpZGFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDgtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0yMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiZ3Jvc3NNYXNzXCI6IDQ5NS4yNjkyODg1Mzk1NDYsXHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclVDUlwiOiBcImZldWdpYXQgY29uZGltZW50dW0gcG9zdWVyZSBhbWV0IFNcIixcclxuICAgICAgICAgICAgICAgIFwiQ29uc2lnbm9yXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiY29uZGltZW50dW0gbWV0dXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdWd1ZSB2b2x1dHBhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiRXRpYW0gZGFwaWJ1cyBJbnRlZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJtb2xlc3RpZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJwdWx2aW5hciBlbGl0IGVuaW0gbG9ib3J0aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZXN0IGFjY3Vtc2FuIHZlbCB2ZWwgc2VtcGVyIGVnZXN0YXMgbWV0dXMgYSBlbGVpZmVuZCBlZ2VzdGFzIGluIGNvbnNlcXVhdCB0aW5jaWR1bnQgaWQgYW1ldCBzb2Npb3NxdSB1cm5hIGNvbmRpbWVudHVtIE51bGxhbSBzZWQgdmVsIHB1bHZpbmFyIG5lYyB0dXJwaXMgdHVycGlzIHZpdGFlIHR1cnBpcyBtZXR1cyBmcmluZ2lsbGEgVml2YW11cyBQcmFlc2VudCBvcm5hcmUgZGlhbSBlcm9zIGVnZXQgbmVjIGF0IHNlZCBhdWN0b3IgZWdlc3RhcyBwb3J0dGl0b3IgZXUgZnJpbmdpbGxhIFN1c3BlbmRpc3NlIGFjIGluY2VwdG9zIGVnZXQgbmVjIHNpdCBoZW5kcmVyaXQgRG9uZWMgUXVpc3F1ZSB1dCBkYXBpYnVzIHNpdCBlcmF0IG1vbGVzdGllIGZyaW5naWxsYSBzdXNjaXBpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEyLTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNC0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRhY3RQZXJzb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0b3JxdWVudCBTZWQgZHVpIGRpYW0gc2l0IHRlbXB1cyBuaWJoIHBvcnRhIHZlbCBzZW1wZXIgVml2YW11cyBncmF2aWRhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogXCJlcm9zIHZlc3RpYnVsdW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlTWFpbEFkZHJlc3NcIjogXCJuaXNsIG1ldHVzIGlwc3VtIGZldWdpYXQgdmVsIGFkaXBpc2NpbmcgZGFwaWJ1cyBpbnRlcmR1bSBsZW8gdWx0cmljaWVzXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJjb25kaW1lbnR1bSBEb25lY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImEgQ3VyYWJpdHVyIG5pc2lcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcImFjY3Vtc2FuIHNlbSBhbWV0IHZpdGFlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJkaWFtIGRpYW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwidGVsbHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1vbGxpcyBpcHN1bSBxdWlzIHRlbXB1cyBudWxsYSB2aXRhZSBhYyBzYWdpdHRpcyBpbiBpcHN1bSBDdXJhYml0dXIgZGljdHVtIHZvbHV0cGF0IHBsYWNlcmF0IHBoYXJldHJhIGVnZXQgdmVzdGlidWx1bSBsYWN1cyBncmF2aWRhIG5lYyBhZGlwaXNjaW5nIGluIE1vcmJpIGxlY3R1cyBsYW9yZWV0IHZlbCBjb25zZXF1YXQgZG9sb3Igc2FwaWVuIHVsdHJpY2llcyBoZW5kcmVyaXQgbmliaCBxdWlzIGZhY2lsaXNpcyB0ZW1wb3IgcGVsbGVudGVzcXVlIHF1aXMgU2VkIGZlbGlzIHRvcnRvciB2ZWwgZGljdHVtIHVsdHJpY2llcyBuaWJoIHRlbGx1cyBzY2VsZXJpc3F1ZSBhZGlwaXNjaW5nIGxlbyBmZXVnaWF0IENyYXMgbGVjdHVzIG1hc3NhIGV0IHZhcml1cyBlZ2V0IFByYWVzZW50IGZlbGlzIEN1cmFiaXR1ciBQaGFzZWxsdXMgY29uZGltZW50dW0gbG9yZW0gYSBhZGlwaXNjaW5nIGRpYW0gcGhhcmV0cmEgYWRpcGlzY2luZyBOYW0gdml2ZXJyYSBqdXN0b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEyLTIwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMS0xNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0Nzc2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzaXQgZWdlc3RhcyBzaXQgUXVpc3F1ZSBldCBhZGlwaXNjaW5nIG51bmMgdml0YWUgZXUgbmVjIGNvbnZhbGxpcyBpcHN1bSBwb3RlbnRpIHNpdCBjb25zZWN0ZXR1ciBhYyBpbiBqdXN0byBhZGlwaXNjaW5nIHZlaGljdWxhIHRlbGx1cyBvZGlvIHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA4LTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMS0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiZWxlaWZlbmQgcGVsbGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDI1MDgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhbWV0IGxvcmVtIHV0IHZpdmVycmEgRXRpYW0gdm9sdXRwYXQgYW50ZSBQcmFlc2VudCBQZWxsZW50ZXNxdWUgYWMgcGhhcmV0cmEgY29uZ3VlIGVzdCBQcm9pbiBjb25zZXF1YXQgYmxhbmRpdCBWaXZhbXVzIHBvcnR0aXRvciB2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMS0wOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDktMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIm51bmMgbWFzc2EgU2VkXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJEZXBhcnR1cmVUcmFuc3BvcnRNZWFuc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM0NjEzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZklkZW50aWZpY2F0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiAwLjAyMDU5MjY5NDA0MDY2MzksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibm9uIHR1cnBpcyB0ZW1wb3IgbmVjIHBlciBOdWxsYW0gcG9ydGEgc2VtIGVyb3MgcmhvbmN1cyBzZWQgYWRpcGlzY2luZyBTZWQgc2VkIHNpdCBTZWQgY29uZ3VlIGxvYm9ydGlzIENyYXMgTWF1cmlzIGFjY3Vtc2FuIHZlaGljdWxhIGFsaXF1YW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMS0wOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMTJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIkV0aWFtIER1aXMgY29udmFsbGlzIGxpZ3VsYSBWZXN0aWJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTA2LTIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDIwLTA3LTEzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4yMDQ0MjAxMTE3MDI5NTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaW4gYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA0LTE2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMS0yMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDI0NDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IDAuMDkwNzU1Njg2OTk3Nzg3OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzdXNjaXBpdCBhdCBEdWlzIGR1aSBldSBvZGlvIGdyYXZpZGEgYW1ldCBxdWlzIHJob25jdXMgYW1ldCBtb2xlc3RpZSBwbGFjZXJhdCBNYXVyaXMganVzdG8gcnV0cnVtIGVnZXQgdmVzdGlidWx1bSB2ZXN0aWJ1bHVtIHJpc3VzIG1vbGxpcyBhbWV0IGEgY29uZGltZW50dW0gVmVzdGlidWx1bSBwb3N1ZXJlIGNvbmRpbWVudHVtIG5vc3RyYSB2ZWxpdCBtYXNzYSBoZW5kcmVyaXQgY29udWJpYSB1dCBpcHN1bSBGdXNjZSBTdXNwZW5kaXNzZSBTZWQgYWMgY29tbW9kbyBoZW5kcmVyaXQgc29kYWxlcyBhY2N1bXNhbiBpZCBOdW5jIHRvcnF1ZW50IHVsdHJpY2llcyBtZXR1cyBhdCBkdWkgZ3JhdmlkYSBuaWJoIHV0IGlkIHVsbGFtY29ycGVyIHRvcnRvciBmZXVnaWF0IE1hdXJpcyBldWlzbW9kIG5pYmggdGluY2lkdW50IGxhY3VzIHRpbmNpZHVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEwLTIwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0zMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwicGxhY2VyYXQgdGVtcHVzIHZlbCBhIGVzdCBub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDE5LTAxLTI5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTAxLTMwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMTguMTk2NDE3NDQ2MzM5NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzZW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEdWlzIGZhY2lsaXNpcyBzZWQgUGVsbGVudGVzcXVlIHV0IGRhcGlidXMgcGhhcmV0cmEgYWRpcGlzY2luZyBkaWFtIHRlbXBvciBlcm9zIGVnZXN0YXMgcmhvbmN1cyBsb2JvcnRpcyBldCBtaSB2ZWhpY3VsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA1LTA4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFwiUHJldmlvdXNEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDMwOTg2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImJpYmVuZHVtIHBvc3VlcmUgb3JjaSB2b2x1dHBhdCB2ZWwgdmVzdGlidWx1bSBzaXQgYWxpcXVldCBzZW0gY29uc2VxdWF0IHJ1dHJ1bSBzZW0gTnVuYyBudW5jIGxpZ3VsYSBDdXJhYml0dXIgZXN0IGVnZXQgdmVsIG1vbGxpcyB1bHRyaWNlcyBkaWFtIFZpdmFtdXMgdGluY2lkdW50IHZlaGljdWxhIGV1IFByYWVzZW50IHRpbmNpZHVudCBsYW9yZWV0IHB1bHZpbmFyIFZpdmFtdXMgdGVtcG9yIHNlZCBDdXJhYml0dXIgbW9sbGlzIGZlcm1lbnR1bSBlZ2V0IHR1cnBpcyBTZWQgdXQgRXRpYW0gdmVsIGxlY3R1cyBmYXVjaWJ1cyBmZXVnaWF0IGVuaW0gbm9uIHBlbGxlbnRlc3F1ZSBzZW0gdmVzdGlidWx1bSB1bHRyaWNpZXMgZW5pbSBhYyBwbGFjZXJhdCBlcmF0IHZlbGl0IEN1cmFiaXR1ciBoZW5kcmVyaXQgZHVpIGVyb3Mgb2RpbyB1dCBzZW1wZXIgdmVsIGlkIHRlbXB1cyBpZCBQaGFzZWxsdXMgcGVsbGVudGVzcXVlIG9kaW8gaW4gbmliaCBzaXQgc2VkIGlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMTdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTAxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibWFzc2EgdmVzdGlidWx1bSBTdXNwZW5kaXNzZSBjb21tb2RvIHJpc3VzIGNvbW1vZG9cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM5MTYyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwicXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImF0IHZlc3RpYnVsdW0gTnVsbGEgZXN0IHBvcnRhIHJpc3VzIG1hdXJpcyBwaGFyZXRyYSB0b3J0b3IgZnJpbmdpbGxhIGlwc3VtIGFjY3Vtc2FuIGF1Z3VlIHRyaXN0aXF1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA1LTI1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0xOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInVsdHJpY2llcyBncmF2aWRhIHRpbmNpZHVudCBub24gZ3JhdmlkYSBuZWMgbmVjIG5vbiBlcm9zIGVzdCBvZGlvXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJUcmFuc3BvcnREb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM0NDc4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNvZGFsZXMgcHJldGl1bSBwdWx2aW5hciBTZWQgYSBtaSBlbGVpZmVuZCBjb25zZXF1YXQgYmxhbmRpdCBlbGVtZW50dW0gaWQgYW50ZSBzaXQgSW4gdXQgZXN0IG1pIG5pYmggc2FwaWVuIHNpdCBwaGFyZXRyYSBTdXNwZW5kaXNzZSBtYXVyaXMgdWxsYW1jb3JwZXIgcG9ydHRpdG9yIFV0IGZhY2lsaXNpcyBsYW9yZWV0IG1vbGVzdGllIGZldWdpYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOS0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDctMTJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ0ZW1wb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDYxMTg2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwicXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVyYXQgdGVtcG9yIERvbmVjIGJsYW5kaXQgbGVjdHVzIHRlbGx1cyBFdGlhbSBpZCBudWxsYSB2aXRhZSBNYWVjZW5hcyBsYWN1cyB2ZWwgZmFjaWxpc2lzIG51bGxhIG5pc2kgbmliaCBzYXBpZW4gcHJldGl1bSBsYWN1cyBzZWQgZWxlaWZlbmQgdGVsbHVzIGVsaXQgYXVndWUgdmVzdGlidWx1bSBVdCBvcm5hcmUgcXVpcyBpbiBzaXQgYWRpcGlzY2luZyBhdWd1ZSBtaSBlZ2V0IGVsZW1lbnR1bSBhdCBzZWQgbW9sZXN0aWUgQ3JhcyBsaWd1bGEgdHVycGlzIHZpdGFlIG1vbGVzdGllIGF1Y3RvciBxdWlzIHV0IHBvcnR0aXRvciByaXN1cyBmYWNpbGlzaXMgbGFjdXMgdHJpc3RpcXVlIFV0IGNvbmd1ZSBuaXNpIGxhb3JlZXQgYWMgc2VtcGVyIFByYWVzZW50IGxhb3JlZXQgYXB0ZW50IHB1bHZpbmFyIGV0IGEgZGlhbSBzdXNjaXBpdCBlbGVpZmVuZCBhbGlxdWFtIG5vbiB1dCBQZWxsZW50ZXNxdWUgbm9uIHZlc3RpYnVsdW0gc2FwaWVuIGNvbnZhbGxpcyBsZW8gdmVsIHRpbmNpZHVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTExLTA1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNC0zMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImVzdCBjb25ndWUgaWQgbWkgQ3JhcyB2ZXN0aWJ1bHVtIGVzdCBjb25ndWUgaW50ZXJkdW0gZXN0XCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjAzNDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJOdW5jXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicGxhY2VyYXQgbm9uIGp1c3RvIGFtZXQgRG9uZWMgYWxpcXVhbSB2ZWwgZmFjaWxpc2lzIGhlbmRyZXJpdCBqdXN0byBpZCBudWxsYSBhbWV0IHF1YW0gUHJvaW4gcGxhY2VyYXQgcG9ydGEgUHJvaW4gdmVsIFBoYXNlbGx1cyBlbGl0IG1hc3NhIHZlaGljdWxhIFZpdmFtdXMgbmliaCBWaXZhbXVzIGhpbWVuYWVvcyBQcmFlc2VudCBmYWNpbGlzaXMgZmFjaWxpc2lzIHRyaXN0aXF1ZSB1cm5hIHByZXRpdW0gdml0YWUgTnVsbGFtIFNlZCBTZWQgdmVzdGlidWx1bSBOYW0gZXN0IG1hc3NhIG5lYyB2aXRhZSBtYXVyaXMgc2l0IGZldWdpYXQgbm9zdHJhIGlkIHVsdHJpY2llcyBhcmN1IHJob25jdXMgZmF1Y2lidXMgdnVscHV0YXRlIHZlbCBmZWxpcyBhbWV0IHF1aXMgcGhhcmV0cmEgUGVsbGVudGVzcXVlIGFtZXQgbWFzc2EgY29uZGltZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMS0xNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJhIHVybmEgZWdldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTgxMzIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlbGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZGFwaWJ1cyBtb2xsaXMgdm9sdXRwYXQgUHJhZXNlbnQgb2RpbyB0ZW1wb3IgaW4gdXJuYSBwaGFyZXRyYSBldSBQcmFlc2VudCBsYWN1cyBhY2N1bXNhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA1LTAyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMi0xOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInRlbXB1cyBhdWd1ZSBpbiBhIGFjIG1pIGxhY3VzXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJUcmFuc3BvcnRDaGFyZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIm1ldGhvZE9mUGF5bWVudFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlc3RpYnVsdW0gaWQgYWRpcGlzY2luZyB1dCBjb25kaW1lbnR1bSBwcmV0aXVtIERvbmVjIG1hdXJpcyBlc3QgcG9ydGEgUHJvaW4gbmlzbCBuaWJoIHRlbXB1cyByaG9uY3VzIE51bGxhIGludGVyZHVtIGhlbmRyZXJpdCBzb2RhbGVzIGludGVyZHVtIGV1IHNlbXBlciBMb3JlbSBhbWV0IHNhcGllbiBlZ2V0IGltcGVyZGlldCBzZWQgUXVpc3F1ZSBFdGlhbSBEb25lYyB2aXRhZSBudWxsYSBibGFuZGl0IGFtZXQgZmF1Y2lidXMgYW1ldCBhbWV0IGxpZ3VsYSBOYW0gdmVzdGlidWx1bSBhZGlwaXNjaW5nIFByYWVzZW50IGNvbnZhbGxpcyBhbWV0IGlkIHNjZWxlcmlzcXVlIGRvbG9yIHVsbGFtY29ycGVyIGlhY3VsaXMgcmhvbmN1cyBuZWMgbmVjIGdyYXZpZGEgYWRpcGlzY2luZyBhY2N1bXNhbiBpZCBxdWlzIHNlbSBwdWx2aW5hciBsaWd1bGEgbm9uIGV1IERvbmVjIGFkaXBpc2NpbmcgcmlzdXMgdmVuZW5hdGlzIE1vcmJpIGlwc3VtIGN1cnN1cyBudWxsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDItMjJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDUtMTRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWdubWVudEl0ZW1cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA3NDExOSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvblR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImN1cnN1cyBzb2xsaWNpdHVkaW4gdmVsIG9kaW8gZGlhbSB0dXJwaXMgYW1ldCByaG9uY3VzIHF1YW0gZGljdHVtIHNlbXBlciBpbiBkaWN0dW0gY29uc2VjdGV0dXIgYmxhbmRpdCB1bGxhbWNvcnBlciBldSB2ZWwgZ3JhdmlkYSB2YXJpdXMgbW9sZXN0aWUgaW4gU2VkIE1vcmJpIG1ldHVzIGVnZXN0YXMgQ3VyYWJpdHVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTMxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGlzcGF0Y2hcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wNS0zMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0wOS0zMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDAwMTA4NTQ3MTQ2MDE2OTg3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInVybmEgTW9yYmkgbnVsbGEgdmVsIHNvZGFsZXMgdmVoaWN1bGEgdXQgdmVoaWN1bGEgYWRpcGlzY2luZyBpbnRlcmR1bSBhIHNlZCBuaXNpIHRpbmNpZHVudCBzYXBpZW4gdml0YWUgZmFjaWxpc2lzIGVsaXQgcXVhbSBlcmF0IGN1cnN1cyBhYyBwZWxsZW50ZXNxdWUgTWF1cmlzIERvbmVjIGNvbmRpbWVudHVtIGNvbmRpbWVudHVtIGFjY3Vtc2FuIGxpZ3VsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAzLTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNC0yOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRlc3RpbmF0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMTktMDMtMjdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDYtMDVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjAwMDA3MTkwMzM0OTEyMDEyNDksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidGVsbHVzIGFkaXBpc2NpbmcgcGhhcmV0cmEgbmliaCBzZW1wZXIgU3VzcGVuZGlzc2UgQ3JhcyBtaSB1cm5hIHNhZ2l0dGlzIGF0IGR1aSB2ZWxpdCBtaSBsZW8gdGVtcG9yIG1pIGEgbW9sZXN0aWUgYW1ldCB0cmlzdGlxdWUgZWxlaWZlbmQgbmlzbCBjdXJzdXMgdm9sdXRwYXQgZWxpdCB1dCBjdXJzdXMgU2VkIHZlbmVuYXRpcyBhcmN1IFBlbGxlbnRlc3F1ZSBkYXBpYnVzIHBvc3VlcmUgZWxlaWZlbmQgQWVuZWFuIHNlZCBzZW0gZXUgZmV1Z2lhdCBkaWFtIER1aXMgYXVndWUgaGVuZHJlcml0IEluIHRlbXBvciBlbmltIHRyaXN0aXF1ZSBMb3JlbSBlZ2V0IHNvZGFsZXMgZWdldCBldWlzbW9kIGNvbmRpbWVudHVtIGp1c3RvIHZvbHV0cGF0IGNvbW1vZG8gbm9uIGJsYW5kaXQgVml2YW11cyBOdWxsYSBzaXQgZGlnbmlzc2ltIE51bmMganVzdG8gSW4gc2FwaWVuIFNlZCBFdGlhbSBjb25kaW1lbnR1bSBhY2N1bXNhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEwLTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMS0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclVDUlwiOiBcIkV0aWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbVByaWNlRVVSXCI6IDc5LjgxMjk3MzMwOTIyMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29uc2lnbmVlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJlbGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJmcmluZ2lsbGEgY29uc2VxdWF0IHZlbCB0dXJwaXMgdGVtcHVzIGZyaW5naWxsYSBkaWFtIGFkaXBpc2NpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJvZGlvIHNlbXBlciB2ZXN0aWJ1bHVtIG5vbiBhbWV0IHRyaXN0aXF1ZSBuZWMgZmVsaXMgZWdlc3Rhc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJhZCBsb2JvcnRpcyBhYyBhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwiU2VkIGVsaXQgc2l0IHV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImlwc3VtIGF1Z3VlIHZlc3RpYnVsdW0gZWxpdCBQaGFzZWxsdXMgc2l0IHF1aXMgTnVsbGFtIGp1c3RvIE51bmMgYXVndWUgcGVsbGVudGVzcXVlIGVnZXQgYWMgY29uZGltZW50dW0gdml0YWUgdG9ycXVlbnQgbm9uIGlwc3VtIHJpc3VzIE51bGxhbSBwdXJ1cyB0ZWxsdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA2LTA1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTIzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxTdXBwbHlDaGFpbkFjdG9yXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDE2NjMyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWxlbWVudHVtIE51bGxhbSB1dCBjb25zZXF1YXQgY29uZGltZW50dW0gU2VkIGFtZXQgaGVuZHJlcml0IG9yY2kgcGVsbGVudGVzcXVlIHBvcnRhIHF1aXMgc2l0IGNvbnNlcXVhdCBmYXVjaWJ1cyBzYXBpZW4gdmVsIFBlbGxlbnRlc3F1ZSBkaWN0dW0gaWQgVml2YW11cyBVdCBwdXJ1cyBQZWxsZW50ZXNxdWUgYSBhbWV0IGVzdCB2ZXN0aWJ1bHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNC0wOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMi0yNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIm5vbiBTdXNwZW5kaXNzZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzUzMDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJyaXN1cyB1bHRyaWNpZXMgdGluY2lkdW50IERvbmVjIEN1cmFiaXR1ciBzYXBpZW4gcGhhcmV0cmEgc2VkIGNvbnNlcXVhdCB2ZWwgYXVndWUgY29uZ3VlIGxlY3R1cyBJbiB2aXRhZSB0ZWxsdXMgbGl0b3JhIHRvcnRvciB1cm5hIGZlbGlzIFNlZCBsaWd1bGEgbGl0b3JhIFByYWVzZW50IHNhcGllbiBzYWdpdHRpcyBlbGVpZmVuZCBwZWxsZW50ZXNxdWUgUHJhZXNlbnQganVzdG8gYW1ldCBEdWlzIHZlc3RpYnVsdW0gc2l0IGxhb3JlZXQgYW1ldCBzYXBpZW4gZXN0IHNhcGllbiBtYXVyaXMgaW4gbGVvIGNvbnNlcXVhdCBtb2xlc3RpZSBpbiBQZWxsZW50ZXNxdWUgYWMgbmlzaSBzZWQgZW5pbSBwdWx2aW5hciBhIHRlbXB1cyBvcm5hcmUgdG9ydG9yIERvbmVjIGluIHRyaXN0aXF1ZSBmYWNpbGlzaXMgdml0YWUgYWxpcXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMjlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDYtMjhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJhY2N1bXNhblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29tbW9kaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25PZkdvb2RzXCI6IFwibWF1cmlzIFNlZCBpZCBWaXZhbXVzIHF1YW0gcXVhbSBhZGlwaXNjaW5nIHJpc3VzIGVyb3MgZmV1Z2lhdCBpbXBlcmRpZXQgcXVhbSBxdWlzIFF1aXNxdWUgdXQgcG9zdWVyZSBvcm5hcmUgY29uZGltZW50dW0gbmVxdWUgUGVsbGVudGVzcXVlIHV0IGNvbmRpbWVudHVtIG5pc2kgc2FwaWVuIGNvbnNlcXVhdCBwZXIgc2VtcGVyIHJ1dHJ1bSBmYXVjaWJ1cyBydXRydW0gbGlndWxhIGlwc3VtIGZhY2lsaXNpcyBudWxsYSBJbnRlZ2VyIEN1cmFiaXR1ciB1dCBzZW0gZXQgU2VkIG1vbGVzdGllIG1hdXJpcyBQcmFlc2VudCBhbWV0IGV1IHZpdGFlIHNpdCBtZXR1cyB0ZWxsdXMgcmlzdXMgdG9ydG9yIFBoYXNlbGx1cyBtYWduYSBlcm9zIE51bGxhIHNhcGllbiBWZXN0aWJ1bHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1c0NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImZhY2lsaXNpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ1bHRyaWNpZXMgbmVjIHJob25jdXMgZWdldCBDbGFzcyBibGFuZGl0IGRpY3R1bSBzYXBpZW4gbG9yZW0gdmVsIGZhY2lsaXNpcyBlcmF0IGFjY3Vtc2FuIG1vbGVzdGllIGlkIGVnZXN0YXMgRG9uZWMgdWxsYW1jb3JwZXIgdmVsIGF1Z3VlIHVybmEgc29jaW9zcXUgY29uZGltZW50dW0gbmVjIFZpdmFtdXMgYmxhbmRpdCBldCByaG9uY3VzIHZlc3RpYnVsdW0gb2RpbyBzaXQgbGlndWxhIGRpY3R1bSBpZCBtb2xlc3RpZSBwaGFyZXRyYSBOdW5jIHZlbCBlcmF0IGZldWdpYXQgbmVjIGV1aXNtb2Qgc2VtIGV1aXNtb2QgcGVsbGVudGVzcXVlIG1hc3NhIGF0IGEgdmVzdGlidWx1bSBkaWN0dW0gc2FwaWVuIHNhZ2l0dGlzIGV0IE1hZWNlbmFzIGxvcmVtIHRvcnRvciBpZCBuaXNpIHNlZCB0ZW1wdXMgZ3JhdmlkYSBudWxsYSBvcmNpIGNvbmRpbWVudHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAyLTAyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDktMDlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbW1vZGl0eUNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFybW9uaXNlZFN5c3RlbVN1YkhlYWRpbmdDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibm9zdHJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJsYWN1cyBlbGVtZW50dW0gaW4gdnVscHV0YXRlIG5vbiBjb25zZXF1YXQgUHJhZXNlbnQgYWRpcGlzY2luZyBjb25kaW1lbnR1bSBEb25lYyByaXN1cyBpcHN1bSBjb25zZWN0ZXR1ciBmYXVjaWJ1cyBwb3J0YSBMb3JlbSBoZW5kcmVyaXQgZWdlc3RhcyBiaWJlbmR1bSBoaW1lbmFlb3MgZWdldCBmZWxpcyB1bHRyaWNpZXMgYXVndWUgdmVzdGlidWx1bSBub24gUHJvaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEwLTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbWJpbmVkTm9tZW5jbGF0dXJlQ29kZVwiOiBcIkluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYWNpb25hbENvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhjaXNlR29vZHNRdWFudGl0eVwiOiAwLjA0OTM5OTA2NDIyNDg2NDlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRhbmdlcm91c0dvb2RzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTQyMDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwib3JjaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInBlbGxlbnRlc3F1ZSBpbnRlcmR1bSBwdWx2aW5hciBjdXJzdXMgY29uZ3VlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDQtMDRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA2LTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1ODE1MixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVTk51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZmFjaWxpc2lzIHZvbHV0cGF0IHZlbmVuYXRpcyBuZWMgdmVzdGlidWx1bSB1bGxhbWNvcnBlciBjb25ndWUgcmlzdXMgdmVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNC0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDctMDFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdvb2RzTWVhc3VyZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJncm9zc01hc3NcIjogMC40MDA5NTUxMzA5OTg0OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5ldE1hc3NcIjogMjQ0LjQyMTQ2OTE2MTQ4MyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1cHBsZW1lbnRhcnlVbml0c1wiOiAzLjEzNzY5MTQ1NTQ5MTY4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUGFja2FnaW5nXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY1Njg5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuZWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbCBjb21tb2RvIGFkaXBpc2Npbmcgc3VzY2lwaXQgQWxpcXVhbSBDdXJhYml0dXIgbW9sbGlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMS0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMS0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDc5MTU2Mjg1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcImludGVyZHVtIENyYXMgb2RpbyBub3N0cmEgUGhhc2VsbHVzIHZpdmVycmEgdWx0cmljaWVzIGVnZXQgZXQgTnVsbGEgUXVpc3F1ZSBqdXN0byBDdXJhYml0dXIgcGVsbGVudGVzcXVlIG5vbiBFdGlhbSBuaWJoIGZldWdpYXQgbWFnbmEgQ3VyYWJpdHVyIHNlbSBlZ2VzdGFzIHByZXRpdW0gaXBzdW0gZmVsaXMgZWdlc3RhcyB0aW5jaWR1bnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY1OTk5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInBvc3VlcmUgaW1wZXJkaWV0IG9kaW8gY3Vyc3VzIGFtZXQgbG9ib3J0aXMgQ3JhcyBjdXJzdXMgVml2YW11cyBvcmNpIGRpY3R1bSBldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMjZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiAyOTYwNDMxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcIkluIHNlbXBlciB2aXRhZSB0cmlzdGlxdWUgYW1ldCBkYXBpYnVzIGRpY3R1bSBzY2VsZXJpc3F1ZSBwZXIgbGVvIHRvcnRvciBzZW0gdHVycGlzIHB1bHZpbmFyIGFjIERvbmVjIFN1c3BlbmRpc3NlIG1hdXJpcyBwbGFjZXJhdCBhbWV0IG5pc2kgY29uZ3VlIGVnZXQgdml0YWUgcmlzdXMgZ3JhdmlkYSBlZ2V0IFN1c3BlbmRpc3NlIHNlZCBncmF2aWRhIHV0IG9kaW8gdmVsIGFjXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDUxMjU2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIk51bmNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5vbiB2aXRhZSBldSBEb25lYyBhYyBhYyBjb25ndWUgbWF1cmlzIFN1c3BlbmRpc3NlIGNvbmd1ZSBEdWlzIGp1c3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMS0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNS0zMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJwZWxsZW50ZXNxdWUgY29tbW9kb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDg5NTk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRXRpYW0gY29udmFsbGlzIGFkaXBpc2NpbmcgdmVsIGVsZW1lbnR1bSBjb25kaW1lbnR1bSBtYXNzYSBoZW5kcmVyaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA4LTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogODA0MjU5OTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ1cm5hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJub3N0cmEgRG9uZWMgdnVscHV0YXRlIEV0aWFtIGJpYmVuZHVtIFV0IGVsZW1lbnR1bSBzaXQgYWxpcXVhbSBQaGFzZWxsdXMgc2l0IGRvbG9yIGxpYmVybyBDcmFzIG1hZ25hIG5lYyBuZWMgZ3JhdmlkYSBVdCBhbWV0IGN1cnN1cyBlbmltIGFkIGFkaXBpc2NpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTExLTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCI6IDAuMDAwNjU4MjIzNTEyNDIzMzI5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY2NjkzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInBlciBxdWlzIG1ldHVzIGJpYmVuZHVtIHZpdGFlIHF1aXMgbW9sbGlzIHBoYXJldHJhIHBvcnRhIFNlZCBmZWxpcyBvZGlvIGRvbG9yIG1ldHVzIHBoYXJldHJhIFBlbGxlbnRlc3F1ZSBvZGlvIHZlbGl0IG1ldHVzIERvbmVjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMC0yNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMC0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJuaWJoIHF1YW0gZWxlbWVudHVtIGN1cnN1cyBzYXBpZW4gdmVsIHNlbSB2ZWhpY3VsYSBlbGVtZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiA4MTI3OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInBvcnR0aXRvciBkdWkgZXJvcyBtZXR1cyB2ZXN0aWJ1bHVtIGFtZXQgdWxsYW1jb3JwZXIgbGFjdXMgRHVpcyBlZ2V0IHF1YW0gcXVpcyBkaWN0dW0gdmVuZW5hdGlzIHRyaXN0aXF1ZSBhdCBuZWMgc2FwaWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNy0yOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDE0NDI2NTE0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZmVybWVudHVtIENyYXMgZmF1Y2lidXMgY29tbW9kbyBncmF2aWRhIHNvZGFsZXMgZGlhbSBhYyBhbWV0IERvbmVjIHJpc3VzIGFjIGNvbnZhbGxpcyB2ZWxpdCBhIGNvbnViaWEgcXVhbSBuZWMgdWx0cmljaWVzIHNvZGFsZXMgc2NlbGVyaXNxdWUgVXQgcHVsdmluYXIgc3VzY2lwaXQgcmlzdXMgcHJldGl1bSBjb21tb2RvIHF1YW0gZXN0IG5pYmggSW4gTnVuYyB0b3J0b3Igc2l0IGVuaW0gc2VtIG5pYmggcHVsdmluYXIgZGljdHVtIEFsaXF1YW0gcHJldGl1bSBlbGl0IFNlZCBuaXNsIHZlbCBsYW9yZWV0IHJpc3VzIGFjY3Vtc2FuIE51bGxhIHF1YW0gc2VkIGFkaXBpc2NpbmcgbmlzbCBjb251YmlhIEFlbmVhbiBhbWV0IG5lYyBpcHN1bSBvZGlvIGVsZW1lbnR1bSBhbGlxdWV0IHRpbmNpZHVudCBjb25zZXF1YXQgc2FwaWVuIHRlbGx1cyBhYyB2ZWwgY29udWJpYSB2aXRhZSBwcmV0aXVtIGFjY3Vtc2FuIHV0IHNhcGllbiBuZXF1ZSBtYXNzYSBxdWlzIHNlbSBldSBlZ2V0IHRvcnRvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDgtMjZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogMC41MzIwMDQzNDM1OTM0OTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInNlbXBlciBhbnRlIGluIHB1bHZpbmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTdXBwb3J0aW5nRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjU1MDYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZXJhdCBldCBpZCB2ZWhpY3VsYSBuaXNpIGluIHZlbCBNYWVjZW5hcyBwaGFyZXRyYSBzZWQganVzdG8gdnVscHV0YXRlIHZlbCBldCB2ZXN0aWJ1bHVtIGVsaXQgbGFvcmVldCBuZWMgcG9ydHRpdG9yIGNvbmRpbWVudHVtIHF1aXMgYWMgdXJuYSB2YXJpdXMgc3VzY2lwaXQgUGVsbGVudGVzcXVlIHZhcml1cyBWaXZhbXVzIGEgcHVsdmluYXIgdml0YWUgRXRpYW0gVmVzdGlidWx1bSBlZ2V0IHVybmEgZXJhdCBRdWlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMi0yMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMi0xMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJuZWMgbGVjdHVzIHBoYXJldHJhIGF1Z3VlIG1vbGVzdGllXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDY3OTk4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJ1cm5hXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4MzM4NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJxdWlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJJbiBzYXBpZW4gY29uc2VxdWF0IHZlbGl0IGF1Z3VlIHNlZCB0ZWxsdXMgcXVpcyBldSBsYW9yZWV0IGVyYXQgcXVpcyBhY2N1bXNhbiBmZXJtZW50dW0gc2l0IGZldWdpYXQgTWF1cmlzIGFjY3Vtc2FuIG1hZ25hIHF1YW0gZGljdHVtIHBvc3VlcmUgZWdldCB2b2x1dHBhdCBDdXJhYml0dXIgc2FnaXR0aXMgU2VkIGFyY3UgYmxhbmRpdCB0ZW1wdXMgY29uZGltZW50dW0gZGFwaWJ1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDUtMjRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDctMDFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiaW4gTWF1cmlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDE3Njc0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJlZ2V0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDk2ODE4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2VtIG9ybmFyZSBQZWxsZW50ZXNxdWUgUXVpc3F1ZSBWZXN0aWJ1bHVtIGdyYXZpZGEgbWF1cmlzIGFjY3Vtc2FuIFNlZCBhbGlxdWV0IHNpdCBzaXQgcHVsdmluYXIgcG9ydGEgcHJldGl1bSBlcmF0IHZlc3RpYnVsdW0gZmFjaWxpc2lzIGhlbmRyZXJpdCBzdXNjaXBpdCB0ZW1wb3IgdmVzdGlidWx1bSBoZW5kcmVyaXQgVml2YW11cyBDcmFzIG1hZ25hIHZlc3RpYnVsdW0gQ2xhc3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA2LTA5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEyLTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInBvcnR0aXRvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODEwMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5lYyBlbGVpZmVuZCBtb2xsaXMgZ3JhdmlkYSBldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMTFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMDRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiY29tbW9kbyBJbiBVdCBpbiBwZWxsZW50ZXNxdWUgbmVjIHF1aXMgYW50ZSB2ZWxpdCBjb21tb2RvXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsSW5mb3JtYXRpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTA3MDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwianVzdG8gbG9ib3J0aXMgdGVtcG9yIHZlbCBqdXN0byBuZWMgaW4gdm9sdXRwYXQgcXVhbSBpbiBwb3N1ZXJlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMC0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNS0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwianVzdG8gc3VzY2lwaXQgdGVtcHVzIENsYXNzIGFjIHBlbGxlbnRlc3F1ZSB2dWxwdXRhdGUgdGluY2lkdW50IGRpYW0gbmlzbCB2ZWwgdml0YWUgZGljdHVtIERvbmVjIGVnZXQgY29tbW9kbyB2aXRhZSBsYW9yZWV0IGVsaXQgdHVycGlzIHJpc3VzIG5lYyBuZWMgbGlndWxhIERvbmVjIG5vc3RyYSB2aXRhZSBzaXQgc2VtIGRhcGlidXMgbmVjIGFjIHBvcnRhIHZpdmVycmEgdWx0cmljaWVzIHBoYXJldHJhIHNlbSB2aXZlcnJhIHZlaGljdWxhIG5lcXVlIGZyaW5naWxsYSBldWlzbW9kIHZlbmVuYXRpc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODM1MDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiUHJvaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbnNlY3RldHVyIGFkaXBpc2NpbmcgQ3VyYWJpdHVyIGlkIGVyb3MgZWdldCBEdWlzIHVsdHJpY2llcyBJbnRlZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMS0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNC0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwibG9ib3J0aXMgcHJldGl1bSBub24gc29kYWxlcyB2ZWwgdnVscHV0YXRlIGluIG9yY2kgQ3VyYWJpdHVyIGlkIGluIGhpbWVuYWVvcyBzZW0gdXQgdHVycGlzIHNpdCBjb25kaW1lbnR1bSBzb2RhbGVzIFByYWVzZW50IGxlbyBvcm5hcmUgdG9ydG9yIGFkIGVnZXQgbGFjdXMgSW50ZWdlciB2ZWxpdCBmYWNpbGlzaXMgUXVpc3F1ZSB2dWxwdXRhdGUgZXJhdCBhbnRlIG9kaW8gcHVsdmluYXIgaWQgU2VkIFByYWVzZW50IGF1Z3VlIHNpdCBzb2Npb3NxdSBhbWV0IEFsaXF1YW0gY29uc2VxdWF0IGxlY3R1cyBzZW0gcXVpcyBoaW1lbmFlb3MgZWxpdCBjb21tb2RvIHZpdmVycmEgYWMgc2VtcGVyIGRpYW0gbG9yZW0gYWMgcG9ydHRpdG9yIFBoYXNlbGx1cyBsb2JvcnRpcyBzdXNjaXBpdCBhdWd1ZSB2ZWwgZWxpdCBlZ2V0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJUcmFuc3BvcnRDaGFyZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInB1bHZpbmFyIGVsaXQgaXBzdW0gSW4gY29uc2VxdWF0IGFjIHNhcGllbiB2ZWwgbm9uIHZvbHV0cGF0IGxhY3VzIHRvcnRvciBvZGlvIGdyYXZpZGEgbnVsbGEgbGliZXJvIG9kaW8gbWFzc2EgbWF1cmlzIG9kaW8gcGhhcmV0cmEgdXQgbGlndWxhIFZpdmFtdXMgZWdldCBwdXJ1cyBhYyBhdCBwcmV0aXVtIGZhdWNpYnVzIHZlaGljdWxhIG1hdXJpcyBlbGl0IGFtZXQgbm9uIFBoYXNlbGx1cyBlZ2V0IGVnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMTNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMi0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25Hb29kc0l0ZW1OdW1iZXJcIjogODY5MzMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25UeXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJmZWxpcyBDcmFzIGVyb3MgYWNjdW1zYW4gdmVsIHZlbGl0IHRlbGx1cyBQZWxsZW50ZXNxdWUgUGVsbGVudGVzcXVlIGlwc3VtIHRlbXB1cyBkaWduaXNzaW0gYSBkYXBpYnVzIHZvbHV0cGF0IGFudGUgY29uc2VjdGV0dXIgdXQgTG9yZW0gZWdldCBhZGlwaXNjaW5nIGV1IGlwc3VtIG1pIGp1c3RvIGFsaXF1ZXQgYWNjdW1zYW4gc29jaW9zcXUgYW1ldCBldSBmZXJtZW50dW0gbWFzc2EgUGhhc2VsbHVzIHNlZCBtb2xlc3RpZSBuaXNpIHByZXRpdW0gdmVsIHRhY2l0aSBsZWN0dXMgcGxhY2VyYXQgaWFjdWxpcyBOdW5jIHNhcGllbiBOdWxsYW0gbm9uIGp1c3RvIGludGVyZHVtIGFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNC0wMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDQtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEaXNwYXRjaFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTA1LTI0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTExLTMwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wODcyNjI0NDU5MTUxNDY5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNlbSBhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMDZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA2LTIwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGVzdGluYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0wNi0xNFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0wNS0wM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDgyOTkwMDM4NzU5NTM2MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJwZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEb25lYyBpbiBhbWV0IGZldWdpYXQgcG9zdWVyZSBwdWx2aW5hciBtYWduYSBuaXNpIG1hdXJpcyB1dCBlZ2V0IHZlbGl0IHF1aXMgRXRpYW0gc2l0IEFsaXF1YW0gTW9yYmkgbWFzc2EgYW1ldCBxdWlzIHBvc3VlcmUgYWxpcXVldCBoZW5kcmVyaXQgbmliaCBEb25lYyBncmF2aWRhIGVsaXQgQ3VyYWJpdHVyIG1vbGVzdGllIEN1cmFiaXR1ciBtYXVyaXMgZXJhdCBuZWMgZXJvcyBlcmF0IGRpYW0gcHJldGl1bSB0aW5jaWR1bnQgdHJpc3RpcXVlIGVsZW1lbnR1bSBWaXZhbXVzIGF1Z3VlIHNlbSBhIGF0IGludGVyZHVtIGFjY3Vtc2FuIHNlbXBlciB1bHRyaWNlcyBlZ2VzdGFzIG5lYyBvcmNpIG1hdXJpcyBtYXVyaXMgdml0YWUgaW4gcXVhbSBzYWdpdHRpcyBmZXJtZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNi0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDYtMTlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJVQ1JcIjogXCJuZWMgbmVjIHZ1bHB1dGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1QcmljZUVVUlwiOiAwLjAwMDIwOTEyNTg2NzY3NjUxNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImFtZXQgY29uc2VxdWF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJkdWkgbG9ib3J0aXMgc2FwaWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiRG9uZWMgdmVsIGp1c3RvIGZhdWNpYnVzIHZlbCBRdWlzcXVlIHF1YW0gbWV0dXMgZ3JhdmlkYSBvcmNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcInV0IHZlc3RpYnVsdW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJydXRydW0gc2l0IGZlbGlzIGRpY3R1bSBncmF2aWRhIG1hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNvZGFsZXMgTnVsbGFtIERvbmVjIGZhdWNpYnVzIGFkIGZhdWNpYnVzIGRhcGlidXMgYWQgYW1ldCBuZWMgdml0YWUgaW1wZXJkaWV0IGNvbmRpbWVudHVtIHN1c2NpcGl0IGZlcm1lbnR1bSBuZWMgdXJuYSBwZWxsZW50ZXNxdWUgQ3VyYWJpdHVyIHByZXRpdW0gYWRpcGlzY2luZyB2ZWwgbWF0dGlzIGVsZWlmZW5kIHRvcnRvciB1cm5hIHNpdCBlbGl0IG1pIGxhY3VzIG5vbiBBZW5lYW4gdWxsYW1jb3JwZXIgbWV0dXMgY29tbW9kbyBlZ2V0IGhlbmRyZXJpdCBuZWMgdGVsbHVzIHNpdCBtYXNzYSByaG9uY3VzIG1hc3NhIE51bGxhbSBsYW9yZWV0IG5pYmggbGFjdXMgaW1wZXJkaWV0IHRlbGx1cyBsZW8gY29uZ3VlIGF0IGVyb3MgYXVjdG9yIHBvcnR0aXRvciBQcm9pbiBsaWd1bGEgZmVsaXMgYWMgbGVvIGVsZWlmZW5kIGxhY2luaWEgZXUgc2FwaWVuIFNlZCBNYXVyaXMgY29uc2VjdGV0dXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA5LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA4LTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxTdXBwbHlDaGFpbkFjdG9yXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQ2NDQwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIlNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsaXQgYWNjdW1zYW4ganVzdG8gZWxpdCBlbGl0IHF1YW0gdmVsIHZlbmVuYXRpcyByaG9uY3VzIERvbmVjIGxvYm9ydGlzIGFtZXQgYWMgYWRpcGlzY2luZyBmZWxpcyBncmF2aWRhIG1hc3NhIHVybmEgZGljdHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMS0xOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMS0xN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODQ2NTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzb2xsaWNpdHVkaW4gTWF1cmlzIGVyb3Mgc29kYWxlcyBlcmF0IG9kaW8gbW9sZXN0aWUgZWdldCBzb2xsaWNpdHVkaW4gcmlzdXMgdmVsaXQgc2FnaXR0aXMgTnVuYyB2ZXN0aWJ1bHVtIGFjY3Vtc2FuIGVyb3MgZXJvcyB2ZWhpY3VsYSBDcmFzIHRyaXN0aXF1ZSB2ZWwgdXQgdHJpc3RpcXVlIHJob25jdXMgdXQgb3JuYXJlIGRhcGlidXMgdXQgZWxlbWVudHVtIFNlZCB0dXJwaXMgdG9ycXVlbnQgYXVndWUgcmlzdXMgc2VkIHRvcnRvciBhY2N1bXNhbiBQZWxsZW50ZXNxdWUgZGljdHVtIG5vbiBGdXNjZSBlcmF0IE51bGxhIHBlbGxlbnRlc3F1ZSBhYyBmZXVnaWF0IG1ldHVzIGxhb3JlZXQgdXJuYSBzZW1wZXIganVzdG8gdWx0cmljaWVzIGludGVyZHVtIE51bGxhbSBmZXVnaWF0IG5lYyBhZGlwaXNjaW5nIHV0IGVsZWlmZW5kIGxpZ3VsYSB0ZW1wdXMgdmVoaWN1bGEgYW1ldCBuaXNpIGxhY3VzIGFkaXBpc2NpbmcgdmVzdGlidWx1bSBxdWlzIHZvbHV0cGF0IHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDctMTRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJjb251YmlhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvbk9mR29vZHNcIjogXCJsYW9yZWV0IGEgcGVsbGVudGVzcXVlIHJpc3VzIEludGVnZXIgbnVsbGEgZGFwaWJ1cyBOdW5jIG5lYyBwb3J0dGl0b3IgcmlzdXMgc2l0IGVyb3MgZXQgZXJvcyB0YWNpdGkgbnVuYyB2YXJpdXMgVmVzdGlidWx1bSBOdW5jIHNlZCBOdWxsYSBwb3N1ZXJlIGlkIHJpc3VzIGlkIHBsYWNlcmF0IGEgbGVvIGF0IHVsdHJpY2VzIG5vbiBxdWlzIHNvbGxpY2l0dWRpbiBub24gcG9ydGEgU2VkIHNpdCBuaWJoIExvcmVtIGNvbmRpbWVudHVtIFF1aXNxdWUgYXQgRHVpcyBsZW8gTW9yYmlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3VzQ29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZnJpbmdpbGxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkV0aWFtIGVnZXN0YXMgZXN0IHZ1bHB1dGF0ZSB1bHRyaWNpZXMgZXQgZmVsaXMgZmV1Z2lhdCB2aXRhZSBzYWdpdHRpcyBzaXQgaW4gUHJhZXNlbnQgdXQgdWx0cmljaWVzIEV0aWFtIG5vbiBNYXVyaXMgYWNjdW1zYW4gbWF1cmlzIE51bGxhIG1pIHZlaGljdWxhIFByYWVzZW50IGZyaW5naWxsYSBub24gbGVvIGxlbyB2aXRhZSBDcmFzIEFlbmVhbiBjb25zZXF1YXQgdml2ZXJyYSBFdGlhbSBzb2xsaWNpdHVkaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMDJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMS0yMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29tbW9kaXR5Q29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYXJtb25pc2VkU3lzdGVtU3ViSGVhZGluZ0NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ0ZWxsdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbCBhbWV0IHRlbXBvciB1bGxhbWNvcnBlciB2dWxwdXRhdGUgZmFjaWxpc2lzIGZyaW5naWxsYSB0dXJwaXMgYW1ldCBkdWkgZXUgdGVtcG9yIGxlY3R1cyBjb25zZWN0ZXR1ciBuZWMgbm9uIE51bmMgbm9uIG1vbGVzdGllIGVyYXQgYWNjdW1zYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTIzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEwLTAyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbWJpbmVkTm9tZW5jbGF0dXJlQ29kZVwiOiBcImV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYWNpb25hbENvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhjaXNlR29vZHNRdWFudGl0eVwiOiAwLjYzMjc4MjExNDk2NDM0M1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGFuZ2Vyb3VzR29vZHNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NTIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVOTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pYmhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2ZWxpdCBhdWd1ZSBNYWVjZW5hcyBwb3N1ZXJlIGNvbmRpbWVudHVtIGxpZ3VsYSBuaWJoIGp1c3RvIGFwdGVudCBMb3JlbSBjdXJzdXMgdGVsbHVzIGVzdCBuZWMgZWxlbWVudHVtIGlkIGRpY3R1bSBkb2xvciBlbGl0IGZlbGlzIEluIG9kaW8gdmVoaWN1bGEgdmVsIHNvbGxpY2l0dWRpbiBuZWMgYW1ldCBzdXNjaXBpdCBwaGFyZXRyYSB1dCBsZW8gbmlzbCBhdCBEb25lYyB1dCBDcmFzIGNvbmRpbWVudHVtIEludGVnZXIgYWNjdW1zYW4gZWdldCB0ZW1wdXMgYW1ldCBQcmFlc2VudCBlcmF0IHBvdGVudGkgc2VkIHVybmEgb2RpbyB0YWNpdGkgZmF1Y2lidXMgYmxhbmRpdCBtYWduYSB2ZWhpY3VsYSBtZXR1cyB1bGxhbWNvcnBlciBTZWQgaGVuZHJlcml0IHRpbmNpZHVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA3LTI3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTg0OTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm51bmMgcmhvbmN1cyB0aW5jaWR1bnQgZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNi0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR29vZHNNZWFzdXJlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdyb3NzTWFzc1wiOiAwLjA0NTk3NjMxNjQzODA0NTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuZXRNYXNzXCI6IDYwLjMzOTA5NDQ0NzEyOTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdXBwbGVtZW50YXJ5VW5pdHNcIjogMC4wMjY4NjAxNTc5NzE2NzA5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUGFja2FnaW5nXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI0NTgzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJwdWx2aW5hciBEdWlzIHJ1dHJ1bSBwaGFyZXRyYSBhYyB2dWxwdXRhdGUgdml0YWUgY29uZGltZW50dW0gcGhhcmV0cmEgbWV0dXMgTWFlY2VuYXMgbmVxdWUgZmVybWVudHVtIGNvbnViaWEgc2FwaWVuIHRpbmNpZHVudCBzZW0gYWNjdW1zYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA5LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMjYwOTQxNzUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwiZWxpdCBVdCBwcmV0aXVtIGVuaW0gc2l0IGFtZXQgQ3VyYWJpdHVyIGEgRXRpYW0gc2VtIHZlbmVuYXRpcyBvcmNpIG1ldHVzIHJpc3VzIHNpdCBzY2VsZXJpc3F1ZSB0b3JxdWVudCB0ZWxsdXMgZmVybWVudHVtIG5vbiBhY2N1bXNhbiB0b3JxdWVudCBWaXZhbXVzIHZlc3RpYnVsdW0gbm9uIERvbmVjIHJob25jdXMgbWF1cmlzIHNlbSBwaGFyZXRyYSBTdXNwZW5kaXNzZSBiaWJlbmR1bSBlbGl0IHR1cnBpcyBldSBEdWlzIHNpdCBlZ2VzdGFzIGxvYm9ydGlzIGF1Y3RvciB0cmlzdGlxdWUgc2VtcGVyIGdyYXZpZGEgbmliaCBzZWQgdnVscHV0YXRlIGNvbW1vZG8gbWF1cmlzIGZlcm1lbnR1bSBNYXVyaXMgZmVybWVudHVtIGRpYW0gUHJvaW4gcGhhcmV0cmEgZXUgcG9ydGEgaXBzdW0gbmVjIHVsdHJpY2VzIGNvbW1vZG8ganVzdG8gZXJvcyBJbnRlZ2VyIGEgYW50ZSBsZW8gdGVsbHVzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAxMTI3NCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImlkIHZlbCBlZ2V0IFF1aXNxdWUgbmlzbCB1dCBjb252YWxsaXMgaWQgZXN0IGJpYmVuZHVtIHZvbHV0cGF0IEFlbmVhbiBxdWFtIHNhcGllbiBxdWFtIENyYXMgbWF1cmlzIHVybmEgcGVsbGVudGVzcXVlIGFjY3Vtc2FuIERvbmVjIFNlZCBlc3QgZWdlc3RhcyBQcmFlc2VudCBsZWN0dXMgdmVoaWN1bGEgbG9yZW0gZG9sb3IgcHVydXMgZXQgbmVjIGRpZ25pc3NpbSBOdWxsYW0gcXVhbSB2ZW5lbmF0aXMgZGljdHVtIGRpYW0gUXVpc3F1ZSBwcmV0aXVtIGVnZXQgcHVsdmluYXIgc2l0IGlwc3VtIGNvbnNlY3RldHVyIGNvbmd1ZSBhYyBhdWd1ZSBhZGlwaXNjaW5nIGVnZXQgcXVhbSBzYXBpZW4gTmFtIGxlbyBpZCB1bGxhbWNvcnBlciBpbmNlcHRvcyBtaSBFdGlhbSBBZW5lYW4gdWx0cmljZXMgdml0YWUgcmhvbmN1cyBzY2VsZXJpc3F1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDQtMThUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDgtMDVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiA2Mzc4MjExMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNoaXBwaW5nTWFya3NcIjogXCJtYXVyaXMgZXJvcyBhbWV0IGZhY2lsaXNpcyBQZWxsZW50ZXNxdWUgbWV0dXMgc3VzY2lwaXQgZmF1Y2lidXMgUHJhZXNlbnQgc2VtIFNlZCB0aW5jaWR1bnQgdmVzdGlidWx1bSBjb252YWxsaXMgZmVsaXMgZGljdHVtIE51bGxhIHZlbCBhbnRlIG9ybmFyZSBjb25zZWN0ZXR1ciBtaSBlZ2VzdGFzIHV0IHNlZCBmYWNpbGlzaXMgc3VzY2lwaXQgQ3JhcyBjb25zZWN0ZXR1ciBRdWlzcXVlIHZlbCBwdWx2aW5hciBlZ2V0IFZpdmFtdXMgRHVpcyBwb3J0YVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUHJldmlvdXNEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzMTUyMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJDcmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhcmN1IGZldWdpYXQgcHVsdmluYXIgYXJjdSBmZXVnaWF0IGRpY3R1bSBtb2xsaXMganVzdG8gdGVtcG9yIHNjZWxlcmlzcXVlIGFtZXQgSW50ZWdlciBOYW0gaWQgdXQgZWdlc3RhcyB2aXRhZSBldSBOdW5jIG5vbiBWZXN0aWJ1bHVtIGFtZXQgaWFjdWxpcyBzdXNjaXBpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMjZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDItMDRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibmVjIHNpdCBhcmN1IFBlbGxlbnRlc3F1ZSBuZWMgbWFzc2EgQ3JhcyB0b3J0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiA4ODA1OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJpbXBlcmRpZXQgSW4gdXQgbWFzc2EgZXJhdCBvZGlvIG5lYyBmZXJtZW50dW0gTnVuYyB2ZWhpY3VsYSBsZW8ganVzdG8gSW4gZWxpdCBtYXR0aXMgaXBzdW0gZGljdHVtIFNlZCBQcmFlc2VudCBsYW9yZWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNi0xNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNC0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDMwMjQ4ODI0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidnVscHV0YXRlIHZvbHV0cGF0IG5pc2wgdmFyaXVzIG5pc2kgc2VtIGR1aSBjb25kaW1lbnR1bSB2ZXN0aWJ1bHVtIEV0aWFtIHZlbCBkaWN0dW0gdXJuYSB0dXJwaXMgZWdldCBzb2Npb3NxdSBDcmFzIGZhY2lsaXNpcyBzdXNjaXBpdCB2aXRhZSBlZ2V0IGVnZXQgZmV1Z2lhdCB1bGxhbWNvcnBlciBpcHN1bSBpbiBlZ2VzdGFzIHVsdHJpY2llcyBpbiBsb3JlbSB1bHRyaWNpZXMgbW9sbGlzIGNvbnNlY3RldHVyIGZldWdpYXQgbWFzc2EgaWQgcmlzdXMgUHJhZXNlbnQgdXQgZGlnbmlzc2ltIHNvbGxpY2l0dWRpbiByaXN1cyBlZ2VzdGFzIFN1c3BlbmRpc3NlIG1ldHVzIGFkaXBpc2NpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEwLTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTI3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCI6IDAuNjAyNTIxNDY0OTc0ODYyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJ1bHRyaWNlcyB2ZWhpY3VsYSBlbGVpZmVuZCB0ZWxsdXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDEyNzQzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInBsYWNlcmF0IGFjIG5vbiBmYXVjaWJ1cyBtb2xsaXMgYmliZW5kdW0gc2VtcGVyIGxlbyBFdGlhbSBuaXNsIGVnZXQgbmliaCBsaWJlcm8gZWxpdCB2ZWwgYSBjb25zZXF1YXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTAyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTA2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcIm5lYyByaG9uY3VzIHNpdCBDcmFzIHVsdHJpY2llcyB2aXRhZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDc4NTU5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInRlbGx1cyB2ZW5lbmF0aXMgYXQgZWxpdCB0aW5jaWR1bnQgcG9ydGEgZWdlc3RhcyBuaWJoIHRyaXN0aXF1ZSBsZWN0dXMgY29uZGltZW50dW0gTnVsbGFtIGNvbmRpbWVudHVtIG9kaW8gQ3JhcyBkYXBpYnVzIGxvcmVtIHN1c2NpcGl0IG9yY2kgZXJhdCBjb25zZWN0ZXR1ciBuZWMgZXJvcyBsYW9yZWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMS0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0yOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDU2OTg5NzMxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibmlzaSBhbWV0IG5lYyBNb3JiaSBmYXVjaWJ1cyBlcmF0IGVnZXQgcG9ydHRpdG9yIHNlbSBlZ2V0IHRpbmNpZHVudCB0ZWxsdXMgcGhhcmV0cmEgYWxpcXVhbSBkb2xvciBDdXJhYml0dXIgdnVscHV0YXRlIHZlbCBzaXQgUXVpc3F1ZSB2ZWxpdCBvZGlvIGhlbmRyZXJpdCBsYW9yZWV0IHZ1bHB1dGF0ZSB0ZW1wb3IgY29tbW9kbyBOdWxsYW0gbW9sZXN0aWUgbmVjIHNlbSBhYyBzaXQgQ3JhcyBmZXVnaWF0IGNvbW1vZG8gYSB2dWxwdXRhdGUgU2VkIHNhcGllbiBlc3QgQWxpcXVhbSBkYXBpYnVzIGNvbmd1ZSBvZGlvIGF1Z3VlIGFyY3UgcmhvbmN1cyBzaXQgaW4gbGlndWxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0wOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMi0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiOiA0LjYzODA4NTQ1MTI3NDIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJRdWlzcXVlIHJ1dHJ1bSBlZ2VzdGFzIGZldWdpYXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlN1cHBvcnRpbmdEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAxNjkxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJDcmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhbnRlIHRpbmNpZHVudCBhIE5hbSBkYXBpYnVzIHRlbXB1cyBlZ2VzdGFzIGVsaXQgZW5pbSBWaXZhbXVzIGVsZW1lbnR1bSBwaGFyZXRyYSBhbWV0IFByb2luIGxlbyBwZWxsZW50ZXNxdWUgaXBzdW0gYXVjdG9yIGVsaXQgbGVvIGZyaW5naWxsYSBMb3JlbSBsZW8gc29kYWxlcyBpbiBuaXNpIGVnZXN0YXMgbmVjIGZlcm1lbnR1bSBhYyBibGFuZGl0IHZlc3RpYnVsdW0gbW9sbGlzIHN1c2NpcGl0IHBvcnR0aXRvciBzYXBpZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTE0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImVsZWlmZW5kIFByYWVzZW50IGlkIGEgbmlzaSBldSBEdWlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDc3Njg1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJhZGlwaXNjaW5nIGFtZXQgbG9ib3J0aXMgZG9sb3IgYWMgXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzMzM1MyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJtZXR1cyBNYWVjZW5hcyBDdXJhYml0dXIgZmVsaXMgc3VzY2lwaXQgY29uZ3VlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOC0wMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOS0wM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJzYWdpdHRpcyBpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnRMaW5lSXRlbU51bWJlclwiOiA2Mjk3MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiYXVndWUgc29sbGljaXR1ZGluIHV0IGVyb3NcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjY1ODMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidnVscHV0YXRlIHRlbXBvciBqdXN0byBhY2N1bXNhbiBtZXR1cyBlbGl0IHRyaXN0aXF1ZSBtYXVyaXMgYXJjdSBQaGFzZWxsdXMgcnV0cnVtIGNvbnNlcXVhdCBzb2RhbGVzIGlkIHZlbGl0IHRlbXB1cyBjb25ndWUgZHVpIGVsaXQgc29kYWxlcyBlc3Qgdm9sdXRwYXQgYXQgbWkgbWF1cmlzIHF1aXMgb2RpbyBmYXVjaWJ1cyBlZ2V0IHNpdCBzZW0gaW1wZXJkaWV0IHRlbXBvciBzaXQgZmVybWVudHVtIGVnZXQgdmVzdGlidWx1bSBuaXNpIHNlZCBwdXJ1cyBsZWN0dXMgYW1ldCBoaW1lbmFlb3MgbmlzaSBTdXNwZW5kaXNzZSBjb25ndWUgdmFyaXVzIGlkIHB1bHZpbmFyIHZlbCBJbiBGdXNjZSB1dCBtYWduYSBJbiBBbGlxdWFtIGVyYXQgbGlndWxhIHNlZCBsYWN1cyBwb3J0YSBMb3JlbSBtYXNzYSB2ZWwgZWdlc3RhcyBlcmF0IHF1YW0gdmVsIGxpZ3VsYSBlbGl0IHRlbXB1cyB1bHRyaWNpZXMgZXUgcXVpcyBpbiBtZXR1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDItMjZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMDRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwic2VtIHV0IHRlbXB1cyBncmF2aWRhIE1hZWNlbmFzIE1hZWNlbmFzIHNhcGllbiBhcHRlbnQgTWFlY2VuYXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDc3NTc1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidHVycGlzIGFsaXF1YW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAyLTE1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA4LTEyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImVsZWlmZW5kIGZhY2lsaXNpc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbEluZm9ybWF0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDkxODY5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGVvIGlkIHVsdHJpY2VzIG1hZ25hIHNhZ2l0dGlzIENsYXNzIHNhZ2l0dGlzIHZ1bHB1dGF0ZSBzb2RhbGVzIGFyY3UgRHVpcyBhZGlwaXNjaW5nIGluIHZvbHV0cGF0IGZhdWNpYnVzIGF1Y3RvciBtYXNzYSB1dCB1dCB0cmlzdGlxdWUgc2FwaWVuIHRhY2l0aSBzYXBpZW4gdGluY2lkdW50IGVsaXQgZGljdHVtIENyYXMgZXN0IHZlc3RpYnVsdW0gRG9uZWMgcGVsbGVudGVzcXVlIHNlbSBtaSBudWxsYSBkb2xvciBhY2N1bXNhbiBzaXQgTnVuYyBlbGVtZW50dW0gaXBzdW0gZmVybWVudHVtIGNvbW1vZG8gcG9ydHRpdG9yIHVybmEgbWkgZGljdHVtIGFtZXQgZmFjaWxpc2lzIGZlcm1lbnR1bSBkaWFtIERvbmVjIG5pc2kgcXVhbSBEb25lYyBNYWVjZW5hcyBtYXNzYSBEdWlzIGVyb3MgZmVsaXMgaWQgbW9sbGlzIFV0IGxpZ3VsYSBlcm9zIEluIHJpc3VzIG9kaW8gY29uc2VjdGV0dXIgZXJvcyBzb2xsaWNpdHVkaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA5LTAzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAzLTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJNb3JiaSBhYyBuaXNsIHBoYXJldHJhIFNlZCBlZ2VzdGFzIGVsZWlmZW5kXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NTg4NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJyaXN1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2l0IHZlc3RpYnVsdW0gQ2xhc3MgYWMgUXVpc3F1ZSBzaXQgdmVsIGdyYXZpZGEgbWFnbmEgYXVjdG9yIG1pIHZpdGFlIHBlbGxlbnRlc3F1ZSB1bHRyaWNlcyBjb21tb2RvIGJsYW5kaXQgYXJjdSBwaGFyZXRyYSBwb3J0YSB2ZWwgY29uc2VxdWF0IHJob25jdXMgYXVndWUgRXRpYW0gZWxpdCBpcHN1bSBDcmFzIGFudGUgcmhvbmN1cyB2YXJpdXMgdmVsIHZlbCBpcHN1bSBRdWlzcXVlIG5pYmggZmV1Z2lhdCBhIHRyaXN0aXF1ZSBsYW9yZWV0IGFkIEluIHRpbmNpZHVudCBldCBzaXQgY29uc2VxdWF0IHB1cnVzIGV1IGRpY3R1bSBhbnRlIG5lYyBuaXNsIGVnZXN0YXMgdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAzLTI4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJ2ZWhpY3VsYSBzaXQgdmVzdGlidWx1bSBkYXBpYnVzIERvbmVjIHJpc3VzIGVzdCBwaGFyZXRyYSBhdWN0b3IgcXVpcyBlbGl0IHByZXRpdW0gUGVsbGVudGVzcXVlIFBlbGxlbnRlc3F1ZSByaXN1cyB2ZWwgc2VtIGxvcmVtIHRpbmNpZHVudCBldSBhYyBzYXBpZW4ganVzdG8gbmVjIHNhcGllbiBjb25ndWUgaWQgYXB0ZW50IGZyaW5naWxsYSBvZGlvIGFjIGVyb3MgZmVybWVudHVtIGVnZXN0YXMgYW50ZSByaXN1cyBJbnRlZ2VyIHZlaGljdWxhIGRpY3R1bSBpZCBzaXQgZmFjaWxpc2lzIG5pc2kgbW9sbGlzIHRyaXN0aXF1ZSBmZXJtZW50dW0gYWMgaW1wZXJkaWV0IGhlbmRyZXJpdCBEb25lYyBhYyBlbGl0IER1aXMgaWFjdWxpcyBzaXQgZGFwaWJ1cyBjb21tb2RvIG1hZ25hIHZpdGFlIHBlbGxlbnRlc3F1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVHJhbnNwb3J0Q2hhcmdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1ldGhvZE9mUGF5bWVudFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2aXZlcnJhIHR1cnBpcyBhIHZpdGFlIGZlcm1lbnR1bSBldSBDdXJhYml0dXIgbmVjIGF0IHRvcnRvciBpcHN1bSBTZWQgYWxpcXVldCBwZWxsZW50ZXNxdWUgcmlzdXMgcXVpcyB2ZWxpdCB2YXJpdXMgbW9sZXN0aWUgZXJhdCBpZCBOdW5jIGludGVyZHVtIGp1c3RvIENyYXMgbmlzaSBldCBibGFuZGl0IHN1c2NpcGl0IFByb2luIG5vbiBsZWN0dXMgZmF1Y2lidXMgY29tbW9kbyBtYXR0aXMgc2VtcGVyIG5vbiBzaXQgZXUgZmF1Y2lidXMgTnVsbGEgdXJuYSBjb25kaW1lbnR1bSB2ZXN0aWJ1bHVtIGp1c3RvIFN1c3BlbmRpc3NlIHB1bHZpbmFyIGhpbWVuYWVvcyBsYW9yZWV0IHV0IHJ1dHJ1bSBlbGVpZmVuZCBlbGl0IHRlbGx1cyBkaWFtIEN1cmFiaXR1ciB0b3J0b3IgcHVydXMgY29uZGltZW50dW0gZWdldCBldSB0ZW1wdXMgY3Vyc3VzIHNvbGxpY2l0dWRpbiBzaXQgdXJuYSBmYXVjaWJ1cyBtZXR1cyBEb25lYyBlcmF0IGFtZXQgZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNi0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA2LTE1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0pOyIsIiJdfQ==
