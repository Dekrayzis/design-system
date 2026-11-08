import { createRef, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is exposed as a switch, not a checkbox', () => {
    render(<Switch label="Wi-Fi" />);
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('turns on and off with click and Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Wi-Fi" onChange={onChange} />);
    const toggle = screen.getByRole('switch');

    await user.click(toggle);
    expect(toggle).toBeChecked();

    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('submits with its form like a checkbox', () => {
    render(
      <form aria-label="settings">
        <Switch label="Wi-Fi" name="wifi" defaultChecked />
      </form>,
    );
    const form = screen.getByRole('form', { name: 'settings' }) as HTMLFormElement;
    expect(new FormData(form).get('wifi')).toBe('on');
  });

  it('describes itself with its hint', () => {
    render(<Switch label="Digest" hint="Every Monday." />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Every Monday.');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    const { container } = render(<Switch label="Wi-Fi" size={size} />);
    expect(container.firstElementChild).toHaveClass('root', size);
  });

  it("keeps the caller's blur, change and invalid handlers", async () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    const onInvalid = vi.fn();
    render(
      <form aria-label="f">
        <Switch label="Consent" required onBlur={onBlur} onChange={onChange} onInvalid={onInvalid} />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onBlur).toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
  });

  it('forwards its ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch label="Wi-Fi" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });

  it('blocks submit when required and off, explains why and takes focus', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form aria-label="f" onSubmit={onSubmit}>
        <Switch label="Accept terms" required />
        <button type="submit">Go</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    const toggle = screen.getByRole('switch');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(toggle).toBeInvalid();
    expect(toggle).toHaveAccessibleDescription('Turn this on to continue.');
    expect(toggle).toHaveFocus();

    // Fixing it clears the error straight away.
    await user.click(toggle);
    expect(toggle).toBeValid();
    expect(toggle).not.toHaveAccessibleDescription();
  });

  it('runs a custom validate rule against the checked state', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form aria-label="f" onSubmit={onSubmit}>
        <Switch
          label="Marketing emails"
          defaultChecked
          validate={(on) => (on ? 'Marketing emails need a verified address.' : null)}
        />
        <button type="submit">Go</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    const toggle = screen.getByRole('switch');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(toggle).toHaveAccessibleDescription('Marketing emails need a verified address.');

    await user.click(toggle);
    expect(toggle).toBeValid();
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('lets an explicit error win over built-in validation', () => {
    render(<Switch label="Sync" error="Sync is unavailable on this plan." />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInvalid();
    expect(toggle).toHaveAccessibleDescription('Sync is unavailable on this plan.');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Switch label="Wi-Fi" hint="Connect automatically." />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations while showing an error', async () => {
    const { container } = render(<Switch label="Sync" hint="Across devices." error="Sync is unavailable." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
