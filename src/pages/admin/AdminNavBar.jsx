import { useNavigate } from "react-router-dom";
import { Path } from "../../constants";
import NavBar from "../partials/NavBar";

function AdminNavBar() {
    const navigate = useNavigate();

    return (
        <NavBar action="Register User" onAction={() => navigate(Path.Admin.NewUser)} items={[
            {
                text: 'Home',
                href: Path.Admin.Index
            },
            {
                text: 'Video',
                href: Path.Admin.Index + '?type=video'
            },
            {
                text: 'Photo',
                href: Path.Admin.Index + '?type=image'
            },
            {
                text: 'Audio',
                href: Path.Admin.Index + '?type=audio'
            }
        ]} authText="Admin" />
    )
}

export default AdminNavBar;