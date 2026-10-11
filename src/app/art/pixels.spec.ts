import { opaquePixels, shuffledOrder } from './pixels';

describe('opaquePixels', () => {
  it('lista só pixels com alpha > 0, com posição e cor rgba', () => {
    const data = new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 128]);
    expect(opaquePixels(data, 3, 1)).toEqual([
      { x: 0, y: 0, color: 'rgba(255,0,0,1)' },
      { x: 2, y: 0, color: 'rgba(0,0,255,0.502)' },
    ]);
  });
});

describe('shuffledOrder', () => {
  it('é uma permutação de 0..n-1', () => {
    const order = shuffledOrder(100, 7);
    expect([...order].sort((a, b) => a - b)).toEqual([...Array(100).keys()]);
  });

  it('é determinística por seed e varia entre seeds', () => {
    expect(shuffledOrder(50, 1)).toEqual(shuffledOrder(50, 1));
    expect(shuffledOrder(50, 1)).not.toEqual(shuffledOrder(50, 2));
  });

  it('n = 0 devolve lista vazia', () => {
    expect(shuffledOrder(0, 1)).toEqual([]);
  });
});
