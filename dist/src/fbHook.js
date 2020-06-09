"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbHook = void 0;
var Chat_1 = require("./Chat");
var Conversation_1 = require("./Conversation");
var eventemitter3_1 = require("eventemitter3");
var crypto = require("crypto");
var fetch = require("node-fetch");
var normalize_string_1 = require("./utils/normalize-string");
var FbHook = /** @class */ (function (_super) {
    __extends(FbHook, _super);
    function FbHook(options) {
        var _this = _super.call(this) || this;
        _this.allowTypingIndicator = false;
        if (!options || (options && (!options.accessToken || !options.verifyToken || !options.appSecret))) {
            throw new Error('You need to specify an accessToken, verifyToken and appSecret');
        }
        if (options.personaID) {
            _this.personaID = options.personaID;
        }
        else if (options.persona) {
            _this.getPersona(options.persona).then();
        }
        _this.accessToken = options.accessToken;
        _this.verifyToken = options.verifyToken;
        _this.appSecret = options.appSecret;
        _this.broadcastEchoes = options.broadcastEchoes || false;
        _this.webhook = options.webhook || '/webhook';
        _this.webhook = _this.webhook.charAt(0) !== '/' ? "/" + _this.webhook : _this.webhook;
        //this.app.use(bodyParser.json({ verify: this._verifyRequestSignature.bind(this) }));
        _this._hearMap = [];
        if ('allowTypingIndicator' in options) {
            _this.allowTypingIndicator = Boolean(options.allowTypingIndicator);
        }
        _this._conversations = [];
        return _this;
    }
    FbHook.prototype.close = function () {
        console.log('Hmm...! Got close request for app!');
    };
    FbHook.prototype.sendTextMessage = function (recipientId, text, quickReplies, options) {
        var message = { text: text };
        var formattedQuickReplies = this._formatQuickReplies(quickReplies);
        if (formattedQuickReplies && formattedQuickReplies.length > 0) {
            message.quick_replies = formattedQuickReplies;
        }
        return this.sendMessage(recipientId, message, options);
    };
    FbHook.prototype.sendButtonTemplate = function (recipientId, text, buttons, options) {
        var payload = {
            template_type: 'button',
            text: text
        };
        payload.buttons = this._formatButtons(buttons);
        return this.sendTemplate(recipientId, payload, options);
    };
    FbHook.prototype.sendGenericTemplate = function (recipientId, elements, options) {
        var payload = {
            template_type: 'generic',
            elements: elements
        };
        options && options.imageAspectRatio && (payload.image_aspect_ratio = options.imageAspectRatio) && (delete options.imageAspectRatio);
        return this.sendTemplate(recipientId, payload, options);
    };
    FbHook.prototype.sendListTemplate = function (recipientId, elements, buttons, options) {
        var payload = {
            template_type: 'list',
            elements: elements
        };
        options && options.topElementStyle && (payload.top_element_style = options.topElementStyle) && (delete options.topElementStyle);
        buttons && buttons.length && (payload.buttons = this._formatButtons([buttons[0]]));
        return this.sendTemplate(recipientId, payload, options);
    };
    FbHook.prototype.sendTemplate = function (recipientId, payload, options) {
        var message = {
            attachment: {
                type: 'template',
                payload: payload
            }
        };
        return this.sendMessage(recipientId, message, options);
    };
    FbHook.prototype.sendAttachment = function (recipientId, type, url, quickReplies, options) {
        var message = {
            attachment: {
                type: type,
                payload: { url: url }
            }
        };
        var formattedQuickReplies = this._formatQuickReplies(quickReplies);
        if (formattedQuickReplies && formattedQuickReplies.length > 0) {
            message.quick_replies = formattedQuickReplies;
        }
        return this.sendMessage(recipientId, message, options);
    };
    FbHook.prototype.sendAction = function (recipientId, action) {
        var recipient = this._createRecipient(recipientId);
        return this.sendRequest({
            recipient: recipient,
            sender_action: action
        });
    };
    FbHook.prototype.sendMessage = function (recipientId, message, options) {
        var _this = this;
        var recipient = this._createRecipient(recipientId);
        var onDelivery = options && options.onDelivery;
        var onRead = options && options.onRead;
        var req = function () { return (_this.sendRequest({
            recipient: recipient,
            message: message
        }).then(function (json) {
            if (typeof onDelivery === 'function') {
                _this.once('delivery', onDelivery);
            }
            if (typeof onRead === 'function') {
                _this.once('read', onRead);
            }
            return json;
        })); };
        var sendTypingIndicator = this.allowTypingIndicator;
        if (options && options.hasOwnProperty('typing')) {
            sendTypingIndicator = options.typing;
        }
        if (sendTypingIndicator) {
            var autoTimeout = (message && message.text) ? message.text.length * 10 : 1000;
            var timeout = (typeof options.typing === 'number') ? options.typing : autoTimeout;
            return this.sendTypingIndicator(recipientId, timeout).then(req);
        }
        return req();
    };
    FbHook.prototype.sendRequest = function (body, endpoint, method) {
        if (this.personaID) {
            body.persona_id = this.personaID;
        }
        endpoint = endpoint || 'messages';
        method = method || 'POST';
        return fetch("https://graph.facebook.com/v2.6/me/" + endpoint + "?access_token=" + this.accessToken, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (res.error) {
                console.log('Messenger Error received. For more information about error codes, see: https://goo.gl/d76uvB');
                console.log(res.error);
            }
            return res;
        })
            .catch(function (err) { return console.log("Error sending message: " + err); });
    };
    FbHook.prototype.sendThreadRequest = function (body, method) {
        console.log("\n      sendThreadRequest: Dreprecation warning. Thread API has been replaced by the Messenger Profile API.\n      Please update your code to use the sendProfileRequest() method instead.");
        return this.sendRequest(body, 'thread_settings', method);
    };
    FbHook.prototype.sendProfileRequest = function (body, method) {
        return this.sendRequest(body, 'messenger_profile', method);
    };
    FbHook.prototype.sendTypingIndicator = function (recipientId, milliseconds) {
        var _this = this;
        var timeout = isNaN(milliseconds) ? 0 : milliseconds;
        if (milliseconds > 20000) {
            milliseconds = 20000;
            console.error("sendTypingIndicator: max milliseconds value is " + milliseconds + " (" + milliseconds / 1000 + " seconds)");
        }
        return new Promise(function (resolve) {
            return _this.sendAction(recipientId, 'typing_on').then(function () {
                setTimeout(function () { return _this.sendAction(recipientId, 'typing_off').then(function (json) { return resolve(json); }); }, timeout);
            });
        });
    };
    FbHook.prototype.getUserProfile = function (userId) {
        var url = "https://graph.facebook.com/v2.6/" + userId + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + this.accessToken;
        return fetch(url)
            .then(function (res) { return res.json(); })
            .catch(function (err) { return console.log("Error getting user profile: " + err); });
    };
    FbHook.prototype.getPersona = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var self, personaID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        personaID = self.personaID;
                        if (personaID) {
                            return [2 /*return*/, personaID];
                        }
                        return [4 /*yield*/, fetch("https://graph.facebook.com/me/personas?access_token=" + this.accessToken, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (data) {
                                personaID = self.personaID = data.id;
                            })
                                .catch(function (err) { return console.log("Error getting user profile: " + err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, personaID];
                }
            });
        });
    };
    FbHook.prototype.setGreetingText = function (text) {
        var greeting = (typeof text !== 'string') ? text : [{
                locale: 'default',
                text: text
            }];
        return this.sendProfileRequest({ greeting: greeting });
    };
    FbHook.prototype.setGetStartedButton = function (action) {
        var payload = (typeof action === 'string') ? action : 'BOOTBOT_GET_STARTED';
        if (typeof action === 'function') {
            this.on("postback:" + payload, action);
        }
        return this.sendProfileRequest({
            get_started: {
                payload: payload
            }
        });
    };
    FbHook.prototype.deleteGetStartedButton = function () {
        return this.sendProfileRequest({
            fields: [
                'get_started'
            ]
        }, 'DELETE');
    };
    FbHook.prototype.setPersistentMenu = function (buttons, disableInput) {
        if (buttons && buttons[0] && buttons[0].locale !== undefined) {
            // Received an array of locales, send it as-is.
            return this.sendProfileRequest({ persistent_menu: buttons });
        }
        // If it's not an array of locales, we'll assume is an array of buttons.
        var formattedButtons = this._formatButtons(buttons);
        return this.sendProfileRequest({
            persistent_menu: [{
                    locale: 'default',
                    composer_input_disabled: disableInput || false,
                    call_to_actions: formattedButtons
                }]
        });
    };
    FbHook.prototype.deletePersistentMenu = function () {
        return this.sendProfileRequest({
            fields: [
                'persistent_menu'
            ]
        }, 'DELETE');
    };
    FbHook.prototype.say = function (recipientId, message, options) {
        var _this = this;
        if (typeof message === 'string') {
            return this.sendTextMessage(recipientId, message, [], options);
        }
        else if (message && message.quickReplies) {
            if (message.quickReplies.length > 0) {
                return this.sendTextMessage(recipientId, message.text || '', message.quickReplies, options);
            }
        }
        else if (message && message.buttons) {
            if (message.buttons.length > 0) {
                return this.sendButtonTemplate(recipientId, message.text || '', message.buttons, options);
            }
        }
        else if (message && message.attachment) {
            return this.sendAttachment(recipientId, message.attachment, message.url, message.quickReplies, options);
        }
        else if (message && message.elements && message.buttons) {
            return this.sendListTemplate(recipientId, message.elements, message.buttons, options);
        }
        else if (message && message.cards) {
            return this.sendGenericTemplate(recipientId, message.cards, options);
        }
        else if (Array.isArray(message)) {
            return message.reduce(function (promise, msg) {
                return promise.then(function () { return _this.say(recipientId, msg, options); });
            }, Promise.resolve());
        }
        console.error('Invalid format for .say() message.');
    };
    FbHook.prototype.hear = function (keywords, callback) {
        var _this = this;
        keywords = Array.isArray(keywords) ? keywords : [keywords];
        keywords.forEach(function (keyword) { return _this._hearMap.push({ keyword: keyword, callback: callback }); });
        return this;
    };
    FbHook.prototype.module = function (factory) {
        return factory.apply(this, [this]);
    };
    FbHook.prototype.conversation = function (recipientId, factory) {
        var _this = this;
        if (!recipientId || !factory || typeof factory !== 'function') {
            return console.error("You need to specify a recipient and a callback to start a conversation");
        }
        var convo = new Conversation_1.Conversation(this, recipientId);
        this._conversations.push(convo);
        convo.on('end', function (endedConvo) {
            var removeIndex = _this._conversations.indexOf(endedConvo);
            _this._conversations.splice(removeIndex, 1);
        });
        factory.apply(this, [convo]);
        return convo;
    };
    FbHook.prototype._formatButtons = function (buttons) {
        return buttons && buttons.map(function (button) {
            if (typeof button === 'string') {
                return {
                    type: 'postback',
                    title: button,
                    payload: 'BOOTBOT_BUTTON_' + normalize_string_1.default(button)
                };
            }
            else if (button && button.type) {
                return button;
            }
            return {};
        });
    };
    FbHook.prototype._formatQuickReplies = function (quickReplies) {
        return quickReplies && quickReplies.map(function (reply) {
            if (typeof reply === 'string') {
                return {
                    content_type: 'text',
                    title: reply,
                    payload: 'BOOTBOT_QR_' + normalize_string_1.default(reply)
                };
            }
            else if (reply && reply.title) {
                return Object.assign({
                    content_type: 'text',
                    payload: 'BOOTBOT_QR_' + normalize_string_1.default(reply.title)
                }, reply);
            }
            return reply;
        });
    };
    FbHook.prototype._handleEvent = function (type, event, data) {
        var recipient = (type === 'authentication' && !event.sender) ? { user_ref: event.optin.user_ref } : event.sender.id;
        var chat = new Chat_1.Chat(this, recipient);
        this.emit(type, event, chat, data);
    };
    FbHook.prototype._handleMessageEvent = function (event) {
        var _this = this;
        if (this._handleConversationResponse('message', event)) {
            return;
        }
        var text = event.message.text;
        var senderId = event.sender.id;
        var captured = false;
        if (!text) {
            return;
        }
        this._hearMap.forEach(function (hear) {
            if (typeof hear.keyword === 'string' && hear.keyword.toLowerCase() === text.toLowerCase()) {
                var res = hear.callback.apply(_this, [event, new Chat_1.Chat(_this, senderId), {
                        keyword: hear.keyword,
                        captured: captured
                    }]);
                captured = true;
                return res;
            }
            else if (hear.keyword instanceof RegExp && hear.keyword.test(text)) {
                var res = hear.callback.apply(_this, [event, new Chat_1.Chat(_this, senderId), {
                        keyword: hear.keyword,
                        match: text.match(hear.keyword),
                        captured: captured
                    }]);
                captured = true;
                return res;
            }
        });
        this._handleEvent('message', event, { captured: captured });
    };
    FbHook.prototype._handleAttachmentEvent = function (event) {
        if (this._handleConversationResponse('attachment', event)) {
            return;
        }
        this._handleEvent('attachment', event);
    };
    FbHook.prototype._handlePostbackEvent = function (event) {
        if (this._handleConversationResponse('postback', event)) {
            return;
        }
        var payload = event.postback.payload;
        if (payload) {
            this._handleEvent("postback:" + payload, event);
        }
        this._handleEvent('postback', event);
    };
    FbHook.prototype._handleQuickReplyEvent = function (event) {
        if (this._handleConversationResponse('quick_reply', event)) {
            return;
        }
        var payload = event.message.quick_reply && event.message.quick_reply.payload;
        if (payload) {
            this._handleEvent("quick_reply:" + payload, event);
        }
        this._handleEvent('quick_reply', event);
    };
    FbHook.prototype._handleConversationResponse = function (type, event) {
        var userId = event.sender.id;
        var captured = false;
        this._conversations.forEach(function (convo) {
            if (userId && userId === convo.userId && convo.isActive()) {
                captured = true;
                return convo.respond(event, { type: type });
            }
        });
        return captured;
    };
    FbHook.prototype._createRecipient = function (recipient) {
        return (typeof recipient === 'object') ? recipient : { id: recipient };
    };
    FbHook.prototype.verify = function (params) {
        return params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === this.verifyToken ? params['hub.challenge'] : false;
    };
    FbHook.prototype.handleFacebookData = function (data) {
        var _this = this;
        // Iterate over each entry. There may be multiple if batched.
        data.entry.forEach(function (entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message && event.message.is_echo && !_this.broadcastEchoes) {
                    return;
                }
                if (event.optin) {
                    _this._handleEvent('authentication', event);
                }
                else if (event.message && event.message.text) {
                    _this._handleMessageEvent(event);
                    if (event.message.quick_reply) {
                        _this._handleQuickReplyEvent(event);
                    }
                }
                else if (event.message && event.message.attachments) {
                    _this._handleAttachmentEvent(event);
                }
                else if (event.postback) {
                    _this._handlePostbackEvent(event);
                }
                else if (event.delivery) {
                    _this._handleEvent('delivery', event);
                }
                else if (event.read) {
                    _this._handleEvent('read', event);
                }
                else if (event.account_linking) {
                    _this._handleEvent('account_linking', event);
                }
                else if (event.referral) {
                    _this._handleEvent('referral', event);
                }
                else {
                    console.log('Webhook received unknown event: ', event);
                }
            });
        });
    };
    // @ts-ignore
    FbHook.prototype._verifyRequestSignature = function (req, res, buf) {
        var signature = req.headers['x-hub-signature'];
        if (!signature) {
            throw new Error('Couldn\'t validate the request signature.');
        }
        else {
            var elements = signature.split('=');
            // @ts-ignore
            var method = elements[0];
            var signatureHash = elements[1];
            var expectedHash = crypto.createHmac('sha1', this.appSecret)
                .update(buf)
                .digest('hex');
            if (signatureHash != expectedHash) {
                throw new Error('Couldn\'t validate the request signature.');
            }
        }
    };
    return FbHook;
}(eventemitter3_1.EventEmitter));
exports.FbHook = FbHook;
