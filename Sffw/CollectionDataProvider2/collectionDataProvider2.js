var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var CollectionDataProvider2;
        (function (CollectionDataProvider2_1) {
            var CollectionDataProvider2 = /** @class */ (function () {
                function CollectionDataProvider2(dc, args) {
                    this.dc = dc;
                    this.compareFilteredValue = function (item, colFilter, column) {
                        var isValid = false;
                        if (!item[column.Name].$hasValue()) {
                            return isValid;
                        }
                        switch (colFilter.type) {
                            case 'text':
                                var filterVal = colFilter.getValue();
                                if (filterVal) {
                                    _.forEach(colFilter.getValue().split(','), function (value) {
                                        switch (column.DataType) {
                                            case 'string':
                                                switch (column.FilterOperatorType) {
                                                    case 'eq':
                                                        isValid = isValid === true || _.eq(item[column.Name].$value().toLowerCase(), value.toLowerCase());
                                                        break;
                                                    case 'substring':
                                                        isValid = isValid === true || item[column.Name].$value().toLowerCase().indexOf(value.toLowerCase()) >= 0;
                                                        break;
                                                    default:
                                                        isValid = isValid === true || _.startsWith(item[column.Name].$value().toLowerCase(), value.toLowerCase());
                                                        break;
                                                }
                                                break;
                                            case 'integer':
                                            case 'decimal':
                                                if (!isNaN(+value)) {
                                                    var numValue = new Big(value);
                                                    isValid = isValid === true || (numValue.cmp(item[column.Name].$value()) === 0);
                                                }
                                                else {
                                                    console.log("ignoring invalid " + column.DataType + " filter value(" + value + ") on column " + colFilter.name);
                                                }
                                                break;
                                            default:
                                                console.log("ignoring text filter value on column " + colFilter.name + "(" + column.DataType + ")");
                                                break;
                                        }
                                    });
                                }
                                break;
                            case 'boolean':
                                if (colFilter.getValue() != null) {
                                    isValid = item[column.Name].$value() === colFilter.getValue();
                                }
                                break;
                            case 'date':
                                if (colFilter.getStart()) {
                                    var from = moment(colFilter.getStart()).format('YYYY-MM-DD') + 'T00:00:00';
                                    var dateFromFilteredValue = new Date(from).getTime();
                                    var dateFromColumnValue = item[column.Name].$value().getTime();
                                    isValid = dateFromFilteredValue <= dateFromColumnValue;
                                }
                                if (colFilter.getEnd()) {
                                    var to = moment(colFilter.getEnd()).format('YYYY-MM-DD') + 'T23:59:59';
                                    var dateToFilteredValue = new Date(to).getTime();
                                    var dateToColumnValue = item[column.Name].$value().getTime();
                                    isValid = isValid === true && dateToFilteredValue >= dateToColumnValue;
                                }
                                break;
                            default:
                                console.log("ignoring nonimplemented type of filter on column " + colFilter.name);
                                break;
                        }
                        return isValid;
                    };
                    if (args.dataSourceCollectionReference) {
                        var dataPathRoot = void 0;
                        if (args.dataSourceCollectionReference.indexOf('::') !== -1) {
                            var parts = args.dataSourceCollectionReference.split('::');
                            sffw.assert(parts.length === 2);
                            dataPathRoot = dc.$globals[parts[0]];
                            this.dataSourceCollection = this.traverseContext(dataPathRoot, parts[1]);
                        }
                        else {
                            dataPathRoot = dc;
                            this.dataSourceCollection = this.traverseContext(dataPathRoot, args.dataSourceCollectionReference);
                        }
                        sffw.assert(this.dataSourceCollection, 'dataSourceCollection not found');
                    }
                }
                CollectionDataProvider2.prototype.traverseContext = function (dataPathRoot, path) {
                    var parts = path.split('.');
                    if (parts.length === 1) {
                        return dataPathRoot[path];
                    }
                    else if (parts[0].length > 0 && parts[1].length > 0) {
                        var childContext = dataPathRoot[parts[0]];
                        if (childContext) {
                            return this.traverseContext(childContext, path.substring(path.indexOf('.') + 1));
                        }
                    }
                    return null;
                };
                CollectionDataProvider2.prototype.loadData = function (listName, columns, pageSize, activePage, sortColumn, columnFilters, oDataFilter) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        // filtrovani
                        var filteredResults = _.filter(_this.dataSourceCollection.$items(), function (item) {
                            var isValid = null;
                            if (columnFilters && columnFilters.length > 0) {
                                _.each(columnFilters, function (colFilter) {
                                    var column = _.find(columns, function (colDef) {
                                        return colDef.Name === colFilter.name;
                                    });
                                    if (column) {
                                        isValid = isValid !== false && _this.compareFilteredValue(item, colFilter, column);
                                    }
                                    else {
                                        isValid = false;
                                        console.log("ignoring filter on unknown column " + colFilter.name);
                                    }
                                });
                            }
                            else {
                                isValid = true;
                            }
                            return isValid;
                        });
                        // razeni
                        if (sortColumn) {
                            var orderByColumn = _.find(columns, function (colDef) {
                                return colDef.Name === sortColumn.name;
                            });
                            if (orderByColumn) {
                                switch (orderByColumn.DataType) {
                                    case 'integer':
                                    case 'decimal':
                                        filteredResults = filteredResults.sort(function (item1, item2) {
                                            var numVal1 = new Big(item1[sortColumn.name].$value());
                                            var numVal2 = new Big(item2[sortColumn.name].$value());
                                            return sortColumn.sortOrder === 'desc' ? numVal2.cmp(numVal1) : numVal1.cmp(numVal2);
                                        });
                                        break;
                                    default:
                                        filteredResults = _.orderBy(filteredResults, function (item) { return item[sortColumn.name].$value(); }, sortColumn.sortOrder);
                                        break;
                                }
                            }
                        }
                        var totalRecountCount = filteredResults.length;
                        // strankovani
                        var pageOffset = (activePage - 1) * pageSize;
                        filteredResults = _.drop(filteredResults, pageOffset).slice(0, pageSize);
                        // prevod na json
                        var jsonArray = [];
                        _.each(filteredResults, function (item) {
                            jsonArray.push(item.$createJsonObj());
                        });
                        resolve(new CollectionDataProvider2_1.ListPageData(jsonArray, totalRecountCount));
                    });
                };
                CollectionDataProvider2.prototype.getDataExportUrl = function (listName, columns, sortColumn, columnFilters, oDataFilter, format) {
                    console.warn('Method CollectionDataProvider2.getDataExportUrl() has no implementation.');
                    return null;
                };
                CollectionDataProvider2.prototype.getODataFilterQueryParam = function (columns, columnFilters, oDataFilter) {
                    console.warn('Method CollectionDataProvider2.getODataFilterQueryParam() has no implementation.');
                    return null;
                };
                CollectionDataProvider2.prototype.getODataOrderByQueryParam = function (sortColumn) {
                    console.warn('Method CollectionDataProvider2.getODataOrderByQueryParam() has no implementation.');
                    return null;
                };
                return CollectionDataProvider2;
            }());
            CollectionDataProvider2_1.CollectionDataProvider2 = CollectionDataProvider2;
        })(CollectionDataProvider2 = api.CollectionDataProvider2 || (api.CollectionDataProvider2 = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.CollectionDataProvider2.CollectionDataProvider2;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var CollectionDataProvider2;
        (function (CollectionDataProvider2) {
            'use strict';
            var ListPageData = /** @class */ (function () {
                function ListPageData(dataArr, count) {
                    this.count = count;
                    this.records = dataArr;
                }
                return ListPageData;
            }());
            CollectionDataProvider2.ListPageData = ListPageData;
        })(CollectionDataProvider2 = api.CollectionDataProvider2 || (api.CollectionDataProvider2 = {}));
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
