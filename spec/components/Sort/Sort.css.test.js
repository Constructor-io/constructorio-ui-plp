import fs from 'fs';
import path from 'path';

// jsdom doesn't apply stylesheets, so assert directly on the shipped CSS
describe('Sort.css accessibility', () => {
  const css = fs
    .readFileSync(path.resolve(__dirname, '../../../src/components/Sort/Sort.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Every rule targeting the radio inputs themselves, at any nesting level (incl. media queries)
  const inputRuleBodies = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) =>
      selector.split(',').some((part) => /\.cio-plp-sort\s+input\s*$/.test(part.trim())),
    )
    .map(([, selector, body]) => ({ selector: selector.trim(), body }));

  it('Should have rules targeting the sort radio inputs', () => {
    expect(inputRuleBodies.length).toBeGreaterThan(0);
  });

  it('Should not remove the sort radio inputs from the accessibility tree at any viewport', () => {
    inputRuleBodies.forEach(({ selector, body }) => {
      expect({ selector, body }).not.toEqual(
        expect.objectContaining({ body: expect.stringMatching(/display\s*:\s*none/) }),
      );
      expect({ selector, body }).not.toEqual(
        expect.objectContaining({ body: expect.stringMatching(/visibility\s*:\s*hidden/) }),
      );
    });
  });

  it('Should show a visible focus indicator for keyboard users', () => {
    expect(css).toMatch(/\.cio-plp-sort input:focus-visible\s*\+\s*span:before\s*\{[^}]*outline:/);
  });
});
