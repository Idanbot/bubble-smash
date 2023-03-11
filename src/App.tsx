import { HashRouter } from 'react-router-dom';
import './App.css';
import './game.css';
import RoutesComponent from './shared/RoutesComponent';

export function App() {
    return (
        <div className="App">
            <RoutesComponent />
        </div>
    );
}

export function WrappedApp() {
    return (
        <HashRouter>
            <App />
        </HashRouter>
    );
}
