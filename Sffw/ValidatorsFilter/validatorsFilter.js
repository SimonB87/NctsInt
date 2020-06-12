var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var validatorsFilter;
        (function (validatorsFilter) {
            var DisabledValidatorCfg = /** @class */ (function () {
                function DisabledValidatorCfg(formName, attPath, validatorId) {
                    this.formName = formName;
                    this.attPath = attPath;
                    this.validatorId = validatorId;
                    sffw.assert(formName && formName.length > 0);
                    sffw.assert(attPath && attPath.length > 0);
                    sffw.assert(validatorId && validatorId.length > 0);
                }
                return DisabledValidatorCfg;
            }());
            validatorsFilter.DisabledValidatorCfg = DisabledValidatorCfg;
        })(validatorsFilter = api.validatorsFilter || (api.validatorsFilter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var validatorsFilter;
        (function (validatorsFilter) {
            var ValidatorsFilter = /** @class */ (function () {
                function ValidatorsFilter() {
                }
                ValidatorsFilter.prototype.setConfig = function (args) {
                    this.config = new validatorsFilter.ValidatorsFilterConfig(args.config);
                    return this.config.isValid;
                };
                ValidatorsFilter.prototype.afterDataContextCreate = function (dc) {
                    sffw.assert(dc);
                    sffw.assert(_.isString(dc.$formId));
                    if (!this.config || !dc.$formId) { // dc may not have id if it is not datacontext of a form
                        return;
                    }
                    var formDisabledValidators = _.filter(this.config.disabledValidators, function (valCfg) { return valCfg.formName === dc.$formId; });
                    if (formDisabledValidators.length > 0) {
                        this.processChildrenRecursive(dc, dc.$formId, formDisabledValidators);
                    }
                };
                ValidatorsFilter.prototype.afterCollectionItemCreate = function (item) {
                    var _this = this;
                    sffw.assert(item);
                    sffw.assert(item.$dataContext);
                    if (!this.config || !item.$dataContext.$formId) {
                        return;
                    }
                    var formId = item.$dataContext.$formId;
                    var formDisabledValidators = _.filter(this.config.disabledValidators, function (valCfg) { return valCfg.formName === formId; });
                    var itemPath = item.$getPosition().join('/');
                    _(item.$validators())
                        .filter(function (v) { return _this.shouldRemoveValidator(itemPath, v, formDisabledValidators); })
                        .each(function (v) { return item.$validators.remove(v); });
                    return this.processChildrenRecursive(item, formId, formDisabledValidators);
                };
                ValidatorsFilter.prototype.processChildrenRecursive = function (struct, formId, formDisabledValidators) {
                    var _this = this;
                    _.each(struct.$attributes(), function (att) {
                        var attPath = att.$getPosition().join('/');
                        _(att.$validators())
                            .filter(function (v) { return _this.shouldRemoveValidator(attPath, v, formDisabledValidators); })
                            .each(function (v) { return att.$validators.remove(v); });
                        if (_this.isDataStruct(att)) {
                            _this.processChildrenRecursive(att, formId, formDisabledValidators);
                        }
                        else {
                            if (_this.isDataCollection(att)) {
                                _.each(att.$items(), function (item) { return _this.processChildrenRecursive(item, formId, formDisabledValidators); });
                            }
                        }
                    });
                };
                ValidatorsFilter.prototype.isDataStruct = function (data) {
                    return !!data.$attributes;
                };
                ValidatorsFilter.prototype.isDataCollection = function (data) {
                    return !!data.$items;
                };
                ValidatorsFilter.prototype.shouldRemoveValidator = function (attPath, v, formDisabledValidators) {
                    if (_.some(formDisabledValidators, function (disabledValCfg) { return attPath === disabledValCfg.attPath && v.id === disabledValCfg.validatorId; })) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                return ValidatorsFilter;
            }());
            validatorsFilter.ValidatorsFilter = ValidatorsFilter;
        })(validatorsFilter = api.validatorsFilter || (api.validatorsFilter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.validatorsFilter.ValidatorsFilter;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var validatorsFilter;
        (function (validatorsFilter) {
            var ValidatorsFilterConfig = /** @class */ (function () {
                function ValidatorsFilterConfig(filter) {
                    try {
                        var filterObj = JSON.parse(filter);
                        sffw.assert(_.isArray(filterObj));
                        this.disabledValidators = _.map(filterObj, function (cfgPart) {
                            try {
                                return new validatorsFilter.DisabledValidatorCfg(cfgPart[0], cfgPart[1], cfgPart[2]);
                            }
                            catch (err) {
                                throw new Error("Failed to parse " + JSON.stringify(cfgPart) + ". Expecting it to be array of three strings.");
                            }
                        });
                        this.isValid = true;
                    }
                    catch (err) {
                        if (err.message && console.error) {
                            console.error("ValidatorsFilter setConfig failed: " + err.message);
                        }
                        this.isValid = false;
                    }
                }
                return ValidatorsFilterConfig;
            }());
            validatorsFilter.ValidatorsFilterConfig = ValidatorsFilterConfig;
        })(validatorsFilter = api.validatorsFilter || (api.validatorsFilter = {}));
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
