import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ColumnsIcon, GlobeIcon, GridIcon, HeartIcon, ListIcon, SettingsIcon } from '../../docs/icons';
import { Badge } from '../Badge/Badge';
import { Marquee } from './Marquee';

const tools = [
  { label: 'Unreal Engine', icon: <GridIcon /> },
  { label: 'React', icon: <SettingsIcon /> },
  { label: 'TypeScript', icon: <ListIcon /> },
  { label: 'Blender', icon: <ColumnsIcon /> },
  { label: 'Next.js', icon: <GlobeIcon /> },
  { label: 'Figma', icon: <HeartIcon /> },
];

const Tool = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--ds-color-text-muted)' }}>
    {icon}
    {label}
  </span>
);

const meta = {
  title: 'Components/Marquee',
  component: Marquee,
  args: {
    label: 'Tools I use',
    repeat: 2,
    children: tools.map((tool) => <Tool key={tool.label} {...tool} />),
  },
  argTypes: {
    children: { control: false },
    duration: { control: { type: 'range', min: 5, max: 80 } },
    fade: { control: { type: 'range', min: 0, max: 40 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An endless strip that pauses on hover and focus, has its own pause button (WCAG 2.2.2), announces its list once, and becomes a static, keyboard-scrollable strip when motion is reduced, by the system setting or a `MotionToggle`.',
      },
    },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A strip of tools scrolling left. It pauses on hover and focus, and the pause button (an `IconButton` with `aria-pressed`) lets touch and screen reader users stop it too. The list is announced once, because the duplicate copy and repeats are `aria-hidden`. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('list')).toHaveLength(1);
    const pause = canvas.getByRole('button', { name: 'Pause Tools I use' });
    await userEvent.click(pause);
    const track = canvasElement.querySelector('ul')!.parentElement!;
    await waitFor(() => expect(getComputedStyle(track).animationPlayState).toBe('paused'));
  },
};

/** `reverse` makes the strip travel left to right, for example to run against a neighbouring marquee. */
export const Reverse: Story = {
  args: { reverse: true, label: 'Tools, reversed' },
};

/** Any content works as an item: here `Badge`s with a tighter `gap` and a shorter `duration`. A short list needs a higher `repeat` so each copy is wider than the strip and no gap opens at the seam. */
export const Badges: Story = {
  args: {
    label: 'Topics',
    duration: 25,
    repeat: 3,
    gap: 'var(--ds-space-3)',
    children: ['Accessibility', 'Design tokens', 'Testing', 'Motion', 'Theming', 'Forms'].map((topic) => (
      <Badge key={topic} tone="accent">{topic}</Badge>
    )),
  },
};

/** `fade={0}` removes the edge fade, for strips inside a bordered container or on a background the fade can’t blend into. */
export const HardEdges: Story = {
  args: { fade: 0, label: 'Tools, hard edges' },
};
