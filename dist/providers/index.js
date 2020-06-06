"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var Index = /** @class */ (function () {
    function Index($container) {
        this.$container = $container;
    }
    Index.prototype.register = function () {
        // Register your own bindings
        this.$container.singleton('Adonis/Addons/FbHook', function (app) {
            var env = app.use('Adonis/Core/Env');
            return new index_1.FbHook({
                accessToken: env.get('FB_ACCESS_TOKEN'),
                appSecret: env('FB_APP_SECRET'),
                verifyToken: env("FB_VERIFY_TOKEN"),
                allowTypingIndicator: true,
            });
        });
    };
    Index.prototype.boot = function () {
        // IoC container is ready
    };
    Index.prototype.shutdown = function () {
        // Cleanup, since app is going down
    };
    Index.prototype.ready = function () {
        // App is ready
    };
    return Index;
}());
exports.default = Index;
