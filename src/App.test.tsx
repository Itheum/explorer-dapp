import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders react component', async () => {
  render(<App />);
  const divElement = await screen.findByText(/example Dapp/i);
  expect(divElement).toBeInTheDocument();
});
