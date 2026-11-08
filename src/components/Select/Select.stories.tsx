import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentType, type FormEvent } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CircleIcon, ColumnsIcon, GlobeIcon, GridIcon, ListIcon } from '../../docs/icons';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Dialog } from '../Dialog/Dialog';
import { Stack } from '../Stack/Stack';
import { Select, SelectGroup, SelectItem, SelectSeparator, type SingleSelectProps } from './Select';

/**
 * Storybook can't infer controls from the single/multiple union, so stories use one flattened
 * props type. The real component keeps the strict union.
 */
type SelectStoryProps = Omit<SingleSelectProps, 'multiple' | 'value' | 'defaultValue' | 'onValueChange'> & {
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};
const StorySelect = Select as unknown as ComponentType<SelectStoryProps>;

const meta = {
  title: 'Components/Forms/Select',
  component: StorySelect,
  subcomponents: { SelectItem, SelectGroup, SelectSeparator },
  args: {
    label: 'Fruit',
    placeholder: 'Pick a fruit',
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 360 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'A custom dropdown built on the WAI-ARIA select-only combobox pattern. Compared with Radix Select:',
          '',
          '- **Multi-select** (`multiple`) and **search** (`searchable`) built in.',
          '- **Real forms**: a hidden native `<select>` carries `name`, `required` (shown inline as an error), autofill and form reset. `""` is a valid value.',
          '- **Top layer via the Popover API**: no portal, no z-index fights, works inside `<dialog>`; no scroll lock or `pointer-events: none` on `<body>`.',
          '- **Focus stays on the trigger** (`aria-activedescendant`), opens on click (not pointerdown) so touch-scrolling never opens it, Escape inside a Dialog closes only the list.',
          '- **Typeahead** with repeated-letter cycling, Home/End, PageUp/PageDown, Tab-to-commit and Alt+↑.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof StorySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
];

/** A flat list from the `options` shorthand, including one disabled option. Focus stays on the trigger while the list is open (`aria-activedescendant`). Typing a letter jumps to the first match and repeating it cycles through matches; Enter selects and closes. */
export const Default: Story = {
  args: { options: fruit },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveFocus();

    // Typeahead: "b" jumps to Banana, a second "b" cycles to Blueberry.
    await userEvent.keyboard('bb');
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('blueberry');
    await expect(trigger).toHaveTextContent('Blueberry');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Options built from `SelectItem` children, with `SelectGroup` for labelled sections, `SelectSeparator` between them and a `disabled` item that keyboard navigation skips. Use children instead of `options` when the list needs structure. */
export const Composed: Story = {
  name: 'Groups, separators and disabled items',
  render: (args) => (
    <StorySelect {...args} label="Time zone" placeholder="Choose a time zone" defaultValue="Europe/London">
      <SelectGroup label="Europe">
        <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
        <SelectItem value="Europe/Paris">Paris (GMT+2)</SelectItem>
        <SelectItem value="Europe/Kyiv">Kyiv (GMT+3)</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Americas">
        <SelectItem value="America/New_York">New York (GMT−4)</SelectItem>
        <SelectItem value="America/Chicago" disabled>Chicago (unavailable)</SelectItem>
        <SelectItem value="America/Los_Angeles">Los Angeles (GMT−7)</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Asia & Pacific">
        <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
        <SelectItem value="Australia/Sydney">Sydney (GMT+10)</SelectItem>
      </SelectGroup>
    </StorySelect>
  ),
};

const countries = [
  ['Europe', ['Austria', 'Belgium', 'Croatia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom']],
  ['Americas', ['Argentina', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Mexico', 'Peru', 'United States']],
  ['Asia', ['India', 'Indonesia', 'Japan', 'Malaysia', 'Singapore', 'South Korea', 'Thailand', 'Vietnam']],
] as const;

/** `searchable` adds a filter field to the dropdown, for long lists. The trigger becomes a plain button and focus moves into the search field, which is the combobox; groups with no matches hide themselves, and a status message is shown when nothing matches. */
export const Searchable: Story = {
  args: { label: 'Country', placeholder: 'Choose a country', searchable: true, searchPlaceholder: 'Search countries…' },
  render: (args) => (
    <StorySelect {...args}>
      {countries.map(([region, names]) => (
        <SelectGroup key={region} label={region}>
          {names.map((country) => (
            <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
              {country}
            </SelectItem>
          ))}
        </SelectGroup>
      ))}
    </StorySelect>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /country/i }));

    const search = within(canvasElement.ownerDocument.body).getByRole('combobox', { name: 'Country' });
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'land');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    // "land" matches Finland, Ireland, Netherlands, Poland, Switzerland, Thailand; ↓ moves to the 2nd.
    await expect(args.onValueChange).toHaveBeenLastCalledWith('ireland');
  },
};

/** `multiple` lets several options be selected. The listbox is `aria-multiselectable`, the dropdown stays open while toggling options and Escape closes it; the trigger lists the selected labels, separated by commas. */
export const Multiple: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Skills' });
    await expect(trigger).toHaveTextContent('React, CSS');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await userEvent.click(canvas.getByRole('option', { name: 'Testing' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['react', 'css', 'testing']);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
  args: {
    label: 'Skills',
    placeholder: 'Select skills',
    multiple: true,
    defaultValue: ['react', 'css'],
    options: [
      { value: 'react', label: 'React' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'css', label: 'CSS' },
      { value: 'a11y', label: 'Accessibility' },
      { value: 'testing', label: 'Testing' },
      { value: 'node', label: 'Node.js' },
    ],
  },
};

/** `multiple` and `searchable` together, for picking several items from a long list such as people to invite. */
export const MultipleSearchable: Story = {
  name: 'Multiple + searchable',
  args: {
    label: 'Invite teammates',
    placeholder: 'Choose people',
    multiple: true,
    searchable: true,
    searchPlaceholder: 'Search by name…',
    options: ['Ada Lovelace', 'Alan Turing', 'Barbara Liskov', 'Edsger Dijkstra', 'Grace Hopper', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton', 'Radia Perlman', 'Tim Berners-Lee'].map(
      (name) => ({ value: name.toLowerCase().replace(/\s+/g, '.'), label: name }),
    ),
  },
};

/** `renderValue` replaces the trigger’s comma-separated text with custom content, here a `Badge` for each selected label. */
export const CustomValue: Story = {
  name: 'Custom renderValue',
  args: {
    label: 'Labels',
    multiple: true,
    defaultValue: ['bug', 'p1'],
    renderValue: (items) => (
      <Stack direction="row" gap={1} wrap>
        {items.map((item) => (
          <Badge key={item.value} tone={item.value === 'bug' ? 'danger' : 'accent'}>{item.text}</Badge>
        ))}
      </Stack>
    ),
    options: [
      { value: 'bug', label: 'Bug' },
      { value: 'feature', label: 'Feature' },
      { value: 'p1', label: 'P1' },
      { value: 'docs', label: 'Docs' },
    ],
  },
};

/** `""` is an ordinary value, so a “none” option can be selected and submitted like any other. Radix Select doesn’t allow this. */
export const EmptyStringValue: Story = {
  name: '"" as a real value',
  args: {
    label: 'Discount',
    defaultValue: '',
    hint: 'Radix rejects value="". Here it is just another option.',
    options: [
      { value: '', label: 'No discount' },
      { value: '10', label: '10% off' },
      { value: '25', label: '25% off' },
    ],
  },
};

/** A `hint` under the label, an `error` (linked to the trigger and marking it invalid) and a `disabled` select that keeps its value but can’t be opened. */
export const States: Story = {
  render: () => (
    <Stack gap={5}>
      <Select label="With hint" hint="Shown under the label." options={fruit} />
      <Select label="With error" error="Choose a fruit to continue." required options={fruit} />
      <Select label="Disabled" disabled defaultValue="mango" options={fruit} />
    </Stack>
  ),
};

/** Inside a real `<form>`. A hidden native `<select>` carries each `name`, so the values appear in `FormData`; `required` blocks the submit, marks the trigger invalid and focuses it, and Reset restores the defaults. */
export const InAForm: Story = {
  name: 'Form: required, submit and reset',
  render: function Render() {
    const [submitted, setSubmitted] = useState<string | null>(null);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)), null, 2));
    };
    return (
      <form onSubmit={onSubmit} onReset={() => setSubmitted(null)}>
        <Stack gap={4}>
          <Select label="Plan" name="plan" required placeholder="Choose a plan" options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]} />
          <Select label="Add-ons" name="addons" multiple defaultValue={['backup']} options={[
            { value: 'backup', label: 'Daily backups' },
            { value: 'sso', label: 'Single sign-on' },
            { value: 'audit', label: 'Audit log' },
          ]} />
          <Stack direction="row" gap={2}>
            <Button type="submit">Submit</Button>
            <Button type="reset" variant="secondary">Reset</Button>
          </Stack>
          {submitted && <pre style={{ margin: 0, fontSize: 13 }}>{submitted}</pre>}
        </Stack>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    const plan = canvas.getByRole('combobox', { name: /plan/i });
    await expect(plan).toHaveAttribute('aria-invalid', 'true');
    await expect(plan).toHaveFocus();
  },
};

/** A select inside a `Dialog`. The list opens in the top layer through the Popover API, so it sits above the dialog with no portal or z-index. The first Escape closes only the list and the second closes the dialog. */
export const InsideDialog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
    const dialog = canvas.getByRole('dialog', { name: 'Move task' });
    const column = within(dialog).getByRole('combobox', { name: 'Column' });
    await userEvent.click(column);
    await expect(column).toHaveAttribute('aria-expanded', 'true');
    // The list renders in the top layer above the dialog: its options are hit-testable.
    const option = canvas.getByRole('option', { name: 'In review' });
    const box = option.getBoundingClientRect();
    await expect(option.contains(canvasElement.ownerDocument.elementFromPoint(box.left + 8, box.top + box.height / 2))).toBe(true);
    // First Escape closes only the list, the second closes the dialog.
    await userEvent.keyboard('{Escape}');
    await expect(column).toHaveAttribute('aria-expanded', 'false');
    await expect(dialog).toHaveAttribute('open');
    await userEvent.keyboard('{Escape}');
    await expect(dialog).not.toHaveAttribute('open');
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Move task"
          description="Escape closes the dropdown first, then the dialog."
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <StorySelect {...args} label="Column" placeholder="Choose a column" options={[
            { value: 'todo', label: 'To do' },
            { value: 'doing', label: 'In progress' },
            { value: 'review', label: 'In review' },
            { value: 'done', label: 'Done' },
          ]} />
        </Dialog>
      </>
    );
  },
};

/** Decorative icons on options, which also appear in the trigger when that option is selected, and a `startIcon` on the trigger for selects whose options have none. */
export const WithIcons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('combobox', { name: 'Status' });
    await userEvent.click(status);
    await userEvent.click(canvas.getByRole('option', { name: 'Done' }));
    await expect(status).toHaveTextContent('Done');
    await expect(status.querySelector('svg circle')).toHaveAttribute('fill', '#22c55e');
  },
  name: 'Icons (trigger and options)',
  render: (args) => (
    <Stack gap={5}>
      <StorySelect
        {...args}
        label="Layout"
        placeholder="Choose a layout"
        defaultValue="grid"
        options={[
          { value: 'grid', label: 'Grid', icon: <GridIcon /> },
          { value: 'list', label: 'List', icon: <ListIcon /> },
          { value: 'board', label: 'Board', icon: <ColumnsIcon /> },
        ]}
      />
      <StorySelect {...args} label="Status" placeholder="Set a status">
        <SelectItem value="todo" icon={<CircleIcon color="#9a9aa5" />}>To do</SelectItem>
        <SelectItem value="doing" icon={<CircleIcon color="#f59e0b" />}>In progress</SelectItem>
        <SelectItem value="done" icon={<CircleIcon color="#22c55e" />}>Done</SelectItem>
      </StorySelect>
      <StorySelect
        {...args}
        label="Region"
        placeholder="Choose a region"
        startIcon={<GlobeIcon />}
        options={[
          { value: 'eu', label: 'Europe' },
          { value: 'us', label: 'North America' },
          { value: 'apac', label: 'Asia Pacific' },
        ]}
      />
    </Stack>
  ),
};

/** Validation in a form. Submitting without a plan shows its `valueMissing` message as the trigger’s description and focuses it. The skills select uses a `validate` rule that rejects more than two choices. */
export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const plan = canvas.getByRole('combobox', { name: /plan/i });
    await expect(plan).toHaveAccessibleDescription('Choose a plan to continue.');
    await expect(plan).toHaveFocus();
    await userEvent.click(plan);
    await userEvent.click(canvas.getByRole('option', { name: 'Pro' }));
    await expect(plan).not.toHaveAttribute('aria-invalid');
  },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={4}>
        <StorySelect
          {...args}
          label="Plan"
          name="plan"
          required
          placeholder="Choose a plan"
          validationMessages={{ valueMissing: 'Choose a plan to continue.' }}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
        <StorySelect
          {...args}
          label="Skills"
          name="skills"
          multiple
          hint="Pick up to two."
          placeholder="Choose skills"
          validate={(value) => (Array.isArray(value) && value.length > 2 ? 'Choose no more than two skills.' : null)}
          options={[
            { value: 'react', label: 'React' },
            { value: 'css', label: 'CSS' },
            { value: 'ts', label: 'TypeScript' },
            { value: 'a11y', label: 'Accessibility' },
          ]}
        />
        <Button type="submit">Continue</Button>
      </Stack>
    </form>
  ),
};
