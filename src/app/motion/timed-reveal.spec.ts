import { Component, Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { timedReveal } from './timed-reveal';

@Component({ template: '' })
class Host {
  readonly revealed = signal(false);
  readonly t: Signal<number> = timedReveal(this.revealed, 1000);
}

describe('timedReveal', () => {
  it('só começa quando o scroll revela o host e depois completa sozinho, por tempo', async () => {
    const frames: FrameRequestCallback[] = [];
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => (frames.push(cb), frames.length));
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    const run = (ts: number) => frames.splice(0).forEach((cb) => cb(ts));
    await fixture.whenStable();
    run(0);
    run(5000);
    expect(host.t()).toBe(0);

    host.revealed.set(true);
    await fixture.whenStable();
    run(10_000);
    run(10_500);
    expect(host.t()).toBeCloseTo(0.5);
    run(11_500);
    expect(host.t()).toBe(1);
    raf.mockRestore();
  });
});
