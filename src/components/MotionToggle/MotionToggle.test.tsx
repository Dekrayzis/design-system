import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { mockSystemReducedMotion } from '../../test/matchMedia';
import { MOTION_STORAGE_KEY, isMotionPaused, setMotionPaused } from '../../utils/motion';
import { MotionToggle } from './MotionToggle';

afterEach(() => {
  setMotionPaused(false);
  localStorage.clear();
  // @ts-expect-error restore jsdom's (absent) matchMedia
  delete window.matchMedia;
});

describe('MotionToggle', () => {
  it('is a toggle button named "Pause animations"', async () => {
    render(<MotionToggle />);
    const button = screen.getByRole('button', { name: 'Pause animations' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(isMotionPaused()).toBe(true);
    // The name never changes, only the pressed state.
    expect(screen.getByRole('button', { name: 'Pause animations' })).toBe(button);
  });

  it('turns motion back on when pressed again, and forgets the saved choice', async () => {
    const user = userEvent.setup();
    render(<MotionToggle />);
    const button = screen.getByRole('button', { name: 'Pause animations' });
    await user.click(button);
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBe('1');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(isMotionPaused()).toBe(false);
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBeNull();
  });

  it('works from the keyboard', async () => {
    const user = userEvent.setup();
    render(<MotionToggle />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Pause animations' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(isMotionPaused()).toBe(true);
    await user.keyboard(' ');
    expect(isMotionPaused()).toBe(false);
  });

  it('reflects a pause set elsewhere, such as another toggle on the page', () => {
    render(<MotionToggle />);
    act(() => setMotionPaused(true));
    expect(screen.getByRole('button', { name: 'Pause animations' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has a labelled variant', () => {
    render(<MotionToggle variant="labelled" />);
    expect(screen.getByRole('button', { name: 'Pause animations' })).toHaveTextContent('Pause animations');
  });

  it('shows as pressed and explains itself, but stays focusable, when the system reduces motion', async () => {
    mockSystemReducedMotion(true);
    const user = userEvent.setup();
    render(<MotionToggle />);
    const button = screen.getByRole('button', { name: 'Pause animations' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAccessibleDescription('Motion is reduced by your system settings');

    await user.tab();
    expect(button).toHaveFocus();
    await user.click(button);
    expect(isMotionPaused()).toBe(false);
  });

  it('updates when the system setting changes while the page is open', () => {
    const setSystem = mockSystemReducedMotion(false);
    render(<MotionToggle />);
    const button = screen.getByRole('button', { name: 'Pause animations' });
    expect(button).not.toHaveAttribute('aria-disabled');
    act(() => setSystem(true));
    expect(screen.getByRole('button', { name: 'Pause animations' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MotionToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations when the system reduces motion', async () => {
    mockSystemReducedMotion(true);
    const { container } = render(<MotionToggle variant="labelled" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
