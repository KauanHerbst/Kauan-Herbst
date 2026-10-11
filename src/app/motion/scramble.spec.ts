import { GLYPHS, scramble } from './scramble';

const zero = () => 0;

describe('scramble', () => {
  it('progresso 1 devolve o texto original', () => {
    expect(scramble('Sobre mim', 1, zero)).toBe('Sobre mim');
  });

  it('progresso 0 troca todo caractere visível por glifo, preservando espaços', () => {
    expect(scramble('ab c', 0, zero)).toBe(`${GLYPHS[0]}${GLYPHS[0]} ${GLYPHS[0]}`);
  });

  it('revela da esquerda para a direita proporcionalmente', () => {
    expect(scramble('abcd', 0.5, zero)).toBe(`ab${GLYPHS[0]}${GLYPHS[0]}`);
  });

  it('mantém o comprimento e limita progresso fora de 0..1', () => {
    expect(scramble('Formação', -1, zero)).toHaveLength('Formação'.length);
    expect(scramble('Formação', 2, zero)).toBe('Formação');
  });
});
