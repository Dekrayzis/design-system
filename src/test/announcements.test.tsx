/**
 * Screen reader announcements. Live regions are only announced reliably when they exist before
 * their content changes, so these tests check the region is present (and empty) up front.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { Checkbox, CheckboxGroup } from '../components/Checkbox/Checkbox';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';
import { Select } from '../components/Select/Select';
import { Switch } from '../components/Switch/Switch';
import { TextArea } from '../components/TextArea/TextArea';
import { TextField } from '../components/TextField/TextField';

describe('error messages are live regions that exist before any error', () => {
  const cases: Array<[string, React.ReactElement]> = [
    ['TextField', <TextField key="a" label="Name" required />],
    ['TextArea', <TextArea key="b" label="Notes" required />],
    ['Select', <Select key="c" label="Plan" required options={[{ value: 'a', label: 'A' }]} />],
    ['Checkbox', <Checkbox key="d" label="Accept" required />],
    ['Switch', <Switch key="e" label="Consent" required />],
    [
      'CheckboxGroup',
      <CheckboxGroup key="f" legend="Days" required>
        <Checkbox value="mon" label="Mon" />
      </CheckboxGroup>,
    ],
    [
      'RadioGroup',
      <RadioGroup key="g" legend="Plan" required>
        <Radio value="a" label="A" />
      </RadioGroup>,
    ],
  ];

  it.each(cases)('%s', async (_name, element) => {
    const { container } = render(
      <form aria-label="f">
        {element}
        <button type="submit">Go</button>
      </form>,
    );
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeInTheDocument();
    expect(live).toBeEmptyDOMElement();

    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    // The same element, now filled: this is what screen readers announce.
    expect(container.querySelector('[aria-live="polite"]')).toBe(live);
    expect(live).not.toBeEmptyDOMElement();
  });
});

describe('Alert', () => {
  it('mounts its live region before its content', () => {
    // The first commit renders the empty region; content follows after mount.
    const snapshots: string[] = [];
    function Spy() {
      return (
        <div
          ref={(el) => {
            if (el) snapshots.push(el.querySelector('[role="status"]')?.textContent ?? 'missing');
          }}
        >
          <Alert title="Saved" />
        </div>
      );
    }
    render(<Spy />);
    expect(snapshots[0]).toBe('');
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders immediately when not live', () => {
    const snapshots: string[] = [];
    render(
      <div
        ref={(el) => {
          if (el) snapshots.push(el.textContent ?? '');
        }}
      >
        <Alert title="Notice" live="off" />
      </div>,
    );
    expect(snapshots[0]).toBe('Notice');
  });
});

describe('Button loading', () => {
  function Save() {
    const [saving, setSaving] = useState(false);
    return (
      <Button loading={saving} onClick={() => setSaving(true)}>
        Save
      </Button>
    );
  }

  it('announces the loading label through a status region that exists beforehand', async () => {
    render(<Save />);
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Save');
  });

  it('uses loadingLabel when given', () => {
    render(
      <Button loading loadingLabel="Saving your changes">
        Save
      </Button>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Saving your changes');
  });

  it('adds no status region to buttons that never load', () => {
    render(<Button>Plain</Button>);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('required is exposed where the native attribute can’t be', () => {
  it('CheckboxGroup names it in the legend', () => {
    render(
      <CheckboxGroup legend="Days" required>
        <Checkbox value="mon" label="Mon" />
      </CheckboxGroup>,
    );
    // The asterisk is aria-hidden, so the name is the legend plus the hidden "(required)".
    expect(screen.getByRole('group', { name: 'Days (required)' })).toBeInTheDocument();
  });

  it('a searchable Select names it on the trigger', () => {
    render(<Select label="Country" required searchable options={[{ value: 'fr', label: 'France' }]} />);
    expect(screen.getByRole('button', { name: /Country.*\(required\)/ })).toBeInTheDocument();
  });

  it('a plain Select uses aria-required', () => {
    render(<Select label="Plan" required options={[{ value: 'a', label: 'A' }]} />);
    expect(screen.getByRole('combobox', { name: /plan/i })).toBeRequired();
  });
});
