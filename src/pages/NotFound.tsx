import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <h1>Not found! 404</h1>
            <Link to="/">Go home</Link>
        </div>
    );
}

export default NotFound;
