// @ts-ignore
import { IocContract } from '@adonisjs/fold'
import {FbHook, HookOptions, PersonaOptions} from '../index';

export default class FbHookProvider {
  constructor (protected $container: IocContract) {
  }
  
  public register () {
    // Register your own bindings
    this.$container.singleton('Adonis/Addons/FbHook', (app) => {
      const env = app.use('Adonis/Core/Env')
      return new FbHook(<HookOptions> {
        accessToken: env.get('FB_ACCESS_TOKEN'),
        appSecret: env.get('FB_APP_SECRET'),
        verifyToken: env.get("FB_VERIFY_TOKEN"),
        allowTypingIndicator: true,
        personaID: env.get("FB_PERSONA_ID"),
        persona: <PersonaOptions> {
          name: env.get("FB_PERSONA_NAME"),
          profile_picture_url: env.get('FB_PERSONA_IMAGE')
        }
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
