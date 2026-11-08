import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { LazyImage } from './LazyImage';

/** jsdom never loads images; drive their state by hand. */
function setImageState(img: HTMLImageElement, { complete, naturalWidth }: { complete: boolean; naturalWidth: number }) {
  Object.defineProperty(img, 'complete', { value: complete, configurable: true });
  Object.defineProperty(img, 'naturalWidth', { value: naturalWidth, configurable: true });
}

const wrapperOf = (el: Element) => el.closest('[data-status]') as HTMLElement;

describe('LazyImage', () => {
  it('lazy-loads with async decoding by default', () => {
    render(<LazyImage src="/a.png" alt="A cat" width={200} height={100} />);
    const img = screen.getByRole('img', { name: 'A cat' });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).toHaveAttribute('width', '200');
  });

  it('is loading, then loaded when the image arrives', () => {
    render(<LazyImage src="/a.png" alt="A cat" />);
    const img = screen.getByRole('img');
    expect(wrapperOf(img)).toHaveAttribute('data-status', 'loading');
    setImageState(img as HTMLImageElement, { complete: true, naturalWidth: 200 });
    act(() => {
      fireEvent.load(img);
    });
    expect(wrapperOf(screen.getByRole('img'))).toHaveAttribute('data-status', 'loaded');
  });

  describe('when the image already finished before hydration (e.g. cached)', () => {
    function mockFinishedImages(naturalWidth: number) {
      vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
      vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(naturalWidth);
    }

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('shows it straight away as loaded, without hiding or fading it', () => {
      mockFinishedImages(200);
      render(<LazyImage src="/cached.png" alt="A cat" />);
      const img = screen.getByRole('img', { name: 'A cat' });
      expect(img.tagName).toBe('IMG');
      expect(wrapperOf(img)).toHaveAttribute('data-status', 'loaded');
      expect(wrapperOf(img)).not.toHaveClass('waiting');
      expect(wrapperOf(img)).not.toHaveClass('revealed');
    });

    it('shows the fallback when it had already failed', () => {
      mockFinishedImages(0);
      render(<LazyImage src="/broken.png" alt="A cat" />);
      const fallback = screen.getByRole('img', { name: 'A cat' });
      expect(fallback.tagName).toBe('SPAN');
      expect(fallback).toHaveTextContent('Image not available');
    });
  });

  it('hides a still-loading image after hydration and fades it in on arrival', () => {
    render(<LazyImage src="/a.png" alt="A cat" />);
    const wrapper = wrapperOf(screen.getByRole('img'));
    expect(wrapper).toHaveClass('waiting');
    setImageState(screen.getByRole('img') as HTMLImageElement, { complete: true, naturalWidth: 200 });
    act(() => {
      fireEvent.load(screen.getByRole('img'));
    });
    expect(wrapper).toHaveClass('revealed');
    expect(wrapper).not.toHaveClass('waiting');
  });

  it('never hides eager images (they may be the LCP element)', () => {
    render(<LazyImage src="/hero.png" alt="Hero" loading="eager" />);
    expect(wrapperOf(screen.getByRole('img'))).not.toHaveClass('waiting');
  });

  it('shows a named fallback when the image fails, keeping its shape', () => {
    render(<LazyImage src="/broken.png" alt="A cat" width={200} height={100} />);
    act(() => {
      fireEvent.error(screen.getByRole('img'));
    });
    const fallback = screen.getByRole('img', { name: 'A cat' });
    expect(fallback.tagName).toBe('SPAN');
    expect(fallback).toHaveTextContent('Image not available');
    expect(fallback).toHaveStyle({ width: '200px', aspectRatio: '200 / 100' });
  });

  it('hides a decorative image’s fallback from assistive tech', () => {
    const { container } = render(<LazyImage src="" alt="" fallback="—" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('—');
  });

  it('starts clean when src changes, ignoring the old status', () => {
    const { rerender } = render(<LazyImage src="/broken.png" alt="A cat" />);
    act(() => {
      fireEvent.error(screen.getByRole('img'));
    });
    rerender(<LazyImage src="/fixed.png" alt="A cat" />);
    const img = screen.getByRole('img', { name: 'A cat' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/fixed.png');
    expect(wrapperOf(img)).toHaveAttribute('data-status', 'loading');
  });

  it('can drop the skeleton and fill its parent', () => {
    render(<LazyImage src="/a.png" alt="A" skeleton={false} fill />);
    const wrapper = wrapperOf(screen.getByRole('img'));
    expect(wrapper).toHaveClass('bare', 'fill');
  });

  it('has no accessibility violations, loaded or failed', async () => {
    const { container } = render(
      <>
        <LazyImage src="/a.png" alt="A cat" />
        <LazyImage src="" alt="Missing photo" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
