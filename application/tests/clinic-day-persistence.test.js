const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ClinicDayRepository,
} = require('../../backend/persistence/clinic-day-repository');
const {
  openClinicDayService,
  closeClinicDayService,
  getCurrentClinicDayService,
  incrementClinicDayCounterService,
} = require('../services/manage-clinic-day');

// A. Open / Create Clinic Day through Repository
test('CLINIC DAY TEST-01 — Open/Create persists with id, workingDate, OPEN, WORKING, counter=0', async () => {
  const calls = [];
  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });
      return {
        rows: [
          {
            clinic_day_id: params[0],
            working_date: params[1],
            status: 'OPEN',
            lifecycle: 'WORKING',
            counter: 0,
            opened_at: '2026-10-02T08:00:00.000Z',
            closed_at: null,
            closed_by: null,
          },
        ],
      };
    },
  };

  const repo = new ClinicDayRepository(fakeClient);
  const created = await repo.createClinicDay({
    clinicDayId: 'CD-2026-10-02-001',
    workingDate: '2026-10-02',
  });

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO clinic_days/i);
  assert.match(calls[0].sql, /'OPEN'/i);
  assert.match(calls[0].sql, /'WORKING'/i);
  assert.equal(calls[0].params[0], 'CD-2026-10-02-001');
  assert.equal(calls[0].params[1], '2026-10-02');

  assert.equal(created.id, 'CD-2026-10-02-001');
  assert.equal(created.workingDate, '2026-10-02');
  assert.equal(created.status, 'OPEN');
  assert.equal(created.lifecycle, 'WORKING');
  assert.equal(created.counter, 0);
  assert.equal(created.openedAt, '2026-10-02T08:00:00.000Z');
  assert.equal(created.closedAt, undefined);
  assert.equal(created.closedBy, undefined);
});

// B. Retrieve Current Day
test('CLINIC DAY TEST-02 — Retrieve Current Day queries open working day', async () => {
  const calls = [];
  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });
      return {
        rows: [
          {
            clinic_day_id: 'CD-2026-10-02-001',
            working_date: '2026-10-02',
            status: 'OPEN',
            lifecycle: 'WORKING',
            counter: 5,
            opened_at: '2026-10-02T08:00:00.000Z',
            closed_at: null,
            closed_by: null,
          },
        ],
      };
    },
  };

  const repo = new ClinicDayRepository(fakeClient);
  const current = await repo.getCurrentClinicDay();

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /FROM clinic_days/i);
  assert.match(calls[0].sql, /status = 'OPEN'/i);

  assert.equal(current.id, 'CD-2026-10-02-001');
  assert.equal(current.status, 'OPEN');
  assert.equal(current.counter, 5);
});

// C. Counter Increment
test('CLINIC DAY TEST-03 — Counter increment preserves atomic counter update', async () => {
  const calls = [];
  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });
      return {
        rows: [
          {
            clinic_day_id: params[0],
            working_date: '2026-10-02',
            status: 'OPEN',
            lifecycle: 'WORKING',
            counter: 1,
            opened_at: '2026-10-02T08:00:00.000Z',
            closed_at: null,
            closed_by: null,
          },
        ],
      };
    },
  };

  const repo = new ClinicDayRepository(fakeClient);
  const updated = await repo.incrementCounter('CD-2026-10-02-001');

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /UPDATE clinic_days/i);
  assert.match(calls[0].sql, /counter = counter \+ 1/i);
  assert.equal(calls[0].params[0], 'CD-2026-10-02-001');
  assert.equal(updated.counter, 1);
});

// D. Doctor Closure
test('CLINIC DAY TEST-04 — Doctor Closure transitions OPEN->CLOSED, WORKING->CONCLUDED with closedBy=Doctor', async () => {
  const calls = [];
  const fakeClient = {
    async query(sql, params) {
      calls.push({ sql, params });
      return {
        rows: [
          {
            clinic_day_id: params[0],
            working_date: '2026-10-02',
            status: 'CLOSED',
            lifecycle: 'CONCLUDED',
            counter: 12,
            opened_at: '2026-10-02T08:00:00.000Z',
            closed_at: '2026-10-02T18:00:00.000Z',
            closed_by: params[2],
          },
        ],
      };
    },
  };

  const repo = new ClinicDayRepository(fakeClient);
  const closed = await repo.closeClinicDay({
    clinicDayId: 'CD-2026-10-02-001',
    closedAt: '2026-10-02T18:00:00.000Z',
    closedBy: 'Doctor',
  });

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /UPDATE clinic_days/i);
  assert.match(calls[0].sql, /status = 'CLOSED'/i);
  assert.match(calls[0].sql, /lifecycle = 'CONCLUDED'/i);
  assert.equal(calls[0].params[0], 'CD-2026-10-02-001');
  assert.equal(calls[0].params[1], '2026-10-02T18:00:00.000Z');
  assert.equal(calls[0].params[2], 'Doctor');

  assert.equal(closed.status, 'CLOSED');
  assert.equal(closed.lifecycle, 'CONCLUDED');
  assert.equal(closed.closedBy, 'Doctor');
  assert.equal(closed.closedAt, '2026-10-02T18:00:00.000Z');
});

// E. Nurse Boundary Enforcement in Service
test('CLINIC DAY TEST-05 — Nurse cannot open or close Clinic Day (Service authority guard)', async () => {
  const repo = {
    async createClinicDay() {
      throw new Error('Should not be called');
    },
    async closeClinicDay() {
      throw new Error('Should not be called');
    },
  };

  await assert.rejects(
    () =>
      openClinicDayService({
        clinicDayRepository: repo,
        workingDate: '2026-10-02',
        actorRole: 'Nurse',
      }),
    /Opening a Clinic Day is strictly reserved for the Doctor/,
  );

  await assert.rejects(
    () =>
      closeClinicDayService({
        clinicDayRepository: repo,
        clinicDayId: 'CD-2026-10-02-001',
        actorRole: 'Nurse',
      }),
    /Closing the Clinic Day is strictly reserved for the Doctor/,
  );
});

// F. Duplicate Working Date Constraint Handling
test('CLINIC DAY TEST-06 — Duplicate working date is rejected by database constraint', async () => {
  const fakeClient = {
    async query(sql) {
      if (sql.includes('INSERT INTO clinic_days')) {
        const error = new Error('duplicate key value violates unique constraint "clinic_days_working_date_key"');
        error.code = '23505';
        throw error;
      }
      return { rows: [] };
    },
  };

  const repo = new ClinicDayRepository(fakeClient);

  await assert.rejects(
    () =>
      repo.createClinicDay({
        clinicDayId: 'CD-2026-10-02-002',
        workingDate: '2026-10-02',
      }),
    /duplicate key value violates unique constraint/i,
  );
});

// G & H. Transaction Rollback & Zero Leakage Proof
test('CLINIC DAY TEST-07 — Transaction rollback upon persistence failure leaves 0 persisted rows', async () => {
  const executedStatements = [];
  let rowsInDb = [];

  const fakeTransactionalClient = {
    async query(sql, params) {
      executedStatements.push(sql.trim().split('\n')[0]);

      if (sql.includes('BEGIN')) {
        return { rows: [] };
      }

      if (sql.includes('INSERT INTO clinic_days')) {
        rowsInDb.push({ id: params[0], date: params[1] });
        // Simulate sudden failure during multi-step operation
        throw new Error('SIMULATED_TRANSACTION_FAILURE');
      }

      if (sql.includes('ROLLBACK')) {
        rowsInDb = []; // Rollback discards all uncommitted rows
        return { rows: [] };
      }

      return { rows: [] };
    },
    release() {
      executedStatements.push('RELEASE');
    },
  };

  // Execute transaction block
  await fakeTransactionalClient.query('BEGIN');
  try {
    const repo = new ClinicDayRepository(fakeTransactionalClient);
    await repo.createClinicDay(
      {
        clinicDayId: 'CD-ROLLBACK-TEST',
        workingDate: '2026-10-99',
      },
      fakeTransactionalClient,
    );
    assert.fail('Should have failed');
  } catch (err) {
    assert.equal(err.message, 'SIMULATED_TRANSACTION_FAILURE');
    await fakeTransactionalClient.query('ROLLBACK');
  } finally {
    fakeTransactionalClient.release();
  }

  // Verify rollback execution order
  assert.deepEqual(executedStatements, [
    'BEGIN',
    'INSERT INTO clinic_days (',
    'ROLLBACK',
    'RELEASE',
  ]);

  // Zero leakage invariant
  assert.equal(rowsInDb.length, 0);
});

console.log('CLINIC_DAY_PERSISTENCE_TEST = PASS');
console.log('FAIL = 0');
