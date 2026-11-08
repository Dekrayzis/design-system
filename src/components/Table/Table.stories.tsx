import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Pagination, PaginationSummary, getPageCount } from '../Pagination/Pagination';
import { Stack } from '../Stack/Stack';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  sortRows,
  type TableColumn,
  type TableSort,
} from './Table';

interface Member {
  id: number;
  name: string;
  role: string;
  location: string;
  commits: number;
  joined: Date;
}

const NAMES = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton', 'Tim Berners-Lee', 'Radia Perlman', 'Dennis Ritchie', 'Barbara Liskov', 'Ken Thompson', 'Frances Allen'];
const ROLES = ['Engineer', 'Designer', 'Researcher', 'Manager'];
const PLACES = ['London', 'Leeds', 'Glasgow', 'Cardiff', 'Belfast'];

/** Deterministic sample data, so screenshots and play functions are stable. */
function makeMembers(count: number): Member[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: count > NAMES.length ? `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}` : NAMES[i]!,
    role: ROLES[i % ROLES.length]!,
    location: PLACES[(i * 3) % PLACES.length]!,
    commits: ((i * 7919) % 2400) + 12,
    joined: new Date(2018 + (i % 7), (i * 5) % 12, 1 + (i % 27)),
  }));
}

const members = makeMembers(6);
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const numberFormat = new Intl.NumberFormat('en-GB');

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Name', sortable: true, rowHeader: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'location', header: 'Location', sortable: true },
  { key: 'commits', header: 'Commits', align: 'end', sortable: true, cell: (m) => numberFormat.format(m.commits) },
  {
    key: 'joined',
    header: 'Joined',
    align: 'end',
    sortable: true,
    cell: (m) => <time dateTime={m.joined.toISOString().slice(0, 10)}>{dateFormat.format(m.joined)}</time>,
  },
];

const getRowKey = (m: Member) => m.id;

/** Text of the first cell in each body row. */
function firstColumn(canvasElement: HTMLElement) {
  const body = canvasElement.querySelector('tbody')!;
  return [...body.querySelectorAll('tr')].map((row) => row.querySelector('th, td')!.textContent);
}

const meta = {
  title: 'Components/Table',
  component: Table,
  subcomponents: { DataTable, TableHead, TableBody, TableRow, TableHeader, TableCell },
  args: { caption: 'Team members' },
  parameters: {
    docs: {
      description: {
        component:
          'A semantic `<table>` with a required `<caption>`, `<thead>`, `<tbody>` and scoped `<th>` headers, wrapped in a named scroll region that becomes keyboard-focusable when the table overflows, so narrow screens can scroll it without a mouse. Use `DataTable` for the common case (columns, rows, sorting, empty state) or the `Table*` primitives for full control. Reach for a list of `Card`s instead when each item is a self-contained object people scan one at a time rather than compare across columns.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A `DataTable` built from `columns` and `rows`. The caption names both the table and its scroll
 * region, and each person's name is a row header (`<th scope="row">`).
 */
export const Default: Story = {
  render: () => (
    <DataTable
      caption="Team members"
      columns={columns.map((c) => ({ ...c, sortable: false }))}
      rows={members}
      getRowKey={getRowKey}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Team members' })).toBeInTheDocument();
    // The whole table fits, so its scroll region adds no tab stop.
    await expect(canvas.getByRole('region', { name: 'Team members' })).not.toHaveAttribute('tabindex');
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(5);
    await expect(canvas.getByRole('rowheader', { name: 'Ada Lovelace' })).toBeInTheDocument();
  },
};

/**
 * Uncontrolled sorting: the table sorts `rows` itself. Each sortable header holds a `<button>`, the
 * sorted column's `<th>` carries `aria-sort`, and a polite status message says what changed.
 */
export const SortableUncontrolled: Story = {
  name: 'Sortable (uncontrolled)',
  render: () => <DataTable caption="Team members" columns={columns} rows={members} getRowKey={getRowKey} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole('columnheader', { name: 'Name' });
    await expect(nameHeader).not.toHaveAttribute('aria-sort');

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstColumn(canvasElement)[0]).toBe('Ada Lovelace');
    await expect(canvas.getByRole('status')).toHaveTextContent('Sorted by Name, ascending');

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(firstColumn(canvasElement)[0]).toBe('Margaret Hamilton');

    await userEvent.click(canvas.getByRole('button', { name: 'Commits' }));
    await expect(nameHeader).not.toHaveAttribute('aria-sort');
    await expect(canvas.getByRole('columnheader', { name: 'Commits' })).toHaveAttribute('aria-sort', 'ascending');
  },
};

const reportSort = fn();

function ControlledTable() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'commits', direction: 'descending' });
  return (
    <DataTable
      caption="Team members by commits"
      columns={columns}
      rows={sortRows(members, columns, sort)}
      getRowKey={getRowKey}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        reportSort(next);
      }}
    />
  );
}

/**
 * Controlled sorting with `sort` and `onSortChange`. The table renders rows in the order you pass,
 * so you sort them yourself: here with the exported `sortRows`, or on the server for large data.
 */
export const SortableControlled: Story = {
  name: 'Sortable (controlled)',
  render: () => <ControlledTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const commits = canvas.getByRole('columnheader', { name: 'Commits' });
    await expect(commits).toHaveAttribute('aria-sort', 'descending');

    await userEvent.click(canvas.getByRole('button', { name: 'Commits' }));
    await expect(reportSort).toHaveBeenLastCalledWith({ key: 'commits', direction: 'ascending' });
    await expect(commits).toHaveAttribute('aria-sort', 'ascending');
    const cells = [...canvasElement.querySelectorAll('tbody tr td:nth-of-type(3)')].map((td) =>
      Number(td.textContent!.replace(/,/g, '')),
    );
    await expect(cells).toEqual([...cells].sort((a, b) => a - b));
  },
};

/**
 * Numeric columns use `align: 'end'`: right-aligned in left-to-right languages with tabular
 * figures, so digits line up for comparison. Format numbers in `cell`; sorting still uses the raw
 * value.
 */
export const NumericColumns: Story = {
  render: () => (
    <DataTable
      caption="Quarterly revenue (GBP)"
      density="compact"
      striped
      columns={[
        { key: 'region', header: 'Region', rowHeader: true },
        { key: 'q1', header: 'Q1', align: 'end', cell: (r: Record<string, number | string>) => numberFormat.format(r.q1 as number) },
        { key: 'q2', header: 'Q2', align: 'end', cell: (r: Record<string, number | string>) => numberFormat.format(r.q2 as number) },
        { key: 'q3', header: 'Q3', align: 'end', cell: (r: Record<string, number | string>) => numberFormat.format(r.q3 as number) },
        { key: 'q4', header: 'Q4', align: 'end', cell: (r: Record<string, number | string>) => numberFormat.format(r.q4 as number) },
      ]}
      rows={[
        { region: 'North', q1: 12450, q2: 9870, q3: 111200, q4: 8020 },
        { region: 'South', q1: 1340, q2: 21110, q3: 4560, q4: 117890 },
        { region: 'Wales', q1: 870, q2: 990, q3: 1011, q4: 1450 },
        { region: 'Scotland', q1: 45210, q2: 43980, q3: 40120, q4: 51800 },
      ]}
      getRowKey={(r) => r.region as string}
    />
  ),
};

/**
 * The composable primitives with row headers: the first cell of each row is a
 * `<TableHeader scope="row">`, so screen readers announce "Wednesday" as they move along a row.
 */
export const RowHeaders: Story = {
  render: () => (
    <Table caption="Opening hours">
      <TableHead>
        <TableRow>
          <TableHeader>Day</TableHeader>
          <TableHeader>Opens</TableHeader>
          <TableHeader>Closes</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          ['Monday', '09:00', '17:30'],
          ['Wednesday', '09:00', '20:00'],
          ['Saturday', '10:00', '16:00'],
        ].map(([day, opens, closes]) => (
          <TableRow key={day}>
            <TableHeader scope="row">{day}</TableHeader>
            <TableCell>
              <time dateTime={opens}>{opens}</time>
            </TableCell>
            <TableCell>
              <time dateTime={closes}>{closes}</time>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('rowheader', { name: 'Wednesday' })).toHaveAttribute('scope', 'row');
  },
};

/** With no rows, a single full-width row explains why, instead of an empty, silent table. */
export const Empty: Story = {
  render: () => (
    <DataTable
      caption="Search results"
      columns={columns}
      rows={[]}
      getRowKey={getRowKey}
      emptyMessage="No team members match “Babbage”. Try a different name."
    />
  ),
  play: async ({ canvasElement }) => {
    const cell = within(canvasElement).getByRole('cell');
    await expect(cell).toHaveAttribute('colspan', '5');
  },
};

/**
 * `stickyHeader` with `maxHeight` keeps the column headers in view while a long table scrolls
 * inside its region. `hoverable` highlights the row under the pointer.
 */
export const StickyHeader: Story = {
  render: () => (
    <DataTable
      caption="All contributors"
      stickyHeader
      hoverable
      maxHeight="18rem"
      columns={columns}
      rows={makeMembers(30)}
      getRowKey={getRowKey}
    />
  ),
};

/**
 * On a narrow screen the table keeps its columns and scrolls sideways inside its region. The region
 * is focusable and named by the caption, so keyboard users can scroll it with the arrow keys.
 */
export const NarrowScroll: Story = {
  name: 'Narrow screen (scrolls)',
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
  render: () => <DataTable caption="Team members" columns={columns} rows={members} getRowKey={getRowKey} />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Team members' });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    // The region is the first tab stop, so keyboard users can reach it and scroll with arrow keys.
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
};

/**
 * An actions column. Its header text is visually hidden but still names the column, and each
 * button adds the row's name off screen ("Edit Ada Lovelace") so the buttons are told apart.
 */
export const WithActions: Story = {
  render: () => (
    <DataTable
      caption="Team members"
      columns={[
        { key: 'name', header: 'Name', rowHeader: true },
        { key: 'role', header: 'Role', cell: (m: Member) => <Badge tone={m.role === 'Manager' ? 'accent' : 'neutral'}>{m.role}</Badge> },
        {
          key: 'actions',
          header: <VisuallyHidden>Actions</VisuallyHidden>,
          align: 'end',
          cell: (m: Member) => (
            <Stack direction="row" gap={2} justify="flex-end">
              <Button size="sm" variant="secondary">
                Edit<VisuallyHidden> {m.name}</VisuallyHidden>
              </Button>
              <Button size="sm" variant="ghost">
                Remove<VisuallyHidden> {m.name}</VisuallyHidden>
              </Button>
            </Stack>
          ),
        },
      ]}
      rows={members.slice(0, 4)}
      getRowKey={getRowKey}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Edit Grace Hopper' })).toBeInTheDocument();
  },
};

const PAGE_SIZE = 5;
const allMembers = makeMembers(23);

function PagedTable() {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [page, setPage] = useState(1);
  const sorted = sortRows(allMembers, columns, sort);
  const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <Stack gap={3}>
      <DataTable
        caption="All contributors"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
      />
      <Stack direction="row" gap={4} align="center" justify="space-between" wrap>
        <PaginationSummary page={page} pageSize={PAGE_SIZE} total={allMembers.length} live />
        <Pagination
          aria-label="Contributors pages"
          page={page}
          pageCount={getPageCount(allMembers.length, PAGE_SIZE)}
          onPageChange={setPage}
        />
      </Stack>
    </Stack>
  );
}

/**
 * Client-side paging: sort the whole list with `sortRows`, slice out the current page and pair the
 * table with `Pagination` in button mode. The live `PaginationSummary` tells screen reader users
 * the rows changed, and sorting returns to page 1.
 */
export const WithPagination: Story = {
  name: 'With pagination (client-side)',
  render: () => <PagedTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(firstColumn(canvasElement)[0]).toBe('Ada Lovelace 1');

    await userEvent.click(canvas.getByRole('button', { name: 'Page 2' }));
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await expect(firstColumn(canvasElement)[0]).toBe('Margaret Hamilton 1');
    await expect(canvas.getByText('Showing 6–10 of 23')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  },
};
