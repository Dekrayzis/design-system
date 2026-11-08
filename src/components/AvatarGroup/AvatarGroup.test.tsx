import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Avatar, colorForName } from '../Avatar/Avatar';
import { AvatarGroup } from './AvatarGroup';

const names = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Radia Perlman'];
const team = names.map((name) => <Avatar key={name} name={name} />);

describe('AvatarGroup', () => {
  it('is a labelled list with one item per person, each named', () => {
    render(<AvatarGroup label="Project members">{team}</AvatarGroup>);
    const list = screen.getByRole('list', { name: 'Project members' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
    for (const name of names) expect(screen.getByRole('img', { name })).toBeInTheDocument();
  });

  it('collapses people beyond `max` into a +N item that names them', () => {
    render(
      <AvatarGroup label="Members" max={3}>
        {team}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('And 2 more: Katherine Johnson, Radia Perlman')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('shows no overflow when everyone fits', () => {
    render(
      <AvatarGroup label="Members" max={10}>
        {team}
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it('counts against a known total when only some people are loaded', () => {
    render(
      <AvatarGroup label="Members" total={128}>
        {team.slice(0, 3)}
      </AvatarGroup>,
    );
    expect(screen.getByText('+125')).toBeInTheDocument();
    expect(screen.getByText('And 125 more')).toBeInTheDocument();
  });

  it('mentions unloaded people when combining max and total', () => {
    render(
      <AvatarGroup label="Members" max={3} total={20}>
        {team}
      </AvatarGroup>,
    );
    expect(screen.getByText('+17')).toBeInTheDocument();
    expect(screen.getByText('And 17 more: Katherine Johnson, Radia Perlman and others')).toBeInTheDocument();
  });

  it('makes the overflow a named button when onOverflowClick is set', async () => {
    const onOverflowClick = vi.fn();
    render(
      <AvatarGroup label="Members" max={3} onOverflowClick={onOverflowClick}>
        {team}
      </AvatarGroup>,
    );
    const button = screen.getByRole('button', { name: 'Show 2 more: Katherine Johnson, Radia Perlman' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onOverflowClick).toHaveBeenCalledTimes(1);
  });

  it('applies one size to every avatar and shows names as tooltips', async () => {
    render(
      <AvatarGroup label="Members" size="lg">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Alan Turing" />
      </AvatarGroup>,
    );
    for (const avatar of screen.getAllByRole('img')) expect(avatar).toHaveClass('lg');
    await userEvent.hover(screen.getByRole('img', { name: 'Ada Lovelace' }));
    // Hover tooltips wait a short delay before appearing.
    await waitFor(() => expect(screen.getByText('Ada Lovelace', { selector: '[popover]' })).toBeVisible());
  });

  it.each(['tight', 'normal', 'loose'] as const)('applies %s spacing', (spacing) => {
    render(
      <AvatarGroup label="Members" spacing={spacing}>
        {team}
      </AvatarGroup>,
    );
    expect(screen.getByRole('list')).toHaveClass(spacing);
  });

  it('ignores non-element children', () => {
    render(
      <AvatarGroup label="Members">
        {team[0]}
        {null}
        {false}
        {team[1]}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('has no accessibility violations, with and without a clickable overflow', async () => {
    const { container, rerender } = render(
      <AvatarGroup label="Members" max={3}>
        {team}
      </AvatarGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
    rerender(
      <AvatarGroup label="Members" max={3} onOverflowClick={() => {}}>
        {team}
      </AvatarGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar colours', () => {
  it('gives the same name the same colour every time', () => {
    expect(colorForName('Ada Lovelace')).toBe(colorForName('ada lovelace '));
  });

  it('spreads different names across several colours', () => {
    const colors = new Set(names.concat(['Barbara Liskov', 'Tim Berners-Lee', 'Linus Torvalds']).map(colorForName));
    expect(colors.size).toBeGreaterThan(2);
  });

  it('uses an explicit colour when given, and none for images', () => {
    const { rerender } = render(<Avatar name="Ada" color="green" />);
    expect(screen.getByRole('img')).toHaveClass('color-green');
    rerender(<Avatar name="Ada" src="/ada.png" color="green" />);
    expect(screen.getByRole('img')).not.toHaveClass('color-green');
  });
});
