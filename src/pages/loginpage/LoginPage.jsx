import { useContext, useEffect, useState } from "react";
import { FormInput } from "../../shared/FormInput";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../shared/Button";
import { Path } from "../../Routes";
import Auth from "../../api/Auth";
import MessageBoxContext from "../../shared/MessageBoxContext";
import { AppConfig } from "../../constants";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [searchParams] = useSearchParams();

    const msgBox = useContext(MessageBoxContext);
    const navigate = useNavigate();

    const redirect = () => {
        if (searchParams.size > 0) {
            const redirectUrl = new URL(searchParams.get('redirect'));
            if (redirectUrl.origin === window.location.origin) {
                navigate(redirectUrl.pathname);
                return;
            }
        }
        navigate('/');
    }

    useEffect(() => {
        document.title = 'WCS - Login';
        const user = cookies.get(AppConfig.USER_COOKIE_KEY);
        if (user) redirect();
    }, []);

    const doLogin = async (e) => {
        e.preventDefault();

        const result = await Auth.login({
            email, password
        }, remember);

        if (result && result.meta.code >= 300) {
            const errors = result.data.errors || ['Failed: ' + result.meta.code];
            errors.forEach(msg => {
                msgBox.showMessage({
                    type: 'error',
                    message: msg
                });
            });
        }

        redirect();
    }

    return (
        <div className="lg:grid grid-cols-3 grid-rows-1 h-screen">
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center bg-blue-light">
                <img src="/banner.png" alt="" className="w-1/3" />
            </div>
            <form className="p-8 w-full mx-auto flex flex-col items-center justify-center pb-24" onSubmit={doLogin}>
                <h1 className="text-3xl font-bold text-green text-center block mb-16 mt-4">Hello</h1>
                <FormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-4" required />
                <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-4" required />
                <div className="flex mb-8 w-full">
                    <input type="checkbox" id="rememberCheckbox" onChange={() => setRemember(!remember)} />
                    <label htmlFor="rememberCheckbox" className="ml-2 grow">Remember Me</label>
                    <Link to={Path.ForgotPassword} className="text-blue-light hover:text-blue hidden">Forgot password?</Link>
                </div>
                <Button type="submit" className="block w-full" variant="pill">Login</Button>
            </form>
        </div>
    )
}

export default LoginPage;