import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from '../../test/axe';
import { Link, linkClassName } from './Link';

describe('Link', () => {
  it('renders a real link with an href, named by its text', () => {
    render(<Link href="/docs">Read the docs</Link>);
    expect(screen.getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', '/docs');
  });

  it('uses the default variant unless told otherwise', () => {
    render(
      <>
        <Link href="/a">Default</Link>
        <Link href="/b" variant="subtle">Subtle</Link>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Default' })).toHaveClass('link', 'default');
    expect(screen.getByRole('link', { name: 'Subtle' })).toHaveClass('link', 'subtle');
    expect(screen.getByRole('link', { name: 'Subtle' })).not.toHaveClass('default');
  });

  it('is reachable with Tab and follows on Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(<Link href="/docs" onClick={onClick}>Docs</Link>);

    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('leaves target and rel alone when not external', () => {
    render(
      <Link href="/docs" target="_self" rel="help">
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'help');
    expect(link.querySelector('svg')).toBeNull();
  });

  it('opens external links in a new tab safely and says so to screen readers', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Example (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps a consumer rel on external links without duplicating tokens', () => {
    render(
      <Link href="https://example.com" external rel="external  noopener" target="_self">
        Example
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'external noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('lets the external announcement be translated', () => {
    render(
      <Link href="https://example.com" external externalLabel="(s’ouvre dans un nouvel onglet)">
        Exemple
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Exemple (s’ouvre dans un nouvel onglet)' })).toBeInTheDocument();
  });

  it('forwards refs to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="/docs">Docs</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('merges a custom className', () => {
    render(<Link href="/docs" className="extra">Docs</Link>);
    expect(screen.getByRole('link')).toHaveClass('link', 'default', 'extra');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        Read <Link href="/docs">the docs</Link> or visit{' '}
        <Link href="https://example.com" external>
          the example site
        </Link>
        .
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('linkClassName', () => {
  it('gives router links the same classes as Link', () => {
    expect(linkClassName()).toBe('link default');
    expect(linkClassName({ variant: 'subtle', className: 'nav' })).toBe('link subtle nav');
  });
});
