import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './Tabs';

function Example(props: Partial<TabsProps>) {
  return (
    <Tabs defaultValue="one" {...props}>
      <TabList label="Example tabs">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three" disabled>Three</Tab>
        <Tab value="four">Four</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
      <TabPanel value="four">Panel four</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('exposes a named tablist with tabs and the selected panel', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveTextContent('Panel one');
  });

  it('only renders the selected panel', () => {
    render(<Example />);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.queryByText('Panel two')).not.toBeInTheDocument();
  });

  it('links each tab to its panel', () => {
    render(<Example />);
    const tab = screen.getByRole('tab', { name: 'One' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('switches panels on click', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));

    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
    expect(onValueChange).toHaveBeenCalledWith('two');
  });

  it('is a single tab stop: only the selected tab is focusable', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="two" />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('moves with arrow keys, wraps around and skips disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel four');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();
  });

  it('jumps to the first and last tabs with Home and End', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="two" />);
    await user.tab();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('one');
      return (
        <>
          <Example value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('tab', { name: 'Four' }));
    expect(screen.getByRole('status')).toHaveTextContent('four');
  });

  it('selects the first enabled tab when no value is given, so the list stays keyboard-reachable', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <TabList label="No default">
          <Tab value="a" disabled>A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    await user.tab();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
  });

  it('selects nothing when every tab is disabled', () => {
    render(
      <Tabs>
        <TabList label="All disabled">
          <Tab value="a" disabled>A</Tab>
          <Tab value="b" disabled>B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    for (const tab of screen.getAllByRole('tab')) expect(tab).toHaveAttribute('aria-selected', 'false');
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('leaves arrow keys alone for other controls inside the list', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one">
        <TabList label="With extra control">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <button type="button">Add tab</button>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole('button', { name: 'Add tab' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Add tab' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders icons in underline tabs hidden from assistive tech, keeping the name', () => {
    render(
      <Tabs defaultValue="inbox">
        <TabList label="Mail">
          <Tab value="inbox" icon={<svg data-testid="inbox-icon" />}>
            Inbox
          </Tab>
        </TabList>
        <TabPanel value="inbox">Messages</TabPanel>
      </Tabs>,
    );
    const icon = screen.getByTestId('inbox-icon').parentElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('icon');
    expect(screen.getByRole('tab', { name: 'Inbox' })).toBeInTheDocument();
  });

  it('handles values that are not valid in ids', () => {
    render(
      <Tabs defaultValue="a b/c">
        <TabList label="Odd values">
          <Tab value="a b/c">Odd</Tab>
        </TabList>
        <TabPanel value="a b/c">Content</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel', { name: 'Odd' })).toBeInTheDocument();
  });

  describe('pill variant', () => {
    function PillTabs(props: Partial<TabsProps> & { size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean }) {
      const { size, fullWidth, ...tabsProps } = props;
      return (
        <Tabs defaultValue="b" {...tabsProps}>
          <TabList label="Pill tabs" variant="pill" size={size} fullWidth={fullWidth}>
            <Tab value="a" icon={<svg data-testid="icon-a" />}>A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c" disabled>C</Tab>
            <Tab value="d">D</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
          <TabPanel value="c">Panel C</TabPanel>
          <TabPanel value="d">Panel D</TabPanel>
        </Tabs>
      );
    }

    it('keeps full tab semantics', () => {
      render(<PillTabs />);
      expect(screen.getByRole('tablist', { name: 'Pill tabs' })).toHaveAttribute('data-variant', 'pill');
      expect(screen.getAllByRole('tab')).toHaveLength(4);
      expect(screen.getByRole('tabpanel', { name: 'B' })).toHaveTextContent('Panel B');
    });

    it('drives the sliding thumb from the tab count and selected index', async () => {
      render(<PillTabs />);
      const list = screen.getByRole('tablist');
      expect(list.style.getPropertyValue('--segments')).toBe('4');
      expect(list.style.getPropertyValue('--selected')).toBe('1');
      expect(list).toHaveAttribute('data-has-value');

      await userEvent.click(screen.getByRole('tab', { name: 'D' }));
      expect(list.style.getPropertyValue('--selected')).toBe('3');
    });

    it('moves with the keyboard, skipping disabled tabs', async () => {
      const user = userEvent.setup();
      render(<PillTabs />);
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'D' })).toHaveFocus();
      expect(screen.getByRole('tablist').style.getPropertyValue('--selected')).toBe('3');
    });

    it('renders tab icons hidden from assistive tech, keeping the name', () => {
      render(<PillTabs />);
      expect(screen.getByTestId('icon-a').parentElement).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('tab', { name: 'A' })).toBeInTheDocument();
    });

    it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
      render(<PillTabs size={size} />);
      expect(screen.getByRole('tablist')).toHaveClass(size);
    });

    it('can stretch to full width', () => {
      render(<PillTabs fullWidth />);
      expect(screen.getByRole('tablist')).toHaveClass('fullWidth');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<PillTabs />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('throws a helpful error outside <Tabs>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Tab value="x">X</Tab>)).toThrow('<Tab> must be used inside <Tabs>.');
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
