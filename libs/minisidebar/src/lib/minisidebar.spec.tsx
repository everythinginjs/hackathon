import { render } from '@testing-library/react';

import OrgMinisidebar from './minisidebar';

describe('OrgMinisidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgMinisidebar />);
    expect(baseElement).toBeTruthy();
  });
});
