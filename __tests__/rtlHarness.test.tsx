import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

describe('RTL harness', () => {
  it('renders a basic native element', () => {
    const { getByText } = render(
      React.createElement(Text, { accessibilityRole: 'text' }, 'harness-ok'),
    );
    expect(getByText('harness-ok')).toBeTruthy();
  });
});
