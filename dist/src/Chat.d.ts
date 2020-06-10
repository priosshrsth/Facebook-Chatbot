import { EventEmitter } from 'eventemitter3';
export interface ChatOptions {
    typing?: boolean;
    onDelivery?: Function;
    onRead?: Function;
}
export declare class Chat extends EventEmitter {
    bot: any;
    userId: any;
    constructor(bot: any, userId: any);
    say(message: any, options?: ChatOptions): any;
    sendTextMessage(text: any, quickReplies: any, options?: ChatOptions): any;
    sendButtonTemplate(text: any, buttons: any, options?: ChatOptions): any;
    sendGenericTemplate(cards: any, options?: ChatOptions): any;
    sendListTemplate(elements: any, buttons: any, options?: ChatOptions): any;
    sendTemplate(payload: any, options?: ChatOptions): any;
    sendAttachment(type: any, url: any, quickReplies?: any, options?: ChatOptions): any;
    sendAction(action: any, options?: ChatOptions): any;
    sendMessage(message: any, options?: ChatOptions): any;
    sendRequest(body: any, endpoint: any, method: any): any;
    sendTypingIndicator(milliseconds: any): any;
    getUserProfile(): any;
    conversation(factory: any): any;
}
