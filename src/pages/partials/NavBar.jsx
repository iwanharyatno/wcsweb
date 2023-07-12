import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LinkButton } from "../../shared/Button";
import ProfilePhoto from "../../shared/ProfilePhoto";
import { Path } from "../../Routes";
import { AppConfig } from "../../constants";

const cookies = new Cookies();

function NavBar({ onAction, action, items }) {
    const navigate = useNavigate();
    const user = cookies.get(AppConfig.USER_COOKIE_KEY) ? cookies.get(AppConfig.USER_COOKIE_KEY)['data'] : null;

    const logout = () => {
        navigate(0);
        cookies.remove(AppConfig.USER_COOKIE_KEY, { path: '/' });
    }

    return (
        <nav className="flex items-center p-3 bg-gray-light justify-between">
            <img src="/logo.svg" alt="" />
            <ul className="flex gap-2">
                {items.map(m => <li className="text-blue-dark font-bold " key={m.href}><NavLink to={m.href}>{m.text}</NavLink></li>)}
            </ul>
            {user ?
                <ProfilePhoto user={user} image={user.image} onLogout={logout} onAction={onAction} action={action} /> : 
                <LinkButton to={Path.Login + '?redirect=' + encodeURIComponent(window.location.href)} variant="outlined">Login</LinkButton>}
        </nav>
    )
}

export default NavBar;