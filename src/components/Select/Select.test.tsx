import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { Select, SelectGroup, SelectItem, SelectSeparator, type SelectProps } from './Select';

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'grape', label: 'Grape' },
];

function Fruit(props: Partial<SelectProps>) {
  return <Select label="Fruit" placeholder="Pick one" options={fruit} {...(props as object)} />;
}

const trigger = () => screen.getByRole('combobox', { name: 'Fruit' });
const listbox = () => screen.getByRole('listbox', { name: 'Fruit' });
const active = () => {
  const id = trigger().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};
const activeOf = (element: HTMLElement) => {
  const id = element.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};

/**
 * jsdom has no Popover API. This stands in for it: showPopover/hidePopover toggle an open flag
 * that `matches(':popover-open')` reports, as in a browser. Call `restore()` when done.
 */
function mockPopoverApi() {
  const openElements = new WeakSet<Element>();
  const originalMatches = Element.prototype.matches;
  const show = vi.fn(function (this: HTMLElement) {
    openElements.add(this);
  });
  const hide = vi.fn(function (this: HTMLElement) {
    openElements.delete(this);
  });
  HTMLElement.prototype.showPopover = show;
  HTMLElement.prototype.hidePopover = hide;
  Element.prototype.matches = function matches(this: Element, selector: string) {
    return selector === ':popover-open' ? openElements.has(this) : originalMatches.call(this, selector);
  };
  return {
    show,
    hide,
    isOpen: (element: Element) => openElements.has(element),
    restore() {
      Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
      Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover');
      Element.prototype.matches = originalMatches;
    },
  };
}

describe('Select', () => {
  describe('structure', () => {
    it('renders a labelled, collapsed combobox showing the placeholder', () => {
      render(<Fruit />);
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger()).toHaveTextContent('Pick one');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('links the combobox to its listbox', async () => {
      render(<Fruit />);
      await userEvent.click(trigger());
      expect(trigger()).toHaveAttribute('aria-controls', listbox().id);
      expect(within(listbox()).getAllByRole('option')).toHaveLength(7);
    });

    it('shows the selected label from defaultValue', () => {
      render(<Fruit defaultValue="cherry" />);
      expect(trigger()).toHaveTextContent('Cherry');
    });

    it('focuses the trigger, without opening, when the label is clicked', async () => {
      render(<Fruit />);
      await userEvent.click(screen.getByText('Fruit'));
      expect(trigger()).toHaveFocus();
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps its accessible name when the label is visually hidden', () => {
      render(<Fruit hideLabel />);
      expect(trigger()).toBeInTheDocument();
      expect(screen.getByText('Fruit')).toHaveClass('hiddenLabel');
    });
  });

  describe('top layer', () => {
    let popover: ReturnType<typeof mockPopoverApi>;
    beforeEach(() => {
      popover = mockPopoverApi();
    });
    afterEach(() => popover.restore());

    it('shows the list as a popover while open and hides it when closed', async () => {
      render(<Fruit />);
      expect(popover.show).not.toHaveBeenCalled();
      expect(popover.hide).not.toHaveBeenCalled();

      await userEvent.click(trigger());
      const content = listbox().parentElement as HTMLElement;
      expect(popover.show).toHaveBeenCalledTimes(1);
      expect(popover.show.mock.contexts[0]).toBe(content);
      expect(popover.isOpen(content)).toBe(true);

      await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
      expect(popover.hide).toHaveBeenCalledTimes(1);
      expect(popover.hide.mock.contexts[0]).toBe(content);
      expect(popover.isOpen(content)).toBe(false);
      expect(popover.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('mouse', () => {
    it('opens on click, selects an option and closes', async () => {
      const onValueChange = vi.fn();
      render(<Fruit onValueChange={onValueChange} />);
      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole('option', { name: 'Banana' }));

      expect(onValueChange).toHaveBeenCalledWith('banana');
      expect(trigger()).toHaveTextContent('Banana');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveFocus();
    });

    it('marks the selected option', async () => {
      render(<Fruit defaultValue="grape" />);
      await userEvent.click(trigger());
      expect(screen.getByRole('option', { name: 'Grape' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
    });

    it('ignores disabled options', async () => {
      const onValueChange = vi.fn();
      render(<Fruit onValueChange={onValueChange} />);
      await userEvent.click(trigger());
      const durian = screen.getByRole('option', { name: 'Durian' });
      expect(durian).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(durian);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('closes when clicking outside without changing the value', async () => {
      render(
        <>
          <Fruit defaultValue="apple" />
          <p>Outside</p>
        </>,
      );
      await userEvent.click(trigger());
      await userEvent.click(screen.getByText('Outside'));
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveTextContent('Apple');
    });

    it('toggles closed when the trigger is clicked again', async () => {
      render(<Fruit />);
      await userEvent.click(trigger());
      await userEvent.click(trigger());
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('highlights options on hover', async () => {
      render(<Fruit />);
      await userEvent.click(trigger());
      await userEvent.hover(screen.getByRole('option', { name: 'Cherry' }));
      expect(active()).toHaveTextContent('Cherry');
    });
  });

  describe('keyboard', () => {
    it.each(['{ArrowDown}', '{ArrowUp}', '{Enter}', ' '])('opens with %s on the selected option', async (key) => {
      const user = userEvent.setup();
      render(<Fruit defaultValue="cherry" />);
      await user.tab();
      await user.keyboard(key);
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(active()).toHaveTextContent('Cherry');
    });

    it('opens on the first option when nothing is selected', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(active()).toHaveTextContent('Apple');
    });

    it('keeps DOM focus on the trigger and moves the active option with arrows', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      expect(trigger()).toHaveFocus();
      expect(active()).toHaveTextContent('Banana');
      await user.keyboard('{ArrowUp}');
      expect(active()).toHaveTextContent('Apricot');
    });

    it('skips disabled options and does not wrap', async () => {
      const user = userEvent.setup();
      render(<Fruit defaultValue="cherry" />);
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(active()).toHaveTextContent('Grape');
      await user.keyboard('{ArrowDown}');
      expect(active()).toHaveTextContent('Grape');
    });

    it('jumps with Home, End, PageUp and PageDown', async () => {
      const user = userEvent.setup();
      render(<Fruit defaultValue="banana" />);
      await user.tab();
      await user.keyboard('{Enter}{End}');
      expect(active()).toHaveTextContent('Grape');
      await user.keyboard('{Home}');
      expect(active()).toHaveTextContent('Apple');
      await user.keyboard('{PageDown}');
      expect(active()).toHaveTextContent('Grape');
      await user.keyboard('{PageUp}');
      expect(active()).toHaveTextContent('Apple');
    });

    it('selects with Enter and with Space', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fruit onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(onValueChange).toHaveBeenLastCalledWith('apricot');

      await user.keyboard('{ArrowDown}{ArrowDown} ');
      expect(onValueChange).toHaveBeenLastCalledWith('banana');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes with Escape without selecting, and stops the event reaching a parent', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onParentKeyDown = vi.fn();
      render(
        <div onKeyDown={onParentKeyDown}>
          <Fruit defaultValue="apple" onValueChange={onValueChange} />
        </div>,
      );
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}');
      onParentKeyDown.mockClear();
      await user.keyboard('{Escape}');

      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveTextContent('Apple');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(onParentKeyDown).not.toHaveBeenCalled();
    });

    it('lets Escape through to parents when already closed', async () => {
      const user = userEvent.setup();
      const onParentKeyDown = vi.fn();
      render(
        <div onKeyDown={onParentKeyDown}>
          <Fruit />
        </div>,
      );
      await user.tab();
      await user.keyboard('{Escape}');
      expect(onParentKeyDown).toHaveBeenCalled();
    });

    it('commits the active option on Tab and moves focus on', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Fruit />
          <button type="button">Next</button>
        </>,
      );
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}');
      await user.tab();
      expect(trigger()).toHaveTextContent('Apricot');
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    });

    it('selects and closes with Alt+ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
      expect(trigger()).toHaveTextContent('Apricot');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('does nothing when disabled', async () => {
      render(<Fruit disabled />);
      expect(trigger()).toBeDisabled();
      await userEvent.click(trigger());
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });
    it('opens on the first or last option with Home or End on the closed trigger', async () => {
      const user = userEvent.setup();
      render(<Fruit defaultValue="cherry" />);
      await user.tab();
      await user.keyboard('{End}');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(active()).toHaveTextContent('Grape');
      await user.keyboard('{Escape}{Home}');
      expect(active()).toHaveTextContent('Apple');
    });

    it('opens on the selected option when a typed letter matches nothing', async () => {
      const user = userEvent.setup();
      render(<Fruit defaultValue="cherry" />);
      await user.tab();
      await user.keyboard('z');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(active()).toHaveTextContent('Cherry');
    });

    it('closes without selecting when focus leaves while open', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <Fruit defaultValue="cherry" onValueChange={onValueChange} />
          <button type="button">Elsewhere</button>
        </>,
      );
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}');
      act(() => screen.getByRole('button', { name: 'Elsewhere' }).focus());
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveTextContent('Cherry');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('ignores Alt+ArrowDown while open', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}{Alt>}{ArrowDown}{/Alt}');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(active()).toHaveTextContent('Apple');
    });

    it.each([
      ['{ArrowDown}', 'Apple'],
      ['{ArrowUp}', 'Grape'],
    ])('moves from no active option with %s to %s when opened without one', async (key, expected) => {
      const user = userEvent.setup();
      render(<Fruit defaultOpen />);
      await user.tab();
      expect(active()).toBeNull();
      await user.keyboard(key);
      expect(active()).toHaveTextContent(expected);
    });

    it('does nothing on Space while no option is active', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fruit defaultOpen onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard(' ');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('opens with no active option when every option is disabled', async () => {
      const user = userEvent.setup();
      render(<Fruit options={[{ value: 'durian', label: 'Durian', disabled: true }]} />);
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(trigger()).not.toHaveAttribute('aria-activedescendant');
    });
  });

  describe('typeahead', () => {
    it('opens and jumps to the first match when typing on the closed trigger', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('c');
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(active()).toHaveTextContent('Cherry');
    });

    it('matches a typed prefix', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}apr');
      expect(active()).toHaveTextContent('Apricot');
    });

    it('cycles through options sharing a first letter when the letter is repeated', async () => {
      const user = userEvent.setup();
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}b');
      expect(active()).toHaveTextContent('Banana');
      await user.keyboard('b');
      expect(active()).toHaveTextContent('Blueberry');
      await user.keyboard('b');
      expect(active()).toHaveTextContent('Banana');
    });

    it('resets the buffer after a pause', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Fruit />);
      await user.tab();
      await user.keyboard('{ArrowDown}g');
      expect(active()).toHaveTextContent('Grape');
      act(() => vi.advanceTimersByTime(600));
      await user.keyboard('a');
      expect(active()).toHaveTextContent('Apple');
      vi.useRealTimers();
    });

    it('treats Space as part of a typed phrase instead of selecting', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const cities = [
        { value: 'newark', label: 'Newark' },
        { value: 'ny', label: 'New York' },
        { value: 'nz', label: 'New Zealand' },
      ];
      render(<Select label="City" placeholder="Pick one" options={cities} onValueChange={onValueChange} />);
      const city = screen.getByRole('combobox', { name: 'City' });
      await user.tab();
      await user.keyboard('{ArrowDown}new z');
      expect(city).toHaveAttribute('aria-expanded', 'true');
      expect(activeOf(city)).toHaveTextContent('New Zealand');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('composition', () => {
    it('supports groups, separators and items with rich content', async () => {
      render(
        <Select label="Zone" placeholder="Pick">
          <SelectGroup label="Europe">
            <SelectItem value="london">
              London <small>GMT+1</small>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Asia">
            <SelectItem value="tokyo" textValue="Tokyo">
              <strong>Tokyo</strong>
            </SelectItem>
          </SelectGroup>
        </Select>,
      );
      await userEvent.click(screen.getByRole('combobox', { name: 'Zone' }));
      expect(screen.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Asia' })).toBeInTheDocument();

      await userEvent.keyboard('t');
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('combobox', { name: 'Zone' })).toHaveTextContent('Tokyo');
    });

    it('accepts an empty string as a real value', async () => {
      const onValueChange = vi.fn();
      render(
        <Select
          label="Discount"
          defaultValue="10"
          onValueChange={onValueChange}
          options={[
            { value: '', label: 'None' },
            { value: '10', label: '10%' },
          ]}
        />,
      );
      const discount = screen.getByRole('combobox', { name: 'Discount' });
      await userEvent.click(discount);
      await userEvent.click(screen.getByRole('option', { name: 'None' }));
      expect(onValueChange).toHaveBeenCalledWith('');
      expect(discount).toHaveTextContent('None');
    });

    it('uses renderValue for custom trigger content', () => {
      render(<Fruit defaultValue="apple" renderValue={(items) => `Chosen: ${items[0]?.text}`} />);
      expect(trigger()).toHaveTextContent('Chosen: Apple');
    });

    it('throws a helpful error for items outside a Select', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<SelectItem value="x">X</SelectItem>)).toThrow('<SelectItem> must be used inside <Select>.');
      vi.restoreAllMocks();
    });
  });

  describe('controlled', () => {
    it('follows the value prop', async () => {
      function Controlled() {
        const [value, setValue] = useState('apple');
        return (
          <>
            <Fruit value={value} onValueChange={(v: string) => setValue(v.toUpperCase() === 'GRAPE' ? 'cherry' : v)} />
            <output>{value}</output>
          </>
        );
      }
      render(<Controlled />);
      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole('option', { name: 'Grape' }));
      // The parent rewrote the value; the trigger shows what the parent decided.
      expect(trigger()).toHaveTextContent('Cherry');
      expect(screen.getByRole('status')).toHaveTextContent('cherry');
    });

    it('supports controlled open state', async () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(<Fruit open={false} onOpenChange={onOpenChange} />);
      await userEvent.click(trigger());
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');

      rerender(<Fruit open onOpenChange={onOpenChange} />);
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    });

    it('copes with the active option being removed while the parent had it closed', async () => {
      const user = userEvent.setup();
      const withoutBanana = fruit.filter((option) => option.value !== 'banana');
      const { rerender } = render(<Fruit open />);
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      expect(active()).toHaveTextContent('Banana');

      rerender(<Fruit open={false} options={withoutBanana} />);
      rerender(<Fruit open options={withoutBanana} />);
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(trigger()).not.toHaveAttribute('aria-activedescendant');
      await user.keyboard('{ArrowDown}');
      expect(active()).toHaveTextContent('Apple');
    });
  });

  describe('searchable', () => {
    function Countries(props: Partial<SelectProps>) {
      return (
        <Select label="Country" placeholder="Choose" searchable {...(props as object)}>
          <SelectGroup label="Europe">
            <SelectItem value="fi">Finland</SelectItem>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="ie">Ireland</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Asia">
            <SelectItem value="jp">Japan</SelectItem>
            <SelectItem value="th">Thailand</SelectItem>
          </SelectGroup>
        </Select>
      );
    }
    const button = () => screen.getByRole('button', { name: /Country/ });
    const search = () => screen.getByRole('combobox', { name: 'Country' });

    it('moves focus into a labelled search field when opened', async () => {
      render(<Countries />);
      await userEvent.click(button());
      expect(search()).toHaveFocus();
      expect(search()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    });

    it('filters options, highlights the first match and selects with Enter', async () => {
      const onValueChange = vi.fn();
      render(<Countries onValueChange={onValueChange} />);
      await userEvent.click(button());
      await userEvent.type(search(), 'land');

      const visible = screen.getAllByRole('option').map((o) => o.textContent);
      expect(visible).toEqual(['Finland', 'Ireland', 'Thailand']);
      const activeId = search().getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId!)).toHaveTextContent('Finland');

      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('ie');
      expect(button()).toHaveTextContent('Ireland');
      expect(button()).toHaveFocus();
    });

    it('shows an empty state when nothing matches', async () => {
      render(<Countries emptyMessage="No countries found" />);
      await userEvent.click(button());
      await userEvent.type(search(), 'zzz');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(screen.getByRole('status')).toHaveTextContent('No countries found');
    });

    it('starts searching when typing on the closed trigger', async () => {
      const user = userEvent.setup();
      render(<Countries />);
      await user.tab();
      await user.keyboard('j');
      expect(search()).toHaveFocus();
      expect(search()).toHaveValue('j');
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Japan']);
    });

    it('closes with Escape, clears the query and returns focus to the trigger', async () => {
      render(<Countries />);
      await userEvent.click(button());
      await userEvent.type(search(), 'fr');
      await userEvent.keyboard('{Escape}');
      expect(button()).toHaveFocus();
      expect(button()).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(button());
      expect(search()).toHaveValue('');
    });

    it('names the trigger button with the label and current value', () => {
      render(<Countries defaultValue="jp" />);
      expect(screen.getByRole('button', { name: 'Country Japan' })).toBeInTheDocument();
    });
    it('keeps Home, End and Space for editing the search text', async () => {
      const user = userEvent.setup();
      render(<Countries />);
      await user.click(button());
      await user.keyboard('new');
      await user.keyboard('{Home} {End}');
      expect(search()).toHaveValue(' new');
      expect(search()).toHaveFocus();
    });

    it('closes on Tab from the search field and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      render(<Countries />);
      await user.click(button());
      expect(search()).toHaveFocus();
      await user.tab();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(button()).toHaveFocus();
    });

    it('ignores arrow keys when nothing matches the search', async () => {
      const user = userEvent.setup();
      render(<Countries />);
      await user.click(button());
      await user.keyboard('zzz{ArrowDown}{ArrowUp}{Enter}');
      expect(search()).not.toHaveAttribute('aria-activedescendant');
      expect(button()).toHaveTextContent('Choose');
    });

    it('leaves list navigation to the search field while open', async () => {
      const user = userEvent.setup();
      render(<Countries />);
      await user.click(button());
      expect(activeOf(search())).toHaveTextContent('Finland');
      // Focus moving back to the trigger keeps the list open, but the trigger doesn't drive it.
      act(() => button().focus());
      await user.keyboard('{ArrowDown}');
      expect(button()).toHaveAttribute('aria-expanded', 'true');
      expect(activeOf(search())).toHaveTextContent('Finland');
    });

    it('says the field is required in the trigger name', () => {
      render(<Countries required />);
      expect(button()).toHaveAccessibleName('Country (required) Choose');
    });
  });

  describe('multiple', () => {
    function Skills(props: Partial<SelectProps>) {
      return (
        <Select
          label="Skills"
          placeholder="Choose skills"
          multiple
          options={[
            { value: 'react', label: 'React' },
            { value: 'css', label: 'CSS' },
            { value: 'ts', label: 'TypeScript' },
          ]}
          {...(props as object)}
        />
      );
    }
    const skills = () => screen.getByRole('combobox', { name: 'Skills' });

    it('exposes a multi-selectable listbox', async () => {
      render(<Skills />);
      await userEvent.click(skills());
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('toggles options and stays open', async () => {
      const onValueChange = vi.fn();
      render(<Skills onValueChange={onValueChange} />);
      await userEvent.click(skills());
      await userEvent.click(screen.getByRole('option', { name: 'React' }));
      await userEvent.click(screen.getByRole('option', { name: 'TypeScript' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['react', 'ts']);
      expect(skills()).toHaveAttribute('aria-expanded', 'true');

      await userEvent.click(screen.getByRole('option', { name: 'React' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['ts']);
      expect(screen.getByRole('option', { name: 'React' })).toHaveAttribute('aria-selected', 'false');
    });

    it('toggles with Space and Enter from the keyboard', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Skills onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{ArrowDown} {ArrowDown}{Enter}');
      expect(onValueChange).toHaveBeenLastCalledWith(['react', 'css']);
      expect(skills()).toHaveAttribute('aria-expanded', 'true');
    });

    it('summarises several selections in the trigger', () => {
      render(<Skills defaultValue={['react', 'css']} />);
      expect(skills()).toHaveTextContent('React, CSS');
    });
    it('closes with Alt+ArrowUp without changing the selection', async () => {
      const user = userEvent.setup();
      render(<Skills defaultValue={['css']} />);
      const combobox = screen.getByRole('combobox', { name: 'Skills' });
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
      expect(combobox).toHaveTextContent('CSS');
    });

    it('closes on Tab without committing, and lets focus move on', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Skills />
          <button type="button">Next</button>
        </>,
      );
      const combobox = screen.getByRole('combobox', { name: 'Skills' });
      await user.tab();
      await user.keyboard('{ArrowDown}');
      await user.tab();
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
      expect(combobox).toHaveTextContent('Choose skills');
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    });

    it('typeahead on the closed trigger starts from the top, not from the selection', async () => {
      const user = userEvent.setup();
      const languages = [
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' },
        { value: 'css', label: 'CSS' },
      ];
      render(<Skills options={languages} defaultValue={['c']} />);
      await user.tab();
      await user.keyboard('c');
      expect(skills()).toHaveAttribute('aria-expanded', 'true');
      expect(activeOf(skills())).toHaveTextContent(/^C$/);
    });

    it('runs a custom validate rule on the selected values', async () => {
      const validate = (values: string[]) => (values.length > 2 ? 'Pick at most two' : null);
      render(<Skills validate={validate} validateOn="change" />);
      await userEvent.click(skills());
      await userEvent.click(screen.getByRole('option', { name: 'React' }));
      await userEvent.click(screen.getByRole('option', { name: 'CSS' }));
      expect(skills()).not.toHaveAttribute('aria-invalid');

      await userEvent.click(screen.getByRole('option', { name: 'TypeScript' }));
      expect(skills()).toHaveAttribute('aria-invalid', 'true');
      expect(skills()).toHaveAccessibleDescription('Pick at most two');
    });
  });

  describe('forms', () => {
    it('submits its value under `name`', async () => {
      render(
        <form aria-label="order">
          <Select label="Size" name="size" defaultValue="m" options={[{ value: 's', label: 'S' }, { value: 'm', label: 'M' }]} />
        </form>,
      );
      const form = screen.getByRole('form') as HTMLFormElement;
      expect(new FormData(form).get('size')).toBe('m');

      await userEvent.click(screen.getByRole('combobox', { name: 'Size' }));
      await userEvent.click(screen.getByRole('option', { name: 'S' }));
      expect(new FormData(form).get('size')).toBe('s');
    });

    it('submits every selected value when multiple', () => {
      render(
        <form aria-label="profile">
          <Select label="Tags" name="tags" multiple defaultValue={['a', 'c']} options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]} />
        </form>,
      );
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).getAll('tags')).toEqual(['a', 'c']);
    });

    it('submits an empty string value', () => {
      render(
        <form aria-label="discount">
          <Select label="Discount" name="discount" defaultValue="" options={[{ value: '', label: 'None' }, { value: '10', label: '10%' }]} />
        </form>,
      );
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('discount')).toBe('');
    });

    it('blocks submission when required and empty, shows the error inline and focuses the trigger', async () => {
      const onSubmit = vi.fn((e: Event) => e.preventDefault());
      render(
        <form aria-label="order" onSubmit={(e) => onSubmit(e.nativeEvent)}>
          <Fruit name="fruit" required />
          <button type="submit">Order</button>
        </form>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Order' }));
      expect(onSubmit).not.toHaveBeenCalled();
      expect(trigger()).toHaveAttribute('aria-invalid', 'true');
      expect(trigger()).toHaveAccessibleDescription(/.+/);
      expect(trigger()).toHaveFocus();

      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(trigger()).not.toHaveAttribute('aria-invalid');
      await userEvent.click(screen.getByRole('button', { name: 'Order' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('treats an empty-string option as a valid answer for required', () => {
      render(
        <form aria-label="discount">
          <Select label="Discount" name="discount" required defaultValue="" options={[{ value: '', label: 'None' }]} />
        </form>,
      );
      expect((screen.getByRole('form') as HTMLFormElement).checkValidity()).toBe(true);
    });

    it('restores the default value on form reset', async () => {
      render(
        <form aria-label="order">
          <Fruit name="fruit" defaultValue="apple" />
          <button type="reset">Reset</button>
        </form>,
      );
      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole('option', { name: 'Grape' }));
      expect(trigger()).toHaveTextContent('Grape');

      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
      expect(trigger()).toHaveTextContent('Apple');
      await act(() => new Promise((r) => setTimeout(r, 0)));
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('fruit')).toBe('apple');
    });

    it('adopts values written to the native control by autofill', () => {
      const onValueChange = vi.fn();
      const { container } = render(<Fruit name="fruit" onValueChange={onValueChange} />);
      const native = container.querySelector('select') as HTMLSelectElement;
      native.value = 'cherry';
      fireEvent.change(native);
      expect(onValueChange).toHaveBeenCalledWith('cherry');
      expect(trigger()).toHaveTextContent('Cherry');
    });

    it('clears the selection when autofill empties the native control', () => {
      const onValueChange = vi.fn();
      const { container } = render(<Fruit name="fruit" defaultValue="cherry" onValueChange={onValueChange} />);
      const native = container.querySelector('select') as HTMLSelectElement;
      native.value = '';
      fireEvent.change(native);
      expect(trigger()).toHaveTextContent('Pick one');
      // A single select has no value to report for "nothing selected".
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('runs a custom validate rule on the selected value, or "" when there is none', async () => {
      const validate = vi.fn((value: string) => (value === 'grape' ? 'Out of season' : null));
      render(<Fruit validate={validate} validateOn="change" />);
      expect(validate).toHaveBeenCalledWith('');
      expect(trigger()).not.toHaveAttribute('aria-invalid');

      await userEvent.click(trigger());
      await userEvent.click(screen.getByRole('option', { name: 'Grape' }));
      expect(validate).toHaveBeenLastCalledWith('grape');
      expect(trigger()).toHaveAttribute('aria-invalid', 'true');
      expect(trigger()).toHaveAccessibleDescription('Out of season');
    });

    it('keeps a controlled value on form reset', async () => {
      render(
        <form aria-label="order">
          <Fruit name="fruit" value="cherry" />
          <button type="reset">Reset</button>
        </form>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
      await act(() => new Promise((r) => setTimeout(r, 0)));
      expect(trigger()).toHaveTextContent('Cherry');
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('fruit')).toBe('cherry');
    });

    it('does not touch the native control when unmounted straight after a form reset', async () => {
      const { unmount } = render(
        <form aria-label="order">
          <Fruit name="fruit" defaultValue="apple" />
          <button type="reset">Reset</button>
        </form>,
      );
      const errors: unknown[] = [];
      const onError = (event: ErrorEvent) => errors.push(event.error);
      window.addEventListener('error', onError);
      try {
        // fireEvent: the restore timer must still be pending when the field unmounts.
        fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
        unmount();
        await act(() => new Promise((r) => setTimeout(r, 0)));
        expect(errors).toEqual([]);
      } finally {
        window.removeEventListener('error', onError);
      }
    });

    it('hides the native control from assistive tech and the tab order', () => {
      const { container } = render(<Fruit name="fruit" />);
      const native = container.querySelector('select');
      expect(native).toHaveAttribute('aria-hidden', 'true');
      expect(native).toHaveAttribute('tabindex', '-1');
    });
    it('passes focus from the hidden native control to the trigger', () => {
      const { container } = render(<Fruit name="fruit" />);
      const native = container.querySelector('select') as HTMLSelectElement;
      act(() => native.focus());
      expect(trigger()).toHaveFocus();
    });
  });

  describe('icons', () => {
    const withIcons = [
      { value: 'grid', label: 'Grid', icon: <svg data-testid="grid-icon" /> },
      { value: 'list', label: 'List', icon: <svg data-testid="list-icon" /> },
    ];

    it('shows option icons, hidden from assistive tech', async () => {
      render(<Select label="Layout" options={withIcons} />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Layout' }));
      const option = screen.getByRole('option', { name: 'Grid' });
      const icon = within(option).getByTestId('grid-icon').parentElement;
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it("shows the selected option's icon in the trigger, else the startIcon", async () => {
      render(<Select label="Layout" options={withIcons} startIcon={<svg data-testid="start" />} />);
      const trigger = screen.getByRole('combobox', { name: 'Layout' });
      expect(within(trigger).getByTestId('start')).toBeInTheDocument();

      await userEvent.click(trigger);
      await userEvent.click(screen.getByRole('option', { name: 'List' }));
      expect(within(trigger).getByTestId('list-icon')).toBeInTheDocument();
      expect(within(trigger).queryByTestId('start')).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent('List');
    });
  });

  describe('accessibility', () => {
    it('describes the trigger with hint and error', () => {
      render(<Fruit hint="Seasonal only." error="Pick one." />);
      expect(trigger()).toHaveAccessibleDescription('Seasonal only. Pick one.');
      expect(trigger()).toHaveAttribute('aria-invalid', 'true');
    });

    it('has no violations closed, open, searchable and multiple', async () => {
      const { container, unmount } = render(<Fruit hint="Hint" defaultValue="apple" />);
      expect(await axe(container)).toHaveNoViolations();
      await userEvent.click(trigger());
      expect(await axe(container)).toHaveNoViolations();
      unmount();

      const searchable = render(<Select label="Country" searchable options={fruit} />);
      await userEvent.click(screen.getByRole('button', { name: /Country/ }));
      expect(await axe(searchable.container)).toHaveNoViolations();
      searchable.unmount();

      const multi = render(<Select label="Skills" multiple defaultValue={['apple']} options={fruit} />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Skills' }));
      expect(await axe(multi.container)).toHaveNoViolations();
    });
  });
});
