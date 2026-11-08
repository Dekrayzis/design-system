import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Avatar, getInitials } from './Avatar';

describe('getInitials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['grace brewster murray hopper', 'GH'],
    ['Cher', 'C'],
    ['  spaced   out  ', 'SO'],
    ['', '?'],
  ])('%j → %s', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});

describe('Avatar', () => {
  it('renders the image with the name as alt text', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', '/ada.png');
  });

  it('falls back to initials, still named, when there is no image', () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(avatar.tagName).toBe('SPAN');
    expect(avatar).toHaveTextContent('AL');
  });

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar name="Ada Lovelace" src="/broken.png" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('tries again when given a new src after a failure', () => {
    const { rerender } = render(<Avatar name="Ada" src="/broken.png" />);
    fireEvent.error(screen.getByRole('img'));
    rerender(<Avatar name="Ada" src="/fixed.png" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/fixed.png');
  });

  it('is hidden from assistive tech when decorative', () => {
    const { container, rerender } = render(<Avatar name="Ada" decorative />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    rerender(<Avatar name="Ada" src="/ada.png" decorative />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Avatar name="Ada Lovelace" src="/ada.png" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Decorative" decorative />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
