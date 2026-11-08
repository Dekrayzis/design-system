import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table/Table';
import { Skeleton, SkeletonGroup } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  subcomponents: { SkeletonGroup },
  args: { variant: 'text', lines: 3 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rectangle', 'circle'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Placeholder shapes (`text`, `rectangle`, `circle`) shown in place of content that is loading, rendered as `aria-hidden` `<span>`s with a shimmer that stops when motion is reduced or paused. Wrap them in `SkeletonGroup`, which marks the region `aria-busy` and announces "Loading…" once through a status message. Prefer a skeleton when you know the shape of what is coming; use a `Spinner` for short or shapeless waits, such as a button action.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Text lines sized like body copy. With more than one line the last is shorter, like the end of a
 * paragraph. Skeletons are decorative, so they are hidden from assistive tech.
 */
export const Text: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  },
};

/**
 * `rectangle` for images and blocks, `circle` for avatars. Sizes take a CSS length (a token such as
 * `var(--ds-space-12)`, rem or %) or a number of pixels.
 */
export const Shapes: Story = {
  render: () => (
    <Stack gap={4}>
      <Skeleton variant="rectangle" height="8rem" />
      <Stack direction="row" gap={3} align="center">
        <Skeleton variant="circle" width="var(--ds-space-8)" />
        <Skeleton variant="circle" />
        <Skeleton variant="circle" width={56} />
        <Skeleton variant="rectangle" width="6rem" height="var(--ds-space-8)" />
      </Stack>
    </Stack>
  ),
};

function ProfileCard() {
  return (
    <Card as="article" aria-label="Ada Lovelace">
      <Stack direction="row" gap={3} align="center">
        <Avatar name="Ada Lovelace" decorative />
        <p style={{ margin: 0, fontWeight: 600 }}>Ada Lovelace</p>
      </Stack>
      <p style={{ marginBlockEnd: 0, color: 'var(--ds-color-text-muted)' }}>
        Wrote the first published algorithm intended for a machine, for Babbage’s Analytical Engine.
      </p>
    </Card>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card>
      <Stack direction="row" gap={3} align="center">
        <Skeleton variant="circle" />
        <Skeleton width="10rem" />
      </Stack>
      <div style={{ marginBlockStart: 'var(--ds-space-4)' }}>
        <Skeleton lines={2} />
      </div>
    </Card>
  );
}

/**
 * A card skeleton that mirrors the real card's layout (avatar, name, two lines), inside a
 * `SkeletonGroup` so the loading state is announced once.
 */
export const CardSkeleton: Story = {
  render: () => (
    <SkeletonGroup loading aria-label="Profile" fallback={<ProfileCardSkeleton />}>
      <ProfileCard />
    </SkeletonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Loading…'));
    await expect(canvas.getByRole('status').parentElement).toHaveAttribute('aria-busy', 'true');
  },
};

/** The invoices table, or its skeleton when `rows` is null. */
function InvoiceTable({ rows }: { rows: string[][] | null }) {
  return (
    <Table caption="Invoices">
      <TableHead>
        <TableRow>
          <TableHeader>Number</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader align="end">Amount</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows === null
          ? [1, 2, 3, 4].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Skeleton width="5rem" />
                </TableCell>
                <TableCell>
                  <Skeleton width="8rem" />
                </TableCell>
                <TableCell align="end">
                  <Skeleton width="4rem" style={{ marginInlineStart: 'auto' }} />
                </TableCell>
              </TableRow>
            ))
          : rows.map(([number, customer, amount]) => (
              <TableRow key={number}>
                <TableCell>{number}</TableCell>
                <TableCell>{customer}</TableCell>
                <TableCell align="end">{amount}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

/**
 * A table skeleton keeps the real caption and column headers, so people know what is coming, and
 * fills the body cells with text skeletons.
 */
export const TableSkeleton: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  render: () => (
    <SkeletonGroup loading label="Loading invoices…" fallback={<InvoiceTable rows={null} />}>
      <InvoiceTable rows={[['INV-001', 'Acme Ltd', '£1,200.00']]} />
    </SkeletonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Invoices' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(3);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Loading invoices…'));
  },
};

const DELAY = 1200;

function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), DELAY);
  };

  useEffect(() => {
    load();
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <Stack gap={3} align="flex-start">
      <Button variant="secondary" onClick={load}>
        Reload profile
      </Button>
      <div style={{ alignSelf: 'stretch' }}>
        <SkeletonGroup loading={loading} label="Loading profile…" loadedLabel="Profile loaded" fallback={<ProfileCardSkeleton />}>
          <ProfileCard />
        </SkeletonGroup>
      </div>
    </Stack>
  );
}

/**
 * Loading, then loaded. The region is `aria-busy` while the skeleton shows, its status message says
 * "Loading profile…" once, and when the content arrives it says "Profile loaded".
 */
export const LoadingToLoaded: Story = {
  name: 'Loading → loaded',
  render: () => <LoadingDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    await waitFor(() => expect(status).toHaveTextContent('Loading profile…'));
    await waitFor(() => expect(canvas.getByRole('article', { name: 'Ada Lovelace' })).toBeInTheDocument(), {
      timeout: DELAY * 3,
    });
    await expect(status).toHaveTextContent('Profile loaded');
    await expect(status.parentElement).toHaveAttribute('aria-busy', 'false');

    await userEvent.click(canvas.getByRole('button', { name: 'Reload profile' }));
    await expect(status).toHaveTextContent('Loading profile…');
    await expect(canvas.queryByRole('article')).not.toBeInTheDocument();
  },
};
