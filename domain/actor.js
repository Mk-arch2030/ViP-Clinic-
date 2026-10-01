const ACTOR_ROLES = Object.freeze([
  'Doctor',
  'Nurse'
]);

const NURSE_LIFECYCLE = Object.freeze([
  'ACTIVE',
  'DEACTIVATED'
]);

class Actor {
  constructor({
    actorIdentityReference,
    role,
    authorityContext,
    lifecycle
  }) {
    if (!actorIdentityReference) {
      throw new Error('Actor Identity Reference is required');
    }

    if (!ACTOR_ROLES.includes(role)) {
      throw new Error('Invalid Actor Role');
    }

    if (role === 'Nurse' && !NURSE_LIFECYCLE.includes(lifecycle)) {
      throw new Error('Invalid Nurse Lifecycle');
    }

    this.actorIdentityReference = actorIdentityReference;
    this.role = role;
    this.authorityContext = authorityContext;

    if (role === 'Nurse') {
      this.lifecycle = lifecycle;
    }
  }
}

module.exports = {
  Actor,
  ACTOR_ROLES,
  NURSE_LIFECYCLE
};
