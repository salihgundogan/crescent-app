const PHONE_COUNTRY_CODE = "90";
const AUTH_EMAIL_DOMAIN = "crescent.local";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizePhoneNumber(value: string) {
  const digits = onlyDigits(value);

  if (!digits) {
    throw new Error("Telefon numarasini gir.");
  }

  if (digits.startsWith(PHONE_COUNTRY_CODE) && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `${PHONE_COUNTRY_CODE}${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `${PHONE_COUNTRY_CODE}${digits}`;
  }

  throw new Error("Telefon numarasini 05xx xxx xx xx formatinda gir.");
}

export function formatPhoneForDisplay(value: string) {
  const normalized = normalizePhoneNumber(value);
  const local = normalized.slice(2);

  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
}

export function phoneToAuthEmail(value: string) {
  const normalized = normalizePhoneNumber(value);
  return `${normalized}@${AUTH_EMAIL_DOMAIN}`;
}
