"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var FbHookProvider = /** @class */ (function () {
    function FbHookProvider($container) {
        this.$container = $container;
    }
    FbHookProvider.prototype.register = function () {
        // Register your own bindings
        this.$container.singleton('Adonis/Addons/FbHook', function (app) {
            var env = app.use('Adonis/Core/Env');
            return new index_1.FbHook({
                accessToken: env.get('FB_ACCESS_TOKEN'),
                appSecret: env.get('FB_APP_SECRET'),
                verifyToken: env.get("FB_VERIFY_TOKEN"),
                allowTypingIndicator: true,
                personaID: env.get("FB_PERSONA_ID"),
                persona: {
                    name: env.get("FB_PERSONA_NAME"),
                    profile_picture_url: env.get('FB_PERSONA_IMAGE')
                }
            });
        });
    };
    FbHookProvider.prototype.boot = function () {
        // IoC container is ready
    };
    FbHookProvider.prototype.shutdown = function () {
        // Cleanup, since app is going down
    };
    FbHookProvider.prototype.ready = function () {
        // App is ready
    };
    return FbHookProvider;
}());
exports.default = FbHookProvider;
