export default class Marketing {
  // is important to remind that [update] is responsible to manage its own errors/exceptions
  // shouldn't have 'await' on notify because the notify's responsibility is just to emit events (notify everyone)
  update({ id, username }) {
    console.log(`[${id}]: [marketing] will send an welcome email to [${username}]`)
  }
}