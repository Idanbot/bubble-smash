import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App, WrappedApp } from '../src/App';

describe('App', () => {
    it('Renders Bubble-Smash', () => {
        render(<WrappedApp />);
        expect(
            screen.getByRole('heading', {
                level: 1,
            })
        ).toHaveTextContent('Bubble-Smash');
    });

    it('Renders not found if invalid path', () => {
        render(
            <MemoryRouter initialEntries={['/invalid-path']}>
                <App />
            </MemoryRouter>
        );
        expect(
            screen.getByRole('heading', {
                level: 1,
            })
        ).toHaveTextContent('Not found! 404');
    });
});
