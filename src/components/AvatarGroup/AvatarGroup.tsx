import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { AvatarProps, AvatarSize } from '../Avatar/Avatar';
import { Tooltip } from '../Tooltip/Tooltip';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './AvatarGroup.module.css';

export interface AvatarGroupProps {
  /** Accessible name for the list, e.g. "Project members". */
  label: string;
  /** `Avatar` elements. Their `name`s are used for tooltips and the overflow summary. */
  children: ReactNode;
  /** Most avatars to show before collapsing the rest into a "+N" bubble. */
  max?: number;
  /**
   * The real number of people, when `children` is only the first few (e.g. from a paged API).
   * The overflow then reads "+(total - shown)".
   */
  total?: number;
  /** Size for every avatar in the group. */
  size?: AvatarSize;
  /** How far avatars overlap. */
  spacing?: 'tight' | 'normal' | 'loose';
  /** Makes the overflow bubble a button, e.g. to open the full member list. */
  onOverflowClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * A stack of overlapping avatars with a "+N" overflow. Rendered as a labelled list, so screen
 * readers hear "Project members, list, 5 items" and each person's name. The overflow says who is
 * hidden ("and 3 more: …"), and becomes a button when `onOverflowClick` is set.
 */
export function AvatarGroup({
  label,
  children,
  max,
  total,
  size = 'md',
  spacing = 'normal',
  onOverflowClick,
  className,
  style,
}: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(
    (child): child is ReactElement<AvatarProps> => isValidElement<AvatarProps>(child),
  );

  const limit = max !== undefined && max < avatars.length ? Math.max(max, 0) : avatars.length;
  const shown = avatars.slice(0, limit);
  const hiddenNames = avatars.slice(limit).map((avatar) => avatar.props.name);
  const overflow = Math.max((total ?? avatars.length) - shown.length, 0);

  const knownHidden = hiddenNames.length > 0 ? `: ${hiddenNames.join(', ')}` : '';
  const unknownHidden = overflow > hiddenNames.length && hiddenNames.length > 0 ? ' and others' : '';
  const overflowDescription = `${overflow} more${knownHidden}${unknownHidden}`;

  return (
    <ul aria-label={label} className={cx(styles.group, styles[size], styles[spacing], className)} style={style}>
      {shown.map((avatar) => (
        <li key={avatar.key} className={styles.item}>
          {/* Names are already in each avatar's alt text; the tooltip is for sighted hover. */}
          <Tooltip content={avatar.props.name} kind="label">
            {cloneElement(avatar, { size, className: cx(styles.avatar, avatar.props.className) })}
          </Tooltip>
        </li>
      ))}
      {overflow > 0 && (
        <li className={styles.item}>
          <Tooltip content={hiddenNames.length > 0 ? hiddenNames.join(', ') : overflowDescription} kind="label">
          {onOverflowClick ? (
            <button
              type="button"
              className={cx(styles.overflow, styles.overflowButton)}
              onClick={onOverflowClick}
              aria-label={`Show ${overflowDescription}`}
            >
              <span aria-hidden="true">+{overflow}</span>
            </button>
          ) : (
            <span className={styles.overflow}>
              <span aria-hidden="true">+{overflow}</span>
              <VisuallyHidden>And {overflowDescription}</VisuallyHidden>
            </span>
          )}
          </Tooltip>
        </li>
      )}
    </ul>
  );
}
