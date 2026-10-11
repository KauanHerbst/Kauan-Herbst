import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Reveal } from '../motion/reveal';
import { timedReveal } from '../motion/timed-reveal';
import { Pixel, loadImageData, opaquePixels, shuffledOrder } from './pixels';

const DURATION = 1400;

@Component({
  selector: 'app-pixel-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [Reveal],
  host: { class: 'inline-block' },
  template: `
    @if (!failed()) {
      <canvas
        #canvas
        class="pixelated block"
        [width]="size()"
        [height]="size()"
        [style.width.px]="px()"
        [style.height.px]="px()"
        [attr.role]="alt() ? 'img' : null"
        [attr.aria-label]="alt() || null"
        [attr.aria-hidden]="alt() ? null : 'true'"
      ></canvas>
    }
  `,
})
export class PixelReveal {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly size = input(64);
  readonly scale = input(4);
  readonly seed = input(1);

  private readonly progress = timedReveal(inject(Reveal).revealed, DURATION);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly pixels = signal<Pixel[]>([]);
  private readonly order = computed(() => shuffledOrder(this.pixels().length, this.seed()));

  protected readonly failed = signal(false);
  protected readonly px = computed(() => this.size() * Math.max(1, Math.floor(this.scale())));

  constructor() {
    const browser = isPlatformBrowser(inject(PLATFORM_ID));
    effect(() => {
      if (!browser) return;
      const src = this.src();
      this.failed.set(false);
      loadImageData(src)
        .then(
          ({ data, width, height }) =>
            src === this.src() && this.pixels.set(opaquePixels(data, width, height)),
        )
        .catch(() => src === this.src() && this.failed.set(true));
    });

    let drawn = 0;
    effect(() => {
      const pixels = this.pixels();
      const canvas = this.canvas()?.nativeElement;
      if (!pixels.length || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const order = this.order();
      const shown = Math.round(this.progress() * pixels.length);
      if (shown < drawn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawn = 0;
      }
      for (let k = drawn; k < shown; k++) {
        const p = pixels[order[k]];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 1, 1);
      }
      drawn = shown;
    });
  }
}
