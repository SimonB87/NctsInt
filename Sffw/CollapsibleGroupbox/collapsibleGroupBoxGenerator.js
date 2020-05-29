(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
	'use strict';
	var _ = (typeof window !== 'undefined' ? window._ : require('lodash'));

	return {
		generate: function (componentGen, def, componentWrapperTree, isDesignTime) {
		    var cgb, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
		        generateComponentTree = componentGen.generateComponentTree,
		        staticText, classDefs;

            cgb = new componentGen.Tree('collapsible-group-box');

            paramsParts = [];
            if (def.Name) {
                paramsParts.push('Name: \'' + def.Name + '\'');
            }

            if (def.caption) {
                if (def.caption.Binding) {
                    if (def.caption.Binding.Context == '$localized') {
                        paramsParts.push('caption: $root.$localize(\'' + def.caption.Binding.Path[0] + '\')');
                    } else {
                        paramsParts.push('caption: '+ componentGen.processBinding(def.caption.Binding));
                    }
                } else {
                    paramsParts.push('caption: \'' + def.caption.replace(/\"/g, '&quot;') + '\'');
                }
            }

            if (def.isExpanded === false) {
                paramsParts.push('isExpanded: ' + def.isExpanded);
            } else if (def.isExpanded) {
                paramsParts.push('isExpanded: ' + (def.isExpanded.Binding ? processBinding(def.isExpanded.Binding)
                    : '\'' + def.isExpanded.replace(/\"/g, '&quot;') + '\''));
            } else {
                paramsParts.push('isExpanded: ' + true);
            }

            if (def.isVisible === false) {
                paramsParts.push('isVisible: ' + def.isVisible);
            } else if (def.isVisible) {
                paramsParts.push('isVisible: ' + (def.isVisible.Binding ? processBinding(def.isVisible.Binding)
                    : '\'' + def.isVisible.replace(/\"/g, '&quot;') + '\''));
            } else {
                paramsParts.push('isVisible: ' + true);
            }

            if (def.collapsedIconClass) {
                paramsParts.push('collapsedIconClass: \'' + def.collapsedIconClass + '\'');
            }

            if (def.nonCollapsedIconClass) {
                paramsParts.push('nonCollapsedIconClass: \'' + def.nonCollapsedIconClass + '\'');
            }

            if (def.cssClass) {
                paramsParts.push('cssClass: \'' + def.cssClass + '\'');
            }
            
            if (def.conditionalCssClass) {
                cgb.cssBinding = cgb.cssBinding || {};
                _.each(def.conditionalCssClass, function (c) {
                    if (c.ClassName) {
                        var condition;
                        if (c.Condition === false) {
                            condition =  c.Condition;
                        } else if (c.Condition) {
                            condition = c.Condition.Binding ? processBinding(c.Condition.Binding) : '\'' + c.Condition.replace(/\"/g, '&quot;') + '\'';
                        } else {
                            condition = true;
                        }

                        cgb.cssBinding[c.ClassName] = condition;
                    }
                });
            }

            if (def.OnCollapseClick) {
                paramsParts.push('OnCollapseClick: ' + componentGen.processActionReference(def.OnCollapseClick));
            }

            paramsParts.push('$parentData: $data');

            cgb.attributes.params = paramsParts.join(', ');

            if (def.Content) {
                cgb.content.push(generateComponentTree(def.Content, isDesignTime));
            }

            componentWrapperTree.content.push(cgb);
		}
	};
});