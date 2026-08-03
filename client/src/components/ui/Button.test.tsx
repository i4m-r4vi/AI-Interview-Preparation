import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary-600 text-white'); // default primary styling
    expect(buttonElement).not.toBeDisabled();
  });

  it('renders secondary variant correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /secondary/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-slate-200 text-slate-800');
  });

  it('shows loading state and disables button', () => {
    render(<Button loading={true}>Submit</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /loading.../i });
    expect(buttonElement).toBeDisabled();
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /action/i });
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
