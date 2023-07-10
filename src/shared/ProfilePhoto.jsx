import { useState } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

function ProfilePhoto({ image, user, onAction, className, onLogout, action }) {
    const [showDetail, setShowDetail] = useState(false);

    const navigate = useNavigate();

    const handleAction = () => {
        if (onAction) onAction();
        else navigate('/upload');
    }

    return (
        <div className={[className, 'relative cursor-pointer'].join(' ')} onClick={() => setShowDetail(!showDetail)}>
            <Button type="button" variant="pill" background="bg-green hover:bg-green/75">User</Button>
            {user &&
                <div className={'z-50 p-4 absolute bg-white rounded-lg shadow-lg top-16 right-0 w-80 break-words text-center origin-top-right transition-all ' + (showDetail ? 'scale-100 opacity-100' : 'opacity-0 scale-0')}>
                    <img src={image || '/profile-placeholder.svg'} alt={user.fullname + ' Profile'} className="bg-white rounded-full w- h-32 mx-auto mb-3" />
                    <Button onClick={handleAction} variant="outlined" className="inline-block mb-4">{action || 'Upload Media'}</Button>
                    <dl className="mb-4 border-t pt-4 border-gray-light text-left">
                        <dt className="font-bold">Full Name</dt>
                        <dd>{user.fullname}</dd>
                        <dt className="font-bold">Email</dt>
                        <dd>{user.email}</dd>
                    </dl>
                    <Button onClick={onLogout} background="bg-green">Logout</Button>
                </div>}
        </div>
    )
}

export default ProfilePhoto;