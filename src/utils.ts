export function toBengaliNumber(val: number | string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return val.toString().replace(/\d/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

export function formatTimeInBengali(timeStr: string): string {
  // Convert standard PM/AM abbreviations or english numbers to Bangla
  return toBengaliNumber(timeStr)
    .replace(/AM/g, "পূর্বাহ্ণ")
    .replace(/PM/g, "অপরাহ্ণ")
    .replace(/or/g, "অথবা")
    .replace(/onwards/g, "হইতে");
}
