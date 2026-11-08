import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { setMotionPaused } from '../../utils/motion';
import { Marquee } from './Marquee';

const tools = ['React', 'TypeScript', 'Unreal'];

function Strip(props: Partial<React.ComponentProps<typeof Marquee>>) {
  return (
    <Marquee label="Tools I use" {...props}>
      {tools.map((tool) => (
        <span key={tool}>{tool}</span>
      ))}
    </Marquee>
  );
}

afterEach(() => act(() => setMotionPaused(false)));

describe('Marquee', () => {
  it('exposes one labelled list; the looping copy is hidden from assistive tech', () => {
    render(<Strip />);
    const list = screen.getByRole('list', { name: 'Tools I use' });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(tools);
    expect(screen.getAllByRole('list')).toHaveLength(1);
    // Both copies are in the DOM for the seamless loop.
    expect(screen.getAllByText('React', { selector: 'span' })).toHaveLength(2);
  });

  it('hides repeated runs from assistive tech', () => {
    render(<Strip repeat={3} />);
    const list = screen.getByRole('list', { name: 'Tools I use' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('has a pause button (WCAG 2.2.2)', async () => {
    const { container } = render(<Strip />);
    const pause = screen.getByRole('button', { name: 'Pause Tools I use', pressed: false });
    await userEvent.click(pause);
    expect(screen.getByRole('button', { name: 'Play Tools I use', pressed: true })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-paused');
  });

  it('can drop its own button when a site-wide MotionToggle is present', () => {
    render(<Strip controls={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a static, focusable, scrollable strip when motion is paused', async () => {
    const user = userEvent.setup();
    const { container } = render(<Strip />);
    act(() => setMotionPaused(true));
    expect(container.firstElementChild).toHaveAttribute('data-static');
    const region = screen.getByRole('region', { name: 'Tools I use' });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await user.tab();
    expect(region).toHaveFocus();
  });

  it('passes timing and direction through', () => {
    const { container } = render(<Strip duration={20} reverse fade={0} gap="2rem" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('20s');
    expect(root.style.getPropertyValue('--marquee-fade')).toBe('0%');
    expect(root.style.getPropertyValue('--marquee-gap')).toBe('2rem');
    expect(root).toHaveAttribute('data-reverse');
  });

  it('has no accessibility violations, moving or static', async () => {
    const { container } = render(<Strip />);
    expect(await axe(container)).toHaveNoViolations();
    act(() => setMotionPaused(true));
    expect(await axe(container)).toHaveNoViolations();
  });
});
