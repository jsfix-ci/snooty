import React from 'react';
import { render } from '@testing-library/react';
import Tabs from '../../src/components/Tabs';
import { TabProvider } from '../../src/components/Tabs/tab-context';
import { theme } from '../../src/theme/docsTheme';

// data for this component
import mockDataPlatforms from './data/Tabs-platform.test.json';
import mockDataLanguages from './data/Tabs-languages.test.json';
import mockDataHidden from './data/Tabs-hidden.test.json';
import mockDataAnonymous from './data/Tabs-anonymous.test.json';
import { ThemeProvider } from '@emotion/react';

const mountTabs = ({ mockData }) => {
  return render(
    <ThemeProvider theme={theme}>
      <TabProvider>
        <Tabs nodeData={mockData} />
      </TabProvider>
    </ThemeProvider>
  );
};

describe('Tabs testing', () => {
  describe('Tab unit tests', () => {
    const mockAddTabset = jest.fn();

    it('tabs container exists with correct number of children', () => {
      const wrapper = mountTabs({
        mockData: mockDataAnonymous,
      });
      const tabCount = mockDataAnonymous.children.length;
      expect(wrapper.queryAllByRole('tablist')).toHaveLength(1);
      expect(wrapper.queryAllByRole('tab')).toHaveLength(tabCount);
    });

    it('did not call mockAddTabset for a non-guides tabset', () => {
      const wrapper = mountTabs({
        mockData: mockDataAnonymous,
      });
      expect(wrapper.queryAllByRole('tablist')).toHaveLength(1);
      expect(mockAddTabset.mock.calls.length).toBe(0);
    });

    it('active tab is set in DOM', () => {
      const wrapper = mountTabs({
        mockData: mockDataAnonymous,
      });
      expect(wrapper.queryByRole('tab', { selected: true })).toBeTruthy();
    });

    it('exists non-active tab', () => {
      const wrapper = mountTabs({
        mockData: mockDataAnonymous,
      });
      expect(wrapper.queryAllByRole('tab', { selected: false })).toBeTruthy();
    });
  });

  describe('Ecosystem unit tests', () => {
    it('tabset should be created for drivers/language pills', () => {
      process.env = Object.assign(process.env, { GATSBY_SITE: 'ecosystem' });
      const wrapper = mountTabs({
        mockData: mockDataLanguages,
      });
      expect(wrapper.queryAllByRole('tablist')).toHaveLength(1);
    });
  });

  describe('when a hidden tabset is passed in', () => {
    it('does not render a tabset', () => {
      const wrapper = mountTabs({
        mockData: mockDataHidden,
      });
      expect(wrapper.queryAllByRole('tablist')).toHaveLength(0);
    });
  });

  describe('when javascript is disabled', () => {
    it('renders tabs in the set', () => {
      const wrapper = mountTabs({
        mockData: mockDataPlatforms,
      });
      expect(wrapper.queryAllByRole('tablist')).toHaveLength(1);
    });
  });
});
