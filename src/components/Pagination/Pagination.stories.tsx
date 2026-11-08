import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Pagination, PaginationSummary, type PaginationLinkProps } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { page: 4, pageCount: 20, getHref: (page: number) => `?page=${page}` },
  argTypes: {
    getHref: { control: false },
    onPageChange: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Page navigation: a `<nav aria-label="Pagination">` holding a list of page links, with `aria-current="page"` on the current one and ellipses for long ranges. Use link mode (`getHref`) when each page has its own URL, so pages can be shared, bookmarked and crawled; use button mode (`onPageChange`) for client-side paging that does not change the URL, such as a table. For an endless feed, a "Load more" button is often kinder than pages.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Link mode inside a story: real `<a href>` links whose clicks are intercepted, the way a
 * client-side router would, so the story stays on this page.
 */
function RoutedPagination({
  initialPage,
  ...rest
}: Pick<PaginationLinkProps, 'pageCount' | 'siblingCount' | 'boundaryCount' | 'aria-label'> & { initialPage: number }) {
  const [page, setPage] = useState(initialPage);
  return (
    <Pagination
      {...rest}
      page={page}
      getHref={(p: number) => `?page=${p}`}
      onPageChange={(p: number, event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setPage(p);
      }}
    />
  );
}

/**
 * Link mode: every page is a real `<a href>` built by `getHref`, so open in new tab, history and
 * crawling work. Clicking a page here is intercepted, as a client-side router would do.
 */
export const LinkMode: Story = {
  render: () => <RoutedPagination initialPage={4} pageCount={20} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Page 5' })).toHaveAttribute('href', '?page=5');

    await userEvent.click(canvas.getByRole('link', { name: 'Page 5' }));
    await expect(canvas.getByRole('link', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Page 4' })).not.toHaveAttribute('aria-current');
  },
};

function ButtonPagination({ initialPage = 1, pageCount = 12 }: { initialPage?: number; pageCount?: number }) {
  const [page, setPage] = useState(initialPage);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

/**
 * Button mode: pages are `<button>`s that call `onPageChange`, for paging that does not change the
 * URL. On the last page, Next stays focusable with `aria-disabled`, so keyboard focus is not lost.
 */
export const ButtonMode: Story = {
  render: () => <ButtonPagination initialPage={10} pageCount={12} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();

    const next = canvas.getByRole('button', { name: 'Next' });
    await userEvent.click(next);
    await expect(canvas.getByRole('button', { name: 'Page 11' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(next);
    await expect(canvas.getByRole('button', { name: 'Page 12' })).toHaveAttribute('aria-current', 'page');
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).toHaveFocus();

    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    await expect(canvas.getByRole('button', { name: 'Page 11' })).toHaveAttribute('aria-current', 'page');
  },
};

/** With only a few pages, every page is listed and no ellipsis is needed. */
export const FewPages: Story = {
  args: { page: 2, pageCount: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link', { name: /^Page \d$/ })).toHaveLength(5);
    await expect(canvas.queryByText('…')).not.toBeInTheDocument();
  },
};

/**
 * Many pages collapse into ellipses: `boundaryCount` pages at each end and `siblingCount` either
 * side of the current page. The ellipses are hidden from screen readers, since the numbers around
 * them already say which pages are skipped.
 */
export const ManyPages: Story = {
  render: () => (
    <Stack gap={4}>
      <RoutedPagination initialPage={50} pageCount={100} aria-label="Default range" />
      <RoutedPagination initialPage={50} pageCount={100} siblingCount={2} boundaryCount={2} aria-label="Wider range" />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navElement = canvas.getByRole('navigation', { name: 'Default range' });
    // On screen: both ellipses.
    await expect([...navElement.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Previous',
      '1',
      '…',
      '49',
      '50',
      '51',
      '…',
      '100',
      'Next',
    ]);
    // To assistive tech: the ellipses are hidden, the numbers carry the meaning.
    await expect(within(navElement).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Previous',
      '1',
      '49',
      '50',
      '51',
      '100',
      'Next',
    ]);
  },
};

/**
 * On the first page there is no previous page, so in link mode Previous is a greyed placeholder
 * rather than a link: it keeps the layout steady and is hidden from assistive tech.
 */
export const FirstPage: Story = {
  args: { page: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '?page=2');
  },
};

/** The last page mirrors the first: Next becomes a placeholder and the last page is current. */
export const LastPage: Story = {
  args: { page: 20 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', { name: 'Next' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Page 20' })).toHaveAttribute('aria-current', 'page');
  },
};

function WithSummaryExample() {
  const [page, setPage] = useState(2);
  return (
    <Stack direction="row" gap={4} align="center" justify="space-between" wrap>
      <PaginationSummary page={page} pageSize={20} total={312} live />
      <Pagination page={page} pageCount={16} onPageChange={setPage} aria-label="Results pages" />
    </Stack>
  );
}

/**
 * `PaginationSummary` says which items are showing, such as "Showing 21–40 of 312". With `live` it
 * is a polite status message, so client-side page changes are announced.
 */
export const WithSummary: Story = {
  render: () => <WithSummaryExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 21–40 of 312');
    await userEvent.click(canvas.getByRole('button', { name: 'Page 3' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 41–60 of 312');
  },
};
