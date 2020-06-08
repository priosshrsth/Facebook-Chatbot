import { IocContract } from '@adonisjs/fold';
export default class FbHookProvider {
    protected $container: IocContract;
    constructor($container: IocContract);
    register(): void;
    boot(): void;
    shutdown(): void;
    ready(): void;
}
