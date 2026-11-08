import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Laptops', href: '/products/laptops' },
  { label: 'Ultrabooks', href: '/products/laptops/ultrabooks' },
  { label: 'Aero 14' },
];

describe('Breadcrumbs', () => {
  it('renders a labelled navigation landmark with an ordered list', () => {
    render(<Breadcrumbs items={trail} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  });

  it('links every ancestor and marks the last item as the current page', () => {
    render(<Breadcrumbs items={trail} />);
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/products',
      '/products/laptops',
      '/products/laptops/ultrabooks',
    ]);
    const current = screen.getByText('Aero 14');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
    for (const link of screen.getAllByRole('link')) expect(link).not.toHaveAttribute('aria-current');
  });

  it('renders the current page as a link with aria-current when it has an href', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('renders an ancestor without an href as plain text, not current', () => {
    render(<Breadcrumbs items={[{ label: 'Archive' }, { label: '2026', href: '/archive/2026' }]} />);
    expect(screen.getByText('Archive')).not.toHaveAttribute('aria-current');
    expect(screen.queryByRole('link', { name: 'Archive' })).not.toBeInTheDocument();
  });

  it('accepts a custom landmark name and passes through nav attributes', () => {
    render(<Breadcrumbs items={trail} label="You are here" className="extra" data-testid="crumbs" />);
    const nav = screen.getByRole('navigation', { name: 'You are here' });
    expect(nav).toHaveClass('breadcrumbs', 'extra');
    expect(nav).toHaveAttribute('data-testid', 'crumbs');
  });

  it('renders router links through renderLink with the link styling and aria-current', () => {
    const renderLink = vi.fn(({ item, ...props }) => <a data-router {...props} />);
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
        ]}
        renderLink={renderLink}
      />,
    );
    const docs = screen.getByRole('link', { name: 'Docs' });
    expect(docs).toHaveAttribute('data-router');
    expect(docs).toHaveAttribute('aria-current', 'page');
    expect(docs).toHaveClass('link', 'subtle');
    expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ item: { label: 'Docs', href: '/docs' } }));
  });

  it('shows every item when maxItems is not exceeded', () => {
    render(<Breadcrumbs items={trail} maxItems={5} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('collapses the middle of a long trail behind a button', () => {
    render(<Breadcrumbs items={trail} maxItems={3} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Home');
    expect(within(items[1]!).getByRole('button', { name: 'Show full breadcrumb trail' })).toHaveAttribute(
      'type',
      'button',
    );
    expect(items[2]).toHaveTextContent('Ultrabooks');
    expect(items[3]).toHaveTextContent('Aero 14');
    expect(screen.queryByRole('link', { name: 'Products' })).not.toBeInTheDocument();
  });

  it('never collapses to fewer than two visible items', () => {
    render(<Breadcrumbs items={trail} maxItems={0} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Home');
    expect(items[2]).toHaveTextContent('Aero 14');
  });

  it('reveals the full trail from the keyboard and moves focus to the first revealed link', async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={trail} maxItems={3} expandLabel="Show all" />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Show all' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Products' })).toHaveFocus();
  });

  it('focuses the list when the first revealed item is not a link', async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Section' }, { label: 'Topic', href: '/t' }, { label: 'Page' }]}
        maxItems={2}
      />,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('list')).toHaveFocus();
    expect(screen.getByRole('list')).toHaveAttribute('tabindex', '-1');
  });

  it('has no accessibility violations, collapsed or not', async () => {
    const { container } = render(
      <>
        <Breadcrumbs items={trail} />
        <Breadcrumbs items={trail} maxItems={3} label="Collapsed breadcrumb" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
