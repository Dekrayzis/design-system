import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Avatar } from '../Avatar/Avatar';
import { Card } from '../Card/Card';
import { Heading } from '../Heading/Heading';
import { Stack } from '../Stack/Stack';
import { AvatarGroup } from './AvatarGroup';

const portrait = (from: string, to: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#fff" fill-opacity=".85"/><ellipse cx="40" cy="74" rx="26" ry="20" fill="#fff" fill-opacity=".85"/></svg>`,
  );

const people = [
  { name: 'Ada Lovelace', src: portrait('#8187fb', '#4ade80') },
  { name: 'Alan Turing' },
  { name: 'Grace Hopper', src: portrait('#f59e0b', '#ef4444') },
  { name: 'Katherine Johnson' },
  { name: 'Margaret Hamilton' },
  { name: 'Radia Perlman', src: portrait('#60a5fa', '#a78bfa') },
  { name: 'Barbara Liskov' },
  { name: 'Tim Berners-Lee' },
];

const team = people.map((person) => <Avatar key={person.name} name={person.name} src={person.src} />);

const meta = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  args: {
    label: 'Project members',
    max: 5,
    children: team,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    spacing: { control: 'inline-radio', options: ['tight', 'normal', 'loose'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Overlapping avatars with a "+N" overflow. Rendered as a labelled list, so each person is announced by name and the overflow says who is hidden. Initials avatars get a colour from the person\'s name, so neighbours are easy to tell apart and a person keeps their colour everywhere.',
      },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Eight people with `max={5}`: five avatars are shown and the rest collapse into a ‘+3’ bubble.
 * Each avatar shows its name in a tooltip on hover, and the bubble carries visually hidden text
 * naming who is left out.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Project members' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(6);
    await expect(within(list).getByText('+3')).toBeVisible();
  },
};

/** `size` is applied to every avatar in the group, replacing each avatar’s own size. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap={4}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <AvatarGroup key={size} {...args} label={`Members (${size})`} size={size} />
      ))}
    </Stack>
  ),
};

/** `spacing` sets how far the avatars overlap: `tight`, `normal` or `loose`. */
export const Spacing: Story = {
  render: (args) => (
    <Stack gap={4}>
      {(['tight', 'normal', 'loose'] as const).map((spacing) => (
        <AvatarGroup key={spacing} {...args} label={`Members (${spacing})`} spacing={spacing} />
      ))}
    </Stack>
  ),
};

/** Without `max`, every avatar is shown and there is no overflow bubble. */
export const NoOverflow: Story = {
  args: { max: undefined, children: team.slice(0, 4) },
};

/**
 * Use `total` when `children` holds only the first few people, for example from a paged API. Here
 * only three people were loaded but the project has 128 members, so the bubble reads ‘+125’.
 */
export const KnownTotal: Story = {
  name: 'Partial list with a known total',
  args: { max: undefined, total: 128, children: team.slice(0, 3) },
};

/**
 * With `onOverflowClick`, the bubble becomes a `<button>` whose accessible name lists the hidden
 * people (‘Show 4 more: …’). Use it to open the full member list.
 */
export const ClickableOverflow: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /^Show 4 more: Margaret Hamilton/ }));
    await expect(args.onOverflowClick).toHaveBeenCalledTimes(1);
  },
  args: { max: 4, onOverflowClick: fn() },
};

/**
 * On a surface other than the page background, set the `--avatar-group-ring` custom property to
 * that surface’s colour so the rings separating the avatars blend into the card.
 */
export const OnACard: Story = {
  name: 'On a card (matching ring colour)',
  render: (args) => (
    <Card elevation="raised" style={{ maxWidth: 360 }}>
      <Stack gap={3}>
        <Heading level={3} size="md">Design system</Heading>
        <AvatarGroup {...args} size="sm" style={{ '--avatar-group-ring': 'var(--ds-color-surface-raised)' } as React.CSSProperties} />
      </Stack>
    </Card>
  ),
};
