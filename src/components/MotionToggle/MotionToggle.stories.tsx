import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { setMotionPaused } from '../../utils/motion';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { Marquee } from '../Marquee/Marquee';
import { Spinner } from '../Spinner/Spinner';
import { Stack } from '../Stack/Stack';
import { MotionToggle } from './MotionToggle';

/** Everything that moves, so the switch's effect is visible. */
function Demo({ variant }: { variant?: 'icon' | 'labelled' }) {
  useEffect(() => () => setMotionPaused(false), []);
  return (
    <Stack gap={5} style={{ maxWidth: 520 }}>
      <MotionToggle variant={variant} />
      <Stack direction="row" gap={4} align="center">
        <Spinner label="Working" />
        <ButtonGroup
          label="View"
          defaultValue="a"
          options={[
            { value: 'a', label: 'Grid' },
            { value: 'b', label: 'List' },
            { value: 'c', label: 'Board' },
          ]}
        />
      </Stack>
      <Marquee label="Topics" controls={false} repeat={3}>
        {['Accessibility', 'Design tokens', 'Testing', 'Motion'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </Marquee>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Motion',
  component: Demo,
  args: { variant: 'labelled' },
  argTypes: { variant: { control: 'inline-radio', options: ['icon', 'labelled'] } },
  parameters: {
    docs: {
      description: {
        component:
          '`MotionToggle` pauses every animation on the site (WCAG 2.2.2) and remembers the choice. It sets `data-motion="paused"` on `<html>`, which the tokens treat exactly like the system "reduce motion" setting; use `useLessMotion()` for script-driven motion. Inline `motionPauseScript` in `<head>` to apply a saved choice before first paint.',
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The `labelled` variant (icon and text) next to things that move: a spinner, a button group and a marquee. Pressing it sets `aria-pressed` and `data-motion="paused"` on `<html>`, transitions collapse and the marquee becomes a static, keyboard-scrollable region. When the system already reduces motion it shows as pressed and `aria-disabled`, with a tooltip explaining why. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Pause animations' });
    // In the reduced-motion test run the system already pauses everything.
    if (toggle.getAttribute('aria-disabled') === 'true') return;

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(document.documentElement).toHaveAttribute('data-motion', 'paused');
    // Transitions collapse and the marquee becomes a static, focusable strip.
    await expect(getComputedStyle(document.documentElement).getPropertyValue('--ds-duration-slow').trim()).toBe('0ms');
    await waitFor(() => expect(canvas.getByRole('region', { name: 'Topics' })).toBeInTheDocument());

    await userEvent.click(toggle);
    await expect(document.documentElement).not.toHaveAttribute('data-motion');
  },
};

/** The compact `icon` variant for headers and toolbars. Its accessible name is still “Pause animations” and it shows that label as a tooltip on hover and focus. */
export const IconOnly: Story = {
  args: { variant: 'icon' },
};
