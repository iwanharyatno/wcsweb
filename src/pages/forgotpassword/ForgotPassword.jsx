import { useContext, useState } from "react";
import { Button } from "../../shared/Button";
import { FormInput } from "../../shared/FormInput";
import Auth from "../../api/Auth";
import MessageBoxContext from "../../shared/MessageBoxContext";
import { handleErrors } from "../../shared/utils";
import DOMPurify from "dompurify";

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [lastEmail, setLastEmail] = useState('');
    const [sent, setSent] = useState(false);

    const msgBox = useContext(MessageBoxContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await Auth.forgotpassword({ email })
        setLoading(false);

        if (handleErrors(msgBox, result)) return;

        setSent(true);
        setLastEmail(email);
    }

    return (
        <div className="fixed w-full h-full flex items-center justify-center">
            <form onSubmit={onSubmit} className="bg-white shadow-lg p-5 rounded-lg m-4 max-w-md">
                <h1 className="text-2xl font-bold text-blue mb-3">{sent ? 'Success!' : 'Forgot your password?'}</h1>
                <p className="mb-5" dangerouslySetInnerHTML={{ __html: sent ? `We've sent the reset link to <strong>${DOMPurify.sanitize(lastEmail)}</strong>. Please check your inbox, including the spam folder.` : 'We\'ll send a reset password link to your registered email.' }}></p>
                <FormInput type="email" className="mb-8 w-full" placeholder="Type your email..." onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="block w-full" disabled={loading}>{sent ? 'Resend link' : 'Submit'}</Button>
            </form>
        </div>
    );
}

export default ForgotPassword;