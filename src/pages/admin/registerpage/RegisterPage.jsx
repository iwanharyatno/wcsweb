import { useState } from "react";
import { FormInput, FormSelect } from "../../../shared/FormInput";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { Button } from "../../../shared/Button";

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [workType, setWorkType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitData = (data) => {
        console.log(data);
        setLoading(true);
    }

    return (
        <div className="w-full min-h-screen bg-blue-lighter">
            <div className="bg-white min-h-screen max-w-5xl mx-auto flex items-center">
                <div className="p-4 md:w-[60%] mx-auto">
                    <h2 className="text-4xl text-blue-lighter font-bold mb-4 text-center mb-20">Create New User</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitData({
                            photo: file,
                            firstName, lastName,
                            phoneNumber, workType,
                            email, password
                        });
                    }}>
                        <div className="mb-3 flex items-center gap-3">
                            <input type="file" accept="image/*" id="imageFileInput" onChange={(e) => setFile(e.target.files[0])} className="hidden"/>
                            <label className="relative cursor-pointer" htmlFor="imageFileInput">
                                {file ? <img src={URL.createObjectURL(file)} alt="Selected profile" className="w-32 h-32 rounded-full"/> :
                                    <FaUserCircle className="text-blue-lighter w-32 h-32" /> }
                                <FaPlus className="absolute bottom-2 right-2 w-8 h-8 text-blue-darker bg-white rounded-full" />
                            </label>
                            <div className="grow">
                                <FormInput type="text" placeholder="First Name" className="block w-full mb-8" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                <FormInput type="text" placeholder="Last Name" className="block w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <FormSelect value={workType} onChange={(e) => setWorkType(e.target.value)} className="block w-full mb-8">
                            <option value="">-- Select WorkType --</option>
                            <option value="Student">Student</option>
                            <option value="Employee">Employee</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Other">Other</option>
                        </FormSelect>
                        <FormInput value={phoneNumber} type="number" placeholder="Phone Number" className="block w-full mb-8" onChange={(e) => setPhoneNumber(e.target.value)} />
                        <FormInput type="email" placeholder="Email" value={email} className="block w-full mb-8" onChange={(e) => setEmail(e.target.value)} />
                        <FormInput type="password" placeholder="Password" className="block w-full mb-8" onChange={(e) => setPassword(e.target.value)} />
                        <Button variant="pill" className="block w-full mt-28" disabled={loading}>Register</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;