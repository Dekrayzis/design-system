import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

/** Applies the toolbar theme to the whole preview document, so dialogs in the top layer match too. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark' | 'system';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System', icon: 'browser' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'system',
  },
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      // Fail the a11y panel loudly rather than just listing issues.
      test: 'error',
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Guides',
          ['Getting started', 'Forms and validation', 'Writing guidelines', 'Contributing'],
          'Foundations',
          [
            'Tokens',
            'Colour',
            'Typography',
            'Spacing and layout',
            'Shape and elevation',
            'Motion',
            'Theming',
            'Accessibility',
            'Focus indicators',
          ],
          'Components',
          'Examples',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
