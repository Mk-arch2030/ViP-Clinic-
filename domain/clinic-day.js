class ClinicDay {
  constructor({ workingDate }) {
    if (!workingDate) {
      throw new Error('Working Date is required');
    }

    this.workingDate = workingDate;
  }
}

module.exports = { ClinicDay };
