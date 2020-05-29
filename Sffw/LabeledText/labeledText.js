var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var labeledtext;
        (function (labeledtext) {
            var LabeledTextModel = /** @class */ (function () {
                function LabeledTextModel(params, componentInfo) {
                    this.displayedText = params.Data;
                    if (params.IsCurrency || params.IsAmount) {
                        this.displayedText = ko.pureComputed(function () {
                            return sffw.formatAsAmountOrCurrency(params.Data(), params.IsAmount, params.IsCurrency, params.MinDecimalPlaces);
                        });
                    }
                    else {
                        this.displayedText = params.Data;
                    }
                }
                return LabeledTextModel;
            }());
            labeledtext.LabeledTextModel = LabeledTextModel;
        })(labeledtext = components.labeledtext || (components.labeledtext = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var labeledtext;
        (function (labeledtext) {
            if (ko && !ko.components.isRegistered('sffw-labeledtext')) {
                ko.components.register('sffw-labeledtext', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.labeledtext.LabeledTextModel(params, componentInfo); }
                    },
                    template: "\n            <div data-bind=\"text: displayedText\" class=\"editor-value\">\n            </div>"
                });
            }
        })(labeledtext = components.labeledtext || (components.labeledtext = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function formatAsAmountOrCurrency(strValue, formatAsAmount, formatAsCurrency, minDecPlaces) {
        if (!strValue) {
            return '';
        }
        if (!formatAsAmount && !formatAsCurrency) {
            return strValue;
        }
        var decimalSign = window.sf.localization.currentCulture().getDecimalSign();
        var thousandSign = window.sf.localization.currentCulture().getThousandSign();
        var places = 0; // pocet destinych pozic
        if (formatAsCurrency) {
            places = 2;
        }
        if (formatAsAmount) {
            places = 6;
        }
        var symbol = '\u20AC'; // euro znak
        var normalizedNumberStr = strValue.replace(decimalSign, '.');
        if (_.isNaN(Number(normalizedNumberStr))) {
            return '';
        }
        var numValue = new Big(normalizedNumberStr);
        var numberParts = numValue.toFixed().split('.');
        var sign = numValue.lt(0) ? '-' : '';
        var integralPart = numValue.abs().round(0, 0).toString(); // absolutní hodnota celočíselné části
        var leftover = integralPart.length > 3 ? (integralPart.length) % 3 : 0;
        var decimalPart = '';
        if (numberParts.length > 1) {
            var decPlacesStr = numberParts[1].substr(0, places);
            if (minDecPlaces && minDecPlaces > 0 && decPlacesStr.length < minDecPlaces) {
                decPlacesStr = decPlacesStr.concat(Array(minDecPlaces - decPlacesStr.length + 1).join("0"));
            }
            decimalPart = "" + decimalSign + decPlacesStr;
        }
        else if (minDecPlaces && minDecPlaces > 0) {
            decimalPart = "" + decimalSign + Array(minDecPlaces + 1).join("0");
        }
        return sign + (leftover ? integralPart.substr(0, leftover) + thousandSign : '') + integralPart.substr(leftover).replace(/(\d{3})(?=\d)/g, '$1' + thousandSign)
            + decimalPart
            + (formatAsCurrency ? " " + symbol : '');
    }
    sffw.formatAsAmountOrCurrency = formatAsAmountOrCurrency;
})(sffw || (sffw = {}));
