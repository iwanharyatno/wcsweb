import { useState } from "react";
import { Button } from "./Button";
import { NavLink } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";

function ProfilePhoto({ image, user, className, onLogout, actions }) {
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className={[className, 'relative cursor-pointer'].join(' ')}>
            <Button type="button" variant="pill" background="bg-green hover:bg-green/75" className="capitalize" onClick={() => setShowDetail(!showDetail)}>{user.role}</Button>
            {user &&
                <div className={'z-50 p-4 absolute bg-white rounded-lg shadow-lg top-16 right-0 w-80 break-words text-center origin-top-right transition-all ' + (showDetail ? 'scale-100 opacity-100' : 'opacity-0 scale-0')}>
                    <img src={image || '/profile-placeholder.svg'} alt={user.fullname + ' Profile'} className="bg-white rounded-full w- h-32 mx-auto mb-3" />
                    <ul>
                        <NavMenu text="Actions" nested className="grow-0">
                            {actions.map(a => (
                                <NavMenu text={a.text} href={a.href} key={a.id} />
                            ))}
                        </NavMenu>
                    </ul>
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

function NavMenu({ text, href, nested, children, className }) {
    const [childShow, setChildShow] = useState(false);

    return (
        <li className={'relative p-2 hover:bg-gray-light ' + className} onMouseOver={() => setChildShow(true)} onMouseOut={() => setChildShow(false)}>
            <NavLink to={href}>
                {text}
                {nested && <FaCaretDown className="inline" />}
            </NavLink>
            {nested &&
                <ul className={"z-40 mt-4 md:mt-0 md:absolute left-0 top-full w-full whitespace-nowrap bg-white rounded-md shadow-md origin-top-left opacity-0 scale-0 transition-all" + (childShow ? ' opacity-100 scale-100 block' : ' hidden')}>
                    {children}
                </ul>}
        </li>
    )
}

export default ProfilePhoto;