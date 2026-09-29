export function passwordError(value) {
  return value.length < 8 || new TextEncoder().encode(value).length > 72
    ? "Password must be at least 8 characters and at most 72 UTF-8 bytes." : "";
}
