const ACTOR_ROLES = Object.freeze([
  'Doctor',
  'Nurse'
]);

const ACTOR_LIFECYCLE = Object.freeze([
  'ACTIVE',
  'DEACTIVATED'
]);

// Preserve the existing Nurse vocabulary as a compatibility alias.
const NURSE_LIFECYCLE = ACTOR_LIFECYCLE;

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

    if (role === 'Doctor' && lifecycle !== undefined && !ACTOR_LIFECYCLE.includes(lifecycle)) {
      throw new Error('Invalid Doctor Lifecycle');
    }

    this.actorIdentityReference = actorIdentityReference;
    this.role = role;
    this.authorityContext = authorityContext;

    // Legacy Doctors may omit lifecycle; omission must not imply ACTIVE.
    if (role === 'Nurse' || lifecycle !== undefined) {
      this.lifecycle = lifecycle;
    }
  }
}

module.exports = {
  Actor,
  ACTOR_ROLES,
  ACTOR_LIFECYCLE,
  NURSE_LIFECYCLE
};
