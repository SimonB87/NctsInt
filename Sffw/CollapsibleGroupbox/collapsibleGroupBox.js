var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var collapsibleGroupBox;
        (function (collapsibleGroupBox) {
            if (ko && !ko.components.isRegistered('collapsible-group-box')) {
                ko.components.register('collapsible-group-box', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.collapsibleGroupBox.CollapsibleGroupBoxModel(params, componentInfo); }
                    },
                    template: "\n            <div data-bind=\"visible: isVisible, css: cssClass\">\n                <fieldset data-bind=\"css:{ 'cgb-collapsed' : !isExpanded() }\">\n                    <legend>\n                        <div data-bind=\"click: onToggleCollapseClick\" role=\"button\">\n                            <span data-bind=\"css: !isExpanded() ? collapsedIcClass : nonCollapsedIcClass\"></span>\n                            <span data-bind=\"text: caption\"></span>\n                        </div>\n                    </legend>\n                    <div data-bind=\"visible: isExpanded\">\n                        <!-- ko template: { nodes: $componentTemplateNodes, data: ctx } --><!-- /ko -->\n                    </div>\n                </fieldset>\n            </div>"
                });
            }
        })(collapsibleGroupBox = components.collapsibleGroupBox || (components.collapsibleGroupBox = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var collapsibleGroupBox;
        (function (collapsibleGroupBox) {
            var CollapsibleGroupBoxModel = /** @class */ (function () {
                function CollapsibleGroupBoxModel(params, componentInfo) {
                    this.collapsedIcClass = ko.observable('fa fa-caret-up');
                    this.nonCollapsedIcClass = ko.observable('fa fa-caret-down');
                    this.cssClass = ko.observable('cgb cgb-default');
                    this.caption = params.caption;
                    this.collapseActionHandler = params.OnCollapseClick;
                    if (_.isUndefined(params.isVisible)) {
                        this.isVisible = ko.observable(true);
                    }
                    else if (typeof (params.isVisible) === 'function') {
                        this.isVisible = params.isVisible;
                    }
                    else {
                        this.isVisible = ko.observable(params.isVisible);
                    }
                    if (_.isUndefined(params.isExpanded)) {
                        this.isExpanded = ko.observable(true);
                    }
                    else if (typeof (params.isExpanded) === 'function') {
                        this.isExpanded = params.isExpanded;
                    }
                    else {
                        this.isExpanded = ko.observable(params.isExpanded);
                    }
                    if (typeof params.collapsedIconClass !== 'undefined' && params.collapsedIconClass !== null && params.collapsedIconClass !== '') {
                        this.collapsedIcClass(params.collapsedIconClass);
                    }
                    if (typeof params.nonCollapsedIconClass !== 'undefined' && params.nonCollapsedIconClass !== null && params.nonCollapsedIconClass !== '') {
                        this.nonCollapsedIcClass(params.nonCollapsedIconClass);
                    }
                    if (params.cssClass && params.cssClass.length > 0) {
                        this.cssClass(params.cssClass);
                    }
                    this.ctx = params.$parentData;
                    this.onToggleCollapseClick = this.toggleCollapse;
                }
                CollapsibleGroupBoxModel.prototype.toggleCollapse = function (data, event) {
                    if (typeof (data.isExpanded) === 'function') {
                        data.isExpanded(!data.isExpanded());
                    }
                    else {
                        data.isExpanded = !data.isExpanded;
                    }
                    if (this.collapseActionHandler) {
                        this.collapseActionHandler();
                    }
                };
                return CollapsibleGroupBoxModel;
            }());
            collapsibleGroupBox.CollapsibleGroupBoxModel = CollapsibleGroupBoxModel;
        })(collapsibleGroupBox = components.collapsibleGroupBox || (components.collapsibleGroupBox = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
