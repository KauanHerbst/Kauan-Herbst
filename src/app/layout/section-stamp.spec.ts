import { TestBed } from '@angular/core/testing';
import { SectionStamp } from './section-stamp';

describe('SectionStamp', () => {
  it('renderiza h2 com texto original (espaçamento só via CSS)', () => {
    const fixture = TestBed.createComponent(SectionStamp);
    fixture.componentRef.setInput('label', 'Experiência');
    fixture.componentRef.setInput('headingId', 'experiencia-title');
    fixture.detectChanges();
    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2.querySelector('.sr-only')?.textContent).toBe('Experiência');
    expect(h2.id).toBe('experiencia-title');
    expect(h2.className).toContain('tracking-[0.2em]');
    expect(fixture.nativeElement.textContent).not.toMatch(/\[\d+\]/);
    expect(fixture.nativeElement.querySelector('p')).toBeNull();
  });
});
