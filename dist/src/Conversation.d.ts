import { Chat } from './Chat';
export declare class Conversation extends Chat {
    bot: any;
    userId: any;
    private context;
    private waitingForAnswer;
    private listeningAnswer;
    private listeningCallbacks;
    private active;
    constructor(bot: any, userId: any);
    ask(question: any, answer: Function, callbacks?: any, options?: {}): void | this;
    respond(payload: any, data: any): any;
    isActive(): boolean;
    isWaitingForAnswer(): any;
    stopWaitingForAnswer(): void;
    start(): this;
    end(): this;
    get(property: any): any;
    set(property: any, value: any): any;
}
