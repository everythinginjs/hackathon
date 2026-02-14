import { render } from '@testing-library/react';

import { MiniSidebar } from './minisidebar';

describe('MiniSidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MiniSidebar />);
    expect(baseElement).toBeTruthy();
  });
});
