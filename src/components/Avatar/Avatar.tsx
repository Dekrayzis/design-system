import { useState } from 'react';
import { cx } from '../../utils/cx';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/** Colours for initials avatars. `auto` picks one from the name, so a person keeps their colour. */
export type AvatarColor = 'auto' | 'accent' | 'blue' | 'green' | 'amber' | 'red' | 'neutral';

const AUTO_COLORS = ['accent', 'blue', 'green', 'amber', 'red', 'neutral'] as const;

export interface AvatarProps {
  /** The person or entity's name. Used for alt text and initials. */
  name: string;
  src?: string;
  size?: AvatarSize;
  /** Background for the initials fallback. Defaults to `auto`. */
  color?: AvatarColor;
  /**
   * Set when the name is already shown next to the avatar, so screen readers
   * don't hear it twice.
   */
  decorative?: boolean;
  className?: string;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  // The first word, plus the last when there is more than one.
  const ends = [...parts.slice(0, 1), ...parts.slice(1).slice(-1)];
  return ends.map((part) => part.charAt(0)).join('').toUpperCase();
}

/** Stable colour for a name (a small string hash), so the same person always looks the same. */
export function colorForName(name: string): Exclude<AvatarColor, 'auto'> {
  let hash = 0;
  for (const char of name.trim().toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  // The modulo keeps the index in range.
  return AUTO_COLORS[Math.abs(hash) % AUTO_COLORS.length]!;
}

/** A picture of a person, falling back to their initials when there's no image or it fails to load. */
export function Avatar({ name, src, size = 'md', color = 'auto', decorative = false, className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src && failedSrc !== src;
  const tone = color === 'auto' ? colorForName(name) : color;
  const classes = cx(styles.avatar, styles[size], !showImage && styles[`color-${tone}`], className);

  if (showImage) {
    return (
      <img
        className={classes}
        src={src}
        alt={decorative ? '' : name}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <span
      className={classes}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </span>
  );
}
