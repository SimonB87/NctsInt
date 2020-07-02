var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var navigationTree;
        (function (navigationTree) {
            var Controller = /** @class */ (function () {
                function Controller(datacontext, args) {
                    this.datacontext = datacontext;
                    this.isShowingErrors = ko.observable(false);
                    this.setupStage = navigationTree.SetupStage.None;
                    this.rootNode = new navigationTree.Node(this);
                    this.rootDef = new navigationTree.NodeDef(this);
                    this.autoRefocus = (args.autoRefocus !== false); // default is true
                }
                Controller.prototype.onNodeActivate = function (node, activatedByUser) {
                    var _this = this;
                    if (node.type === navigationTree.NodeType.Previous || node.type === navigationTree.NodeType.Next) {
                        var activeNodeIndex = node.parentNode.def.collectionIndexAtt();
                        var items = _.filter(node.parentNode.children(), function (c) {
                            return c.type === navigationTree.NodeType.CollectionItem;
                        });
                        var newNodeIndex = (node.type === navigationTree.NodeType.Previous ? activeNodeIndex - 1 : activeNodeIndex + 1);
                        var newActiveNode = items[newNodeIndex - 1]; // index is 1-based
                        if (newActiveNode) {
                            return this.onNodeActivate(newActiveNode, activatedByUser);
                        }
                        else {
                            return Promise.resolve();
                        }
                    }
                    this.rootNode.unselectChildren();
                    switch (node.type) {
                        case navigationTree.NodeType.CollectionItem:
                            node.isActive(true);
                            node.def.isItemActiveAtt(true);
                            break;
                        default:
                            node.isActive(true);
                            node.def.isActiveAtt(true);
                            break;
                    }
                    this.activeNode = node;
                    this.setCollectionIndexes(node);
                    this.collapseAndExpandNodes();
                    var promisedResult = Promise.resolve();
                    if (this.onNodeActivatedCallback) {
                        promisedResult = promisedResult.then(function () { return _this.onNodeActivatedCallback(node.def.id, activatedByUser); });
                    }
                    return promisedResult;
                };
                Controller.prototype.collapseAndExpandNodes = function () {
                    var nodesInActivePath;
                    if (this.activeNode) {
                        nodesInActivePath = this.activeNode.getNodesInPath();
                    }
                    else {
                        nodesInActivePath = [];
                    }
                    this.collapseChildrenExcept(this.rootNode, nodesInActivePath);
                };
                Controller.prototype.collapseChildrenExcept = function (node, nodesInActivePath) {
                    var _this = this;
                    _.each(node.children(), function (n) {
                        if (nodesInActivePath.indexOf(n) !== -1 || n.alwaysExpanded) {
                            n.isCollapsed(false);
                            _this.collapseChildrenExcept(n, nodesInActivePath);
                        }
                        else {
                            n.isCollapsed(true);
                        }
                    });
                };
                Controller.prototype.setCollectionIndexes = function (node) {
                    var n = node;
                    while (n && n.parentNode) {
                        if (n.type === navigationTree.NodeType.CollectionItem) {
                            var index = n.getCollectionItemIndex();
                            if (index !== null) {
                                var collectionDef = n.parentNode.def.collectionIndexAtt(index);
                            }
                            n = n.parentNode.parentNode;
                        }
                        else {
                            n = n.parentNode;
                        }
                    }
                };
                Controller.prototype.findChildNode = function (parentNode, childId) {
                    return _(parentNode.children()).find(function (childNode) {
                        return childNode.def.id === childId;
                    });
                };
                Controller.prototype.findCollectionItem = function (parentNode, collectionName, index) {
                    var collection = this.findChildNode(parentNode, collectionName);
                    if (!(collection && collection.type === navigationTree.NodeType.Collection)) {
                        return null;
                    }
                    var item = collection.findItemNode(index - 1);
                    if (!(item && item.type === navigationTree.NodeType.CollectionItem)) {
                        return null;
                    }
                    return item;
                };
                Controller.prototype.findNode = function (path) {
                    var pathParts = path.split('/');
                    var rootNode = this.rootNode;
                    for (var _i = 0, pathParts_1 = pathParts; _i < pathParts_1.length; _i++) {
                        var part = pathParts_1[_i];
                        var regex = /^(\w+)\[(\d+)\]+$/;
                        var match = regex.exec(part);
                        if (match) {
                            var collectionName = match[1];
                            var index = Number(match[2]);
                            rootNode = this.findCollectionItem(rootNode, collectionName, index);
                        }
                        else {
                            rootNode = this.findChildNode(rootNode, part);
                        }
                        if (!rootNode) {
                            return null;
                        }
                    }
                    return rootNode;
                };
                // ALangInterface
                Controller.prototype.addNode = function (args) {
                    if (this.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.error("Cannot process addNode of TreeNavigationController at this stage (" + this.setupStage + ").");
                        return;
                    }
                    return this.rootDef.addNode(args);
                };
                Controller.prototype.showErrors = function (args) {
                    this.isShowingErrors(args.showErrors);
                };
                Controller.prototype.beginSetup = function (args) {
                    if (this.setupStage !== navigationTree.SetupStage.None) {
                        console.error("Cannot process beginSetup of TreeNavigationController at this stage (" + this.setupStage + ").");
                        return;
                    }
                    if (args.controlStruct.indexOf('::') !== -1) {
                        var parts = args.controlStruct.split('::');
                        sffw.assert(parts.length === 2);
                        this.controlStructDataPathRoot = this.datacontext.$globals[parts[0]];
                        this.controlStruct = this.controlStructDataPathRoot[parts[1]];
                    }
                    else {
                        this.controlStructDataPathRoot = this.datacontext;
                        this.controlStruct = this.datacontext[args.controlStruct];
                    }
                    if (args.dataStructPackageName) {
                        this.dataStructDataPathRoot = this.datacontext.$globals[args.dataStructPackageName];
                    }
                    else {
                        this.dataStructDataPathRoot = this.controlStructDataPathRoot;
                    }
                    this.setupStage = navigationTree.SetupStage.Initiated;
                };
                Controller.prototype.finishSetup = function (args) {
                    if (this.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.error("Cannot process finishSetup of TreeNavigationController at this stage (" + this.setupStage + ").");
                        return;
                    }
                    this.rootDef.projectChildNodes(this.rootNode);
                    this.collapseAndExpandNodes();
                    this.setupStage = navigationTree.SetupStage.Finished;
                };
                Controller.prototype.resetFinishedSetup = function (args) {
                    if (this.setupStage !== navigationTree.SetupStage.Finished) {
                        console.error("Cannot process resetFinishedSetup of TreeNavigationController at this stage (" + this.setupStage + ").");
                        return;
                    }
                    this.rootNode.dispose();
                    this.rootNode = new navigationTree.Node(this);
                    this.rootDef = new navigationTree.NodeDef(this);
                    this.controlStruct = null;
                    this.controlStructDataPathRoot = null;
                    this.dataStructDataPathRoot = null;
                    this.activeNode = null;
                    this.setupStage = navigationTree.SetupStage.None;
                };
                Controller.prototype.focusNode = function (args) {
                    var n = this.findNode(args.path);
                    if (n) {
                        return n.activateNode(false);
                    }
                    else {
                        return Promise.resolve();
                    }
                };
                Controller.prototype.setNodeVisibility = function (args) {
                    var node = this.findNode(args.path);
                    node.setVisibility(args.visible);
                };
                Controller.prototype.getNodeVisibility = function (args) {
                    var node = this.findNode(args.path);
                    return !node.explicitlyHidden();
                };
                Controller.prototype.expandAlways = function (args) {
                    var node = this.findNode(args.path);
                    if (args.expanded) {
                        node.alwaysExpanded = true;
                    }
                    else {
                        node.alwaysExpanded = false;
                    }
                    this.collapseAndExpandNodes();
                };
                Controller.prototype.dispose = function () {
                    this.rootNode.dispose();
                };
                return Controller;
            }());
            navigationTree.Controller = Controller;
        })(navigationTree = components.navigationTree || (components.navigationTree = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.components.navigationTree.Controller;
    });
}
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var navigationTree;
        (function (navigationTree) {
            var NodeType;
            (function (NodeType) {
                NodeType[NodeType["Basic"] = 0] = "Basic";
                NodeType[NodeType["Collection"] = 1] = "Collection";
                NodeType[NodeType["CollectionItem"] = 2] = "CollectionItem";
                NodeType[NodeType["Previous"] = 3] = "Previous";
                NodeType[NodeType["Next"] = 4] = "Next";
            })(NodeType = navigationTree.NodeType || (navigationTree.NodeType = {}));
            var SetupStage;
            (function (SetupStage) {
                SetupStage[SetupStage["None"] = 0] = "None";
                SetupStage[SetupStage["Initiated"] = 1] = "Initiated";
                SetupStage[SetupStage["Finished"] = 2] = "Finished";
            })(SetupStage = navigationTree.SetupStage || (navigationTree.SetupStage = {}));
        })(navigationTree = components.navigationTree || (components.navigationTree = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var navigationTree;
        (function (navigationTree) {
            var Node = /** @class */ (function () {
                function Node(ctrl, type, def, parentNode) {
                    var _this = this;
                    this.ctrl = ctrl;
                    this.type = type;
                    this.def = def;
                    this.alwaysExpanded = false;
                    if (!ctrl) {
                        throw new Error('Expecting parameter ctrl to have value');
                    }
                    this.children = ko.observableArray();
                    this.isActive = ko.observable();
                    this.isCollapsed = ko.observable();
                    this.explicitlyHidden = ko.observable(false);
                    if (this.def && this.def.markerAtt) {
                        this.marker = this.def.markerAtt;
                    }
                    if ((this.type === navigationTree.NodeType.Basic || this.type === navigationTree.NodeType.Collection) && this.def && this.def.markerTextAtt) {
                        this.markerText = this.def.markerTextAtt;
                    }
                    this.isNodeTextHidden = ko.pureComputed(function () {
                        if (_this.explicitlyHidden()) {
                            return true;
                        }
                        var activeIndex;
                        var itemsLength = null;
                        var displayNodesCnt = null;
                        switch (_this.type) {
                            case navigationTree.NodeType.CollectionItem:
                                if (_this.parentNode.def.areSubnodesLimited()) {
                                    var itemIndex = _this.getCollectionItemIndex();
                                    itemsLength = _this.parentNode.collection.$items().length;
                                    displayNodesCnt = _this.getNumOfNodesToDisplay();
                                    if (itemIndex === null) { // item is probably disposed already
                                        return true;
                                    }
                                    activeIndex = _this.parentNode.def.collectionIndexAtt();
                                    // show all nodes when nodes count is less or equal number of nodes to display
                                    // show directly 1st node instead of "previous" when 2nd is active
                                    // show directly last node instead of "next" when last but one is active
                                    if (displayNodesCnt >= itemsLength) {
                                        return false;
                                    }
                                    else if (activeIndex === 2 && itemIndex === 1) {
                                        return false;
                                    }
                                    else if (activeIndex === itemsLength - 1 && itemIndex === itemsLength) {
                                        return false;
                                    }
                                    else if (itemIndex < activeIndex - _this.parentNode.def.collectionSubnodesLimit ||
                                        itemIndex > activeIndex + _this.parentNode.def.collectionSubnodesLimit) {
                                        return true;
                                    }
                                }
                                break;
                            case navigationTree.NodeType.Next:
                                if (_this.parentNode.def.areSubnodesLimited()) {
                                    activeIndex = _this.parentNode.def.collectionIndexAtt();
                                    itemsLength = _this.parentNode.collection.$items().length;
                                    displayNodesCnt = _this.getNumOfNodesToDisplay();
                                    // hide "next" when nodes count is less or equal number of nodes to display
                                    // hide "next" when last but one is active
                                    if (displayNodesCnt >= itemsLength) {
                                        return true;
                                    }
                                    else if (activeIndex === itemsLength - 1) {
                                        return true;
                                    }
                                    else if (activeIndex + _this.parentNode.def.collectionSubnodesLimit >= itemsLength) {
                                        return true;
                                    }
                                }
                                break;
                            case navigationTree.NodeType.Previous:
                                if (_this.parentNode.def.areSubnodesLimited()) {
                                    activeIndex = _this.parentNode.def.collectionIndexAtt();
                                    itemsLength = _this.parentNode.collection.$items().length;
                                    displayNodesCnt = _this.getNumOfNodesToDisplay();
                                    // hide "previous" when nodes count is less or equal number of nodes to display
                                    // hide "previous" when 2nd is active
                                    if (displayNodesCnt >= itemsLength) {
                                        return true;
                                    }
                                    else if (activeIndex === 2) {
                                        return true;
                                    }
                                    else if (activeIndex - _this.parentNode.def.collectionSubnodesLimit <= 1) {
                                        return true;
                                    }
                                }
                                break;
                        }
                        return false;
                    });
                    this.indent = ko.pureComputed(function () {
                        if (!parentNode) {
                            return -1;
                        }
                        if (_this.isNodeTextHidden()) {
                            return parentNode.indent();
                        }
                        else {
                            return parentNode.indent() + 1;
                        }
                    });
                    this.isShowingError = ko.pureComputed(function () {
                        if (!ctrl.isShowingErrors() || !_this.errorCount) {
                            return false;
                        }
                        return _this.errorCount() > 0;
                    });
                    this.isSelfOrChildShowingError = ko.pureComputed(function () {
                        return _this.isShowingError() || _.some(_this.children(), function (c) {
                            return c.isSelfOrChildShowingError();
                        });
                    });
                }
                Node.prototype.activateNode = function (activatedByUser) {
                    return this.ctrl.onNodeActivate(this, activatedByUser);
                };
                Node.prototype.attachToCollection = function (collection) {
                    var _this = this;
                    this.collection = collection;
                    this.collectionSubscription = collection.$items.subscribe(function (changes) {
                        var promiseChain = Promise.resolve();
                        _(changes).filter({ status: 'deleted' }).each(function (change) {
                            // avoiding use of change.index in case of multiple changes which processing would potentially desync the index
                            var removedNode = _(_this.children()).find(function (child) {
                                return child.collectionItem === change.value;
                            });
                            if (removedNode) {
                                promiseChain = promiseChain.then(function () {
                                    _this.removeChild(removedNode);
                                });
                            }
                        });
                        _(changes).filter({ status: 'added' }).each(function (change) {
                            promiseChain = promiseChain.then(function () {
                                return _this.def.createItemNode(change.value, _this);
                            });
                        });
                        promiseChain = promiseChain.then(function () {
                            _this.ctrl.collapseAndExpandNodes();
                        });
                        promiseChain = promiseChain.catch(function (err) {
                            console.error(err);
                        });
                    }, null, 'arrayChange');
                };
                Node.prototype.removeChild = function (removedNode) {
                    var _this = this;
                    var p;
                    var removedNodeIndex = this.children().indexOf(removedNode);
                    // If node is active, move focus up
                    if (this.ctrl.autoRefocus && (removedNode.isActive() || removedNode.isAnyChildNodeActive())) {
                        if (removedNodeIndex === 0) {
                            p = this.activateNode(false);
                        }
                        else {
                            p = this.children()[removedNodeIndex - 1].activateNode(false);
                        }
                    }
                    else {
                        if (removedNodeIndex > 0 && this.def.collectionIndexAtt() >= removedNodeIndex) {
                            this.def.collectionIndexAtt((removedNodeIndex - 1) || 1);
                        }
                        p = Promise.resolve();
                    }
                    return p.then(function () {
                        // Remove child and recursivelly dispose
                        _this.children.remove(removedNode);
                        removedNode.dispose();
                    });
                };
                Node.prototype.isAnyChildNodeActive = function () {
                    return _(this.children()).some(function (c) {
                        return !!c.isActive() || c.isAnyChildNodeActive();
                    });
                };
                Node.prototype.activateItemNode = function (index) {
                    var node = this.findItemNode(index);
                    if (node) {
                        node.isActive(true);
                    }
                };
                Node.prototype.findItemNode = function (index) {
                    var items = _.filter(this.children(), function (c) {
                        return c.type === navigationTree.NodeType.CollectionItem;
                    });
                    return items[index];
                };
                // disposes itself and its children nodes
                Node.prototype.dispose = function () {
                    if (this.collectionSubscription) {
                        this.collectionSubscription.dispose();
                    }
                    _(this.children()).each(function (child) {
                        child.dispose();
                    });
                };
                Node.prototype.unselectChildren = function () {
                    _.each(this.children(), function (c) {
                        c.isActive(false);
                        c.def.isActiveAtt(false);
                        if (c.def.isItemActiveAtt) {
                            c.def.isItemActiveAtt(false);
                        }
                        c.unselectChildren();
                    });
                };
                Node.prototype.getCollectionItemIndex = function () {
                    if (!this.collectionItem || this.collectionItem.$isDisposed) {
                        return null;
                    }
                    return _.indexOf(this.collectionItem.$parentStruct.$items(), this.collectionItem) + 1;
                };
                Node.prototype.setVisibility = function (visible) {
                    this.explicitlyHidden(!visible);
                };
                Node.prototype.getNodesInPath = function () {
                    if (this.parentNode) {
                        return Array.prototype.concat([this], this.parentNode.getNodesInPath());
                    }
                    else {
                        return [this];
                    }
                };
                Node.prototype.getNumOfNodesToDisplay = function () {
                    if (this.parentNode && this.parentNode.def.areSubnodesLimited()) {
                        // we are displaying current node + collectionSubnodesLimit before and after + prev + next
                        return 3 + (2 * this.parentNode.def.collectionSubnodesLimit);
                    }
                    return null;
                };
                return Node;
            }());
            navigationTree.Node = Node;
        })(navigationTree = components.navigationTree || (components.navigationTree = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var navigationTree;
        (function (navigationTree) {
            var NodeDef = /** @class */ (function () {
                function NodeDef(ctrl) {
                    this.ctrl = ctrl;
                    this.childrenDef = [];
                }
                NodeDef.prototype.areSubnodesLimited = function () {
                    return _.isFinite(this.collectionSubnodesLimit);
                };
                NodeDef.prototype.addChild = function (id, captionAtt, isActiveAtt, markerAtt, markerTextAtt) {
                    var nodeDef = new NodeDef(this.ctrl);
                    nodeDef.id = id;
                    nodeDef.caption = captionAtt;
                    nodeDef.isActiveAtt = isActiveAtt;
                    nodeDef.markerAtt = markerAtt;
                    nodeDef.markerTextAtt = markerTextAtt;
                    this.childrenDef.push(nodeDef);
                    return nodeDef;
                };
                NodeDef.prototype.createNodeErrorCount = function (node, errPath) {
                    var validatedData = this.findDataOnPath(errPath, node);
                    if (!validatedData) {
                        throw new Error("Failed to find path " + errPath + " for showing errors");
                    }
                    if (validatedData.$meta.type === 'computed') {
                        node.errorCount = validatedData.$value;
                    }
                    else {
                        node.errorCount = ko.pureComputed(function () {
                            return validatedData.$validationErrors().length;
                        });
                    }
                };
                NodeDef.prototype.projectNode = function (containerNode) {
                    var _this = this;
                    var nodeType = this.collectionPath ? navigationTree.NodeType.Collection : navigationTree.NodeType.Basic;
                    var node = new navigationTree.Node(this.ctrl, nodeType, this, containerNode);
                    node.caption = this.caption;
                    node.parentNode = containerNode;
                    containerNode.children.push(node);
                    if (this.collectionPath) {
                        this.collectionIndexAtt(1);
                        var collection = this.findDataOnPath(this.collectionPath, containerNode);
                        if (!collection) {
                            throw new Error("Failed to find collection on path " + this.collectionPath + ".");
                        }
                        node.attachToCollection(collection);
                        if (!node.collection) {
                            throw new Error("Cannot find collection on (possibly relative) path {0}");
                        }
                        if (this.areSubnodesLimited()) {
                            var prevNode = new navigationTree.Node(this.ctrl, navigationTree.NodeType.Previous, this, node);
                            prevNode.caption = ko.pureComputed(function () { return _this.ctrl.datacontext.$localize('NavigationTree$$Previous'); });
                            prevNode.parentNode = node;
                            node.children.push(prevNode);
                        }
                        _(node.collection.$items()).each(function (item) {
                            _this.createItemNode(item, node);
                        });
                        if (this.areSubnodesLimited()) {
                            var nextNode = new navigationTree.Node(this.ctrl, navigationTree.NodeType.Next, this, node);
                            nextNode.caption = ko.pureComputed(function () { return _this.ctrl.datacontext.$localize('NavigationTree$$Next'); });
                            nextNode.parentNode = node;
                            node.children.push(nextNode);
                        }
                    }
                    else {
                        this.projectChildNodes(node);
                    }
                    if (this.pathForValidationErrors) {
                        this.createNodeErrorCount(node, this.pathForValidationErrors);
                    }
                    return node;
                };
                NodeDef.prototype.createItemNode = function (item, collectionNode) {
                    var childNode = new navigationTree.Node(this.ctrl, navigationTree.NodeType.CollectionItem, this, collectionNode);
                    childNode.caption = item[this.itemCaptionAttribute].$asString;
                    childNode.parentNode = collectionNode;
                    childNode.collectionItem = item;
                    if (this.itemValidationErrorsPath) {
                        this.createNodeErrorCount(childNode, this.itemValidationErrorsPath);
                    }
                    else {
                        childNode.errorCount = ko.pureComputed(function () {
                            return item.$validationErrors().length;
                        });
                    }
                    if (this.areSubnodesLimited()) {
                        var nextIndex = _.findLastIndex(collectionNode.children(), function (c) {
                            return c.type === navigationTree.NodeType.Next;
                        });
                        if (nextIndex === -1) {
                            collectionNode.children.push(childNode);
                        }
                        else {
                            collectionNode.children.splice(nextIndex, 0, childNode);
                        }
                    }
                    else {
                        collectionNode.children.push(childNode);
                    }
                    this.projectChildNodes(childNode);
                };
                NodeDef.prototype.projectChildNodes = function (containerNode) {
                    _(this.childrenDef).each(function (def) {
                        def.projectNode(containerNode);
                    });
                };
                NodeDef.prototype.findDataOnPath = function (path, searchFromNode) {
                    var relativeRoot = this.getDataPathRoot(searchFromNode);
                    return this.findDataOnPathInternal(path, relativeRoot);
                };
                NodeDef.prototype.findDataOnPathInternal = function (path, datastruct) {
                    var normalizedPath = path.replace(/\//g, '.');
                    return _.at(datastruct, [normalizedPath])[0];
                };
                NodeDef.prototype.getDataPathRoot = function (node) {
                    var n = node;
                    while (n && n.type !== navigationTree.NodeType.CollectionItem) {
                        n = n.parentNode;
                    }
                    if (n) {
                        return n.collectionItem;
                    }
                    else {
                        return this.ctrl.dataStructDataPathRoot;
                    }
                };
                // ALang interface
                NodeDef.prototype.addNode = function (args) {
                    if (this.ctrl.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.log("Cannot process addNode of NavigationTreeNode at this stage (" + this.ctrl.setupStage + ").");
                        return;
                    }
                    var caption = null;
                    var captionAtt = this.findDataOnPathInternal(args.captionOrCaptionPath, this.ctrl.controlStruct);
                    if (!captionAtt) {
                        captionAtt = this.findDataOnPathInternal(args.captionOrCaptionPath, this.ctrl.controlStructDataPathRoot);
                    }
                    if (captionAtt) {
                        if (captionAtt.$asString) {
                            caption = captionAtt.$asString;
                        }
                        else if (captionAtt.$meta.caption) {
                            caption = captionAtt.$meta.caption;
                        }
                    }
                    caption = caption || args.captionOrCaptionPath;
                    var activeAttName = "is" + args.name + "Active";
                    var markerAttName = "marker" + args.name;
                    var markerTextAttName = "markerText" + args.name;
                    var activeAtt = this.ctrl.controlStruct[activeAttName] &&
                        this.ctrl.controlStruct[activeAttName].$value;
                    if (!activeAtt) {
                        throw new Error("Cannot find attribute " + activeAttName);
                    }
                    var markerAtt = this.ctrl.controlStruct[markerAttName] && this.ctrl.controlStruct[markerAttName].$value;
                    var markerTextAtt = this.ctrl.controlStruct[markerTextAttName] && this.ctrl.controlStruct[markerTextAttName].$value;
                    return this.addChild(args.name, caption, activeAtt, markerAtt, markerTextAtt);
                };
                NodeDef.prototype.showErrorsFrom = function (args) {
                    if (this.ctrl.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.log("Cannot process showErrorsFrom of NavigationTreeNode at this stage (" + this.ctrl.setupStage + ").");
                        return;
                    }
                    this.pathForValidationErrors = args.path;
                };
                NodeDef.prototype.showItemErrorsFrom = function (args) {
                    if (this.ctrl.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.log("Cannot process showItemErrorsFrom of NavigationTreeNode at this stage (" + this.ctrl.setupStage + ").");
                        return;
                    }
                    this.itemValidationErrorsPath = args.path;
                };
                NodeDef.prototype.connectToCollection = function (args) {
                    if (this.ctrl.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.log("Cannot process connectToCollection of NavigationTreeNode at this stage (" + this.ctrl.setupStage + ").");
                        return;
                    }
                    var itemActiveAttName = "is" + this.id + "ItemActive";
                    this.isItemActiveAtt = this.ctrl.controlStruct[itemActiveAttName] &&
                        this.ctrl.controlStruct[itemActiveAttName].$value;
                    if (!this.isItemActiveAtt) {
                        throw new Error("Cannot find attribute " + itemActiveAttName);
                    }
                    this.collectionPath = args.path;
                    this.collectionIndexAtt = this.ctrl.controlStruct["index" + this.id].$value;
                    this.itemCaptionAttribute = args.captionAttName;
                    this.pathForValidationErrors = args.path;
                };
                NodeDef.prototype.limitSubnodesAroundSelected = function (args) {
                    if (this.ctrl.setupStage !== navigationTree.SetupStage.Initiated) {
                        console.log("Cannot process limitSubnodesAroundSelected of NavigationTreeNode at this stage (" + this.ctrl.setupStage + ").");
                        return;
                    }
                    if (args.numberOfSuroundingNodes >= 0) {
                        this.collectionSubnodesLimit = args.numberOfSuroundingNodes;
                    }
                };
                return NodeDef;
            }());
            navigationTree.NodeDef = NodeDef;
        })(navigationTree = components.navigationTree || (components.navigationTree = {}));
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
