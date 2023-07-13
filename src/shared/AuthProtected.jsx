import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import { AppConfig } from '../constants';

const cookies = new Cookies();

function AuthProtected({ children, role, redirect, nointended }) {
    const userCookie = cookies.get(AppConfig.USER_COOKIE_KEY);
    const intended = nointended ? '' : '?redirect=' + encodeURIComponent(window.location.href);
    if (!userCookie) return <Navigate to={redirect + intended} />;

    const user = userCookie["data"];
    if (role && user.role !== role) return <Navigate to={redirect + intended} />

    return children;
}

export default AuthProtected;