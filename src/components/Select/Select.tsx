import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { textFromNode } from '../../utils/textFromNode';
import { useAnchorPosition } from '../../utils/useAnchorPosition';
import { useFieldValidation, type ValidationProps } from '../../utils/validation';
import { FieldError } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Select.module.css';

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Decorative icon shown before the label, and in the trigger when this option is selected. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectedItem {
  value: string;
  label: ReactNode;
  text: string;
  icon?: ReactNode;
}

interface SelectBaseProps extends Omit<ValidationProps<never>, 'validate'> {
  /** Visible label. Also names the listbox and the search field. */
  label: ReactNode;
  hint?: ReactNode;
  /** Error message. Native `required` failures are shown here automatically when this is unset. */
  error?: ReactNode;
  hideLabel?: boolean;
  /** Shown in the trigger when nothing is selected. */
  placeholder?: ReactNode;
  /** Form field name. A hidden native `<select>` carries the value for submission and validation. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Id of the trigger. Generated when omitted. */
  id?: string;
  /** Associates the hidden native control with a `<form>` elsewhere in the document. */
  form?: string;
  /** Passed to the hidden native control, so browser autofill can fill the field. */
  autoComplete?: string;
  /** Adds a filter field to the dropdown. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown when the filter matches nothing. */
  emptyMessage?: ReactNode;
  /**
   * Decorative icon at the start of the trigger. When the selected option has its own `icon`,
   * that one is shown instead.
   */
  startIcon?: ReactNode;
  /** Shorthand for a flat list of `SelectItem`s. Rendered before `children`. */
  options?: SelectOption[];
  /** Custom trigger content for the current selection. */
  renderValue?: (selected: SelectedItem[]) => ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: ReactNode;
}

export interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  /** Any string is a valid value, including `''`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Custom rule run on the selected value. Return a message to mark it invalid. */
  validate?: ValidationProps<string>['validate'];
}

export interface MultiSelectProps extends SelectBaseProps {
  /** Lets several options be selected. The dropdown stays open while toggling. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Custom rule run on the selected values, e.g. a maximum count. */
  validate?: ValidationProps<string[]>['validate'];
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

interface ItemEntry {
  id: string;
  text: string;
  label: ReactNode;
  icon: ReactNode;
  disabled: boolean;
}

interface SelectContextValue {
  multiple: boolean;
  query: string;
  selected: string[];
  activeValue: string | null;
  setActive: (value: string | null, scroll?: boolean) => void;
  choose: (value: string) => void;
  registerItem: (value: string, entry: ItemEntry) => void;
  unregisterItem: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const context = useContext(SelectContext);
  if (!context) throw new Error(`<${component}> must be used inside <Select>.`);
  return context;
}

const toArray = (value: string | string[] | undefined) =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value];

const isPrintableKey = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

const TYPEAHEAD_RESET_MS = 500;
const PAGE_SIZE = 10;

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

/**
 * A custom dropdown following the WAI-ARIA "select-only combobox" pattern.
 *
 * Compared with Radix Select it adds multi-select, a searchable mode, real form integration
 * (native `required` validation, autofill, form reset, `''` as a value) and typeahead that cycles
 * on repeated letters. Focus stays on the trigger (`aria-activedescendant`) instead of jumping
 * into a portal, the list renders in the browser's top layer via the Popover API (no z-index
 * fights, no portal, works inside `<dialog>`), and nothing locks page scroll or disables pointer
 * events on `<body>`. It opens on click rather than pointerdown, so touch scrolling over the
 * trigger never opens it by accident.
 */
export function Select(props: SelectProps) {
  const {
    label,
    hint,
    error,
    hideLabel,
    placeholder = 'Select…',
    name,
    required,
    disabled = false,
    id,
    form,
    autoComplete,
    searchable = false,
    searchPlaceholder = 'Search…',
    emptyMessage = 'No results',
    options,
    renderValue,
    startIcon,
    validationMessages,
    validateOn,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    className,
    children,
  } = props;
  const multiple = props.multiple === true;

  /* ---- ids ---- */
  const baseId = useId();
  const triggerId = id ?? `ds-select-${baseId}`;
  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const listboxId = `${triggerId}-listbox`;
  const contentId = `${triggerId}-content`;
  const hintId = hint ? `${triggerId}-hint` : undefined;

  /* ---- refs ---- */
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const nativeRef = useRef<HTMLSelectElement>(null);

  /* ---- value ---- */
  const controlledValue = toArray(props.value);
  const defaultValueRef = useRef(toArray(props.defaultValue) ?? []);
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValueRef.current);
  const selected = controlledValue ?? uncontrolledValue;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // Validation runs against the hidden native <select> (so `required` blocks submission natively)
  // and moves focus to the visible trigger when this is the first invalid field.
  const validation = useFieldValidation<string | string[]>(nativeRef, {
    getValue: () => (multiple ? selectedRef.current : (selectedRef.current[0] ?? '')),
    validate: props.validate as ValidationProps<string | string[]>['validate'],
    validationMessages,
    validateOn,
    focusTarget: () => triggerRef.current,
  });

  /* ---- item registry (labels and text for the trigger, the native select and search) ---- */
  const itemsRef = useRef(new Map<string, ItemEntry>());
  const [registryVersion, setRegistryVersion] = useState(0);
  const registerItem = useCallback((value: string, entry: ItemEntry) => {
    const previous = itemsRef.current.get(value);
    itemsRef.current.set(value, entry);
    if (
      !previous ||
      previous.id !== entry.id ||
      previous.text !== entry.text ||
      previous.disabled !== entry.disabled
    ) {
      setRegistryVersion((v) => v + 1);
    }
  }, []);
  const unregisterItem = useCallback((value: string) => {
    itemsRef.current.delete(value);
    setRegistryVersion((v) => v + 1);
  }, []);

  /* ---- open / active / query ---- */
  const [openState, setOpenState] = useState(defaultOpen);
  const open = (openProp ?? openState) && !disabled;
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const scrollToActive = useRef(false);
  const [query, setQuery] = useState('');
  const [hasResults, setHasResults] = useState(true);
  const typeahead = useRef({ buffer: '', timer: 0 });

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  const setActive = useCallback((value: string | null, scroll = false) => {
    scrollToActive.current = scroll;
    setActiveValue(value);
  }, []);

  const commit = (next: string[]) => {
    if (controlledValue === undefined) setUncontrolledValue(next);
    if (props.multiple) props.onValueChange?.(next);
    else if (next.length > 0) props.onValueChange?.(next[0] as string);
  };

  /* ---- DOM helpers: navigation follows rendered order, skipping disabled and filtered options ---- */
  const getOptions = () =>
    // The listbox is always rendered (hidden while closed), so the ref is set whenever this runs.
    Array.from(listboxRef.current!.querySelectorAll<HTMLElement>('[role="option"]')).filter(
      (el) => !el.hidden && el.getAttribute('aria-disabled') !== 'true',
    );
  // Options are SelectItems, which always render `data-value` (and `data-text`).
  const valueOf = (el: HTMLElement) => el.dataset.value as string;

  const openList = (focus: 'selected' | 'first' | 'last' = 'selected') => {
    const items = getOptions();
    const target =
      focus === 'first'
        ? items[0]
        : focus === 'last'
          ? items[items.length - 1]
          : (items.find((el) => selected.includes(valueOf(el))) ?? items[0]);
    setActive(target ? valueOf(target) : null, true);
    setOpen(true);
  };

  const close = ({ restoreFocus = true } = {}) => {
    setOpen(false);
    setQuery('');
    setActiveValue(null);
    typeahead.current.buffer = '';
    if (restoreFocus && searchable) triggerRef.current?.focus();
  };

  const choose = (value: string) => {
    const entry = itemsRef.current.get(value);
    if (!entry || entry.disabled) return;
    if (multiple) {
      commit(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
      setActive(value);
    } else {
      commit([value]);
      close();
    }
  };

  const move = (to: number | 'first' | 'last') => {
    const items = getOptions();
    if (items.length === 0) return;
    const current = items.findIndex((el) => valueOf(el) === activeValue);
    let next: number;
    if (to === 'first') next = 0;
    else if (to === 'last') next = items.length - 1;
    else if (current === -1) next = to > 0 ? 0 : items.length - 1;
    else next = Math.min(Math.max(current + to, 0), items.length - 1);
    setActive(valueOf(items[next] as HTMLElement), true);
  };

  /** Type-to-select. Repeating one letter cycles through options starting with it. */
  const runTypeahead = (char: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.buffer += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.buffer = ''), TYPEAHEAD_RESET_MS);

    const items = getOptions();
    const repeated = [...state.buffer].every((c) => c === state.buffer[0]);
    const search = repeated ? state.buffer.charAt(0) : state.buffer;
    const reference = activeValue ?? (multiple ? null : (selected[0] ?? null));
    const current = items.findIndex((el) => valueOf(el) === reference);
    // A fresh or repeated letter moves past the current option; a longer prefix may stay on it.
    const start = repeated ? current + 1 : Math.max(current, 0);
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    const match = ordered.find((el) => (el.dataset.text as string).toLowerCase().startsWith(search));
    if (match) setActive(valueOf(match), true);
    return match;
  };

  /* ---- keyboard ---- */
  const handleListKeys = (event: KeyboardEvent<HTMLElement>, fromSearch: boolean) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!event.altKey) move(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) {
          if (!multiple && activeValue !== null) choose(activeValue);
          else close();
        } else {
          move(-1);
        }
        return;
      case 'Home':
      case 'End':
        if (fromSearch) return; // keep caret movement in the search field
        event.preventDefault();
        move(event.key === 'Home' ? 'first' : 'last');
        return;
      case 'PageDown':
      case 'PageUp':
        event.preventDefault();
        move(event.key === 'PageDown' ? PAGE_SIZE : -PAGE_SIZE);
        return;
      case 'Enter':
        event.preventDefault();
        if (activeValue !== null) choose(activeValue);
        return;
      case ' ':
        if (fromSearch) return;
        event.preventDefault();
        if (typeahead.current.buffer) runTypeahead(' ');
        else if (activeValue !== null) choose(activeValue);
        return;
      case 'Escape':
        event.preventDefault();
        // Don't let an enclosing Dialog close as well.
        event.stopPropagation();
        close();
        return;
      case 'Tab':
        if (fromSearch) {
          event.preventDefault();
          close();
        } else if (!multiple && activeValue !== null) {
          // APG: Tab commits the active option, then focus moves on as usual.
          choose(activeValue);
        } else {
          close({ restoreFocus: false });
        }
        return;
      default:
        if (!fromSearch && isPrintableKey(event)) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (open) {
      if (!searchable) handleListKeys(event, false);
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        openList('selected');
        return;
      case 'Home':
      case 'End':
        event.preventDefault();
        openList(event.key === 'Home' ? 'first' : 'last');
        return;
      default:
        if (isPrintableKey(event)) {
          event.preventDefault();
          if (searchable) {
            setQuery(event.key);
            setOpen(true);
          } else if (!runTypeahead(event.key)) {
            openList('selected');
          } else {
            setOpen(true);
          }
        }
    }
  };

  /* ---- focus leaving / outside clicks close the list ---- */
  const containsNode = (node: Node | null) =>
    !!node && (!!triggerRef.current?.contains(node) || !!contentRef.current?.contains(node));

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (containsNode(event.relatedTarget as Node | null)) return;
    if (open) close({ restoreFocus: false });
    validation.onBlur();
  };

  const latestClose = useRef(close);
  latestClose.current = close;
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containsNode(event.target as Node)) latestClose.current({ restoreFocus: false });
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  /* ---- top-layer popover ---- */
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || typeof content.showPopover !== 'function') return;
    const isOpen = content.matches(':popover-open');
    if (open && !isOpen) content.showPopover();
    if (!open && isOpen) content.hidePopover();
  }, [open]);

  useAnchorPosition(open, triggerRef, contentRef);

  useLayoutEffect(() => {
    const input = searchRef.current;
    if (!open || !searchable || !input) return;
    input.focus();
    // Typing on the closed trigger seeds the query; keep the caret after it.
    input.setSelectionRange(input.value.length, input.value.length);
  }, [open, searchable]);

  // Keep the active option in view when it changed from the keyboard.
  useLayoutEffect(() => {
    if (!open || activeValue === null || !scrollToActive.current) return;
    const entry = itemsRef.current.get(activeValue);
    if (entry) document.getElementById(entry.id)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeValue]);

  // Filtering: highlight the first match and track whether anything matched.
  useLayoutEffect(() => {
    if (!open) return;
    const visible = listboxRef.current!.querySelectorAll('[role="option"]:not([hidden])').length;
    setHasResults(visible > 0);
    if (searchable && query) {
      const first = getOptions()[0];
      setActive(first ? valueOf(first) : null, true);
    }
  }, [open, query, searchable, registryVersion]);

  /* ---- hidden native <select>: submission, `required`, autofill, reset ---- */
  const syncNative = useCallback(() => {
    const native = nativeRef.current;
    if (!native) return;
    for (const option of Array.from(native.options)) {
      option.selected =
        option.dataset.none !== undefined
          ? selectedRef.current.length === 0
          : selectedRef.current.includes(option.value);
    }
  }, []);

  useLayoutEffect(syncNative, [selected, registryVersion, syncNative]);

  // Re-validate after the native control reflects a new selection (skipping the first render).
  const selectionKey = JSON.stringify(selected);
  const validatedOnce = useRef(false);
  useLayoutEffect(() => {
    if (!validatedOnce.current) {
      validatedOnce.current = true;
      return;
    }
    validation.onValueChange();
  }, [selectionKey]);

  useEffect(() => {
    const formElement = nativeRef.current?.form;
    if (!formElement) return;
    const onReset = () => {
      if (controlledValue === undefined) setUncontrolledValue(defaultValueRef.current);
      // The browser resets the native control after this event; restore our selection on top.
      window.setTimeout(syncNative, 0);
    };
    formElement.addEventListener('reset', onReset);
    return () => formElement.removeEventListener('reset', onReset);
  }, [controlledValue === undefined, syncNative]);

  const handleNativeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // Autofill writes to the native control; adopt its selection.
    const picked = Array.from(event.currentTarget.selectedOptions)
      .filter((option) => option.dataset.none === undefined)
      .map((option) => option.value);
    commit(picked);
  };

  /* ---- render ---- */
  const shownError = error ?? validation.error;
  const errorId = shownError ? `${triggerId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const selectedItems: SelectedItem[] = selected.map((value) => {
    const entry = itemsRef.current.get(value);
    return { value, label: entry?.label ?? value, text: entry?.text ?? value, icon: entry?.icon };
  });
  const activeId = activeValue !== null ? itemsRef.current.get(activeValue)?.id : undefined;

  const triggerIcon = (!multiple && selectedItems[0]?.icon) || startIcon;

  let display: ReactNode;
  if (selectedItems.length === 0) {
    display = <span className={styles.placeholder}>{placeholder}</span>;
  } else if (renderValue) {
    display = renderValue(selectedItems);
  } else if (!multiple || selectedItems.length === 1) {
    display = <span className={styles.valueText}>{selectedItems[0]?.label}</span>;
  } else {
    display = (
      <>
        <span className={styles.valueText}>{selectedItems.map((item) => item.text).join(', ')}</span>
        <span className={styles.count} aria-hidden="true">
          {selectedItems.length}
        </span>
      </>
    );
  }

  const context: SelectContextValue = {
    multiple,
    query,
    selected,
    activeValue,
    setActive,
    choose,
    registerItem,
    unregisterItem,
  };

  return (
    <div className={cx(fieldStyles.field, className)}>
      <label
        id={labelId}
        htmlFor={triggerId}
        className={cx(fieldStyles.label, hideLabel && fieldStyles.hiddenLabel)}
        // A label click would "click" the button and open the list; native selects just focus.
        onClick={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        {label}
        {required && (
          <span className={fieldStyles.required} aria-hidden="true">
            {' *'}
          </span>
        )}
        {/* The searchable trigger is a plain button, which can't carry aria-required. */}
        {required && searchable && (
          <>
            {' '}
            <VisuallyHidden>(required)</VisuallyHidden>
          </>
        )}
      </label>
      {hint && (
        <p id={hintId} className={fieldStyles.hint}>
          {hint}
        </p>
      )}

      <div className={styles.control}>
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role={searchable ? undefined : 'combobox'}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={searchable ? `${labelId} ${valueId}` : labelId}
          aria-describedby={describedBy}
          aria-activedescendant={open && !searchable ? activeId : undefined}
          aria-invalid={shownError ? true : undefined}
          aria-required={!searchable && required ? true : undefined}
          disabled={disabled}
          data-state={open ? 'open' : 'closed'}
          data-placeholder={selectedItems.length === 0 || undefined}
          className={cx(fieldStyles.control, styles.trigger)}
          onClick={() => (open ? close() : openList('selected'))}
          onKeyDown={handleTriggerKeyDown}
          onKeyUp={(event) => {
            // Buttons fire click on Space keyup; we already handled the keydown.
            if (event.key === ' ') event.preventDefault();
          }}
          onBlur={handleBlur}
        >
          {triggerIcon && (
            <span className={styles.triggerIcon} aria-hidden="true">
              {triggerIcon}
            </span>
          )}
          <span id={valueId} className={styles.value}>
            {display}
          </span>
          <svg className={styles.chevron} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <select
          ref={nativeRef}
          aria-hidden="true"
          tabIndex={-1}
          className={styles.native}
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          multiple={multiple}
          autoComplete={autoComplete}
          onChange={handleNativeChange}
          onInvalid={validation.onInvalid}
          onFocus={() => triggerRef.current?.focus()}
        >
          {!multiple && <option value="" data-none="" />}
          {Array.from(itemsRef.current.entries()).map(([value, entry]) => (
            <option key={entry.id} value={value} disabled={entry.disabled}>
              {entry.text}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={contentRef}
        id={contentId}
        popover="manual"
        hidden={!open}
        data-state={open ? 'open' : 'closed'}
        className={styles.content}
        onMouseDown={(event) => {
          // Keep focus on the trigger (or search field) while clicking options or the scrollbar.
          if (event.target !== searchRef.current) event.preventDefault();
        }}
      >
        {searchable && (
          <div className={styles.search}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={styles.searchIcon}>
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-labelledby={labelId}
              aria-activedescendant={open ? activeId : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder={searchPlaceholder}
              value={query}
              className={styles.searchInput}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => handleListKeys(event, true)}
              onBlur={handleBlur}
            />
          </div>
        )}
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          aria-multiselectable={multiple || undefined}
          className={styles.listbox}
        >
          <SelectContext.Provider value={context}>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value} icon={option.icon} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
            {children}
          </SelectContext.Provider>
        </div>
        {!hasResults && (
          <p role="status" className={styles.empty}>
            {emptyMessage}
          </p>
        )}
      </div>

      <FieldError id={`${triggerId}-error`} className={fieldStyles.error}>
        {shownError}
      </FieldError>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

export interface SelectItemProps {
  value: string;
  /** Decorative icon before the label; also shown in the trigger when this option is selected. */
  icon?: ReactNode;
  disabled?: boolean;
  /** Plain text for typeahead, search and the native option. Derived from children when omitted. */
  textValue?: string;
  className?: string;
  children: ReactNode;
}

export function SelectItem({ value, icon, disabled = false, textValue, className, children }: SelectItemProps) {
  const { multiple, query, selected, activeValue, setActive, choose, registerItem, unregisterItem } =
    useSelectContext('SelectItem');
  const id = `ds-select-option-${useId()}`;
  const text = textValue ?? textFromNode(children);

  useLayoutEffect(() => () => unregisterItem(value), [value, unregisterItem]);
  useLayoutEffect(() => {
    registerItem(value, { id, text, label: children, icon, disabled });
  });

  const isSelected = selected.includes(value);
  const isActive = activeValue === value;
  const matches = !query.trim() || text.toLowerCase().includes(query.trim().toLowerCase());

  return (
    <div
      id={id}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      hidden={!matches}
      data-value={value}
      data-text={text}
      data-active={isActive || undefined}
      className={cx(styles.item, className)}
      onPointerMove={() => {
        if (!disabled && !isActive) setActive(value);
      }}
      onClick={() => choose(value)}
    >
      {/* The tick is always rendered; CSS draws it in when the option becomes selected. */}
      <span className={cx(styles.indicator, multiple && styles.checkboxIndicator)} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path className={styles.tick} d="m3.5 8.5 3 3 6-7" pathLength={1} />
        </svg>
      </span>
      {icon && (
        <span className={styles.itemIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.itemText}>{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * SelectGroup / SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

export interface SelectGroupProps {
  label: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A labelled set of options. Hidden automatically when a search filters out all its options. */
export function SelectGroup({ label, className, children }: SelectGroupProps) {
  useSelectContext('SelectGroup');
  const labelId = `ds-select-group-${useId()}`;
  return (
    <div role="group" aria-labelledby={labelId} className={cx(styles.group, className)}>
      <div id={labelId} className={styles.groupLabel}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** A visual divider between options. Hidden while searching. */
export function SelectSeparator({ className }: { className?: string }) {
  const { query } = useSelectContext('SelectSeparator');
  return <div aria-hidden="true" hidden={!!query.trim()} className={cx(styles.separator, className)} />;
}
