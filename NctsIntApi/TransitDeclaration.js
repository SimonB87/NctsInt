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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJOY3RzSW50QXBpL1RyYW5zaXREZWNsYXJhdGlvbi9BcGkudHMiLCJOY3RzSW50QXBpL1RyYW5zaXREZWNsYXJhdGlvbi9EZWNsYXJhdGlvbldyYXBwZXIudHMiLCJOY3RzSW50QXBpL1RyYW5zaXREZWNsYXJhdGlvbi9sb2dFcnJvci50cyIsIk5jdHNJbnRBcGkvVHJhbnNpdERlY2xhcmF0aW9uL3RyYW5zaXREZWNsYXJhdGlvbk1vY2sudHMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyREFBMEQ7QUFDMUQsbUVBQWtFO0FBQ2xFLHVDQUFzQztBQUV0QztJQUdJO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDakMsQ0FBQztJQUVNLHFCQUFPLEdBQWQ7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sc0JBQVEsR0FBZjtRQUNJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDOUIsQ0FBQztJQUVNLG1CQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sc0JBQVEsR0FBZixVQUFnQixJQUFzQjtRQUNsQyxJQUFJO1lBQ0EsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHVDQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixtQkFBUSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDbEUsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRU0sb0JBQU0sR0FBYjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLE9BQU8s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QjtvQ0FDbkMsU0FBUyxFQUFFLHNCQUFzQjtpQ0FDcEM7Z0NBQ0QsaUJBQWlCLEVBQUUsb0JBQW9COzZCQUMxQzt5QkFDSjt3QkFDRCx1QkFBdUIsRUFBRTs0QkFDckI7Z0NBQ0ksZ0JBQWdCLEVBQUUsS0FBSztnQ0FDdkIsTUFBTSxFQUFFO29DQUNKLE1BQU0sRUFBRSxLQUFLO29DQUNiLGFBQWEsRUFBRSxrZEFBa2Q7b0NBQ2plLFdBQVcsRUFBRSxzQkFBc0I7b0NBQ25DLFNBQVMsRUFBRSxzQkFBc0I7aUNBQ3BDO2dDQUNELE1BQU0sRUFBRSw2Q0FBNkM7NkJBQ3hEOzRCQUNEO2dDQUNJLGdCQUFnQixFQUFFLEtBQUs7Z0NBQ3ZCLE1BQU0sRUFBRTtvQ0FDSixNQUFNLEVBQUUsT0FBTztvQ0FDZixhQUFhLEVBQUUsd1VBQXdVO29DQUN2VixXQUFXLEVBQUUsc0JBQXNCO29DQUNuQyxTQUFTLEVBQUUsc0JBQXNCO2lDQUNwQztnQ0FDRCxNQUFNLEVBQUUsc1pBQXNaOzZCQUNqYTt5QkFDSjt3QkFDRCxrQkFBa0IsRUFBRTs0QkFDaEIsaUJBQWlCLEVBQUU7Z0NBQ2YsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsYUFBYSxFQUFFLGllQUFpZTtnQ0FDaGYsV0FBVyxFQUFFLHNCQUFzQjtnQ0FDbkMsU0FBUyxFQUFFLHNCQUFzQjs2QkFDcEM7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7Q0FDSixDQUFDLENBQUM7O0FDN29FSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IERlY2xhcmF0aW9uV3JhcHBlciB9IGZyb20gXCIuL0RlY2xhcmF0aW9uV3JhcHBlclwiO1xyXG5pbXBvcnQgeyB0cmFuc2l0RGVjbGFyYXRpb25Nb2NrIH0gZnJvbSBcIi4vdHJhbnNpdERlY2xhcmF0aW9uTW9ja1wiO1xyXG5pbXBvcnQgeyBsb2dFcnJvciB9IGZyb20gXCIuL2xvZ0Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBpIGltcGxlbWVudHMgSURpc3Bvc2FibGUge1xyXG4gICAgcHJpdmF0ZSBkZWNsYXJhdGlvbjogRGVjbGFyYXRpb25XcmFwcGVyfHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc1ZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuZGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21Kc29uKGFyZ3M6IHsganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gbmV3IERlY2xhcmF0aW9uV3JhcHBlcihhcmdzLmpzb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYFRyYW5zaXREZWNsYXJhdGlvbiBBUEkgb2JqZWN0IG1ldGhvZCBmcm9tSnNvbiBmYWlsZWQuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvSnNvbigpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24udG9Kc29uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21Nb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSBuZXcgRGVjbGFyYXRpb25XcmFwcGVyKHRyYW5zaXREZWNsYXJhdGlvbk1vY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IG5ldyBEZWNsYXJhdGlvbldyYXBwZXIoJ3t9Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmRlY2xhcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkZXIoKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldEhlYWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIb3VzZUNvbnNpZ25tZW50TGlzdCgpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uZ2V0SG91c2VDb25zaWdubWVudExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5nZXRIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25zaWdubWVudEl0ZW1MaXN0KGFyZ3M6IHsgc2VxdWVuY2VOdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbUxpc3QoYXJncy5zZXF1ZW5jZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbShhcmdzOiB7IGhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlcjogbnVtYmVyLCBnb29kc0l0ZW1OdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbShhcmdzLmhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlciwgYXJncy5nb29kc0l0ZW1OdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRIZWFkZXIoYXJnczogeyBqc29uOiBzdHJpbmcgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5zZXRIZWFkZXIoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnNldEhvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmFwcGVuZE5ld0hvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlSG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uc2V0Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uYXBwZW5kTmV3Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwgZ29vZHNJdGVtTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVDb25zaWdubWVudEl0ZW0oYXJncy5ob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXIsIGFyZ3MuZ29vZHNJdGVtTnVtYmVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSB2YXIgZGVmaW5lOiBGdW5jdGlvbjsgICAvLyBAdHlwZXMvcmVxdWlyZWpzIGNvbGxpZGVzIHdpdGggQHR5cGVzL25vZGVcclxuaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBkZWZpbmUoKCkgPT4gQXBpKTtcclxufSIsImltcG9ydCB7IGxvZ0Vycm9yIH0gZnJvbSBcIi4vbG9nRXJyb3JcIjtcclxuXHJcbmNvbnN0IF86IF8uTG9EYXNoU3RhdGljID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Ll8gOiByZXF1aXJlKCdsb2Rhc2gnKSk7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVjbGFyYXRpb25XcmFwcGVyIHtcclxuICAgIHByaXZhdGUgb2JqOiBJRGVjbGFyYXRpb247XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGpzb246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMub2JqID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqLCB0aGlzLmNyZWF0ZVNraXBSZXBsYWNlcignSG91c2VDb25zaWdubWVudCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudExpc3QoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdO1xyXG5cclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZExpc3Q6IElIb3VzZUNvbnNpZ25tZW50Um93W10gPSBsaXN0Lm1hcCgodmFsdWU6IElIb3VzZUNvbnNpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZU51bWJlcjogdmFsdWUuc2VxdWVuY2VOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VOdW1iZXJVQ1I6IHZhbHVlLnJlZmVyZW5jZU51bWJlclVDUixcclxuICAgICAgICAgICAgICAgIGdyb3NzTWFzczogdmFsdWUuZ3Jvc3NNYXNzLFxyXG4gICAgICAgICAgICAgICAgY29uc2lnbm9yTmFtZTogdmFsdWUuQ29uc2lnbm9yPy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgY29uc2lnbm1lbnRJdGVtc0NvdW50OiB2YWx1ZS5Db25zaWdubWVudEl0ZW0/Lmxlbmd0aFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0cmFuc2Zvcm1lZExpc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgbnVsbCBpZiB0aGVyZSBpcyBubyBob3VzZUNvbnNpZ25tZW50IHdpdGggZ2l2ZW4gaW5kZXhcclxuICAgIHB1YmxpYyBnZXRIb3VzZUNvbnNpZ25tZW50KGhjSW5kZXg6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBjb25zdCBoYyA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV07XHJcbiAgICAgICAgaWYgKGhjKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShoYywgdGhpcy5jcmVhdGVTa2lwUmVwbGFjZXIoJ0NvbnNpZ25tZW50SXRlbScpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJucyBudWxsIGlmIHRoZXJlIGlzIG5vIGhvdXNlQ29uc2lnbm1lbnQgd2l0aCBnaXZlbiBpbmRleFxyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbUxpc3QoaGNJbmRleDogbnVtYmVyKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGNvbnN0IGhjID0gdGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXTtcclxuICAgICAgICBpZiAoIWhjKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGhjPy5Db25zaWdubWVudEl0ZW0gfHwgW107XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRMaXN0OiBJQ29uc2lnbm1lbnRJdGVtUm93W10gPSBsaXN0Lm1hcCgodmFsdWU6IElDb25zaWdubWVudEl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGdvb2RzSXRlbU51bWJlcjogdmFsdWUuZ29vZHNJdGVtTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgY29uc2lnbmVlTmFtZTogdmFsdWUuQ29uc2lnbmVlPy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnRyeU9mRGVzdGluYXRpb246IHZhbHVlLmNvdW50cnlPZkRlc3RpbmF0aW9uID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIENvZGU6IHZhbHVlLmNvdW50cnlPZkRlc3RpbmF0aW9uLkNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgRGVzY3JpcHRpb246IHZhbHVlLmNvdW50cnlPZkRlc3RpbmF0aW9uLkRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9IDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25UeXBlOiB2YWx1ZS5kZWNsYXJhdGlvblR5cGUgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29kZTogdmFsdWUuZGVjbGFyYXRpb25UeXBlLkNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgRGVzY3JpcHRpb246IHZhbHVlLmRlY2xhcmF0aW9uVHlwZS5EZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZU51bWJlclVDUjogdmFsdWUucmVmZXJlbmNlTnVtYmVyVUNSXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0cmFuc2Zvcm1lZExpc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgbnVsbCBpZiB0aGVyZSBpcyBubyBjb25zaWdubWVudCBpdGVtIGZvciBnaXZlbiBpbmRleGVzXHJcbiAgICBwdWJsaWMgZ2V0Q29uc2lnbm1lbnRJdGVtKGhjSW5kZXg6IG51bWJlciwgY2lJbmRleDogbnVtYmVyKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGNvbnN0IGNpID0gdGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXT8uQ29uc2lnbm1lbnRJdGVtW2NpSW5kZXggLSAxXTtcclxuICAgICAgICByZXR1cm4gY2kgPyBKU09OLnN0cmluZ2lmeShjaSkgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRIZWFkZXIoanNvbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3T2JqOiBJRGVjbGFyYXRpb24gPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdPYmouQ29uc2lnbm1lbnQgPSBuZXdPYmouQ29uc2lnbm1lbnQgfHwge307XHJcbiAgICAgICAgICAgICAgICBuZXdPYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9iaiA9IG5ld09iajtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24uc2V0SGVhZGVyIGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsIG9yIGZhbHNlIGlmIGl0IHdhc24ndFxyXG4gICAgcHVibGljIHNldEhvdXNlQ29uc2lnbm1lbnQoanNvbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGM6IElIb3VzZUNvbnNpZ25tZW50ID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICAgICAgaWYgKCEoXy5pc0Zpbml0ZShoYy5zZXF1ZW5jZU51bWJlcikgJiYgaGMuc2VxdWVuY2VOdW1iZXIgPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoYFRyYW5zaXREZWNsYXJhdGlvbi5zZXRIb3VzZUNvbnNpZ25tZW50IGVycm9yOiBQYXJhbWV0ZXIgZG9lcyBub3QgY29udGFpbiB2YWxpZCBzZXF1ZW5jZSBudW1iZXIuYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBoYy5zZXF1ZW5jZU51bWJlciAtIDE7XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdO1xyXG4gICAgICAgICAgICBoYy5Db25zaWdubWVudEl0ZW0gPSB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2luZGV4XT8uQ29uc2lnbm1lbnRJdGVtO1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2luZGV4XSA9IGhjO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYFRyYW5zaXREZWNsYXJhdGlvbi5zZXRIb3VzZUNvbnNpZ25tZW50IGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudChqc29uOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBoYzogSUhvdXNlQ29uc2lnbm1lbnQgPSBKU09OLnBhcnNlKGpzb24pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudCB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgfHwgW107XHJcbiAgICAgICAgICAgIGNvbnN0IGhjTGVuZ3RoID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2hjTGVuZ3RoXSA9IGhjO1xyXG4gICAgICAgICAgICB0aGlzLmZpeEhjU2VxdWVuY2VOdW1iZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBhcHBlbmROZXdIb3VzZUNvbnNpZ25tZW50IGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlSG91c2VDb25zaWdubWVudChoY0luZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmouQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50LnNwbGljZShoY0luZGV4IC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpeEhjU2VxdWVuY2VOdW1iZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGByZW1vdmVIb3VzZUNvbnNpZ25tZW50IGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWwgb3IgZmFsc2UgaWYgaXQgd2Fzbid0XHJcbiAgICBwdWJsaWMgc2V0Q29uc2lnbm1lbnRJdGVtKGhjSW5kZXg6IG51bWJlciwganNvbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKCEoXy5pc0Zpbml0ZShoY0luZGV4KSAmJiBoY0luZGV4ID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKGBzZXRDb25zaWdubWVudEl0ZW0gZXJyb3I6IEhvdXNlQ29uc2lnbm1lbnQgaW5kZXggcGFyYW1ldGVyIGlzIHN1cHBvc2VkIHRvIGJlIGEgcG9zaXRpdmUgbnVtYmVyIGJ1dCBpdCBpcyBcIiR7aGNJbmRleH1cImApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaTogSUNvbnNpZ25tZW50SXRlbSA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGNpSW5kZXggPSBjaS5nb29kc0l0ZW1OdW1iZXI7XHJcbiAgICAgICAgICAgIGlmICghKF8uaXNGaW5pdGUoY2lJbmRleCkgJiYgY2lJbmRleCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dFcnJvcihgc2V0Q29uc2lnbm1lbnRJdGVtIGVycm9yOiBnb29kc0l0ZW1OdW1iZXIgaXMgc3VwcG9zZWQgdG8gYmUgYSBwb3NpdGl2ZSBudW1iZXIgYnV0IGl0IGlzIFwiJHtjaUluZGV4fVwiYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHplcm9IY0luZGV4ID0gaGNJbmRleCAtIDE7XHJcbiAgICAgICAgICAgIGNvbnN0IHplcm9DaUluZGV4ID0gY2lJbmRleCAtIDE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50IHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCB8fCBbXTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0uQ29uc2lnbm1lbnRJdGVtID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0uQ29uc2lnbm1lbnRJdGVtIHx8IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XS5Db25zaWdubWVudEl0ZW1bemVyb0NpSW5kZXhdID0gY2k7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYHNldENvbnNpZ25tZW50SXRlbSBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZE5ld0NvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNpOiBJQ29uc2lnbm1lbnRJdGVtID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICAgICAgY29uc3QgaGMgPSB0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFoYykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3VzZUNvbnNpZ25tZW50IHdpdGggaW5kZXggJHtoY0luZGV4fSBkb2VzIG5vdCBleGlzdGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhjLkNvbnNpZ25tZW50SXRlbSA9IGhjLkNvbnNpZ25tZW50SXRlbSB8fCBbXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNpTGVuZ3RoID0gaGMuQ29uc2lnbm1lbnRJdGVtLmxlbmd0aDtcclxuICAgICAgICAgICAgaGMuQ29uc2lnbm1lbnRJdGVtW2NpTGVuZ3RoXSA9IGNpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maXhIY1NlcXVlbmNlTnVtYmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZml4R29vZHNJdGVtTnVtYmVyKGhjSW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYGFwcGVuZE5ld0NvbnNpZ25tZW50SXRlbSBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUNvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGNpSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9iai5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV0/LkNvbnNpZ25tZW50SXRlbVtjaUluZGV4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdLkNvbnNpZ25tZW50SXRlbS5zcGxpY2UoY2lJbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXhHb29kc0l0ZW1OdW1iZXIoaGNJbmRleCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgcmVtb3ZlQ29zaWdubWVudEl0ZW0gZXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvSnNvbigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgcmVwbGFjZXIgZnVuY3Rpb24gZm9yIEpTT04uc3RyaW5naWZ5IHRoYXQgd2lsbCBvbWl0IHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGF0dE5hbWUgY2hpbGQgYnV0IGlmIHRoZXJlIGlzIG1vcmUsIGxlYXZlcyB0aGUgcmVzdC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVTa2lwUmVwbGFjZXIoYXR0TmFtZTogc3RyaW5nKTogKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnkge1xyXG4gICAgICAgIGxldCBza2lwID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNraXAgJiYga2V5ID09PSBhdHROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBza2lwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHNlcXVlbmNlTnVtYmVyIG9mIGFsbCBIb3VzZUNvbnNpZ25tZW50cyB0byBiZSBhbiBpbmNyZW1lbnRhbCBzZXF1ZW5jZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGZpeEhjU2VxdWVuY2VOdW1iZXIoKSB7XHJcbiAgICAgICAgaWYgKF8uaXNBcnJheSh0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnQpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudC5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbaV0uc2VxdWVuY2VOdW1iZXIgPSBpICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgZ29vZHNJdGVtTnVtYmVyIG9mIGFsbCBDb25zaWdubWVudEl0ZW1zIGluIGdpdmVuIEhvdXNlQ29uc2lnbm1lbnQgdG8gYmUgYW4gaW5jcmVtZW50YWwgc2VxdWVuY2VcclxuICAgICAqIEBwYXJhbSAge251bWJlcn0gaGNJbmRleCBJbmRleCBvZiBIb3VzZUNvbnNpZ25tZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZml4R29vZHNJdGVtTnVtYmVyKGhjSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHplcm9IY0luZGV4ID0gaGNJbmRleCAtIDE7XHJcblxyXG4gICAgICAgIGlmIChfLmlzQXJyYXkodGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XT8uQ29uc2lnbm1lbnRJdGVtKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbS5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbVtpXS5nb29kc0l0ZW1OdW1iZXIgPSBpICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBmdW5jdGlvbiBsb2dFcnJvcihlcnJNZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVyck1lc3NhZ2UpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IHRyYW5zaXREZWNsYXJhdGlvbk1vY2sgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICBcIkdVSURcIjogXCIzMzEwN2ExNS0zOTVlLTQyMDUtODQ5ZS0xYjViZGUxMDAzNWZcIixcclxuICAgIFwiVHJhbnNpdE9wZXJhdGlvblwiOiB7XHJcbiAgICAgICAgXCJMUk5cIjogXCJ1bHRyaWNlcyBDcmFzIGNvbnNlY3RcIixcclxuICAgICAgICBcImZhbGxiYWNrUHJvY2VkdXJlXCI6IHRydWUsXHJcbiAgICAgICAgXCJNUk5cIjogXCJQZWxsZW50ZXNxdWUgc2VtcGVcIixcclxuICAgICAgICBcInJlbGVhc2VEYXRlXCI6IFwiMjAyMS0wMS0yM1wiLFxyXG4gICAgICAgIFwiZGVjbGFyYXRpb25UeXBlXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzaVwiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uZGltZW50dW0gZXJvcyBDcmFzIGZhY2lsaXNpcyBVdCBoZW5kcmVyaXQgYWMgdmVzdGlidWx1bSBxdWlzIGFkaXBpc2NpbmcgbmVjIGVnZXN0YXMgZmV1Z2lhdCBtZXR1cyBsZW8gdHVycGlzIENyYXMgaW4gYXVndWUgcnV0cnVtIHNpdCBjb25kaW1lbnR1bSBlbGl0IGNvbnNlcXVhdCB2ZXN0aWJ1bHVtIG51bmMgYSB2ZWhpY3VsYSBqdXN0byByaXN1cyBwcmV0aXVtIG1hc3NhIGxpZ3VsYSBlZ2VzdGFzIGxvcmVtIFZlc3RpYnVsdW0gaWQgYWxpcXVhbSB2ZWwgZXN0IFN1c3BlbmRpc3NlIGhlbmRyZXJpdCBDcmFzIGVnZXQgcGVsbGVudGVzcXVlIG5lYyBuZWMgYXVndWUgYWNjdW1zYW4gZmVybWVudHVtIHZpdmVycmEgc2l0IGluIG9yY2kgZXUgbGlndWxhIGFtZXQgcG90ZW50aSBtb2xlc3RpZSBwcmV0aXVtIGV0IHZpdGFlIHNhcGllbiBVdCB0aW5jaWR1bnQgZWdldCBJbiBsYW9yZWV0IHZlbGl0IHByZXRpdW0gYXVndWUgbWkgdWx0cmljaWVzXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNC0yOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJhZGRpdGlvbmFsRGVjbGFyYXRpb25UeXBlXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicXVpcyByaXN1cyB0ZW1wdXMgYWMgQ3JhcyBTZWQgdmVsIE51bmMgdmVsIEludGVnZXIgbGVvIG1ldHVzIGRpZ25pc3NpbSBNYWVjZW5hcyBzb2xsaWNpdHVkaW4gc2FwaWVuIHBvc3VlcmUgcHVsdmluYXIgbGlndWxhIGxpZ3VsYSBpcHN1bSBtaSBzdXNjaXBpdCB0aW5jaWR1bnQgUGVsbGVudGVzcXVlIHB1bHZpbmFyIHR1cnBpcyBwdWx2aW5hciBtYXVyaXMgc3VzY2lwaXQgRXRpYW0gdmVsaXQgUXVpc3F1ZSBEdWlzIHZpdGFlIG5pYmggZWxpdFwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMjlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDItMTlUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiVElSQ2FybmV0TnVtYmVyXCI6IFwiYW1ldCB1dCBtb2xcIixcclxuICAgICAgICBcIlRJUnZhbGlkaXR5RGF0ZVwiOiBcIjIwMjAtMTEtMDJcIixcclxuICAgICAgICBcInNlY3VyaXR5XCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IDEuNTAyNjMwMDIyMTIyODIsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJldCBldSBzYXBpZW4gcHJldGl1bSBzZWQgcGVyIGNvbmRpbWVudHVtIHVybmEgbnVuYyBuZWMgdGVtcG9yIEV0aWFtIGFkaXBpc2NpbmcgZmVybWVudHVtIER1aXMgY29tbW9kbyBtZXR1cyBmYWNpbGlzaXMgdmFyaXVzIHByZXRpdW0gcmhvbmN1cyBhbWV0IFZlc3RpYnVsdW0gTWFlY2VuYXMganVzdG8gYWMgSW4gc2l0IGxpZ3VsYSBwb3N1ZXJlIG9kaW8gc2FnaXR0aXMganVzdG8gcXVpcyB0ZWxsdXMgZWdldCBwb3N1ZXJlIGVuaW0gYW1ldCBsaWd1bGEgZnJpbmdpbGxhIGluIGFjIHNvbGxpY2l0dWRpbiBkYXBpYnVzIG1pIG5pc2kgbG9ib3J0aXMgYW1ldCBwbGFjZXJhdCBlc3Qgb2RpbyBmZWxpcyBkb2xvciBzb2xsaWNpdHVkaW4gYmxhbmRpdFwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDktMTdUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwicmVkdWNlZERhdGFzZXRJbmRpY2F0b3JcIjogdHJ1ZSxcclxuICAgICAgICBcInNwZWNpZmljQ2lyY3Vtc3RhbmNlSW5kaWNhdG9yXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlZ2V0IGVsaXQgcGhhcmV0cmEgZXJvcyBmZWxpcyBJbiBkb2xvciBlcm9zIGFjIFBlbGxlbnRlc3F1ZSBwb3N1ZXJlIHNhcGllbiBzb2xsaWNpdHVkaW4gU2VkIHZlc3RpYnVsdW0gaWQgcmhvbmN1cyBwZWxsZW50ZXNxdWUgdnVscHV0YXRlIFBoYXNlbGx1cyB2ZWwgdHJpc3RpcXVlIHZpdGFlIHR1cnBpcyBJbnRlZ2VyIEV0aWFtIGJsYW5kaXQgZXN0IHZlbGl0IHNvbGxpY2l0dWRpbiBwb3J0YSBTZWQgYXQgbWF0dGlzIG1hZ25hIG1pIG5vbiBjb25kaW1lbnR1bSBmYXVjaWJ1cyB2ZWwgZWdlc3RhcyB0cmlzdGlxdWUgVml2YW11cyBOdWxsYSBibGFuZGl0IG9kaW8gTW9yYmkgVXQgYW1ldCBOdW5jXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMi0wOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJ0b3RhbFZhbHVlT2ZHb29kc1wiOiAxMi40NjE4ODM4NTk5MjQsXHJcbiAgICAgICAgXCJjb21tdW5pY2F0aW9uTGFuZ3VhZ2VBdERlcGFydHVyZVwiOiB7XHJcbiAgICAgICAgICAgIFwiQ291bnRyeVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgIFwiTGFuZ3VhZ2VcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicmlzdXMgU2VkIHF1aXMgZHVpIEludGVnZXIgYW1ldCByaXN1cyBhbWV0XCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0wNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMi0xN1QyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJiaW5kaW5nSXRpbmVyYXJ5XCI6IGZhbHNlLFxyXG4gICAgICAgIFwibGltaXREYXRlXCI6IFwiMjAxOS0wMi0wMlQyMjozNzo0NFpcIlxyXG4gICAgfSxcclxuICAgIFwiQXV0aG9yaXNhdGlvblwiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU2MDc4LFxyXG4gICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInVsdHJpY2llcyB0aW5jaWR1bnQgdmVzdGlidWx1bSBzZW0gZGFwaWJ1cyBwaGFyZXRyYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA5LTMwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOC0xOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInNvZGFsZXMgaGVuZHJlcml0IGZhdWNpYnVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzMjkyNixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIlV0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiTnVuYyBhbWV0IHV0IGVnZXN0YXMgUGhhc2VsbHVzIGZhdWNpYnVzIERvbmVjIGZlcm1lbnR1bSBhY1wiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA4LTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMS0xN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImZyaW5naWxsYSBvcmNpIHZlbFwiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFwiQ3VzdG9tc09mZmljZU9mRGVwYXJ0dXJlXCI6IHtcclxuICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcIk1hZWNlbmFzXCIsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJjb25zZWN0ZXR1ciBtZXR1cyBlcm9zIGNvbmRpbWVudHVtIFByb2luIEN1cmFiaXR1ciBzYXBpZW4gZmV1Z2lhdCBjdXJzdXMgU3VzcGVuZGlzc2VcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA1LTEwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTExLTAxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiQ3VzdG9tc09mZmljZU9mRGVzdGluYXRpb25EZWNsYXJlZFwiOiB7XHJcbiAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogXCJwaGFyZXRyYVwiLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaWQgdXJuYSBhbGlxdWFtIGVnZXQgdGluY2lkdW50IGxhY2luaWEgaGVuZHJlcml0IHBvc3VlcmUgRG9uZWMgdml0YWUgY29uZ3VlIEV0aWFtIGxhY2luaWEgcmhvbmN1c1wiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDctMjdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTEtMTlUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJDdXN0b21zT2ZmaWNlT2ZUcmFuc2l0RGVjbGFyZWRcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2NjgzLFxyXG4gICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJwdWx2aW5hclwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5vbiBtaSBtYXNzYSBlcmF0IGVsaXQgcGhhcmV0cmEgcGVsbGVudGVzcXVlIGlwc3VtIGFkaXBpc2Npbmcgdml0YWUgbWV0dXMgbnVsbGEgbmVjIG1hdXJpcyBzZWQgU2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDMtMjdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAzLTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiYXJyaXZhbERhdGVBbmRUaW1lRXN0aW1hdGVkXCI6IFwiMjAxOS0wOS0yMFQyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI1MTI3LFxyXG4gICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJNYWVjZW5hc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1pIGRpY3R1bSB0ZW1wdXMgRG9uZWMgZXN0IGxlY3R1cyBTZWQgTnVsbGEgc2VkIGVnZXQgYW50ZSBpZCBjb25zZWN0ZXR1ciBwb3J0dGl0b3IgdG9ydG9yIE1vcmJpIGlkIGxhY3VzIGFkaXBpc2NpbmcgYWRpcGlzY2luZyB2aXRhZSBQcm9pbiBxdWFtIE5hbSBlbmltIG5pc2kgYW1ldCBzaXQgdml0YWUgc2VkIHRyaXN0aXF1ZSBwZWxsZW50ZXNxdWUgZmF1Y2lidXMgcGxhY2VyYXQgbGFjdXMgUHJhZXNlbnQgbG9yZW0gc2l0IHZlaGljdWxhXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDctMThUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAxLTI4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiYXJyaXZhbERhdGVBbmRUaW1lRXN0aW1hdGVkXCI6IFwiMjAxOS0wMy0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBcIkN1c3RvbXNPZmZpY2VPZkV4aXRGb3JUcmFuc2l0RGVjbGFyZWRcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4NzMzNyxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiTWFlY2VuYXNcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlbGVpZmVuZCB0dXJwaXMgQ3VyYWJpdHVyIHJpc3VzIHBvcnRhIHNlbXBlciBEb25lYyBzb2xsaWNpdHVkaW4gc2FnaXR0aXMgUGVsbGVudGVzcXVlIG1vbGVzdGllIGRpYW0gbWV0dXMgbGVvIHJpc3VzIG5vbiBpbiBDcmFzIGF1Z3VlIGRpY3R1bSBQZWxsZW50ZXNxdWUgbmliaCBwb3J0dGl0b3IgYW1ldCBOdW5jIG1vbGxpcyB2dWxwdXRhdGUgZGFwaWJ1cyB1bHRyaWNlcyBlbmltIG51bmMganVzdG8gbWF1cmlzIEZ1c2NlIG5lYyBkYXBpYnVzIGRpYW0gaWFjdWxpcyBsaXRvcmEgbm9uIHBvc3VlcmUgc29sbGljaXR1ZGluIG1hc3NhIGFtZXQgZXJvcyBtb2xlc3RpZSBQZWxsZW50ZXNxdWUgTmFtIGVyb3MgYWxpcXVhbSBuaXNpIFV0IHZlaGljdWxhIHNlbXBlciBsYWNpbmlhXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMjJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA0LTAxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzODQ3NCxcclxuICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibW9sZXN0aWVcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2ZWwgY29uZGltZW50dW0gcG9zdWVyZSBmcmluZ2lsbGEgZWxpdCBudWxsYSBqdXN0byBkaWN0dW0gZWdlc3RhcyBzYWdpdHRpcyBqdXN0byBTdXNwZW5kaXNzZSBhdWN0b3IgcGxhY2VyYXQgc2l0IHV0IHVsdHJpY2llcyB2ZWxpdCBTZWQgZWdldCBhbnRlIHZpdGFlIGxvcmVtIGlhY3VsaXMgdXQgZmFjaWxpc2lzIG5pc2kgYmxhbmRpdCB2dWxwdXRhdGUgc2l0IEFlbmVhbiBudWxsYSBsYW9yZWV0IGFudGUgZWdldCBsaWd1bGEgbW9sZXN0aWUgTnVuYyBibGFuZGl0IHBvc3VlcmUgcmlzdXMgcG9zdWVyZSBzaXQgdWx0cmljaWVzIG1pIFZlc3RpYnVsdW0gY29uc2VjdGV0dXIgUXVpc3F1ZSB1bHRyaWNpZXMgYWNjdW1zYW4gc2l0IG1hdXJpcyBQcmFlc2VudFwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA3LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMi0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFwiSG9sZGVyT2ZUaGVUcmFuc2l0UHJvY2VkdXJlXCI6IHtcclxuICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwidmVuZW5hdGlzXCIsXHJcbiAgICAgICAgXCJUSVJIb2xkZXJJZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcImltcGVyZGlldCBkaWN0dW0gbmliaCBlZ2V0IExvcmVtIGFudGUgYW50ZSBhY1wiLFxyXG4gICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiZG9sb3IgdGVtcHVzIGNvbmRpbWVudHVtIHF1aXMgbmVxdWVcIixcclxuICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcInNlZCBzaXQgdGVtcG9yXCIsXHJcbiAgICAgICAgICAgIFwiY2l0eVwiOiBcIm1ldHVzIGVnZXQgcXVpc1wiLFxyXG4gICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkYXBpYnVzXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDktMDRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA3LTE0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkN1cmFiaXR1ciBjb252YWxsaXNcIixcclxuICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcInBoYXJldHJhIGZldWdpYXRcIixcclxuICAgICAgICAgICAgXCJlTWFpbEFkZHJlc3NcIjogXCJ1dCBpbXBlcmRpZXQgdGVsbHVzIFNlZCB2ZWhpY3VsYSBldSBub24gTnVsbGEgYWxpcXVhbSBhbWV0IHRlbGx1cyBwdWx2aW5hciBsYWNpbmlhIGNvbnViaWEgYXVjdG9yIGJpYmVuZHVtIFNlZCBlcmF0IGF1Z3VlIHBvcnRhIFV0IFBoYXNlbGx1cyBhZGlwaXNjaW5nIHZlbmVuYXRpcyBzb2Npb3NxdSBlZ2V0XCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJSZXByZXNlbnRhdGl2ZVwiOiB7XHJcbiAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInZlc3RpYnVsdW1cIixcclxuICAgICAgICBcInN0YXR1c1wiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiAwLjAwMDA1NjQ4MDI1MTQxODY1MDMsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkaWN0dW0gcXVhbSBncmF2aWRhIHZlbCB2aXRhZSBwaGFyZXRyYSBuZWMgbmlzaSBpZCBhbWV0IGZyaW5naWxsYSB2b2x1dHBhdCBmYWNpbGlzaXMgc2FnaXR0aXMgZXJhdCBBbGlxdWFtIHBoYXJldHJhIG5pYmggdmVsaXQgZXJhdCBQcmFlc2VudCBTZWQgY29udmFsbGlzIHZlc3RpYnVsdW0gTW9yYmkgbm9uIFBoYXNlbGx1cyBwb3N1ZXJlIG9yY2kgb3JuYXJlIHVsbGFtY29ycGVyIEluIGxvYm9ydGlzIFByYWVzZW50IGhlbmRyZXJpdCBqdXN0byBtZXR1cyBwZXIgY29uZGltZW50dW0gdWxsYW1jb3JwZXIgbmliaCBDcmFzIGVsZW1lbnR1bSBldSBzZWQgdmVzdGlidWx1bVwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDgtMjJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDEtMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInZlbCBtYXVyaXMgbmVjIHBvcnRhIGFjY3Vtc2FuIGEgdmVzdGlidWx1bSBNYWVjZW5hc1wiLFxyXG4gICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IFwicHVydXMgbGlndWxhIGVnZXN0YXMgSW4gY29udmFsbGlzXCIsXHJcbiAgICAgICAgICAgIFwiZU1haWxBZGRyZXNzXCI6IFwiY3Vyc3VzIG5lcXVlIG9ybmFyZSBlbmltIGp1c3RvIGVnZXQgZmVybWVudHVtIG1hdXJpcyB2b2x1dHBhdCB0YWNpdGkgbGlndWxhIFBoYXNlbGx1cyB2ZWwgUGhhc2VsbHVzIHBvc3VlcmUgbGFvcmVldCBoZW5kcmVyaXQgbm9uIHBoYXJldHJhIHNlZCBzZW0gZWxpdCBxdWlzIHF1aXMgbW9sZXN0aWUgaXBzdW1cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIkd1YXJhbnRlZVwiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQ4MzkwLFxyXG4gICAgICAgICAgICBcImd1YXJhbnRlZVR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbmRpbWVudHVtIGFjIG5vbiBJbiBsYW9yZWV0IFByYWVzZW50IGxhY2luaWEgZGFwaWJ1cyBOdW5jIGVyb3MgdGVsbHVzIG5pYmggc2VkIHBsYWNlcmF0IGZldWdpYXQgZXN0IFNlZCBmYXVjaWJ1c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAyLTA4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0wNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIm90aGVyR3VhcmFudGVlUmVmZXJlbmNlXCI6IFwiTnVuY1wiLFxyXG4gICAgICAgICAgICBcIkd1YXJhbnRlZVJlZmVyZW5jZVwiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NzU1MCxcclxuICAgICAgICAgICAgICAgICAgICBcIkdSTlwiOiBcImxpZ3VsYSBkaWN0dW0gY29uc2VjdGV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NDb2RlXCI6IFwiU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbW91bnRUb0JlQ292ZXJlZFwiOiA0LjEyNjYzNDA2ODg0NjA3LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY3VycmVuY3lcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJSYXRlVmFsdWVcIjogMC4wMDA4NTM4NzQxMDE3MDExMzQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkaWN0dW0gdHJpc3RpcXVlIGV1IHZlbCB2ZWwgc2FwaWVuIGFkaXBpc2NpbmcgZXUgZmVsaXMgZWdldCBzaXQgY29uZGltZW50dW0gbmVjIFBoYXNlbGx1cyBtYXNzYSBpbXBlcmRpZXQgZGlhbSBpZCBzZW0gYWMgbm9uIGZhY2lsaXNpcyBtaSBwb3J0YSBzaXQgdml2ZXJyYSBhIG1vbGVzdGllIHNlZCB2ZWhpY3VsYSBvcm5hcmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA1LTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA1LTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDcwMDA2LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR1JOXCI6IFwidXQgZnJpbmdpbGxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbW91bnRUb0JlQ292ZXJlZFwiOiA5Ny43OTYzNTE1MDgxNDI2LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY3VycmVuY3lcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJSYXRlVmFsdWVcIjogMC4wNTQwNjg2MzU3MDg2ODQ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibm9uIE1hZWNlbmFzIG1ldHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMi0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOC0yN1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDUzODQ5LFxyXG4gICAgICAgICAgICBcImd1YXJhbnRlZVR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNvZGFsZXMgc2l0IHZpdGFlIGluIFNlZCBxdWlzIHNpdCBzb2RhbGVzIHN1c2NpcGl0IHZlbCBxdWlzIHNhcGllbiB2ZWwgbmliaCB2ZW5lbmF0aXNcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0xNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTEtMDNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJvdGhlckd1YXJhbnRlZVJlZmVyZW5jZVwiOiBcInBlbGxlbnRlc3F1ZSBmZXJtZW50dW1cIixcclxuICAgICAgICAgICAgXCJHdWFyYW50ZWVSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzMzOTgsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJHUk5cIjogXCJsYWN1cyBkdWkgVXQgY29uZGltZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICBcImFjY2Vzc0NvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbW91bnRUb0JlQ292ZXJlZFwiOiAwLjM1NTY2NzU5Njg0ODUyNyxcclxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbmN5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmF0ZVZhbHVlXCI6IDAuMDAwMzIyNDIwNDM3NTA0NzMzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsIGNvbnNlY3RldHVyIGFjIGFudGUgc29jaW9zcXUgc2l0IGVzdCBldSBkb2xvciBhdCBwcmV0aXVtIHNpdCBjb25kaW1lbnR1bSBOdW5jIHZlc3RpYnVsdW0gdGVtcHVzIHZlaGljdWxhIG5pc2wgdHJpc3RpcXVlIGRhcGlidXMgY29uZ3VlIG5lYyBwb3J0YSBjb25kaW1lbnR1bSBtb2xlc3RpZSBwb3J0YSBzZWQgYSB2b2x1dHBhdCBmYWNpbGlzaXMgdGFjaXRpIGNvbnViaWEgZmFjaWxpc2lzIGZldWdpYXQgcGhhcmV0cmEgZWxpdCBwb3J0dGl0b3IgaWFjdWxpcyBpZCBBZW5lYW4gZXN0IG5vbiB2ZWwgdmVzdGlidWx1bSBlbGVtZW50dW0gYSBpZCBmYWNpbGlzaXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA5LTI2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA2LTA4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDkzMTA0LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR1JOXCI6IFwidXJuYSB0dXJwaXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcImFjY2Vzc0NvZGVcIjogXCJzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImFtb3VudFRvQmVDb3ZlcmVkXCI6IDUuMDA5MjE4MDAwMzQ1NSxcclxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbmN5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmF0ZVZhbHVlXCI6IDAuMDAwMDU0NTIzNjAwMTk3NjQxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaWQgc2FnaXR0aXMgaW4gc2l0IHNlbSBtYXVyaXMgZGFwaWJ1cyBhYyBhbWV0IGxpZ3VsYSBTZWQgZWxpdCBtb2xlc3RpZSBzZW0gc2FwaWVuIHBoYXJldHJhIGV0IGZldWdpYXQgdGVsbHVzIG51bGxhIHZ1bHB1dGF0ZSBzY2VsZXJpc3F1ZSB2aXRhZSBhZGlwaXNjaW5nIHNlbXBlciBhIERvbmVjIG5pYmggbW9sZXN0aWUgTWF1cmlzIGhlbmRyZXJpdCBhZGlwaXNjaW5nIHZlc3RpYnVsdW0gY29uc2VjdGV0dXIgYSBxdWlzIG1ldHVzIHN1c2NpcGl0IG5pc2wgc2l0IHRyaXN0aXF1ZSBhbnRlIG5lYyBxdWlzIENyYXMgTnVuYyBoZW5kcmVyaXQgRG9uZWMgTWFlY2VuYXMgZXJvcyB2ZWwgc2VkIFNlZCBsYWN1cyBuZWMgdmFyaXVzIHBoYXJldHJhIENyYXMgZXUgc29sbGljaXR1ZGluIGRvbG9yIE1hdXJpcyBub24gdXQgc2VtcGVyIGVsaXQgZmFjaWxpc2lzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNy0yM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMi0yMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBcIkNvbnNpZ25tZW50XCI6IHtcclxuICAgICAgICBcImNvdW50cnlPZkRpc3BhdGNoXCI6IHtcclxuICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA4LTI0XCIsXHJcbiAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDMtMDFcIixcclxuICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDMuODcxMTgwMTcwMTU1NjgsXHJcbiAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInF1aXMgRXRpYW0gaW50ZXJkdW0gZGlhbSBvcmNpIGxhY3VzIGludGVyZHVtIHF1YW0gTnVuYyBlbGl0IGZlcm1lbnR1bSBkaWN0dW0gRXRpYW0gdWxsYW1jb3JwZXIgU2VkIHNlbSBuZWMgbWFnbmEgdm9sdXRwYXQgc2VkIGltcGVyZGlldCBzdXNjaXBpdCBhZGlwaXNjaW5nIGFjIGluIGFjY3Vtc2FuIGVnZXN0YXMgYWNjdW1zYW4gQ3VyYWJpdHVyIGNvbnNlcXVhdCB2ZWhpY3VsYSBuaXNpIGV1IGEgcmlzdXMgTnVsbGEgbGVvIHF1aXMgYW1ldCBkb2xvciB2ZWhpY3VsYSBEdWlzIG1vbGVzdGllIGZldWdpYXQgaGVuZHJlcml0IHJpc3VzIHNhcGllbiBxdWlzIGVzdCBzYXBpZW4gZ3JhdmlkYSBkaWN0dW0gU2VkIGFjIGhlbmRyZXJpdCBwZWxsZW50ZXNxdWUgdXQgZWxpdCBkYXBpYnVzIHV0IHZlc3RpYnVsdW0gUHJhZXNlbnQgY29uc2VjdGV0dXIgZXJhdCBpcHN1bSBpZCBzb2xsaWNpdHVkaW4gdnVscHV0YXRlIHN1c2NpcGl0IER1aXMgcnV0cnVtIHZpdGFlIGV1XCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMC0wOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjb3VudHJ5T2ZEZXN0aW5hdGlvblwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiBcIm1pXCIsXHJcbiAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wMy0xNVwiLFxyXG4gICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDIwLTAzLTEwXCIsXHJcbiAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjA1MTUxODMxMTQyMjA5MzksXHJcbiAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVsaXQgdXJuYSBhbWV0IGhlbmRyZXJpdCBhbGlxdWFtIHZlc3RpYnVsdW0gZXJhdCBqdXN0byB0cmlzdGlxdWUgbGliZXJvIHRpbmNpZHVudCBpbiBvcmNpIGNvbmRpbWVudHVtIGVsaXQgY29tbW9kbyB2aXRhZSBjb25ndWUgbGVvIGxhY3VzIG5lYyBjdXJzdXMgdG9ydG9yIG9kaW8gbW9sbGlzIHNvZGFsZXMgZXN0IHZlc3RpYnVsdW0gYSBQcmFlc2VudCBTZWQgaXBzdW0gdHVycGlzIHN1c2NpcGl0IGludGVyZHVtIGRhcGlidXNcIixcclxuICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAzLTEzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTEwLTEzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImNvbnRhaW5lckluZGljYXRvclwiOiBmYWxzZSxcclxuICAgICAgICBcImlubGFuZE1vZGVPZlRyYW5zcG9ydFwiOiB7XHJcbiAgICAgICAgICAgIFwiQ29kZVwiOiA2LFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibnVsbGEgY29uc2VxdWF0IFZpdmFtdXMgdGluY2lkdW50IHNvZGFsZXMgc2VtIHRyaXN0aXF1ZSBudW5jIG5pc2kgSW4gVmVzdGlidWx1bSBzYXBpZW4gdmVzdGlidWx1bSBFdGlhbSBFdGlhbSBlcm9zIHV0IGxhY2luaWEgRG9uZWMgbGFvcmVldCBhYyByaXN1cyBMb3JlbSBhZGlwaXNjaW5nIHZlaGljdWxhIER1aXMgcGhhcmV0cmEgbWV0dXMgUGVsbGVudGVzcXVlIHNlZCBlZ2V0IHZlc3RpYnVsdW0gUXVpc3F1ZSB1dCBhIGEgY29udmFsbGlzIGluIHVybmEgYWRpcGlzY2luZyB2ZWwgZnJpbmdpbGxhIER1aXMgYW1ldCB1cm5hIE1hZWNlbmFzIGF1Z3VlIEN1cmFiaXR1ciBzb2xsaWNpdHVkaW4gbWF1cmlzIHByZXRpdW0gZWdlc3RhcyBvZGlvIG9kaW8gaWQgU3VzcGVuZGlzc2UgbGliZXJvIGEgbmVjIGFudGUgdXJuYSBxdWlzIG1hdXJpcyB2b2x1dHBhdFwiLFxyXG4gICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTAtMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMTlUMjI6Mzc6NDRaXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwibW9kZU9mVHJhbnNwb3J0QXRUaGVCb3JkZXJcIjoge1xyXG4gICAgICAgICAgICBcIkNvZGVcIjogNyxcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInR1cnBpcyBhbnRlIHV0IGV1IGZhdWNpYnVzIHV0IGxpZ3VsYSBwaGFyZXRyYSBhIG1ldHVzIFV0IE1hdXJpcyBpbmNlcHRvcyBmcmluZ2lsbGEgcmlzdXMgSW50ZWdlciBtb2xlc3RpZSBpYWN1bGlzIGlkIHF1aXMgbmliaCBzb2RhbGVzIHNlbXBlciB0aW5jaWR1bnQgcHVydXMgRHVpcyBjb25zZXF1YXQgdGluY2lkdW50IGVyYXQgc2VtIHRvcnRvciB2ZWxpdCBTZWQgUHJhZXNlbnQgZXJvcyBuZXF1ZSBjb21tb2RvIGRvbG9yXCIsXHJcbiAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMS0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNS0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJncm9zc01hc3NcIjogNy42MDg0MzAwNDkxOTk4MSxcclxuICAgICAgICBcInJlZmVyZW5jZU51bWJlclVDUlwiOiBcInBoYXJldHJhIGFtZXQgZ3JhdmlkYVwiLFxyXG4gICAgICAgIFwiQ2FycmllclwiOiB7XHJcbiAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJpcHN1bSBQcmFlc2VudFwiLFxyXG4gICAgICAgICAgICBcIkNvbnRhY3RQZXJzb25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiRG9uZWMgbmlzaSBuZWMgZmFjaWxpc2lzIFZpdmFtdXMgcmlzdXMgdXQgZWxpdCBkdWkgVXQgZXJvcyB2ZWxcIixcclxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogXCJhZGlwaXNjaW5nIHRlbXB1cyB2ZWwgZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlTWFpbEFkZHJlc3NcIjogXCJFdGlhbSBEdWlzIGNvbW1vZG8gYWMgZXJhdCBuaXNpIG1hc3NhXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJDb25zaWdub3JcIjoge1xyXG4gICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiaWQgb2RpbyBmYWNpbGlzaXNcIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwibWV0dXMgbWFzc2Egc2l0IERvbmVjIGVyb3NcIixcclxuICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwibW9sZXN0aWVcIixcclxuICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJJbnRlZ2VyIHNlbVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwiZWxpdCBtYWduYSBmYXVjaWJ1cyBVdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJDbGFzcyBOYW0gZXJhdCBtYXVyaXMgdmVuZW5hdGlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAyLTE1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJDb250YWN0UGVyc29uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1hdXJpcyBwbGFjZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcInJob25jdXNcIixcclxuICAgICAgICAgICAgICAgIFwiZU1haWxBZGRyZXNzXCI6IFwidmVsIG1vbGVzdGllIHZlbGl0IEFlbmVhbiBwcmV0aXVtXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiZXUgRXRpYW1cIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwidml2ZXJyYSBtYXVyaXMgaWQgYXVndWUgbnVuYyBldCBTdXNwZW5kaXNzZVwiLFxyXG4gICAgICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJtYWduYSBzaXQgbmVjIHZlbCBtaSB2ZWwgUHJvaW4gZ3JhdmlkYSBtZXR1cyBhbnRlXCIsXHJcbiAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwidXJuYSBjb25ndWVcIixcclxuICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcImZlbGlzIGRpY3R1bVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJtaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJvZGlvIGxlbyBzYXBpZW4gbmVjIHJob25jdXMgUHJhZXNlbnQgZW5pbSB2ZWwgY29uZ3VlIG5pc2kgc2VtIGZlcm1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNi0xNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEwLTA4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDg3MjE4LFxyXG4gICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJwZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibmlzbCBldCBzZW0gZmV1Z2lhdCBWZXN0aWJ1bHVtIHJpc3VzIHJpc3VzIERvbmVjIHR1cnBpcyBqdXN0byBzZWQgbmVjIG1ldHVzIHNpdCB2YXJpdXMgc2l0IFZlc3RpYnVsdW0gZG9sb3IgZW5pbSBBbGlxdWFtIGFjIE5hbSBwb3N1ZXJlIHBlciBhYyBpZCBhYyBzaXQgbmVjIG5lYyBhbGlxdWFtIG1ldHVzIHZ1bHB1dGF0ZSBTZWQgaW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMjVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMS0yM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDgxOTg3LFxyXG4gICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJjb25kaW1lbnR1bSBsYWNpbmlhIHNlbSBOdWxsYSBsZW8gdG9ydG9yIG1pIGxhb3JlZXQgdmVsaXQgaWQgYmliZW5kdW0gYW1ldCBzZWQgYWNjdW1zYW4gdmVsIG1hc3NhIGRhcGlidXMgcG9ydGEgU3VzcGVuZGlzc2UgbWF1cmlzIHVybmEgdXQgY29udmFsbGlzIGxlbyB2ZWhpY3VsYSB0aW5jaWR1bnQgdWx0cmljaWVzIFV0IHRlbGx1cyBhbWV0IGFtZXQgcHJldGl1bSB1dCBhbWV0IGVsaXQgYWxpcXVldCBtYXVyaXMgZWdldCBtaSB2ZXN0aWJ1bHVtIG5lYyBpZCBhZGlwaXNjaW5nIGFjIHByZXRpdW0gaWQgYWxpcXVhbSBtYXNzYSB1bHRyaWNlcyB2ZWwgRG9uZWMgQ3Jhc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0xNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTExVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImludGVyZHVtXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJUcmFuc3BvcnRFcXVpcG1lbnRcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY2NDIzLFxyXG4gICAgICAgICAgICAgICAgXCJjb250YWluZXJJZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImNvbnViaWEgUGVsbGVudGVcIixcclxuICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZTZWFsc1wiOiA5NDY4LFxyXG4gICAgICAgICAgICAgICAgXCJTZWFsXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTM1MjEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmllclwiOiBcImFjY3Vtc2FuIHRpbmNpZHVudCBcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQ1NDkyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpZXJcIjogXCJsZW8gbW9sbGlzXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJHb29kc1JlZmVyZW5jZVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQwODMxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDYyNTczXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzk5MTQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25Hb29kc0l0ZW1OdW1iZXJcIjogODcwMzVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTM3ODcsXHJcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lcklkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiQ3JhcyBqdXN0byBzaXQgalwiLFxyXG4gICAgICAgICAgICAgICAgXCJudW1iZXJPZlNlYWxzXCI6IDYxODYsXHJcbiAgICAgICAgICAgICAgICBcIlNlYWxcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5MTU4OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWVyXCI6IFwic29sbGljaXR1ZGluIGVsZW1lblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjA2OTQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmllclwiOiBcIlNlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFwiR29vZHNSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4MTU5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDUxOTQxXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTE0NTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjbGFyYXRpb25Hb29kc0l0ZW1OdW1iZXJcIjogMzU4ODFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiTG9jYXRpb25PZkdvb2RzXCI6IHtcclxuICAgICAgICAgICAgXCJ0eXBlT2ZMb2NhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidGVsbHVzIER1aXMgc2l0IGVnZXQgbWF1cmlzIHV0IHByZXRpdW0gRHVpcyBhZGlwaXNjaW5nIHBvcnRhIGZlbGlzIGxlY3R1cyB1dCBuaXNpXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDMtMjJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAzLTMxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwicXVhbGlmaWVyT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGlndWxhIG1ldHVzIFByYWVzZW50IHB1bHZpbmFyIGVsZW1lbnR1bSBhYyBOYW0gUHJhZXNlbnQgb2RpbyBldWlzbW9kIGlkIGZldWdpYXQgc2l0IHBoYXJldHJhIGVyYXQgdXQgaW1wZXJkaWV0IGNvbmRpbWVudHVtIHRlbGx1cyBwZWxsZW50ZXNxdWUgTnVsbGEgdGVsbHVzIHVsdHJpY2llcyB0ZWxsdXMgZG9sb3IgbnVsbGEgVXQgYXQgbmlzaSBWaXZhbXVzIGVnZXQgY29uZ3VlIExvcmVtIG9ybmFyZSBzZWQgcGVsbGVudGVzcXVlIHVybmEgbW9sZXN0aWUgdGVtcHVzIGVnZXQgc29kYWxlcyBwcmV0aXVtIGRpYW0gbGFvcmVldCBzb2RhbGVzIG5lYyB2ZXN0aWJ1bHVtIHV0IGZlcm1lbnR1bSBTdXNwZW5kaXNzZSB2b2x1dHBhdCB1bGxhbWNvcnBlciB2ZWhpY3VsYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA5LTE3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImF1dGhvcmlzYXRpb25OdW1iZXJcIjogXCJDcmFzIHRyaXN0aXF1ZVwiLFxyXG4gICAgICAgICAgICBcImFkZGl0aW9uYWxJZGVudGlmaWVyXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICBcIlVOTG9jb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkRvbmVjXCIsXHJcbiAgICAgICAgICAgICAgICBcIk5hbWVcIjogXCJhYyBOdWxsYSBmZXJtZW50dW0ganVzdG9cIixcclxuICAgICAgICAgICAgICAgIFwiQ2hhbmdlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJTdWJkaXZpc2lvblwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgXCJGdW5jdGlvblwiOiBcInZvbHV0cGF0XCIsXHJcbiAgICAgICAgICAgICAgICBcIlN0YXR1c1wiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkRhdGVfXCI6IDAuMDA5NTU3NzUyNzUzNDAxOTksXHJcbiAgICAgICAgICAgICAgICBcIkNvb3JkaW5hdGVzXCI6IFwicGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbW1lbnRfXCI6IFwiUGhhc2VsbHVzIGxhY2luaWEgUHJhZXNlbnQgcXVpcyBjb25kaW1lbnR1bSBwb3J0YSBzaXQgcnV0cnVtIGdyYXZpZGEgTnVsbGFtIGVzdCB1bGxhbWNvcnBlciBhdWd1ZSBDcmFzIFZpdmFtdXMgc2l0IGF0IEV0aWFtIG5vbiBjb25kaW1lbnR1bSBldSBtYXVyaXMgZWxlaWZlbmQgZWxlaWZlbmRcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzb2xsaWNpdHVkaW4gaW4gZG9sb3IgUGVsbGVudGVzcXVlIGRhcGlidXMgZmV1Z2lhdCBsb2JvcnRpcyBEb25lYyBsYW9yZWV0IGZlcm1lbnR1bSBsYW9yZWV0IHJob25jdXMgdnVscHV0YXRlIGxpZ3VsYSBmcmluZ2lsbGEgcXVpcyBibGFuZGl0IGFsaXF1ZXQgaWQgY3Vyc3VzIGNvbnZhbGxpcyBjb25kaW1lbnR1bSBuaWJoIGZyaW5naWxsYSBlZ2V0IGFtZXQgdWx0cmljZXMgbGVjdHVzXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMjZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiQ3VzdG9tc09mZmljZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVoaWN1bGFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2l0IHZlbCBzZW0gdmVzdGlidWx1bSByaXN1cyBzZW1wZXIgZWdlc3RhcyBkYXBpYnVzIGV0IGRpZ25pc3NpbSBldSBhbnRlIE5hbSBOdWxsYW0gYWRpcGlzY2luZyBQcm9pbiBxdWlzIHRpbmNpZHVudCBpcHN1bSByaXN1cyBhYyBpZCBJbiBjdXJzdXMgYW50ZSBQaGFzZWxsdXMgaW4gbWFnbmEgdmVzdGlidWx1bSBmZXJtZW50dW0gdmVsIGF1Z3VlIHNjZWxlcmlzcXVlIGFtZXQgcHVydXMgbmVjIGxlbyBlcmF0IGRpYW0gdGVtcG9yIGFtZXQgZXJhdCBwb3J0dGl0b3IgdnVscHV0YXRlIGZyaW5naWxsYSBQcmFlc2VudCBwb3J0dGl0b3IgcGxhY2VyYXQgb3JjaSBsb2JvcnRpcyBkaWN0dW0gdmVsIHZlaGljdWxhIHBlciB2ZWxpdCB2YXJpdXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMTZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0yOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkdOU1NcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJsYXRpdHVkZVwiOiBcInNjZWxlcmlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcImxvbmdpdHVkZVwiOiBcImFjIG1ldHVzIGVyYXQgYVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRWNvbm9taWNPcGVyYXRvclwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwic29sbGljaXR1ZGluXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiU2VkIHNpdCBwdWx2aW5hciBEdWlzIFZpdmFtdXNcIixcclxuICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJhIFF1aXNxdWVcIixcclxuICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcInJpc3VzXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDE5LTAyLTI1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMC0wMi0xNFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjUwNzc3MjgyNDAzMjEyNixcclxuICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibmVjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImF1Z3VlIG5pc2wgc2VkIG9kaW8ganVzdG8gZmVybWVudHVtIG5vbiBNYWVjZW5hcyBzb2RhbGVzIFByYWVzZW50IGVsZW1lbnR1bSBsZW8gYWMgRG9uZWMgcG9zdWVyZSBhIGNvbmRpbWVudHVtIHV0IGZlcm1lbnR1bSBhY2N1bXNhbiBudWxsYSBhIGZlcm1lbnR1bSBuZWMgZmV1Z2lhdCBmZXJtZW50dW0gZXQgdmFyaXVzIHZhcml1cyBwb3N1ZXJlIG1hc3NhIGNvbW1vZG8gdml0YWUgbGVvIGhlbmRyZXJpdCB2b2x1dHBhdCBmZXJtZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMDFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMy0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkFkZHJlc3NUXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiaG91c2VOdW1iZXJcIjogXCJlcmF0IG5vbiBEb25lY1wiLFxyXG4gICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcIkFlbmVhbiBzZW1wZXJcIixcclxuICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiQ3VyYWJpdHVyIGFtZXQgb2RpbyBsaWd1bGEgdXJuYSBzb2xsaWNpdHVkaW4gYWMgZG9sb3IgaW4gZWdldCBmcmluZ2lsbGEgdGVtcG9yIGV0IGV1IHRyaXN0aXF1ZSBwdWx2aW5hciBkaWN0dW0gdmFyaXVzIGlhY3VsaXMgbGFvcmVldCBncmF2aWRhIHZlbGl0IHNhZ2l0dGlzIGluIGZhdWNpYnVzIGVyb3MgdWx0cmljZXMgY3Vyc3VzIG1ldHVzIHZlbCBhYyBkaWN0dW0gY29uZ3VlIGVsZW1lbnR1bSBzaXQgYW1ldCBzYXBpZW4gRG9uZWMgZWdldCBhbWV0IHBvc3VlcmUgZWdldCBTZWQgYWRpcGlzY2luZyBhdCBzaXQgZWxpdCBvZGlvIGNvbW1vZG8gbnVsbGEgYXJjdSBuZWMgc3VzY2lwaXQgcXVhbSB2aXZlcnJhIFByYWVzZW50IG1hZ25hIHRvcnRvciBpZCBmZXVnaWF0IFNlZCBmZXJtZW50dW0gU2VkIGFwdGVudCB2ZWwgcXVpcyBhbWV0IHNlbSBzZW0gbGFjaW5pYSB0dXJwaXMgU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEyLTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMjdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJDb250YWN0UGVyc29uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNhZ2l0dGlzIEluIHZpdmVycmEgTWFlY2VuYXMgcG9zdWVyZSB2aXZlcnJhXCIsXHJcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IFwicGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcImVNYWlsQWRkcmVzc1wiOiBcIm5lYyBoZW5kcmVyaXQgU2VkIGZhY2lsaXNpcyBwcmV0aXVtIGlkIG5vbiB1bHRyaWNlcyBqdXN0byB2ZWhpY3VsYSBsb2JvcnRpcyB1dCBwZXIgc2VtIGVsZWlmZW5kIHZlbCBzZWQgY29uZGltZW50dW0gbWFnbmEgZmFjaWxpc2lzXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJEZXBhcnR1cmVUcmFuc3BvcnRNZWFuc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTA5MjQsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVPZklkZW50aWZpY2F0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogMC4wMDExMzYwNTU5MTUyMTQxNSxcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidWxsYW1jb3JwZXIgYW1ldCBlZ2V0IHRyaXN0aXF1ZSBkaWFtIGVuaW0gbGFvcmVldCBtYXVyaXMgUXVpc3F1ZSBTZWQgbGFjaW5pYSBub24gVml2YW11cyBtaSBzb2RhbGVzIHZhcml1cyB1cm5hIEN1cmFiaXR1ciBOdWxsYSB1dCBxdWFtIHB1bHZpbmFyIHB1bHZpbmFyIHVsdHJpY2VzIGNvbmRpbWVudHVtIG5lcXVlIGxpZ3VsYSBwdWx2aW5hciBkb2xvciB1bHRyaWNpZXMganVzdG8gbmVjIHVybmEgU3VzcGVuZGlzc2UgYW50ZSBqdXN0byBzZWQgZW5pbSBkYXBpYnVzIG51bGxhIGFjY3Vtc2FuIHB1bHZpbmFyIGFtZXQgcGVsbGVudGVzcXVlIGZldWdpYXQgbGlndWxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA1LTI1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMDhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiZmV1Z2lhdCBjb25zZXF1YXQgYWNjdW1zYW4gaXBzdW1cIixcclxuICAgICAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTAyLTA1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0xMi0wNFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiA3Ljg0MzIzNjk2ODc3OTU4LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZGljdHVtIGVnZXN0YXMgcG9ydGEgcG9ydGEgY3Vyc3VzIG5vbiBhcHRlbnQgQ3VyYWJpdHVyIHZlbCBzZW0gcGVsbGVudGVzcXVlIHB1bHZpbmFyIGJpYmVuZHVtIGVyYXQgZWdldCB0ZWxsdXMgcXVpcyBwZWxsZW50ZXNxdWUgbWkgcXVhbSBjb252YWxsaXMgZG9sb3IgcHJldGl1bSBpcHN1bSBhdCBQZWxsZW50ZXNxdWUgYW50ZSBlcm9zIFNlZCBEb25lYyBhZCBuaXNsIHRpbmNpZHVudCBmZXJtZW50dW0gYW1ldCBzZW0gdWx0cmljZXMgbm9uIFByYWVzZW50IHVsdHJpY2llcyBFdGlhbSBjb25zZWN0ZXR1ciBuaXNpIGF1Z3VlIGluIGEgYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA1LTA5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTQzMixcclxuICAgICAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiAwLjAwMDAxNjI2ODk3MjQ1NDcxNzgsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImNvbW1vZG8gYWxpcXVhbSBlZ2VzdGFzIFByb2luIGxhY3VzIHF1aXMgZWdldCBhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA5LTA0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMTNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwic2VtXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMC0xMS0wN1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDctMTNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wMDA4NzYzMzgzODA3OTY5OTIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInNpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzZW0gZHVpIGJpYmVuZHVtIGRvbG9yIGFtZXQgbmVjIHZlbCBEb25lYyBhbnRlIHF1aXMgbmVjIGRvbG9yIHRpbmNpZHVudCBwdWx2aW5hciBuaXNpIGVnZXQganVzdG8gdml0YWUgcXVpcyBtYXVyaXMgU2VkIGF0IGVsaXQgb3JuYXJlIHNlbSBDcmFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA4LTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDEtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJDb3VudHJ5T2ZSb3V0aW5nT2ZDb25zaWdubWVudFwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODk0ODEsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTA4LTExXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMS0wOS0yMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjA4OTAwOTIxMjUxMTEzMDIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInNlbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhZGlwaXNjaW5nIGEgU2VkIG5vbiBhYyBxdWlzIHNvY2lvc3F1IGFjIG5lYyBpZCBxdWlzIGV0IGNvbmRpbWVudHVtIHNlZCBzaXQgZXUgdG9ydG9yIHJob25jdXMgdml0YWUgYWMgbmlzaSBmZWxpcyBtYXVyaXMgcHVsdmluYXIgcG9ydGEgbmVjIHNvbGxpY2l0dWRpbiB0ZWxsdXMgYW50ZSBlcmF0IFNlZCBtaSBkdWkgcG9ydHRpdG9yIGNvbmRpbWVudHVtIHV0IGZhY2lsaXNpcyBhYyBlZ2VzdGFzIE51bmMgZXUgcmlzdXMgZXUgZmV1Z2lhdCBxdWFtIGNvbnZhbGxpcyBhY2N1bXNhbiB2ZWwgdmVoaWN1bGEgbGFjaW5pYSBlbGl0IERvbmVjIHNpdCBlc3QgbWkgc2VtIG51bGxhIHRpbmNpZHVudCBsZW8gZmF1Y2lidXMgYmxhbmRpdCB0cmlzdGlxdWUgYXVndWUgY29udmFsbGlzIGVsZW1lbnR1bSBlc3QgZXQgcGhhcmV0cmEgcnV0cnVtIG51bGxhIHZlbCB2dWxwdXRhdGUgUHJvaW4gRHVpcyBhYyBmZXJtZW50dW0gU2VkIG9kaW8gYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMS0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAzLTE0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzAwNDIsXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDE5LTA3LTIwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0wMy0yMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjg0MjQxNDU4MjU0MDQ3NCxcclxuICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1hc3NhIGVyYXQgcXVpcyBxdWFtIG5lYyBkaWFtIGdyYXZpZGFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0xOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIkFjdGl2ZUJvcmRlclRyYW5zcG9ydE1lYW5zXCI6IHtcclxuICAgICAgICAgICAgXCJ0eXBlT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogMjM1LjIyMDE0Mjc0OTcwNixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhbWV0IGVnZXQgc2l0IGFkaXBpc2NpbmcgdHJpc3RpcXVlIE51bmMgZWxlaWZlbmQgYXQgYXVndWUgYXVndWUgcG9ydHRpdG9yIHRlbXBvciBzaXQgUHJvaW4gc2FwaWVuIHVybmEgY29uZ3VlIHNvZGFsZXMgUGhhc2VsbHVzIGFudGUgbmVjIGV0IGFjY3Vtc2FuXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTAtMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA4LTA1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJlbmltIGFjY3Vtc2FuIGxlbyBlbGl0IGVuaW0gaXBzdW1cIixcclxuICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJJblwiLFxyXG4gICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA0LTE1XCIsXHJcbiAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTEwLTA3XCIsXHJcbiAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wODgzNTgxNDcxMTA5NTY4LFxyXG4gICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFjIGNvbnNlcXVhdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMi0xNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNvbnZleWFuY2VSZWZlcmVuY2VOdW1iZXJcIjogXCJwdXJ1cyBwb3J0dGl0b3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJQbGFjZU9mTG9hZGluZ1wiOiB7XHJcbiAgICAgICAgICAgIFwiVU5Mb2NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwicG9ydGFcIixcclxuICAgICAgICAgICAgICAgIFwiTmFtZVwiOiBcInBoYXJldHJhIHNpdCBwZWxsZW50ZXNxdWUgZmF1Y2lidXMgZWdldCBldCBtZXR1cyBtYXNzYSBwZWxsZW50ZXNxdWUgZGFwaWJ1cyBwdXJ1cyBlZ2V0IGNvbnNlY3RldHVyXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNoYW5nZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgIFwiU3ViZGl2aXNpb25cIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICBcIkZ1bmN0aW9uXCI6IFwicGhhcmV0cmFcIixcclxuICAgICAgICAgICAgICAgIFwiU3RhdHVzXCI6IFwiVXRcIixcclxuICAgICAgICAgICAgICAgIFwiRGF0ZV9cIjogMy4wMDU1ODkxNDU3MDM5OCxcclxuICAgICAgICAgICAgICAgIFwiQ29vcmRpbmF0ZXNcIjogXCJQZWxsZW50ZXNxdWVcIixcclxuICAgICAgICAgICAgICAgIFwiQ29tbWVudF9cIjogXCJwaGFyZXRyYSBldCB0cmlzdGlxdWUgY29uZ3VlIGNvbnZhbGxpcyBNb3JiaSB0aW5jaWR1bnQgcGVsbGVudGVzcXVlIHZ1bHB1dGF0ZSBkaWFtIGF1Z3VlIHRyaXN0aXF1ZSBTZWQgZXN0IHZhcml1cyB1bGxhbWNvcnBlciBuaWJoIHZlc3RpYnVsdW0gZmVybWVudHVtIG5vbiB2YXJpdXMgYWRpcGlzY2luZyBmZWxpcyB1dCBQZWxsZW50ZXNxdWUgTWFlY2VuYXMgdGVsbHVzIG5lYyBjb21tb2RvIGFtZXQganVzdG8gdml0YWUgQ3JhcyB0ZWxsdXMgZmVybWVudHVtIGV1aXNtb2QgZXJhdCBNb3JiaSBhZGlwaXNjaW5nIG5lYyBpZCBwbGFjZXJhdCBwcmV0aXVtIHNlbSBhY2N1bXNhbiBjb252YWxsaXMgdmVoaWN1bGFcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJsaWd1bGEganVzdG8gRXRpYW0gdGVsbHVzIHNvbGxpY2l0dWRpbiBTZWQgc2VtcGVyIG9ybmFyZSBuaXNsIG1hdXJpcyBub24gZXVpc21vZCBzZW0gYmxhbmRpdCBmcmluZ2lsbGEgdml2ZXJyYSBlcmF0IHNlZCBlcmF0IEV0aWFtIHZpdGFlIGV1aXNtb2QgdmVzdGlidWx1bSBmZXJtZW50dW0gZXJhdCBzaXQgdmVsIHBvcnR0aXRvciB0dXJwaXMgZWxlaWZlbmQgdml0YWUgZWxlbWVudHVtIG1hc3NhIHZlbGl0IGFjIGFtZXQgc29sbGljaXR1ZGluIHR1cnBpcyB1cm5hIGVnZXQgTmFtIHNvZGFsZXMgcmlzdXMgbWkgZGFwaWJ1cyBhYyBwdWx2aW5hciBhZGlwaXNjaW5nIHRlbGx1cyBlbGVpZmVuZCB0YWNpdGkgc2VtcGVyIGxlY3R1cyBkb2xvciBtb2xsaXMganVzdG8gYWxpcXVhbSBhZGlwaXNjaW5nIGFsaXF1YW0gcmlzdXMgZWdldCBzaXQgc29kYWxlcyBlZ2VzdGFzIHZlc3RpYnVsdW0gdml0YWUgbGlndWxhIHZlbCBwb3J0dGl0b3IgdmVsaXQgbmVjXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMTZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiY291bnRyeVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldFwiLFxyXG4gICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTAxLTI5XCIsXHJcbiAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTExLTExXCIsXHJcbiAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogNy43MTk4NDM2OTg1MzUwNCxcclxuICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEb25lYyB2ZWxpdCBNYWVjZW5hcyBwcmV0aXVtIFN1c3BlbmRpc3NlIHRyaXN0aXF1ZSBtZXR1cyBjb25zZXF1YXQgUXVpc3F1ZSBkaWFtIGRpYW0gc2FwaWVuIGVzdCBWZXN0aWJ1bHVtIGxhY3VzIHZlbGl0IHBvc3VlcmUgTWFlY2VuYXMgRHVpcyBwb3N1ZXJlIHNpdCBRdWlzcXVlIHRyaXN0aXF1ZSBhY2N1bXNhbiBwb3J0dGl0b3IgZGlnbmlzc2ltIG1hdXJpcyBsb2JvcnRpcyBldCBDdXJhYml0dXIgYXQgZmF1Y2lidXMgbGFjaW5pYSBzaXQgY29uZGltZW50dW1cIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOC0wMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJsb2NhdGlvblwiOiBcIlZlc3RpYnVsdW1cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJQbGFjZU9mVW5sb2FkaW5nXCI6IHtcclxuICAgICAgICAgICAgXCJVTkxvY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJsYWN1c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJOYW1lXCI6IFwidnVscHV0YXRlIHRlbGx1cyBQZWxsZW50ZXNxdWVcIixcclxuICAgICAgICAgICAgICAgIFwiQ2hhbmdlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgXCJTdWJkaXZpc2lvblwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgXCJGdW5jdGlvblwiOiBcImVsZWlmZW5kXCIsXHJcbiAgICAgICAgICAgICAgICBcIlN0YXR1c1wiOiBcInV0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkRhdGVfXCI6IDAuMDgzMTM4MTE5OTMzNzI1NCxcclxuICAgICAgICAgICAgICAgIFwiQ29vcmRpbmF0ZXNcIjogXCJwZWxsZW50ZXNxdWVcIixcclxuICAgICAgICAgICAgICAgIFwiQ29tbWVudF9cIjogXCJ0ZW1wdXMgVml2YW11cyBTdXNwZW5kaXNzZSBldSBzZWQgY29tbW9kbyBhbGlxdWV0IGNvbnNlY3RldHVyIGFtZXQgaW4gY3Vyc3VzIHF1aXMgZWdldCBpZCBFdGlhbSBmZWxpcyB2aXZlcnJhIHNpdCBOdW5jIHVsdHJpY2VzIHZlbCBhYyBtZXR1cyBlcmF0IGF1Z3VlIGRpY3R1bSBDdXJhYml0dXJcIixcclxuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJpZCBDdXJhYml0dXIgQ3VyYWJpdHVyIHZ1bHB1dGF0ZSBhdWd1ZSBzZWQgZXN0IHVybmEgZGFwaWJ1cyB0ZW1wdXMgaXBzdW0gdmVzdGlidWx1bSBmcmluZ2lsbGEgc2VtIGRhcGlidXMgZmV1Z2lhdCBzZWQgZnJpbmdpbGxhIHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA0LTI3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0yM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAxOS0xMC0yN1wiLFxyXG4gICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0xMC0yNFwiLFxyXG4gICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMzM4ODgyNDQyMjU1OTE1LFxyXG4gICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcImxlb1wiLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImhlbmRyZXJpdCBvZGlvIHZpdGFlIGVsZWlmZW5kIGN1cnN1cyBEb25lYyBzZWQgZGFwaWJ1cyBWaXZhbXVzIGlkIG5vbiBwb3J0dGl0b3Igc29kYWxlcyB2aXRhZSBlbGl0IG5pc2wgcGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDUtMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA3LTA0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJsaWJlcm8gc2FwaWVuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiUHJldmlvdXNEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTU5NTksXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkNyYXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidHJpc3RpcXVlIGZyaW5naWxsYSBlZ2VzdGFzIHVsbGFtY29ycGVyIGlkIGhpbWVuYWVvcyBhbnRlIHVsdHJpY2VzIHF1YW0gYWMgbW9sZXN0aWUgUGhhc2VsbHVzIGVnZXN0YXMgbWF0dGlzIGxvcmVtIExvcmVtIHRpbmNpZHVudCBlbGVpZmVuZCBzYWdpdHRpcyBsZW8gcG9ydHRpdG9yIHV0IGFjIGp1c3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA3LTAyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMjBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImxlY3R1cyBjb25kaW1lbnR1bSBQcm9pbiBtZXR1cyBsYWN1cyBub24gbWFzc2FcIixcclxuICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJpbiBlbGl0IGVsaXRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM0NDMsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVyYXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYWRpcGlzY2luZyBuZWMgY29uZGltZW50dW0gcXVpcyBhcmN1IGdyYXZpZGEgZXJhdCBwZWxsZW50ZXNxdWUgbGliZXJvIER1aXMgY29uc2VjdGV0dXIgQ3VyYWJpdHVyIGEgbm9uIFNlZCBDcmFzIHRpbmNpZHVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA2LTE1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ0b3J0b3IgcG90ZW50aSBpZCBmZWxpcyBtZXR1cyBuaWJoIGFsaXF1YW0gcGxhY2VyYXQgU2VkIGFjIGlkXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiZGFwaWJ1c1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiU3VwcG9ydGluZ0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAxNDYyNixcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJhcmN1IGluIGV1IE51bmMgZmFjaWxpc2lzIGRhcGlidXMgc2VtcGVyIEN1cmFiaXR1ciB0ZW1wdXMgbmlzbCBpZCBzaXQgaWFjdWxpcyBwZWxsZW50ZXNxdWUgbW9sZXN0aWUgbWF1cmlzIHNpdCBhbnRlIHBlciBhbWV0IGF1Z3VlIG5lYyBlbGVtZW50dW0gcXVhbSBtZXR1cyBzYWdpdHRpcyBzZW1wZXIgdmVsIHR1cnBpcyBiaWJlbmR1bSBuZWMgbmlzaSB2dWxwdXRhdGUgYXVjdG9yIHZlaGljdWxhIGVnZXN0YXMgZWxpdCBzaXQgZWdlc3RhcyBOYW0gbGVvIHB1bHZpbmFyIFN1c3BlbmRpc3NlIE5hbSB2ZWxpdCBtb2xsaXMgTG9yZW0gb2RpbyBRdWlzcXVlIE51bmMgZmVybWVudHVtIHNpdCBhZGlwaXNjaW5nIHBvcnR0aXRvciBlcm9zIGNvbW1vZG8gc2l0IHZlaGljdWxhIHRpbmNpZHVudCBpbXBlcmRpZXQgZXVpc21vZCBtb2xlc3RpZSBsaWd1bGEgYXVndWUgZ3JhdmlkYSB0aW5jaWR1bnQgTmFtIFNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMi0xM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAzLTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJpYWN1bGlzIGlwc3VtIHZlbCB2ZWxpdCBpbXBlcmRpZXQgZWdlc3RhcyBzZWQgYmxhbmRpdCBtYWduYSBRdWlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogODYwNDQsXHJcbiAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwibm9uIHNjZWxlcmlzcXVlIGxhY3VzIHVybmEgZWxlaWZlbmRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDk4NDc0LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJkaWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImEgbGliZXJvIHNhcGllbiB1dCBTZWQgbmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wNS0wM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA3LTI3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJjb25ndWUgU2VkIGV0IG1vbGVzdGllIER1aXMgUGhhc2VsbHVzIHB1cnVzIG5pYmggdnVscHV0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogMjk2NDUsXHJcbiAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiVXQgYSBlbGl0IGFjIGRpYW1cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIlRyYW5zcG9ydERvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyNzk4NyxcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEb25lYyBBZW5lYW4gdGluY2lkdW50IG9kaW8gSW50ZWdlciBldSB2ZXN0aWJ1bHVtIGVnZXQgVXQgRG9uZWMgaW50ZXJkdW0gbGlndWxhIGVuaW0gb2RpbyBub24gZWxpdCBuZWMgYWMgdnVscHV0YXRlIHBoYXJldHJhIGxlbyBqdXN0byB2aXRhZSBkdWkgbWF1cmlzIEludGVnZXIgVXQgc29kYWxlcyBzYWdpdHRpcyBvcm5hcmUgaW50ZXJkdW0gdGVsbHVzIGlkIHBoYXJldHJhIGVuaW0gdmVoaWN1bGEgdGVtcHVzIG5pYmggaXBzdW0gaW50ZXJkdW0gbGlndWxhIHZ1bHB1dGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0xMC0wMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAyLTI0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJldWlzbW9kXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1Mjk2MixcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJyaXN1cyBjb25kaW1lbnR1bSB0ZW1wdXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDgtMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNi0yM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwib2RpbyBlZ2V0IG1hZ25hXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NDkxNyxcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNvbGxpY2l0dWRpbiBEb25lYyBlbGl0IHZpdGFlIHRvcnRvciBkb2xvciBkYXBpYnVzIHNvbGxpY2l0dWRpbiBWaXZhbXVzIHV0IFZpdmFtdXMgaWQgYWMgUGVsbGVudGVzcXVlIENyYXMgdmVoaWN1bGEgcG9zdWVyZSB2ZWhpY3VsYSBhdWd1ZSB0aW5jaWR1bnQgYXQgbm9uIGRvbG9yIGVzdCBDdXJhYml0dXIgbW9sZXN0aWUgbmVjIHBlbGxlbnRlc3F1ZSBpbXBlcmRpZXQgc2NlbGVyaXNxdWUgdWxsYW1jb3JwZXIgcHJldGl1bSBpcHN1bSBTZWQgY29udmFsbGlzIHZpdGFlIHNlZCBzY2VsZXJpc3F1ZSB1dCBhbGlxdWFtIHNpdCBjb25zZXF1YXQgZWdldCBwb3J0dGl0b3IgcHVsdmluYXIganVzdG8gZmVybWVudHVtIGZyaW5naWxsYSBTdXNwZW5kaXNzZSBmYXVjaWJ1cyBJbnRlZ2VyIGxhY3VzIHBvc3VlcmUgcHVsdmluYXIgcGVsbGVudGVzcXVlIHRpbmNpZHVudCBlbGVtZW50dW0gTmFtIHNvbGxpY2l0dWRpbiB2dWxwdXRhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDQtMjhUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOC0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiYW1ldCBudWxsYSBuZWMgcGVsbGVudGVzcXVlIGFtZXQgZWdldCBmYWNpbGlzaXNcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI1NTM3LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYWMgZWxpdCBmYWNpbGlzaXMgcmlzdXMgZXJhdCBldCB2aXRhZSBhbWV0IGZyaW5naWxsYSBRdWlzcXVlIGNvbmRpbWVudHVtIGxhY3VzIGZldWdpYXQgZHVpIHNvbGxpY2l0dWRpbiBjb25ndWUgdHJpc3RpcXVlIE1hZWNlbmFzIGEgaW50ZXJkdW0gTnVsbGFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAyLTI2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMjVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImluIHNvbGxpY2l0dWRpbiBlbmltIHNvZGFsZXMgb2RpbyBhbWV0IHB1bHZpbmFyIGVsaXQgRHVpcyBkaWduaXNzaW1cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIkFkZGl0aW9uYWxJbmZvcm1hdGlvblwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzEzNzUsXHJcbiAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVyb3NcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVzdGlidWx1bSBldWlzbW9kIHB1bHZpbmFyIGZyaW5naWxsYSBzdXNjaXBpdCBTZWQgdHVycGlzIG1pIG5lYyBhdWN0b3IgdmVsIGRpZ25pc3NpbSBOdWxsYSBmYXVjaWJ1cyB0cmlzdGlxdWUgbWF1cmlzIGZlcm1lbnR1bSBMb3JlbSB0ZW1wdXMgYmxhbmRpdCBwaGFyZXRyYSBhdCBmYXVjaWJ1cyBhZGlwaXNjaW5nIHBvc3VlcmUgZWdldCBwcmV0aXVtIG9kaW8gdml0YWUgdmVsIGZlcm1lbnR1bSBudWxsYSBjb21tb2RvIHRhY2l0aSB2ZWhpY3VsYSBoZW5kcmVyaXQgbmliaCBEdWlzIHZpdmVycmFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDQtMTdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMS0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk51bGxhIG1ldHVzIGV1IGFsaXF1ZXQgdm9sdXRwYXQgZ3JhdmlkYSBvcm5hcmUgZWdlc3RhcyBldSBsaWd1bGEgZXUgU2VkIHZlbGl0IHB1bHZpbmFyIGZyaW5naWxsYSBzb2xsaWNpdHVkaW4gcHVsdmluYXJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDYwODk5LFxyXG4gICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2YXJpdXMgdmVsIGZhY2lsaXNpcyBlcm9zIERvbmVjIGVuaW0gSW4gcGxhY2VyYXQgYXVndWUgbWV0dXMgQ3JhcyBjb21tb2RvIFZpdmFtdXMgQWxpcXVhbSBhZGlwaXNjaW5nIGF0IGVsZW1lbnR1bSBjb252YWxsaXMgdmVsIGluIGNvbmRpbWVudHVtIGxlbyBhZGlwaXNjaW5nIE51bmMgbWF1cmlzIGxpZ3VsYSBlZ2V0IGFtZXQgVml2YW11cyBuZWMgcG9ydGEgdmVsaXQgYW1ldCBsaWd1bGEgYW50ZSBzYXBpZW4gZWxlbWVudHVtIHBoYXJldHJhIHBoYXJldHJhIG5vbiBOYW0gY29uc2VxdWF0IHBvc3VlcmUgbmliaCBsZW8gc2VtIFByb2luIGFyY3UgZXUgbmVjIGV0IHRvcnRvciBtb2xlc3RpZSBmZWxpcyBqdXN0byBwbGFjZXJhdCBzZW0gbGVjdHVzIGlkIHV0IE51bmMgdm9sdXRwYXQgVXQgcXVpcyBmYXVjaWJ1cyBzaXQgZmV1Z2lhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0wN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA0LTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiYWMgZGFwaWJ1cyBEb25lYyBzb2RhbGVzIG1ldHVzIE51bmMgaWQgY29uc2VxdWF0IGxvYm9ydGlzIGVyb3MgYWxpcXVldCBmZXJtZW50dW0gZmFjaWxpc2lzIG5lYyBlbGVpZmVuZCB2dWxwdXRhdGUgTnVuYyBibGFuZGl0IG1hdXJpcyBsZW8gZWdldCBtZXR1cyBzdXNjaXBpdCB2YXJpdXMgb2RpbyBmZXJtZW50dW0gZXN0IGZhY2lsaXNpcyBlbGVpZmVuZFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIFwiSG91c2VDb25zaWdubWVudFwiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMSxcclxuICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGlzcGF0Y2hcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA4LTE1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMS0wNy0wOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAzLjEzNjQ3MTM0ODQxMjU1LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJsZW9cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWdldCBmcmluZ2lsbGEgbWV0dXMgc2FwaWVuIGFudGUgRG9uZWMgYWMgZmF1Y2lidXMgcG9ydGEgbW9sbGlzIFF1aXNxdWUgZWxlaWZlbmQgdmVsIGNvbmd1ZSB1cm5hIGVzdCBzYXBpZW4gc2FwaWVuIHByZXRpdW0gbGl0b3JhIGNvbmRpbWVudHVtIG5pYmggc2NlbGVyaXNxdWUgRG9uZWMgbnVsbGEgTnVsbGFtIHJpc3VzIGxvYm9ydGlzIHZpdmVycmEgbm9uIHN1c2NpcGl0IHRpbmNpZHVudCBOYW0gcHVsdmluYXIgdml0YWUgc29kYWxlcyBjb251YmlhIGV0IGVsZW1lbnR1bSB2aXZlcnJhIGxvcmVtIHNlZCBtYXR0aXMgcG9zdWVyZSBxdWlzIGhlbmRyZXJpdCBqdXN0byBTZWQgbm9uIHJob25jdXMgbm9uIGNvbW1vZG8gbGlndWxhIGRhcGlidXMgbm9uIGFyY3UgYWNjdW1zYW4gZWxpdCBwZWxsZW50ZXNxdWUgYWNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMTFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0xMS0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiZ3Jvc3NNYXNzXCI6IDAuODY0NjI0MDE3Nzg2NTI1LFxyXG4gICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJVQ1JcIjogXCJ2ZWwgRHVpcyB2ZW5lbmF0aXMgcXVpc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWdub3JcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJzb2xsaWNpdHVkaW4gbGlnXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibGlndWxhIGxlY3R1cyBtYXVyaXMgbm9uIGVsZW1lbnR1bSBhdWN0b3IgYXVndWUgYW1ldCB2ZWwgc2VtIHNhZ2l0dGlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJtb2xlc3RpZSBmYXVjaWJ1cyBzZWQgdXQgUHJvaW4gcmhvbmN1cyBoZW5kcmVyaXQgYWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcIk5hbSBpbiBlbGl0IGxlbyBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwibG9yZW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm1pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYmxhbmRpdCBuaXNpIG5pc2kgYW1ldCBhbGlxdWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDYtMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA5LTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJpYmVuZHVtIHNpdCBsYWN1cyBzZW0gdGluY2lkdW50IHVsdHJpY2llcyBudWxsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IFwic2l0IGlkIGVsaXQgZmVybWVudHVtIG1ldHVzIGxlb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVNYWlsQWRkcmVzc1wiOiBcIm1ldHVzIG1ldHVzIHNvbGxpY2l0dWRpbiB2aXRhZSBkYXBpYnVzXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJ2ZWwgbGVjdHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGljdHVtIHBoYXJldHJhIEluIFBoYXNlbGx1cyBwZWxsZW50ZXNxdWVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcIkRvbmVjIFBoYXNlbGx1cyBxdWlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJRdWlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcInZlaGljdWxhIG5pc2kgbWkgbG9ib3J0aXMgbWlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiUXVpc3F1ZSBuaXNpIG5pc2wgcXVpcyBuaWJoIHByZXRpdW0gcXVhbSBzYXBpZW4ganVzdG8gdmVsaXQgYmxhbmRpdCBuZXF1ZSB0b3J0b3IgdGluY2lkdW50IGVnZXQgZmFjaWxpc2lzIGVnZXN0YXMgdmVsaXQgc2l0IHN1c2NpcGl0IHJpc3VzIGVnZXQgbGlndWxhIGNvbmRpbWVudHVtIG9kaW8gdG9ydG9yIHRpbmNpZHVudCBhbWV0IHZpdGFlIHRlbGx1cyBpbiBQaGFzZWxsdXMgZWdldCBlZ2V0IGNvbW1vZG8gdWxsYW1jb3JwZXIgQWxpcXVhbSBwZWxsZW50ZXNxdWUgbmVjIG1ldHVzIGlkIEludGVnZXIgZWxlbWVudHVtIHNhcGllbiBtYXNzYSB1cm5hIHZlbCB0cmlzdGlxdWUgU2VkIHNpdCB2ZWhpY3VsYSBDdXJhYml0dXIgZW5pbSB0cmlzdGlxdWUgc2FnaXR0aXMgYWNjdW1zYW4gc29sbGljaXR1ZGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA4LTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsU3VwcGx5Q2hhaW5BY3RvclwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDYzODM1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaWQgaGVuZHJlcml0IENyYXMgbWV0dXMgdWx0cmljaWVzIG1hdXJpcyBxdWFtIG9yY2kgbW9sZXN0aWUgYWMgVXQgc2VkIGVyYXQgbGlndWxhIG5pYmggZWdldCBxdWlzIGZhY2lsaXNpcyBOdW5jIHN1c2NpcGl0IGFjY3Vtc2FuIG1hc3NhIHRvcnRvciB1bHRyaWNpZXMgYXQgdGVtcHVzIG1pIHNpdCBVdCBpbiBtYXVyaXMgcXVpcyBwb3J0YSBkaWFtIG1pIGlwc3VtIGVyYXQgcGxhY2VyYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0yMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImRpY3R1bSBNYXVyaXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDI0OTM5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJmZXVnaWF0IHNlbSBub24gcG9ydGEgZWdldCBTZWQgdml0YWUgVXQgbGFvcmVldCByaXN1cyBtb2xlc3RpZSBxdWFtIGdyYXZpZGEgZWdldCBtaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA3LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiaWQgTnVuY1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFwiRGVwYXJ0dXJlVHJhbnNwb3J0TWVhbnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyMDgxNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogMC4wMjIwNTM0NTEyODc1ODUxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImludGVyZHVtIGVyb3MgU2VkIGlwc3VtIG1ldHVzIGJsYW5kaXQgSW4gVml2YW11cyBwZWxsZW50ZXNxdWUgQ3JhcyBlZ2V0IG9kaW8gaGVuZHJlcml0IGVnZXQgU2VkIGxvYm9ydGlzIHRpbmNpZHVudCBtb2xsaXMgU2VkIHNpdCBpbiBjb21tb2RvIHVsdHJpY2VzIGFwdGVudCBwcmV0aXVtIFN1c3BlbmRpc3NlIG5lYyB2ZXN0aWJ1bHVtIHZlbGl0IGVuaW0gbWkgc2l0IEV0aWFtIGxpZ3VsYSBlbGVtZW50dW0gZmF1Y2lidXMgaXBzdW0gbWkgaW50ZXJkdW0gbWF1cmlzIHV0IHNlbSBEb25lYyBDcmFzIENyYXMgYWRpcGlzY2luZyBzZWQgU3VzcGVuZGlzc2UgbWkgbGFjaW5pYSB1dCBJbnRlZ2VyIENyYXMgaWQgU2VkIEN1cmFiaXR1ciBtb2xsaXMganVzdG8gdXQgYWMgYWNjdW1zYW4gc2FwaWVuIEV0aWFtIGFtZXQgbm9uIHNhcGllbiBmZXVnaWF0IFV0IHNpdCBsb2JvcnRpcyBpYWN1bGlzIGFkaXBpc2NpbmcgQ3VyYWJpdHVyIGZyaW5naWxsYSBvZGlvIHZlaGljdWxhIGxpZ3VsYSBub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNy0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDktMTJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImludGVyZHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAyMS0wOC0wOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMS0wNi0xNlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDAwMDU0ODEwODIyMTI4Njk1OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ1dCBzb2xsaWNpdHVkaW4gZXJvcyBuaXNsIG1pIHNjZWxlcmlzcXVlIFBoYXNlbGx1cyBmcmluZ2lsbGEgaXBzdW0gZXJvcyBldCBDbGFzcyBxdWlzIG51bmMgc29kYWxlcyB2dWxwdXRhdGUgbnVuYyBzZW0gc2VkIHNpdCBxdWlzIHZlaGljdWxhIGRvbG9yIHNvbGxpY2l0dWRpbiB2ZWhpY3VsYSBmYWNpbGlzaXMgbWF1cmlzIHBlbGxlbnRlc3F1ZSBmYWNpbGlzaXMgc2VtIHVybmEgZWdldCBDdXJhYml0dXIgYXQgaGVuZHJlcml0IFNlZCBwdWx2aW5hciBzaXQgdmVoaWN1bGEgbGlndWxhIHRvcnRvciBtZXR1cyBzY2VsZXJpc3F1ZSBVdCBwb3J0YSBhbWV0IE51bGxhIHRyaXN0aXF1ZSBzYWdpdHRpcyBub24gdWxsYW1jb3JwZXIgaWFjdWxpcyBWZXN0aWJ1bHVtIG5lYyBvcmNpIHNvY2lvc3F1IHRlbXBvciBhZCBlbGl0IHNlbSBlcmF0IG1pIGVsZWlmZW5kIGF1Z3VlIERvbmVjIG1vbGVzdGllIHVsbGFtY29ycGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTMxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5NjI5OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogMC4wNDY5NDA1NDY1MDQ2NTk4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkRvbmVjIGVsZW1lbnR1bSBxdWlzIGZyaW5naWxsYSBwdWx2aW5hciBjb25zZXF1YXQgZXJvcyBOYW0gZXUgbWFzc2EgYWMgc2FwaWVuIHF1aXMgbnVsbGEgbm9uIGVnZXQgZWdlc3RhcyBsaXRvcmEgbGFjaW5pYSB2ZWwgcXVhbSBldSB2aXRhZSBldSBwaGFyZXRyYSBpbiB2ZWwgbW9sZXN0aWUgUGVsbGVudGVzcXVlIE5hbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTEyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0yOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwidml0YWUgQWxpcXVhbSBtb2xlc3RpZSB2b2x1dHBhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDMtMTRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMDktMDZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjA4NDg1NzIzNzI4NTQwMjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwibGVvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2l0IGdyYXZpZGEgc2l0IGZhY2lsaXNpcyBzYWdpdHRpcyBkYXBpYnVzIHNhcGllbiBJbiBuZXF1ZSBkaWN0dW0gZXUgc2l0IHV0IGxpZ3VsYSBlZ2VzdGFzIHRvcnRvciBWaXZhbXVzIFNlZCB0dXJwaXMgdmVoaWN1bGEgbm9uIGFyY3UgTG9yZW0gb2RpbyBhdWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0yMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTEtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIlByZXZpb3VzRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyMjYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYmxhbmRpdCBTZWQgbW9sbGlzIHZlaGljdWxhIHF1YW0gc2FnaXR0aXMgbW9sbGlzIGVuaW0gdmVsIHVsdHJpY2llcyBmZWxpcyBpbiBhIHV0IG5lYyBudWxsYSBtb2xsaXMgcHVydXMgSW50ZWdlciBTZWQgaWQgTWFlY2VuYXMgbW9sZXN0aWUgZXUgY29uc2VjdGV0dXIgZ3JhdmlkYSB0b3J0b3Igdml0YWUgbmVjIHZlc3RpYnVsdW0gdGluY2lkdW50IGVnZXN0YXMgdGluY2lkdW50IGF1Z3VlIGVnZXQgVmVzdGlidWx1bSBwdWx2aW5hciBtb2xsaXMgZmFjaWxpc2lzIHBoYXJldHJhIGRvbG9yIG1hZ25hIHRyaXN0aXF1ZSBwdXJ1cyBTZWQgbGlndWxhIGRpZ25pc3NpbSBhdWd1ZSB1dCBzZWQgbmlzaSBjb25zZWN0ZXR1ciByaXN1cyBQcmFlc2VudCBmcmluZ2lsbGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMC0yMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDUtMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ1cm5hIGZlcm1lbnR1bSB2dWxwdXRhdGUgbWF1cmlzIGFjXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA3NTM3NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkR1aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJtYXNzYSBTdXNwZW5kaXNzZSBlZ2VzdGFzIGVsaXQgbGVjdHVzIGxhY3VzIGNvbnViaWEgdGluY2lkdW50IG5vbiBsYWN1cyBuZWMgdml0YWUgdmVzdGlidWx1bSBVdCBlcmF0IGVnZXN0YXMgbmVjIGlwc3VtIGxhY2luaWEgZmFjaWxpc2lzIG5pYmggaWQgb2RpbyBjb252YWxsaXMgU3VzcGVuZGlzc2UgdHVycGlzIGhlbmRyZXJpdCBpZCBlcmF0IGRpYW0gb2RpbyBhZGlwaXNjaW5nIGp1c3RvIHJpc3VzIG1vbGVzdGllIENyYXMgdmVsIE5hbSBtZXR1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAyLTI2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0yOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInVybmEgU3VzcGVuZGlzc2UgZWxpdCB2YXJpdXMgdmVsaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydERvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjk4ODUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJOdW5jXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibnVsbGEgbmVjIHZvbHV0cGF0IHVsdHJpY2llcyBtYXNzYSBtZXR1cyBmcmluZ2lsbGEgbWF1cmlzIGVsZW1lbnR1bSBlZ2VzdGFzIG1hc3NhIFZpdmFtdXMgYW50ZSB1bHRyaWNpZXMgcmlzdXMgU2VkIGNvbmRpbWVudHVtIGVnZXQgc2VtIERvbmVjIGVuaW0gbWkgRG9uZWMgYmxhbmRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA1LTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMS0yMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInZlbmVuYXRpcyBhbWV0IGV0IGVnZXQgdHJpc3RpcXVlIHZ1bHB1dGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjczNTYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJkaWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsIFN1c3BlbmRpc3NlIHNpdCBzaXQgY29uc2VjdGV0dXIgbW9sZXN0aWUgdXJuYSBlc3QgdmVsIG5pc2kgQ3VyYWJpdHVyIHNlbSBlbGVpZmVuZCBlZ2VzdGFzIHZlaGljdWxhIGdyYXZpZGEgdmVsaXQgbG9yZW0gZWxpdCBncmF2aWRhIG51bGxhIHV0IG1vbGxpcyBsZW8gYW50ZSBpYWN1bGlzIFBoYXNlbGx1cyBQZWxsZW50ZXNxdWUgaW4gYWMgY29uZ3VlIHBlbGxlbnRlc3F1ZSBsb2JvcnRpcyBVdCBzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOS0yMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTEtMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJzZW1wZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0NjU0NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiQ2xhc3MgY29uc2VxdWF0IGxhY3VzIGNvbnNlY3RldHVyIE51bGxhIHZlc3RpYnVsdW0gcGVsbGVudGVzcXVlIGVsZW1lbnR1bSB2ZWwgZG9sb3IgU2VkIG1vbGxpcyBWaXZhbXVzIEFlbmVhbiBzaXQgdmVsIHRlbXB1cyBtb2xsaXMgUXVpc3F1ZSBhdWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMi0xNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTAtMDVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJuaWJoIE51bGxhbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjk5NjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaXNsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWxlbWVudHVtIGVuaW0gY3Vyc3VzIGVnZXQgdWx0cmljZXMgTW9yYmkgY29tbW9kbyBhZGlwaXNjaW5nIGxvYm9ydGlzIHR1cnBpcyBhbWV0IEluIGluIGEgUXVpc3F1ZSBwbGFjZXJhdCBpZCBQaGFzZWxsdXMgZXUgYXQgc2VkIHNhcGllbiBsaWd1bGEgaXBzdW0gbmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOC0zMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInB1bHZpbmFyIHBlbGxlbnRlc3F1ZSBjb25kaW1lbnR1bSBhdWd1ZSBpZCBlc3QgTG9yZW0gcXVpc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFwiVHJhbnNwb3J0Q2hhcmdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RPZlBheW1lbnRcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzY2VsZXJpc3F1ZSBjb25ndWUgcXVpcyBhbnRlIGlwc3VtIGVsaXQgTnVuYyBwb3N1ZXJlIG1hdXJpcyBhYyBtZXR1cyBtZXR1cyBOdW5jIG1hdXJpcyBQcmFlc2VudCBpYWN1bGlzIGFtZXQgc3VzY2lwaXQgZmVsaXMgbnVsbGEgdmFyaXVzIHNpdCBwbGFjZXJhdCB0ZWxsdXMgbW9sZXN0aWUgdGluY2lkdW50IGVnZXQgbWkgQ3JhcyBhY2N1bXNhbiBkYXBpYnVzIHNpdCBpZCBwZWxsZW50ZXNxdWUgU2VkIGxhY3VzIE51bmMgaWQgZGFwaWJ1cyBlbGVtZW50dW0gYWNjdW1zYW4gc3VzY2lwaXQgc2VtIGVsZW1lbnR1bSBtYXVyaXMgdXQgc29kYWxlcyBhbnRlIE51bGxhIHBvcnRhIEluIGNvbmRpbWVudHVtIENyYXMgcGVsbGVudGVzcXVlIENyYXMgc3VzY2lwaXQgbWV0dXMgcHVsdmluYXIgdmVsaXQgbWkgZWxlaWZlbmQgcG9ydGEgc2VtIGN1cnN1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDMtMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDgtMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWdubWVudEl0ZW1cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA0MjA2OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvblR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0aW5jaWR1bnQgcG9ydGEgcGxhY2VyYXQgc2FwaWVuIGZhdWNpYnVzIGNvbmRpbWVudHVtIFZpdmFtdXMgdmVsIGNvbW1vZG8gbG9ib3J0aXMgbWkgUHJvaW4gdmVsIG5lYyBmZXVnaWF0IG1hdXJpcyB0ZWxsdXMgbGlndWxhIHF1aXMgb2RpbyBTZWQgY29uZ3VlIG5pYmggdmVoaWN1bGEgc2VkIGhpbWVuYWVvcyBjb25kaW1lbnR1bSBzb2RhbGVzIHN1c2NpcGl0IGZldWdpYXQgYW1ldCB2b2x1dHBhdCBsaWd1bGEgbGFjaW5pYSBhbWV0IGJsYW5kaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOC0xNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDUtMTFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEaXNwYXRjaFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJVdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA3LTEzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTEwLTA4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogOTIuMjE1ODYyNjMzNzYxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcIm5lY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pYmggc3VzY2lwaXQgYSBlZ2V0IHBoYXJldHJhIG5pc2kgZXN0IHZlc3RpYnVsdW0gb3JjaSBzYWdpdHRpcyB0ZWxsdXMgSW4gc2FwaWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDEtMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA5LTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGVzdGluYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiVXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAxOS0wMy0xNFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMC0wMy0yNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDM2MTAwOTE0MzQ2MTAxMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJsZW9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJWaXZhbXVzIGxlbyBuaWJoIHRyaXN0aXF1ZSBldCBxdWlzIG1hdXJpcyBibGFuZGl0IERvbmVjIGZlcm1lbnR1bSBWaXZhbXVzIGFsaXF1YW0gY29tbW9kbyB0ZW1wb3IgZnJpbmdpbGxhIHNlZCBEb25lYyBtYXVyaXMgZXJhdCBsYWN1cyBuZWMgdmVzdGlidWx1bSB1dCB2ZXN0aWJ1bHVtIFBlbGxlbnRlc3F1ZSByaG9uY3VzIHV0IHB1bHZpbmFyIG1ldHVzIHB1bHZpbmFyIGxhb3JlZXQgbGl0b3JhIG5vbiBjb25kaW1lbnR1bSBwb3N1ZXJlIG5lYyBmZXVnaWF0IGRvbG9yIG5pYmggdG9ycXVlbnQgZmV1Z2lhdCByaXN1cyBlcm9zIER1aXMgQ2xhc3MgZHVpIG51bGxhIHZlbGl0IHRhY2l0aSBjb25zZWN0ZXR1ciBuaWJoIHNpdCBmZWxpcyB0ZWxsdXMgc2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDYtMjBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEwLTA5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyVUNSXCI6IFwiYWMgc2FwaWVuIHF1aXMgc2l0IHZ1bHB1dGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1QcmljZUVVUlwiOiA1Ny42NTIzNjI3NDIyOTk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnNpZ25lZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiZnJpbmdpbGxhIHBoYXJldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWxpdCB1bHRyaWNpZXMgcmlzdXMgYW50ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcImR1aSBldCBzYWdpdHRpcyBtb2xsaXMgUXVpc3F1ZSB2ZWhpY3VsYSBmYWNpbGlzaXMgbW9sbGlzIEluIERvbmVjIHNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJ0b3J0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJsaXRvcmEgTnVsbGEgc2FwaWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInJpc3VzIGF0IG5vbiBTZWQgbmVjIEN1cmFiaXR1ciBNYWVjZW5hcyB0aW5jaWR1bnQgYXJjdSB2ZWhpY3VsYSBmcmluZ2lsbGEgYWMgVmVzdGlidWx1bSBEb25lYyBEb25lYyBsYWN1cyBjb25kaW1lbnR1bSBuZWMgcXVpcyBmYWNpbGlzaXMgYWMgY29tbW9kbyBsaWd1bGEgZmFjaWxpc2lzIHNvbGxpY2l0dWRpbiBlbGVtZW50dW0gbGFvcmVldCBjb25kaW1lbnR1bSBWaXZhbXVzIGVyb3MgYWxpcXVhbSBmYWNpbGlzaXMgdnVscHV0YXRlIG1hZ25hIGZhY2lsaXNpcyBwb3J0YSBibGFuZGl0IGVsZWlmZW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMi0yOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsU3VwcGx5Q2hhaW5BY3RvclwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzNTc2NixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNlbSBtYXVyaXMgdmVsIGV0IGV0IHZpdGFlIHF1aXMgcHVsdmluYXIgbWV0dXMgcXVpcyBmZXVnaWF0IGlwc3VtIHZ1bHB1dGF0ZSBuZWMgZWdldCBkaWFtIHNlbXBlciBudW5jIGxpZ3VsYSBhbnRlIHNlZCBOdWxsYW0gcGxhY2VyYXQgTWFlY2VuYXMgZnJpbmdpbGxhIHBlbGxlbnRlc3F1ZSBzZWQgUHJvaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA3LTAyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTI0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwibGFvcmVldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTc5NjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJudWxsYSBhYyBlc3QgVml2YW11cyB0cmlzdGlxdWUgc29kYWxlcyBtYXNzYSBEdWlzIHF1YW0gZmV1Z2lhdCBhdCBjb25kaW1lbnR1bSB2aXZlcnJhIGVsaXQgY29uc2VjdGV0dXIganVzdG8gdGVtcHVzIHZpdGFlIHJob25jdXMgdHJpc3RpcXVlIGVyb3Mgc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOC0wMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0yMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcInZpdGFlIHZpdGFlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvbk9mR29vZHNcIjogXCJsZW8gZG9sb3IgdmVsIGVzdCBzYXBpZW4gY29uZGltZW50dW0gbmliaCBudWxsYSBzYXBpZW4gdGVsbHVzIGRpYW0gZWxlaWZlbmQgdmVoaWN1bGEgZWxlbWVudHVtIGFjIHZpdGFlIHZlaGljdWxhIFByYWVzZW50IGZhdWNpYnVzIGFtZXQgdml0YWUgZXQgcHJldGl1bSBWaXZhbXVzIGxhb3JlZXQgbWV0dXMgZmF1Y2lidXMgcG9ydGEgQWxpcXVhbSBwaGFyZXRyYSBjb25kaW1lbnR1bSB0YWNpdGkgcXVpcyBlbGl0IGZlbGlzIGNvbnNlY3RldHVyIGxhb3JlZXQgUGVsbGVudGVzcXVlIHJpc3VzIENsYXNzIG1hc3NhIHNpdCBmZXVnaWF0IHNvZGFsZXMgc2l0IHJpc3VzIGRvbG9yIGVnZXN0YXMgU2VkIG9kaW8gUXVpc3F1ZSBpZCBhIG5pYmggc2VkIER1aXMgZGFwaWJ1cyBmYWNpbGlzaXMgbm9zdHJhIHNpdCBJbnRlZ2VyIFBlbGxlbnRlc3F1ZSBsYWN1cyBsYWNpbmlhIGVzdCBlcm9zIGVsaXQgbWF1cmlzIE5hbSBlZ2VzdGFzIHVsbGFtY29ycGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1c0NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVsZW1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2ZWxpdCBiaWJlbmR1bSBzZW0gZG9sb3IgdWx0cmljaWVzIG1ldHVzIGltcGVyZGlldCBjb25zZXF1YXQgQ3VyYWJpdHVyIGNvbnZhbGxpcyBuaXNsIHZlbCBibGFuZGl0IGlkIHVybmEgZXUgbG9yZW0gc2NlbGVyaXNxdWUgbmliaCBibGFuZGl0IGRpYW0gZXJhdCByaXN1cyBNb3JiaSBpbXBlcmRpZXQgc2l0IHZlaGljdWxhIGdyYXZpZGEgaWQgcHJldGl1bSBzaXQgQWVuZWFuIGNvbW1vZG8gaGVuZHJlcml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTE4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTEtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbW1vZGl0eUNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFybW9uaXNlZFN5c3RlbVN1YkhlYWRpbmdDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2FwaWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJldSBwb3N1ZXJlIGRpY3R1bSBtYXNzYSBlbGVpZmVuZCBpcHN1bSBuZWMgQ3JhcyBhbGlxdWV0IG5pYmggaXBzdW0gdmVsIGlwc3VtIG5pYmggbGFvcmVldCB2ZXN0aWJ1bHVtIHZlaGljdWxhIHN1c2NpcGl0IG9kaW8gbGl0b3JhIHVybmEgZXUgZ3JhdmlkYSBhZGlwaXNjaW5nIHZ1bHB1dGF0ZSB1bHRyaWNlcyBuaWJoIGxlY3R1cyBzaXQgc2l0IG1vbGVzdGllIFV0IGxhY2luaWEgZXJvcyBNYXVyaXMgaGVuZHJlcml0IER1aXMgTWFlY2VuYXMgcXVpcyBzaXQgbmVjIHByZXRpdW0gc2FwaWVuIHNhZ2l0dGlzIG1hdXJpcyBwb3J0YSB2dWxwdXRhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA0LTE5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbWJpbmVkTm9tZW5jbGF0dXJlQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYWNpb25hbENvZGVcIjogXCJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhjaXNlR29vZHNRdWFudGl0eVwiOiA5LjIzMzA2NzMyNDAyNzkyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEYW5nZXJvdXNHb29kc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQ3NTIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVOTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5pc2lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJEb25lYyB2ZWwgdXQgcG9ydHRpdG9yIGxhb3JlZXQgbWkgRG9uZWMgQ3JhcyBuaWJoIHZpdGFlIGluIGFtZXQgTnVsbGFtIHNhcGllbiB2ZW5lbmF0aXMgUGhhc2VsbHVzIHZ1bHB1dGF0ZSBncmF2aWRhIGVsZW1lbnR1bSBlZ2V0IFV0IGNvbmRpbWVudHVtIGhlbmRyZXJpdCBmZXJtZW50dW0gaW50ZXJkdW0gdmVsIGRvbG9yIHNjZWxlcmlzcXVlIGFkaXBpc2NpbmcgbGFvcmVldCBsb2JvcnRpcyB0cmlzdGlxdWUgdml0YWUgYW1ldCB1cm5hIG1pIHZhcml1cyB0ZW1wdXMgUHJvaW4gYWRpcGlzY2luZyBhbWV0IHVsbGFtY29ycGVyIGlkIHNlZCBuZWMgbGVvIGFudGUgZWxpdCBhbWV0IG1hc3NhIGFtZXQgdmVuZW5hdGlzIGRpY3R1bSBhbWV0IG1hdXJpcyB1bGxhbWNvcnBlciBldSBMb3JlbSBlc3QgaWQgbWkgY29uZGltZW50dW0gcHVsdmluYXIgZmV1Z2lhdCBtb2xlc3RpZSBTZWQgcXVpcyBFdGlhbSBFdGlhbSBJbnRlZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDctMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA5LTIxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NjAxMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVTk51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYW1ldCB2aXRhZSBncmF2aWRhIGVsaXQgc2l0IG1hdXJpcyBxdWFtIGxvcmVtIGV1IFBoYXNlbGx1cyBkdWkgdXQgb3JjaSBhbWV0IG1ldHVzIHNlbXBlciBzZWQgcGVsbGVudGVzcXVlIGxhb3JlZXQgdml0YWUgUXVpc3F1ZSBhIGdyYXZpZGEgZGlnbmlzc2ltIHNhcGllbiB1bHRyaWNpZXMgc2l0IHV0IGVnZXQgdHJpc3RpcXVlIGVsaXQgQ3VyYWJpdHVyIG1ldHVzIGlkIHNhcGllbiBzYXBpZW4gcXVpcyBmcmluZ2lsbGEgYXVjdG9yIHZlc3RpYnVsdW0gbm9uIFF1aXNxdWUgbWV0dXMganVzdG8gVml2YW11cyBuZWMgdXQgZWdldCBhY2N1bXNhbiBNYWVjZW5hcyBhYyBqdXN0byBwaGFyZXRyYSBTZWQgcG9zdWVyZSBuaWJoIGZlbGlzIGlkIHV0IGZhY2lsaXNpcyBhdCBzYXBpZW4gZXJhdCBDbGFzcyBzYXBpZW4gbmVjIHBvcnRhIE1hZWNlbmFzIFBlbGxlbnRlc3F1ZSBWaXZhbXVzIGRpYW0gTnVsbGEgU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDEtMTRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEwLTEyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHb29kc01lYXN1cmVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3Jvc3NNYXNzXCI6IDAuOTk5NDU2NjA5MTMzMzc4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmV0TWFzc1wiOiAwLjY2ODEzNzExNDM0MDUwMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1cHBsZW1lbnRhcnlVbml0c1wiOiAwLjAwMDA5MTE3Mjc0OTA3OTM3ODdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQYWNrYWdpbmdcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTUwMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm1pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2aXRhZSB2dWxwdXRhdGUgYW1ldCBOdW5jIGNvbmRpbWVudHVtIHNpdCBzZWQgdmVsIGZlbGlzIFByb2luIGVnZXN0YXMgaGVuZHJlcml0IGVyYXQgcGVyIG1ldHVzIGVsZW1lbnR1bSBhbWV0IHRlbGx1cyBTZWQgbWV0dXMgc2VkIHNpdCBzdXNjaXBpdCBpbiBwdWx2aW5hciBtYXNzYSBhdCBxdWFtIGVsZW1lbnR1bSBkYXBpYnVzIHV0IGFudGUgSW50ZWdlciBNYWVjZW5hcyB1bGxhbWNvcnBlciBuZWMgYW1ldCBwb3J0YSBlbGl0IHNvbGxpY2l0dWRpbiBhdWd1ZSBtYXNzYSBlZ2VzdGFzIHVsdHJpY2llcyBzdXNjaXBpdCBwZWxsZW50ZXNxdWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA0LTEzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA4LTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogNDE2NTMzODYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwidml0YWUgaXBzdW0gZGlhbSBlbGVtZW50dW0gdmVsaXQgc2VkIG5lYyBxdWlzIGVnZXQgYWNjdW1zYW4gZWxpdCBsYWN1cyB2b2x1dHBhdCBQcm9pbiByaG9uY3VzIHRvcnRvciBNb3JiaSBldSBwaGFyZXRyYSBzaXQgdmVsIHN1c2NpcGl0IGVsZW1lbnR1bSBibGFuZGl0IGRvbG9yIGdyYXZpZGEgaWQgdGVtcHVzIHNpdCBhZGlwaXNjaW5nIG5lYyBEdWlzIHRyaXN0aXF1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTgwMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImR1aSBtZXR1cyBlcmF0IGVyYXQgQWxpcXVhbSBOdWxsYSBjb21tb2RvIFByYWVzZW50IGluIHZ1bHB1dGF0ZSBjb25zZXF1YXQgRG9uZWMgSW50ZWdlciByaXN1cyB1bGxhbWNvcnBlciBhbnRlIHNlbSBzb2RhbGVzIHRlbXBvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMDFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDktMjlUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiAzOTgzMzk3MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNoaXBwaW5nTWFya3NcIjogXCJlZ2V0IHJpc3VzIHB1cnVzIERvbmVjIGVnZXN0YXMgcG90ZW50aSBzZWQgc2VkIHNhcGllbiB2dWxwdXRhdGUgYWNjdW1zYW4gYXJjdSBlcmF0IHV0IHNhcGllbiBNYWVjZW5hcyBtaSBzZWQgaWQgYXVjdG9yIG5lYyBzY2VsZXJpc3F1ZSBlZ2VzdGFzIGF0IHB1bHZpbmFyIGVzdCBwcmV0aXVtIGV1aXNtb2QgdG9ydG9yIGNvbnZhbGxpcyBOdWxsYSBTZWQgYWMgZWdldCBlbGVtZW50dW0gZWdldCBuZXF1ZSBWZXN0aWJ1bHVtIGRpYW0gbGFjdXMgbWF1cmlzIHZlc3RpYnVsdW0gc2FnaXR0aXMgdGluY2lkdW50IGN1cnN1cyBhdCBpbiBlZ2V0IGlwc3VtIHBoYXJldHJhIGFjY3Vtc2FuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDkwNjIzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm9kaW9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1ldHVzIGRhcGlidXMgbG9ib3J0aXMgZXN0IHF1aXMgdmVoaWN1bGEgZHVpIGR1aSBkaWN0dW0gZGlhbSBuaWJoIG1pIE1hZWNlbmFzIGFudGUgYW50ZSBibGFuZGl0IGNvbW1vZG8gdmVoaWN1bGEgc2VtIGFsaXF1YW0gcG9ydGEgQWxpcXVhbSBTZWQgbG9yZW0gVml2YW11cyBpZCBzaXQgZG9sb3IgdXJuYSBxdWFtIGVsZW1lbnR1bSBhbnRlIG9kaW8gY29udmFsbGlzIHZlc3RpYnVsdW0gTnVuYyBQaGFzZWxsdXMgdmVoaWN1bGEgdGVsbHVzIGhlbmRyZXJpdCBOdWxsYSBtYWduYSB1dCB1bGxhbWNvcnBlciBBZW5lYW4gUGVsbGVudGVzcXVlIERvbmVjIGVnZXN0YXMgcmlzdXMgcG9ydGEgdHJpc3RpcXVlIGVnZXQgdmVoaWN1bGEgYWMgbnVuYyBTdXNwZW5kaXNzZSB2aXRhZSBub24gbWkgZXJvcyBkYXBpYnVzIHBlbGxlbnRlc3F1ZSB1bHRyaWNpZXMgcmhvbmN1cyBzZW0gdmVoaWN1bGEgZmF1Y2lidXMgY29uc2VxdWF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMS0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0xOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJpZCBjb21tb2RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogMjMwODUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0dXJwaXMgaWQgbmlzaSBzdXNjaXBpdCB0YWNpdGkgbmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDMtMDZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMDNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiA4OTI5OTE1NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lYXN1cmVtZW50VW5pdEFuZFF1YWxpZmllclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5lY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicmhvbmN1cyBQcm9pbiB2dWxwdXRhdGUgZGljdHVtIHNlbSBncmF2aWRhIHNlZCBhIGF1Y3RvciB2ZXN0aWJ1bHVtIG9ybmFyZSBsaWd1bGEgcHVydXMgYWxpcXVhbSBxdWlzIHZhcml1cyBEdWlzIHNhcGllbiBDcmFzIFByYWVzZW50IEN1cmFiaXR1ciB2ZXN0aWJ1bHVtIGVsZWlmZW5kIHBsYWNlcmF0IEFsaXF1YW0gYWNjdW1zYW4gbWF0dGlzIGFjIHZpdGFlIGxhY3VzIFByYWVzZW50IE51bGxhbSBsaWd1bGEgTnVuYyBEb25lYyBQaGFzZWxsdXMgc2FwaWVuIHB1bHZpbmFyIGV1aXNtb2Qgc2VtcGVyIHVybmEgZXN0IGVsZWlmZW5kIHNhcGllbiBMb3JlbSBNYWVjZW5hcyBjb21tb2RvIGFtZXQgYWMgaWQgaW1wZXJkaWV0IGxhY3VzIG1hdXJpcyB0b3J0b3IgYW50ZSBWZXN0aWJ1bHVtIHBvc3VlcmUgYW1ldCB2ZWwgU2VkIG5pc2wgQ3VyYWJpdHVyIHZlaGljdWxhIFBlbGxlbnRlc3F1ZSBpbiBiaWJlbmR1bSBMb3JlbSBhdWd1ZSBhbnRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOS0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOS0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiOiAwLjAwOTExNzMwMDM4ODkyMzUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJldSBsYWNpbmlhIGp1c3RvIGxpZ3VsYSBjb21tb2RvIGVnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzNTYyNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzZWQgYmxhbmRpdCBudW5jIHRlbGx1cyBncmF2aWRhIE51bGxhIFNlZCBhIGJpYmVuZHVtIHNpdCBEdWlzIG1vbGVzdGllIGNvbmRpbWVudHVtIEV0aWFtIGFkaXBpc2NpbmcgdmVsIGp1c3RvIHR1cnBpcyBlcm9zIHZlbCBtYXR0aXMgY29uZGltZW50dW0gbWFzc2EgY29uc2VjdGV0dXIgbmVjIGVsaXQgU2VkIGNvbnZhbGxpcyB2b2x1dHBhdCBRdWlzcXVlIHBvcnRhIGV1IENyYXMgQ3VyYWJpdHVyIERvbmVjIG9yY2kgc2l0IG5pc2kgRHVpcyBQcmFlc2VudCBpcHN1bSBub24gY29uc2VxdWF0IFN1c3BlbmRpc3NlIGJpYmVuZHVtIGxlY3R1cyBOdW5jIHBoYXJldHJhIER1aXMgbm9uIFNlZCBuZXF1ZSB2aXRhZSBzaXQgYmxhbmRpdCBTZWQgdXJuYSBQcmFlc2VudCBwdWx2aW5hciBEb25lYyBlcm9zIEN1cmFiaXR1ciBQcm9pbiBlbGl0IEN1cmFiaXR1ciBkaWN0dW0gSW4gTnVuYyBQZWxsZW50ZXNxdWUgYXVjdG9yIHVybmEgbWFzc2EgdHJpc3RpcXVlIHNjZWxlcmlzcXVlIG5vbiBlZ2VzdGFzIHZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDItMDRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZXUgY29udWJpYSBsYW9yZWV0IGNvbmd1ZSBzb2RhbGVzIHNpdCBhZGlwaXNjaW5nIHBlbGxlbnRlc3F1ZSBkaWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogODE3OTQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uZGltZW50dW0gZHVpIGNvbW1vZG8gdmVuZW5hdGlzIGp1c3RvIGRpY3R1bSBDdXJhYml0dXIgbGlndWxhIGVsaXQgQWVuZWFuIHVsbGFtY29ycGVyIHRlbGx1cyBtZXR1cyBhdCBzb2RhbGVzIG51bGxhIHZlbCBtYXVyaXMgcG9zdWVyZSBsYWN1cyBOdWxsYW0gc3VzY2lwaXQgc2VtIGV0IHZpdGFlIHRyaXN0aXF1ZSBzaXQgZnJpbmdpbGxhIGFtZXQgZGFwaWJ1cyB1cm5hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNi0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDQwMzkwNTQwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibWlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNlbXBlciBkdWkgZWdldCB0aW5jaWR1bnQgc2VtcGVyIHVsdHJpY2llcyByaXN1cyBtYXR0aXMganVzdG8gbWkgbGlndWxhIHZlaGljdWxhIGltcGVyZGlldCBzdXNjaXBpdCB1dCBlc3QgcHVydXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA4LTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCI6IDAuMDY1NjE3NzA0NjU0ODY1OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwicGVsbGVudGVzcXVlIGludGVyZHVtXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTdXBwb3J0aW5nRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTgzODMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibnVuY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibmlzaSBlZ2VzdGFzIGNvbmRpbWVudHVtIGFkaXBpc2NpbmcgYWRpcGlzY2luZyBQcm9pbiBpYWN1bGlzIGVsZW1lbnR1bSBsaXRvcmEgcG9ydGEgZWdldCBqdXN0byBkYXBpYnVzIHBvcnR0aXRvciBEb25lYyBtb2xlc3RpZSBub24gc3VzY2lwaXQgZXJvcyBtYXVyaXMgdmVsIGhlbmRyZXJpdCBEb25lYyBhdWd1ZSB2aXRhZSBDdXJhYml0dXIgbmVjIGVnZXN0YXMgYW1ldCBFdGlhbSBtZXR1cyBhYyBVdCBhcmN1IHNvZGFsZXMgcGVsbGVudGVzcXVlIGF1Z3VlIGludGVyZHVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOS0xMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMi0yNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJoaW1lbmFlb3Mgb3JjaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnRMaW5lSXRlbU51bWJlclwiOiAzNzk2MyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwiZWdlc3RhcyBzaXQgYW1ldCBwdXJ1c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzk1OTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiTW9yYmkgbWV0dXMgYWRpcGlzY2luZyBhbnRlIGFkaXBpc2NpbmcgbWkgZXN0IGJsYW5kaXQgZGlhbSBTZWQgbWF0dGlzIGlwc3VtIGJsYW5kaXQgZWdldCBncmF2aWRhIG5lYyBhZGlwaXNjaW5nIENyYXMgZWdldCBmZXVnaWF0IHJ1dHJ1bSBzb2xsaWNpdHVkaW4gYSBldCBkaWN0dW0gZ3JhdmlkYSBuaWJoIG1hdXJpcyB0cmlzdGlxdWUgU2VkIGxpZ3VsYSBldSBuaWJoIGVnZXN0YXMgZmFjaWxpc2lzIG51bmMgZmV1Z2lhdCBlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNS0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJtYXVyaXMgYXVjdG9yIGNvbmRpbWVudHVtIHNvZGFsZXMgYWMgcGhhcmV0cmEgYWMgbmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnRMaW5lSXRlbU51bWJlclwiOiA2NDAwMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwicmhvbmN1cyBtaSBtYXNzYSBub24gU2VkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsUmVmZXJlbmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDMzNTA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbCBpcHN1bSBhbWV0IHNpdCBzaXQgUGVsbGVudGVzcXVlIHBlbGxlbnRlc3F1ZSBwb3N1ZXJlIHZ1bHB1dGF0ZSB1bHRyaWNpZXMgUGVsbGVudGVzcXVlIG1hdXJpcyBsaWd1bGEgdmVsaXQgbGFjdXMgZmVsaXMgRXRpYW0gbG9yZW0gYW50ZSB2aXRhZSBlZ2V0IGZyaW5naWxsYSBOdW5jIGFtZXQgY29uZGltZW50dW0gbW9sbGlzIHVsdHJpY2llcyBwbGFjZXJhdCBldCBjb25kaW1lbnR1bSBmYWNpbGlzaXMgZmVybWVudHVtIHVsbGFtY29ycGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMS0yNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNC0yMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJkaWN0dW0gbnVuYyBub24gU3VzcGVuZGlzc2UgdnVscHV0YXRlIGZhdWNpYnVzIHBoYXJldHJhIGNvbW1vZG8gZWdldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDAyOTcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibGFvcmVldCBjb25kaW1lbnR1bSBzZW0gY29uZGltZW50dW0gc2VtIG1pIHNvZGFsZXMgdHVycGlzIHJ1dHJ1bSBpbnRlcmR1bSBlbGVpZmVuZCBEb25lYyBhIGRpYW0ganVzdG8gbGFjdXMgbnVsbGEgZWxpdCBhcHRlbnQgY29udmFsbGlzIHRlbGx1cyBtb2xlc3RpZSBhbGlxdWV0IGZhY2lsaXNpcyBwb3N1ZXJlIHZpdGFlIGltcGVyZGlldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDMtMTNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMjBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZXQgbGFjdXMgYWRpcGlzY2luZyB0cmlzdGlxdWUgZWxlbWVudHVtIE51bGxhIHF1aXMgU2VkIGRpZ25pc3NpbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbEluZm9ybWF0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDcxMjcxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImRpYW0gZWxlaWZlbmQgZGlhbSBwbGFjZXJhdCB0cmlzdGlxdWUgc2VtIGFjY3Vtc2FuIGxvcmVtIG5pYmggdmVzdGlidWx1bSBtZXR1cyBhIGVsaXQgdGVtcG9yIGRpY3R1bSBuZWMgdml0YWUgdGVsbHVzIGltcGVyZGlldCBhdWd1ZSBlcmF0IENyYXMgdG9ydG9yIGVsaXQgYWNjdW1zYW4gYW1ldCB0cmlzdGlxdWUgdXJuYSBsYWN1cyBoZW5kcmVyaXQgYXQgZWdldCBudWxsYSBlcmF0IGZlcm1lbnR1bSBJbnRlZ2VyIG1ldHVzIGFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA1LTA3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTI4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJuZWMgY29uZGltZW50dW0gZWxlbWVudHVtIHVsbGFtY29ycGVyIHNhcGllbiBwcmV0aXVtIG1hdXJpcyBldSBsaWd1bGEgaW4gbGFjdXMgdHVycGlzIGR1aSBlcm9zIGVnZXQgQ3JhcyBhZGlwaXNjaW5nIEluIGVnZXN0YXMgcGVsbGVudGVzcXVlIGVsZW1lbnR1bSBsYW9yZWV0IG5lYyBBbGlxdWFtIHBoYXJldHJhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5NTQyMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZpdGFlIGxhb3JlZXQgYWRpcGlzY2luZyBzZWQgaXBzdW0gbWF1cmlzIE51bGxhbSBjb25kaW1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDctMTFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDItMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkV0aWFtIG5lcXVlIHZ1bHB1dGF0ZSBQcmFlc2VudCBDdXJhYml0dXIgbGVvIGEgdWxsYW1jb3JwZXIgYW1ldCB2ZWwgc2l0IHZ1bHB1dGF0ZSBGdXNjZSBzZW0gZXVpc21vZCBtb2xlc3RpZSBhbWV0IEFlbmVhbiBlbmltIGF1Z3VlIG1ldHVzIFBlbGxlbnRlc3F1ZSBhbWV0IG1ldHVzIGV1IEluIHNlZCBtb2xsaXMgYWxpcXVldCBhbWV0IG9kaW8gZHVpIHJpc3VzIG5pc2kgZWxlaWZlbmQgU2VkIGlkIGxhb3JlZXQgYSBncmF2aWRhIGRpYW0gdGVsbHVzIGV0IGluIHF1aXMgZWdlc3RhcyBkaWFtIFNlZCBwaGFyZXRyYSBwb3J0YSBQcm9pbiB2ZXN0aWJ1bHVtIGF0IG5vbiBwZWxsZW50ZXNxdWUgdXQgVXQgZGFwaWJ1cyBsb3JlbSBtYXNzYSBlbGVpZmVuZCBtYWduYSByaG9uY3VzIGJsYW5kaXQgcHVsdmluYXIgbmlzaSB0aW5jaWR1bnQgb3JjaSBkYXBpYnVzIGxlY3R1cyBqdXN0byB0cmlzdGlxdWUgbGFvcmVldCBzaXQgVml2YW11cyBlZ2V0IGNvbmRpbWVudHVtIG1pIGVzdCBlZ2V0IHNpdCBwZWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydENoYXJnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RPZlBheW1lbnRcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWdlc3RhcyBxdWlzIGhpbWVuYWVvcyBlbGVtZW50dW0gRXRpYW0gdmVzdGlidWx1bSBEb25lYyBtb2xlc3RpZSBkaWN0dW0gcGVsbGVudGVzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA1LTE4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDItMTdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDQ3MDI1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uVHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZmF1Y2lidXMgdmVsaXQgbmVjIGxhb3JlZXQgbm9uIHNlbSBmZWxpcyBlZ2VzdGFzIG1ldHVzIG51bGxhIEFsaXF1YW0gbGFjdXMgRG9uZWMgZWxlbWVudHVtIGlwc3VtIGludGVyZHVtIHRlbGx1cyB0b3J0b3IgYW50ZSBtYXVyaXMgZWdldCBuZWMgbWkgbmVjIE1vcmJpIFN1c3BlbmRpc3NlIHRlbXBvciByaXN1cyBuZWMgcG9ydHRpdG9yIG9ybmFyZSBOdW5jIHRlbGx1cyBhbnRlIHZpdGFlIHNpdCB2ZWxpdCBhbWV0IGF1Z3VlIGEgbWF1cmlzIGxhb3JlZXQgdml0YWUgYXQgZWxpdCBudW5jIGNvbnNlY3RldHVyIHRhY2l0aSBhZGlwaXNjaW5nIHV0IGEgdmVsIHF1YW0gZXUgdGVsbHVzIGFsaXF1YW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOC0wOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDktMjhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEaXNwYXRjaFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTAyLTA4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTAxLTE5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wMDIyNTM3OTA5NTA1MjA4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkxvcmVtIHB1bHZpbmFyIGxpZ3VsYSB0dXJwaXMgc3VzY2lwaXQgY29uZGltZW50dW0gYXQgZXUgaGVuZHJlcml0IG1hZ25hIHBlciBQcmFlc2VudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTExLTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMi0xMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRlc3RpbmF0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDQtMjJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDUtMDFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAyLjcyNTg5NzI1MTAzNTA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pc2wgZXVpc21vZCB1bHRyaWNpZXMgTnVuYyBxdWlzIHF1aXMgdHJpc3RpcXVlIHNpdCBmZWxpcyBTdXNwZW5kaXNzZSBtb2xlc3RpZSBlcm9zIHN1c2NpcGl0IHBoYXJldHJhIG5vbiBqdXN0byBhZGlwaXNjaW5nIHRyaXN0aXF1ZSBuaXNpIGNvbmRpbWVudHVtIG5pYmggdmVsIHB1bHZpbmFyIG1pIHRlbXBvciB2aXZlcnJhIHVybmFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMi0xMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDctMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJVQ1JcIjogXCJ1bHRyaWNpZXMgZXJhdCBpbiBhZGlwaXNjaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbVByaWNlRVVSXCI6IDAuMDAwNTk2NjY3ODAxNzczNDg2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnNpZ25lZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiYXQgdHJpc3RpcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuaXNsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiaXBzdW0gbWV0dXMgZ3JhdmlkYSBWaXZhbXVzIGV1IG5vbiBsYW9yZWV0IHNlbSBtb2xlc3RpZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicG9zdGNvZGVcIjogXCJtYXVyaXMgZXJvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcIm5lYyBuaXNpIHJ1dHJ1bSB2aXRhZSBoZW5kcmVyaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibmlzbCBxdWlzIGF1Z3VlIERvbmVjIGNvbnNlcXVhdCBvcmNpIGF1Z3VlIGhlbmRyZXJpdCBwdWx2aW5hciBTZWQgaXBzdW0gdml0YWUgbWFzc2EgYXQgRHVpcyBhZGlwaXNjaW5nIHZlbCBhZGlwaXNjaW5nIGVnZXQganVzdG8gbm9uIGZhY2lsaXNpcyBTZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA1LTI3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTIwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxTdXBwbHlDaGFpbkFjdG9yXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDY2OTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5pYmggdmVsIGFjIFBlbGxlbnRlc3F1ZSBlcm9zIG5vbiB0ZWxsdXMgdmVoaWN1bGEgSW4gbWF1cmlzIEV0aWFtIGJsYW5kaXQgc2VtIHZpdGFlIHZpdGFlIGZhY2lsaXNpcyByaXN1cyBlbGl0IHZhcml1cyBEb25lYyBwdXJ1cyBhYyBlZ2VzdGFzIGRpYW0gZXUgTnVsbGFtIG5vbiB0b3J0b3Igc2VkIGFyY3Ugc2NlbGVyaXNxdWUgYXQgcGhhcmV0cmEgcGhhcmV0cmEgZWxpdCBsYW9yZWV0IER1aXMgYXJjdSBtb2xlc3RpZSB1dCBvZGlvIHRyaXN0aXF1ZSBzZW0gbnVsbGEgbmVxdWUgbG9ib3J0aXMgYXQgdmVsIHBlbGxlbnRlc3F1ZSBtYXNzYSBFdGlhbSBlbGVtZW50dW0gYXQgUGhhc2VsbHVzIERvbmVjIFNlZCBmYWNpbGlzaXMgY29uZGltZW50dW0gdGVsbHVzIGFtZXQgc2FwaWVuIGJsYW5kaXQgbWFzc2FcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEyLTE5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA5LTE0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiYXVndWUgbGFjaW5pYSBQaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjQwOTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJwZWxsZW50ZXNxdWUgc2FwaWVuIHV0IGEgZWxpdCBhYyBkdWkgZWxpdCBxdWFtIHBlbGxlbnRlc3F1ZSBsZW8gY29udmFsbGlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMy0wNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0zMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcIlByb2luIFV0IGFtZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbW1vZGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uT2ZHb29kc1wiOiBcIm1ldHVzIG9ybmFyZSBmcmluZ2lsbGEgZXJvcyBlc3QgdmFyaXVzIE1vcmJpIGRpYW0gZWxlbWVudHVtIG5lcXVlIFF1aXNxdWUgbmliaCBlbGl0IHNlZCBtYXNzYSBuaXNpIGxvcmVtIHRlbXBvciBpZCBvZGlvIGlwc3VtIGVsZWlmZW5kIHVybmEgZHVpIHRpbmNpZHVudCBQaGFzZWxsdXMgZmV1Z2lhdCBhbGlxdWV0IG1ldHVzIGZhY2lsaXNpcyBncmF2aWRhIGF0IHN1c2NpcGl0IGxlbyBtb2xlc3RpZSBhbWV0IGNvbmRpbWVudHVtIFByYWVzZW50IGF0IHNlbXBlciBmYWNpbGlzaXMgTWFlY2VuYXMgZmFjaWxpc2lzIHV0IHBlciB1dCB1dCBlcmF0IG51bmMgc2l0IHNlbSBwb3J0YSByaXN1cyB0cmlzdGlxdWUgcXVhbSBpZCB0b3JxdWVudCBwb3N1ZXJlIGFkaXBpc2Npbmcgdml0YWUgdGVsbHVzIGxpZ3VsYSB2aXRhZSBmZWxpcyB2dWxwdXRhdGUgU2VkIG5pYmggdXQgZGFwaWJ1cyBtaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXNDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJQaGFzZWxsdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZWxlbWVudHVtIGVsZWlmZW5kIFBoYXNlbGx1cyBpZCBQaGFzZWxsdXMgYWNjdW1zYW4gQ3JhcyBmZWxpcyBhYyBTZWQganVzdG8gZWdldCBzZWQgbmliaCBlcm9zIG1ldHVzIG5vbiBwZWxsZW50ZXNxdWUgdXQgaW1wZXJkaWV0IHNvZGFsZXMgdml0YWUgbG9yZW0gbG9yZW0gYW1ldCBvcmNpIG5pYmggY29uZ3VlIHZhcml1cyBudW5jIHZlbCBlbGl0IEN1cmFiaXR1ciBsb2JvcnRpcyBlZ2V0IGludGVyZHVtIGlkIHBvcnRhIHRhY2l0aSBmcmluZ2lsbGEgdGVtcHVzIG5lYyBhcmN1IFZpdmFtdXMgaWQgZ3JhdmlkYSBydXRydW0gZXUgYXVndWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMDNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMy0yMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29tbW9kaXR5Q29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYXJtb25pc2VkU3lzdGVtU3ViSGVhZGluZ0NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhdWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInJob25jdXMgZGljdHVtIFBlbGxlbnRlc3F1ZSBzYXBpZW4gZXN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMi0yN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMy0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21iaW5lZE5vbWVuY2xhdHVyZUNvZGVcIjogXCJldVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFjaW9uYWxDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImV4Y2lzZUdvb2RzUXVhbnRpdHlcIjogMC4xMTA3MTg5MTYyMjE4NTdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRhbmdlcm91c0dvb2RzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTE5NTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZXJhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImRpY3R1bSB2aXRhZSBmYXVjaWJ1cyBQZWxsZW50ZXNxdWUgYXQgcHVsdmluYXIgbW9sZXN0aWUgZmF1Y2lidXMgVXQgRXRpYW0gZmV1Z2lhdCB0ZWxsdXMgc29kYWxlcyBOdWxsYW0gZWdldCBwZXIgaW4gZXN0IGJsYW5kaXQgdm9sdXRwYXQgU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA0LTIzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA3MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiTnVuY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAzLTE0VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0xM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR29vZHNNZWFzdXJlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdyb3NzTWFzc1wiOiA3NzEuNzUyNDU0MjM0MTcyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmV0TWFzc1wiOiAwLjAwMDA2Mjk3OTQ4MDI4MDk5NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1cHBsZW1lbnRhcnlVbml0c1wiOiAwLjAwMDA5MDA5NzcyNzM0MjU1NDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQYWNrYWdpbmdcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTc1NjcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJvZGlvIFZpdmFtdXMgTWFlY2VuYXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA1LTEzVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTI5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMTg2Nzc0MzYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwic2FwaWVuIGJsYW5kaXQgdXQgbmVjIHNvZGFsZXMgdG9ydG9yIGFtZXQgcHVydXMgcmlzdXMgZ3JhdmlkYSBjb25kaW1lbnR1bSBzZWQgZHVpIHNhcGllbiBsb2JvcnRpcyBoZW5kcmVyaXQgZXVpc21vZCBmYWNpbGlzaXMgdWx0cmljaWVzIHByZXRpdW0gZmV1Z2lhdCBsYWN1cyBjb21tb2RvIEluIG5pc2wgYWMgUHJhZXNlbnQgdXQgc2VtcGVyIE51bmMgZHVpIG5lYyB0b3J0b3Igb2RpbyB2ZXN0aWJ1bHVtIGp1c3RvIGVnZXQgYWxpcXVldCBqdXN0byBwdWx2aW5hciBjb25kaW1lbnR1bSBtb2xlc3RpZSB1dCB1dCBpbiBudWxsYSBjb25zZWN0ZXR1ciBhdCBQZWxsZW50ZXNxdWUgdHVycGlzIG1hZ25hIG9ybmFyZSBmYWNpbGlzaXMgYWMgRG9uZWMgdnVscHV0YXRlIHV0IHBlbGxlbnRlc3F1ZSBhYyBlZ2VzdGFzIGlkIGNvbmRpbWVudHVtIFF1aXNxdWUgcmlzdXMgcmhvbmN1cyB2aXRhZSBhIGp1c3RvIHNlZCBEb25lYyBuZWMgbm9uIG51bmMgcGhhcmV0cmEgU2VkIGRvbG9yIGVnZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU4NDgwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJzZW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFjIGxlbyBwdWx2aW5hciB2ZXN0aWJ1bHVtIHV0IG1pIGV0IGFkaXBpc2NpbmcgcHJldGl1bSBjb25ndWUgZGlhbSBwb3N1ZXJlIG5vc3RyYSBtYXVyaXMgc2FnaXR0aXMgbGFjdXMgY29tbW9kbyBpZCBlZ2V0IGZhY2lsaXNpcyBub24gdmVsIGVnZXQgcGVsbGVudGVzcXVlIG5pc2wgY29uZ3VlIG5lYyBzZWQgRXRpYW0gU2VkIEFsaXF1YW0gYXQgUHJhZXNlbnQgdGVsbHVzIEN1cmFiaXR1ciBwcmV0aXVtIGNvbmRpbWVudHVtIGZlcm1lbnR1bSB0b3J0b3IgbWkgbGlndWxhIHZhcml1cyBjb252YWxsaXMgdXJuYSBlZ2VzdGFzIGVuaW0gbW9sZXN0aWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAxLTI4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA1LTAyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMzQ2ODg1NjgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwiTWFlY2VuYXMgYW1ldCBub24gZWdldCB0YWNpdGlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlByZXZpb3VzRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODk3MzEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidXJuYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2VkIGxhY2luaWEgZGlhbSBlbGl0IGF1Z3VlIHZlaGljdWxhIGFjY3Vtc2FuIGNvbmRpbWVudHVtIG5pc2kgbWFnbmEgbWV0dXMgdXQgbnVuYyBzZW1wZXIgdGluY2lkdW50IGxlbyBkaWN0dW0gaXBzdW0gbm9uIGxpZ3VsYSBwZWxsZW50ZXNxdWUgdmVoaWN1bGEgUXVpc3F1ZSBhcmN1IHVsdHJpY2llcyB2dWxwdXRhdGUgYSBTZWQgY29uc2VxdWF0IHNlbSBxdWlzIG5vbiB0cmlzdGlxdWUgbGlndWxhIERvbmVjIG1hZ25hIHNvZGFsZXMgdmVuZW5hdGlzIHByZXRpdW0gaW1wZXJkaWV0IGxlbyBsZWN0dXMgYXVjdG9yIG1hdXJpcyBhYyBkYXBpYnVzIG5lYyBzb2xsaWNpdHVkaW4gbWF1cmlzIGZlcm1lbnR1bSBsZW8gdWx0cmljaWVzIHZhcml1cyBsYW9yZWV0IGVuaW0gZXUgYXVndWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTExLTE2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTAxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcIm5lYyBhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDYzMTE5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibWFzc2EgY29uZGltZW50dW0gdGVtcG9yIHN1c2NpcGl0IGNvbnNlcXVhdCBzb2xsaWNpdHVkaW4gdGVsbHVzIGV0IGxpZ3VsYSBhbnRlIEZ1c2NlIHVsbGFtY29ycGVyIG1hdXJpcyBQcmFlc2VudCBzYWdpdHRpcyBuZWMgSW4gSW4gdml0YWUgbGFjaW5pYSBlcmF0IEludGVnZXIgc2VkIG5vbiBsYWN1cyBwdWx2aW5hciBibGFuZGl0IG5vbiBJbiBlbGl0IGZldWdpYXQgdGluY2lkdW50IHV0IGR1aSBuaWJoIGVsaXQgaXBzdW0gcmhvbmN1cyBkdWkgUHJvaW4gTWFlY2VuYXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA5LTIyVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA4LTEwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogNTk0MDY0NDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuZWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImZhY2lsaXNpcyBEdWlzIHNhZ2l0dGlzIGR1aSBEb25lYyBmYWNpbGlzaXMgbmVjIGxlbyBzaXQgc2l0IFNlZCBpbnRlcmR1bSB2ZWxpdCBlcmF0IHNlZCBlcmF0IGlwc3VtIGxvcmVtIHRvcnRvciB2aXRhZSBjb25kaW1lbnR1bSBOdWxsYSBJbiB1bGxhbWNvcnBlciBzZW0gdHJpc3RpcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMy0xMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMS0yM1QyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiOiA2Ljg3OTg5ODI1NzAzMTk5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJkaWFtIGFtZXQgbWF1cmlzIHV0IG5pYmggcHJldGl1bVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogODQyNzAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiRHVpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRG9uZWMgZXN0IGVsaXQgTnVuYyBjb25kaW1lbnR1bSBkaWN0dW0gY29uZ3VlIHNpdCBncmF2aWRhIHZlc3RpYnVsdW0ganVzdG8gYXJjdSBpbiBmZXJtZW50dW0gZmV1Z2lhdCByaXN1cyB2ZWhpY3VsYSBlbGVtZW50dW0gcXVpcyB2dWxwdXRhdGUgZXVpc21vZCBmYWNpbGlzaXMgYW1ldCB1bGxhbWNvcnBlciBmYXVjaWJ1cyBzYXBpZW4gb3JjaSBzb2xsaWNpdHVkaW4gYWRpcGlzY2luZyBTdXNwZW5kaXNzZSBmZXVnaWF0IE1hZWNlbmFzIHNlbXBlciB2aXRhZSBlZ2VzdGFzIHF1aXMganVzdG8gYWRpcGlzY2luZyBjb21tb2RvIFN1c3BlbmRpc3NlIE51bmMgYWNjdW1zYW4gdGluY2lkdW50IGV1IHBoYXJldHJhIGF1Z3VlIE5hbSBNYXVyaXMgVXQgZW5pbSBwZWxsZW50ZXNxdWUgc2VtIEFsaXF1YW0gVXQgbWV0dXMgZmVybWVudHVtIGVsZWlmZW5kIFByb2luIG1hdXJpcyBQcmFlc2VudCBFdGlhbSBEdWlzIHZpdGFlIGV1IG1ldHVzIHBoYXJldHJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMi0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMS0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJsZW8gZGlhbSB0cmlzdGlxdWUgbGFvcmVldCBzYXBpZW4gc29kYWxlcyBVdCB0ZW1wdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiA0NTA1NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVPZlBhY2thZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImp1c3RvIGxlbyB1bGxhbWNvcnBlciB0aW5jaWR1bnQgRG9uZWMgYSBlbmltIGludGVyZHVtIGxpZ3VsYSBsYWN1cyBwdWx2aW5hciBoZW5kcmVyaXQgdXJuYSBjb25kaW1lbnR1bSBpbiBlbGVpZmVuZCBQZWxsZW50ZXNxdWUgb2RpbyBjdXJzdXMgTG9yZW0gZXJvcyByaXN1cyBuaWJoIGV1IG9kaW8gdG9ydG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOC0wNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDI4MDE2NDMxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVhc3VyZW1lbnRVbml0QW5kUXVhbGlmaWVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmlzbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uZGltZW50dW0gZXQgbGFjdXMgYW1ldCB0b3J0b3IgZmV1Z2lhdCBzYXBpZW4gbWV0dXMgZXJvcyBJbiBjb252YWxsaXMgc2VtIG1vbGVzdGllIHBsYWNlcmF0IGZhdWNpYnVzIFZpdmFtdXMgdWx0cmljaWVzIHBvcnR0aXRvciBjb21tb2RvIG5pYmggZGFwaWJ1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDMtMDRUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogMC4wNDI2NjgzNTg1MzU4MTcxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJpcHN1bSBkYXBpYnVzIFF1aXNxdWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlN1cHBvcnRpbmdEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyMzM1MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaWJoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJsYW9yZWV0IGNvbW1vZG8gcHVsdmluYXIgYXVjdG9yIFZpdmFtdXMgdG9ydG9yIGFtZXQgbWF1cmlzIGF0IFF1aXNxdWUgSW50ZWdlciBtYXVyaXMgdHJpc3RpcXVlIFN1c3BlbmRpc3NlIHVsdHJpY2VzIHNpdCBlc3QgU2VkIHRlbXBvciBvZGlvIGhlbmRyZXJpdCBldSBlZ2V0IGFjIHNvbGxpY2l0dWRpbiB2ZWxpdCB2aXRhZSBzZWQgcmlzdXMgdGluY2lkdW50IHNpdCBwcmV0aXVtIHRvcnRvciBzZW1wZXIgc2VtcGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMy0yOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMy0wOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJwZWxsZW50ZXNxdWUgY29uc2VjdGV0dXIgYWNjdW1zYW4gQ3VyYWJpdHVyIHF1YW0gdGVtcHVzIGFjIHRpbmNpZHVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnRMaW5lSXRlbU51bWJlclwiOiA1OTQ0OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwic2VkIGVzdCB2ZWxpdCBuZWMgcHJldGl1bSBudW5jXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0MjUwMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJyaXN1cyB2b2x1dHBhdCBkaWFtIGRpYW0gdGVtcHVzIG9yY2kgZXUgUGhhc2VsbHVzIHV0IE51bGxhbSBlbGl0IGlkIHVsbGFtY29ycGVyIHZ1bHB1dGF0ZSBTZWQgbmVxdWUgZWxlaWZlbmQgbmVjIEluIHV0IGFkaXBpc2NpbmcgUGVsbGVudGVzcXVlIHNjZWxlcmlzcXVlIG1pIEludGVnZXIgZWdldCBpbiBzb2xsaWNpdHVkaW4gUGVsbGVudGVzcXVlIG5vbiB1bHRyaWNlcyB2ZXN0aWJ1bHVtIGVnZXQgb2RpbyBzZW1wZXIgdml0YWUgRG9uZWMgaW4gbWV0dXMgbmVjIHZpdGFlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMS0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wMi0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ2ZWwgcXVpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnRMaW5lSXRlbU51bWJlclwiOiAxOTExOSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwidXJuYSBsaWd1bGEgbmliaCBlbGVtZW50dW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTkwNzMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiSW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInR1cnBpcyBlZ2VzdGFzIGV1IGF1Z3VlIGVsZW1lbnR1bSBuZXF1ZSBsaXRvcmEgTnVsbGFtIHNvZGFsZXMgcG9ydHRpdG9yIFNlZCB0ZWxsdXMgQ3VyYWJpdHVyIHNhcGllbiBFdGlhbSB1bHRyaWNpZXMgZWxpdCBlZ2VzdGFzIG5lYyBWaXZhbXVzIGp1c3RvIHNpdCBzY2VsZXJpc3F1ZSBtaSBTdXNwZW5kaXNzZSBzaXQgZG9sb3IgbmlzbCBtaSByaXN1cyB1bHRyaWNpZXMgY29tbW9kbyBzdXNjaXBpdCB2ZWwgbmVjIGZhdWNpYnVzIHZlbCBhdCBJbnRlZ2VyIE51bmMgYXVndWUgaXBzdW0gbmlzbCBzY2VsZXJpc3F1ZSBwcmV0aXVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNS0yMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNC0xMFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJ2aXZlcnJhIGp1c3RvIGVyb3NcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDM0ODQ4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJsYWN1cyBlcmF0IG1pIGlkIHByZXRpdW0gbW9sZXN0aWUgbWkgbWF1cmlzIHV0IGF1Z3VlIGZlcm1lbnR1bSBTZWQgYWxpcXVhbSBzZW0gdXQgc2VkIG1hdXJpcyBWZXN0aWJ1bHVtIG1vbGVzdGllIFF1aXNxdWUgcmlzdXMganVzdG8gbnVuYyBwaGFyZXRyYSB0aW5jaWR1bnQgYXJjdSBkb2xvciBsaWd1bGEgZWdldCBmZXVnaWF0IGZlcm1lbnR1bSBNYXVyaXMgZXUgYSBibGFuZGl0IHBlbGxlbnRlc3F1ZSByaXN1cyBDcmFzIGFkaXBpc2NpbmcgcGhhcmV0cmEgdmVsIHVsbGFtY29ycGVyIHZlbCBlZ2V0IGV1IGVnZXQgdmVoaWN1bGEgYWxpcXVldCBWZXN0aWJ1bHVtIGR1aSBxdWlzIGVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAyLTI2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEyLTIwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImZhdWNpYnVzIHRvcnF1ZW50IE1vcmJpIGFjY3Vtc2FuIG1ldHVzIGNvbnNlY3RldHVyIFV0IGVsaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxJbmZvcm1hdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0OTg0NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJEdWlzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJTZWQgbmVjIGxhb3JlZXQgYWMganVzdG8gY29tbW9kbyBlbGVtZW50dW0gU2VkIG5pYmggc2VkIGZhdWNpYnVzIHJpc3VzIFBoYXNlbGx1cyBEb25lYyBjdXJzdXMgY3Vyc3VzIG1ldHVzIGxpZ3VsYSBxdWlzIFNlZCBDcmFzIERvbmVjIHF1aXMgUGhhc2VsbHVzIFNlZCBWZXN0aWJ1bHVtIHRpbmNpZHVudCBwcmV0aXVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wOC0yM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMS0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwidXQgcG9ydHRpdG9yIHB1bHZpbmFyIG5lYyBoZW5kcmVyaXQgbWFnbmEgdHJpc3RpcXVlIG5lYyBlcm9zIGVsaXQgbGFvcmVldCBkaWFtIHNpdCBOdWxsYSBDcmFzIHJpc3VzIG5lYyBqdXN0byBzZW0gZ3JhdmlkYSBmYXVjaWJ1cyB2aXRhZSBuZWMgZmFjaWxpc2lzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1NzEwMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJudW5jXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzaXQgcHVsdmluYXIgZWxlaWZlbmQgc2l0IGdyYXZpZGEgdXQgYXVjdG9yIGFtZXQgc2FnaXR0aXMgdmVsaXQgc29sbGljaXR1ZGluIHRpbmNpZHVudCBhYyBkaWN0dW0gcXVhbSBldCBkaWN0dW0gYW1ldCBwaGFyZXRyYSBJbnRlZ2VyIGNvbW1vZG8gbGVvIGNvbmd1ZSB2aXRhZSBlbmltIHNvZGFsZXMgZGFwaWJ1cyBBZW5lYW4gb2RpbyByaXN1cyBDcmFzIGFtZXQgdGVtcHVzIGZhY2lsaXNpcyB1dCBvZGlvIG9ybmFyZSBJbiBlcm9zIGEgZXUgbmlzbCBzdXNjaXBpdCBmZXJtZW50dW0gbGl0b3JhIEluIGxhY3VzIGFkaXBpc2NpbmcgdXQgYWxpcXVldCBuaWJoIEN1cmFiaXR1ciB0ZWxsdXMgYWMgZmFjaWxpc2lzIEludGVnZXIgdHJpc3RpcXVlIG1hdXJpcyBuaXNpIGV1IGlkIGxvcmVtIERvbmVjIGVsaXQgc2VtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMC0wNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOS0wNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiY29uc2VjdGV0dXIgbWF1cmlzIG9kaW8gZGljdHVtIHB1bHZpbmFyIHVsdHJpY2llcyBhbWV0IE1hZWNlbmFzIGVnZXN0YXMgdXQgdG9ycXVlbnQgdm9sdXRwYXQgdmVzdGlidWx1bSBjb252YWxsaXMgcXVpcyBmZXJtZW50dW0gdGVsbHVzIFF1aXNxdWUgbGFvcmVldCBkaWFtIGVsaXQgYWMgYWRpcGlzY2luZyBsaWJlcm8gZWxpdCB0aW5jaWR1bnQgY29uc2VxdWF0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJUcmFuc3BvcnRDaGFyZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImVnZXQgZWxpdCBDdXJhYml0dXIgcG9ydGEgbnVsbGEgZnJpbmdpbGxhIGZyaW5naWxsYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNi0xMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAzLTEzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMixcclxuICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGlzcGF0Y2hcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIxLTAxLTMwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAxOS0wMi0yOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjAwNzkyMzYzNTg1MzQxODkxLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzaXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZ3JhdmlkYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wOC0wNVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTEwLTIyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJncm9zc01hc3NcIjogNDk1LjI2OTI4ODUzOTU0NixcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyVUNSXCI6IFwiZmV1Z2lhdCBjb25kaW1lbnR1bSBwb3N1ZXJlIGFtZXQgU1wiLFxyXG4gICAgICAgICAgICAgICAgXCJDb25zaWdub3JcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJjb25kaW1lbnR1bSBtZXR1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1Z3VlIHZvbHV0cGF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJFdGlhbSBkYXBpYnVzIEludGVnZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcIm1vbGVzdGllXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcInB1bHZpbmFyIGVsaXQgZW5pbSBsb2JvcnRpc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiSW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlc3QgYWNjdW1zYW4gdmVsIHZlbCBzZW1wZXIgZWdlc3RhcyBtZXR1cyBhIGVsZWlmZW5kIGVnZXN0YXMgaW4gY29uc2VxdWF0IHRpbmNpZHVudCBpZCBhbWV0IHNvY2lvc3F1IHVybmEgY29uZGltZW50dW0gTnVsbGFtIHNlZCB2ZWwgcHVsdmluYXIgbmVjIHR1cnBpcyB0dXJwaXMgdml0YWUgdHVycGlzIG1ldHVzIGZyaW5naWxsYSBWaXZhbXVzIFByYWVzZW50IG9ybmFyZSBkaWFtIGVyb3MgZWdldCBuZWMgYXQgc2VkIGF1Y3RvciBlZ2VzdGFzIHBvcnR0aXRvciBldSBmcmluZ2lsbGEgU3VzcGVuZGlzc2UgYWMgaW5jZXB0b3MgZWdldCBuZWMgc2l0IGhlbmRyZXJpdCBEb25lYyBRdWlzcXVlIHV0IGRhcGlidXMgc2l0IGVyYXQgbW9sZXN0aWUgZnJpbmdpbGxhIHN1c2NpcGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTItMjlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA0LTExVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGFjdFBlcnNvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRvcnF1ZW50IFNlZCBkdWkgZGlhbSBzaXQgdGVtcHVzIG5pYmggcG9ydGEgdmVsIHNlbXBlciBWaXZhbXVzIGdyYXZpZGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcImVyb3MgdmVzdGlidWx1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVNYWlsQWRkcmVzc1wiOiBcIm5pc2wgbWV0dXMgaXBzdW0gZmV1Z2lhdCB2ZWwgYWRpcGlzY2luZyBkYXBpYnVzIGludGVyZHVtIGxlbyB1bHRyaWNpZXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIkNvbnNpZ25lZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImNvbmRpbWVudHVtIERvbmVjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYSBDdXJhYml0dXIgbmlzaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RyZWV0QW5kTnVtYmVyXCI6IFwiYWNjdW1zYW4gc2VtIGFtZXQgdml0YWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcImRpYW0gZGlhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJ0ZWxsdXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibW9sbGlzIGlwc3VtIHF1aXMgdGVtcHVzIG51bGxhIHZpdGFlIGFjIHNhZ2l0dGlzIGluIGlwc3VtIEN1cmFiaXR1ciBkaWN0dW0gdm9sdXRwYXQgcGxhY2VyYXQgcGhhcmV0cmEgZWdldCB2ZXN0aWJ1bHVtIGxhY3VzIGdyYXZpZGEgbmVjIGFkaXBpc2NpbmcgaW4gTW9yYmkgbGVjdHVzIGxhb3JlZXQgdmVsIGNvbnNlcXVhdCBkb2xvciBzYXBpZW4gdWx0cmljaWVzIGhlbmRyZXJpdCBuaWJoIHF1aXMgZmFjaWxpc2lzIHRlbXBvciBwZWxsZW50ZXNxdWUgcXVpcyBTZWQgZmVsaXMgdG9ydG9yIHZlbCBkaWN0dW0gdWx0cmljaWVzIG5pYmggdGVsbHVzIHNjZWxlcmlzcXVlIGFkaXBpc2NpbmcgbGVvIGZldWdpYXQgQ3JhcyBsZWN0dXMgbWFzc2EgZXQgdmFyaXVzIGVnZXQgUHJhZXNlbnQgZmVsaXMgQ3VyYWJpdHVyIFBoYXNlbGx1cyBjb25kaW1lbnR1bSBsb3JlbSBhIGFkaXBpc2NpbmcgZGlhbSBwaGFyZXRyYSBhZGlwaXNjaW5nIE5hbSB2aXZlcnJhIGp1c3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTItMjBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTE0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsU3VwcGx5Q2hhaW5BY3RvclwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDQ3NzYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNpdCBlZ2VzdGFzIHNpdCBRdWlzcXVlIGV0IGFkaXBpc2NpbmcgbnVuYyB2aXRhZSBldSBuZWMgY29udmFsbGlzIGlwc3VtIHBvdGVudGkgc2l0IGNvbnNlY3RldHVyIGFjIGluIGp1c3RvIGFkaXBpc2NpbmcgdmVoaWN1bGEgdGVsbHVzIG9kaW8gc29sbGljaXR1ZGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDgtMTBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTA0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJlbGVpZmVuZCBwZWxsZW50XCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0MjUwOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFtZXQgbG9yZW0gdXQgdml2ZXJyYSBFdGlhbSB2b2x1dHBhdCBhbnRlIFByYWVzZW50IFBlbGxlbnRlc3F1ZSBhYyBwaGFyZXRyYSBjb25ndWUgZXN0IFByb2luIGNvbnNlcXVhdCBibGFuZGl0IFZpdmFtdXMgcG9ydHRpdG9yIHZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTAxLTA4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOS0xMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwibnVuYyBtYXNzYSBTZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIkRlcGFydHVyZVRyYW5zcG9ydE1lYW5zXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzQ2MTMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mSWRlbnRpZmljYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IDAuMDIwNTkyNjk0MDQwNjYzOSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJub24gdHVycGlzIHRlbXBvciBuZWMgcGVyIE51bGxhbSBwb3J0YSBzZW0gZXJvcyByaG9uY3VzIHNlZCBhZGlwaXNjaW5nIFNlZCBzZWQgc2l0IFNlZCBjb25ndWUgbG9ib3J0aXMgQ3JhcyBNYXVyaXMgYWNjdW1zYW4gdmVoaWN1bGEgYWxpcXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTExLTA4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0xMC0xMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiRXRpYW0gRHVpcyBjb252YWxsaXMgbGlndWxhIFZlc3RpYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDYtMjFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMjAtMDctMTNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjIwNDQyMDExMTcwMjk1MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJpbiBhZGlwaXNjaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDQtMTZUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAxLTIxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA0MjQ0NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZJZGVudGlmaWNhdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogMC4wOTA3NTU2ODY5OTc3ODc5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInN1c2NpcGl0IGF0IER1aXMgZHVpIGV1IG9kaW8gZ3JhdmlkYSBhbWV0IHF1aXMgcmhvbmN1cyBhbWV0IG1vbGVzdGllIHBsYWNlcmF0IE1hdXJpcyBqdXN0byBydXRydW0gZWdldCB2ZXN0aWJ1bHVtIHZlc3RpYnVsdW0gcmlzdXMgbW9sbGlzIGFtZXQgYSBjb25kaW1lbnR1bSBWZXN0aWJ1bHVtIHBvc3VlcmUgY29uZGltZW50dW0gbm9zdHJhIHZlbGl0IG1hc3NhIGhlbmRyZXJpdCBjb251YmlhIHV0IGlwc3VtIEZ1c2NlIFN1c3BlbmRpc3NlIFNlZCBhYyBjb21tb2RvIGhlbmRyZXJpdCBzb2RhbGVzIGFjY3Vtc2FuIGlkIE51bmMgdG9ycXVlbnQgdWx0cmljaWVzIG1ldHVzIGF0IGR1aSBncmF2aWRhIG5pYmggdXQgaWQgdWxsYW1jb3JwZXIgdG9ydG9yIGZldWdpYXQgTWF1cmlzIGV1aXNtb2QgbmliaCB0aW5jaWR1bnQgbGFjdXMgdGluY2lkdW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTAtMjBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAzLTMxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRlbnRpZmljYXRpb25OdW1iZXJcIjogXCJwbGFjZXJhdCB0ZW1wdXMgdmVsIGEgZXN0IG5vblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMTktMDEtMjlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMDEtMzBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAxOC4xOTY0MTc0NDYzMzk3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInNlbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkR1aXMgZmFjaWxpc2lzIHNlZCBQZWxsZW50ZXNxdWUgdXQgZGFwaWJ1cyBwaGFyZXRyYSBhZGlwaXNjaW5nIGRpYW0gdGVtcG9yIGVyb3MgZWdlc3RhcyByaG9uY3VzIGxvYm9ydGlzIGV0IG1pIHZlaGljdWxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDUtMDhUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTAyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzA5ODYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYmliZW5kdW0gcG9zdWVyZSBvcmNpIHZvbHV0cGF0IHZlbCB2ZXN0aWJ1bHVtIHNpdCBhbGlxdWV0IHNlbSBjb25zZXF1YXQgcnV0cnVtIHNlbSBOdW5jIG51bmMgbGlndWxhIEN1cmFiaXR1ciBlc3QgZWdldCB2ZWwgbW9sbGlzIHVsdHJpY2VzIGRpYW0gVml2YW11cyB0aW5jaWR1bnQgdmVoaWN1bGEgZXUgUHJhZXNlbnQgdGluY2lkdW50IGxhb3JlZXQgcHVsdmluYXIgVml2YW11cyB0ZW1wb3Igc2VkIEN1cmFiaXR1ciBtb2xsaXMgZmVybWVudHVtIGVnZXQgdHVycGlzIFNlZCB1dCBFdGlhbSB2ZWwgbGVjdHVzIGZhdWNpYnVzIGZldWdpYXQgZW5pbSBub24gcGVsbGVudGVzcXVlIHNlbSB2ZXN0aWJ1bHVtIHVsdHJpY2llcyBlbmltIGFjIHBsYWNlcmF0IGVyYXQgdmVsaXQgQ3VyYWJpdHVyIGhlbmRyZXJpdCBkdWkgZXJvcyBvZGlvIHV0IHNlbXBlciB2ZWwgaWQgdGVtcHVzIGlkIFBoYXNlbGx1cyBwZWxsZW50ZXNxdWUgb2RpbyBpbiBuaWJoIHNpdCBzZWQgaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMy0xN1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMDFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJtYXNzYSB2ZXN0aWJ1bHVtIFN1c3BlbmRpc3NlIGNvbW1vZG8gcmlzdXMgY29tbW9kb1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzkxNjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJxdWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiYXQgdmVzdGlidWx1bSBOdWxsYSBlc3QgcG9ydGEgcmlzdXMgbWF1cmlzIHBoYXJldHJhIHRvcnRvciBmcmluZ2lsbGEgaXBzdW0gYWNjdW1zYW4gYXVndWUgdHJpc3RpcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDUtMjVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA4LTE4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidWx0cmljaWVzIGdyYXZpZGEgdGluY2lkdW50IG5vbiBncmF2aWRhIG5lYyBuZWMgbm9uIGVyb3MgZXN0IG9kaW9cIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydERvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMzQ0NzgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic29kYWxlcyBwcmV0aXVtIHB1bHZpbmFyIFNlZCBhIG1pIGVsZWlmZW5kIGNvbnNlcXVhdCBibGFuZGl0IGVsZW1lbnR1bSBpZCBhbnRlIHNpdCBJbiB1dCBlc3QgbWkgbmliaCBzYXBpZW4gc2l0IHBoYXJldHJhIFN1c3BlbmRpc3NlIG1hdXJpcyB1bGxhbWNvcnBlciBwb3J0dGl0b3IgVXQgZmFjaWxpc2lzIGxhb3JlZXQgbW9sZXN0aWUgZmV1Z2lhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA5LTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNy0xMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInRlbXBvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjExODYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJxdWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiZXJhdCB0ZW1wb3IgRG9uZWMgYmxhbmRpdCBsZWN0dXMgdGVsbHVzIEV0aWFtIGlkIG51bGxhIHZpdGFlIE1hZWNlbmFzIGxhY3VzIHZlbCBmYWNpbGlzaXMgbnVsbGEgbmlzaSBuaWJoIHNhcGllbiBwcmV0aXVtIGxhY3VzIHNlZCBlbGVpZmVuZCB0ZWxsdXMgZWxpdCBhdWd1ZSB2ZXN0aWJ1bHVtIFV0IG9ybmFyZSBxdWlzIGluIHNpdCBhZGlwaXNjaW5nIGF1Z3VlIG1pIGVnZXQgZWxlbWVudHVtIGF0IHNlZCBtb2xlc3RpZSBDcmFzIGxpZ3VsYSB0dXJwaXMgdml0YWUgbW9sZXN0aWUgYXVjdG9yIHF1aXMgdXQgcG9ydHRpdG9yIHJpc3VzIGZhY2lsaXNpcyBsYWN1cyB0cmlzdGlxdWUgVXQgY29uZ3VlIG5pc2kgbGFvcmVldCBhYyBzZW1wZXIgUHJhZXNlbnQgbGFvcmVldCBhcHRlbnQgcHVsdmluYXIgZXQgYSBkaWFtIHN1c2NpcGl0IGVsZWlmZW5kIGFsaXF1YW0gbm9uIHV0IFBlbGxlbnRlc3F1ZSBub24gdmVzdGlidWx1bSBzYXBpZW4gY29udmFsbGlzIGxlbyB2ZWwgdGluY2lkdW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTEtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA0LTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZXN0IGNvbmd1ZSBpZCBtaSBDcmFzIHZlc3RpYnVsdW0gZXN0IGNvbmd1ZSBpbnRlcmR1bSBlc3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAyMDM0MixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIk51bmNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJwbGFjZXJhdCBub24ganVzdG8gYW1ldCBEb25lYyBhbGlxdWFtIHZlbCBmYWNpbGlzaXMgaGVuZHJlcml0IGp1c3RvIGlkIG51bGxhIGFtZXQgcXVhbSBQcm9pbiBwbGFjZXJhdCBwb3J0YSBQcm9pbiB2ZWwgUGhhc2VsbHVzIGVsaXQgbWFzc2EgdmVoaWN1bGEgVml2YW11cyBuaWJoIFZpdmFtdXMgaGltZW5hZW9zIFByYWVzZW50IGZhY2lsaXNpcyBmYWNpbGlzaXMgdHJpc3RpcXVlIHVybmEgcHJldGl1bSB2aXRhZSBOdWxsYW0gU2VkIFNlZCB2ZXN0aWJ1bHVtIE5hbSBlc3QgbWFzc2EgbmVjIHZpdGFlIG1hdXJpcyBzaXQgZmV1Z2lhdCBub3N0cmEgaWQgdWx0cmljaWVzIGFyY3UgcmhvbmN1cyBmYXVjaWJ1cyB2dWxwdXRhdGUgdmVsIGZlbGlzIGFtZXQgcXVpcyBwaGFyZXRyYSBQZWxsZW50ZXNxdWUgYW1ldCBtYXNzYSBjb25kaW1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAxLTE1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNS0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcImEgdXJuYSBlZ2V0XCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5ODEzMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJkYXBpYnVzIG1vbGxpcyB2b2x1dHBhdCBQcmFlc2VudCBvZGlvIHRlbXBvciBpbiB1cm5hIHBoYXJldHJhIGV1IFByYWVzZW50IGxhY3VzIGFjY3Vtc2FuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDUtMDJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAyLTE5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwidGVtcHVzIGF1Z3VlIGluIGEgYWMgbWkgbGFjdXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydENoYXJnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVzdGlidWx1bSBpZCBhZGlwaXNjaW5nIHV0IGNvbmRpbWVudHVtIHByZXRpdW0gRG9uZWMgbWF1cmlzIGVzdCBwb3J0YSBQcm9pbiBuaXNsIG5pYmggdGVtcHVzIHJob25jdXMgTnVsbGEgaW50ZXJkdW0gaGVuZHJlcml0IHNvZGFsZXMgaW50ZXJkdW0gZXUgc2VtcGVyIExvcmVtIGFtZXQgc2FwaWVuIGVnZXQgaW1wZXJkaWV0IHNlZCBRdWlzcXVlIEV0aWFtIERvbmVjIHZpdGFlIG51bGxhIGJsYW5kaXQgYW1ldCBmYXVjaWJ1cyBhbWV0IGFtZXQgbGlndWxhIE5hbSB2ZXN0aWJ1bHVtIGFkaXBpc2NpbmcgUHJhZXNlbnQgY29udmFsbGlzIGFtZXQgaWQgc2NlbGVyaXNxdWUgZG9sb3IgdWxsYW1jb3JwZXIgaWFjdWxpcyByaG9uY3VzIG5lYyBuZWMgZ3JhdmlkYSBhZGlwaXNjaW5nIGFjY3Vtc2FuIGlkIHF1aXMgc2VtIHB1bHZpbmFyIGxpZ3VsYSBub24gZXUgRG9uZWMgYWRpcGlzY2luZyByaXN1cyB2ZW5lbmF0aXMgTW9yYmkgaXBzdW0gY3Vyc3VzIG51bGxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wMi0yMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNS0xNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIkNvbnNpZ25tZW50SXRlbVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdvb2RzSXRlbU51bWJlclwiOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uR29vZHNJdGVtTnVtYmVyXCI6IDc0MTE5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2xhcmF0aW9uVHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcm9zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY3Vyc3VzIHNvbGxpY2l0dWRpbiB2ZWwgb2RpbyBkaWFtIHR1cnBpcyBhbWV0IHJob25jdXMgcXVhbSBkaWN0dW0gc2VtcGVyIGluIGRpY3R1bSBjb25zZWN0ZXR1ciBibGFuZGl0IHVsbGFtY29ycGVyIGV1IHZlbCBncmF2aWRhIHZhcml1cyBtb2xlc3RpZSBpbiBTZWQgTW9yYmkgbWV0dXMgZWdlc3RhcyBDdXJhYml0dXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNi0zMFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMzFUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEaXNwYXRjaFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA1LTMxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTA5LTMwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wMDAxMDg1NDcxNDYwMTY5ODcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidXJuYSBNb3JiaSBudWxsYSB2ZWwgc29kYWxlcyB2ZWhpY3VsYSB1dCB2ZWhpY3VsYSBhZGlwaXNjaW5nIGludGVyZHVtIGEgc2VkIG5pc2kgdGluY2lkdW50IHNhcGllbiB2aXRhZSBmYWNpbGlzaXMgZWxpdCBxdWFtIGVyYXQgY3Vyc3VzIGFjIHBlbGxlbnRlc3F1ZSBNYXVyaXMgRG9uZWMgY29uZGltZW50dW0gY29uZGltZW50dW0gYWNjdW1zYW4gbGlndWxhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDMtMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA0LTI4VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY291bnRyeU9mRGVzdGluYXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGNjRW50cnlEYXRlXCI6IFwiMjAxOS0wMy0yN1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJOY3RzRW50cnlEYXRlXCI6IFwiMjAyMC0wNi0wNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHZW9Ob21lbmNsYXR1cmVDb2RlXCI6IDAuMDAwMDcxOTAzMzQ5MTIwMTI0OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ291bnRyeVJlZ2ltZUNvZGVcIjogXCJzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0ZWxsdXMgYWRpcGlzY2luZyBwaGFyZXRyYSBuaWJoIHNlbXBlciBTdXNwZW5kaXNzZSBDcmFzIG1pIHVybmEgc2FnaXR0aXMgYXQgZHVpIHZlbGl0IG1pIGxlbyB0ZW1wb3IgbWkgYSBtb2xlc3RpZSBhbWV0IHRyaXN0aXF1ZSBlbGVpZmVuZCBuaXNsIGN1cnN1cyB2b2x1dHBhdCBlbGl0IHV0IGN1cnN1cyBTZWQgdmVuZW5hdGlzIGFyY3UgUGVsbGVudGVzcXVlIGRhcGlidXMgcG9zdWVyZSBlbGVpZmVuZCBBZW5lYW4gc2VkIHNlbSBldSBmZXVnaWF0IGRpYW0gRHVpcyBhdWd1ZSBoZW5kcmVyaXQgSW4gdGVtcG9yIGVuaW0gdHJpc3RpcXVlIExvcmVtIGVnZXQgc29kYWxlcyBlZ2V0IGV1aXNtb2QgY29uZGltZW50dW0ganVzdG8gdm9sdXRwYXQgY29tbW9kbyBub24gYmxhbmRpdCBWaXZhbXVzIE51bGxhIHNpdCBkaWduaXNzaW0gTnVuYyBqdXN0byBJbiBzYXBpZW4gU2VkIEV0aWFtIGNvbmRpbWVudHVtIGFjY3Vtc2FuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMTAtMzBUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTA0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyVUNSXCI6IFwiRXRpYW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtUHJpY2VFVVJcIjogNzkuODEyOTczMzA5MjIxMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb25zaWduZWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImVsaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZyaW5naWxsYSBjb25zZXF1YXQgdmVsIHR1cnBpcyB0ZW1wdXMgZnJpbmdpbGxhIGRpYW0gYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRyZXNzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0cmVldEFuZE51bWJlclwiOiBcIm9kaW8gc2VtcGVyIHZlc3RpYnVsdW0gbm9uIGFtZXQgdHJpc3RpcXVlIG5lYyBmZWxpcyBlZ2VzdGFzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0Y29kZVwiOiBcImFkIGxvYm9ydGlzIGFjIGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNpdHlcIjogXCJTZWQgZWxpdCBzaXQgdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaXBzdW0gYXVndWUgdmVzdGlidWx1bSBlbGl0IFBoYXNlbGx1cyBzaXQgcXVpcyBOdWxsYW0ganVzdG8gTnVuYyBhdWd1ZSBwZWxsZW50ZXNxdWUgZWdldCBhYyBjb25kaW1lbnR1bSB2aXRhZSB0b3JxdWVudCBub24gaXBzdW0gcmlzdXMgTnVsbGFtIHB1cnVzIHRlbGx1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMDVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDEtMjNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTY2MzIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlbGVtZW50dW0gTnVsbGFtIHV0IGNvbnNlcXVhdCBjb25kaW1lbnR1bSBTZWQgYW1ldCBoZW5kcmVyaXQgb3JjaSBwZWxsZW50ZXNxdWUgcG9ydGEgcXVpcyBzaXQgY29uc2VxdWF0IGZhdWNpYnVzIHNhcGllbiB2ZWwgUGVsbGVudGVzcXVlIGRpY3R1bSBpZCBWaXZhbXVzIFV0IHB1cnVzIFBlbGxlbnRlc3F1ZSBhIGFtZXQgZXN0IHZlc3RpYnVsdW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA0LTA5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAyLTI1VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwibm9uIFN1c3BlbmRpc3NlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAzNTMwNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJzaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInJpc3VzIHVsdHJpY2llcyB0aW5jaWR1bnQgRG9uZWMgQ3VyYWJpdHVyIHNhcGllbiBwaGFyZXRyYSBzZWQgY29uc2VxdWF0IHZlbCBhdWd1ZSBjb25ndWUgbGVjdHVzIEluIHZpdGFlIHRlbGx1cyBsaXRvcmEgdG9ydG9yIHVybmEgZmVsaXMgU2VkIGxpZ3VsYSBsaXRvcmEgUHJhZXNlbnQgc2FwaWVuIHNhZ2l0dGlzIGVsZWlmZW5kIHBlbGxlbnRlc3F1ZSBQcmFlc2VudCBqdXN0byBhbWV0IER1aXMgdmVzdGlidWx1bSBzaXQgbGFvcmVldCBhbWV0IHNhcGllbiBlc3Qgc2FwaWVuIG1hdXJpcyBpbiBsZW8gY29uc2VxdWF0IG1vbGVzdGllIGluIFBlbGxlbnRlc3F1ZSBhYyBuaXNpIHNlZCBlbmltIHB1bHZpbmFyIGEgdGVtcHVzIG9ybmFyZSB0b3J0b3IgRG9uZWMgaW4gdHJpc3RpcXVlIGZhY2lsaXNpcyB2aXRhZSBhbGlxdWFtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0xMi0yOVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNi0yOFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImFjY3Vtc2FuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvbk9mR29vZHNcIjogXCJtYXVyaXMgU2VkIGlkIFZpdmFtdXMgcXVhbSBxdWFtIGFkaXBpc2NpbmcgcmlzdXMgZXJvcyBmZXVnaWF0IGltcGVyZGlldCBxdWFtIHF1aXMgUXVpc3F1ZSB1dCBwb3N1ZXJlIG9ybmFyZSBjb25kaW1lbnR1bSBuZXF1ZSBQZWxsZW50ZXNxdWUgdXQgY29uZGltZW50dW0gbmlzaSBzYXBpZW4gY29uc2VxdWF0IHBlciBzZW1wZXIgcnV0cnVtIGZhdWNpYnVzIHJ1dHJ1bSBsaWd1bGEgaXBzdW0gZmFjaWxpc2lzIG51bGxhIEludGVnZXIgQ3VyYWJpdHVyIHV0IHNlbSBldCBTZWQgbW9sZXN0aWUgbWF1cmlzIFByYWVzZW50IGFtZXQgZXUgdml0YWUgc2l0IG1ldHVzIHRlbGx1cyByaXN1cyB0b3J0b3IgUGhhc2VsbHVzIG1hZ25hIGVyb3MgTnVsbGEgc2FwaWVuIFZlc3RpYnVsdW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3VzQ29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZmFjaWxpc2lzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInVsdHJpY2llcyBuZWMgcmhvbmN1cyBlZ2V0IENsYXNzIGJsYW5kaXQgZGljdHVtIHNhcGllbiBsb3JlbSB2ZWwgZmFjaWxpc2lzIGVyYXQgYWNjdW1zYW4gbW9sZXN0aWUgaWQgZWdlc3RhcyBEb25lYyB1bGxhbWNvcnBlciB2ZWwgYXVndWUgdXJuYSBzb2Npb3NxdSBjb25kaW1lbnR1bSBuZWMgVml2YW11cyBibGFuZGl0IGV0IHJob25jdXMgdmVzdGlidWx1bSBvZGlvIHNpdCBsaWd1bGEgZGljdHVtIGlkIG1vbGVzdGllIHBoYXJldHJhIE51bmMgdmVsIGVyYXQgZmV1Z2lhdCBuZWMgZXVpc21vZCBzZW0gZXVpc21vZCBwZWxsZW50ZXNxdWUgbWFzc2EgYXQgYSB2ZXN0aWJ1bHVtIGRpY3R1bSBzYXBpZW4gc2FnaXR0aXMgZXQgTWFlY2VuYXMgbG9yZW0gdG9ydG9yIGlkIG5pc2kgc2VkIHRlbXB1cyBncmF2aWRhIG51bGxhIG9yY2kgY29uZGltZW50dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDItMDJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wOS0wOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29tbW9kaXR5Q29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYXJtb25pc2VkU3lzdGVtU3ViSGVhZGluZ0NvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub3N0cmFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImxhY3VzIGVsZW1lbnR1bSBpbiB2dWxwdXRhdGUgbm9uIGNvbnNlcXVhdCBQcmFlc2VudCBhZGlwaXNjaW5nIGNvbmRpbWVudHVtIERvbmVjIHJpc3VzIGlwc3VtIGNvbnNlY3RldHVyIGZhdWNpYnVzIHBvcnRhIExvcmVtIGhlbmRyZXJpdCBlZ2VzdGFzIGJpYmVuZHVtIGhpbWVuYWVvcyBlZ2V0IGZlbGlzIHVsdHJpY2llcyBhdWd1ZSB2ZXN0aWJ1bHVtIG5vbiBQcm9pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTAtMzFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMTEtMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tYmluZWROb21lbmNsYXR1cmVDb2RlXCI6IFwiSW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hY2lvbmFsQ29kZVwiOiBcImlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJleGNpc2VHb29kc1F1YW50aXR5XCI6IDAuMDQ5Mzk5MDY0MjI0ODY0OVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGFuZ2Vyb3VzR29vZHNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA5NDIwNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVTk51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJvcmNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicGVsbGVudGVzcXVlIGludGVyZHVtIHB1bHZpbmFyIGN1cnN1cyBjb25ndWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNC0wNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDYtMTdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU4MTUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVOTnVtYmVyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJmYWNpbGlzaXMgdm9sdXRwYXQgdmVuZW5hdGlzIG5lYyB2ZXN0aWJ1bHVtIHVsbGFtY29ycGVyIGNvbmd1ZSByaXN1cyB2ZWxpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA0LTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNy0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR29vZHNNZWFzdXJlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdyb3NzTWFzc1wiOiAwLjQwMDk1NTEzMDk5ODQ5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmV0TWFzc1wiOiAyNDQuNDIxNDY5MTYxNDgzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3VwcGxlbWVudGFyeVVuaXRzXCI6IDMuMTM3NjkxNDU1NDkxNjhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQYWNrYWdpbmdcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjU2ODksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5lY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsIGNvbW1vZG8gYWRpcGlzY2luZyBzdXNjaXBpdCBBbGlxdWFtIEN1cmFiaXR1ciBtb2xsaXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTE3VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAxLTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogNzkxNTYyODUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwiaW50ZXJkdW0gQ3JhcyBvZGlvIG5vc3RyYSBQaGFzZWxsdXMgdml2ZXJyYSB1bHRyaWNpZXMgZWdldCBldCBOdWxsYSBRdWlzcXVlIGp1c3RvIEN1cmFiaXR1ciBwZWxsZW50ZXNxdWUgbm9uIEV0aWFtIG5pYmggZmV1Z2lhdCBtYWduYSBDdXJhYml0dXIgc2VtIGVnZXN0YXMgcHJldGl1bSBpcHN1bSBmZWxpcyBlZ2VzdGFzIHRpbmNpZHVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjU5OTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicG9zdWVyZSBpbXBlcmRpZXQgb2RpbyBjdXJzdXMgYW1ldCBsb2JvcnRpcyBDcmFzIGN1cnN1cyBWaXZhbXVzIG9yY2kgZGljdHVtIGV1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wMy0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wNS0xNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDI5NjA0MzEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGlwcGluZ01hcmtzXCI6IFwiSW4gc2VtcGVyIHZpdGFlIHRyaXN0aXF1ZSBhbWV0IGRhcGlidXMgZGljdHVtIHNjZWxlcmlzcXVlIHBlciBsZW8gdG9ydG9yIHNlbSB0dXJwaXMgcHVsdmluYXIgYWMgRG9uZWMgU3VzcGVuZGlzc2UgbWF1cmlzIHBsYWNlcmF0IGFtZXQgbmlzaSBjb25ndWUgZWdldCB2aXRhZSByaXN1cyBncmF2aWRhIGVnZXQgU3VzcGVuZGlzc2Ugc2VkIGdyYXZpZGEgdXQgb2RpbyB2ZWwgYWNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlByZXZpb3VzRG9jdW1lbnRcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNTEyNTYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiTnVuY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibm9uIHZpdGFlIGV1IERvbmVjIGFjIGFjIGNvbmd1ZSBtYXVyaXMgU3VzcGVuZGlzc2UgY29uZ3VlIER1aXMganVzdG9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTAxLTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA1LTMwVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInBlbGxlbnRlc3F1ZSBjb21tb2RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogODk1OTQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJFdGlhbSBjb252YWxsaXMgYWRpcGlzY2luZyB2ZWwgZWxlbWVudHVtIGNvbmRpbWVudHVtIG1hc3NhIGhlbmRyZXJpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMTFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDgtMjZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiA4MDQyNTk5NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lYXN1cmVtZW50VW5pdEFuZFF1YWxpZmllclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInVybmFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm5vc3RyYSBEb25lYyB2dWxwdXRhdGUgRXRpYW0gYmliZW5kdW0gVXQgZWxlbWVudHVtIHNpdCBhbGlxdWFtIFBoYXNlbGx1cyBzaXQgZG9sb3IgbGliZXJvIENyYXMgbWFnbmEgbmVjIG5lYyBncmF2aWRhIFV0IGFtZXQgY3Vyc3VzIGVuaW0gYWQgYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTEtMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDEtMTZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogMC4wMDA2NTgyMjM1MTI0MjMzMjksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNjY2OTMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicGVyIHF1aXMgbWV0dXMgYmliZW5kdW0gdml0YWUgcXVpcyBtb2xsaXMgcGhhcmV0cmEgcG9ydGEgU2VkIGZlbGlzIG9kaW8gZG9sb3IgbWV0dXMgcGhhcmV0cmEgUGVsbGVudGVzcXVlIG9kaW8gdmVsaXQgbWV0dXMgRG9uZWNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTEwLTI1VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTEwLTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcIm5pYmggcXVhbSBlbGVtZW50dW0gY3Vyc3VzIHNhcGllbiB2ZWwgc2VtIHZlaGljdWxhIGVsZW1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDgxMjc4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicG9ydHRpdG9yIGR1aSBlcm9zIG1ldHVzIHZlc3RpYnVsdW0gYW1ldCB1bGxhbWNvcnBlciBsYWN1cyBEdWlzIGVnZXQgcXVhbSBxdWlzIGRpY3R1bSB2ZW5lbmF0aXMgdHJpc3RpcXVlIGF0IG5lYyBzYXBpZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA3LTI4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA4LTE2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMTQ0MjY1MTQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaWJoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJmZXJtZW50dW0gQ3JhcyBmYXVjaWJ1cyBjb21tb2RvIGdyYXZpZGEgc29kYWxlcyBkaWFtIGFjIGFtZXQgRG9uZWMgcmlzdXMgYWMgY29udmFsbGlzIHZlbGl0IGEgY29udWJpYSBxdWFtIG5lYyB1bHRyaWNpZXMgc29kYWxlcyBzY2VsZXJpc3F1ZSBVdCBwdWx2aW5hciBzdXNjaXBpdCByaXN1cyBwcmV0aXVtIGNvbW1vZG8gcXVhbSBlc3QgbmliaCBJbiBOdW5jIHRvcnRvciBzaXQgZW5pbSBzZW0gbmliaCBwdWx2aW5hciBkaWN0dW0gQWxpcXVhbSBwcmV0aXVtIGVsaXQgU2VkIG5pc2wgdmVsIGxhb3JlZXQgcmlzdXMgYWNjdW1zYW4gTnVsbGEgcXVhbSBzZWQgYWRpcGlzY2luZyBuaXNsIGNvbnViaWEgQWVuZWFuIGFtZXQgbmVjIGlwc3VtIG9kaW8gZWxlbWVudHVtIGFsaXF1ZXQgdGluY2lkdW50IGNvbnNlcXVhdCBzYXBpZW4gdGVsbHVzIGFjIHZlbCBjb251YmlhIHZpdGFlIHByZXRpdW0gYWNjdW1zYW4gdXQgc2FwaWVuIG5lcXVlIG1hc3NhIHF1aXMgc2VtIGV1IGVnZXQgdG9ydG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMi0zMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wOC0yNlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiOiAwLjUzMjAwNDM0MzU5MzQ5NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBsZW1lbnRPZkluZm9ybWF0aW9uXCI6IFwic2VtcGVyIGFudGUgaW4gcHVsdmluYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlN1cHBvcnRpbmdEb2N1bWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2NTUwNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaXNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJlcmF0IGV0IGlkIHZlaGljdWxhIG5pc2kgaW4gdmVsIE1hZWNlbmFzIHBoYXJldHJhIHNlZCBqdXN0byB2dWxwdXRhdGUgdmVsIGV0IHZlc3RpYnVsdW0gZWxpdCBsYW9yZWV0IG5lYyBwb3J0dGl0b3IgY29uZGltZW50dW0gcXVpcyBhYyB1cm5hIHZhcml1cyBzdXNjaXBpdCBQZWxsZW50ZXNxdWUgdmFyaXVzIFZpdmFtdXMgYSBwdWx2aW5hciB2aXRhZSBFdGlhbSBWZXN0aWJ1bHVtIGVnZXQgdXJuYSBlcmF0IFF1aXNxdWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAyLTIwVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTAyLTEyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcIm5lYyBsZWN0dXMgcGhhcmV0cmEgYXVndWUgbW9sZXN0aWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogNjc5OTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInVybmFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDgzMzg3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInF1aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkluIHNhcGllbiBjb25zZXF1YXQgdmVsaXQgYXVndWUgc2VkIHRlbGx1cyBxdWlzIGV1IGxhb3JlZXQgZXJhdCBxdWlzIGFjY3Vtc2FuIGZlcm1lbnR1bSBzaXQgZmV1Z2lhdCBNYXVyaXMgYWNjdW1zYW4gbWFnbmEgcXVhbSBkaWN0dW0gcG9zdWVyZSBlZ2V0IHZvbHV0cGF0IEN1cmFiaXR1ciBzYWdpdHRpcyBTZWQgYXJjdSBibGFuZGl0IHRlbXB1cyBjb25kaW1lbnR1bSBkYXBpYnVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNS0yNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNy0wMVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJpbiBNYXVyaXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogMTc2NzQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcImVnZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxSZWZlcmVuY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTY4MTgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwic2l0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzZW0gb3JuYXJlIFBlbGxlbnRlc3F1ZSBRdWlzcXVlIFZlc3RpYnVsdW0gZ3JhdmlkYSBtYXVyaXMgYWNjdW1zYW4gU2VkIGFsaXF1ZXQgc2l0IHNpdCBwdWx2aW5hciBwb3J0YSBwcmV0aXVtIGVyYXQgdmVzdGlidWx1bSBmYWNpbGlzaXMgaGVuZHJlcml0IHN1c2NpcGl0IHRlbXBvciB2ZXN0aWJ1bHVtIGhlbmRyZXJpdCBWaXZhbXVzIENyYXMgbWFnbmEgdmVzdGlidWx1bSBDbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDYtMDlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTItMzBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwicG9ydHRpdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4MTAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInZlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibmVjIGVsZWlmZW5kIG1vbGxpcyBncmF2aWRhIGV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNi0xMVQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJjb21tb2RvIEluIFV0IGluIHBlbGxlbnRlc3F1ZSBuZWMgcXVpcyBhbnRlIHZlbGl0IGNvbW1vZG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZGl0aW9uYWxJbmZvcm1hdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA1MDcwNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJqdXN0byBsb2JvcnRpcyB0ZW1wb3IgdmVsIGp1c3RvIG5lYyBpbiB2b2x1dHBhdCBxdWFtIGluIHBvc3VlcmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTEwLTE4VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA1LTA2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJqdXN0byBzdXNjaXBpdCB0ZW1wdXMgQ2xhc3MgYWMgcGVsbGVudGVzcXVlIHZ1bHB1dGF0ZSB0aW5jaWR1bnQgZGlhbSBuaXNsIHZlbCB2aXRhZSBkaWN0dW0gRG9uZWMgZWdldCBjb21tb2RvIHZpdGFlIGxhb3JlZXQgZWxpdCB0dXJwaXMgcmlzdXMgbmVjIG5lYyBsaWd1bGEgRG9uZWMgbm9zdHJhIHZpdGFlIHNpdCBzZW0gZGFwaWJ1cyBuZWMgYWMgcG9ydGEgdml2ZXJyYSB1bHRyaWNpZXMgcGhhcmV0cmEgc2VtIHZpdmVycmEgdmVoaWN1bGEgbmVxdWUgZnJpbmdpbGxhIGV1aXNtb2QgdmVuZW5hdGlzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4MzUwNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvZGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJQcm9pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiY29uc2VjdGV0dXIgYWRpcGlzY2luZyBDdXJhYml0dXIgaWQgZXJvcyBlZ2V0IER1aXMgdWx0cmljaWVzIEludGVnZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAxLTMxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA0LTA0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJsb2JvcnRpcyBwcmV0aXVtIG5vbiBzb2RhbGVzIHZlbCB2dWxwdXRhdGUgaW4gb3JjaSBDdXJhYml0dXIgaWQgaW4gaGltZW5hZW9zIHNlbSB1dCB0dXJwaXMgc2l0IGNvbmRpbWVudHVtIHNvZGFsZXMgUHJhZXNlbnQgbGVvIG9ybmFyZSB0b3J0b3IgYWQgZWdldCBsYWN1cyBJbnRlZ2VyIHZlbGl0IGZhY2lsaXNpcyBRdWlzcXVlIHZ1bHB1dGF0ZSBlcmF0IGFudGUgb2RpbyBwdWx2aW5hciBpZCBTZWQgUHJhZXNlbnQgYXVndWUgc2l0IHNvY2lvc3F1IGFtZXQgQWxpcXVhbSBjb25zZXF1YXQgbGVjdHVzIHNlbSBxdWlzIGhpbWVuYWVvcyBlbGl0IGNvbW1vZG8gdml2ZXJyYSBhYyBzZW1wZXIgZGlhbSBsb3JlbSBhYyBwb3J0dGl0b3IgUGhhc2VsbHVzIGxvYm9ydGlzIHN1c2NpcGl0IGF1Z3VlIHZlbCBlbGl0IGVnZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRyYW5zcG9ydENoYXJnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RPZlBheW1lbnRcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicHVsdmluYXIgZWxpdCBpcHN1bSBJbiBjb25zZXF1YXQgYWMgc2FwaWVuIHZlbCBub24gdm9sdXRwYXQgbGFjdXMgdG9ydG9yIG9kaW8gZ3JhdmlkYSBudWxsYSBsaWJlcm8gb2RpbyBtYXNzYSBtYXVyaXMgb2RpbyBwaGFyZXRyYSB1dCBsaWd1bGEgVml2YW11cyBlZ2V0IHB1cnVzIGFjIGF0IHByZXRpdW0gZmF1Y2lidXMgdmVoaWN1bGEgbWF1cmlzIGVsaXQgYW1ldCBub24gUGhhc2VsbHVzIGVnZXQgZWdldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0xMi0xM1QyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAyLTI0VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvbkdvb2RzSXRlbU51bWJlclwiOiA4NjkzMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNsYXJhdGlvblR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiZWxpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImZlbGlzIENyYXMgZXJvcyBhY2N1bXNhbiB2ZWwgdmVsaXQgdGVsbHVzIFBlbGxlbnRlc3F1ZSBQZWxsZW50ZXNxdWUgaXBzdW0gdGVtcHVzIGRpZ25pc3NpbSBhIGRhcGlidXMgdm9sdXRwYXQgYW50ZSBjb25zZWN0ZXR1ciB1dCBMb3JlbSBlZ2V0IGFkaXBpc2NpbmcgZXUgaXBzdW0gbWkganVzdG8gYWxpcXVldCBhY2N1bXNhbiBzb2Npb3NxdSBhbWV0IGV1IGZlcm1lbnR1bSBtYXNzYSBQaGFzZWxsdXMgc2VkIG1vbGVzdGllIG5pc2kgcHJldGl1bSB2ZWwgdGFjaXRpIGxlY3R1cyBwbGFjZXJhdCBpYWN1bGlzIE51bmMgc2FwaWVuIE51bGxhbSBub24ganVzdG8gaW50ZXJkdW0gYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA0LTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wNC0wMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlPZkRpc3BhdGNoXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImV1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRjY0VudHJ5RGF0ZVwiOiBcIjIwMjEtMDUtMjRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmN0c0VudHJ5RGF0ZVwiOiBcIjIwMTktMTEtMzBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR2VvTm9tZW5jbGF0dXJlQ29kZVwiOiAwLjA4NzI2MjQ0NTkxNTE0NjksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvdW50cnlSZWdpbWVDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic2VtIGFtZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOC0wNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDYtMjBUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5T2ZEZXN0aW5hdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUY2NFbnRyeURhdGVcIjogXCIyMDIwLTA2LTE0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5jdHNFbnRyeURhdGVcIjogXCIyMDE5LTA1LTAzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdlb05vbWVuY2xhdHVyZUNvZGVcIjogMC4wODI5OTAwMzg3NTk1MzYxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb3VudHJ5UmVnaW1lQ29kZVwiOiBcInBlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIkRvbmVjIGluIGFtZXQgZmV1Z2lhdCBwb3N1ZXJlIHB1bHZpbmFyIG1hZ25hIG5pc2kgbWF1cmlzIHV0IGVnZXQgdmVsaXQgcXVpcyBFdGlhbSBzaXQgQWxpcXVhbSBNb3JiaSBtYXNzYSBhbWV0IHF1aXMgcG9zdWVyZSBhbGlxdWV0IGhlbmRyZXJpdCBuaWJoIERvbmVjIGdyYXZpZGEgZWxpdCBDdXJhYml0dXIgbW9sZXN0aWUgQ3VyYWJpdHVyIG1hdXJpcyBlcmF0IG5lYyBlcm9zIGVyYXQgZGlhbSBwcmV0aXVtIHRpbmNpZHVudCB0cmlzdGlxdWUgZWxlbWVudHVtIFZpdmFtdXMgYXVndWUgc2VtIGEgYXQgaW50ZXJkdW0gYWNjdW1zYW4gc2VtcGVyIHVsdHJpY2VzIGVnZXN0YXMgbmVjIG9yY2kgbWF1cmlzIG1hdXJpcyB2aXRhZSBpbiBxdWFtIHNhZ2l0dGlzIGZlcm1lbnR1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTA2LTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNi0xOVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclVDUlwiOiBcIm5lYyBuZWMgdnVscHV0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbVByaWNlRVVSXCI6IDAuMDAwMjA5MTI1ODY3Njc2NTE0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnNpZ25lZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiYW1ldCBjb25zZXF1YXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImR1aSBsb2JvcnRpcyBzYXBpZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJlZXRBbmROdW1iZXJcIjogXCJEb25lYyB2ZWwganVzdG8gZmF1Y2lidXMgdmVsIFF1aXNxdWUgcXVhbSBtZXR1cyBncmF2aWRhIG9yY2lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBvc3Rjb2RlXCI6IFwidXQgdmVzdGlidWx1bVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcInJ1dHJ1bSBzaXQgZmVsaXMgZGljdHVtIGdyYXZpZGEgbWFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvdW50cnlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwic29kYWxlcyBOdWxsYW0gRG9uZWMgZmF1Y2lidXMgYWQgZmF1Y2lidXMgZGFwaWJ1cyBhZCBhbWV0IG5lYyB2aXRhZSBpbXBlcmRpZXQgY29uZGltZW50dW0gc3VzY2lwaXQgZmVybWVudHVtIG5lYyB1cm5hIHBlbGxlbnRlc3F1ZSBDdXJhYml0dXIgcHJldGl1bSBhZGlwaXNjaW5nIHZlbCBtYXR0aXMgZWxlaWZlbmQgdG9ydG9yIHVybmEgc2l0IGVsaXQgbWkgbGFjdXMgbm9uIEFlbmVhbiB1bGxhbWNvcnBlciBtZXR1cyBjb21tb2RvIGVnZXQgaGVuZHJlcml0IG5lYyB0ZWxsdXMgc2l0IG1hc3NhIHJob25jdXMgbWFzc2EgTnVsbGFtIGxhb3JlZXQgbmliaCBsYWN1cyBpbXBlcmRpZXQgdGVsbHVzIGxlbyBjb25ndWUgYXQgZXJvcyBhdWN0b3IgcG9ydHRpdG9yIFByb2luIGxpZ3VsYSBmZWxpcyBhYyBsZW8gZWxlaWZlbmQgbGFjaW5pYSBldSBzYXBpZW4gU2VkIE1hdXJpcyBjb25zZWN0ZXR1clwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDktMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDgtMjJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFN1cHBseUNoYWluQWN0b3JcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNDY0NDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyb2xlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiU2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2ZWxpdCBhY2N1bXNhbiBqdXN0byBlbGl0IGVsaXQgcXVhbSB2ZWwgdmVuZW5hdGlzIHJob25jdXMgRG9uZWMgbG9ib3J0aXMgYW1ldCBhYyBhZGlwaXNjaW5nIGZlbGlzIGdyYXZpZGEgbWFzc2EgdXJuYSBkaWN0dW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIxLTAxLTE5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTExLTE3VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkZW50aWZpY2F0aW9uTnVtYmVyXCI6IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA4NDY1NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJub25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInNvbGxpY2l0dWRpbiBNYXVyaXMgZXJvcyBzb2RhbGVzIGVyYXQgb2RpbyBtb2xlc3RpZSBlZ2V0IHNvbGxpY2l0dWRpbiByaXN1cyB2ZWxpdCBzYWdpdHRpcyBOdW5jIHZlc3RpYnVsdW0gYWNjdW1zYW4gZXJvcyBlcm9zIHZlaGljdWxhIENyYXMgdHJpc3RpcXVlIHZlbCB1dCB0cmlzdGlxdWUgcmhvbmN1cyB1dCBvcm5hcmUgZGFwaWJ1cyB1dCBlbGVtZW50dW0gU2VkIHR1cnBpcyB0b3JxdWVudCBhdWd1ZSByaXN1cyBzZWQgdG9ydG9yIGFjY3Vtc2FuIFBlbGxlbnRlc3F1ZSBkaWN0dW0gbm9uIEZ1c2NlIGVyYXQgTnVsbGEgcGVsbGVudGVzcXVlIGFjIGZldWdpYXQgbWV0dXMgbGFvcmVldCB1cm5hIHNlbXBlciBqdXN0byB1bHRyaWNpZXMgaW50ZXJkdW0gTnVsbGFtIGZldWdpYXQgbmVjIGFkaXBpc2NpbmcgdXQgZWxlaWZlbmQgbGlndWxhIHRlbXB1cyB2ZWhpY3VsYSBhbWV0IG5pc2kgbGFjdXMgYWRpcGlzY2luZyB2ZXN0aWJ1bHVtIHF1aXMgdm9sdXRwYXQgc29sbGljaXR1ZGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMS0wNy0xNFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMS0wMS0yMlQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZGVudGlmaWNhdGlvbk51bWJlclwiOiBcImNvbnViaWFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbW1vZGl0eVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uT2ZHb29kc1wiOiBcImxhb3JlZXQgYSBwZWxsZW50ZXNxdWUgcmlzdXMgSW50ZWdlciBudWxsYSBkYXBpYnVzIE51bmMgbmVjIHBvcnR0aXRvciByaXN1cyBzaXQgZXJvcyBldCBlcm9zIHRhY2l0aSBudW5jIHZhcml1cyBWZXN0aWJ1bHVtIE51bmMgc2VkIE51bGxhIHBvc3VlcmUgaWQgcmlzdXMgaWQgcGxhY2VyYXQgYSBsZW8gYXQgdWx0cmljZXMgbm9uIHF1aXMgc29sbGljaXR1ZGluIG5vbiBwb3J0YSBTZWQgc2l0IG5pYmggTG9yZW0gY29uZGltZW50dW0gUXVpc3F1ZSBhdCBEdWlzIGxlbyBNb3JiaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXNDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJmcmluZ2lsbGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiRXRpYW0gZWdlc3RhcyBlc3QgdnVscHV0YXRlIHVsdHJpY2llcyBldCBmZWxpcyBmZXVnaWF0IHZpdGFlIHNhZ2l0dGlzIHNpdCBpbiBQcmFlc2VudCB1dCB1bHRyaWNpZXMgRXRpYW0gbm9uIE1hdXJpcyBhY2N1bXNhbiBtYXVyaXMgTnVsbGEgbWkgdmVoaWN1bGEgUHJhZXNlbnQgZnJpbmdpbGxhIG5vbiBsZW8gbGVvIHZpdGFlIENyYXMgQWVuZWFuIGNvbnNlcXVhdCB2aXZlcnJhIEV0aWFtIHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wOC0wMlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTAxLTIxVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb21tb2RpdHlDb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImhhcm1vbmlzZWRTeXN0ZW1TdWJIZWFkaW5nQ29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInRlbGx1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidmVsIGFtZXQgdGVtcG9yIHVsbGFtY29ycGVyIHZ1bHB1dGF0ZSBmYWNpbGlzaXMgZnJpbmdpbGxhIHR1cnBpcyBhbWV0IGR1aSBldSB0ZW1wb3IgbGVjdHVzIGNvbnNlY3RldHVyIG5lYyBub24gTnVuYyBub24gbW9sZXN0aWUgZXJhdCBhY2N1bXNhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMjNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMTAtMDJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tYmluZWROb21lbmNsYXR1cmVDb2RlXCI6IFwiZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hY2lvbmFsQ29kZVwiOiBcImFjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJleGNpc2VHb29kc1F1YW50aXR5XCI6IDAuNjMyNzgyMTE0OTY0MzQzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEYW5nZXJvdXNHb29kc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU1MjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVU5OdW1iZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwibmliaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZlbGl0IGF1Z3VlIE1hZWNlbmFzIHBvc3VlcmUgY29uZGltZW50dW0gbGlndWxhIG5pYmgganVzdG8gYXB0ZW50IExvcmVtIGN1cnN1cyB0ZWxsdXMgZXN0IG5lYyBlbGVtZW50dW0gaWQgZGljdHVtIGRvbG9yIGVsaXQgZmVsaXMgSW4gb2RpbyB2ZWhpY3VsYSB2ZWwgc29sbGljaXR1ZGluIG5lYyBhbWV0IHN1c2NpcGl0IHBoYXJldHJhIHV0IGxlbyBuaXNsIGF0IERvbmVjIHV0IENyYXMgY29uZGltZW50dW0gSW50ZWdlciBhY2N1bXNhbiBlZ2V0IHRlbXB1cyBhbWV0IFByYWVzZW50IGVyYXQgcG90ZW50aSBzZWQgdXJuYSBvZGlvIHRhY2l0aSBmYXVjaWJ1cyBibGFuZGl0IG1hZ25hIHZlaGljdWxhIG1ldHVzIHVsbGFtY29ycGVyIFNlZCBoZW5kcmVyaXQgdGluY2lkdW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDctMjdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA3LTEzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiAxODQ5NyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVTk51bWJlclwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaWJoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwibnVuYyByaG9uY3VzIHRpbmNpZHVudCBlcmF0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDEtMDdUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA2LTAyVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHb29kc01lYXN1cmVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3Jvc3NNYXNzXCI6IDAuMDQ1OTc2MzE2NDM4MDQ1NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5ldE1hc3NcIjogNjAuMzM5MDk0NDQ3MTI5OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1cHBsZW1lbnRhcnlVbml0c1wiOiAwLjAyNjg2MDE1Nzk3MTY3MDlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQYWNrYWdpbmdcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMjQ1ODMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInB1bHZpbmFyIER1aXMgcnV0cnVtIHBoYXJldHJhIGFjIHZ1bHB1dGF0ZSB2aXRhZSBjb25kaW1lbnR1bSBwaGFyZXRyYSBtZXR1cyBNYWVjZW5hcyBuZXF1ZSBmZXJtZW50dW0gY29udWJpYSBzYXBpZW4gdGluY2lkdW50IHNlbSBhY2N1bXNhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDktMTJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDctMDNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibnVtYmVyT2ZQYWNrYWdlc1wiOiAyNjA5NDE3NSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNoaXBwaW5nTWFya3NcIjogXCJlbGl0IFV0IHByZXRpdW0gZW5pbSBzaXQgYW1ldCBDdXJhYml0dXIgYSBFdGlhbSBzZW0gdmVuZW5hdGlzIG9yY2kgbWV0dXMgcmlzdXMgc2l0IHNjZWxlcmlzcXVlIHRvcnF1ZW50IHRlbGx1cyBmZXJtZW50dW0gbm9uIGFjY3Vtc2FuIHRvcnF1ZW50IFZpdmFtdXMgdmVzdGlidWx1bSBub24gRG9uZWMgcmhvbmN1cyBtYXVyaXMgc2VtIHBoYXJldHJhIFN1c3BlbmRpc3NlIGJpYmVuZHVtIGVsaXQgdHVycGlzIGV1IER1aXMgc2l0IGVnZXN0YXMgbG9ib3J0aXMgYXVjdG9yIHRyaXN0aXF1ZSBzZW1wZXIgZ3JhdmlkYSBuaWJoIHNlZCB2dWxwdXRhdGUgY29tbW9kbyBtYXVyaXMgZmVybWVudHVtIE1hdXJpcyBmZXJtZW50dW0gZGlhbSBQcm9pbiBwaGFyZXRyYSBldSBwb3J0YSBpcHN1bSBuZWMgdWx0cmljZXMgY29tbW9kbyBqdXN0byBlcm9zIEludGVnZXIgYSBhbnRlIGxlbyB0ZWxsdXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDExMjc0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiaWQgdmVsIGVnZXQgUXVpc3F1ZSBuaXNsIHV0IGNvbnZhbGxpcyBpZCBlc3QgYmliZW5kdW0gdm9sdXRwYXQgQWVuZWFuIHF1YW0gc2FwaWVuIHF1YW0gQ3JhcyBtYXVyaXMgdXJuYSBwZWxsZW50ZXNxdWUgYWNjdW1zYW4gRG9uZWMgU2VkIGVzdCBlZ2VzdGFzIFByYWVzZW50IGxlY3R1cyB2ZWhpY3VsYSBsb3JlbSBkb2xvciBwdXJ1cyBldCBuZWMgZGlnbmlzc2ltIE51bGxhbSBxdWFtIHZlbmVuYXRpcyBkaWN0dW0gZGlhbSBRdWlzcXVlIHByZXRpdW0gZWdldCBwdWx2aW5hciBzaXQgaXBzdW0gY29uc2VjdGV0dXIgY29uZ3VlIGFjIGF1Z3VlIGFkaXBpc2NpbmcgZWdldCBxdWFtIHNhcGllbiBOYW0gbGVvIGlkIHVsbGFtY29ycGVyIGluY2VwdG9zIG1pIEV0aWFtIEFlbmVhbiB1bHRyaWNlcyB2aXRhZSByaG9uY3VzIHNjZWxlcmlzcXVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNC0xOFQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAyMC0wOC0wNVQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJudW1iZXJPZlBhY2thZ2VzXCI6IDYzNzgyMTEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdNYXJrc1wiOiBcIm1hdXJpcyBlcm9zIGFtZXQgZmFjaWxpc2lzIFBlbGxlbnRlc3F1ZSBtZXR1cyBzdXNjaXBpdCBmYXVjaWJ1cyBQcmFlc2VudCBzZW0gU2VkIHRpbmNpZHVudCB2ZXN0aWJ1bHVtIGNvbnZhbGxpcyBmZWxpcyBkaWN0dW0gTnVsbGEgdmVsIGFudGUgb3JuYXJlIGNvbnNlY3RldHVyIG1pIGVnZXN0YXMgdXQgc2VkIGZhY2lsaXNpcyBzdXNjaXBpdCBDcmFzIGNvbnNlY3RldHVyIFF1aXNxdWUgdmVsIHB1bHZpbmFyIGVnZXQgVml2YW11cyBEdWlzIHBvcnRhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQcmV2aW91c0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDMxNTIxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkNyYXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFyY3UgZmV1Z2lhdCBwdWx2aW5hciBhcmN1IGZldWdpYXQgZGljdHVtIG1vbGxpcyBqdXN0byB0ZW1wb3Igc2NlbGVyaXNxdWUgYW1ldCBJbnRlZ2VyIE5hbSBpZCB1dCBlZ2VzdGFzIHZpdGFlIGV1IE51bmMgbm9uIFZlc3RpYnVsdW0gYW1ldCBpYWN1bGlzIHN1c2NpcGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAxOS0wNi0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wMi0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJuZWMgc2l0IGFyY3UgUGVsbGVudGVzcXVlIG5lYyBtYXNzYSBDcmFzIHRvcnRvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ29vZHNJdGVtTnVtYmVyXCI6IDg4MDU4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZU9mUGFja2FnZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJ2ZWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImltcGVyZGlldCBJbiB1dCBtYXNzYSBlcmF0IG9kaW8gbmVjIGZlcm1lbnR1bSBOdW5jIHZlaGljdWxhIGxlbyBqdXN0byBJbiBlbGl0IG1hdHRpcyBpcHN1bSBkaWN0dW0gU2VkIFByYWVzZW50IGxhb3JlZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA2LTE2VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDE5LTA0LTI2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogMzAyNDg4MjQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJuaXNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2dWxwdXRhdGUgdm9sdXRwYXQgbmlzbCB2YXJpdXMgbmlzaSBzZW0gZHVpIGNvbmRpbWVudHVtIHZlc3RpYnVsdW0gRXRpYW0gdmVsIGRpY3R1bSB1cm5hIHR1cnBpcyBlZ2V0IHNvY2lvc3F1IENyYXMgZmFjaWxpc2lzIHN1c2NpcGl0IHZpdGFlIGVnZXQgZWdldCBmZXVnaWF0IHVsbGFtY29ycGVyIGlwc3VtIGluIGVnZXN0YXMgdWx0cmljaWVzIGluIGxvcmVtIHVsdHJpY2llcyBtb2xsaXMgY29uc2VjdGV0dXIgZmV1Z2lhdCBtYXNzYSBpZCByaXN1cyBQcmFlc2VudCB1dCBkaWduaXNzaW0gc29sbGljaXR1ZGluIHJpc3VzIGVnZXN0YXMgU3VzcGVuZGlzc2UgbWV0dXMgYWRpcGlzY2luZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMTAtMjlUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMjdUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIjogMC42MDI1MjE0NjQ5NzQ4NjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcInVsdHJpY2VzIHZlaGljdWxhIGVsZWlmZW5kIHRlbGx1c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogMTI3NDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwiYW1ldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwicGxhY2VyYXQgYWMgbm9uIGZhdWNpYnVzIG1vbGxpcyBiaWJlbmR1bSBzZW1wZXIgbGVvIEV0aWFtIG5pc2wgZWdldCBuaWJoIGxpYmVybyBlbGl0IHZlbCBhIGNvbnNlcXVhdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDgtMDJUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDEtMDZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwibmVjIHJob25jdXMgc2l0IENyYXMgdWx0cmljaWVzIHZpdGFlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJnb29kc0l0ZW1OdW1iZXJcIjogNzg1NTksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlT2ZQYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIm5vblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwidGVsbHVzIHZlbmVuYXRpcyBhdCBlbGl0IHRpbmNpZHVudCBwb3J0YSBlZ2VzdGFzIG5pYmggdHJpc3RpcXVlIGxlY3R1cyBjb25kaW1lbnR1bSBOdWxsYW0gY29uZGltZW50dW0gb2RpbyBDcmFzIGRhcGlidXMgbG9yZW0gc3VzY2lwaXQgb3JjaSBlcmF0IGNvbnNlY3RldHVyIG5lYyBlcm9zIGxhb3JlZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTExLTI5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTA0LTI5VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm51bWJlck9mUGFja2FnZXNcIjogNTY5ODk3MzEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWFzdXJlbWVudFVuaXRBbmRRdWFsaWZpZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJlcm9zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJuaXNpIGFtZXQgbmVjIE1vcmJpIGZhdWNpYnVzIGVyYXQgZWdldCBwb3J0dGl0b3Igc2VtIGVnZXQgdGluY2lkdW50IHRlbGx1cyBwaGFyZXRyYSBhbGlxdWFtIGRvbG9yIEN1cmFiaXR1ciB2dWxwdXRhdGUgdmVsIHNpdCBRdWlzcXVlIHZlbGl0IG9kaW8gaGVuZHJlcml0IGxhb3JlZXQgdnVscHV0YXRlIHRlbXBvciBjb21tb2RvIE51bGxhbSBtb2xlc3RpZSBuZWMgc2VtIGFjIHNpdCBDcmFzIGZldWdpYXQgY29tbW9kbyBhIHZ1bHB1dGF0ZSBTZWQgc2FwaWVuIGVzdCBBbGlxdWFtIGRhcGlidXMgY29uZ3VlIG9kaW8gYXVndWUgYXJjdSByaG9uY3VzIHNpdCBpbiBsaWd1bGFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA3LTA5VDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIwLTAyLTA2VDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCI6IDQuNjM4MDg1NDUxMjc0MjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcIlF1aXNxdWUgcnV0cnVtIGVnZXN0YXMgZmV1Z2lhdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU3VwcG9ydGluZ0RvY3VtZW50XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDE2OTE2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcIkNyYXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcImFudGUgdGluY2lkdW50IGEgTmFtIGRhcGlidXMgdGVtcHVzIGVnZXN0YXMgZWxpdCBlbmltIFZpdmFtdXMgZWxlbWVudHVtIHBoYXJldHJhIGFtZXQgUHJvaW4gbGVvIHBlbGxlbnRlc3F1ZSBpcHN1bSBhdWN0b3IgZWxpdCBsZW8gZnJpbmdpbGxhIExvcmVtIGxlbyBzb2RhbGVzIGluIG5pc2kgZWdlc3RhcyBuZWMgZmVybWVudHVtIGFjIGJsYW5kaXQgdmVzdGlidWx1bSBtb2xsaXMgc3VzY2lwaXQgcG9ydHRpdG9yIHNhcGllblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjEtMDYtMTRUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDUtMDNUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZWxlaWZlbmQgUHJhZXNlbnQgaWQgYSBuaXNpIGV1IER1aXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50TGluZUl0ZW1OdW1iZXJcIjogNzc2ODUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wbGVtZW50T2ZJbmZvcm1hdGlvblwiOiBcImFkaXBpc2NpbmcgYW1ldCBsb2JvcnRpcyBkb2xvciBhYyBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDMzMzUzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcImVyYXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIm1ldHVzIE1hZWNlbmFzIEN1cmFiaXR1ciBmZWxpcyBzdXNjaXBpdCBjb25ndWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDE5LTA4LTAxVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkVG9cIjogXCIyMDIxLTA5LTAzVDIyOjM3OjQ0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZmVyZW5jZU51bWJlclwiOiBcInNhZ2l0dGlzIGlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudExpbmVJdGVtTnVtYmVyXCI6IDYyOTcwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGxlbWVudE9mSW5mb3JtYXRpb25cIjogXCJhdWd1ZSBzb2xsaWNpdHVkaW4gdXQgZXJvc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkaXRpb25hbFJlZmVyZW5jZVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXF1ZW5jZU51bWJlclwiOiA2NjU4MyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhbWV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ2dWxwdXRhdGUgdGVtcG9yIGp1c3RvIGFjY3Vtc2FuIG1ldHVzIGVsaXQgdHJpc3RpcXVlIG1hdXJpcyBhcmN1IFBoYXNlbGx1cyBydXRydW0gY29uc2VxdWF0IHNvZGFsZXMgaWQgdmVsaXQgdGVtcHVzIGNvbmd1ZSBkdWkgZWxpdCBzb2RhbGVzIGVzdCB2b2x1dHBhdCBhdCBtaSBtYXVyaXMgcXVpcyBvZGlvIGZhdWNpYnVzIGVnZXQgc2l0IHNlbSBpbXBlcmRpZXQgdGVtcG9yIHNpdCBmZXJtZW50dW0gZWdldCB2ZXN0aWJ1bHVtIG5pc2kgc2VkIHB1cnVzIGxlY3R1cyBhbWV0IGhpbWVuYWVvcyBuaXNpIFN1c3BlbmRpc3NlIGNvbmd1ZSB2YXJpdXMgaWQgcHVsdmluYXIgdmVsIEluIEZ1c2NlIHV0IG1hZ25hIEluIEFsaXF1YW0gZXJhdCBsaWd1bGEgc2VkIGxhY3VzIHBvcnRhIExvcmVtIG1hc3NhIHZlbCBlZ2VzdGFzIGVyYXQgcXVhbSB2ZWwgbGlndWxhIGVsaXQgdGVtcHVzIHVsdHJpY2llcyBldSBxdWlzIGluIG1ldHVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRGcm9tXCI6IFwiMjAyMC0wMi0yNlQyMjozNzo0NFpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZFRvXCI6IFwiMjAxOS0wNy0wNFQyMjozNzo0NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWZlcmVuY2VOdW1iZXJcIjogXCJzZW0gdXQgdGVtcHVzIGdyYXZpZGEgTWFlY2VuYXMgTWFlY2VuYXMgc2FwaWVuIGFwdGVudCBNYWVjZW5hc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogNzc1NzUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJ0dXJwaXMgYWxpcXVhbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDItMTVUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMTktMDgtMTJUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlTnVtYmVyXCI6IFwiZWxlaWZlbmQgZmFjaWxpc2lzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZGRpdGlvbmFsSW5mb3JtYXRpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VxdWVuY2VOdW1iZXJcIjogOTE4NjksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlXCI6IFwidmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJsZW8gaWQgdWx0cmljZXMgbWFnbmEgc2FnaXR0aXMgQ2xhc3Mgc2FnaXR0aXMgdnVscHV0YXRlIHNvZGFsZXMgYXJjdSBEdWlzIGFkaXBpc2NpbmcgaW4gdm9sdXRwYXQgZmF1Y2lidXMgYXVjdG9yIG1hc3NhIHV0IHV0IHRyaXN0aXF1ZSBzYXBpZW4gdGFjaXRpIHNhcGllbiB0aW5jaWR1bnQgZWxpdCBkaWN0dW0gQ3JhcyBlc3QgdmVzdGlidWx1bSBEb25lYyBwZWxsZW50ZXNxdWUgc2VtIG1pIG51bGxhIGRvbG9yIGFjY3Vtc2FuIHNpdCBOdW5jIGVsZW1lbnR1bSBpcHN1bSBmZXJtZW50dW0gY29tbW9kbyBwb3J0dGl0b3IgdXJuYSBtaSBkaWN0dW0gYW1ldCBmYWNpbGlzaXMgZmVybWVudHVtIGRpYW0gRG9uZWMgbmlzaSBxdWFtIERvbmVjIE1hZWNlbmFzIG1hc3NhIER1aXMgZXJvcyBmZWxpcyBpZCBtb2xsaXMgVXQgbGlndWxhIGVyb3MgSW4gcmlzdXMgb2RpbyBjb25zZWN0ZXR1ciBlcm9zIHNvbGxpY2l0dWRpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMTktMDktMDNUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMjZUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk1vcmJpIGFjIG5pc2wgcGhhcmV0cmEgU2VkIGVnZXN0YXMgZWxlaWZlbmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcXVlbmNlTnVtYmVyXCI6IDU1ODg3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29kZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29kZVwiOiBcInJpc3VzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJzaXQgdmVzdGlidWx1bSBDbGFzcyBhYyBRdWlzcXVlIHNpdCB2ZWwgZ3JhdmlkYSBtYWduYSBhdWN0b3IgbWkgdml0YWUgcGVsbGVudGVzcXVlIHVsdHJpY2VzIGNvbW1vZG8gYmxhbmRpdCBhcmN1IHBoYXJldHJhIHBvcnRhIHZlbCBjb25zZXF1YXQgcmhvbmN1cyBhdWd1ZSBFdGlhbSBlbGl0IGlwc3VtIENyYXMgYW50ZSByaG9uY3VzIHZhcml1cyB2ZWwgdmVsIGlwc3VtIFF1aXNxdWUgbmliaCBmZXVnaWF0IGEgdHJpc3RpcXVlIGxhb3JlZXQgYWQgSW4gdGluY2lkdW50IGV0IHNpdCBjb25zZXF1YXQgcHVydXMgZXUgZGljdHVtIGFudGUgbmVjIG5pc2wgZWdlc3RhcyB1dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlZhbGlkRnJvbVwiOiBcIjIwMjAtMDctMDFUMjI6Mzc6NDRaXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjAtMDMtMjhUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcInZlaGljdWxhIHNpdCB2ZXN0aWJ1bHVtIGRhcGlidXMgRG9uZWMgcmlzdXMgZXN0IHBoYXJldHJhIGF1Y3RvciBxdWlzIGVsaXQgcHJldGl1bSBQZWxsZW50ZXNxdWUgUGVsbGVudGVzcXVlIHJpc3VzIHZlbCBzZW0gbG9yZW0gdGluY2lkdW50IGV1IGFjIHNhcGllbiBqdXN0byBuZWMgc2FwaWVuIGNvbmd1ZSBpZCBhcHRlbnQgZnJpbmdpbGxhIG9kaW8gYWMgZXJvcyBmZXJtZW50dW0gZWdlc3RhcyBhbnRlIHJpc3VzIEludGVnZXIgdmVoaWN1bGEgZGljdHVtIGlkIHNpdCBmYWNpbGlzaXMgbmlzaSBtb2xsaXMgdHJpc3RpcXVlIGZlcm1lbnR1bSBhYyBpbXBlcmRpZXQgaGVuZHJlcml0IERvbmVjIGFjIGVsaXQgRHVpcyBpYWN1bGlzIHNpdCBkYXBpYnVzIGNvbW1vZG8gbWFnbmEgdml0YWUgcGVsbGVudGVzcXVlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJUcmFuc3BvcnRDaGFyZ2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kT2ZQYXltZW50XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVcIjogXCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcInZpdmVycmEgdHVycGlzIGEgdml0YWUgZmVybWVudHVtIGV1IEN1cmFiaXR1ciBuZWMgYXQgdG9ydG9yIGlwc3VtIFNlZCBhbGlxdWV0IHBlbGxlbnRlc3F1ZSByaXN1cyBxdWlzIHZlbGl0IHZhcml1cyBtb2xlc3RpZSBlcmF0IGlkIE51bmMgaW50ZXJkdW0ganVzdG8gQ3JhcyBuaXNpIGV0IGJsYW5kaXQgc3VzY2lwaXQgUHJvaW4gbm9uIGxlY3R1cyBmYXVjaWJ1cyBjb21tb2RvIG1hdHRpcyBzZW1wZXIgbm9uIHNpdCBldSBmYXVjaWJ1cyBOdWxsYSB1cm5hIGNvbmRpbWVudHVtIHZlc3RpYnVsdW0ganVzdG8gU3VzcGVuZGlzc2UgcHVsdmluYXIgaGltZW5hZW9zIGxhb3JlZXQgdXQgcnV0cnVtIGVsZWlmZW5kIGVsaXQgdGVsbHVzIGRpYW0gQ3VyYWJpdHVyIHRvcnRvciBwdXJ1cyBjb25kaW1lbnR1bSBlZ2V0IGV1IHRlbXB1cyBjdXJzdXMgc29sbGljaXR1ZGluIHNpdCB1cm5hIGZhdWNpYnVzIG1ldHVzIERvbmVjIGVyYXQgYW1ldCBlZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJWYWxpZEZyb21cIjogXCIyMDIwLTA2LTExVDIyOjM3OjQ0WlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFsaWRUb1wiOiBcIjIwMjEtMDYtMTVUMjI6Mzc6NDRaXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSk7IiwiIl19
