var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var pagingRepeater;
        (function (pagingRepeater) {
            var PagingRepeaterModel = /** @class */ (function () {
                function PagingRepeaterModel(params, componentInfo) {
                    var _this = this;
                    if (params.Data) {
                        this.items = params.Data.$items;
                    }
                    this.index = params.Index || ko.observable();
                    // if index is not preset to some number, we set it to 1
                    if (!_.isFinite(this.index())) {
                        this.index(1);
                    }
                    this.displayedItem = ko.pureComputed(function () {
                        if (!_this.items || !_.isFinite(_this.index())) {
                            return null;
                        }
                        return _this.items()[_this.index() - 1] || null;
                    });
                }
                return PagingRepeaterModel;
            }());
            pagingRepeater.PagingRepeaterModel = PagingRepeaterModel;
        })(pagingRepeater = components.pagingRepeater || (components.pagingRepeater = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var pagingRepeater;
        (function (pagingRepeater) {
            if (ko && !ko.components.isRegistered('sffw-paging-repeater')) {
                ko.components.register('sffw-paging-repeater', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.pagingRepeater.PagingRepeaterModel(params, componentInfo); }
                    },
                    template: "\n<div class=\"sffw-paging-repeater-item\">\n    <!-- ko if: displayedItem -->\n        <!-- ko template: { nodes: $componentTemplateNodes, data: displayedItem } --><!-- /ko -->\n    <!-- /ko -->\n</div>"
                });
            }
        })(pagingRepeater = components.pagingRepeater || (components.pagingRepeater = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
