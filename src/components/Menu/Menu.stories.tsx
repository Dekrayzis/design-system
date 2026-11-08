import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ArrowRightIcon, GlobeIcon, LockIcon, MailIcon, PlusIcon, SettingsIcon, TrashIcon, UserIcon } from '../../docs/icons';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { Menu, MenuGroup, MenuItem, MenuSeparator } from './Menu';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: { MenuItem, MenuGroup, MenuSeparator },
  args: {
    label: 'Actions',
    onOpenChange: fn(),
  },
  argTypes: {
    triggerIcon: { control: false },
    items: { control: false },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'An actions menu: a `<button aria-haspopup="menu">` that opens a `role="menu"` list of `menuitem` buttons and links in the top layer, following the WAI-ARIA menu button pattern. Use it for commands such as Edit, Duplicate or Delete. To pick a value use `Select`, and for site navigation use ordinary links.',
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const onEdit = fn();
const onDuplicate = fn();
const onDelete = fn();

/** A labelled trigger with a chevron. Enter, Space or ↓ opens the menu on the first item and ↑ on the last; the arrow keys wrap, Escape closes it and focus goes back to the button. */
export const Default: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItem onSelect={onEdit}>Edit</MenuItem>
      <MenuItem onSelect={onDuplicate}>Duplicate</MenuItem>
      <MenuItem onSelect={onDelete} destructive>
        Delete
      </MenuItem>
    </Menu>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(onDuplicate).toHaveBeenCalled();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  },
};

/** `iconOnly` renders an `IconButton`, a "⋯" icon by default, with `label` as its accessible name and tooltip, so the trigger is always named. Tab closes the menu and moves on to the next control. */
export const IconTrigger: Story = {
  name: 'Icon-only trigger',
  args: { label: 'More actions', iconOnly: true },
  render: (args) => (
    <Stack direction="row" gap={3} align="center">
      <Menu {...args}>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move to folder</MenuItem>
        <MenuItem destructive>Delete</MenuItem>
      </Menu>
      <Menu label="Settings" iconOnly variant="secondary" triggerIcon={<SettingsIcon />}>
        <MenuItem>Preferences</MenuItem>
        <MenuItem>Keyboard shortcuts</MenuItem>
      </Menu>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'More actions' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('menu', { name: 'More actions' })).not.toHaveAttribute('hidden');
    await expect(canvas.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await userEvent.tab();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', { name: 'Settings' })).toHaveFocus();
  },
};

/** Decorative icons before each label and shortcut hints after it. The hint is visual only; pass `keyShortcuts` to set `aria-keyshortcuts` when the shortcut really works on the page. Typing a letter jumps to the next item starting with it. */
export const IconsAndShortcuts: Story = {
  name: 'Icons and shortcuts',
  args: { label: 'File' },
  render: (args) => (
    <Menu {...args}>
      <MenuItem icon={<PlusIcon />} shortcut="Ctrl+N">New file</MenuItem>
      <MenuItem icon={<MailIcon />} shortcut="Ctrl+Shift+E">Email a copy</MenuItem>
      <MenuItem icon={<LockIcon />} shortcut="Ctrl+L">Lock</MenuItem>
      <MenuItem icon={<ArrowRightIcon />}>Move to…</MenuItem>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'File' }));
    await userEvent.keyboard('l');
    await expect(canvas.getByRole('menuitem', { name: 'Lock' })).toHaveFocus();
  },
};

/** A disabled item stays focusable with `aria-disabled`, as the APG recommends, so keyboard users learn it exists; choosing it does nothing. `destructive` gives danger styling to actions such as Delete. */
export const DisabledAndDestructive: Story = {
  name: 'Disabled and destructive items',
  args: { label: 'Project' },
  render: (args) => (
    <Menu {...args}>
      <MenuItem>Rename</MenuItem>
      <MenuItem disabled>Transfer ownership</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<TrashIcon />} destructive>
        Delete project
      </MenuItem>
      <MenuItem icon={<TrashIcon />} destructive disabled>
        Delete workspace
      </MenuItem>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Project' }));
    await userEvent.keyboard('{ArrowDown}');
    const disabled = canvas.getByRole('menuitem', { name: 'Transfer ownership' });
    await expect(disabled).toHaveFocus();
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('menu')).not.toHaveAttribute('hidden');
  },
};

/** `MenuGroup` labels a set of related items and `MenuSeparator` divides them. Groups are announced with their label, which also shows as a small heading. */
export const GroupsAndSeparators: Story = {
  name: 'Groups and separators',
  args: { label: 'Account' },
  render: (args) => (
    <Menu {...args} triggerIcon={<UserIcon />}>
      <MenuGroup label="Signed in as Ada">
        <MenuItem icon={<UserIcon />}>Profile</MenuItem>
        <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Language">
        <MenuItem icon={<GlobeIcon />}>English (UK)</MenuItem>
        <MenuItem icon={<GlobeIcon />}>Français</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuItem>Sign out</MenuItem>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Account' }));
    await expect(canvas.getByRole('group', { name: 'Language' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('separator')).toHaveLength(2);
  },
};

/** An item with `href` renders a real `<a role="menuitem">`, so the browser's own link behaviour (new tab, copy link address, status bar URL) works. Enter and Space both follow it. */
export const LinkItems: Story = {
  name: 'Link items',
  args: { label: 'Open' },
  render: (args) => (
    <Menu {...args}>
      <MenuItem href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" target="_blank" rel="noreferrer">
        Open the APG pattern in a new tab
      </MenuItem>
      <MenuItem href="#preview">Jump to the preview</MenuItem>
      <MenuSeparator />
      <MenuItem>Copy link</MenuItem>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const link = canvas.getByRole('menuitem', { name: 'Open the APG pattern in a new tab' });
    await expect(link.tagName).toBe('A');
    await expect(link).toHaveAttribute('target', '_blank');
  },
};

/** The `items` shorthand builds a flat menu from an array, like `options` on `Select`. Use children when the menu needs groups or separators. */
export const ItemsShorthand: Story = {
  name: 'Items shorthand',
  args: {
    label: 'Sort',
    items: [
      { label: 'Newest first', onSelect: fn() },
      { label: 'Oldest first', onSelect: fn() },
      { label: 'Most replies', onSelect: fn(), shortcut: 'R' },
      { label: 'Unanswered only', disabled: true },
    ],
  },
};

/** A "⋯" menu in a card header. Each trigger needs a unique name on the page, so it names the card it belongs to. */
export const InACard: Story = {
  name: 'Inside a card',
  render: () => (
    <Card as="article" style={{ maxWidth: 360 }}>
      <Stack direction="row" justify="space-between" align="center">
        <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-md)' }}>Quarterly report</h3>
        <Menu label="Actions for Quarterly report" iconOnly size="sm">
          <MenuItem>Share</MenuItem>
          <MenuItem>Download PDF</MenuItem>
          <MenuSeparator />
          <MenuItem destructive>Archive</MenuItem>
        </Menu>
      </Stack>
      <p style={{ marginBottom: 0 }}>Revenue grew 12% on the previous quarter.</p>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions for Quarterly report' });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Share' }));
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

const invoices = [
  { id: 'INV-041', customer: 'Northwind', total: '£1,200.00' },
  { id: 'INV-042', customer: 'Contoso', total: '£860.50' },
  { id: 'INV-043', customer: 'Fabrikam', total: '£2,410.00' },
];

/** One menu per table row, with the row's invoice in each trigger's name ("Actions for INV-042"). The menu opens in the top layer, so the table's overflow never clips it. */
export const InATableRow: Story = {
  name: 'Inside a table row',
  render: () => (
    <table style={{ borderCollapse: 'collapse', minWidth: 420 }}>
      <caption style={{ textAlign: 'start', paddingBottom: 8 }}>Invoices</caption>
      <thead>
        <tr>
          <th scope="col" style={{ textAlign: 'start' }}>Invoice</th>
          <th scope="col" style={{ textAlign: 'start' }}>Customer</th>
          <th scope="col" style={{ textAlign: 'end' }}>Total</th>
          <th scope="col">
            <VisuallyHidden>Actions</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id} style={{ borderTop: '1px solid var(--ds-color-border)' }}>
            <td>{invoice.id}</td>
            <td>{invoice.customer}</td>
            <td style={{ textAlign: 'end' }}>{invoice.total}</td>
            <td style={{ textAlign: 'end' }}>
              <Menu label={`Actions for ${invoice.id}`} iconOnly size="sm">
                <MenuItem>View</MenuItem>
                <MenuItem>Send reminder</MenuItem>
                <MenuItem href={`#${invoice.id}`}>Open in new tab</MenuItem>
                <MenuSeparator />
                <MenuItem destructive>Void invoice</MenuItem>
              </Menu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions for INV-042' });
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(within(canvas.getByRole('menu', { name: 'Actions for INV-042' })).getByRole('menuitem', { name: 'Void invoice' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};
