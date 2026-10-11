export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export function opaquePixels(data: ArrayLike<number>, width: number, height: number): Pixel[] {
  const out: Pixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a > 0)
        out.push({
          x,
          y,
          color: `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${+(a / 255).toFixed(3)})`,
        });
    }
  }
  return out;
}

export function shuffledOrder(n: number, seed: number): number[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function loadImageData(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const [w, h] = [img.naturalWidth, img.naturalHeight];
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas 2d indisponível');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error(`falha ao carregar ${src}`));
    img.src = src;
  });
}
