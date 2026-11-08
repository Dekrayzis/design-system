import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from '../../test/axe';
import { SkipLink } from './SkipLink';

function Page({ mainProps = {}, ...props }: React.ComponentProps<typeof SkipLink> & { mainProps?: object }) {
  return (
    <>
      <SkipLink {...props} />
      <header>
        <a href="/">Home</a>
      </header>
      <main id="main" {...mainProps}>
        <h1>Content</h1>
      </main>
    </>
  );
}

describe('SkipLink', () => {
  it('is the first tab stop and points at #main by default', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute('href', '#main');
  });

  it('moves focus to a non-focusable target by giving it tabindex="-1"', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    await user.keyboard('{Enter}');

    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('removes the temporary tabindex once focus leaves the target', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();

    await user.tab();
    expect(main).not.toHaveFocus();
    expect(main).not.toHaveAttribute('tabindex');
  });

  it('leaves an already focusable target untouched', async () => {
    const user = userEvent.setup();
    render(<Page mainProps={{ tabIndex: 0 }} />);
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '0');
  });

  it('accepts a custom target and text', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink href="#search">Skip to search</SkipLink>
        <input id="search" aria-label="Search" />
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Skip to search' }));
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  });

  it('does nothing extra when the target is missing or the href is not a fragment', async () => {
    const user = userEvent.setup();
    render(
      // The wrapper stops jsdom attempting a real navigation after SkipLink's own handler has run.
      <div onClick={(event) => event.preventDefault()}>
        <SkipLink href="#nowhere">Missing</SkipLink>
        <SkipLink href="/elsewhere">Elsewhere</SkipLink>
        <main id="elsewhere">Content</main>
      </div>,
    );
    const missing = screen.getByRole('link', { name: 'Missing' });
    await user.click(missing);
    expect(missing).toHaveFocus();
    const elsewhere = screen.getByRole('link', { name: 'Elsewhere' });
    await user.click(elsewhere);
    expect(elsewhere).toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveAttribute('tabindex');
  });

  it('calls onClick and respects preventDefault', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(<Page onClick={onClick} />);
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('main')).not.toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveAttribute('tabindex');
  });

  it('forwards refs to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<SkipLink ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Page />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('leaves a malformed fragment to the browser instead of throwing', async () => {
    const user = userEvent.setup();
    render(<Page href="#%" />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });
});
