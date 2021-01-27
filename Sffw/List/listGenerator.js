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
		    var list, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
				staticText, columns, filterOptions, actionButtons,
				targetForms, routeParams;

			if (isDesignTime) {
				designLabel = new componentGen.Tree('span');
				designLabel.content.push({ text: 'list ' + def.name });
				componentWrapperTree.content.push(designLabel);
			} else {
				list = new componentGen.Tree('sffw-list');

				paramsParts = [];
				if (def.listName) {
					paramsParts.push('listName: \'' + def.listName + '\'');
				}

				if(def.showCheckboxes){
					if (def.showCheckboxes.Binding) {
						paramsParts.push('showCheckboxes: ' + componentGen.processBinding(def.showCheckboxes.Binding));
					} else {
						paramsParts.push('showCheckboxes: ' + def.showCheckboxes);
					}

				}

				if (def.lastClickedRow && def.lastClickedRow.Binding) {
					paramsParts.push('lastClickedRow: ' + processBinding(def.lastClickedRow.Binding, null));
				}

				if (def.columns) {
					columns = _.map(def.columns, function (c) {
						var resultParts = [];

						if (c.UnderlyingColumnName) {
							resultParts.push('Name: \''+ c.UnderlyingColumnName + '\'');
							if (c.ColumnName) {
								resultParts.push('DisplayColumnName: \'' + c.ColumnName + '\'');
							}
						} else if (c.ColumnName) {
							resultParts.push('Name: \'' + c.ColumnName + '\'');
						}

						if (c.Caption) {
							if (c.Caption.Binding) {
								if (c.Caption.Binding.Context == '$localized') {
									resultParts.push('Caption: \'' + c.Caption.Binding.Path + '\'');
									resultParts.push('IsCaptionLocalized: true');
								} else {
									resultParts.push('Caption: '+ componentGen.processBinding(c.Caption.Binding));
								}
							} else {
								resultParts.push('Caption: \'' + c.Caption.replace(/\"/g, '&quot;') + '\'');
							}
						}

						if (c.UnderlyingDataType) {
							resultParts.push('DataType: \''+ c.UnderlyingDataType + '\'');
							if (c.DataType) {
								resultParts.push('DisplayDataType: \'' + c.DataType + '\'');
							}
						} else if (c.DataType) {
							resultParts.push('DataType: \'' + c.DataType + '\'');
						}

						if (c.IsHtml === true) {
							resultParts.push('IsHtml: ' + c.IsHtml);
						}

						if (c.IsVisible === false) {
							resultParts.push('IsVisible: ' + c.IsVisible);
						}

						if (c.ColumnWidth) {
							resultParts.push('ColumnWidth: \'' + c.ColumnWidth + '\'');
						}

						if (c.EnableFilter === false) {
							resultParts.push('EnableFilter: ' + c.EnableFilter);
						}

						if (c.filterOptions) {
							filterOptions = _.map(c.filterOptions, function (opt) {
								var optParts = [];
								if (opt.text) {
									if (opt.text.Binding) {
										if (opt.text.Binding.Context == '$localized') {
											optParts.push('text: \'' + opt.text.Binding.Path + '\'');
											optParts.push('isLocalized: true');
										} else {
											optParts.push('text: '+ componentGen.processBinding(opt.text.Binding));
										}
									} else {
										optParts.push('text: \'' + opt.text + '\'');
									}
								}
								if (opt.value) {
									optParts.push('value: \'' + opt.value + '\'');
								}
								return '{' + optParts.join(', ') + '}';
							});

							resultParts.push('filterOptions: [' + filterOptions.join(', ') + ']');
						}

						if (c.FilterOperatorType) {
							resultParts.push('FilterOperatorType: \'' + c.FilterOperatorType + '\'');
						}

						if (c.formatAsAmount === true) {
							resultParts.push('formatAsAmount: ' + c.formatAsAmount);
						}

						if (c.formatAsCurrency === true) {
							resultParts.push('formatAsCurrency: ' + c.formatAsCurrency);
						}

						if (c.filterOptionSource && c.filterOptionSource.Reference) {
							resultParts.push('filterOptionSource: ' + (c.filterOptionSource.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + c.filterOptionSource.Reference + '\']');
						}

                        if (c.AlwaysInvisible === true) {
							resultParts.push('AlwaysInvisible: ' + c.AlwaysInvisible);
                        }

                        if (c.filterOptionSourceDisplayMember) {
                            resultParts.push('filterOptionSourceDisplayMember: \''+ c.filterOptionSourceDisplayMember + '\'');
                        }

						return '{' + resultParts.join(', ') + '}';
					});

					paramsParts.push('columns: [' + columns.join(', ') + ']');
				}

				if (def.pagingTemplate) {
					paramsParts.push('pagingTemplate: \'' + def.pagingTemplate + '\'');
				}

				if(def.dataCollection && def.dataCollection.Binding) {
					paramsParts.push('dataCollection: ' + processBinding(def.dataCollection.Binding, null));
				}

				if(def.isMultiselect) {
					paramsParts.push('isMultiselect: ' + def.isMultiselect);
				}

				if (def.controller && def.controller.Reference) {
					paramsParts.push('controller: ' + (def.controller.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + def.controller.Reference + '\']');
				}

				if (def.maxVisibleFilterOptions) {
					if (def.maxVisibleFilterOptions.Binding) {
						paramsParts.push('maxVisibleFilterOptions: ' + componentGen.processBinding(def.maxVisibleFilterOptions.Binding));
					} else {
						paramsParts.push('maxVisibleFilterOptions: ' + def.maxVisibleFilterOptions);
					}
				}

				if(def.allowSelectAll) {
					paramsParts.push('allowSelectAll: ' + def.allowSelectAll);
				}

				if (def.isRowMarkedAttName) {
					paramsParts.push('isRowMarkedAttName: \'' + def.isRowMarkedAttName + '\'');
				}

				if (def.isRowSelectedAttName) {
					paramsParts.push('isRowSelectedAttName: \'' + def.isRowSelectedAttName + '\'');
				}

				if (def.showCheckboxInRowAttName) {
					paramsParts.push('showCheckboxInRowAttName: \'' + def.showCheckboxInRowAttName + '\'');
				}

				if(def.lastClickedRowSelectWhenCheckboxesOff) {
					paramsParts.push('lastClickedRowSelectWhenCheckboxesOff: ' + def.lastClickedRowSelectWhenCheckboxesOff);
				}

				if (def.pagingControlsPosition) {
					paramsParts.push('pagingControlsPosition: \'' + def.pagingControlsPosition + '\'');
				}

				if (def.savedState && def.savedState.Binding) {
					paramsParts.push('savedState: ' + processBinding(def.savedState.Binding));
				}

				if (def.savedStateOptions) {
					paramsParts.push('savedStateOptions: \'' + def.savedStateOptions + '\'');
				}

				if (def.savedColumns && def.savedColumns.Binding) {
					paramsParts.push('savedColumns: ' + processBinding(def.savedColumns.Binding));
				}

				if (def.allowFilterClearIcon) {
					paramsParts.push('allowFilterClearIcon: ' + def.allowFilterClearIcon);
                }

                if (def.useArrowKeys) {
					paramsParts.push('useArrowKeys: ' + def.useArrowKeys);
                }

                if (def.viewSettingsButtonTitle) {
                    if (def.viewSettingsButtonTitle.Binding) {
                        paramsParts.push('viewSettingsButtonTitle: '+ componentGen.processBinding(def.viewSettingsButtonTitle.Binding));
                    } else {
                        paramsParts.push('viewSettingsButtonTitle: \'' + def.viewSettingsButtonTitle.replace(/\"/g, '&quot;') + '\'');
                    }
                }

				paramsParts.push('$parentData: $data');

				list.attributes.params = paramsParts.join(', ');

				if (def.OnSelectionChange) {
		            list.attributes.params += ', onSelectionChange: ' + componentGen.processActionReference(def.OnSelectionChange);
				}

				if (def.OnRowClicked) {
		            list.attributes.params += ', onRowClicked: ' + componentGen.processActionReference(def.OnRowClicked);
		        }

				if (def.OnRowsChanged) {
		            list.attributes.params += ', onRowsChanged: ' + componentGen.processActionReference(def.OnRowsChanged);
		        }

				if (def.OnViewSettingsButtonClicked) {
		            list.attributes.params += ', onViewSettingsButtonClicked: ' + componentGen.processActionReference(def.OnViewSettingsButtonClicked);
		        }

				componentWrapperTree.content.push(list);
			}
		}
	};
});