const CASE_STATES = Object.freeze([
  'Arrived — Awaiting Registration',
  'Awaiting Doctor',
  'With Doctor',
  'Exited — Follow-up Pending',
  'Completed'
]);

class Case {
  constructor({ patient }) {
    if (!patient) {
      throw new Error('Patient is required');
    }

    this.patient = patient;
    this.state = CASE_STATES[0];
  }
}

module.exports = { Case, CASE_STATES };
