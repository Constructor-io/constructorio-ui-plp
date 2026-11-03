import fs from 'fs';
import path from 'path';

// jsdom doesn't apply stylesheets, so assert directly on the shipped CSS
describe('Collapsible styles accessibility', () => {
  const css = fs
    .readFileSync(path.resolve(__dirname, '../../src/styles.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const getRuleBody = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return css.match(new RegExp(`(?:^|})\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  };

  it('Should remove collapsed content from the Tab order and accessibility tree', () => {
    expect(getRuleBody('.cio-collapsible-wrapper .cio-collapsible-inner')).toMatch(
      /visibility:\s*hidden/,
    );
  });

  it('Should restore expanded content immediately, and hide collapsed content only after the transition', () => {
    const collapsed = getRuleBody('.cio-collapsible-wrapper .cio-collapsible-inner');
    const expanded = getRuleBody(
      '.cio-collapsible-wrapper.cio-collapsible-is-open .cio-collapsible-inner',
    );

    expect(expanded).toMatch(/visibility:\s*visible/);
    expect(expanded).toMatch(/transition-delay:\s*0s/);
    // Must match the grid-template-rows collapse transition
    const [, collapseDuration] = css.match(/grid-template-rows\s+([\d.]+s)/);
    expect(collapsed).toMatch(new RegExp(`visibility\\s+0s\\s+linear\\s+${collapseDuration}`));
  });
});
