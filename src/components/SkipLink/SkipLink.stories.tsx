import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Link } from '../Link/Link';
import { SkipLink } from './SkipLink';

/**
 * In the Vitest browser runner, following the `#main` fragment navigates the test frame away and
 * ends the run. Cancel that default navigation after SkipLink has moved focus; focus handling is
 * what these stories demonstrate.
 */
const withoutFragmentNavigation: Decorator = (Story) => {
  useEffect(() => {
    const cancel = (event: MouseEvent) => {
      if ((event.target as Element).closest?.('a[href^="#"]')) event.preventDefault();
    };
    document.addEventListener('click', cancel);
    return () => document.removeEventListener('click', cancel);
  }, []);
  return <Story />;
};

const meta = {
  title: 'Components/SkipLink',
  component: SkipLink,
  decorators: [withoutFragmentNavigation],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A “Skip to main content” link (WCAG 2.4.1) that renders an `<a href="#main">`, hidden until it receives keyboard focus. Render it as the very first focusable element on every page, and give your `<main>` the matching `id`; activating it moves keyboard focus into that element. For any other in-page link, use `Link`.',
      },
    },
  },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <header style={{ padding: 'var(--ds-space-4)', borderBottom: 'var(--ds-border-width) solid var(--ds-color-border)' }}>
        <nav aria-label="Primary">
          <Link href="#home" variant="subtle">Home</Link> · <Link href="#products" variant="subtle">Products</Link> ·{' '}
          <Link href="#pricing" variant="subtle">Pricing</Link>
        </nav>
      </header>
      <main id="main" style={{ padding: 'var(--ds-space-4)' }}>
        <h1>Main content</h1>
        <p>Press Tab once to reveal the skip link, then Enter to jump here.</p>
      </main>
    </>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Hidden until the first Tab press, then shown at the top left. Enter moves focus to `#main`,
 * giving it `tabindex="-1"` while it holds focus, so the next Tab continues from the main content.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Skip to main content' });
    await expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);

    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.getBoundingClientRect().width).toBeGreaterThan(1);

    await userEvent.keyboard('{Enter}');
    const main = canvas.getByRole('main');
    await waitFor(() => expect(main).toHaveFocus());
    await expect(main).toHaveAttribute('tabindex', '-1');
  },
};

/** `href` and the link text can point somewhere else, such as a search field, when that is where most visitors want to go. */
export const CustomTarget: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Skip to search' }));
    await expect(canvas.getByRole('searchbox', { name: 'Search the shop' })).toHaveFocus();
  },
  args: { href: '#site-search', children: 'Skip to search' },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <main id="main" style={{ padding: 'var(--ds-space-4)' }}>
        <h1>Shop</h1>
        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="site-search">Search the shop</label> <input id="site-search" type="search" />
        </form>
      </main>
    </>
  ),
};
