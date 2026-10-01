const VISIT_TYPE = 'Visit & Consultation';

class Visit {
  constructor({ caseRecord, clinicDay }) {
    if (!caseRecord) {
      throw new Error('Case is required');
    }

    if (!clinicDay) {
      throw new Error('Clinic Day is required');
    }

    this.case = caseRecord;
    this.clinicDay = clinicDay;
    this.visitType = VISIT_TYPE;
  }
}

module.exports = { Visit, VISIT_TYPE };
