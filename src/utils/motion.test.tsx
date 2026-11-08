import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { mockSystemReducedMotion } from '../test/matchMedia';
import {
  MOTION_STORAGE_KEY,
  isMotionPaused,
  lessMotion,
  motionPauseScript,
  setMotionPaused,
  useLessMotion,
  useMotionPaused,
  useSystemReducesMotion,
} from './motion';

afterEach(() => {
  setMotionPaused(false);
  localStorage.clear();
  // @ts-expect-error restore jsdom's (absent) matchMedia
  delete window.matchMedia;
});

function Probe() {
  return <output>{useLessMotion() ? 'still' : 'moving'}</output>;
}

function Triggers() {
  return (
    <>
      <output aria-label="paused">{String(useMotionPaused())}</output>
      <output aria-label="system">{String(useSystemReducesMotion())}</output>
    </>
  );
}

describe('motion', () => {
  it('pauses via the data-motion attribute and remembers the choice', () => {
    setMotionPaused(true);
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused');
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBe('1');
    expect(isMotionPaused()).toBe(true);

    setMotionPaused(false);
    expect(document.documentElement).not.toHaveAttribute('data-motion');
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBeNull();
  });

  it('treats the system setting and the pause switch alike', () => {
    const setSystem = mockSystemReducedMotion(false);
    expect(lessMotion()).toBe(false);
    setSystem(true);
    expect(lessMotion()).toBe(true);
    setSystem(false);
    setMotionPaused(true);
    expect(lessMotion()).toBe(true);
  });

  it('re-renders subscribers when either trigger changes', () => {
    const setSystem = mockSystemReducedMotion(false);
    render(<Probe />);
    expect(screen.getByRole('status')).toHaveTextContent('moving');
    act(() => setMotionPaused(true));
    expect(screen.getByRole('status')).toHaveTextContent('still');
    act(() => setMotionPaused(false));
    act(() => setSystem(true));
    expect(screen.getByRole('status')).toHaveTextContent('still');
  });

  it('reports each trigger on its own', () => {
    const setSystem = mockSystemReducedMotion(false);
    render(<Triggers />);
    expect(screen.getByRole('status', { name: 'paused' })).toHaveTextContent('false');
    expect(screen.getByRole('status', { name: 'system' })).toHaveTextContent('false');

    act(() => setMotionPaused(true));
    expect(screen.getByRole('status', { name: 'paused' })).toHaveTextContent('true');
    expect(screen.getByRole('status', { name: 'system' })).toHaveTextContent('false');

    act(() => setMotionPaused(false));
    act(() => setSystem(true));
    expect(screen.getByRole('status', { name: 'paused' })).toHaveTextContent('false');
    expect(screen.getByRole('status', { name: 'system' })).toHaveTextContent('true');
  });

  it('renders full motion on the server, whatever the settings', () => {
    mockSystemReducedMotion(true);
    setMotionPaused(true);
    const html = renderToString(
      <>
        <Probe />
        <Triggers />
      </>,
    );
    expect(html).toContain('moving');
    expect(html).not.toContain('still');
    expect(html).not.toContain('true');
  });

  it('ships a pre-paint script that restores a saved pause', () => {
    localStorage.setItem(MOTION_STORAGE_KEY, '1');
    new Function(motionPauseScript)();
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused');
  });
});
