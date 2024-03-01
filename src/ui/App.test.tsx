import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Renders App component', () => {
    beforeAll(() => {
        global.matchMedia =
            global.matchMedia ||
            function () {
                return {
                    addListener: jest.fn(),
                    removeListener: jest.fn()
                };
            };
    });

    test('should have the search input', () => {
        render(<App />);
        const input = screen.getByTestId('input');
        expect(input).toBeInTheDocument();
    });
});
