import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { HeartIcon } from '../../docs/icons';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { IconButton } from '../IconButton/IconButton';
import { Stack } from '../Stack/Stack';
import { Card, CardLink } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  subcomponents: { CardLink },
  args: {
    padding: 'md',
    elevation: 'flat',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['article', 'section', 'div', 'li'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    elevation: { control: 'inline-radio', options: ['flat', 'raised'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 380 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A surface that groups related content, rendered as a `<div>` by default or as an `article`, `section` or `li` through `as`. Choose the element by meaning: `article` for self-contained content, `section` for a headed part of the page, `li` inside a list. To make a whole card clickable, set `interactive` and put a `CardLink` in its heading instead of wrapping the card in a link.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A flat card rendered `as="section"` and labelled by its heading through `aria-labelledby`, so it
 * is exposed as a named region.
 */
export const Default: Story = {
  args: {
    as: 'section',
    'aria-labelledby': 'usage-heading',
    children: (
      <Stack gap={2}>
        <Heading level={2} size="lg" id="usage-heading">Usage this month</Heading>
        <p style={{ margin: 0, color: 'var(--ds-color-text-muted)' }}>
          You’ve used 7,420 of 10,000 API calls. The counter resets on 1 November.
        </p>
      </Stack>
    ),
  },
};

/** The same card with `elevation="raised"`, which adds a shadow on top of the border. */
export const Raised: Story = {
  args: { ...Default.args, elevation: 'raised' },
};

/**
 * An `interactive` card whose `CardLink` stretches its hit area over the whole card and lifts it on
 * hover. The like button stays a separate control layered above the link, so nothing interactive is
 * nested inside it.
 */
export const ClickableWithActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Design tokens that scale' });
    const save = canvas.getByRole('button', { name: 'Save to favourites' });
    // The inner action isn't nested in the stretched link, and sits above its overlay:
    // the element at the button's centre must be the button itself.
    await expect(link).not.toContainElement(save);
    const box = save.getBoundingClientRect();
    const hit = canvasElement.ownerDocument.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    await expect(save.contains(hit)).toBe(true);
  },
  name: 'Clickable card with inner actions',
  render: () => (
    <Card as="article" interactive elevation="raised">
      <Stack gap={3}>
        <Stack direction="row" justify="space-between" align="center">
          <Badge tone="accent">Guide</Badge>
          <IconButton label="Save to favourites" icon={<HeartIcon />} size="sm" onClick={fn()} />
        </Stack>
        <Heading level={3} size="lg">
          <CardLink href="https://example.com/articles/design-tokens">Design tokens that scale</CardLink>
        </Heading>
        <p style={{ margin: 0, color: 'var(--ds-color-text-muted)' }}>
          How to split primitives from semantic tokens so a theme only touches one layer.
        </p>
        <Stack direction="row" gap={2} align="center">
          <Avatar name="Sam Rivera" size="sm" decorative />
          <span style={{ fontSize: 14 }}>Sam Rivera · <time dateTime="2026-10-02">2 Oct 2026</time></span>
        </Stack>
      </Stack>
    </Card>
  ),
};

/**
 * Cards rendered `as="li"` inside a `<ul>` grid, so screen readers announce the plans as a list and
 * give its length.
 */
export const Grid: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>],
  render: () => (
    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, padding: 0, margin: 0 }}>
      {['Starter', 'Team', 'Enterprise'].map((plan) => (
        <Card key={plan} as="li" elevation="raised">
          <Stack gap={3}>
            <Heading level={3} size="lg">{plan}</Heading>
            <Button variant={plan === 'Team' ? 'primary' : 'secondary'} fullWidth>
              Choose {plan}
            </Button>
          </Stack>
        </Card>
      ))}
    </ul>
  ),
};
