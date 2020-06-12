var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var errorPointerMap;
        (function (errorPointerMap) {
            var ErrorPointerMap = /** @class */ (function () {
                function ErrorPointerMap(datacontext, args) {
                    var _this = this;
                    this.datacontext = datacontext;
                    this.items = [];
                    this.allowWrapIn = [];
                    this.cacheByPointer = {};
                    this.cacheByComponent = {};
                    var locF = null;
                    if (typeof datacontext.$entities.$localizeText === 'function') {
                        locF = datacontext.$entities.$localizeText;
                    }
                    else {
                        throw new Error('Localization function was not found');
                    }
                    if (args.allowWrapIn && args.allowWrapIn.length > 0) {
                        this.allowWrapIn = args.allowWrapIn.split('|');
                    }
                    if (args.items) {
                        _.each(args.items, function (item) {
                            var newItem = new errorPointerMap.ErrorPointerMapItem(item, locF);
                            _this.items.push(newItem);
                            _.each(_this.allowWrapIn, function (wrapperName) {
                                var newWrappedItem = new errorPointerMap.ErrorPointerMapItem(item, locF);
                                newWrappedItem.pointerPath = wrapperName + "/" + newWrappedItem.pointerPath;
                                _this.items.push(newWrappedItem);
                            });
                        });
                    }
                }
                ErrorPointerMap.prototype.getPointerCaption = function (args) {
                    var result = args.path;
                    var mapItem = this.getPointerItem(args.path);
                    if (mapItem) {
                        result = mapItem.getCaptionString(args.path);
                    }
                    return result;
                };
                ErrorPointerMap.prototype.getPointerItem = function (path) {
                    var cCode = this.getCurrentCultureCode();
                    if (this.cacheByPointer.hasOwnProperty(cCode)) {
                        if (this.cacheByPointer[cCode].hasOwnProperty(path)) {
                            return this.cacheByPointer[cCode][path];
                        }
                    }
                    else {
                        this.cacheByPointer[cCode] = {};
                    }
                    var result = null;
                    // Collections can have different ErrorPointerMapItem for collection count error and for empty collection item error
                    // First will look like complex1/collection1 and second like complex1/collection1[]
                    // In case of empty collection item validation error, ErrorPointerMapItem for collection count error (complex1/collection1) will be returned if complex1/collection1[] was not defined
                    var regNonEmptyCollectionPointer = new RegExp(/\[\d+\]$/);
                    var matchArray = regNonEmptyCollectionPointer.exec(path);
                    var isNonEmptyCollectionPointer = !!(matchArray && matchArray.length > 0);
                    var mapItem = _.find(this.items, function (itm) {
                        if (isNonEmptyCollectionPointer) {
                            return itm.pointerPath === path.replace(/\[\d+\]/g, '').concat('[]');
                        }
                        else {
                            return itm.pointerPath === path.replace(/\[\d+\]/g, '');
                        }
                    });
                    if (!mapItem) {
                        if (isNonEmptyCollectionPointer) {
                            mapItem = _.find(this.items, function (itm) {
                                return itm.pointerPath === path.replace(/\[\d+\]/g, '');
                            });
                        }
                    }
                    if (mapItem) {
                        result = mapItem;
                        this.cacheByPointer[cCode][path] = result;
                    }
                    return result;
                };
                ErrorPointerMap.prototype.getComponentForm = function (args) {
                    var result = null;
                    var mapItem = this.getComponentItem(args.component);
                    if (mapItem) {
                        result = mapItem.errorSourceForm || null;
                    }
                    return result;
                };
                ErrorPointerMap.prototype.getComponentTreeNode = function (args) {
                    var result = null;
                    var mapItem = this.getComponentItem(args.component);
                    if (mapItem) {
                        result = mapItem.navigationTreeNode || null;
                    }
                    return result;
                };
                ErrorPointerMap.prototype.getComponentItem = function (component) {
                    var cCode = this.getCurrentCultureCode();
                    if (this.cacheByComponent.hasOwnProperty(cCode)) {
                        if (this.cacheByComponent[cCode].hasOwnProperty(component)) {
                            return this.cacheByComponent[cCode][component];
                        }
                    }
                    else {
                        this.cacheByComponent[cCode] = {};
                    }
                    var result = null;
                    var mapItem = _.find(this.items, function (itm) {
                        return itm.errorSourceComponent.localeCompare(component) === 0;
                    });
                    if (mapItem) {
                        result = mapItem;
                        this.cacheByComponent[cCode][component] = result;
                    }
                    return result;
                };
                ErrorPointerMap.prototype.getCurrentCultureCode = function () {
                    var cCode = 'en';
                    if (typeof window !== 'undefined' && window.sf && window.sf.localization) {
                        cCode = window.sf.localization.currentCultureCode();
                    }
                    return cCode;
                };
                ErrorPointerMap.prototype.dispose = function () {
                    this.cacheByPointer = null;
                    this.items = null;
                };
                return ErrorPointerMap;
            }());
            errorPointerMap.ErrorPointerMap = ErrorPointerMap;
        })(errorPointerMap = api.errorPointerMap || (api.errorPointerMap = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.errorPointerMap.ErrorPointerMap;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var errorPointerMap;
        (function (errorPointerMap) {
            var ErrorPointerMapItem = /** @class */ (function () {
                function ErrorPointerMapItem(item, locF) {
                    this.locF = locF;
                    if (item) {
                        this.pointerPath = item.pointerPath;
                        this.captionMask = item.captionMask;
                        this.errorSourceForm = item.errorSourceForm;
                        this.errorSourceComponent = item.errorSourceComponent;
                        this.navigationTreeNode = item.navigationTreeNode;
                    }
                }
                ErrorPointerMapItem.prototype.getCaptionString = function (errPath) {
                    var _this = this;
                    // replace ${L_[package]$$[locId]} za lokalizovaný text
                    var result = this.captionMask.replace(/\${L_([a-zA-Z_0-9]+\$\$[a-zA-Z_0-9]+})/g, function (matchedStr) {
                        var locId = matchedStr.match(/(?!L)(?!_)([a-zA-Z_0-9]+\$\$[a-zA-Z_0-9]+)/);
                        if (locId) {
                            return _this.locF(locId[0]);
                        }
                    });
                    var xPathParts = errPath.split('/');
                    _.each(xPathParts, function (part) {
                        // název
                        // t.j. collection1 příp. collection1[25] => collection1
                        var partName = part.match(/[a-zA-Z_0-9]+(?=\[){0,}/);
                        // index uvnitř []
                        // t.j. collection1[25] => 25
                        var partIdx = part.match(/\d+(?=\])/);
                        if (partIdx) {
                            var regex = new RegExp("\\${IX_" + partName + "}");
                            // replace ${IX_[nazev]} za index v kolekci
                            result = result.replace(regex, partIdx[0].toString());
                        }
                    });
                    return result;
                };
                return ErrorPointerMapItem;
            }());
            errorPointerMap.ErrorPointerMapItem = ErrorPointerMapItem;
        })(errorPointerMap = api.errorPointerMap || (api.errorPointerMap = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
