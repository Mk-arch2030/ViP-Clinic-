// A date-only reference is a calendar date, not midnight UTC read in host time.
function ageReferenceParts(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const check = new Date(value + 'T00:00:00.000Z');
    if (year < 1 || Number.isNaN(check.getTime()) || check.toISOString().slice(0, 10) !== value) {
      throw new Error('Invalid age reference date');
    }
    return { year, month, day };
  }
  const reference = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(reference.getTime())) throw new Error('Invalid age reference date');
  return { year: reference.getFullYear(), month: reference.getMonth() + 1, day: reference.getDate() };
}

function calculateAge(dateOfBirth, referenceDate = new Date()) {
  if (!dateOfBirth) {
    throw new Error('Date of Birth is required');
  }

  let birthYear;
  let birthMonth;
  let birthDay;

  if (dateOfBirth instanceof Date) {
    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new Error('Invalid Date of Birth');
    }

    birthYear = dateOfBirth.getUTCFullYear();
    birthMonth = dateOfBirth.getUTCMonth() + 1;
    birthDay = dateOfBirth.getUTCDate();
  } else {
    const parts = String(dateOfBirth).split('-').map(Number);

    if (
      parts.length !== 3 ||
      parts.some(Number.isNaN) ||
      parts[0] < 1 ||
      parts[1] < 1 ||
      parts[1] > 12 ||
      parts[2] < 1 ||
      parts[2] > 31
    ) {
      throw new Error('Invalid Date of Birth');
    }

    [birthYear, birthMonth, birthDay] = parts;
  }
  const reference = referenceDate instanceof Date
    ? referenceDate
    : new Date(referenceDate);

  if (Number.isNaN(reference.getTime())) {
    throw new Error('Invalid age reference date');
  }

  let age = reference.getFullYear() - birthYear;

  const referenceMonth = reference.getMonth() + 1;
  const referenceDay = reference.getDate();

  if (
    referenceMonth < birthMonth ||
    (referenceMonth === birthMonth && referenceDay < birthDay)
  ) {
    age -= 1;
  }

  return age;
}


function calculateDetailedAge(dateOfBirth, referenceDate = new Date()) {
  if (!dateOfBirth) {
    throw new Error('Date of Birth is required');
  }

  let birthYear;
  let birthMonth;
  let birthDay;

  if (dateOfBirth instanceof Date) {
    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new Error('Invalid Date of Birth');
    }

    birthYear = dateOfBirth.getUTCFullYear();
    birthMonth = dateOfBirth.getUTCMonth() + 1;
    birthDay = dateOfBirth.getUTCDate();
  } else {
    const parts = String(dateOfBirth).split('-').map(Number);

    if (
      parts.length !== 3 ||
      parts.some(Number.isNaN) ||
      parts[0] < 1 ||
      parts[1] < 1 ||
      parts[1] > 12 ||
      parts[2] < 1 ||
      parts[2] > 31
    ) {
      throw new Error('Invalid Date of Birth');
    }

    [birthYear, birthMonth, birthDay] = parts;
  }

  const { year: referenceYear, month: referenceMonth, day: referenceDay } = ageReferenceParts(referenceDate);

  const isLeapYear = (year) =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  const daysInMonth = (year, month) =>
    new Date(year, month, 0).getDate();

  const anniversaryDay = (year) =>
    birthMonth === 2 && birthDay === 29 && !isLeapYear(year)
      ? 28
      : birthDay;

  const calendarDayDifference = (
    fromYear,
    fromMonth,
    fromDay,
    toYear,
    toMonth,
    toDay
  ) => {
    const from = Date.UTC(fromYear, fromMonth - 1, fromDay);
    const to = Date.UTC(toYear, toMonth - 1, toDay);

    return Math.round((to - from) / (24 * 60 * 60 * 1000));
  };

  let years = referenceYear - birthYear;

  if (
    referenceMonth < birthMonth ||
    (
      referenceMonth === birthMonth &&
      referenceDay < anniversaryDay(referenceYear)
    )
  ) {
    years -= 1;
  }

  if (years < 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
    };
  }

  const yearAnchorYear = birthYear + years;
  const yearAnchorMonth = birthMonth;
  const yearAnchorDay = anniversaryDay(yearAnchorYear);

  let months =
    (referenceYear - yearAnchorYear) * 12 +
    (referenceMonth - yearAnchorMonth);

  if (referenceDay < yearAnchorDay) {
    months -= 1;
  }

  if (months < 0) {
    months = 0;
  }

  const totalAnchorMonths =
    (yearAnchorYear * 12 + (yearAnchorMonth - 1)) + months;

  const monthAnchorYear = Math.floor(totalAnchorMonths / 12);
  const monthAnchorMonth = (totalAnchorMonths % 12) + 1;
  const monthAnchorDay = Math.min(
    yearAnchorDay,
    daysInMonth(monthAnchorYear, monthAnchorMonth)
  );

  const days = calendarDayDifference(
    monthAnchorYear,
    monthAnchorMonth,
    monthAnchorDay,
    referenceYear,
    referenceMonth,
    referenceDay
  );

  return {
    years,
    months,
    days,
  };
}
class Patient {
  constructor({
    clinicPatientNumber,
    name,
    dateOfBirth,
    profession,
    pastHistory,
    phone,
    gender,
    ageReferenceDate,
  }) {
    if (!clinicPatientNumber) {
      throw new Error('Clinic Patient Number is required');
    }

    if (!dateOfBirth) {
      throw new Error('Date of Birth is required');
    }

    this.clinicPatientNumber = clinicPatientNumber;
    this.name = name;
    this.dateOfBirth = dateOfBirth;

    // AGE IS DERIVED — NEVER ACCEPTED AS AN AUTHORITATIVE INPUT.
    this.age = calculateAge(dateOfBirth, ageReferenceDate);

    this.profession = profession;
    this.pastHistory = pastHistory;
    this.phone = phone;
    this.gender = gender;
  }
}

module.exports = {
  Patient,
  calculateAge,
  calculateDetailedAge,
};
