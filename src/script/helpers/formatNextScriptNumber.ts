export function formatNextScriptNumber(nextNumber: number) {
  let formattedNumber = nextNumber.toString().padStart(4, '0');
  const currentYear = new Date().getFullYear().toString();

  formattedNumber = `${currentYear}${formattedNumber}`;
  return formattedNumber;
}
