import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { textFromNode } from '../../utils/textFromNode';
import { useAnchorPosition } from '../../utils/useAnchorPosition';
import { Button, type ButtonSize, type ButtonVariant } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import styles from './Menu.module.css';

/* -------------------------------------------------------------------------------------------------
 * Types and context
 * -----------------------------------------------------------------------------------------------*/

export interface MenuItemOption {
  label: ReactNode;
  /** Runs when the item is chosen. The menu then closes and focus returns to the trigger. */
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
  /** Renders the item as a link (`<a role="menuitem">`), for actions that navigate. */
  href?: string;
  target?: string;
  rel?: string;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Keyboard shortcut hint shown at the end of the item. Visual only. */
  shortcut?: string;
  disabled?: boolean;
  /** Danger styling, for actions such as Delete. */
  destructive?: boolean;
  /** Plain text for typeahead. Derived from `label` when omitted. */
  textValue?: string;
}

interface MenuContextValue {
  close: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(component: string) {
  const context = useContext(MenuContext);
  if (!context) throw new Error(`<${component}> must be used inside <Menu>.`);
  return context;
}

const isPrintableKey = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

const TYPEAHEAD_RESET_MS = 500;

const MoreIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <circle cx="3" cy="8" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="13" cy="8" r="1.5" />
  </svg>
);

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

export interface MenuProps {
  /**
   * The trigger's accessible name, also used to name the menu. It is the visible button text, or
   * with `iconOnly` the icon button's `aria-label` and tooltip. Make it unique on the page, for
   * example "Actions for Invoice 42" in a table row.
   */
  label: string;
  /** Render the trigger as an `IconButton` (a "⋯" icon by default) with `label` as its name. */
  iconOnly?: boolean;
  /** Icon for the trigger: the whole content with `iconOnly`, otherwise shown before the label. */
  triggerIcon?: ReactNode;
  /** Trigger variant. Defaults to `secondary` for a labelled trigger and `ghost` for `iconOnly`. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Shorthand for a flat list of `MenuItem`s. Rendered before `children`. */
  items?: MenuItemOption[];
  onOpenChange?: (open: boolean) => void;
  /** Class for the wrapper around the trigger and menu. */
  className?: string;
  children?: ReactNode;
}

/**
 * An actions menu following the WAI-ARIA menu button pattern. A button opens a `role="menu"`
 * popup in the top layer (Popover API); real focus moves onto the items, which are reached with
 * the arrow keys, Home, End and typeahead. Choosing an item runs it, closes the menu and returns
 * focus to the trigger. Use `Select` to pick a value and plain links for site navigation.
 */
export function Menu({
  label,
  iconOnly = false,
  triggerIcon,
  variant,
  size,
  disabled,
  items,
  onOpenChange,
  className,
  children,
}: MenuProps) {
  const baseId = useId();
  const triggerId = `ds-menu-${baseId}-trigger`;
  const menuId = `ds-menu-${baseId}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpenState] = useState(false);
  const focusOnOpen = useRef<'first' | 'last'>('first');
  const typeahead = useRef({ buffer: '', timer: 0 });

  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  const openMenu = (focus: 'first' | 'last') => {
    focusOnOpen.current = focus;
    setOpen(true);
  };

  /** Close and return focus to the trigger (after choosing, Escape and Tab). */
  const close = () => {
    triggerRef.current!.focus();
    setOpen(false);
  };

  // The menu is always rendered (hidden while closed), so the ref is set whenever this runs.
  const getItems = () =>
    Array.from(contentRef.current!.querySelectorAll<HTMLElement>('[role="menuitem"]'));

  /* ---- top-layer popover, then focus the first or last item ---- */
  useLayoutEffect(() => {
    const content = contentRef.current!;
    if (typeof content.showPopover !== 'function') return;
    const isOpen = content.matches(':popover-open');
    if (open && !isOpen) content.showPopover();
    if (!open && isOpen) content.hidePopover();
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const all = getItems();
    all[focusOnOpen.current === 'first' ? 0 : all.length - 1]?.focus();
  }, [open]);

  useAnchorPosition(open, triggerRef, contentRef);

  /* ---- outside clicks and focus leaving close the menu without moving focus ---- */
  const containsNode = (node: Node | null) =>
    !!node && (triggerRef.current!.contains(node) || contentRef.current!.contains(node));

  const latestSetOpen = useRef(setOpen);
  latestSetOpen.current = setOpen;
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containsNode(event.target as Node)) latestSetOpen.current(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    // A null relatedTarget means focus went nowhere in particular (Safari doesn't focus clicked
    // buttons, or the window lost focus); outside clicks are handled by the pointerdown listener.
    const next = event.relatedTarget as Node | null;
    if (next && !containsNode(next)) setOpen(false);
  };

  /* ---- keyboard ---- */
  const runTypeahead = (char: string, all: HTMLElement[], index: number) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.buffer += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.buffer = ''), TYPEAHEAD_RESET_MS);

    // Repeating one letter cycles through items starting with it; a longer prefix may stay put.
    const repeated = [...state.buffer].every((c) => c === state.buffer[0]);
    const search = repeated ? state.buffer.charAt(0) : state.buffer;
    const start = repeated ? index + 1 : index;
    const ordered = [...all.slice(start), ...all.slice(0, start)];
    ordered.find((el) => (el.dataset.text as string).toLowerCase().startsWith(search))?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = getItems();
    // Keys only reach the menu from a focused item.
    const index = all.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => {
      event.preventDefault();
      all[(i + all.length) % all.length]!.focus();
    };
    switch (event.key) {
      case 'ArrowDown':
        return focusAt(index + 1);
      case 'ArrowUp':
        return focusAt(index - 1);
      case 'Home':
        return focusAt(0);
      case 'End':
        return focusAt(all.length - 1);
      case 'Enter':
      case ' ':
        // One path for buttons and links: links don't activate on Space natively.
        event.preventDefault();
        all[index]!.click();
        return;
      case 'Escape':
        event.preventDefault();
        // Don't let an enclosing Dialog close as well.
        event.stopPropagation();
        close();
        return;
      case 'Tab':
        // Focus the trigger first, so the browser's own Tab moves on from there.
        close();
        return;
      default:
        if (isPrintableKey(event)) {
          event.preventDefault();
          runTypeahead(event.key, all, index);
        }
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu('last');
    }
  };

  const triggerProps = {
    ref: triggerRef,
    id: triggerId,
    disabled,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': menuId,
    'data-state': open ? 'open' : 'closed',
    onClick: () => (open ? close() : openMenu('first')),
    onKeyDown: handleTriggerKeyDown,
    onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
      // Buttons click on Space keyup; the keydown already acted (and may have moved focus here).
      if (event.key === ' ') event.preventDefault();
    },
  };

  return (
    <div className={cx(styles.menu, className)}>
      {iconOnly ? (
        <IconButton {...triggerProps} label={label} icon={triggerIcon ?? <MoreIcon />} variant={variant ?? 'ghost'} size={size} />
      ) : (
        <Button
          {...triggerProps}
          variant={variant ?? 'secondary'}
          size={size}
          startIcon={triggerIcon}
          endIcon={
            <svg className={styles.chevron} viewBox="0 0 16 16" width="16" height="16">
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        >
          {label}
        </Button>
      )}

      <div
        ref={contentRef}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        popover="manual"
        hidden={!open}
        data-state={open ? 'open' : 'closed'}
        className={styles.content}
        onKeyDown={handleMenuKeyDown}
        onBlur={handleBlur}
      >
        <MenuContext.Provider value={{ close }}>
          {items?.map(({ label: itemLabel, ...item }, index) => (
            <MenuItem key={index} {...item}>
              {itemLabel}
            </MenuItem>
          ))}
          {children}
        </MenuContext.Provider>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

export interface MenuItemProps extends Omit<MenuItemOption, 'label'> {
  /**
   * `aria-keyshortcuts` for the item. Set it only when the shortcut really works on the page;
   * `shortcut` alone is just a visual hint.
   */
  keyShortcuts?: string;
  className?: string;
  children: ReactNode;
}

/**
 * One action in a `Menu`: a `<button role="menuitem">`, or an `<a role="menuitem">` with `href`.
 * Disabled items stay focusable (`aria-disabled`) so keyboard users can still discover them.
 */
export function MenuItem({
  onSelect,
  href,
  target,
  rel,
  icon,
  shortcut,
  keyShortcuts,
  disabled = false,
  destructive = false,
  textValue,
  className,
  children,
}: MenuItemProps) {
  const { close } = useMenuContext('MenuItem');

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onSelect?.(event);
    close();
  };

  const shared = {
    role: 'menuitem',
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    'aria-keyshortcuts': keyShortcuts,
    'data-text': textValue ?? textFromNode(children),
    'data-destructive': destructive || undefined,
    className: cx(styles.item, className),
    onClick: handleClick,
    onPointerMove: (event: MouseEvent<HTMLElement>) => {
      // Pointer and keyboard share one highlight: the focused item.
      if (!disabled && document.activeElement !== event.currentTarget) event.currentTarget.focus();
    },
  };

  const content = (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {shortcut && (
        <kbd className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </kbd>
      )}
    </>
  );

  return href ? (
    <a href={href} target={target} rel={rel} {...shared}>
      {content}
    </a>
  ) : (
    <button type="button" {...shared}>
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * MenuGroup / MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

export interface MenuGroupProps {
  /** Visible heading for the group, also its accessible name. */
  label: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A labelled set of related items. */
export function MenuGroup({ label, className, children }: MenuGroupProps) {
  useMenuContext('MenuGroup');
  const labelId = `ds-menu-group-${useId()}`;
  return (
    <div role="group" aria-labelledby={labelId} className={cx(styles.group, className)}>
      <div id={labelId} className={styles.groupLabel}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** A divider between items or groups. */
export function MenuSeparator({ className }: { className?: string }) {
  useMenuContext('MenuSeparator');
  return <div role="separator" className={cx(styles.separator, className)} />;
}
