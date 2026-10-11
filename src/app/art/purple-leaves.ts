import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../motion/scroll-ticker';

interface Leaf {
  x: number;
  y: number;
  size: number;
  color: string;
  color2: string;
  rot: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  fall: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  alpha: number;
}

const COLORS = ['#422A75', '#5B3FA0', '#6E52C8', '#8B6CF0', '#9C84F2', '#B9A3F0'];
const LEAF_COUNT = 26;
const rand = (a: number, b: number): number => a + Math.random() * (b - a);

@Component({
  selector: 'app-purple-leaves',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cvs class="pointer-events-none absolute inset-0 h-full w-full"></canvas>`,
  host: { class: 'pointer-events-none absolute inset-0 block', 'aria-hidden': 'true' },
})
export class PurpleLeaves {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cvs');
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  private ctx: CanvasRenderingContext2D | null = null;
  private leaves: Leaf[] = [];
  private t = 0;
  private wind = 0.4;
  private windTarget = 0.4;
  private gustUntil = 0;
  private lastMouseX: number | null = null;
  private w = 0;
  private h = 0;
  private readonly reduce = prefersReducedMotion();
  private running = false;
  private raf = 0;

  constructor() {
    afterNextRender(() => {
      const cvs = this.canvasRef().nativeElement;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;
      this.ctx = ctx;

      const resize = (): void => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const prevW = this.w;
        this.w = cvs.clientWidth;
        this.h = cvs.clientHeight;
        cvs.width = this.w * dpr;
        cvs.height = this.h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (this.w !== prevW) this.build();
        if (this.reduce) this.drawStatic();
      };
      const onMove = (e: MouseEvent): void => {
        if (this.lastMouseX != null) {
          const dx = e.clientX - this.lastMouseX;
          this.windTarget = Math.max(-2.2, Math.min(2.2, this.windTarget + dx * 0.04));
        }
        this.lastMouseX = e.clientX;
      };
      const onLeave = (): void => {
        this.lastMouseX = null;
      };

      const io =
        typeof IntersectionObserver === 'function'
          ? new IntersectionObserver(([entry]) => {
              if (this.reduce) return;
              if (entry.isIntersecting && !this.running) {
                this.running = true;
                this.raf = requestAnimationFrame(this.tick);
              } else if (!entry.isIntersecting && this.running) {
                this.running = false;
                cancelAnimationFrame(this.raf);
              }
            })
          : null;

      const area = this.host.parentElement;
      window.addEventListener('resize', resize);
      area?.addEventListener('mousemove', onMove);
      area?.addEventListener('mouseleave', onLeave);
      resize();
      if (this.reduce) this.drawStatic();
      io?.observe(this.host);

      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.raf);
        io?.disconnect();
        window.removeEventListener('resize', resize);
        area?.removeEventListener('mousemove', onMove);
        area?.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  gust(): void {
    this.gustUntil = Date.now() + 900;
  }

  private leafCount(): number {
    const scale = Math.min(1, (this.w || 1200) / 1100);
    return Math.max(0, Math.round(LEAF_COUNT * scale * (this.reduce ? 0.4 : 1)));
  }

  private drawStatic(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const l of this.leaves) this.drawLeaf(l);
  }

  private shade(hex: string, amt: number): string {
    const n = parseInt(hex.slice(1), 16);
    const c = (v: number): number => Math.max(0, Math.min(255, v));
    const r = c((n >> 16) + amt);
    const g = c(((n >> 8) & 255) + amt);
    const b = c((n & 255) + amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private makeLeaf(fromTop: boolean): Leaf {
    const c = COLORS[(Math.random() * COLORS.length) | 0];
    return {
      x: rand(0, this.w),
      y: fromTop ? rand(-this.h * 0.2, -10) : rand(-this.h, this.h),
      size: rand(7, 15),
      color: c,
      color2: this.shade(c, -30),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.016, 0.016) * (this.reduce ? 0.3 : 1),
      flip: rand(0, Math.PI * 2),
      flipSpeed: rand(0.008, 0.035),
      fall: rand(0.35, 0.95) * (this.reduce ? 0.5 : 1),
      swayAmp: rand(0.3, 1.1),
      swayFreq: rand(0.008, 0.018),
      swayPhase: rand(0, Math.PI * 2),
      alpha: rand(0.35, 0.75),
    };
  }

  private build(): void {
    this.leaves = Array.from({ length: this.leafCount() }, () => this.makeLeaf(false));
  }

  private drawLeaf(l: Leaf): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const s = l.size;
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.scale(1, Math.max(0.15, Math.abs(Math.cos(l.flip))));
    ctx.globalAlpha = l.alpha;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.55, -s * 0.7, s * 0.75, -s * 0.15, s * 0.5, s * 0.25);
    ctx.bezierCurveTo(s * 0.85, s * 0.2, s * 0.9, s * 0.55, s * 0.55, s * 0.7);
    ctx.bezierCurveTo(s * 0.4, s * 0.85, s * 0.2, s * 0.9, 0, s * 1.05);
    ctx.bezierCurveTo(-s * 0.2, s * 0.9, -s * 0.4, s * 0.85, -s * 0.55, s * 0.7);
    ctx.bezierCurveTo(-s * 0.9, s * 0.55, -s * 0.85, s * 0.2, -s * 0.5, s * 0.25);
    ctx.bezierCurveTo(-s * 0.75, -s * 0.15, -s * 0.55, -s * 0.7, 0, -s);
    ctx.closePath();
    const g = ctx.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, l.color);
    g.addColorStop(1, l.color2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(8,7,12,0.35)';
    ctx.lineWidth = Math.max(0.5, s * 0.05);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.85);
    ctx.lineTo(0, s * 0.95);
    ctx.stroke();
    ctx.restore();
  }

  private tick = (): void => {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    this.t += 1;
    this.windTarget += (0.4 - this.windTarget) * 0.008;
    this.wind += (this.windTarget - this.wind) * 0.03;
    const gust = Date.now() < this.gustUntil ? 1.6 : 0;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const l of this.leaves) {
      l.y += l.fall + Math.abs(this.wind) * 0.12 + gust * 0.5;
      l.x +=
        Math.sin(this.t * l.swayFreq + l.swayPhase) * l.swayAmp +
        (this.wind + gust) * (l.size / 18);
      l.rot += l.rotSpeed + this.wind * 0.002;
      l.flip += l.flipSpeed;
      if (l.y - l.size > this.h) Object.assign(l, this.makeLeaf(true));
      if (l.x > this.w + 40) l.x = -40;
      else if (l.x < -40) l.x = this.w + 40;
      this.drawLeaf(l);
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
