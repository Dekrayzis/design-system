import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Menu, MenuGroup, MenuItem, MenuSeparator, type MenuProps } from './Menu';

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

const handlers = {
  edit: vi.fn(),
  duplicate: vi.fn(),
  archive: vi.fn(),
  remove: vi.fn(),
};

function Actions(props: Partial<MenuProps>) {
  return (
    <>
      <Menu label="Actions" {...props}>
        <MenuItem onSelect={handlers.edit} shortcut="E">
          Edit
        </MenuItem>
        <MenuItem onSelect={handlers.duplicate} shortcut="Ctrl+D" keyShortcuts="Control+D">
          Duplicate
        </MenuItem>
        <MenuItem onSelect={handlers.archive} disabled>
          Archive
        </MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={handlers.remove} destructive>
          Delete
        </MenuItem>
      </Menu>
      <button type="button">After</button>
    </>
  );
}

const trigger = (name = 'Actions') => screen.getByRole('button', { name });
const menu = () => screen.getByRole('menu');
const item = (name: string) => screen.getByRole('menuitem', { name });

beforeEach(() => {
  Object.values(handlers).forEach((handler) => handler.mockReset());
});

describe('Menu', () => {
  describe('structure', () => {
    it('renders a collapsed menu button that controls a hidden menu', () => {
      render(<Actions />);
      expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      const hidden = document.getElementById(trigger().getAttribute('aria-controls') as string);
      expect(hidden).toHaveAttribute('role', 'menu');
      expect(hidden).not.toBeVisible();
    });

    it('opens a menu named by its trigger, with items, a separator and states', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu', { name: 'Actions' })).toBeVisible();
      expect(within(menu()).getAllByRole('menuitem')).toHaveLength(4);
      expect(within(menu()).getByRole('separator')).toBeInTheDocument();
      expect(item('Archive')).toHaveAttribute('aria-disabled', 'true');
      expect(item('Edit')).not.toHaveAttribute('aria-disabled');
      expect(item('Delete')).toHaveAttribute('data-destructive');
      expect(item('Edit')).not.toHaveAttribute('data-destructive');
      // The shortcut hint is visual only; aria-keyshortcuts is opt-in.
      expect(item('Duplicate')).toHaveTextContent('Ctrl+D');
      expect(item('Duplicate')).toHaveAttribute('aria-keyshortcuts', 'Control+D');
      expect(item('Edit')).not.toHaveAttribute('aria-keyshortcuts');
      // Roving focus: no item is in the tab order.
      for (const el of within(menu()).getAllByRole('menuitem')) expect(el).toHaveAttribute('tabindex', '-1');
    });

    it('labels groups and renders icons as decoration', async () => {
      render(
        <Menu label="Share">
          <MenuGroup label="Send">
            <MenuItem icon={<svg data-testid="mail" />}>Email</MenuItem>
          </MenuGroup>
          <MenuGroup label="Copy">
            <MenuItem>Copy link</MenuItem>
          </MenuGroup>
        </Menu>,
      );
      await userEvent.click(trigger('Share'));
      const send = screen.getByRole('group', { name: 'Send' });
      expect(within(send).getByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Copy' })).toBeInTheDocument();
      expect(screen.getByTestId('mail').parentElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders the items shorthand before children', async () => {
      const onSelect = vi.fn();
      render(
        <Menu label="File" items={[{ label: 'New', onSelect }, { label: 'Open', disabled: true }]}>
          <MenuItem>Close</MenuItem>
        </Menu>,
      );
      await userEvent.click(trigger('File'));
      expect(within(menu()).getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['New', 'Open', 'Close']);
      expect(item('Open')).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(item('New'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('renders link items as real links', async () => {
      render(
        <Menu label="More">
          <MenuItem href="/docs" target="_blank" rel="noreferrer">
            Open in new tab
          </MenuItem>
        </Menu>,
      );
      await userEvent.click(trigger('More'));
      const link = item('Open in new tab');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/docs');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
      expect(item('Open in new tab')).toHaveFocus();
    });

    it('throws when parts are used outside a Menu', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<MenuItem>Orphan</MenuItem>)).toThrow('<MenuItem> must be used inside <Menu>.');
      expect(() => render(<MenuGroup label="G">x</MenuGroup>)).toThrow('<MenuGroup> must be used inside <Menu>.');
      expect(() => render(<MenuSeparator />)).toThrow('<MenuSeparator> must be used inside <Menu>.');
      error.mockRestore();
    });

    it('has no axe violations, closed and open', async () => {
      const { container } = render(<Actions />);
      expect(await axe(container)).toHaveNoViolations();
      await userEvent.click(trigger());
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('triggers', () => {
    it('shows the label and a chevron on a labelled trigger', () => {
      render(<Menu label="Actions" triggerIcon={<svg data-testid="start" />} size="sm" />);
      expect(trigger()).toHaveTextContent('Actions');
      expect(trigger()).toHaveClass('secondary', 'sm');
      expect(trigger().querySelector('.chevron')).toBeInTheDocument();
      expect(within(trigger()).getByTestId('start')).toBeInTheDocument();
    });

    it('names an icon-only trigger with the label and defaults to a ghost "more" icon', async () => {
      const { container } = render(<Menu iconOnly label="More actions for Invoice 42" />);
      const button = trigger('More actions for Invoice 42');
      expect(button).toHaveClass('ghost');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
      expect(button.querySelectorAll('circle')).toHaveLength(3);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('takes a custom icon and variant for an icon-only trigger', () => {
      render(<Menu iconOnly label="Settings" variant="secondary" triggerIcon={<svg data-testid="cog" />} />);
      expect(trigger('Settings')).toHaveClass('secondary');
      expect(within(trigger('Settings')).getByTestId('cog')).toBeInTheDocument();
    });

    it('can be disabled', async () => {
      render(<Actions disabled />);
      expect(trigger()).toBeDisabled();
      await userEvent.click(trigger());
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('mouse', () => {
    it('opens on click with focus on the first item, and toggles closed', async () => {
      const onOpenChange = vi.fn();
      render(<Actions onOpenChange={onOpenChange} />);
      await userEvent.click(trigger());
      expect(item('Edit')).toHaveFocus();
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      await userEvent.click(trigger());
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).toHaveFocus();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('runs an item, closes and returns focus to the trigger', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      await userEvent.click(item('Duplicate'));
      expect(handlers.duplicate).toHaveBeenCalledTimes(1);
      expect(handlers.duplicate.mock.calls[0]![0]).toHaveProperty('type', 'click');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).toHaveFocus();
    });

    it('closes after an item with no handler', async () => {
      render(
        <Menu label="Plain">
          <MenuItem>Nothing</MenuItem>
        </Menu>,
      );
      await userEvent.click(trigger('Plain'));
      await userEvent.click(item('Nothing'));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('ignores clicks on disabled items and keeps the menu open', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      await userEvent.click(item('Archive'));
      expect(handlers.archive).not.toHaveBeenCalled();
      expect(menu()).toBeVisible();
    });

    it('does not follow a disabled link', async () => {
      render(
        <Menu label="More">
          <MenuItem href="/x" disabled>
            Gone
          </MenuItem>
        </Menu>,
      );
      await userEvent.click(trigger('More'));
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      item('Gone').dispatchEvent(click);
      expect(click.defaultPrevented).toBe(true);
    });

    it('moves focus to the item under the pointer, skipping disabled items', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      await userEvent.hover(item('Delete'));
      expect(item('Delete')).toHaveFocus();
      // Moving again over the focused item keeps it.
      fireEvent.pointerMove(item('Delete'));
      expect(item('Delete')).toHaveFocus();
      await userEvent.hover(item('Archive'));
      expect(item('Delete')).toHaveFocus();
    });

    it('closes on a click outside without moving focus there', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      await userEvent.click(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('stays open on a pointerdown inside the menu', async () => {
      render(<Actions />);
      await userEvent.click(trigger());
      fireEvent.pointerDown(menu());
      expect(menu()).toBeVisible();
    });
  });

  describe('keyboard', () => {
    it.each(['{Enter}', ' ', '{ArrowDown}'])('opens with %s and focuses the first item', async (key) => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard(key);
      expect(menu()).toBeVisible();
      expect(item('Edit')).toHaveFocus();
    });

    it('opens with ArrowUp and focuses the last item', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(item('Delete')).toHaveFocus();
    });

    it('ignores other keys on the trigger', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowLeft}a');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('moves with the arrow keys, wrapping, and includes disabled items', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      expect(item('Duplicate')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('Archive')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      expect(item('Edit')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(item('Delete')).toHaveFocus();
    });

    it('jumps with Home and End', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}{End}');
      expect(item('Delete')).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(item('Edit')).toHaveFocus();
    });

    it.each(['{Enter}', ' '])('activates the focused item with %s and returns focus', async (key) => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await userEvent.keyboard(key);
      expect(handlers.duplicate).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).toHaveFocus();
    });

    it('does not reopen from the Space keyup that lands on the trigger', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard(' ');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      const keyUp = new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true });
      trigger().dispatchEvent(keyUp);
      expect(keyUp.defaultPrevented).toBe(true);
      const other = new KeyboardEvent('keyup', { key: 'a', bubbles: true, cancelable: true });
      trigger().dispatchEvent(other);
      expect(other.defaultPrevented).toBe(false);
    });

    it('activates link items with Space as well as Enter', async () => {
      const onSelect = vi.fn();
      render(
        <Menu label="More">
          <MenuItem href="#docs" onSelect={onSelect}>
            Docs
          </MenuItem>
        </Menu>,
      );
      trigger('More').focus();
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard(' ');
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(trigger('More')).toHaveFocus();
    });

    it('does nothing when a disabled item is activated', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
      expect(handlers.archive).not.toHaveBeenCalled();
      expect(item('Archive')).toHaveFocus();
    });

    it('closes with Escape, returns focus and keeps the event from enclosing handlers', async () => {
      const outer = vi.fn();
      render(
        <div onKeyDown={outer}>
          <Actions />
        </div>,
      );
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}');
      outer.mockClear();
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).toHaveFocus();
      expect(outer).not.toHaveBeenCalled();
    });

    it('closes with Tab and moves on to the next control', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('closes with Shift+Tab and moves to the control before the trigger', async () => {
      render(
        <>
          <button type="button">Before</button>
          <Actions />
        </>,
      );
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await userEvent.tab({ shift: true });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    });

    it('ignores keys with no meaning', async () => {
      render(<Actions />);
      trigger().focus();
      await userEvent.keyboard('{ArrowDown}{ArrowRight}{Control>}d{/Control}');
      expect(item('Edit')).toHaveFocus();
      expect(menu()).toBeVisible();
    });

    describe('typeahead', () => {
      beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
      afterEach(() => vi.useRealTimers());

      function Files() {
        return (
          <Menu label="File">
            <MenuItem>Save</MenuItem>
            <MenuItem>Save as</MenuItem>
            <MenuItem textValue="Share">
              <strong>Share</strong> with team
            </MenuItem>
            <MenuItem>Print</MenuItem>
          </Menu>
        );
      }

      it('jumps to the next item starting with a letter, cycling on repeats', async () => {
        render(<Files />);
        trigger('File').focus();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('p');
        expect(item('Print')).toHaveFocus();
        vi.advanceTimersByTime(600);
        await userEvent.keyboard('s');
        expect(item('Save')).toHaveFocus();
        await userEvent.keyboard('s');
        expect(item('Save as')).toHaveFocus();
        await userEvent.keyboard('s');
        expect(item('Share with team')).toHaveFocus();
      });

      it('matches a typed prefix, staying on the current item when it still matches', async () => {
        render(<Files />);
        trigger('File').focus();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('sh');
        expect(item('Share with team')).toHaveFocus();
        vi.advanceTimersByTime(600);
        await userEvent.keyboard('sa');
        expect(item('Save')).toHaveFocus();
        await userEvent.keyboard('ve');
        expect(item('Save')).toHaveFocus();
      });

      it('stays put when nothing matches', async () => {
        render(<Files />);
        trigger('File').focus();
        await userEvent.keyboard('{ArrowDown}z');
        expect(item('Save')).toHaveFocus();
      });
    });
  });

  describe('focus leaving', () => {
    it('closes when focus moves outside, without pulling it back', () => {
      render(<Actions />);
      fireEvent.click(trigger());
      const after = screen.getByRole('button', { name: 'After' });
      fireEvent.blur(item('Edit'), { relatedTarget: after });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).not.toHaveFocus();
    });

    it('stays open when focus moves between items or to nowhere', () => {
      render(<Actions />);
      fireEvent.click(trigger());
      fireEvent.blur(item('Edit'), { relatedTarget: item('Delete') });
      expect(menu()).toBeVisible();
      fireEvent.blur(item('Edit'), { relatedTarget: null });
      expect(menu()).toBeVisible();
    });
  });

  describe('top layer', () => {
    let popover: ReturnType<typeof mockPopoverApi>;
    beforeEach(() => {
      popover = mockPopoverApi();
    });
    afterEach(() => popover.restore());

    it('shows the menu as a popover while open and hides it when closed', async () => {
      render(<Actions />);
      expect(popover.show).not.toHaveBeenCalled();
      expect(popover.hide).not.toHaveBeenCalled();

      await userEvent.click(trigger());
      expect(popover.show).toHaveBeenCalledTimes(1);
      expect(popover.show.mock.contexts[0]).toBe(menu());
      expect(popover.isOpen(menu())).toBe(true);

      await userEvent.click(item('Edit'));
      expect(popover.hide).toHaveBeenCalledTimes(1);
      expect(popover.show).toHaveBeenCalledTimes(1);
    });
  });
});
