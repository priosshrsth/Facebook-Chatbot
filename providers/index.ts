// @ts-ignore
import { IocContract } from '@adonisjs/fold'
import {FbHook, HookOptions} from '../index';


export default class Index {
  constructor (protected $container: IocContract) {
  }
  
  public register () {
    // Register your own bindings
    this.$container.singleton('Adonis/Addons/FbHook', (app) => {
      const env = app.use('Adonis/Core/Env')
      return new FbHook(<HookOptions> {
        accessToken: env.get('FB_ACCESS_TOKEN'),
        appSecret: env('FB_APP_SECRET'),
        verifyToken: env("FB_VERIFY_TOKEN"),
        allowTypingIndicator: true,
      })
    })
  }
  
  public boot () {
    // IoC container is ready
  }
  
  public shutdown () {
    // Cleanup, since app is going down
  }
  
  public ready () {
    // App is ready
  }
}
