import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Card, CardLink } from './Card';

describe('Card', () => {
  it('renders a div by default', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card').tagName).toBe('DIV');
  });

  it('renders as an article for self-contained content', () => {
    render(<Card as="article">Post</Card>);
    expect(screen.getByRole('article')).toHaveTextContent('Post');
  });

  it('renders as a labelled region when it is a section', () => {
    render(
      <Card as="section" aria-labelledby="h">
        <h2 id="h">Usage</h2>
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Usage' })).toBeInTheDocument();
  });

  it('is flat by default and raised on request', () => {
    const { rerender } = render(<Card as="article">Post</Card>);
    expect(screen.getByRole('article')).not.toHaveClass('raised');
    rerender(
      <Card as="article" elevation="raised">
        Post
      </Card>,
    );
    expect(screen.getByRole('article')).toHaveClass('raised');
  });

  it('keeps inner actions separate from the card link', async () => {
    const onLike = vi.fn();
    render(
      <Card as="article" interactive>
        <h3>
          <CardLink href="/posts/1">Post title</CardLink>
        </h3>
        <button type="button" onClick={onLike}>Like</button>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Post title' });
    const like = screen.getByRole('button', { name: 'Like' });

    // Neither control is nested inside the other.
    expect(link).not.toContainElement(like);
    expect(like).not.toContainElement(link);

    await userEvent.click(like);
    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ul>
        <Card as="li">
          <CardLink href="/a">Item A</CardLink>
        </Card>
      </ul>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
