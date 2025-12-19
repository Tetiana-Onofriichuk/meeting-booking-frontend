export function buildTimeOptions(stepMinutes = 30) {
  const options: { value: string; label: string }[] = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const v = `${hh}:${mm}`;
      options.push({ value: v, label: v });
    }
  }

  return options;
}
