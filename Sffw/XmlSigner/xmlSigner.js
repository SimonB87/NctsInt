"use strict";
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var xmlSigner;
        (function (xmlSigner) {
            var XmlSigner = /** @class */ (function () {
                function XmlSigner(_datacontext, args) {
                    this._datacontext = _datacontext;
                    this.method = args.method || 'sha256';
                    this.xades = args.xades || 'des';
                }
                XmlSigner.prototype.getSignUrl = function (thumbprint) {
                    var thumbprintParam = (typeof thumbprint !== 'undefined') ? '&thumbprint=' + thumbprint : '';
                    var xadesParam = this.xades ? '&xades=' + this.xades : '';
                    return "https://localhost:1235/sign?method=" + this.method + thumbprintParam + xadesParam;
                };
                XmlSigner.prototype.signXmlAsync = function (args) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var url = _this.getSignUrl();
                        jQuery.support.cors = true;
                        $.ajax({
                            type: 'POST',
                            url: url,
                            async: true,
                            data: args.xml,
                            contentType: 'text/xml',
                            dataType: 'text',
                            success: function (data) {
                                var status = $($.parseXML(data)).find('Status').text();
                                if (status !== '') {
                                    resolve(xmlSigner.XmlSignResult.createCancel(status));
                                }
                                else {
                                    resolve(xmlSigner.XmlSignResult.createSuccess(data));
                                }
                            },
                            error: function (_jqXhr, status, error) {
                                resolve(xmlSigner.XmlSignResult.createError(status, error));
                            }
                        });
                    });
                };
                return XmlSigner;
            }());
            xmlSigner.XmlSigner = XmlSigner;
        })(xmlSigner = api.xmlSigner || (api.xmlSigner = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () { return sffw.api.xmlSigner.XmlSigner; });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var xmlSigner;
        (function (xmlSigner) {
            var XmlSignResult = /** @class */ (function () {
                function XmlSignResult(type, obj) {
                    this.signedData = null;
                    this.status = null;
                    this.error = null;
                    this.type = type;
                    return _.assign(this, obj);
                }
                XmlSignResult.createCancel = function (status) {
                    return new XmlSignResult('cancel', { status: status });
                };
                XmlSignResult.createSuccess = function (signedData) {
                    return new XmlSignResult('success', { signedData: signedData });
                };
                XmlSignResult.createError = function (status, error) {
                    return new XmlSignResult('error', { status: status, error: error });
                };
                XmlSignResult.prototype.isCancel = function () { return this.type === "cancel"; };
                XmlSignResult.prototype.isError = function () { return this.type === "error"; };
                XmlSignResult.prototype.isSuccess = function () { return this.type === "success"; };
                XmlSignResult.prototype.getSignedData = function () { return this.signedData || ''; };
                XmlSignResult.prototype.getStatus = function () { return this.status || ''; };
                XmlSignResult.prototype.getError = function () { return this.error || ''; };
                return XmlSignResult;
            }());
            xmlSigner.XmlSignResult = XmlSignResult;
        })(xmlSigner = api.xmlSigner || (api.xmlSigner = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
