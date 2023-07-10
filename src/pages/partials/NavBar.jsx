import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LinkButton } from "../../shared/Button";
import ProfilePhoto from "../../shared/ProfilePhoto";
import { Path } from "../../Routes";
import { AppConfig } from "../../constants";

const cookies = new Cookies();

function NavBar({ onAction, action }) {
    const navigate = useNavigate();
    const user = cookies.get(AppConfig.USER_COOKIE_KEY);

    const logout = () => {
        navigate(0);
    }

    return (
        <nav className="flex items-center p-3 bg-gray-light justify-between">
            <img src="/logo.svg" alt="" />
            <ul className="flex gap-2">
                <li className="text-blue-dark font-bold"><NavLink to={Path.Index}>Home</NavLink></li>
                <li className="text-blue-dark font-bold"><NavLink to={Path.MediaList.Video}>Video</NavLink></li>
                <li className="text-blue-dark font-bold"><NavLink to={Path.MediaList.Photo}>Photo</NavLink></li>
                <li className="text-blue-dark font-bold"><NavLink to={Path.MediaList.Audio}>Audio</NavLink></li>
            </ul>
            {user ?
                <ProfilePhoto user={user} image={user.image} onLogout={logout} onAction={onAction} action={action} /> : 
                <LinkButton to={Path.Login}>Login</LinkButton>}
        </nav>
    )
}

export default NavBar;