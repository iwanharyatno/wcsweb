import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LinkButton } from "../../shared/Button";
import ProfilePhoto from "../../shared/ProfilePhoto";
import { Path } from "../../Routes";
import { AppConfig } from "../../constants";
import { FaArrowLeft } from "react-icons/fa";

const cookies = new Cookies();

function NavBar({ actions, items, className, backTo }) {
    const navigate = useNavigate();
    const user = cookies.get(AppConfig.USER_COOKIE_KEY) ? cookies.get(AppConfig.USER_COOKIE_KEY)['data'] : null;

    const logout = () => {
        navigate(0);
        cookies.remove(AppConfig.USER_COOKIE_KEY, { path: '/' });
    }

    return (
        <nav className={[className, "flex items-center p-3 justify-between"].join(' ')}>
            {backTo ? <Link to={backTo} title="Back" className="text-xl"><FaArrowLeft /></Link> : <img src="/logo.svg" alt="" />}
            <ul className="flex gap-2">
                {items.map(m => <li className="text-blue-dark font-bold " key={m.href}><NavLink to={m.href}>{m.text}</NavLink></li>)}
            </ul>
            {user ?
                <ProfilePhoto user={user} image={user.image} onLogout={logout} actions={actions} /> : 
                <LinkButton to={Path.Login + '?redirect=' + encodeURIComponent(window.location.href)} variant="outlined">Login</LinkButton>}
        </nav>
    )
}

export default NavBar;