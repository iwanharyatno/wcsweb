import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import { AppConfig } from '../constants';

const cookies = new Cookies();

function AuthProtected({ children, role, redirect }) {
    const userCookie = cookies.get(AppConfig.USER_COOKIE_KEY);
    if (!userCookie) return <Navigate to={redirect} />;

    const user = userCookie["data"];
    if (role && user.role !== role) return <Navigate to={redirect} />

    return children;
}

export default AuthProtected;