import { render, renderHook, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Field, FieldError, useFieldIds } from './Field';

/** A minimal control wired up the way TextField, TextArea and Select use Field. */
function Example({ hint, error, required }: { hint?: string; error?: string; required?: boolean }) {
  const { controlId, hintId, describedBy } = useFieldIds('email', hint, error);
  return (
    <Field label="Email" hint={hint} error={error} controlId={controlId} hintId={hintId} required={required}>
      <input id={controlId} aria-describedby={describedBy} aria-invalid={error ? true : undefined} required={required} />
    </Field>
  );
}

describe('Field', () => {
  it('labels its control', () => {
    render(<Example />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('describes the control with its hint', () => {
    render(<Example hint="We never share it." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.');
  });

  it('describes the control with hint and error together, and marks it invalid', () => {
    render(<Example hint="We never share it." error="Enter a valid email address." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email address.');
    expect(input).toBeInvalid();
  });

  it('shows a required marker that screen readers skip, leaving "required" to the control', () => {
    render(<Example required />);
    expect(screen.getByText('*', { exact: false })).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
  });

  it('can hide the label visually while keeping the accessible name', () => {
    render(
      <Field label="Search" hideLabel controlId="q">
        <input id="q" />
      </Field>,
    );
    expect(screen.getByText('Search')).toHaveClass('hiddenLabel');
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('keeps an empty live region in place before any error, so a later error is announced', () => {
    const { container, rerender } = render(<Example />);
    const region = container.querySelector('#email-error');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();

    rerender(<Example error="Enter your email address." />);
    // Same element, now filled: assistive tech hears the change.
    expect(container.querySelector('#email-error')).toBe(region);
    expect(region).toHaveTextContent('Enter your email address.');
  });

  it('has no accessibility violations, with or without an error', async () => {
    const { container, rerender } = render(<Example hint="We never share it." required />);
    expect(await axe(container)).toHaveNoViolations();
    rerender(<Example hint="We never share it." error="Enter your email address." required />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('FieldError', () => {
  it('is a polite live region that renders even when empty', () => {
    const { container } = render(<FieldError id="e" />);
    const region = container.querySelector('#e');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();
  });
});

describe('useFieldIds', () => {
  it('uses the given id and only describes with what exists', () => {
    expect(renderHook(() => useFieldIds('name', undefined, undefined)).result.current).toEqual({
      controlId: 'name',
      hintId: undefined,
      errorId: undefined,
      describedBy: undefined,
    });
    expect(renderHook(() => useFieldIds('name', 'Hint', undefined)).result.current.describedBy).toBe('name-hint');
    expect(renderHook(() => useFieldIds('name', undefined, 'Error')).result.current.describedBy).toBe('name-error');
    expect(renderHook(() => useFieldIds('name', 'Hint', 'Error')).result.current.describedBy).toBe('name-hint name-error');
  });

  it('generates a unique id when none is given', () => {
    const a = renderHook(() => useFieldIds(undefined, undefined, undefined)).result.current.controlId;
    const b = renderHook(() => useFieldIds(undefined, undefined, undefined)).result.current.controlId;
    expect(a).toMatch(/^ds-field-/);
    expect(a).not.toBe(b);
  });
});
