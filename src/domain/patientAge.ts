// CONTRACT-09 Authoritative Derived Age Implementation
// Date of birth is authoritative. Age is derived. Never persisted as authoritative.

export interface DetailedAge {
  years: number;
  months: number;
  days: number;
}

export function calculateAge(
  dateOfBirth: string | Date,
  referenceDate: string | Date = new Date()
): number {
  if (!dateOfBirth) {
    throw new Error('Date of Birth is required');
  }

  let birthYear: number;
  let birthMonth: number;
  let birthDay: number;

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

  const reference =
    referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
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

export function calculateDetailedAge(
  dateOfBirth: string | Date,
  referenceDate: string | Date = new Date()
): DetailedAge {
  if (!dateOfBirth) {
    throw new Error('Date of Birth is required');
  }

  let birthYear: number;
  let birthMonth: number;
  let birthDay: number;

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

  const reference =
    referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  if (Number.isNaN(reference.getTime())) {
    throw new Error('Invalid age reference date');
  }

  const referenceYear = reference.getFullYear();
  const referenceMonth = reference.getMonth() + 1;
  const referenceDay = reference.getDate();

  const isLeapYear = (year: number) =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const anniversaryDay = (year: number) =>
    birthMonth === 2 && birthDay === 29 && !isLeapYear(year) ? 28 : birthDay;

  const calendarDayDifference = (
    fromYear: number,
    fromMonth: number,
    fromDay: number,
    toYear: number,
    toMonth: number,
    toDay: number
  ) => {
    const from = Date.UTC(fromYear, fromMonth - 1, fromDay);
    const to = Date.UTC(toYear, toMonth - 1, toDay);
    return Math.round((to - from) / (24 * 60 * 60 * 1000));
  };

  let years = referenceYear - birthYear;
  if (
    referenceMonth < birthMonth ||
    (referenceMonth === birthMonth &&
      referenceDay < anniversaryDay(referenceYear))
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
    yearAnchorYear * 12 + (yearAnchorMonth - 1) + months;
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
