(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeclarationWrapper_1 = require("./DeclarationWrapper");
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
},{"./DeclarationWrapper":2,"./logError":3}],2:[function(require,module,exports){
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
},{"./logError":3,"lodash":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logError(errMessage) {
    if (console && console.error && typeof window !== 'undefined') {
        console.error(errMessage);
    }
}
exports.logError = logError;
},{}],4:[function(require,module,exports){

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9BcGkudHMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9EZWNsYXJhdGlvbldyYXBwZXIudHMiLCJOY3RzQXBpL1RyYW5zaXREZWNsYXJhdGlvbi9sb2dFcnJvci50cyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLDJEQUEwRDtBQUMxRCx1Q0FBc0M7QUFFdEM7SUFHSTtRQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxxQkFBTyxHQUFkO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDakMsQ0FBQztJQUVNLHNCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzlCLENBQUM7SUFFTSxtQkFBSyxHQUFaO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDakMsQ0FBQztJQUVNLHNCQUFRLEdBQWYsVUFBZ0IsSUFBc0I7UUFDbEMsSUFBSTtZQUNBLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsbUJBQVEsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQ2xFLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVNLG9CQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTSxvQkFB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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBEZWNsYXJhdGlvbldyYXBwZXIgfSBmcm9tIFwiLi9EZWNsYXJhdGlvbldyYXBwZXJcIjtcclxuaW1wb3J0IHsgbG9nRXJyb3IgfSBmcm9tIFwiLi9sb2dFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwaSBpbXBsZW1lbnRzIElEaXNwb3NhYmxlIHtcclxuICAgIHByaXZhdGUgZGVjbGFyYXRpb246IERlY2xhcmF0aW9uV3JhcHBlcnx1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNWYWx1ZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmRlY2xhcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcm9tSnNvbihhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IG5ldyBEZWNsYXJhdGlvbldyYXBwZXIoYXJncy5qc29uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24gQVBJIG9iamVjdCBtZXRob2QgZnJvbUpzb24gZmFpbGVkLmApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pzb24oKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnRvSnNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IG5ldyBEZWNsYXJhdGlvbldyYXBwZXIoJ3t9Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmRlY2xhcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkZXIoKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldEhlYWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIb3VzZUNvbnNpZ25tZW50TGlzdCgpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uZ2V0SG91c2VDb25zaWdubWVudExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5nZXRIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25zaWdubWVudEl0ZW1MaXN0KGFyZ3M6IHsgc2VxdWVuY2VOdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbUxpc3QoYXJncy5zZXF1ZW5jZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbShhcmdzOiB7IGhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlcjogbnVtYmVyLCBnb29kc0l0ZW1OdW1iZXI6IG51bWJlciB9KTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldENvbnNpZ25tZW50SXRlbShhcmdzLmhvdXNlQ29uc2lnbm1lbnRTZXF1ZW5jZU51bWJlciwgYXJncy5nb29kc0l0ZW1OdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRIZWFkZXIoYXJnczogeyBqc29uOiBzdHJpbmcgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5zZXRIZWFkZXIoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnNldEhvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudChhcmdzOiB7IGpzb246IHN0cmluZyB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmFwcGVuZE5ld0hvdXNlQ29uc2lnbm1lbnQoYXJncy5qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlSG91c2VDb25zaWdubWVudChhcmdzOiB7IHNlcXVlbmNlTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVIb3VzZUNvbnNpZ25tZW50KGFyZ3Muc2VxdWVuY2VOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uc2V0Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwganNvbjogc3RyaW5nIH0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjbGFyYXRpb24uYXBwZW5kTmV3Q29uc2lnbm1lbnRJdGVtKGFyZ3MuaG91c2VDb25zaWdubWVudFNlcXVlbmNlTnVtYmVyLCBhcmdzLmpzb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb25zaWdubWVudEl0ZW0oYXJnczogeyBob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXI6IG51bWJlciwgZ29vZHNJdGVtTnVtYmVyOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5yZW1vdmVDb25zaWdubWVudEl0ZW0oYXJncy5ob3VzZUNvbnNpZ25tZW50U2VxdWVuY2VOdW1iZXIsIGFyZ3MuZ29vZHNJdGVtTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGF0YUZvck5hdlRyZWUoKTogc3RyaW5nfG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmdldERhdGFGb3JOYXZUcmVlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgdmFyIGRlZmluZTogRnVuY3Rpb247ICAgLy8gQHR5cGVzL3JlcXVpcmVqcyBjb2xsaWRlcyB3aXRoIEB0eXBlcy9ub2RlXHJcbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZGVmaW5lKCgpID0+IEFwaSk7XHJcbn0iLCJpbXBvcnQgeyBsb2dFcnJvciB9IGZyb20gXCIuL2xvZ0Vycm9yXCI7XHJcblxyXG5jb25zdCBfOiBfLkxvRGFzaFN0YXRpYyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5fIDogcmVxdWlyZSgnbG9kYXNoJykpO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY2xhcmF0aW9uV3JhcHBlciB7XHJcbiAgICBwcml2YXRlIG9iajogSURlY2xhcmF0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihqc29uOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm9iaiA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlYWRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaiwgdGhpcy5jcmVhdGVTa2lwUmVwbGFjZXIoJ0hvdXNlQ29uc2lnbm1lbnQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhvdXNlQ29uc2lnbm1lbnRMaXN0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudCB8fCBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRMaXN0OiBJSG91c2VDb25zaWdubWVudFJvd1tdID0gbGlzdC5tYXAoKHZhbHVlOiBJSG91c2VDb25zaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VxdWVuY2VOdW1iZXI6IHZhbHVlLnNlcXVlbmNlTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlTnVtYmVyVUNSOiB2YWx1ZS5yZWZlcmVuY2VOdW1iZXJVQ1IsXHJcbiAgICAgICAgICAgICAgICBncm9zc01hc3M6IHZhbHVlLmdyb3NzTWFzcyxcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25vck5hbWU6IHZhbHVlLkNvbnNpZ25vcj8ubmFtZSxcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25tZW50SXRlbXNDb3VudDogdmFsdWUuQ29uc2lnbm1lbnRJdGVtPy5sZW5ndGhcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodHJhbnNmb3JtZWRMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIG51bGwgaWYgdGhlcmUgaXMgbm8gaG91c2VDb25zaWdubWVudCB3aXRoIGdpdmVuIGluZGV4XHJcbiAgICBwdWJsaWMgZ2V0SG91c2VDb25zaWdubWVudChoY0luZGV4OiBudW1iZXIpOiBzdHJpbmd8bnVsbCB7XHJcbiAgICAgICAgY29uc3QgaGMgPSB0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdO1xyXG4gICAgICAgIGlmIChoYykge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaGMsIHRoaXMuY3JlYXRlU2tpcFJlcGxhY2VyKCdDb25zaWdubWVudEl0ZW0nKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgbnVsbCBpZiB0aGVyZSBpcyBubyBob3VzZUNvbnNpZ25tZW50IHdpdGggZ2l2ZW4gaW5kZXhcclxuICAgIHB1YmxpYyBnZXRDb25zaWdubWVudEl0ZW1MaXN0KGhjSW5kZXg6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBjb25zdCBoYyA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV07XHJcbiAgICAgICAgaWYgKCFoYykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBoYz8uQ29uc2lnbm1lbnRJdGVtIHx8IFtdO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkTGlzdDogSUNvbnNpZ25tZW50SXRlbVJvd1tdID0gbGlzdC5tYXAoKHZhbHVlOiBJQ29uc2lnbm1lbnRJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBnb29kc0l0ZW1OdW1iZXI6IHZhbHVlLmdvb2RzSXRlbU51bWJlcixcclxuICAgICAgICAgICAgICAgIGNvbnNpZ25lZU5hbWU6IHZhbHVlLkNvbnNpZ25lZT8ubmFtZSxcclxuICAgICAgICAgICAgICAgIGNvdW50cnlPZkRlc3RpbmF0aW9uOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbiA/IHtcclxuICAgICAgICAgICAgICAgICAgICBDb2RlOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbi5Db2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiB2YWx1ZS5jb3VudHJ5T2ZEZXN0aW5hdGlvbi5EZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uVHlwZTogdmFsdWUuZGVjbGFyYXRpb25UeXBlID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIENvZGU6IHZhbHVlLmRlY2xhcmF0aW9uVHlwZS5Db2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiB2YWx1ZS5kZWNsYXJhdGlvblR5cGUuRGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VOdW1iZXJVQ1I6IHZhbHVlLnJlZmVyZW5jZU51bWJlclVDUlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodHJhbnNmb3JtZWRMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIG51bGwgaWYgdGhlcmUgaXMgbm8gY29uc2lnbm1lbnQgaXRlbSBmb3IgZ2l2ZW4gaW5kZXhlc1xyXG4gICAgcHVibGljIGdldENvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGNpSW5kZXg6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcclxuICAgICAgICBjb25zdCBjaSA9IHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFtoY0luZGV4IC0gMV0/LkNvbnNpZ25tZW50SXRlbVtjaUluZGV4IC0gMV07XHJcbiAgICAgICAgcmV0dXJuIGNpID8gSlNPTi5zdHJpbmdpZnkoY2kpIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SGVhZGVyKGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld09iajogSURlY2xhcmF0aW9uID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICAgICAgaWYgKG5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqLkNvbnNpZ25tZW50ID0gbmV3T2JqLkNvbnNpZ25tZW50IHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgbmV3T2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgPSB0aGlzLm9iaj8uQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vYmogPSBuZXdPYmo7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgVHJhbnNpdERlY2xhcmF0aW9uLnNldEhlYWRlciBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bCBvciBmYWxzZSBpZiBpdCB3YXNuJ3RcclxuICAgIHB1YmxpYyBzZXRIb3VzZUNvbnNpZ25tZW50KGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhjOiBJSG91c2VDb25zaWdubWVudCA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgICAgIGlmICghKF8uaXNGaW5pdGUoaGMuc2VxdWVuY2VOdW1iZXIpICYmIGhjLnNlcXVlbmNlTnVtYmVyID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24uc2V0SG91c2VDb25zaWdubWVudCBlcnJvcjogUGFyYW1ldGVyIGRvZXMgbm90IGNvbnRhaW4gdmFsaWQgc2VxdWVuY2UgbnVtYmVyLmApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaGMuc2VxdWVuY2VOdW1iZXIgLSAxO1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50IHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCB8fCBbXTtcclxuICAgICAgICAgICAgaGMuQ29uc2lnbm1lbnRJdGVtID0gdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtpbmRleF0/LkNvbnNpZ25tZW50SXRlbTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtpbmRleF0gPSBoYztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBUcmFuc2l0RGVjbGFyYXRpb24uc2V0SG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZE5ld0hvdXNlQ29uc2lnbm1lbnQoanNvbjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGM6IElIb3VzZUNvbnNpZ25tZW50ID0gSlNPTi5wYXJzZShqc29uKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50ID0gdGhpcy5vYmouQ29uc2lnbm1lbnQgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBoY0xlbmd0aCA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFtoY0xlbmd0aF0gPSBoYztcclxuICAgICAgICAgICAgdGhpcy5maXhIY1NlcXVlbmNlTnVtYmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgYXBwZW5kTmV3SG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUhvdXNlQ29uc2lnbm1lbnQoaGNJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqLkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudC5zcGxpY2UoaGNJbmRleCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXhIY1NlcXVlbmNlTnVtYmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBsb2dFcnJvcihgcmVtb3ZlSG91c2VDb25zaWdubWVudCBlcnJvcjogJHtlcnJ9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsIG9yIGZhbHNlIGlmIGl0IHdhc24ndFxyXG4gICAgcHVibGljIHNldENvbnNpZ25tZW50SXRlbShoY0luZGV4OiBudW1iZXIsIGpzb246IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghKF8uaXNGaW5pdGUoaGNJbmRleCkgJiYgaGNJbmRleCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dFcnJvcihgc2V0Q29uc2lnbm1lbnRJdGVtIGVycm9yOiBIb3VzZUNvbnNpZ25tZW50IGluZGV4IHBhcmFtZXRlciBpcyBzdXBwb3NlZCB0byBiZSBhIHBvc2l0aXZlIG51bWJlciBidXQgaXQgaXMgXCIke2hjSW5kZXh9XCJgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY2k6IElDb25zaWdubWVudEl0ZW0gPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgICAgICBjb25zdCBjaUluZGV4ID0gY2kuZ29vZHNJdGVtTnVtYmVyO1xyXG4gICAgICAgICAgICBpZiAoIShfLmlzRmluaXRlKGNpSW5kZXgpICYmIGNpSW5kZXggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoYHNldENvbnNpZ25tZW50SXRlbSBlcnJvcjogZ29vZHNJdGVtTnVtYmVyIGlzIHN1cHBvc2VkIHRvIGJlIGEgcG9zaXRpdmUgbnVtYmVyIGJ1dCBpdCBpcyBcIiR7Y2lJbmRleH1cImApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB6ZXJvSGNJbmRleCA9IGhjSW5kZXggLSAxO1xyXG4gICAgICAgICAgICBjb25zdCB6ZXJvQ2lJbmRleCA9IGNpSW5kZXggLSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQgPSB0aGlzLm9iai5Db25zaWdubWVudCB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudCA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQgfHwgW107XHJcbiAgICAgICAgICAgIHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbSA9IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnRbemVyb0hjSW5kZXhdLkNvbnNpZ25tZW50SXRlbSB8fCBbXTtcclxuICAgICAgICAgICAgdGhpcy5vYmouQ29uc2lnbm1lbnQuSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0uQ29uc2lnbm1lbnRJdGVtW3plcm9DaUluZGV4XSA9IGNpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBzZXRDb25zaWdubWVudEl0ZW0gZXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0oaGNJbmRleDogbnVtYmVyLCBqc29uOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjaTogSUNvbnNpZ25tZW50SXRlbSA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGhjID0gdGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG91c2VDb25zaWdubWVudCB3aXRoIGluZGV4ICR7aGNJbmRleH0gZG9lcyBub3QgZXhpc3RgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoYy5Db25zaWdubWVudEl0ZW0gPSBoYy5Db25zaWdubWVudEl0ZW0gfHwgW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaUxlbmd0aCA9IGhjLkNvbnNpZ25tZW50SXRlbS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGhjLkNvbnNpZ25tZW50SXRlbVtjaUxlbmd0aF0gPSBjaTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZml4SGNTZXF1ZW5jZU51bWJlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpeEdvb2RzSXRlbU51bWJlcihoY0luZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBhcHBlbmROZXdDb25zaWdubWVudEl0ZW0gZXJyb3I6ICR7ZXJyfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb25zaWdubWVudEl0ZW0oaGNJbmRleDogbnVtYmVyLCBjaUluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmouQ29uc2lnbm1lbnQ/LkhvdXNlQ29uc2lnbm1lbnRbaGNJbmRleCAtIDFdPy5Db25zaWdubWVudEl0ZW1bY2lJbmRleCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2hjSW5kZXggLSAxXS5Db25zaWdubWVudEl0ZW0uc3BsaWNlKGNpSW5kZXggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZml4R29vZHNJdGVtTnVtYmVyKGhjSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nRXJyb3IoYHJlbW92ZUNvc2lnbm1lbnRJdGVtIGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pzb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREYXRhRm9yTmF2VHJlZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRyaW1tZWRIYyA9IF8ubWFwKHRoaXMub2JqLkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50IHx8IFtdLCAoaGM6IElIb3VzZUNvbnNpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gXy5tYXAoaGMuQ29uc2lnbm1lbnRJdGVtIHx8IFtdLCAoY2k6IElDb25zaWdubWVudEl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7ICdjaUluZGV4JzogY2kuZ29vZHNJdGVtTnVtYmVyIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4geyAnaGNJbmRleCc6IGhjLnNlcXVlbmNlTnVtYmVyLCBDb25zaWdubWVudEl0ZW06IGl0ZW1zIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0cmltbWVkSGMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHJlcGxhY2VyIGZ1bmN0aW9uIGZvciBKU09OLnN0cmluZ2lmeSB0aGF0IHdpbGwgb21pdCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhdHROYW1lIGNoaWxkIGJ1dCBpZiB0aGVyZSBpcyBtb3JlLCBsZWF2ZXMgdGhlIHJlc3QuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlU2tpcFJlcGxhY2VyKGF0dE5hbWU6IHN0cmluZyk6IChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55IHtcclxuICAgICAgICBsZXQgc2tpcCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChza2lwICYmIGtleSA9PT0gYXR0TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgc2tpcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBzZXF1ZW5jZU51bWJlciBvZiBhbGwgSG91c2VDb25zaWdubWVudHMgdG8gYmUgYW4gaW5jcmVtZW50YWwgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBmaXhIY1NlcXVlbmNlTnVtYmVyKCkge1xyXG4gICAgICAgIGlmIChfLmlzQXJyYXkodGhpcy5vYmo/LkNvbnNpZ25tZW50Py5Ib3VzZUNvbnNpZ25tZW50KSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLkNvbnNpZ25tZW50LkhvdXNlQ29uc2lnbm1lbnQubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W2ldLnNlcXVlbmNlTnVtYmVyID0gaSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGdvb2RzSXRlbU51bWJlciBvZiBhbGwgQ29uc2lnbm1lbnRJdGVtcyBpbiBnaXZlbiBIb3VzZUNvbnNpZ25tZW50IHRvIGJlIGFuIGluY3JlbWVudGFsIHNlcXVlbmNlXHJcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGhjSW5kZXggSW5kZXggb2YgSG91c2VDb25zaWdubWVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGZpeEdvb2RzSXRlbU51bWJlcihoY0luZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB6ZXJvSGNJbmRleCA9IGhjSW5kZXggLSAxO1xyXG5cclxuICAgICAgICBpZiAoXy5pc0FycmF5KHRoaXMub2JqPy5Db25zaWdubWVudD8uSG91c2VDb25zaWdubWVudFt6ZXJvSGNJbmRleF0/LkNvbnNpZ25tZW50SXRlbSkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XS5Db25zaWdubWVudEl0ZW0ubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iai5Db25zaWdubWVudC5Ib3VzZUNvbnNpZ25tZW50W3plcm9IY0luZGV4XS5Db25zaWdubWVudEl0ZW1baV0uZ29vZHNJdGVtTnVtYmVyID0gaSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IoZXJyTWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmVycm9yICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJNZXNzYWdlKTtcclxuICAgIH1cclxufSIsIiJdfQ==
