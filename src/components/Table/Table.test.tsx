import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import {
  compareValues,
  DataTable,
  sortRows,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableColumn,
  type TableSort,
} from './Table';

interface Person {
  id: number;
  name: string;
  age: number;
  team: string | null;
}

const people: Person[] = [
  { id: 1, name: 'Chidi', age: 34, team: 'Ethics' },
  { id: 2, name: 'amara', age: 9, team: null },
  { id: 3, name: 'Bea', age: 120, team: 'Design' },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, rowHeader: true },
  { key: 'age', header: 'Age', align: 'end', sortable: true },
  { key: 'team', header: <em>Team</em>, sortable: true },
];

const getRowKey = (p: Person) => p.id;

/** First-column text of each body row, top to bottom. */
function rowNames() {
  const [, body] = screen.getAllByRole('rowgroup');
  return within(body!)
    .getAllByRole('row')
    .map((row) => row.querySelector('th, td')!.textContent);
}

describe('Table primitives', () => {
  it('renders a captioned table inside a named, focusable scroll region', async () => {
    const user = userEvent.setup();
    render(
      <Table caption="Invoices">
        <TableHead>
          <TableRow>
            <TableHeader>Number</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>INV-1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table', { name: 'Invoices' });
    const region = screen.getByRole('region', { name: 'Invoices' });
    expect(region).toContainElement(table);
    await user.tab();
    expect(region).toHaveFocus();
    expect(screen.getByRole('columnheader', { name: 'Number' })).toHaveAttribute('scope', 'col');
  });

  it('can hide the caption visually while keeping the name', () => {
    render(
      <Table caption="Hidden name" hideCaption>
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Hidden name' })).toBeInTheDocument();
    expect(screen.getByText('Hidden name')).toHaveClass('hiddenCaption');
  });

  it('applies options to the table and passes attributes through', () => {
    render(
      <Table
        caption="Opts"
        density="compact"
        striped
        hoverable
        stickyHeader
        maxHeight="10rem"
        className="outer"
        data-testid="t"
      >
        <TableBody />
      </Table>,
    );
    const table = screen.getByTestId('t');
    expect(table).toHaveClass('table', 'compact', 'striped', 'hoverable', 'sticky');
    expect(screen.getByRole('region')).toHaveStyle({ maxHeight: '10rem' });
    expect(screen.getByRole('region').parentElement).toHaveClass('outer');
  });

  it('leaves the region unbounded and adds no status region by default', () => {
    render(
      <Table caption="Plain">
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole('region')).not.toHaveAttribute('style');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a status region when given a status string', () => {
    render(
      <Table caption="S" status="Sorted by Name, ascending">
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Name, ascending');
  });

  it('aligns numeric cells and headers to the end, and sets header width', () => {
    render(
      <Table caption="N">
        <TableHead>
          <TableRow>
            <TableHeader align="end" width="8rem" style={{ color: 'red' }}>
              Total
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="end">12</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const header = screen.getByRole('columnheader', { name: 'Total' });
    expect(header).toHaveClass('alignEnd');
    expect(header).toHaveStyle({ width: '8rem', color: 'rgb(255, 0, 0)' });
    expect(screen.getByRole('cell', { name: '12' })).toHaveClass('alignEnd');
  });

  it('only sets aria-sort on a sorted header', () => {
    const onSort = vi.fn();
    render(
      <Table caption="Sort">
        <TableHead>
          <TableRow>
            <TableHeader sort="ascending">Static</TableHeader>
            <TableHeader>Plain</TableHeader>
            <TableHeader onSort={onSort}>Unsorted</TableHeader>
            <TableHeader onSort={onSort} sort="descending">
              Sorted
            </TableHeader>
          </TableRow>
        </TableHead>
      </Table>,
    );
    // Server-sorted data can mark a non-interactive header too.
    expect(screen.getByRole('columnheader', { name: 'Static' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('columnheader', { name: 'Plain' })).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', { name: 'Unsorted' })).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', { name: 'Sorted' })).toHaveAttribute('aria-sort', 'descending');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Table caption="People">
        <TableHead>
          <TableRow>
            <TableHeader onSort={() => {}} sort="ascending">
              Name
            </TableHeader>
            <TableHeader align="end">Age</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableHeader scope="row">Ann</TableHeader>
            <TableCell align="end">3</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('compareValues', () => {
  it('compares numbers numerically', () => {
    expect(compareValues(9, 120)).toBeLessThan(0);
  });

  it('compares dates by time', () => {
    expect(compareValues(new Date(2026, 0, 2), new Date(2025, 0, 1))).toBeGreaterThan(0);
  });

  it('compares text locale-aware, ignoring case and with numeric parts', () => {
    expect(compareValues('item 2', 'Item 10')).toBeLessThan(0);
    expect(compareValues('a', 'A')).toBe(0);
  });

  it('puts empty values last', () => {
    expect(compareValues(null, 'a')).toBeGreaterThan(0);
    expect(compareValues('a', undefined)).toBeLessThan(0);
    expect(compareValues('', '')).toBe(0);
  });
});

describe('sortRows', () => {
  it('returns an unsorted copy without a sort or with an unknown column', () => {
    expect(sortRows(people, columns, null)).toEqual(people);
    expect(sortRows(people, columns, { key: 'missing', direction: 'ascending' })).toEqual(people);
    expect(sortRows(people, columns, null)).not.toBe(people);
  });

  it('uses a column sortValue or compare when given', () => {
    const custom: TableColumn<Person>[] = [
      { key: 'len', header: 'Len', sortValue: (p) => p.name.length },
      { key: 'rev', header: 'Rev', compare: (a, b) => b.id - a.id },
    ];
    expect(sortRows(people, custom, { key: 'len', direction: 'ascending' }).map((p) => p.name)).toEqual([
      'Bea',
      'Chidi',
      'amara',
    ]);
    expect(sortRows(people, custom, { key: 'rev', direction: 'descending' }).map((p) => p.id)).toEqual([1, 2, 3]);
  });
});

describe('DataTable', () => {
  it('renders column headers, row headers and default cells', () => {
    render(<DataTable caption="People" columns={columns} rows={people} getRowKey={getRowKey} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByRole('rowheader', { name: 'Chidi' })).toHaveAttribute('scope', 'row');
    expect(screen.getByRole('cell', { name: '120' })).toHaveClass('alignEnd');
  });

  it('uses a cell renderer when given', () => {
    render(
      <DataTable
        caption="People"
        columns={[{ key: 'name', header: 'Name', cell: (p: Person, i) => `${i + 1}. ${p.name}` }]}
        rows={people}
        getRowKey={getRowKey}
      />,
    );
    expect(screen.getByRole('cell', { name: '1. Chidi' })).toBeInTheDocument();
  });

  it('shows a full-width empty row when there are no rows', () => {
    render(<DataTable caption="People" columns={columns} rows={[]} getRowKey={getRowKey} emptyMessage="Nobody here" />);
    const cell = screen.getByRole('cell', { name: 'Nobody here' });
    expect(cell).toHaveAttribute('colspan', '3');
  });

  it('defaults the empty message to "No results"', () => {
    render(<DataTable caption="People" columns={columns} rows={[]} getRowKey={getRowKey} />);
    expect(screen.getByRole('cell', { name: 'No results' })).toBeInTheDocument();
  });

  it('sorts itself when uncontrolled, toggling direction and aria-sort, and announces it', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable caption="People" columns={columns} rows={people} getRowKey={getRowKey} onSortChange={onSortChange} />,
    );
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    expect(rowNames()).toEqual(['Chidi', 'amara', 'Bea']);

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(rowNames()).toEqual(['amara', 'Bea', 'Chidi']);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
    expect(status).toHaveTextContent('Sorted by Name, ascending');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'ascending' });

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(rowNames()).toEqual(['Chidi', 'Bea', 'amara']);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending');
    expect(status).toHaveTextContent('Sorted by Name, descending');

    // A different column starts ascending again; the old one loses aria-sort.
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(rowNames()).toEqual(['amara', 'Chidi', 'Bea']);
    expect(screen.getByRole('columnheader', { name: 'Name' })).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('announces with the header text, or the label when given', async () => {
    const user = userEvent.setup();
    const labelled = columns.map((c) => (c.key === 'age' ? { ...c, label: 'Age in years' } : c));
    render(<DataTable caption="People" columns={labelled} rows={people} getRowKey={getRowKey} />);
    await user.click(screen.getByRole('button', { name: 'Team' }));
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Team, ascending');
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Age in years, ascending');
  });

  it('starts from defaultSort', () => {
    render(
      <DataTable
        caption="People"
        columns={columns}
        rows={people}
        getRowKey={getRowKey}
        defaultSort={{ key: 'age', direction: 'descending' }}
      />,
    );
    expect(rowNames()).toEqual(['Bea', 'Chidi', 'amara']);
  });

  it('renders rows in the given order when controlled, and reports the requested sort', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const { rerender } = render(
      <DataTable
        caption="People"
        columns={columns}
        rows={people}
        getRowKey={getRowKey}
        sort={null}
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'age', direction: 'ascending' });
    // Not sorted by the table, and not marked sorted until the parent says so.
    expect(rowNames()).toEqual(['Chidi', 'amara', 'Bea']);
    expect(screen.getByRole('columnheader', { name: 'Age' })).not.toHaveAttribute('aria-sort');

    rerender(
      <DataTable
        caption="People"
        columns={columns}
        rows={people}
        getRowKey={getRowKey}
        sort={{ key: 'age', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute('aria-sort', 'ascending');
    // Still the parent's order: a controlled table never reorders rows itself.
    expect(rowNames()).toEqual(['Chidi', 'amara', 'Bea']);
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', direction: 'descending' });
  });

  it('works end to end with a parent that sorts via sortRows', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [sort, setSort] = useState<TableSort | null>(null);
      return (
        <DataTable
          caption="People"
          columns={columns}
          rows={sortRows(people, columns, sort)}
          getRowKey={getRowKey}
          sort={sort}
          onSortChange={setSort}
        />
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Team' }));
    // The empty team sorts last in both directions.
    expect(rowNames()).toEqual(['Bea', 'Chidi', 'amara']);
    await user.click(screen.getByRole('button', { name: 'Team' }));
    expect(rowNames()).toEqual(['Chidi', 'Bea', 'amara']);
  });

  it('adds no status region when no column is sortable', () => {
    render(
      <DataTable caption="People" columns={[{ key: 'name', header: 'Name' }]} rows={people} getRowKey={getRowKey} />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DataTable
        caption="People"
        columns={columns}
        rows={people}
        getRowKey={getRowKey}
        defaultSort={{ key: 'name', direction: 'ascending' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('scroll region tab stop', () => {
    let callbacks: Array<() => void> = [];
    const disconnect = vi.fn();
    const sizes = { scrollWidth: 400, clientWidth: 400, scrollHeight: 100, clientHeight: 100 };

    beforeEach(() => {
      callbacks = [];
      disconnect.mockClear();
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(callback: () => void) {
            callbacks.push(callback);
          }
          observe() {}
          disconnect = disconnect;
        },
      );
      for (const [key, value] of Object.entries(sizes)) {
        vi.spyOn(HTMLElement.prototype, key as keyof typeof sizes, 'get').mockImplementation(function (this: HTMLElement) {
          return this.getAttribute('role') === 'region' ? (sizes as Record<string, number>)[`_${key}`] ?? value : 0;
        });
      }
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
      for (const key of Object.keys(sizes)) delete (sizes as Record<string, number>)[`_${key}`];
    });

    it('is not a tab stop while the whole table fits', async () => {
      const user = userEvent.setup();
      render(<DataTable caption="Invoices" columns={columns} rows={people} getRowKey={getRowKey} />);
      expect(screen.getByRole('region', { name: 'Invoices' })).not.toHaveAttribute('tabindex');
      await user.tab();
      expect(screen.getByRole('region', { name: 'Invoices' })).not.toHaveFocus();
    });

    it('becomes a tab stop when the table overflows sideways or downwards, and stops again when it fits', () => {
      const { unmount } = render(<DataTable caption="Invoices" columns={columns} rows={people} getRowKey={getRowKey} />);
      const region = screen.getByRole('region', { name: 'Invoices' });

      (sizes as Record<string, number>)._scrollWidth = 900;
      act(() => callbacks.forEach((callback) => callback()));
      expect(region).toHaveAttribute('tabindex', '0');

      (sizes as Record<string, number>)._scrollWidth = 400;
      (sizes as Record<string, number>)._scrollHeight = 600;
      act(() => callbacks.forEach((callback) => callback()));
      expect(region).toHaveAttribute('tabindex', '0');

      delete (sizes as Record<string, number>)._scrollHeight;
      act(() => callbacks.forEach((callback) => callback()));
      expect(region).not.toHaveAttribute('tabindex');

      unmount();
      expect(disconnect).toHaveBeenCalled();
    });
  });
});
