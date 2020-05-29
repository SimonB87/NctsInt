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
		    var tabcontrol, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
		        staticText, tabDefs;

			if (isDesignTime) {
				designLabel = new componentGen.Tree('span');
				designLabel.content.push({ text: 'tabcontrol ' + def.Name });
				componentWrapperTree.content.push(designLabel);
			} else {
				tabcontrol = new componentGen.Tree('sffw-tabcontrol');

				paramsParts = [];
				if (def.Name) {
					paramsParts.push('Name: \'' + def.Name + '\'');
				}

				if (def.Tabs) {
					tabDefs = _.map(def.Tabs, function (t) {
						var resultParts = [];
						resultParts.push('Name: \'' + t.Name + '\'');

						if (t.Title) {
							if (t.Title.Binding) {
								if (t.Title.Binding.Context == '$localized') {
									resultParts.push('Title: \'' + t.Title.Binding.Path + '\'');
									resultParts.push('IsTitleLocalized: true');
								} else {
									resultParts.push('Title: '+ componentGen.processBinding(t.Title.Binding));
								}

							} else {
								resultParts.push('Title: \'' + t.Title.replace(/\"/g, '&quot;') + '\'');
							}
						}

						if (t.Visible === false) {
							resultParts.push('Visible: ' + t.Visible);
						} else if (t.Visible) {
							resultParts.push('Visible: '
							+ (t.Visible.Binding
								? processBinding(t.Visible.Binding)
								: '\'' + t.Visible.replace(/\"/g, '&quot;') + '\''));
						} else {
							resultParts.push('Visible: ' + true);
						}

						if (t.CustomCssClass) {
							resultParts.push('CustomCssClass: '
							+ (t.CustomCssClass.Binding
								? processBinding(t.CustomCssClass.Binding)
								: '\'' + t.CustomCssClass.replace(/\"/g, '&quot;') + '\''));
						}

						if (t.AriaControls) {
							resultParts.push('AriaControls: ' + '\'' + t.AriaControls.replace(/\"/g, '&quot;') + '\'');
						}

						if (t.OnTabClick) {
							resultParts.push('OnTabClick: ' + componentGen.processActionReference(t.OnTabClick));
						}

						return '{' + resultParts.join(', ') + '}';
					});

					paramsParts.push('Tabs: [' + tabDefs.join(', ') + ']');
				}

				if (def.SelectedTab) {
			        if (def.SelectedTab.Binding) {
			            paramsParts.push('SelectedTab: ' + componentGen.processBinding(def.SelectedTab.Binding));
			        }
			    }

				if (def.OnTabClick) {
					paramsParts.push('OnTabClick: ' + componentGen.processActionReference(def.OnTabClick));
			    }

				tabcontrol.attributes.params = paramsParts.join(', ');

				componentWrapperTree.content.push(tabcontrol);
			}
		}
	};
});