import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import segmented from '../../styles/segmented.module.css';
import styles from './Tabs.module.css';

interface TabsContextValue {
  baseId: string;
  value: string;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/** How the tabs inside a TabList draw themselves. */
const TabListVariantContext = createContext<TabListVariant>('underline');

export type TabListVariant = 'underline' | 'pill';

function useTabs(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return context;
}

const toId = (value: string) => value.replace(/[^\w-]/g, '_');

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Switches between panels of related content in the same place. Implements the WAI-ARIA tabs
 * pattern: one tab stop for the list, arrow keys / Home / End to move, automatic activation.
 * If each "tab" should be its own URL, use navigation links instead.
 */
export function Tabs({ value: controlledValue, defaultValue = '', onValueChange, className, children }: TabsProps) {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;

  const select = (next: string) => {
    if (controlledValue === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ baseId, value, select }}>
      <div className={cx(styles.tabs, className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  /** Accessible name for the tab list, e.g. "Account settings". */
  label: string;
  /**
   * `underline` (default): a line under the selected tab.
   * `pill`: a segmented control with an accent pill that slides under the selected tab, as in
   * `ButtonGroup`. Pill tabs share one width, sized by the widest label.
   */
  variant?: TabListVariant;
  /** Pill variant only. */
  size?: 'sm' | 'md' | 'lg';
  /** Pill variant only: stretch to the container's width. */
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function TabList({
  label,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className,
  children,
}: TabListProps) {
  const { value, select } = useTabs('TabList');
  const listRef = useRef<HTMLDivElement>(null);

  // Pill: the thumb is pure CSS driven by the tab count and selected index. Tabs are arbitrary
  // children, so read both from the rendered list rather than from props.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || variant !== 'pill') return;
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    const selectedIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    list.style.setProperty('--segments', String(tabs.length));
    list.style.setProperty('--selected', String(Math.max(selectedIndex, 0)));
    list.toggleAttribute('data-has-value', selectedIndex !== -1);
  });

  // With no (or an unknown) value, no tab would be in the tab order and the list would be
  // unreachable by keyboard. Fall back to the first enabled tab.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || list.querySelector('[role="tab"][aria-selected="true"]')) return;
    const first = list.querySelector<HTMLButtonElement>('[role="tab"]:not(:disabled)');
    if (first?.dataset.value !== undefined) select(first.dataset.value);
  }, [value, select]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;

    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next === null) return;

    event.preventDefault();
    const target = tabs[next];
    target?.focus();
    target?.click();
  };

  const isPill = variant === 'pill';

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      data-variant={variant}
      className={cx(
        isPill ? cx(segmented.group, segmented[size], styles.pillList) : styles.list,
        isPill && fullWidth && cx(segmented.fullWidth, styles.pillListFull),
        className,
      )}
      onKeyDown={onKeyDown}
    >
      {isPill && <span className={segmented.thumb} aria-hidden="true" />}
      <TabListVariantContext.Provider value={variant}>{children}</TabListVariantContext.Provider>
    </div>
  );
}

export interface TabProps {
  value: string;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function Tab({ value, icon, disabled, className, children }: TabProps) {
  const { baseId, value: selected, select } = useTabs('Tab');
  const variant = useContext(TabListVariantContext);
  const isSelected = selected === value;
  const isPill = variant === 'pill';

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${toId(value)}`}
      aria-controls={`${baseId}-panel-${toId(value)}`}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      disabled={disabled}
      className={cx(isPill ? segmented.segment : styles.tab, className)}
      onClick={() => select(value)}
    >
      {icon && (
        <span className={isPill ? segmented.icon : styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {isPill ? <span className={segmented.label}>{children}</span> : children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabPanel({ value, className, children }: TabPanelProps) {
  const { baseId, value: selected } = useTabs('TabPanel');
  const isSelected = selected === value;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${toId(value)}`}
      aria-labelledby={`${baseId}-tab-${toId(value)}`}
      hidden={!isSelected}
      tabIndex={0}
      className={cx(styles.panel, className)}
    >
      {isSelected && children}
    </div>
  );
}
