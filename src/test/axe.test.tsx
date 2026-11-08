import { render } from '@testing-library/react';
import { axe } from './axe';

// Guards the a11y setup itself: if jest-axe were misconfigured, every
// `toHaveNoViolations()` in the suite would pass silently.
describe('jest-axe setup', () => {
  it('fails on real violations', async () => {
    const { container } = render(
      <>
        <img src="/x.png" />
        <button type="button" />
      </>,
    );
    const results = await axe(container);
    expect(results.violations.map((v) => v.id)).toEqual(expect.arrayContaining(['image-alt', 'button-name']));
    expect(results).not.toHaveNoViolations();
  });

  it('passes accessible markup', async () => {
    const { container } = render(
      <>
        <img src="/x.png" alt="Logo" />
        <button type="button">Save</button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
