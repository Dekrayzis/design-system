import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { LinkButton } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Accordion, AccordionItem } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    items: { control: false },
    type: { control: 'inline-radio', options: ['multiple', 'single'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A stack of collapsible sections built on native `<details>` and `<summary>`, with a heading of `headingLevel` inside each summary. It works without JavaScript, and find-in-page opens a closed section that contains a match. Use `Tabs` instead when only one panel should show at a time in the same place and the sections are peers people switch between.',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const getDetails = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByRole('heading', { name: title }).closest('details') as HTMLDetailsElement;

/** Three independent sections. Click a summary, or focus it and press Enter or Space (native `<summary>` behaviour), to open or close it; the chevron turns to match. */
export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem title="Delivery">Orders placed before 2pm leave the warehouse the same day.</AccordionItem>
      <AccordionItem title="Returns">You can return unused items within 30 days for a full refund.</AccordionItem>
      <AccordionItem title="Warranty">Every product is covered for two years against manufacturing faults.</AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const delivery = getDetails(canvasElement, 'Delivery');
    const summary = delivery.querySelector('summary') as HTMLElement;
    await userEvent.click(summary);
    await expect(delivery).toHaveAttribute('open');
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(['0']));

    // Each summary is a native, focusable toggle: Tab reaches the next one.
    await userEvent.tab();
    await expect(getDetails(canvasElement, 'Returns').querySelector('summary')).toHaveFocus();
    await expect(canvas.getByText(/same day/)).toBeVisible();
  },
};

/** `type="single"` keeps at most one section open: opening one closes the other. It uses the native `name` attribute on `<details>`, and React applies the same rule where that isn't supported. */
export const SingleOpen: Story = {
  name: 'Single open',
  args: {
    type: 'single',
    items: [
      { title: 'Personal details', content: 'Your name, email address and phone number.', defaultOpen: true },
      { title: 'Billing', content: 'Card details and billing address.' },
      { title: 'Notifications', content: 'Choose which emails we send you.' },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const personal = getDetails(canvasElement, 'Personal details');
    const billing = getDetails(canvasElement, 'Billing');
    await expect(personal).toHaveAttribute('open');
    await expect(personal.getAttribute('name')).toBe(billing.getAttribute('name'));
    await userEvent.click(billing.querySelector('summary') as HTMLElement);
    await expect(billing).toHaveAttribute('open');
    await waitFor(() => expect(personal).not.toHaveAttribute('open'));
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(['1']));
  },
};

/** `defaultOpen` on an item opens it on first render. The open state is the native `open` attribute, so it is right before any JavaScript runs. */
export const DefaultOpen: Story = {
  name: 'Open by default',
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem title="What's new" defaultOpen>
        Accordions and action menus joined the library this week.
      </AccordionItem>
      <AccordionItem title="Known issues">None reported yet.</AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    await expect(getDetails(canvasElement, "What's new")).toHaveAttribute('open');
    await expect(getDetails(canvasElement, 'Known issues')).not.toHaveAttribute('open');
  },
};

/** Sections can hold any content: paragraphs, lists and actions. Interactive content belongs in the panel, never in the summary, because the summary is itself the toggle button. */
export const RichContent: Story = {
  name: 'Rich content',
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem title="Plan features" defaultOpen>
        <p>Everything in Free, plus:</p>
        <ul>
          <li>Unlimited projects</li>
          <li>Single sign-on</li>
          <li>Priority support with a four-hour response time</li>
        </ul>
        <Stack direction="row" gap={2}>
          <LinkButton href="#upgrade" size="sm">
            Upgrade to Pro
          </LinkButton>
          <LinkButton href="#compare" size="sm" variant="secondary">
            Compare plans
          </LinkButton>
        </Stack>
      </AccordionItem>
      <AccordionItem title="Billing history">
        <p>
          Download past invoices from <a href="#billing">the billing page</a>.
        </p>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Upgrade to Pro' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'the billing page' })).not.toBeVisible();
  },
};

/** A frequently asked questions section with `headingLevel={2}`, as it would sit directly under a page's `<h1>`. Each question is a real heading, so screen reader users can jump between them with heading navigation where the browser exposes headings inside a summary. */
export const Faq: Story = {
  name: 'FAQ',
  args: {
    headingLevel: 2,
    items: [
      { title: 'Can I change my plan later?', content: 'Yes. Upgrades apply straight away and downgrades at the end of the billing period.' },
      { title: 'Do you offer refunds?', content: 'We refund any unused time if you cancel within 14 days of a payment.' },
      { title: 'Is my data exported if I leave?', content: 'You can download everything as JSON or CSV at any time, including after cancelling.' },
      { title: 'Where is my data stored?', content: 'In data centres in the UK and the EU. We never move it outside them.' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    const refunds = getDetails(canvasElement, 'Do you offer refunds?');
    await userEvent.click(refunds.querySelector('summary') as HTMLElement);
    await expect(canvas.getByText(/unused time/)).toBeVisible();
  },
};
