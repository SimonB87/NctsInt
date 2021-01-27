var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var validationSummary;
        (function (validationSummary) {
            var viewTemplate = "\n    <div class=\"sffw-validation-summary\">\n    <!-- ko if: ko.unwrap(isVisible) && validationSummaryItems().length > 0 -->\n        <table>\n            <thead>\n                <tr>\n                <!-- ko foreach: columns -->\n                    <th data-bind=\"style: { width: columnWidth }, text: isCaptionLocalized === true ?  $root.$localize(columnCaption) :  columnCaption\"></th>\n                <!-- /ko -->\n                </tr>\n            </thead>\n            <tbody>\n                <!-- ko foreach: validationSummaryItems -->\n                <tr>\n                    <!-- ko foreach: columnValues -->\n                        <!-- ko if: ($parent.pointerSourceComponent && $parent.columns[$index()].columnRole === 'pointer') -->\n                        <td>\n                            <a href=\"#\" data-bind=\"text: $data,\n                                click: function(data, event) { return $parent.viewModel.onItemClicked($parent.pointer, event); },\n                                attr: { 'aria-label': $root.$localize('ValidationSummary$$showFormElement') + ' - ' + $data }\">\n                            </a>\n                        </td>\n                        <!-- /ko -->\n                        <!-- ko ifnot: ($parent.pointerSourceComponent && $parent.columns[$index()].columnRole === 'pointer') -->\n                        <td data-bind=\"text: $data\"></td>\n                        <!-- /ko -->\n                    <!-- /ko -->\n                </tr>\n                <!-- /ko -->\n            </tbody>\n        </table>\n        <!-- /ko -->\n    </div>";
            if (!ko.components.isRegistered('sffw-clientvalidation-summary')) {
                ko.components.register('sffw-clientvalidation-summary', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) {
                            return new sffw.components.validationSummary.ClientValidationSummaryModel(params, componentInfo);
                        }
                    },
                    template: viewTemplate
                });
            }
            if (!ko.components.isRegistered('sffw-servervalidation-summary')) {
                ko.components.register('sffw-servervalidation-summary', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) {
                            return new sffw.components.validationSummary.ServerValidationSummaryModel(params, componentInfo);
                        }
                    },
                    template: viewTemplate
                });
            }
        })(validationSummary = components.validationSummary || (components.validationSummary = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var validationSummary;
        (function (validationSummary) {
            var ServerValidationSummaryModel = /** @class */ (function () {
                function ServerValidationSummaryModel(params, _componentInfo) {
                    var _this = this;
                    this.subscriptions = [];
                    this.validationSummaryItems = ko.observableArray();
                    this.dataContext = params.$parentData;
                    this.isVisible = params.isVisible;
                    this.errorPointerMap = params.errorPointerMap;
                    if (params.validationErrors) {
                        this.validationErrors = params.validationErrors.$items;
                    }
                    sffw.assert(this.validationErrors, 'Server validation errors collection');
                    this.columns = _.map(params.columns, function (c) {
                        return new validationSummary.ValidationSummaryColumn(c);
                    });
                    sffw.assert(this.columns.length > 0, 'Missing column definitions');
                    this.itemClickHandler = params.OnItemClick;
                    var self = this;
                    self.onItemClicked = function (pointer, event) {
                        if (self.itemClickHandler) {
                            if (pointer && self.errorPointerMap) {
                                var mapItem = self.errorPointerMap.getPointerItem(pointer);
                                if (mapItem) {
                                    var itemClickParams = { errorSourceForm: mapItem.errorSourceForm, errorSourceComponent: mapItem.errorSourceComponent,
                                        navigationTreeNode: mapItem.navigationTreeNode, pointer: pointer };
                                    self.itemClickHandler(null, event, itemClickParams);
                                }
                            }
                        }
                    };
                    this.delayedValidationErrors = ko.pureComputed(function () {
                        return _this.validationErrors();
                    }).extend({ rateLimit: { timeout: 200, method: 'notifyWhenChangesStop' } });
                    this.createValidationSummaryItems();
                    this.subscriptions.push(this.delayedValidationErrors.subscribe(function () {
                        _this.createValidationSummaryItems();
                    }));
                }
                ServerValidationSummaryModel.prototype.createValidationSummaryItems = function () {
                    var _this = this;
                    this.validationSummaryItems.removeAll();
                    var errors = this.delayedValidationErrors();
                    _.each(errors, function (err) {
                        _this.validationSummaryItems.push(new validationSummary.ValidationSummaryItem(err, _this, _this.columns));
                    });
                };
                ServerValidationSummaryModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ServerValidationSummaryModel;
            }());
            validationSummary.ServerValidationSummaryModel = ServerValidationSummaryModel;
        })(validationSummary = components.validationSummary || (components.validationSummary = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var validationSummary;
        (function (validationSummary) {
            var ClientValidationSummaryModel = /** @class */ (function () {
                function ClientValidationSummaryModel(params, _componentInfo) {
                    var _this = this;
                    this.subscriptions = [];
                    this.validationSummaryItems = ko.observableArray();
                    this.validationErrors = ko.observableArray();
                    this.dataContext = params.$parentData;
                    this.isVisible = params.isVisible;
                    this.errorPointerMap = params.errorPointerMap;
                    if (params.validationRoot) {
                        this.validationRoot = params.validationRoot;
                    }
                    sffw.assert(this.validationRoot, 'Validation root');
                    if (params.validationErrors) {
                        this.validationErrorsCollectionReference = params.validationErrors;
                    }
                    this.columns = _.map(params.columns, function (c) {
                        return new validationSummary.ValidationSummaryColumn(c);
                    });
                    sffw.assert(this.columns.length > 0, 'Missing column definitions');
                    this.errorMessageAttName = params.errorMessageAttName || 'Message';
                    this.pointerAttName = params.pointerAttName || 'Pointer';
                    this.validatorTypeAttName = params.validatorTypeAttName || 'Type';
                    this.itemClickHandler = params.OnItemClick;
                    var self = this;
                    self.onItemClicked = function (pointer, event) {
                        if (self.itemClickHandler) {
                            if (pointer && self.errorPointerMap) {
                                var mapItem = self.errorPointerMap.getPointerItem(pointer);
                                if (mapItem) {
                                    var itemClickParams = { errorSourceForm: mapItem.errorSourceForm, errorSourceComponent: mapItem.errorSourceComponent,
                                        navigationTreeNode: mapItem.navigationTreeNode, pointer: pointer };
                                    self.itemClickHandler(null, event, itemClickParams);
                                }
                            }
                        }
                    };
                    this.delayedValidationErrors = ko.pureComputed(function () {
                        if (typeof _this.validationRoot['$isReportingErrors'] === 'function') {
                            // IDataCollection<IDataStruct>
                            return _this.validationRoot['$isReportingErrors']() ? _this.validationRoot.$validationErrors() : [];
                        }
                        else {
                            // IDataParent
                            return _this.validationRoot.$shouldChildAttributesReportErrors() ? _this.validationRoot.$validationErrors() : [];
                        }
                    }).extend({ rateLimit: { timeout: 200, method: 'notifyWhenChangesStop' } });
                    this.createValidationSummaryItems();
                    this.subscriptions.push(this.delayedValidationErrors.subscribe(function () {
                        _this.createValidationSummaryItems();
                    }));
                }
                ClientValidationSummaryModel.prototype.createValidationSummaryItems = function () {
                    var _this = this;
                    var errors = this.delayedValidationErrors();
                    var collectionItems = _.map(errors, function (err) {
                        var item = {};
                        item[_this.errorMessageAttName] = err.message;
                        item[_this.validatorTypeAttName] = err.validator;
                        item[_this.pointerAttName] = _this.getPointer(err.attribute);
                        return item;
                    });
                    this.validationErrors.removeAll();
                    var promiseChain = Promise.resolve();
                    if (this.validationErrorsCollectionReference) {
                        promiseChain = promiseChain.then(function () {
                            return _this.validationErrorsCollectionReference.$fromJson(collectionItems);
                        }).then(function () {
                            return _this.validationErrors(_this.validationErrorsCollectionReference.$items());
                        });
                    }
                    else {
                        promiseChain = promiseChain.then(function () {
                            _.each(collectionItems, function (item) {
                                _this.validationErrors.push(item);
                            });
                            return Promise.resolve();
                        });
                    }
                    promiseChain = promiseChain.then(function () {
                        _this.validationSummaryItems.removeAll();
                        _.each(_this.validationErrors(), function (err) {
                            _this.validationSummaryItems.push(new validationSummary.ValidationSummaryItem(err, _this, _this.columns));
                        });
                        return Promise.resolve();
                    });
                    return promiseChain;
                };
                // vrátí cestu k atributu relativně od root v XPath notaci; s vynecháním _ na začátku jmen a s indexy položek od 1
                ClientValidationSummaryModel.prototype.getPointer = function (attribute) {
                    var result = attribute.$name;
                    var x = attribute;
                    var collection = null;
                    var collectionName = null;
                    // pokud $parentStruct už nemá $parentStruct, jedná se o datacontext a ten už nás nezajímá
                    while (x.$parentStruct && x.$parentStruct !== this.validationRoot && x.$parentStruct.$parentStruct) {
                        if (x.$parentStruct.$meta.type === 'collection') {
                            // neviditelný complex reprezentující collection item
                            // zde se správně sestaví xpath pro validation errory prázdných záznamů kolekce
                            collection = x.$parentStruct;
                            collectionName = collection.$name;
                            collectionName = collectionName[0] === '_' ? collectionName.substr(1) : collectionName;
                            result = collectionName + "[" + (collection.$items().indexOf(x) + 1) + "]"; // index bude od 1, proto +1
                            x = collection;
                        }
                        else {
                            if (x.$parentStruct.$parentStruct.$meta.type === 'collection') {
                                var colStruct = x.$parentStruct;
                                collection = x.$parentStruct.$parentStruct;
                                collectionName = collection.$name;
                                collectionName = collectionName[0] === '_' ? collectionName.substr(1) : collectionName;
                                result = collectionName + "[" + (collection.$items().indexOf(colStruct) + 1) + "]/" + result; // index bude od 1, proto +1
                                x = collection;
                            }
                            else {
                                x = x.$parentStruct;
                                var parentStructName = x.$name;
                                parentStructName = parentStructName[0] === '_' ? parentStructName.substr(1) : parentStructName;
                                result = parentStructName + "/" + result;
                            }
                        }
                    }
                    return result;
                };
                ClientValidationSummaryModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ClientValidationSummaryModel;
            }());
            validationSummary.ClientValidationSummaryModel = ClientValidationSummaryModel;
        })(validationSummary = components.validationSummary || (components.validationSummary = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var validationSummary;
        (function (validationSummary) {
            var ValidationSummaryColumn = /** @class */ (function () {
                function ValidationSummaryColumn(colDef) {
                    this.propertyName = colDef.propertyName;
                    this.columnCaption = colDef.columnCaption;
                    this.isCaptionLocalized = colDef.isCaptionLocalized || false;
                    this.columnWidth = colDef.columnWidth || null;
                    this.columnRole = colDef.columnRole || null;
                }
                return ValidationSummaryColumn;
            }());
            validationSummary.ValidationSummaryColumn = ValidationSummaryColumn;
        })(validationSummary = components.validationSummary || (components.validationSummary = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var validationSummary;
        (function (validationSummary) {
            var ValidationSummaryItemBase = /** @class */ (function () {
                function ValidationSummaryItemBase(viewModel) {
                    this.columnValues = [];
                    this.viewModel = viewModel;
                }
                ValidationSummaryItemBase.prototype.getPointerSourceComponent = function (pointer) {
                    if (pointer && this.viewModel.errorPointerMap) {
                        var item = this.viewModel.errorPointerMap.getPointerItem(pointer);
                        return item ? item.errorSourceComponent : null;
                    }
                    return null;
                };
                return ValidationSummaryItemBase;
            }());
            var ValidationSummaryItem = /** @class */ (function (_super) {
                __extends(ValidationSummaryItem, _super);
                function ValidationSummaryItem(errStruct, viewModel, columns) {
                    var _this = _super.call(this, viewModel) || this;
                    _this.errStruct = errStruct;
                    _this.columns = columns;
                    sffw.assert(_this.errStruct);
                    _this.getPointerCaptionOrPointer = function () {
                        var result = _this.pointer;
                        if (_this.viewModel.errorPointerMap) {
                            result = _this.viewModel.errorPointerMap.getPointerCaption({ path: result });
                        }
                        return result;
                    };
                    _.each(_this.columns, function (col) {
                        var prop = _this.errStruct[col.propertyName];
                        if (prop) {
                            var propValue = typeof prop.$value === 'function' ? prop.$value() : prop.toString();
                            if (col.columnRole === 'pointer' && propValue) {
                                _this.pointer = propValue;
                                _this.pointerSourceComponent = _this.getPointerSourceComponent(_this.pointer);
                                _this.columnValues.push(_this.getPointerCaptionOrPointer());
                            }
                            else {
                                _this.columnValues.push(propValue);
                            }
                        }
                        else {
                            _this.columnValues.push('');
                        }
                    });
                    return _this;
                }
                return ValidationSummaryItem;
            }(ValidationSummaryItemBase));
            validationSummary.ValidationSummaryItem = ValidationSummaryItem;
        })(validationSummary = components.validationSummary || (components.validationSummary = {}));
    })(components = sffw.components || (sffw.components = {}));
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
