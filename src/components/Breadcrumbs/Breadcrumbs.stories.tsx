import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Laptops', href: '#laptops' },
  { label: 'Aero 14' },
];

const longTrail: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Help centre', href: '#help' },
  { label: 'Accounts and billing', href: '#accounts' },
  { label: 'Payment methods', href: '#payments' },
  { label: 'Cards issued outside the United Kingdom', href: '#cards' },
  { label: 'Why was my international card declined at checkout?' },
];

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: { items: trail },
  argTypes: {
    renderLink: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A trail of links from the top level to the current page, rendered as `<nav aria-label="Breadcrumb">` around an `<ol>`, with the last item marked `aria-current="page"`. Separators are drawn in CSS, so screen readers only hear the crumbs. Use it on pages deep in a hierarchy, alongside (not instead of) the main navigation.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ancestors are links; the last item is the current page, shown as text with `aria-current="page"`. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Breadcrumb' });
    await expect(within(nav).getAllByRole('link')).toHaveLength(3);
    await expect(within(nav).getByText('Aero 14')).toHaveAttribute('aria-current', 'page');
  },
};

/** Give the last item an `href` and it renders as a link to the current page, still marked `aria-current="page"`. */
export const CurrentPageAsLink: Story = {
  play: async ({ canvasElement }) => {
    const current = within(canvasElement).getByRole('link', { name: 'Aero 14' });
    await expect(current).toHaveAttribute('aria-current', 'page');
  },
  name: 'Current page as a link',
  args: { items: [...trail.slice(0, 3), { label: 'Aero 14', href: '#aero-14' }] },
};

/** Long trails wrap between crumbs on narrow screens, and a very long label wraps within itself rather than overflowing. */
export const LongTrail: Story = {
  args: { items: longTrail },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <Breadcrumbs {...args} />
    </div>
  ),
};

/**
 * `maxItems` keeps the first item and the last `maxItems - 1`, hiding the rest behind a "…"
 * button. Activating it reveals the full trail and moves focus to the first crumb it revealed.
 */
export const Collapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', { name: 'Accounts and billing' })).not.toBeInTheDocument();
    const expand = canvas.getByRole('button', { name: 'Show full breadcrumb trail' });
    await userEvent.click(expand);
    await expect(canvas.getByRole('link', { name: 'Help centre' })).toHaveFocus();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(longTrail.length);
  },
  args: { items: longTrail, maxItems: 3 },
};

/** `label` renames the navigation landmark, for example to match the page language. */
export const CustomLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('navigation', { name: 'Fil d’Ariane' })).toBeInTheDocument();
  },
  args: {
    label: 'Fil d’Ariane',
    items: [{ label: 'Accueil', href: '#accueil' }, { label: 'Produits', href: '#produits' }, { label: 'Ordinateurs' }],
  },
};

/** In a right-to-left page the trail reads from the right and the separators point the other way. */
export const RightToLeft: Story = {
  name: 'Right to left',
  render: (args) => (
    <div dir="rtl">
      <Breadcrumbs {...args} />
    </div>
  ),
};

const onNavigate = fn();

/**
 * `renderLink` swaps in your router’s link, for example
 * `renderLink={({ item, ...props }) => <NextLink {...props} />}`. Spread the props so the styling
 * and `aria-current` reach the link.
 */
export const WithRouterLinks: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('link', { name: 'Products' }));
    await expect(onNavigate).toHaveBeenCalledWith('/products');
  },
  name: 'With router links',
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops' },
    ],
    renderLink: ({ item: _item, href, ...props }) => (
      <a
        {...props}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(href);
        }}
      />
    ),
  },
};
