import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColumnsIcon, GridIcon, ListIcon } from '../../docs/icons';
import { Switch } from '../Switch/Switch';
import { TextField } from '../TextField/TextField';
import { Stack } from '../Stack/Stack';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  args: {
    defaultValue: 'profile',
    onValueChange: fn(),
    children: null,
  },
  argTypes: {
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Switches between panels of related content in the same place, following the WAI-ARIA tabs pattern: `TabList` renders `role="tablist"`, each `Tab` a `<button role="tab">` and each `TabPanel` a `role="tabpanel"` labelled by its tab. Selection follows focus, and only the selected tab is in the tab order. If each tab should be its own page with its own URL, use navigation links instead.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Underline tabs, named by the `TabList` `label` ("Account settings"). The list is a single tab
 * stop: Left and Right arrows move between tabs and select them, Home and End jump to the ends,
 * and the `disabled` Billing tab is skipped.
 */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Tabs {...args}>
        <TabList label="Account settings">
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="billing" disabled>Billing</Tab>
          <Tab value="security">Security</Tab>
        </TabList>
        <TabPanel value="profile">
          <Stack gap={4}>
            <TextField label="Display name" defaultValue="Alex Morgan" />
            <TextField label="Email" type="email" defaultValue="alex@example.com" />
          </Stack>
        </TabPanel>
        <TabPanel value="notifications">
          <Stack gap={4}>
            <Switch label="Mentions" defaultChecked />
            <Switch label="Weekly digest" />
          </Stack>
        </TabPanel>
        <TabPanel value="billing">Billing details.</TabPanel>
        <TabPanel value="security">
          <p style={{ margin: 0 }}>Two-factor authentication is on.</p>
        </TabPanel>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', { name: 'Profile' });

    await userEvent.click(profile);
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Notifications' })).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('notifications');

    // Disabled tabs are skipped.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{Home}');
    await expect(profile).toHaveAttribute('aria-selected', 'true');
  },
};

const panelText: Record<string, string> = {
  game: 'Gameplay systems, tools and pipelines in Unreal Engine.',
  web: 'Full-stack web apps with React and Next.js.',
  '3d': 'Real-time 3D: models, shaders and viewers.',
};

/**
 * With `variant="pill"` the tabs share the sliding accent pill of `ButtonGroup` but keep full tab
 * semantics: each tab controls its panel, and the arrow keys move between tabs and select them.
 */
export const Pill: Story = {
  name: 'Pill (sliding)',
  args: { defaultValue: 'game' },
  render: (args) => (
    <Tabs {...args}>
      <TabList label="Kind of work" variant="pill">
        <Tab value="game">Game</Tab>
        <Tab value="web">Web</Tab>
        <Tab value="3d">3D</Tab>
      </TabList>
      {Object.entries(panelText).map(([value, text]) => (
        <TabPanel key={value} value={value}>
          <p style={{ margin: 0 }}>{text}</p>
        </TabPanel>
      ))}
    </Tabs>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Game' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Web' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('React');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('web');
  },
};

/**
 * The pill variant at `size` `sm`, `md` and `lg`. Pill tabs in a list share one width, set by the
 * widest label.
 */
export const PillSizes: Story = {
  args: { defaultValue: 'web' },
  render: (args) => (
    <Stack gap={5}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tabs key={size} {...args}>
          <TabList label={`Kind of work (${size})`} variant="pill" size={size}>
            <Tab value="game">Game</Tab>
            <Tab value="web">Web</Tab>
            <Tab value="3d">3D</Tab>
          </TabList>
          {/* Every tab must control a panel; aria-controls would point at nothing otherwise. */}
          {Object.entries(panelText).map(([value, text]) => (
            <TabPanel key={value} value={value}>
              <p style={{ margin: 0 }}>{text}</p>
            </TabPanel>
          ))}
        </Tabs>
      ))}
    </Stack>
  ),
};

/**
 * Pill tabs with an `icon` before each label, stretched to the container with `fullWidth`. The
 * icons are decorative (`aria-hidden`), so the text names each tab; the disabled Board tab is
 * skipped and arrow keys wrap from the last enabled tab to the first.
 */
export const PillWithIcons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Grid' }));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    // Board is disabled, so focus wraps back to Grid.
    await expect(canvas.getByRole('tab', { name: 'Grid' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('A compact list.');
    const tab = canvas.getByRole('tab', { name: 'List' });
    const thumb = tab.parentElement!.querySelector('span[aria-hidden]') as HTMLElement;
    await waitFor(() => expect(Math.round(thumb.getBoundingClientRect().left)).toBe(Math.round(tab.getBoundingClientRect().left)), { timeout: 2000 });
  },
  args: { defaultValue: 'grid' },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Tabs {...args}>
        <TabList label="View" variant="pill" fullWidth>
          <Tab value="grid" icon={<GridIcon />}>Grid</Tab>
          <Tab value="list" icon={<ListIcon />}>List</Tab>
          <Tab value="board" icon={<ColumnsIcon />} disabled>Board</Tab>
        </TabList>
        <TabPanel value="grid">Cards in a responsive grid.</TabPanel>
        <TabPanel value="list">A compact list.</TabPanel>
        <TabPanel value="board">Columns by status.</TabPanel>
      </Tabs>
    </div>
  ),
};

/** The default underline variant with a decorative `icon` before each label. */
export const UnderlineWithIcons: Story = {
  args: { defaultValue: 'grid' },
  render: (args) => (
    <Tabs {...args}>
      <TabList label="View">
        <Tab value="grid" icon={<GridIcon />}>Grid</Tab>
        <Tab value="list" icon={<ListIcon />}>List</Tab>
      </TabList>
      <TabPanel value="grid">Cards in a responsive grid.</TabPanel>
      <TabPanel value="list">A compact list.</TabPanel>
    </Tabs>
  ),
};
