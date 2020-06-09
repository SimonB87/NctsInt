"use strict";
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var imageButton;
        (function (imageButton) {
            var ImageButtonModel = /** @class */ (function () {
                function ImageButtonModel(params, _componentInfo) {
                    this.tooltip = params.Tooltip;
                    this.caption = params.Caption;
                    this.onClickHandler = params.OnClick;
                    this.isEnabled = params.IsEnabled !== undefined ? params.IsEnabled : true;
                    this.ctx = params.$parentData;
                }
                ImageButtonModel.prototype.onClick = function (model, event) {
                    if (ko.unwrap(this.isEnabled) !== false) {
                        if (this.onClickHandler) {
                            this.onClickHandler(model.ctx, event, { data: this.ctx });
                        }
                    }
                };
                return ImageButtonModel;
            }());
            imageButton.ImageButtonModel = ImageButtonModel;
        })(imageButton = components.imageButton || (components.imageButton = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var imageButton;
        (function (imageButton) {
            var ImageButtonBindindingHandler = /** @class */ (function () {
                function ImageButtonBindindingHandler() {
                    var _this = this;
                    this.update = function (element, valueAccessor) {
                        var caption = ko.unwrap(valueAccessor());
                        var htmlParts = [];
                        if (caption !== null && caption !== undefined) {
                            var parts = _this.parseCaption(caption);
                            // TODO: support images from resources
                            _.each(parts, function (p) {
                                if (p.isFaIcon) {
                                    htmlParts.push("<span><i class=\"fa fa-" + _.escape(p.text) + "\"></i></span>");
                                }
                                else {
                                    if (p.isResImage) {
                                        if (p.text.indexOf('|') !== -1) {
                                            var url = _.escape(p.text.substring(0, p.text.indexOf('|')));
                                            var alt = _.escape(p.text.substring(p.text.indexOf('|') + 1, p.text.length));
                                            htmlParts.push("<img src=\"" + url + "\" alt=\"" + alt + "\">");
                                        }
                                        else {
                                            htmlParts.push("<img src=\"" + _.escape(p.text) + "\">");
                                        }
                                    }
                                    else {
                                        htmlParts.push("<span>" + _.escape(p.text) + "</span>");
                                    }
                                }
                            });
                        }
                        element.innerHTML = htmlParts.join(' ');
                    };
                }
                ImageButtonBindindingHandler.prototype.parseCaption = function (caption) {
                    var parts = caption.split(/(\{(?:fa|img)-.+?\})/g);
                    return _.map(parts, function (s) {
                        if (s.indexOf('{fa-') === 0) {
                            return new CaptionPart(s.substring(4, s.length - 1), true, false);
                        }
                        else {
                            if (s.indexOf('{img-') === 0) {
                                return new CaptionPart(s.substring(5, s.length - 1), false, true);
                            }
                            else {
                                return new CaptionPart(s, false, false);
                            }
                        }
                    });
                };
                return ImageButtonBindindingHandler;
            }());
            imageButton.ImageButtonBindindingHandler = ImageButtonBindindingHandler;
            var CaptionPart = /** @class */ (function () {
                function CaptionPart(text, isFaIcon, isResImage) {
                    this.text = text;
                    this.isFaIcon = isFaIcon;
                    this.isResImage = isResImage;
                }
                return CaptionPart;
            }());
        })(imageButton = components.imageButton || (components.imageButton = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
ko.bindingHandlers.imageButton = new sffw.components.imageButton.ImageButtonBindindingHandler();
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var imageButton;
        (function (imageButton) {
            if (ko && !ko.components.isRegistered('sffw-imagebutton')) {
                ko.components.register('sffw-imagebutton', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new imageButton.ImageButtonModel(params, componentInfo); }
                    },
                    template: "\n<button data-bind=\"imageButton: caption, attr: { title: tooltip }, click: onClick, enable: isEnabled\"></button>"
                });
            }
        })(imageButton = components.imageButton || (components.imageButton = {}));
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
var sffw;
(function (sffw) {
    function extractEventHandlerFromApiArgs(datacontext, args, eventName) {
        if (args.$events && args.$events[eventName] && args.$events[eventName].Reference) {
            if (args.$events[eventName].ReferenceType === 'Global') {
                return datacontext.$globals.$actions[args.$events[eventName].Reference];
            }
            else {
                return datacontext.$actions[args.$events[eventName].Reference];
            }
        }
        return undefined;
    }
    sffw.extractEventHandlerFromApiArgs = extractEventHandlerFromApiArgs;
})(sffw || (sffw = {}));
