import React from 'react';
import { shallow } from 'enzyme';

import FormLoadingSpinner from './FormLoadingSpinner';

describe('FormLoadingSpinner', () => {
  it('should render correctly', () => {
    shallow(<FormLoadingSpinner />);
  });
});