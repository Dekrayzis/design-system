import type { Meta, StoryObj } from '@storybook/react-vite';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Link, linkClassName } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    href: 'https://example.com/docs',
    children: 'read the documentation',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'subtle'] },
    external: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An inline text link that renders a real `<a href>`, underlined so it never relies on colour alone. Use `LinkButton` when navigation should look like a button, and `Button` for actions on the current page. For router links, put `linkClassName()` on your router’s own link component.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A link inside running text. It is underlined and uses the accent text colour, and it is reached with Tab like any other link. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'read the documentation' });
    await expect(link).toHaveAttribute('href', 'https://example.com/docs');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  render: (args) => (
    <p>
      Before you start, <Link {...args} /> for the full setup guide.
    </p>
  ),
};

/**
 * `subtle` takes the surrounding text colour and keeps the underline, for footers, metadata and
 * dense lists where accent-coloured links would be too loud.
 */
export const Subtle: Story = {
  args: { variant: 'subtle', href: 'https://example.com/terms', children: 'terms of service' },
  render: (args) => (
    <p>
      By continuing you agree to our <Link {...args} />.
    </p>
  ),
};

/** Both variants side by side, so the difference in emphasis is easy to compare. */
export const Variants: Story = {
  render: () => (
    <Stack gap={2}>
      <p>
        Default: <Link href="https://example.com/pricing">see pricing</Link>
      </p>
      <p>
        Subtle: <Link href="https://example.com/pricing" variant="subtle">see pricing</Link>
      </p>
    </Stack>
  ),
};

/**
 * `external` opens the page in a new tab with `rel="noopener noreferrer"`, adds an icon and tells
 * screen reader users "(opens in a new tab)". Change that text with `externalLabel`.
 */
export const External: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'React documentation (opens in a new tab)' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
  args: { href: 'https://react.dev', external: true, children: 'React documentation' },
  render: (args) => (
    <p>
      Hooks are covered in the <Link {...args} />.
    </p>
  ),
};

/** A long link wraps inside narrow containers instead of overflowing them. */
export const LongText: Story = {
  args: {
    href: 'https://example.com/a/very/long/path',
    children: 'https://example.com/guides/getting-started/installing-the-design-system-in-a-monorepo',
  },
  render: (args) => (
    <p style={{ maxWidth: '16rem' }}>
      Full guide: <Link {...args} />
    </p>
  ),
};

/** Stands in for a framework link such as Next.js `Link`, which renders its own `<a>`. */
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate: (href: string) => void }>(
  function RouterLink({ onNavigate, href = '', onClick, ...rest }, ref) {
    return (
      <a
        ref={ref}
        href={href}
        onClick={(event) => {
          onClick?.(event);
          event.preventDefault();
          onNavigate(href);
        }}
        {...rest}
      />
    );
  },
);

const onNavigate = fn();

/**
 * With a router, keep its link component and give it `className={linkClassName()}` (optionally
 * with a `variant`), for example `<NextLink href="/settings" className={linkClassName()}>`. It
 * looks the same as `Link` and keeps client-side navigation.
 */
export const WithRouterLink: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'account settings' });
    await expect(link).toHaveClass(linkClassName().split(' ')[0]!);
    await userEvent.click(link);
    await expect(onNavigate).toHaveBeenCalledWith('/settings');
  },
  name: 'With a router link',
  render: () => (
    <p>
      Change your password in{' '}
      <RouterLink href="/settings" className={linkClassName()} onNavigate={onNavigate}>
        account settings
      </RouterLink>
      .
    </p>
  ),
};
