import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { getPageCount, getPaginationRange, Pagination, PaginationSummary } from './Pagination';

describe('getPaginationRange', () => {
  it('lists every page when they all fit', () => {
    expect(getPaginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it('adds ellipses either side of the current page', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20]);
  });

  it('shows a single skipped page instead of an ellipsis, keeping the length steady', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20]);
    expect(getPaginationRange(4, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20]);
    expect(getPaginationRange(5, 20)).toEqual([1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 20]);
    expect(getPaginationRange(17, 20)).toEqual([1, 'start-ellipsis', 16, 17, 18, 19, 20]);
    expect(getPaginationRange(20, 20)).toEqual([1, 'start-ellipsis', 16, 17, 18, 19, 20]);
  });

  it('honours siblingCount and boundaryCount, and clamps out-of-range input', () => {
    expect(getPaginationRange(10, 20, 2, 2)).toEqual([1, 2, 'start-ellipsis', 8, 9, 10, 11, 12, 'end-ellipsis', 19, 20]);
    expect(getPaginationRange(10, 20, 0, 0)).toEqual(['start-ellipsis', 10, 'end-ellipsis']);
    expect(getPaginationRange(99, 20, -1, -1)).toEqual(['start-ellipsis', 19, 20]);
    expect(getPaginationRange(-5, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20]);
  });
});

describe('Pagination in link mode', () => {
  const href = (p: number) => `/results?page=${p}`;

  it('renders a labelled nav with a list of real links', () => {
    render(<Pagination page={4} pageCount={20} getHref={href} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 5' })).toHaveAttribute('href', '/results?page=5');
    expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '/results?page=3');
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/results?page=5');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination page={4} pageCount={20} getHref={href} />);
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Page 5' })).not.toHaveAttribute('aria-current');
  });

  it('replaces Previous on the first page with a hidden, non-link placeholder', () => {
    render(<Pagination page={1} pageCount={5} getHref={href} />);
    expect(screen.queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument();
    const placeholder = screen.getByText('Previous');
    expect(placeholder.closest('a')).toBeNull();
    expect(placeholder.closest('li')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Next' }).closest('li')).not.toHaveAttribute('aria-hidden');
  });

  it('replaces Next on the last page the same way', () => {
    render(<Pagination page={5} pageCount={5} getHref={href} />);
    expect(screen.queryByRole('link', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.getByText('Next').closest('li')).toHaveAttribute('aria-hidden', 'true');
  });

  it('hides ellipses from assistive tech', () => {
    render(<Pagination page={10} pageCount={20} getHref={href} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses).toHaveLength(2);
    ellipses.forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'));
  });

  it('calls onPageChange on click so a router can take over', async () => {
    const onPageChange = vi.fn((_page: number, event: React.MouseEvent) => event.preventDefault());
    render(<Pagination page={2} pageCount={5} getHref={href} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('link', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3, expect.anything());
  });

  it('follows the link without complaint when there is no onPageChange', async () => {
    render(<Pagination page={2} pageCount={5} getHref={() => '#p'} />);
    await userEvent.click(screen.getByRole('link', { name: 'Page 3' }));
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('takes custom labels and clamps the page', () => {
    render(
      <Pagination
        page={99}
        pageCount={3}
        getHref={href}
        aria-label="Search results pages"
        previousLabel="Newer"
        nextLabel="Older"
        getPageLabel={(p) => `Go to page ${p}`}
        className="extra"
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Search results pages' });
    expect(nav).toHaveClass('pagination', 'extra');
    expect(screen.getByRole('link', { name: 'Go to page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Newer' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Older' })).not.toBeInTheDocument();
  });

  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} pageCount={1} getHref={href} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination page={1} pageCount={20} getHref={href} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Pagination in button mode', () => {
  function Controlled({ initial = 1, pageCount = 10 }: { initial?: number; pageCount?: number }) {
    const [page, setPage] = useState(initial);
    return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
  }

  it('renders buttons, and moves the current page', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps an unavailable Previous/Next focusable but inert, so focus is not lost', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    const previous = screen.getByRole('button', { name: 'Previous' });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).toBeEnabled();
    expect(previous.closest('li')).not.toHaveAttribute('aria-hidden');
    await user.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toHaveAttribute('aria-disabled');
  });

  it('keeps focus on Next when it reaches the last page', async () => {
    const user = userEvent.setup();
    render(<Controlled initial={2} pageCount={3} />);
    const next = screen.getByRole('button', { name: 'Next' });
    await user.click(next);
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not report a change when the current page is pressed', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination page={10} pageCount={10} onPageChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('PaginationSummary', () => {
  it('describes the items on the page', () => {
    render(<PaginationSummary page={2} pageSize={20} total={312} />);
    expect(screen.getByText('Showing 21–40 of 312')).not.toHaveAttribute('role');
  });

  it('caps the end at the total and formats thousands', () => {
    render(<PaginationSummary page={63} pageSize={20} total={1250} />);
    expect(screen.getByText(`Showing 1,241–1,250 of 1,250`)).toBeInTheDocument();
  });

  it('handles no items', () => {
    render(<PaginationSummary page={1} pageSize={20} total={0} />);
    expect(screen.getByText('Showing 0–0 of 0')).toBeInTheDocument();
  });

  it('can be a polite live region with custom wording', () => {
    render(
      <PaginationSummary
        page={1}
        pageSize={10}
        total={4}
        live
        format={({ start, end, total }) => `${start} to ${end} of ${total} people`}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('1 to 4 of 4 people');
  });
});

describe('getPageCount', () => {
  it('rounds up and never returns less than one', () => {
    expect(getPageCount(312, 20)).toBe(16);
    expect(getPageCount(0, 20)).toBe(1);
  });
});
