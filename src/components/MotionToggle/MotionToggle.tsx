import { setMotionPaused, useMotionPaused, useSystemReducesMotion } from '../../utils/motion';
import { Button, type ButtonSize, type ButtonVariant } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';

export interface MotionToggleProps {
  /** `icon`: a compact icon button (toolbars, headers). `labelled`: icon and text (menus, settings). */
  variant?: 'icon' | 'labelled';
  size?: ButtonSize;
  buttonVariant?: ButtonVariant;
  className?: string;
}

const PauseIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
    <rect x="5" y="4" width="3.5" height="12" rx="1" />
    <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
    <path d="M6 4.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 6 4.5Z" />
  </svg>
);

const SYSTEM_NOTE = 'Motion is reduced by your system settings';

/**
 * Pauses every animation on the site (WCAG 2.2.2), persisted across visits.
 *
 * The name stays "Pause animations" and `aria-pressed` carries the state, so what a screen reader
 * hears always matches the screen. When the system already reduces motion it shows as pressed and
 * can't be turned off; it stays focusable (`aria-disabled`, not `disabled`) so keyboard users can
 * reach the explanation, which is also its description.
 *
 * Adapted from Portfolio2k26's MotionToggle.
 */
export function MotionToggle({ variant = 'icon', size, buttonVariant, className }: MotionToggleProps) {
  const paused = useMotionPaused();
  const system = useSystemReducesMotion();
  const pressed = paused || system;
  const icon = pressed ? <PlayIcon /> : <PauseIcon />;

  const shared = {
    'aria-pressed': pressed,
    'aria-disabled': system || undefined,
    onClick: () => {
      if (!system) setMotionPaused(!paused);
    },
    size,
    className,
  };

  const button =
    variant === 'labelled' ? (
      <Button {...shared} variant={buttonVariant ?? 'secondary'} startIcon={icon}>
        Pause animations
      </Button>
    ) : (
      <IconButton
        {...shared}
        variant={buttonVariant ?? 'ghost'}
        label="Pause animations"
        icon={icon}
        // With a system note the tooltip below explains instead.
        tooltip={!system}
      />
    );

  return system ? (
    <Tooltip content={SYSTEM_NOTE}>
      {button}
    </Tooltip>
  ) : (
    button
  );
}
