import React from 'react';
import { shallow } from 'enzyme';

import SearchStopField from './SearchStopField';

describe('SearchStopField', () => {
  it('should render correctly', () => {
    shallow(<SearchStopField />);
  });
});