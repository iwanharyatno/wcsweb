import { useContext, useEffect, useState } from "react";
import { FormInput } from "../../../shared/FormInput";
import { FaList, FaTimes, FaTrash } from "react-icons/fa";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { handleErrors, objectEqual, removeData, updateData } from "../../../shared/utils";
import TextEditable from "../../../shared/TextEditable";
import { Link } from "react-router-dom";
import { Path } from "../../../constants";
import User from "../../../api/User";

function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

    const visibleUsers = users.filter(u => !u.uiDeleted);

    const msgBox = useContext(MessageBoxContext);

    useEffect(() => {
        setUsers([
            {
                id: 1,
                fullname: 'Lorem Ipsum',
                email: 'loremipsum@lorem.com',
                phone_number: '083128339244'
            },
            {
                id: 2,
                fullname: 'Adispicing Elit',
                email: 'adielit@lorem.com',
                phone_number: '083128339244'
            },
            {
                id: 3,
                fullname: 'Consetetur',
                email: 'consetetur@lorem.com',
                phone_number: '083128339244'
            },
            {
                id: 4,
                fullname: 'Aliquam Nulla',
                email: 'loremipsum@lorem.com',
                phone_number: '083128339244'
            },
        ]);
    }, [searchQuery]);

    const cancelDelete = (target) => {
        setUsers(updateData(users, u => u.id == target.id, { uiDeleted: undefined }));
    }

    const deleteUser = async (target) => {
        const result = await User.delete(target.id);

        if (handleErrors(msgBox, result)) {
            cancelDelete(target.id);
            return;
        }

        setUsers(
            removeData(users, u => u.id == target.id)
        );
    };

    const prepDeleteUser = (user) => {
        if (users.filter(u => u.uiDeleted).length > 0) return;
        setUsers(updateData(users, u => u.id == user.id, { uiDeleted: true }));
        msgBox.showMessage({
            type: 'warning',
            message: `Deleting user "${user.fullname}"`,
            timer: 5,
            action: {
                text: 'Undo',
                onAction: () => cancelDelete(user),
            },
            onTimeout: () => deleteUser(user)
        })
    }

    const onEdit = async (data, finished) => {
        const result = await User.update(data.id, data);

        if (handleErrors(msgBox, result)) {
            finished(true)
            return;
        }

        setUsers(
            updateData(users, u => u.id == data.id, result.data)
        );

        finished();
    }

    const showUser = (u) => {
        if (user && u.id == user.id) {
            setUser(null);
            return;
        }
        setUser(u);
    }

    return (
        <div className="w-full min-h-screen bg-blue-lighter flex items-center">
            {user && <UserDetail user={user} onClose={() => setUser(null)} />}
            <div className="bg-white min-h-screen w-full lg:w-[80vw] mx-auto p-8 flex flex-col">
                <h1 className="text-4xl text-blue-light font-bold pt-4 mb-12">Manage Users</h1>
                <div className="flex flex-row items-center mb-5">
                    <h2 className="text-lg mr-4 md:mr-12">All Users</h2>
                    <FormInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="grow md:grow-0" />
                </div>
                <div className="overflow-auto">
                    <table className="xl:w-full border border-gray-light">
                        <thead className="bg-gray-light text-blue">
                            <tr className="text-left">
                                <th className="text-center py-3 px-1 min-w-[3rem]">#</th>
                                <th className="min-w-[18rem]">Full Name</th>
                                <th className="min-w-[18rem]">Email</th>
                                <th className="min-w-[12rem]">Phone Number</th>
                                <th className="min-w-[12rem]">Work Type</th>
                                <th className="min-w-[12rem]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-light">
                            {visibleUsers.length ? visibleUsers.map((u, i) => <UserRow user={u} key={u.id} index={i+1} onEdit={onEdit} onDelete={(user) => prepDeleteUser(user)} onShow={(user) => showUser(user)} />) : (
                                <tr>
                                    <td colSpan={6} className="py-3 px-1 text-center">
                                        <span className="font-bold italic text-gray">No users, yet. </span>
                                        <Link className="text-blue hover:underline" to={Path.Admin.NewUser}>Register one!</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function UserDetail({ user, onClose }) {
    return (
        <div className="z-50 fixed w-full h-full lg:h-screen lg:block lg:static lg:w-auto lg:grow grow bg-blue-medium text-white">
            <div className="flex items-stretch p-0 border-b border-b-blue-light">
                <h2 className="text-xl grow px-6 py-4">User Detail</h2>
                <button className="text-xl px-6 py-4" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{user.fullname}</h3>
                <p className="flex gap-2 mb-8">
                    <span>{user.email}</span>
                    <span>|</span>
                    <span>{user.phone_number}</span>
                </p>
                <h3 className="text-lg mb-2 font-bold">Upload History</h3>
                <UploadHistoryCard media={{
                    "id": 1,
                    "title": "Raja Ampat",
                    "subject": "Pulau",
                    "creator_name": "Sang Fotografer",
                    "description": "-",
                    "media": "https://api.wcs.bakaranproject.com/asset/raja-ampat.jpg",
                    "created_at": "2023-07-12T14:05:44+07:00",
                    "updated_at": "2023-07-13T14:05:46+07:00"
                }} />
                <UploadHistoryCard media={{
                    "id": 1,
                    "title": "Raja Ampat",
                    "subject": "Pulau",
                    "creator_name": "Sang Fotografer",
                    "description": "-",
                    "media": "https://api.wcs.bakaranproject.com/asset/raja-ampat.jpg",
                    "created_at": "2023-07-12T14:05:44+07:00",
                    "updated_at": "2023-07-13T14:05:46+07:00"
                }} />
                <UploadHistoryCard media={{
                    "id": 1,
                    "title": "Raja Ampat",
                    "subject": "Pulau",
                    "creator_name": "Sang Fotografer",
                    "description": "-",
                    "media": "https://api.wcs.bakaranproject.com/asset/raja-ampat.jpg",
                    "created_at": "2023-07-12T14:05:44+07:00",
                    "updated_at": "2023-07-13T14:05:46+07:00"
                }} />
            </div>
        </div>
    )
}

function UploadHistoryCard({ media }) {
    return (
        <article className="border border-blue-light rounded-md p-3 my-2">
            <h2 className="text-md hover:underline"><Link to={Path.Admin.MediaDetail(media.id)}>{media.title}</Link></h2>
            <p className="flex gap-2 text-sm">
                <span>{media.creator_name}</span>
                <span>|</span>
                <span>{new Date(media.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </p>
        </article>
    )
}

function UserRow({ user, index, onEdit, onDelete, onShow }) {
    const [latestData, setLatestData] = useState({...user});
    const [data, setData] = useState({...user});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!objectEqual(data, user)) {
            const updated = {...latestData, ...data};
            onEdit(updated, (err) => {
                setLoading(false);
                if (err) {
                    setData(latestData);
                    return;
                }
                setLatestData(updated);
            });
            setLoading(true);
        }
    }, [data]);

    const updateData = (propName, value) => {
        const d = {...data};
        d[propName] = value;
        setData(d);
    }

    return (
        <tr className={['z-10 hover:bg-gray-light relative', (loading) ? 'after:absolute after:bg-black/40 after:w-full after:h-full after:top-0 after:left-0' : ''].join(' ')}>
            <td className="text-center py-2">{index}</td>
            <td>
                <TextEditable type="text" value={data.fullname || ''} onChange={(value) => updateData('fullname', value)} />
            </td>
            <td>
                <TextEditable type="email" value={data.email || ''} onChange={(value) => updateData('email', value)} />
            </td>
            <td>
                <TextEditable type="number" value={data.phone_number || ''} onChange={(value) => updateData('phone_number', value)} />
            </td>
            <td>
                <TextEditable type="select" value={data.work_type || ''} onChange={(value) => updateData('work_type', value)}>
                    <option value="">-- Select WorkType --</option>
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Other">Other</option>
                </TextEditable>
            </td>
            <td className="flex items-center justify-start gap-4 col-start-9 md:col-start-12 col-span-3 md:col-span-1 md:row-span-2">
                <button onClick={() => onDelete(user)} className="hover:bg-red-medium text-red-medium hover:text-white p-2 rounded-md" title={'Delete ' + user.fullname}>
                    <FaTrash />
                </button>
                <button onClick={() => onShow(user)} className="hover:bg-blue-medium text-blue-medium hover:text-white p-2 rounded-md" title="Show detail">
                    <FaList />
                </button>
            </td>
        </tr>
    )
}

export default UsersPage;