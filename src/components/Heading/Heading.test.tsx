import { render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Heading } from './Heading';

describe('Heading', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)('renders an h%i at that outline level', (level) => {
    render(<Heading level={level}>Title</Heading>);
    expect(screen.getByRole('heading', { level, name: 'Title' }).tagName).toBe(`H${level}`);
  });

  it('decouples visual size from level', () => {
    render(<Heading level={2} size="sm">Small h2</Heading>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('size-sm');
    expect(heading).not.toHaveClass('size-2xl');
  });

  it('uses the natural size for its level by default', () => {
    render(<Heading level={1}>Page</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('size-3xl');
  });

  it('passes through attributes such as id', () => {
    render(<Heading level={3} id="section-title">Section</Heading>);
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'section-title');
  });

  it('has no accessibility violations in a correct outline', async () => {
    const { container } = render(
      <main>
        <Heading level={1}>Account</Heading>
        <Heading level={2} size="sm">Profile</Heading>
        <Heading level={3}>Avatar</Heading>
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
