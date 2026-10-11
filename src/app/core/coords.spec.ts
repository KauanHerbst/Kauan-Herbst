import { formatCoords } from './coords';

describe('formatCoords', () => {
  it('formata hemisférios sul e oeste', () => {
    expect(formatCoords(-23.3045, -51.1696)).toBe('23.3045° S, 51.1696° W');
  });

  it('formata hemisférios norte e leste', () => {
    expect(formatCoords(47.3769, 8.5417)).toBe('47.3769° N, 8.5417° E');
  });

  it('zero conta como norte/leste', () => {
    expect(formatCoords(0, 0)).toBe('0.0000° N, 0.0000° E');
  });
});
