/**
 * Validation behaviour shared by every form control: when errors appear, how they clear,
 * submission blocking, focus on submit, custom rules and messages, and reset.
 */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../components/Checkbox/Checkbox';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';
import { Select } from '../components/Select/Select';
import { Switch } from '../components/Switch/Switch';
import { TextArea } from '../components/TextArea/TextArea';
import { TextField } from '../components/TextField/TextField';
import { axe } from './axe';

function submitForm(onSubmit: () => void = vi.fn()) {
  return {
    onSubmit,
    props: {
      'aria-label': 'test form',
      onSubmit: (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit();
      },
    },
  };
}

describe('TextField validation', () => {
  it('shows nothing until the field is left, then shows the native message', async () => {
    const user = userEvent.setup();
    render(<TextField label="Name" required validationMessages={{ valueMissing: 'Enter your name.' }} />);
    const input = screen.getByRole('textbox', { name: /name/i });
    expect(input).not.toHaveAttribute('aria-invalid');

    await user.click(input);
    expect(input).not.toHaveAttribute('aria-invalid');
    await user.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter your name.');
  });

  it('clears the error as soon as the value is fixed', async () => {
    const user = userEvent.setup();
    render(<TextField label="Email" type="email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'nope');
    await user.tab();
    expect(input).toBeInvalid();

    await user.click(input);
    await user.type(input, '@example.com');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('runs a custom rule and lets an explicit error prop win', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TextField label="Code" validate={(v) => (v.startsWith('X') ? null : 'Codes start with X.')} />,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');
    await user.tab();
    expect(input).toHaveAccessibleDescription('Codes start with X.');

    rerender(<TextField label="Code" error="Server says no." validate={() => 'ignored'} />);
    expect(input).toHaveAccessibleDescription('Server says no.');
  });

  it('validates on every change with validateOn="change"', async () => {
    render(<TextField label="Pin" pattern="\d{4}" validateOn="change" validationMessages={{ patternMismatch: 'Four digits.' }} />);
    await userEvent.type(screen.getByRole('textbox'), 'a');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Four digits.');
  });

  it('waits for submit with validateOn="submit"', async () => {
    const user = userEvent.setup();
    const { props } = submitForm();
    render(
      <form {...props}>
        <TextField label="Name" required validateOn="submit" />
        <button type="submit">Go</button>
      </form>,
    );
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('blocks submission, shows every error and focuses the first invalid field', async () => {
    const { onSubmit, props } = submitForm();
    render(
      <form {...props}>
        <TextField label="First" required />
        <TextField label="Second" required validate={() => 'Always wrong.'} />
        <button type="submit">Send</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /first/i })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox', { name: /second/i })).toHaveAccessibleDescription(/.+/);
    expect(screen.getByRole('textbox', { name: /first/i })).toHaveFocus();
  });

  it('submits once everything is valid, including cross-field rules', async () => {
    const { onSubmit, props } = submitForm();
    function Passwords() {
      const [password, setPassword] = useState('');
      return (
        <form {...props}>
          <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField label="Confirm" validate={(v) => (v === password ? null : 'Passwords don’t match.')} />
          <button type="submit">Save</button>
        </form>
      );
    }
    render(<Passwords />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Password' }), 'ab');
    await userEvent.type(screen.getByRole('textbox', { name: 'Confirm' }), 'abd');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Confirm' })).toHaveAccessibleDescription('Passwords don’t match.');

    await userEvent.type(screen.getByRole('textbox', { name: 'Password' }), 'd');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('clears errors on form reset', async () => {
    render(
      <form aria-label="f">
        <TextField label="Name" required />
        <button type="submit">Go</button>
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('keeps the caller’s own blur, change and invalid handlers', async () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    const onInvalid = vi.fn();
    render(
      <form aria-label="f">
        <TextField label="Name" required onBlur={onBlur} onChange={onChange} onInvalid={onInvalid} />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.type(screen.getByRole('textbox'), 'a');
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
  });

  it.each([
    ['url', {}, 'nope', 'Enter a valid URL.'],
    ['text', { pattern: '\\d{4}' }, 'abc', 'Match the requested format.'],
    ['number', { min: 5 }, '2', 'Enter 5 or more.'],
    ['number', { max: 5 }, '9', 'Enter 5 or less.'],
    ['number', { step: 2 }, '3', 'Enter a valid value.'],
  ] as const)('explains a %s constraint %j in plain words when the browser gives no message', async (type, constraint, typed, message) => {
    const user = userEvent.setup();
    render(<TextField label="Value" type={type} {...constraint} />);
    const input = screen.getByLabelText('Value');
    await user.type(input, typed);
    await user.tab();
    expect(input).toHaveAccessibleDescription(message);
  });

  it.each([
    ['tooShort', { minLength: 8 }, 'Use at least 8 characters.'],
    ['tooLong', { maxLength: 3 }, 'Use no more than 3 characters.'],
  ] as const)('explains %s using the length limit', async (flag, limit, message) => {
    const user = userEvent.setup();
    render(<TextField label="Code" {...limit} />);
    const input = screen.getByRole('textbox');
    // jsdom never reports length constraints (browsers only do after a user edit), so simulate one.
    Object.defineProperty(input, 'validity', { value: { valid: false, [flag]: true } as unknown as ValidityState });
    await user.click(input);
    await user.tab();
    expect(input).toHaveAccessibleDescription(message);
  });

  it('shows the browser’s own message when it has a specific one', async () => {
    const user = userEvent.setup();
    render(<TextField label="Name" required />);
    const input = screen.getByRole('textbox');
    Object.defineProperty(input, 'validationMessage', { value: 'Please fill in this field.' });
    await user.click(input);
    await user.tab();
    expect(input).toHaveAccessibleDescription('Please fill in this field.');
  });

  it('falls back to the customError message on a read-only field, which the browser gives no message', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TextField label="Code" readOnly defaultValue="abc" validate={() => 'Taken.'} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();
    expect(input).toHaveAccessibleDescription('Enter a valid value.');

    rerender(
      <TextField
        label="Code"
        readOnly
        defaultValue="abc"
        validate={() => 'Taken.'}
        validationMessages={{ customError: 'This code is taken.' }}
      />,
    );
    await user.click(input);
    await user.tab();
    expect(input).toHaveAccessibleDescription('This code is taken.');
  });

  it('shows the error and takes focus when checked outside a form', () => {
    render(<TextField label="Name" required />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      input.reportValidity();
    });
    expect(input).toHaveAccessibleDescription('This field is required.');
    expect(input).toHaveFocus();
  });

  it('has no accessibility violations in the error state', async () => {
    const { container } = render(<TextField label="Name" required />);
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.tab();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TextArea validation', () => {
  it('validates required and custom rules', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Notes" required validate={(v) => (v.includes('http') ? 'No links.' : null)} />);
    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.tab();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    // Typing fixes "required", so the error clears straight away...
    await user.type(textarea, 'see http://x');
    expect(textarea).not.toHaveAttribute('aria-invalid');
    // ...and a new problem waits until the field is left again.
    await user.tab();
    expect(textarea).toHaveAccessibleDescription('No links.');

    // Once showing, the error updates live and clears as soon as it's fixed.
    await user.clear(textarea);
    await user.type(textarea, 'fine');
    expect(textarea).not.toHaveAttribute('aria-invalid');
  });
});

describe('Checkbox validation', () => {
  it('requires a lone checkbox to be checked', async () => {
    const { onSubmit, props } = submitForm();
    render(
      <form {...props}>
        <Checkbox label="Accept" name="accept" required validationMessages={{ valueMissing: 'Please accept.' }} />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    const checkbox = screen.getByRole('checkbox');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(checkbox).toHaveAccessibleDescription('Please accept.');
    expect(checkbox).toHaveFocus();

    await userEvent.click(checkbox);
    expect(checkbox).not.toHaveAttribute('aria-invalid');
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('CheckboxGroup validation', () => {
  function Group(props: { onSubmit?: () => void }) {
    const { props: formProps } = submitForm(props.onSubmit);
    return (
      <form {...formProps}>
        <CheckboxGroup
          legend="Days"
          name="days"
          required
          validate={(v) => (v.length > 2 ? 'Pick at most two.' : null)}
        >
          <Checkbox value="mon" label="Mon" />
          <Checkbox value="tue" label="Tue" />
          <Checkbox value="wed" label="Wed" />
        </CheckboxGroup>
        <button type="submit">Go</button>
      </form>
    );
  }

  it('requires at least one, blocks submit and focuses the first box', async () => {
    const onSubmit = vi.fn();
    render(<Group onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Select at least one option.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Mon' })).toHaveFocus();
    for (const box of screen.getAllByRole('checkbox')) expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears as soon as one is checked, and applies the custom rule', async () => {
    const onSubmit = vi.fn();
    render(<Group onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tue' }));
    expect(screen.queryByText('Select at least one option.')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Mon' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Wed' }));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Pick at most two.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Wed' }));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('validates when focus leaves the group, not while moving inside it', async () => {
    const user = userEvent.setup();
    render(<Group />);
    await user.tab();
    await user.tab();
    expect(screen.queryByText('Select at least one option.')).not.toBeInTheDocument();
    await user.tab();
    await user.tab();
    expect(screen.getByText('Select at least one option.')).toBeInTheDocument();
  });

  it('waits for submit with validateOn="submit"', async () => {
    const user = userEvent.setup();
    const { props } = submitForm();
    render(
      <form {...props}>
        <CheckboxGroup legend="Days" name="days" required validateOn="submit">
          <Checkbox value="mon" label="Mon" />
        </CheckboxGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Go' })).toHaveFocus();
    expect(screen.queryByText('Select at least one option.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByText('Select at least one option.')).toBeInTheDocument();
  });

  it('leaves other fields inside the group to report their own errors', async () => {
    const { onSubmit, props } = submitForm();
    render(
      <form {...props}>
        <CheckboxGroup legend="Days" name="days">
          <Checkbox value="other" label="Other" />
          <TextField label="Which day?" required />
        </CheckboxGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /which day/i })).toHaveAccessibleDescription('This field is required.');
    expect(screen.getByRole('checkbox', { name: 'Other' })).not.toHaveAttribute('aria-invalid');
  });

  it('drops its error once disabled, since disabled boxes are not validated', async () => {
    function Locking() {
      const [value, setValue] = useState(['wed']);
      const [disabled, setDisabled] = useState(false);
      const { props: formProps } = submitForm();
      return (
        <form {...formProps}>
          <CheckboxGroup
            legend="Days"
            name="days"
            value={value}
            onValueChange={setValue}
            disabled={disabled}
            validate={(v) => (v.includes('wed') ? 'No Wednesdays.' : null)}
          >
            <Checkbox value="mon" label="Mon" />
            <Checkbox value="wed" label="Wed" />
          </CheckboxGroup>
          <button type="submit">Go</button>
          <button
            type="button"
            onClick={() => {
              setDisabled(true);
              setValue(['mon', 'wed']);
            }}
          >
            Lock
          </button>
        </form>
      );
    }
    render(<Locking />);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByText('No Wednesdays.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Lock' }));
    expect(screen.queryByText('No Wednesdays.')).not.toBeInTheDocument();
    for (const box of screen.getAllByRole('checkbox')) expect(box).not.toHaveAttribute('aria-invalid');
  });
});

describe('RadioGroup validation', () => {
  it('shows the required message inline and clears on choice', async () => {
    const onSubmit = vi.fn();
    const { props } = submitForm(onSubmit);
    render(
      <form {...props}>
        <RadioGroup legend="Plan" name="plan" required validationMessages={{ valueMissing: 'Choose a plan.' }}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('Choose a plan.');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();

    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.queryByText('Choose a plan.')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('asks to select an option when no message is given', async () => {
    const { props } = submitForm();
    render(
      <form {...props}>
        <RadioGroup legend="Plan" name="plan" required>
          <Radio value="free" label="Free" />
        </RadioGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('Select an option.');
  });

  it('runs a custom rule on the chosen value', async () => {
    const onSubmit = vi.fn();
    const { props } = submitForm(onSubmit);
    render(
      <form {...props}>
        <RadioGroup legend="Speed" name="speed" validate={(v) => (v === 'fast' ? 'Sold out.' : null)}>
          <Radio value="slow" label="Slow" />
          <Radio value="fast" label="Fast" />
        </RadioGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Fast' }));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Sold out.')).toBeInTheDocument();
  });
});

describe('Switch validation', () => {
  it('requires a required switch to be on', async () => {
    const onSubmit = vi.fn();
    const { props } = submitForm(onSubmit);
    render(
      <form {...props}>
        <Switch label="Consent" name="consent" required />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Turn this on to continue.');
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Select validation', () => {
  it('validates when focus leaves the select and clears on selection', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select
          label="Plan"
          required
          validationMessages={{ valueMissing: 'Choose a plan.' }}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
          ]}
        />
        <button type="button">Next</button>
      </>,
    );
    const trigger = screen.getByRole('combobox', { name: /plan/i });
    await user.tab();
    await user.tab();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Choose a plan.');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Pro' }));
    expect(trigger).not.toHaveAttribute('aria-invalid');
  });

  it('runs a custom rule on multiple values and blocks submission', async () => {
    const onSubmit = vi.fn();
    const { props } = submitForm(onSubmit);
    render(
      <form {...props}>
        <Select
          label="Tags"
          name="tags"
          multiple
          defaultValue={['a', 'b', 'c']}
          validate={(v) => (Array.isArray(v) && v.length > 2 ? 'At most two tags.' : null)}
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]}
        />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
    const trigger = screen.getByRole('combobox', { name: 'Tags' });
    expect(trigger).toHaveAccessibleDescription('At most two tags.');
    expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'C' }));
    expect(trigger).not.toHaveAttribute('aria-invalid');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
