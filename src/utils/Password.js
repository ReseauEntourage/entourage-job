import { generate } from 'generate-password';

export function fakePassword() {
  return generate({
    length: 8,
    numbers: true,
    symbols: true,
  });
}
