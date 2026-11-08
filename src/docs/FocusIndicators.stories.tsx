import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Accordion, AccordionItem } from '../components/Accordion/Accordion';
import { Alert } from '../components/Alert/Alert';
import { AvatarGroup } from '../components/AvatarGroup/AvatarGroup';
import { Avatar } from '../components/Avatar/Avatar';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { Button, LinkButton } from '../components/Button/Button';
import { ButtonGroup } from '../components/ButtonGroup/ButtonGroup';
import { Card, CardLink } from '../components/Card/Card';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { IconButton } from '../components/IconButton/IconButton';
import { Link } from '../components/Link/Link';
import { Marquee } from '../components/Marquee/Marquee';
import { Menu, MenuItem } from '../components/Menu/Menu';
import { MotionToggle } from '../components/MotionToggle/MotionToggle';
import { Pagination } from '../components/Pagination/Pagination';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';
import { ScaleSelect } from '../components/ScaleSelect/ScaleSelect';
import { Select } from '../components/Select/Select';
import { Stack } from '../components/Stack/Stack';
import { SkipLink } from '../components/SkipLink/SkipLink';
import { Switch } from '../components/Switch/Switch';
import { DataTable } from '../components/Table/Table';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs/Tabs';
import { TextArea } from '../components/TextArea/TextArea';
import { TelephoneField } from '../components/TelephoneField/TelephoneField';
import { TextField } from '../components/TextField/TextField';
import { SettingsIcon } from './icons';

/**
 * One of every focusable control. The play function tabs through all of them and fails if any
 * focused element lacks a visible focus indicator. The test project runs it in light, dark and
 * forced-colours (Windows High Contrast) modes; in forced colours, box-shadow rings are dropped by
 * the browser, so every control must also carry an outline.
 */
function AllControls() {
  return (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <SkipLink href="#focus-indicators" />
      <Stack direction="row" gap={2} wrap>
        <Button>Button</Button>
        <LinkButton href="#focus-indicators">Link button</LinkButton>
        <IconButton label="Settings" icon={<SettingsIcon />} />
      </Stack>
      <TextField label="Text field" />
      <TextArea label="Text area" rows={2} />
      <Select label="Select" options={[{ value: 'a', label: 'Option A' }]} />
      <Select label="Searchable select" searchable options={[{ value: 'a', label: 'Option A' }]} />
      <Checkbox label="Checkbox" />
      <RadioGroup legend="Radio group" defaultValue="a" orientation="horizontal">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
      <Switch label="Switch" />
      <ButtonGroup label="Button group" defaultValue="a" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
      <Tabs defaultValue="a">
        <TabList label="Underline tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>
      <Tabs defaultValue="a">
        <TabList label="Pill tabs" variant="pill">
          <Tab value="a">Pill A</Tab>
          <Tab value="b">Pill B</Tab>
        </TabList>
        <TabPanel value="a">Pill panel A</TabPanel>
        <TabPanel value="b">Pill panel B</TabPanel>
      </Tabs>
      <Card as="article">
        <CardLink href="#focus-indicators">A card with a stretched link</CardLink>
      </Card>
      <Alert live="off" title="Dismissible alert" onDismiss={() => {}} />
      <AvatarGroup label="People" max={1} onOverflowClick={() => {}}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
      </AvatarGroup>
      <ScaleSelect
        label="Scale select"
        defaultValue="b"
        options={[
          { value: 'a', label: 'Low' },
          { value: 'b', label: 'Mid' },
          { value: 'c', label: 'High' },
        ]}
      />
      <Marquee label="Marquee">
        <span>One</span>
        <span>Two</span>
      </Marquee>
      <MotionToggle variant="labelled" />
      <TelephoneField label="Telephone field" countries={['GB', 'IE']} />
      <p style={{ margin: 0 }}>
        Text with <Link href="#focus-indicators">an inline link</Link>.
      </p>
      <Breadcrumbs items={[{ label: 'Home', href: '#focus-indicators' }, { label: 'Current page' }]} />
      <Accordion>
        <AccordionItem title="Accordion item">Panel</AccordionItem>
      </Accordion>
      <Stack direction="row" gap={2}>
        <Menu label="Menu">
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
        </Menu>
        <Menu label="More actions" iconOnly>
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
        </Menu>
      </Stack>
      <DataTable
        caption="Sortable table"
        columns={[{ key: 'name', header: 'Name', sortable: true, cell: (row: { name: string }) => row.name }]}
        rows={[{ name: 'Ada' }]}
        getRowKey={(row) => row.name}
      />
      <Pagination page={2} pageCount={3} onPageChange={() => {}} />
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Focus indicators',
  component: AllControls,
  tags: ['!autodocs'],
} satisfies Meta<typeof AllControls>;

export default meta;
type Story = StoryObj<typeof meta>;

function hasVisibleIndicator(el: Element) {
  const forced = window.matchMedia('(forced-colors: active)').matches;
  // Card links draw the ring on the card itself.
  const target = el.matches('a[href]') && el.closest('article') ? (el.closest('article') as Element) : el;
  const style = getComputedStyle(target);
  const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1;
  const outlineVisible = outline && style.outlineColor !== 'rgba(0, 0, 0, 0)' && style.outlineColor !== 'transparent';
  const shadow = style.boxShadow !== 'none';
  // Forced colours paint even transparent outlines, but drop box-shadows.
  return forced ? outline : outlineVisible || shadow;
}

/**
 * Tabs through every control and fails if any focused element has no visible indicator: an outline
 * or box-shadow ring, or in forced-colours mode an outline. It also expects more than 18 focus
 * stops, so a control that drops out of the tab order is caught.
 */
export const EveryControlShowsFocus: Story = {
  play: async ({ canvasElement }) => {
    const seen = new Set<Element>();
    const failures: string[] = [];
    for (let i = 0; i < 80; i++) {
      await userEvent.tab();
      const active = canvasElement.ownerDocument.activeElement;
      if (!active || !canvasElement.contains(active) || seen.has(active)) break;
      seen.add(active);
      // :focus-visible applies to keyboard focus; give the browser a frame to apply styles.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!hasVisibleIndicator(active)) {
        failures.push(`${active.tagName.toLowerCase()} "${active.getAttribute('aria-label') ?? active.textContent?.trim()}"`);
      }
    }
    await expect(seen.size).toBeGreaterThan(30);
    await expect(failures).toEqual([]);
  },
};
