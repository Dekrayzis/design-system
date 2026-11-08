import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Key,
  type ReactNode,
  type RefObject,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { textFromNode } from '../../utils/textFromNode';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Table.module.css';

export type TableAlign = 'start' | 'end';
export type TableDensity = 'comfortable' | 'compact';
export type SortDirection = 'ascending' | 'descending';

export interface TableSort {
  /** The `key` of the sorted column. */
  key: string;
  direction: SortDirection;
}

/* ------------------------------------------------------------------------------------------------
 * Primitives
 * ---------------------------------------------------------------------------------------------- */

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'className'> {
  /** Names the table and its scroll region. Required: every data table needs a name. */
  caption: ReactNode;
  /** Keep the caption for screen readers only, when a visible heading already says the same. */
  hideCaption?: boolean;
  /** Pin the header row while the body scrolls. Pair with `maxHeight`. */
  stickyHeader?: boolean;
  /** Bounds the scroll region's height, e.g. `'20rem'`. Needed for `stickyHeader` to take effect. */
  maxHeight?: CSSProperties['maxHeight'];
  density?: TableDensity;
  /** Shade alternate body rows. */
  striped?: boolean;
  /** Highlight the body row under the pointer. */
  hoverable?: boolean;
  /**
   * Text for a polite, visually hidden live region next to the table, such as "Sorted by Name,
   * ascending". Pass a string from the first render (an empty one is fine) so the region exists
   * before it changes; leave it `undefined` for tables that never announce anything.
   */
  status?: string;
  /** Class for the outer wrapper (the table sits inside a scroll region). */
  className?: string;
}

/**
 * Whether the element overflows its box. Without ResizeObserver it assumes it does, so the region
 * stays keyboard-scrollable.
 */
function useOverflow(ref: RefObject<HTMLElement | null>) {
  const [overflows, setOverflows] = useState(true);
  useLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = ref.current!;
    const measure = () =>
      setOverflows(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // The table inside can grow without the region changing size, e.g. when rows are added.
    observer.observe(el.firstElementChild!);
    measure();
    return () => observer.disconnect();
  }, [ref]);
  return overflows;
}

/**
 * A semantic data table inside a named scroll region. While the table overflows, the region is
 * keyboard-focusable, so wide tables can be scrolled sideways on narrow screens without a mouse.
 */
export function Table({
  caption,
  hideCaption = false,
  stickyHeader = false,
  maxHeight,
  density = 'comfortable',
  striped = false,
  hoverable = false,
  status,
  className,
  children,
  ...rest
}: TableProps) {
  const captionId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollable = useOverflow(scrollRef);
  return (
    <div className={cx(styles.root, className)}>
      <div
        ref={scrollRef}
        role="region"
        aria-labelledby={captionId}
        // Focusable while it overflows, so keyboard users can scroll it (WCAG 2.1.1, 1.4.10),
        // without adding an empty tab stop when the whole table already fits.
        tabIndex={scrollable ? 0 : undefined}
        className={styles.scroll}
        style={maxHeight === undefined ? undefined : { maxHeight }}
      >
        <table
          className={cx(
            styles.table,
            styles[density],
            stickyHeader && styles.sticky,
            striped && styles.striped,
            hoverable && styles.hoverable,
          )}
          {...rest}
        >
          <caption id={captionId} className={cx(styles.caption, hideCaption && styles.hiddenCaption)}>
            {caption}
          </caption>
          {children}
        </table>
      </div>
      {status !== undefined && <VisuallyHidden role="status">{status}</VisuallyHidden>}
    </div>
  );
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}

export interface TableHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** `col` for column headers (the default), `row` for a header cell that names its row. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  /** `end` for numeric columns. */
  align?: TableAlign;
  /** Current sort of this column. `aria-sort` is only set when the column is sorted. */
  sort?: SortDirection | 'none';
  /** Makes the header a sort button. */
  onSort?: () => void;
  width?: CSSProperties['width'];
}

function SortIcon({ direction }: { direction: SortDirection | 'none' }) {
  return (
    <svg
      className={styles.sortIcon}
      data-direction={direction}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction !== 'descending' && <path d="m5 6.5 3-3 3 3" />}
      {direction !== 'ascending' && <path d="m5 9.5 3 3 3-3" />}
    </svg>
  );
}

/** A `<th>`. With `onSort` its content becomes a `<button>` and the cell carries `aria-sort`. */
export function TableHeader({
  scope = 'col',
  align = 'start',
  sort = 'none',
  onSort,
  width,
  className,
  style,
  children,
  ...rest
}: TableHeaderProps) {
  return (
    <th
      scope={scope}
      aria-sort={sort === 'none' ? undefined : sort}
      className={cx(styles.header, align === 'end' && styles.alignEnd, className)}
      style={width === undefined ? style : { ...style, width }}
      {...rest}
    >
      {onSort ? (
        <button type="button" className={styles.sortButton} onClick={onSort}>
          <span>{children}</span>
          <SortIcon direction={sort} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** `end` right-aligns (in left-to-right text) with tabular figures, for numbers. */
  align?: TableAlign;
}

export function TableCell({ align = 'start', className, ...rest }: TableCellProps) {
  return <td className={cx(styles.cell, align === 'end' && styles.alignEnd, className)} {...rest} />;
}

export interface TableEmptyProps extends HTMLAttributes<HTMLTableCellElement> {
  /** Number of columns, so the message spans the full width. */
  colSpan: number;
}

/** A full-width body row with a message, for when there are no rows to show. */
export function TableEmpty({ colSpan, className, ...rest }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={cx(styles.empty, className)} {...rest} />
    </tr>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Sorting
 * ---------------------------------------------------------------------------------------------- */

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * The default comparator: numbers numerically, dates by time, everything else as locale-aware
 * text ("Item 2" before "Item 10"). Empty values (`null`, `undefined`, `''`) sort last;
 * `sortRows` keeps them last when descending too.
 */
function isEmpty(value: unknown): boolean {
  return value == null || value === '';
}

export function compareValues(a: unknown, b: unknown): number {
  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);
  if (aEmpty || bEmpty) return Number(aEmpty) - Number(bEmpty);
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return collator.compare(String(a), String(b));
}

export interface TableColumn<Row> {
  /** Unique per column. Also the default property read from each row. */
  key: string;
  header: ReactNode;
  /** Renders the cell. Defaults to `row[key]`. */
  cell?: (row: Row, rowIndex: number) => ReactNode;
  /** `end` for numbers: right-aligned with tabular figures. */
  align?: TableAlign;
  sortable?: boolean;
  /** The value used for sorting. Defaults to `row[key]`. */
  sortValue?: (row: Row) => unknown;
  /** A full comparator for ascending order, when `sortValue` isn't enough. */
  compare?: (a: Row, b: Row) => number;
  width?: CSSProperties['width'];
  /** Render this column's cells as `<th scope="row">`, naming each row. */
  rowHeader?: boolean;
  /** Plain-text name for announcements when `header` isn't a string. */
  label?: string;
}

function read<Row>(row: Row, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

/** Returns a sorted copy of `rows` (stable). Use it to sort before slicing rows into pages. */
export function sortRows<Row>(rows: readonly Row[], columns: readonly TableColumn<Row>[], sort: TableSort | null | undefined): Row[] {
  const copy = [...rows];
  const column = sort && columns.find((c) => c.key === sort.key);
  if (!sort || !column) return copy;
  const sign = sort.direction === 'ascending' ? 1 : -1;
  const { compare } = column;
  if (compare) return copy.sort((a, b) => sign * compare(a, b));
  const value = column.sortValue ?? ((row: Row) => read(row, column.key));
  return copy.sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    // Empty values stay at the bottom in both directions.
    return isEmpty(va) || isEmpty(vb) ? compareValues(va, vb) : sign * compareValues(va, vb);
  });
}

/* ------------------------------------------------------------------------------------------------
 * DataTable: the declarative convenience
 * ---------------------------------------------------------------------------------------------- */

export interface DataTableProps<Row>
  extends Omit<TableProps, 'children' | 'status'> {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  /** A stable key per row, such as its id. */
  getRowKey: (row: Row, index: number) => Key;
  /**
   * Controlled sort. When set, rows are rendered in the order given: sort them yourself (for
   * example with `sortRows`, or on the server) in response to `onSortChange`.
   */
  sort?: TableSort | null;
  /** Initial sort for the uncontrolled mode, where the table sorts `rows` itself. */
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  /** Shown in a full-width row when `rows` is empty. */
  emptyMessage?: ReactNode;
}

/**
 * A table from `columns` and `rows`. Sortable columns get a header button, `aria-sort` and a polite
 * announcement of the new order.
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  sort: controlledSort,
  defaultSort = null,
  onSortChange,
  emptyMessage = 'No results',
  ...tableProps
}: DataTableProps<Row>) {
  const [uncontrolledSort, setUncontrolledSort] = useState<TableSort | null>(defaultSort);
  const [announcement, setAnnouncement] = useState('');
  const controlled = controlledSort !== undefined;
  const sort = controlled ? controlledSort : uncontrolledSort;

  const shownRows = useMemo(
    () => (controlled ? rows : sortRows(rows, columns, uncontrolledSort)),
    [controlled, rows, columns, uncontrolledSort],
  );

  const anySortable = columns.some((c) => c.sortable);

  function sortBy(column: TableColumn<Row>) {
    const direction: SortDirection =
      sort?.key === column.key && sort.direction === 'ascending' ? 'descending' : 'ascending';
    const next = { key: column.key, direction };
    if (!controlled) setUncontrolledSort(next);
    onSortChange?.(next);
    setAnnouncement(`Sorted by ${column.label ?? textFromNode(column.header)}, ${direction}`);
  }

  return (
    <Table {...tableProps} status={anySortable ? announcement : undefined}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeader
              key={column.key}
              align={column.align}
              width={column.width}
              sort={sort?.key === column.key ? sort.direction : 'none'}
              onSort={column.sortable ? () => sortBy(column) : undefined}
            >
              {column.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {shownRows.length === 0 ? (
          <TableEmpty colSpan={columns.length}>{emptyMessage}</TableEmpty>
        ) : (
          shownRows.map((row, rowIndex) => (
            <TableRow key={getRowKey(row, rowIndex)}>
              {columns.map((column) => {
                const content = column.cell ? column.cell(row, rowIndex) : (read(row, column.key) as ReactNode);
                return column.rowHeader ? (
                  <TableHeader key={column.key} scope="row" align={column.align}>
                    {content}
                  </TableHeader>
                ) : (
                  <TableCell key={column.key} align={column.align}>
                    {content}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
