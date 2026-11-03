import fs from 'fs';
import path from 'path';

// jsdom doesn't apply stylesheets, so assert directly on the shipped CSS
describe('FilterOptionsList.css accessibility', () => {
  const css = fs
    .readFileSync(
      path.resolve(__dirname, '../../../src/components/Filters/FilterOptionsList.css'),
      'utf8',
    )
    .replace(/\/\*[\s\S]*?\*\//g, '');

  it('Should override the upstream `hidden` class so filter checkboxes stay keyboard reachable', () => {
    const [, body] =
      css.match(/\.cio-filter-multiple-option \.cio-filter-option-input\s*\{([^}]*)\}/) || [];

    expect(body).toMatch(/display:\s*inline-block/);
    expect(body).not.toMatch(/display:\s*none|visibility:\s*hidden/);
  });

  it('Should show a visible focus indicator, with or without a proxy checkbox', () => {
    expect(css).toMatch(
      /\.cio-filter-option-input:focus-visible\s*~\s*\.cio-checkbox\s*\{[^}]*outline:/,
    );
    expect(css).toMatch(
      /:not\(:has\(\.cio-checkbox\)\):has\(\.cio-filter-option-input:focus-visible\)\s*\{[^}]*outline:/,
    );
  });
});
