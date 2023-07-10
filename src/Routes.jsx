import HomePage from "./pages/homepage/HomePage";
import HomePageAdmin from "./pages/admin/homepage/HomePage";
import LoginPage from "./pages/loginpage/LoginPage";
import UploadPage from "./pages/uploadpage/UploadPage";
import RegisterPage from "./pages/admin/registerpage/RegisterPage";
import MediaDetailPage from "./pages/admin/mediadetailpage/MediaDetailPage";
import { Path } from "./constants";

const Routes = [
    {
        path: Path.Index,
        element: <HomePage />
    },
    {
        path: Path.Login,
        element: <LoginPage />
    },
    {
        path: Path.User.Upload,
        element: <UploadPage />
    },
    {
        path: Path.Admin.Index,
        children: [
            {
                path: Path.Admin.Index,
                element: <HomePageAdmin />
            },
            {
                path: Path.Admin.NewUser,
                element: <RegisterPage />
            },
            {
                path: Path.Admin.MediaDetail(':id'),
                element: <MediaDetailPage />
            }
        ]
    }
];

export default Routes;
export { Path }