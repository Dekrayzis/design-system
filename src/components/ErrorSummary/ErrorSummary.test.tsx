import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { axe } from '../../test/axe';
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox';
import { Radio, RadioGroup } from '../RadioGroup/RadioGroup';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import { ErrorSummary, useErrorSummary } from './ErrorSummary';

function SignUp({ onSubmit = () => {} }: { onSubmit?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const summary = useErrorSummary(formRef);
  return (
    <>
      <ErrorSummary {...summary} />
      <form
        ref={formRef}
        aria-label="Sign up"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <TextField label="Name" name="name" required validationMessages={{ valueMissing: 'Enter your name.' }} />
        <Select
          label="Plan"
          name="plan"
          required
          validationMessages={{ valueMissing: 'Choose a plan.' }}
          options={[{ value: 'pro', label: 'Pro' }]}
        />
        <RadioGroup legend="Role" name="role" required validationMessages={{ valueMissing: 'Choose a role.' }}>
          <Radio value="a" label="Design" />
          <Radio value="b" label="Code" />
        </RadioGroup>
        <CheckboxGroup legend="Days" name="days" required>
          <Checkbox value="mon" label="Mon" />
          <Checkbox value="tue" label="Tue" />
        </CheckboxGroup>
        <button type="submit">Create</button>
        <button type="reset">Reset</button>
      </form>
    </>
  );
}

describe('ErrorSummary', () => {
  it('renders nothing until a submit is blocked', () => {
    render(<SignUp />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('lists each invalid field once, in form order, using the messages the fields show', async () => {
    render(<SignUp />);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    const alert = await screen.findByRole('alert');
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    const links = screen.getAllByRole('link').map((link) => link.textContent);
    expect(links).toEqual(['Enter your name.', 'Choose a plan.', 'Choose a role.', 'Select at least one option.']);
    expect(alert).toBeInTheDocument();
  });

  it('takes focus so screen reader users hear it', async () => {
    render(<SignUp />);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await screen.findByRole('alert');
    await waitFor(() => expect(screen.getByRole('alert').parentElement).toHaveFocus());
  });

  it('moves focus to the field when an item is chosen', async () => {
    render(<SignUp />);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await userEvent.click(await screen.findByRole('link', { name: 'Choose a plan.' }));
    expect(screen.getByRole('combobox', { name: /plan/i })).toHaveFocus();

    await userEvent.click(screen.getByRole('link', { name: 'Choose a role.' }));
    expect(screen.getByRole('radio', { name: 'Design' })).toHaveFocus();
  });

  it('clears on a successful submit and on reset', async () => {
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('skips invalid controls that show no error message', async () => {
    function Legacy() {
      const formRef = useRef<HTMLFormElement>(null);
      const summary = useErrorSummary(formRef);
      return (
        <>
          <ErrorSummary {...summary} />
          <form ref={formRef} aria-label="Legacy" onSubmit={(event) => event.preventDefault()}>
            <input id="legacy" aria-label="Legacy code" aria-invalid="true" />
            <TextField label="Name" required validationMessages={{ valueMissing: 'Enter your name.' }} />
            <button type="submit">Send</button>
          </form>
        </>
      );
    }
    render(<Legacy />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await screen.findByRole('alert');
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Enter your name.']);
  });

  it('renders nothing, without error, when its form is not rendered', () => {
    function Detached() {
      const formRef = useRef<HTMLFormElement>(null);
      const summary = useErrorSummary(formRef);
      return <ErrorSummary {...summary} />;
    }
    render(<Detached />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('leaves a link to a field that no longer exists to the browser', async () => {
    try {
      render(<ErrorSummary errors={[{ id: 'gone', message: 'Enter your name.' }]} attempt={1} />);
      await userEvent.click(screen.getByRole('link', { name: 'Enter your name.' }));
      expect(window.location.hash).toBe('#gone');
    } finally {
      window.history.replaceState(null, '', window.location.pathname);
    }
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SignUp />);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    await screen.findByRole('alert');
    expect(await axe(container)).toHaveNoViolations();
  });
});
