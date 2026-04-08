import { describe, it, expect } from 'vitest';
import { parseArg } from '../index.js';

describe('parseArg', () => {
  it('returns value for --long form', () => {
    expect(parseArg(['--level', '2'], '--level', '-l')).toBe('2');
  });

  it('returns value for -s short form', () => {
    expect(parseArg(['-l', '2'], '--level', '-l')).toBe('2');
  });

  it('returns null when flag not present', () => {
    expect(parseArg(['--other', 'val'], '--level', '-l')).toBeNull();
  });

  it('returns null when flag is last arg with no value', () => {
    expect(parseArg(['--level'], '--level', '-l')).toBeNull();
  });

  it('works with multiple flags in args', () => {
    const args = ['--level', '1', '--filter', 'nlp', '--category', 'util'];
    expect(parseArg(args, '--level', '-l')).toBe('1');
    expect(parseArg(args, '--filter', '-f')).toBe('nlp');
    expect(parseArg(args, '--category', '-c')).toBe('util');
  });

  it('returns first match when flag appears multiple times', () => {
    expect(parseArg(['-l', '0', '-l', '2'], '--level', '-l')).toBe('0');
  });
});
