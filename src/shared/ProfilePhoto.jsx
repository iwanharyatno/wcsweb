import { useState } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

function ProfilePhoto({ image, user, onAction, className, onLogout, size, action }) {
    const [showDetail, setShowDetail] = useState(false);
    const sizeCss = size ? `w-${size} h-${size}` : 'w-12 h-12';

    const navigate = useNavigate();

    const handleAction = () => {
        if (onAction) onAction();
        else navigate('/upload');
    }

    return (
        <div className={[className, 'relative ' + sizeCss + ' cursor-pointer'].join(' ')} onClick={() => setShowDetail(!showDetail)}>
            <Button>User</Button>
            {user &&
                <div className={'z-50 p-4 absolute bg-white rounded-lg shadow-lg top-16 right-0 w-80 break-words text-center origin-top-right transition-all ' + (showDetail ? 'scale-100 opacity-100' : 'opacity-0 scale-0')}>
                    <img src={image || '/profile-placeholder.svg'} alt={user.firstName + ' ' + user.lastName + ' Profile'} className="bg-white rounded-full w-32 h-32 mx-auto mb-3" />
                    <Button onClick={handleAction} variant="outlined" className="inline-block mb-4">{action || 'Upload Media'}</Button>
                    <dl className="mb-4 border-t pt-4 border-gray-light text-left">
                        <dt className="font-bold">Full Name</dt>
                        <dd>{user.firstName + ' ' + user.lastName}</dd>
                        <dt className="font-bold">Email</dt>
                        <dd>{user.email}</dd>
                    </dl>
                    <Button onClick={onLogout}>Logout</Button>
                </div>}
        </div>
    )
}

export default ProfilePhoto;