import { isValidElement, type ReactNode } from 'react';

/** Best-effort plain text of a React node, used for typeahead, search and form option labels. */
export function textFromNode(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
  return '';
}
