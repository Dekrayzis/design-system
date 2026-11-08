import { act, render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Skeleton, SkeletonGroup } from './Skeleton';

describe('Skeleton', () => {
  it('renders one decorative text line by default', () => {
    const { container } = render(<Skeleton />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).not.toHaveClass('last');
  });

  it('renders several lines with a shorter last line', () => {
    const { container } = render(<Skeleton lines={3} width="20rem" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(3);
    expect(root.children[1]).not.toHaveClass('last');
    expect(root.children[2]).toHaveClass('last');
    expect(root).toHaveStyle({ width: '20rem' });
  });

  it('always renders at least one line', () => {
    const { container } = render(<Skeleton lines={0} />);
    expect(container.firstElementChild!.children).toHaveLength(1);
  });

  it('renders a rectangle with pixel or CSS sizes', () => {
    const { container } = render(<Skeleton variant="rectangle" width={120} height="var(--ds-space-8)" className="x" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('skeleton', 'rectangle', 'x');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('120px');
    expect(el.style.height).toBe('var(--ds-space-8)');
  });

  it('makes a circle as tall as it is wide unless told otherwise', () => {
    const { container, rerender } = render(<Skeleton variant="circle" width={48} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.height).toBe('48px');
    rerender(<Skeleton variant="circle" width={48} height={40} />);
    expect(el.style.height).toBe('40px');
  });

  it('leaves a rectangle height to CSS when not given', () => {
    const { container } = render(<Skeleton variant="rectangle" />);
    expect((container.firstElementChild as HTMLElement).style.height).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Skeleton variant="circle" />
        <Skeleton lines={2} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('SkeletonGroup', () => {
  it('mounts its status region empty, then announces loading once, and is busy', () => {
    const snapshots: string[] = [];
    render(
      <div
        ref={(el) => {
          if (el) snapshots.push(el.querySelector('[role="status"]')?.textContent ?? 'missing');
        }}
      >
        <SkeletonGroup loading fallback={<Skeleton />} aria-label="Invoices">
          <p>Loaded</p>
        </SkeletonGroup>
      </div>,
    );
    expect(snapshots[0]).toBe('');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.getByRole('status').parentElement).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Loaded')).not.toBeInTheDocument();
  });

  it('swaps in the content and announces loadedLabel when loading finishes', () => {
    const { rerender } = render(
      <SkeletonGroup loading fallback={<Skeleton />} label="Loading invoices" loadedLabel="Invoices loaded">
        <p>Loaded</p>
      </SkeletonGroup>,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading invoices');
    rerender(
      <SkeletonGroup loading={false} fallback={<Skeleton />} label="Loading invoices" loadedLabel="Invoices loaded">
        <p>Loaded</p>
      </SkeletonGroup>,
    );
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Invoices loaded');
    expect(status.parentElement).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });

  it('clears the status after loading when there is no loadedLabel', () => {
    const { rerender } = render(<SkeletonGroup loading fallback={<Skeleton />} />);
    rerender(<SkeletonGroup loading={false} fallback={<Skeleton />} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('stays silent for content that was never loading', async () => {
    render(
      <SkeletonGroup loading={false} fallback={<Skeleton />} loadedLabel="Invoices loaded" className="g">
        <p>Ready</p>
      </SkeletonGroup>,
    );
    await act(async () => {});
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('status').parentElement).toHaveClass('group', 'g');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SkeletonGroup loading fallback={<Skeleton variant="rectangle" />}>
        <p>Done</p>
      </SkeletonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
