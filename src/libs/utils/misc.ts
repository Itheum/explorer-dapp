export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + ' ... ' + value.slice(-length);
}
