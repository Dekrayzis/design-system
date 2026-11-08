import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { LazyImage } from './LazyImage';

const photo = (hue: number) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 60%)"/><stop offset="1" stop-color="hsl(${hue + 60} 70% 45%)"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><circle cx="300" cy="80" r="36" fill="#fff" fill-opacity=".8"/><path d="M0 220 120 120l90 80 60-50 130 110H0Z" fill="#000" fill-opacity=".25"/></svg>`,
  );

const meta = {
  title: 'Components/LazyImage',
  component: LazyImage,
  args: {
    src: photo(220),
    alt: 'Mountains at dusk',
    width: 400,
    height: 260,
  },
  argTypes: {
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Lazy-loads with a skeleton that only appears after 150ms, fades in only images still loading after hydration (never the LCP image), keeps its shape and is announced by its alt text if it fails.',
      },
    },
  },
} satisfies Meta<typeof LazyImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A lazily loaded image (`loading="lazy"`, `decoding="async"`) with `width` and `height` set so the layout doesn’t shift while it loads. Use `loading="eager"` for the largest image above the fold, which also turns off the fade-in so LCP isn’t delayed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByRole('img', { name: 'Mountains at dusk' });
    await expect(img).toHaveAttribute('loading', 'lazy');
  },
};

/** When the image can’t load, the fallback takes its place at the same 400×260 shape, so the layout doesn’t collapse. It is exposed as `role="img"` named by the `alt` text; with `alt=""` it would be hidden from assistive tech instead. */
export const Failed: Story = {
  name: 'Failed load (fallback)',
  args: { src: 'https://invalid.example/missing.jpg', alt: 'Team photo' },
  play: async ({ canvasElement }) => {
    // The fallback keeps the image's name and its 400×260 shape.
    const fallback = await within(canvasElement).findByText('Image not available', {}, { timeout: 8000 });
    await expect(fallback).toHaveAccessibleName('Team photo');
    await expect(Math.round(fallback.getBoundingClientRect().width)).toBe(400);
  },
};

/** An image that never finishes loading, so the shimmer stays visible. The skeleton only appears after 150ms, so cached and fast images never flash it; pass `skeleton={false}` for cut-outs where a box would show round the edges. */
export const Skeleton: Story = {
  name: 'Skeleton (never loads)',
  // A data URL that never resolves is impossible, so show the loading state with an empty-but-pending image.
  render: (args) => (
    <div style={{ width: 400, height: 260, position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
      <LazyImage {...args} src="https://httpstat.us/200?sleep=60000" fill />
    </div>
  ),
};

/** With `fill`, the image covers a sized, positioned parent (like `object-fit: cover`) instead of using its intrinsic size. Use it for cards, avatars and grids where the container sets the shape. */
export const Fill: Story = {
  name: 'Fill a sized box',
  render: (args) => (
    <Stack direction="row" gap={4}>
      {[220, 20, 140].map((hue) => (
        <div key={hue} style={{ position: 'relative', width: 180, aspectRatio: '1', borderRadius: 16, overflow: 'hidden' }}>
          <LazyImage {...args} src={photo(hue)} alt={`Landscape ${hue}`} fill />
        </div>
      ))}
    </Stack>
  ),
};
