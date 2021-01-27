"use strict";
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var keycloakAdapter;
        (function (keycloakAdapter) {
            var KeycloakAdapter = /** @class */ (function () {
                function KeycloakAdapter(datacontext, args) {
                    this.datacontext = datacontext;
                    this.keycloakInitiated = false;
                    this.client = args.client;
                    this.customsOfficeJWTKey = (args.customsOfficeJWTKey === undefined ? 'customsOffice' : args.customsOfficeJWTKey);
                    this.initKeycloakPromise = this.initKeycloak(args);
                    this.onSessionExpired = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'onSessionExpired');
                }
                KeycloakAdapter.prototype.processHeaders = function (headers) {
                    var _this = this;
                    var f = function (resolve, reject) {
                        _this.keycloak.updateToken(30)
                            .then(function () {
                            headers.Authorization = "Bearer " + _this.keycloak.token;
                            resolve();
                        }).catch(function (err) {
                            if (_this.onSessionExpired) {
                                return _this.onSessionExpired()
                                    .then(function () { return reject(new Error("Failed to refresh keycloak token " + err)); });
                            }
                            else {
                                return reject(new Error("Failed to refresh keycloak token " + err));
                            }
                        });
                    };
                    if (this.keycloakInitiated) {
                        return new Promise(f);
                    }
                    else {
                        return this.initKeycloakPromise.then(function () { return new Promise(f); });
                    }
                };
                KeycloakAdapter.prototype.isAuthenticated = function () {
                    var _a;
                    return !!((_a = this.keycloak) === null || _a === void 0 ? void 0 : _a.token);
                };
                KeycloakAdapter.prototype.finishAuthenticationAsync = function () {
                    var _this = this;
                    return this.keycloakInitiated ? Promise.resolve(this.isAuthenticated()) : this.initKeycloakPromise.then(function () { return _this.isAuthenticated(); });
                };
                KeycloakAdapter.prototype.getKeycloakToken = function () {
                    return this.keycloak.token ? JSON.stringify(this.keycloak.tokenParsed) : null;
                };
                KeycloakAdapter.prototype.getRolesArr = function () {
                    var _a, _b;
                    var token = (_a = this.keycloak) === null || _a === void 0 ? void 0 : _a.tokenParsed;
                    if (!token || !this.client) {
                        return undefined;
                    }
                    return (_b = token.resource_access[this.client]) === null || _b === void 0 ? void 0 : _b.roles;
                };
                KeycloakAdapter.prototype.getRoles = function () {
                    var roles = this.getRolesArr();
                    if (!roles || !_.isArray(roles) || roles.length === 0) {
                        return null;
                    }
                    var rolesAsObjects = _(roles).map(function (r) { return ({ role: r }); });
                    return JSON.stringify(rolesAsObjects);
                };
                KeycloakAdapter.prototype.getCustomsOffices = function () {
                    var _a;
                    var token = (_a = this.keycloak) === null || _a === void 0 ? void 0 : _a.tokenParsed;
                    if (!token || !this.customsOfficeJWTKey) {
                        return null;
                    }
                    var offices = token[this.customsOfficeJWTKey];
                    if (!offices || !_.isArray(offices) || offices.length === 0) {
                        return null;
                    }
                    var officesAsObjects = _(offices).map(function (co) { return ({ co: co }); });
                    return JSON.stringify(officesAsObjects);
                };
                KeycloakAdapter.prototype.hasRole = function (role) {
                    var roles = this.getRolesArr();
                    if (!roles || !_.isArray(roles) || roles.length === 0) {
                        return false;
                    }
                    return _.some(roles, function (r) { return r.toUpperCase() === role.toUpperCase(); });
                };
                KeycloakAdapter.prototype.logout = function (args) {
                    this.keycloak.logout({ 'redirectUri': args.redirectUrl });
                };
                KeycloakAdapter.prototype.initKeycloak = function (args) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.keycloak = window.Keycloak({
                            url: args.authServerUrl,
                            realm: args.realm,
                            clientId: args.client
                        });
                        _this.keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then(function (authenticated) {
                            if (!authenticated) {
                                return _this.keycloak.login(); // this will redirect to login
                            }
                            else {
                                _this.keycloakInitiated = true;
                                resolve();
                            }
                        }).catch(function (err) {
                            console.error("Keycloak init error: " + err);
                            reject();
                        });
                    });
                };
                return KeycloakAdapter;
            }());
            keycloakAdapter.KeycloakAdapter = KeycloakAdapter;
        })(keycloakAdapter = api.keycloakAdapter || (api.keycloakAdapter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var keycloakAdapter;
        (function (keycloakAdapter) {
            var KeycloakAdapterApi = /** @class */ (function () {
                function KeycloakAdapterApi(datacontext, args) {
                    this.datacontext = datacontext;
                    this.enabled = args.enabled !== false;
                    this.adapter = this.enabled ? new keycloakAdapter.KeycloakAdapter(datacontext, args) : null;
                }
                KeycloakAdapterApi.prototype.processHeaders = function (headers) {
                    if (this.adapter) {
                        return this.adapter.processHeaders(headers);
                    }
                    else {
                        return Promise.resolve();
                    }
                };
                KeycloakAdapterApi.prototype.isAuthenticated = function () {
                    if (this.adapter) {
                        return this.adapter.isAuthenticated();
                    }
                    else {
                        return false;
                    }
                };
                KeycloakAdapterApi.prototype.finishAuthenticationAsync = function () {
                    return this.adapter ? this.adapter.finishAuthenticationAsync() : Promise.resolve(false);
                };
                KeycloakAdapterApi.prototype.getKeycloakToken = function () {
                    return this.adapter ? this.adapter.getKeycloakToken() : null;
                };
                KeycloakAdapterApi.prototype.getRoles = function () {
                    return this.adapter ? this.adapter.getRoles() : null;
                };
                KeycloakAdapterApi.prototype.getCustomsOffices = function () {
                    return this.adapter ? this.adapter.getCustomsOffices() : null;
                };
                KeycloakAdapterApi.prototype.hasRole = function (args) {
                    return !!(this.adapter && this.adapter.hasRole(args.role));
                };
                KeycloakAdapterApi.prototype.isEnabled = function () {
                    return this.enabled;
                };
                KeycloakAdapterApi.prototype.logout = function (args) {
                    if (this.adapter) {
                        this.adapter.logout(args);
                    }
                };
                return KeycloakAdapterApi;
            }());
            keycloakAdapter.KeycloakAdapterApi = KeycloakAdapterApi;
        })(keycloakAdapter = api.keycloakAdapter || (api.keycloakAdapter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () { return sffw.api.keycloakAdapter.KeycloakAdapterApi; });
}
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
