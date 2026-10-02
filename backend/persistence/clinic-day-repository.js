class ClinicDayRepository {
  constructor(pool) {
    this.pool = pool;
  }

  _mapRow(row) {
    if (!row) return null;
    return {
      id: row.clinic_day_id,
      workingDate: row.working_date,
      status: row.status,
      lifecycle: row.lifecycle,
      counter: Number(row.counter),
      openedAt: typeof row.opened_at === 'object' && row.opened_at !== null
        ? row.opened_at.toISOString()
        : String(row.opened_at),
      closedAt: row.closed_at
        ? (typeof row.closed_at === 'object' ? row.closed_at.toISOString() : String(row.closed_at))
        : undefined,
      closedBy: row.closed_by || undefined,
    };
  }

  async createClinicDay({ clinicDayId, workingDate, openedAt }, client = this.pool) {
    const result = await client.query(
      `INSERT INTO clinic_days (
         clinic_day_id,
         working_date,
         status,
         lifecycle,
         counter,
         opened_at
       )
       VALUES ($1, $2, 'OPEN', 'WORKING', 0, COALESCE($3, CURRENT_TIMESTAMP))
       RETURNING
         clinic_day_id,
         working_date::text AS working_date,
         status,
         lifecycle,
         counter,
         opened_at,
         closed_at,
         closed_by`,
      [clinicDayId, workingDate, openedAt || null],
    );

    return this._mapRow(result.rows[0]);
  }

  async getCurrentClinicDay(client = this.pool) {
    const result = await client.query(
      `SELECT
         clinic_day_id,
         working_date::text AS working_date,
         status,
         lifecycle,
         counter,
         opened_at,
         closed_at,
         closed_by
       FROM clinic_days
       ORDER BY (CASE WHEN status = 'OPEN' THEN 0 ELSE 1 END), opened_at DESC
       LIMIT 1`,
    );

    const row = result.rows[0];
    return this._mapRow(row);
  }

  async getClinicDayById(clinicDayId, client = this.pool) {
    const result = await client.query(
      `SELECT
         clinic_day_id,
         working_date::text AS working_date,
         status,
         lifecycle,
         counter,
         opened_at,
         closed_at,
         closed_by
       FROM clinic_days
       WHERE clinic_day_id = $1`,
      [clinicDayId],
    );

    const row = result.rows[0];
    return this._mapRow(row);
  }

  async closeClinicDay({ clinicDayId, closedAt, closedBy = 'Doctor' }, client = this.pool) {
    const result = await client.query(
      `UPDATE clinic_days
       SET status = 'CLOSED',
           lifecycle = 'CONCLUDED',
           closed_at = COALESCE($2, CURRENT_TIMESTAMP),
           closed_by = $3
       WHERE clinic_day_id = $1 AND status = 'OPEN'
       RETURNING
         clinic_day_id,
         working_date::text AS working_date,
         status,
         lifecycle,
         counter,
         opened_at,
         closed_at,
         closed_by`,
      [clinicDayId, closedAt || null, closedBy],
    );

    const row = result.rows[0];
    return this._mapRow(row);
  }

  async incrementCounter(clinicDayId, client = this.pool) {
    const result = await client.query(
      `UPDATE clinic_days
       SET counter = counter + 1
       WHERE clinic_day_id = $1
       RETURNING
         clinic_day_id,
         working_date::text AS working_date,
         status,
         lifecycle,
         counter,
         opened_at,
         closed_at,
         closed_by`,
      [clinicDayId],
    );

    const row = result.rows[0];
    return this._mapRow(row);
  }
}

module.exports = { ClinicDayRepository };
