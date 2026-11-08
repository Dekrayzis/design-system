import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../utils/cx';
import styles from './Accordion.module.css';

/* -------------------------------------------------------------------------------------------------
 * Types and context
 * -----------------------------------------------------------------------------------------------*/

export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionItemData {
  /** Identifies the item in `open` / `onOpenChange`. Defaults to its position, e.g. `"0"`. */
  value?: string;
  title: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionContextValue {
  name: string | undefined;
  headingLevel: AccordionHeadingLevel;
  openValues: string[];
  controlled: boolean;
  setItemOpen: (value: string, open: boolean) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
/** Each child's position, used as its value when it has none of its own. */
const PositionContext = createContext('');

export interface AccordionProps {
  /** Shorthand for a list of `AccordionItem`s. Rendered before `children`. */
  items?: AccordionItemData[];
  /**
   * `multiple` (default): items open and close independently.
   * `single`: opening one closes the others. Uses the native `name` attribute on `<details>`, with
   * the same rule applied in React for browsers that don't support it yet.
   */
  type?: 'multiple' | 'single';
  /**
   * Level of the heading inside each summary (default 3). Pick the level that fits the page
   * outline, e.g. 2 for an FAQ directly under the page's `<h1>`.
   */
  headingLevel?: AccordionHeadingLevel;
  /** Controlled: the values of the open items. */
  open?: string[];
  /** Called with the new list of open values whenever an item opens or closes. */
  onOpenChange?: (open: string[]) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * A stack of collapsible sections built on native `<details>` and `<summary>`, so it works without
 * JavaScript, is announced as an expandable button and opens automatically when find-in-page
 * matches text inside a closed section.
 */
export function Accordion({
  items,
  type = 'multiple',
  headingLevel = 3,
  open: openProp,
  onOpenChange,
  className,
  children,
}: AccordionProps) {
  const groupName = `ds-accordion-${useId()}`;

  // Children keep their own values, else their position after the `items`.
  const offset = items?.length ?? 0;
  const childList = Children.toArray(children);
  const [uncontrolled, setUncontrolled] = useState(() => {
    const fromItems = (items ?? []).flatMap((item, index) =>
      item.defaultOpen ? [item.value ?? String(index)] : [],
    );
    const fromChildren = childList.flatMap((child, index) =>
      isValidElement<AccordionItemProps>(child) && child.props.defaultOpen
        ? [child.props.value ?? String(offset + index)]
        : [],
    );
    const all = [...fromItems, ...fromChildren];
    return type === 'single' ? all.slice(0, 1) : all;
  });
  const openValues = openProp ?? uncontrolled;

  // Several native toggle events can arrive before React re-renders (in single mode the browser
  // closes the old item and opens the new one), so work from the latest value, not the render's.
  const latest = useRef(openValues);
  latest.current = openValues;

  const setItemOpen = (value: string, isOpen: boolean) => {
    const current = latest.current;
    const next = isOpen
      ? type === 'single'
        ? [value]
        : [...current, value]
      : current.filter((v) => v !== value);
    latest.current = next;
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const context: AccordionContextValue = {
    name: type === 'single' ? groupName : undefined,
    headingLevel,
    openValues,
    controlled: openProp !== undefined,
    setItemOpen,
  };

  return (
    <div className={cx(styles.accordion, className)}>
      <AccordionContext.Provider value={context}>
        {items?.map((item, index) => (
          <AccordionItem key={item.value ?? index} value={item.value ?? String(index)} title={item.title}>
            {item.content}
          </AccordionItem>
        ))}
        {childList.map((child, index) => (
          <PositionContext.Provider key={index} value={String(offset + index)}>
            {child}
          </PositionContext.Provider>
        ))}
      </AccordionContext.Provider>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

export interface AccordionItemProps {
  /** Identifies the item in `open` / `onOpenChange`. Defaults to its position, e.g. `"0"`. */
  value?: string;
  /** The summary text, rendered inside a heading of the Accordion's `headingLevel`. */
  title: ReactNode;
  /** Open on first render (uncontrolled accordions only). */
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

/** One collapsible section: a `<details>` whose `<summary>` holds a heading. */
export function AccordionItem({ value: valueProp, title, className, children }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('<AccordionItem> must be used inside <Accordion>.');
  const { name, headingLevel, openValues, controlled, setItemOpen } = context;
  const position = useContext(PositionContext);
  const value = valueProp ?? position;
  const isOpen = openValues.includes(value);
  const ref = useRef<HTMLDetailsElement>(null);

  // Controlled: after reporting a toggle, re-render and put the DOM back if the parent kept the
  // old value. Only on that signal: syncing on every render would undo a native change whose
  // toggle event hasn't arrived yet (in single mode the browser closes one item and opens another).
  const [syncTick, setSyncTick] = useState(0);
  useLayoutEffect(() => {
    const details = ref.current!;
    if (details.open !== isOpen) details.open = isOpen;
  }, [syncTick]);

  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const nowOpen = event.currentTarget.open;
    if (nowOpen === isOpen) return;
    setItemOpen(value, nowOpen);
    if (controlled) setSyncTick((tick) => tick + 1);
  };

  const Heading = `h${headingLevel}` as const;

  return (
    <details ref={ref} name={name} open={isOpen} className={cx(styles.item, className)} onToggle={handleToggle}>
      <summary className={styles.summary}>
        <Heading className={styles.heading}>{title}</Heading>
        <svg className={styles.chevron} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
