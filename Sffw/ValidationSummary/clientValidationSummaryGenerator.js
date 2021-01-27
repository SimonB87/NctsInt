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
		    var valSummary, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
		        staticText, colDefs;

			if (isDesignTime) {
				designLabel = new componentGen.Tree('span');
				designLabel.content.push({ text: 'clientValidationSummary ' + def.Name });
				componentWrapperTree.content.push(designLabel);
			} else {
				valSummary = new componentGen.Tree('sffw-clientvalidation-summary');

				paramsParts = [];
				if (def.Name) {
					paramsParts.push('Name: \'' + def.Name + '\'');
                }

                if (def.isVisible === false) {
                    paramsParts.push('isVisible: ' + def.isVisible);
                } else if (def.isVisible) {
                    paramsParts.push('isVisible: ' + (def.isVisible.Binding ? processBinding(def.isVisible.Binding)
                        : '\'' + def.isVisible.replace(/\"/g, '&quot;') + '\''));
                } else {
                    paramsParts.push('isVisible: ' + true);
                }

                if (def.validationRoot && def.validationRoot.Binding) {
					paramsParts.push('validationRoot: ' + processBinding(def.validationRoot.Binding, null));
				}

                if (def.validationErrors && def.validationErrors.Binding) {
					paramsParts.push('validationErrors: ' + processBinding(def.validationErrors.Binding, null));
				}

                if (def.errorPointerMap && def.errorPointerMap.Reference) {
					paramsParts.push('errorPointerMap: ' + (def.errorPointerMap.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + def.errorPointerMap.Reference + '\']');
				}

				if (def.columns) {
					colDefs = _.map(def.columns, function (c) {
						var resultParts = [];
						resultParts.push('propertyName: \'' + c.propertyName + '\'');

						if (c.columnCaption) {
							if (c.columnCaption.Binding) {
								if (c.columnCaption.Binding.Context == '$localized') {
									resultParts.push('columnCaption: \'' + c.columnCaption.Binding.Path + '\'');
									resultParts.push('isCaptionLocalized: true');
								} else {
									resultParts.push('columnCaption: '+ componentGen.processBinding(c.columnCaption.Binding));
								}

							} else {
								resultParts.push('columnCaption: \'' + c.columnCaption.replace(/\"/g, '&quot;') + '\'');
							}
                        }

                        if (c.columnWidth) {
							resultParts.push('columnWidth: \'' + c.columnWidth + '\'');
						}

                        if (c.columnRole) {
							resultParts.push('columnRole: \'' + c.columnRole + '\'');
						}

						return '{' + resultParts.join(', ') + '}';
					});

					paramsParts.push('columns: [' + colDefs.join(', ') + ']');
				}

				if (def.errorMessageAttName) {
					paramsParts.push('errorMessageAttName: \'' + def.errorMessageAttName + '\'');
				}

				if (def.pointerAttName) {
					paramsParts.push('pointerAttName: \'' + def.pointerAttName + '\'');
				}

				if (def.validatorTypeAttName) {
					paramsParts.push('validatorTypeAttName: \'' + def.validatorTypeAttName + '\'');
                }

                if (def.conditionalCssClass) {
                    valSummary.cssBinding = valSummary.cssBinding || {};
                    _.each(def.conditionalCssClass, function (c) {
                        var condition;
                        if (c.ClassName) {
                            if (c.Condition === false) {
                                condition =  c.Condition;
                            } else if (c.Condition) {
                                condition = c.Condition.Binding ? processBinding(c.Condition.Binding) : '\'' + c.Condition.replace(/\"/g, '&quot;') + '\'';
                            } else {
                                condition = true;
                            }
                        }

                        valSummary.cssBinding[c.ClassName] = condition;
                    });
                }

				if (def.OnItemClick) {
					paramsParts.push('OnItemClick: ' + componentGen.processActionReference(def.OnItemClick));
				}

                paramsParts.push('$parentData: $data');

                valSummary.attributes.params = paramsParts.join(', ');

				componentWrapperTree.content.push(valSummary);
			}
		}
	};
});