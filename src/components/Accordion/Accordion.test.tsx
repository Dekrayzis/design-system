import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { Accordion, AccordionItem, type AccordionProps } from './Accordion';

const summary = (name: string) => screen.getByText(name).closest('summary') as HTMLElement;
const details = (name: string) => screen.getByText(name).closest('details') as HTMLDetailsElement;

function Faq(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      <AccordionItem title="Shipping">Ships in two days.</AccordionItem>
      <AccordionItem title="Returns" defaultOpen>
        Free for 30 days.
      </AccordionItem>
      <AccordionItem value="warranty" title="Warranty">
        Two years.
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  describe('structure', () => {
    it('renders native details with a heading inside each summary', () => {
      render(<Faq />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.map((h) => h.textContent)).toEqual(['Shipping', 'Returns', 'Warranty']);
      expect(headings[0]!.parentElement!.tagName).toBe('SUMMARY');
      expect(summary('Shipping').parentElement!.tagName).toBe('DETAILS');
      expect(summary('Shipping').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('uses the headingLevel prop', () => {
      render(<Faq headingLevel={2} />);
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    });

    it('opens defaultOpen items and keeps content in the DOM while closed', () => {
      render(<Faq />);
      expect(details('Returns')).toHaveAttribute('open');
      expect(details('Shipping')).not.toHaveAttribute('open');
      // Closed content stays in the document, so find-in-page can reach it.
      expect(screen.getByText('Ships in two days.')).toBeInTheDocument();
      expect(screen.getByText('Ships in two days.')).not.toBeVisible();
      expect(screen.getByText('Free for 30 days.')).toBeVisible();
    });

    it('renders the items shorthand before children, with values and defaults', () => {
      const onOpenChange = vi.fn();
      render(
        <Accordion
          onOpenChange={onOpenChange}
          items={[
            { title: 'One', content: 'First' },
            { title: 'Four', content: 'Fourth', defaultOpen: true },
            { value: 'two', title: 'Two', content: 'Second', defaultOpen: true },
          ]}
        >
          <AccordionItem title="Three" defaultOpen>
            Third
          </AccordionItem>
        </Accordion>,
      );
      expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual(['One', 'Four', 'Two', 'Three']);
      expect(details('Four')).toHaveAttribute('open');
      expect(details('Two')).toHaveAttribute('open');
      expect(details('Three')).toHaveAttribute('open');
      expect(details('One')).not.toHaveAttribute('open');
    });

    it('uses positions as values, children counting on after the items', async () => {
      const onOpenChange = vi.fn();
      render(
        <Accordion onOpenChange={onOpenChange} items={[{ title: 'One', content: 'First' }]}>
          <AccordionItem title="Two">Second</AccordionItem>
        </Accordion>,
      );
      await userEvent.click(summary('Two'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['1']));
      await userEvent.click(summary('One'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['1', '0']));
    });

    it('ignores non-element children when working out what starts open', () => {
      render(
        <Accordion>
          {'stray text'}
          <AccordionItem title="Only" defaultOpen>
            Body
          </AccordionItem>
        </Accordion>,
      );
      expect(details('Only')).toHaveAttribute('open');
    });

    it('throws when an item is used outside an Accordion', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<AccordionItem title="Orphan">x</AccordionItem>)).toThrow(
        '<AccordionItem> must be used inside <Accordion>.',
      );
      error.mockRestore();
    });

    it('has no axe violations', async () => {
      const { container } = render(<Faq />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('multiple (default)', () => {
    it('toggles items independently by click and reports the open values', async () => {
      const onOpenChange = vi.fn();
      render(<Faq onOpenChange={onOpenChange} />);
      expect(details('Shipping')).not.toHaveAttribute('name');

      await userEvent.click(summary('Shipping'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['1', '0']));
      expect(details('Shipping')).toHaveAttribute('open');
      expect(details('Returns')).toHaveAttribute('open');

      await userEvent.click(summary('Returns'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['0']));
      expect(details('Returns')).not.toHaveAttribute('open');

      await userEvent.click(summary('Warranty'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['0', 'warranty']));
    });

    it('works without onOpenChange', async () => {
      render(<Faq />);
      await userEvent.click(summary('Returns'));
      await waitFor(() => expect(details('Returns')).not.toHaveAttribute('open'));
    });
  });

  it('keeps every change when several toggles are handled before React re-renders', () => {
    const onOpenChange = vi.fn();
    render(<Faq onOpenChange={onOpenChange} />);
    act(() => {
      details('Shipping').open = true;
      details('Warranty').open = true;
      details('Shipping').dispatchEvent(new Event('toggle'));
      details('Warranty').dispatchEvent(new Event('toggle'));
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(['1', '0', 'warranty']);
    expect(details('Shipping')).toHaveAttribute('open');
    expect(details('Warranty')).toHaveAttribute('open');
  });

  describe('single', () => {
    it('shares a native name and closes the others when one opens', async () => {
      const onOpenChange = vi.fn();
      render(<Faq type="single" onOpenChange={onOpenChange} />);
      const name = details('Shipping').getAttribute('name');
      expect(name).toBeTruthy();
      expect(details('Warranty')).toHaveAttribute('name', name);

      await userEvent.click(summary('Warranty'));
      await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(['warranty']));
      // jsdom ignores `name`; React applies the same rule.
      await waitFor(() => expect(details('Returns')).not.toHaveAttribute('open'));
      expect(details('Warranty')).toHaveAttribute('open');
    });

    it('keeps only the first defaultOpen item open', () => {
      render(
        <Accordion type="single">
          <AccordionItem title="A" defaultOpen>
            a
          </AccordionItem>
          <AccordionItem title="B" defaultOpen>
            b
          </AccordionItem>
        </Accordion>,
      );
      expect(details('A')).toHaveAttribute('open');
      expect(details('B')).not.toHaveAttribute('open');
    });

    it('handles the browser closing the old item before opening the new one', async () => {
      const onOpenChange = vi.fn();
      render(<Faq type="single" onOpenChange={onOpenChange} />);
      // What a supporting browser does: close Returns, then open Shipping, before React re-renders.
      act(() => {
        details('Returns').open = false;
        details('Shipping').open = true;
      });
      await waitFor(() => expect(onOpenChange).toHaveBeenCalledTimes(2));
      expect(onOpenChange.mock.calls).toEqual([[[]], [['0']]]);
      expect(details('Shipping')).toHaveAttribute('open');
      expect(details('Returns')).not.toHaveAttribute('open');
    });
  });

  describe('controlled', () => {
    it('follows the open prop', () => {
      const { rerender } = render(<Faq open={['warranty']} />);
      expect(details('Warranty')).toHaveAttribute('open');
      // defaultOpen is ignored when controlled.
      expect(details('Returns')).not.toHaveAttribute('open');
      rerender(<Faq open={['0']} />);
      expect(details('Shipping')).toHaveAttribute('open');
      expect(details('Warranty')).not.toHaveAttribute('open');
    });

    it('reports changes and updates when the parent accepts them', async () => {
      function Controlled() {
        const [open, setOpen] = useState<string[]>([]);
        return <Faq open={open} onOpenChange={setOpen} />;
      }
      render(<Controlled />);
      await userEvent.click(summary('Shipping'));
      await waitFor(() => expect(details('Shipping')).toHaveAttribute('open'));
    });

    it('puts the DOM back when the parent keeps the old value', async () => {
      const onOpenChange = vi.fn();
      render(<Faq open={[]} onOpenChange={onOpenChange} />);
      await userEvent.click(summary('Shipping'));
      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(['0']));
      await waitFor(() => expect(details('Shipping')).not.toHaveAttribute('open'));
      // The revert fires its own toggle event, which changes nothing further.
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });
  });
});
