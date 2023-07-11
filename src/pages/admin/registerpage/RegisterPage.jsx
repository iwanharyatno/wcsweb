import { useContext, useState } from "react";
import { FormInput, FormSelect } from "../../../shared/FormInput";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "../../../shared/Button";
import Auth from "../../../api/Auth";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { useNavigate } from "react-router-dom";
import { Path } from "../../../constants";

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [workType, setWorkType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const msgBox = useContext(MessageBoxContext);
    const navigate = useNavigate();

    const submitData = async (data) => {
        setLoading(true);
        const result = await Auth.register(data);
        setLoading(false);

        if (result && result.meta && result.meta.code >= 400) {
            const errors = result.data.errors || ['Failed: ' + result.meta.code];
            errors.forEach(msg => {
                msgBox.showMessage({
                    type: 'error',
                    message: msg
                });
            });
            return;
        }

        msgBox.showMessage({
            type: 'success',
            message: 'New user registered successfully!'
        });
        navigate(Path.Admin.Index);
    }

    return (
        <div className="w-full min-h-screen bg-blue-lighter">
            <div className="bg-white min-h-screen max-w-5xl mx-auto flex items-center">
                <div className="p-4 md:w-[60%] mx-auto">
                    <h2 className="text-4xl text-blue-lighter font-bold text-center mb-20">Create New User</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitData({
                            firstName, lastName,
                            phoneNumber, workType,
                            email, password
                        });
                    }}>
                        <div className="mb-3 flex items-center gap-3">
                            <FaUserCircle className="text-blue-lighter w-32 h-32" />
                            <div className="grow">
                                <FormInput type="text" placeholder="First Name" className="block w-full mb-5" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                <FormInput type="text" placeholder="Last Name" className="block w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <FormSelect value={workType} onChange={(e) => setWorkType(e.target.value)} className="block w-full mb-5">
                            <option value="">-- Select WorkType --</option>
                            <option value="Student">Student</option>
                            <option value="Employee">Employee</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Other">Other</option>
                        </FormSelect>
                        <FormInput value={phoneNumber} type="number" placeholder="Phone Number" className="block w-full mb-5" onChange={(e) => setPhoneNumber(e.target.value)} />
                        <FormInput type="email" placeholder="Email" value={email} className="block w-full mb-5" onChange={(e) => setEmail(e.target.value)} />
                        <FormInput type="password" placeholder="Password" className="block w-full mb-5" onChange={(e) => setPassword(e.target.value)} />
                        <Button variant="pill" className="block w-full mt-20" disabled={loading}>Register</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;