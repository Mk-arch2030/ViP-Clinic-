const { randomUUID } = require('node:crypto');

async function openClinicDayService({
  clinicDayRepository,
  workingDate,
  actorRole,
  client,
}) {
  if (actorRole !== 'Doctor') {
    throw new Error('Opening a Clinic Day is strictly reserved for the Doctor.');
  }

  if (!workingDate) {
    throw new Error('Working Date is required.');
  }

  const suffix = randomUUID().replace(/-/g, '').slice(0, 4);
  const clinicDayId = `CD-${workingDate}-${suffix}`;

  return await clinicDayRepository.createClinicDay(
    {
      clinicDayId,
      workingDate,
    },
    client,
  );
}

async function closeClinicDayService({
  clinicDayRepository,
  clinicDayId,
  actorRole,
  client,
}) {
  if (actorRole !== 'Doctor') {
    throw new Error('Closing the Clinic Day is strictly reserved for the Doctor.');
  }

  if (!clinicDayId) {
    throw new Error('Clinic Day ID is required.');
  }

  const closedDay = await clinicDayRepository.closeClinicDay(
    {
      clinicDayId,
      closedBy: 'Doctor',
    },
    client,
  );

  if (!closedDay) {
    throw new Error('Clinic Day not found or already closed.');
  }

  return closedDay;
}

async function getCurrentClinicDayService({
  clinicDayRepository,
  client,
}) {
  return await clinicDayRepository.getCurrentClinicDay(client);
}

async function incrementClinicDayCounterService({
  clinicDayRepository,
  clinicDayId,
  client,
}) {
  if (!clinicDayId) {
    throw new Error('Clinic Day ID is required.');
  }

  return await clinicDayRepository.incrementCounter(clinicDayId, client);
}

module.exports = {
  openClinicDayService,
  closeClinicDayService,
  getCurrentClinicDayService,
  incrementClinicDayCounterService,
};
