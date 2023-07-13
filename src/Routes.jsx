import HomePage from "./pages/homepage/HomePage";
import HomePageAdmin from "./pages/admin/homepage/HomePage";
import LoginPage from "./pages/loginpage/LoginPage";
import UploadPage from "./pages/uploadpage/UploadPage";
import RegisterPage from "./pages/admin/registerpage/RegisterPage";
import MediaDetailPage from "./pages/admin/mediadetailpage/PostDetailPage";
import { Path } from "./constants";
import AuthProtected from "./shared/AuthProtected";
import { Outlet } from "react-router-dom";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";

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
        element: (
            <AuthProtected redirect={Path.Login}>
                <UploadPage />
            </AuthProtected>
        )
    },
    {
        path: Path.ForgotPassword,
        element: <ForgotPassword />
    },
    {
        path: Path.Admin.Index,
        element: (
            <AuthProtected redirect={Path.Login} role="admin">
                <Outlet />
            </AuthProtected>
        ),
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