'use strict';
const { AuthError } = require('../auth/errors');
const { calculateAge } = require('../../domain/patient');

function searchInput(query) {
  if (!query || typeof query !== 'object' || Array.isArray(query) ||
      Object.keys(query).length !== 2 || !['cpn','name'].includes(query.mode) ||
      typeof query.value !== 'string') throw new AuthError(400);
  let value = query.value.normalize('NFC').trim();
  if (query.mode === 'cpn') {
    if (!/^(?:CPN-)?[1-9][0-9]{0,18}$/i.test(value)) throw new AuthError(400);
    value = 'CPN-' + value.replace(/^CPN-/i, '');
  } else if (value.length < 2 || value.length > 80 || /[\u0000-\u001f\u007f]/.test(value)) throw new AuthError(400);
  return { mode:query.mode, value };
}

async function searchPatients(client, query) {
  const { mode,value } = searchInput(query);
  // Literal substring search; %, _ and backslash have no wildcard authority.
  const predicate = mode === 'cpn' ? 'clinic_patient_number = $1' : 'strpos(lower(name), lower($1)) > 0';
  const result = await client.query(`SELECT patient_id, clinic_patient_number, name,
    date_of_birth::text AS date_of_birth, profession, phone, gender
    FROM patients WHERE ${predicate}
    ORDER BY lower(name), clinic_patient_number, patient_id LIMIT 26`, [value]);
  return { patients:result.rows.slice(0,25).map(row => ({ ...row,
    age:row.date_of_birth ? calculateAge(row.date_of_birth) : null })), hasMore:result.rows.length > 25 };
}
module.exports = { searchInput,searchPatients };
