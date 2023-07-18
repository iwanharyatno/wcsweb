import { Path } from "../../constants";
import NavBar from "../partials/NavBar";

function AdminNavBar() {
    return (
        <NavBar
            items={[
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
            ]} 
            actions={[
                {
                    id: 1,
                    text: 'Register User',
                    href: Path.Admin.NewUser
                },
                {
                    id: 2,
                    text: 'Manage Users',
                    href: Path.Admin.Users.Index
                }
            ]} />
    )
}

export default AdminNavBar;