export function createRandomPasswordFromRegexp(
  regexp: RegExp,
  length: number,
): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  const maxAttempts = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    if (regexp.test(password)) {
      return password;
    }
    attempts++;
  }

  throw new Error(
    'Failed to create a valid password within the maximum number of attempts',
  );
}
