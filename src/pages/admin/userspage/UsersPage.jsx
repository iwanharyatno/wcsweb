import { useContext, useEffect, useState } from "react";
import { FormInput } from "../../../shared/FormInput";
import { FaList, FaTimes, FaTrash } from "react-icons/fa";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { handleErrors, objectEqual, removeData, updateData } from "../../../shared/utils";
import TextEditable from "../../../shared/TextEditable";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../../../constants";
import User from "../../../api/User";
import { Button } from "../../../shared/Button";

let prevSearch;

function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [noMore, setNoMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

    const limit = 20;

    const visibleUsers = users ? users.filter(u => !u.uiDeleted) : null;

    const msgBox = useContext(MessageBoxContext);

    const updatePrevSearch = (value) => {
        prevSearch = value;
        return;
    }

    const loadData = async () => {
        setLoading(true);
        const abortController = new AbortController();
        const id = +new Date();

        if (prevSearch && prevSearch.searchQuery.length) {
            prevSearch.abortController.abort();
        }
        const result = await User.all({ offset, limit, keyword: (searchQuery ? searchQuery : undefined)}, abortController);
        setLoading(false);

        if (!result && prevSearch && prevSearch.searchQuery.length) return updatePrevSearch();
        if (handleErrors(msgBox, result)) {
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        setNoMore(!result.data);

        if (searchQuery && prevSearch && prevSearch.searchQuery.length != searchQuery.length) {
            setUsers(result.data);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        if (prevSearch && prevSearch.searchQuery.length > searchQuery.length && !searchQuery) {
            setUsers(result.data);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        if (!result.data) {
            setUsers(null);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        setUsers([...users, ...result.data]);
        updatePrevSearch({ id, abortController, searchQuery });
    }

    useEffect(() => {
        if (prevSearch && prevSearch.searchQuery.length != searchQuery.length && offset != 0) {
            setOffset(0);
            return;
        }
        loadData();
    }, [offset, searchQuery]);

    const cancelDelete = (target) => {
        setUsers(updateData(users, u => u.id == target.id, { uiDeleted: undefined }));
    }

    const deleteUser = async (target) => {
        const result = await User.delete(target.id);

        if (handleErrors(msgBox, result)) {
            cancelDelete(target.id);
            return;
        }

        msgBox.showMessage({
            type: 'success',
            message: `User '${target.full_name}' deleted.`
        });

        setUsers(
            removeData(users, u => u.id == target.id)
        );
    };

    const prepDeleteUser = (user) => {
        if (users.filter(u => u.uiDeleted).length > 0) return;
        setUsers(updateData(users, u => u.id == user.id, { uiDeleted: true }));
        msgBox.showMessage({
            type: 'warning',
            message: `Deleting user "${user.full_name}"`,
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
                            {visibleUsers && (visibleUsers.length ? visibleUsers.map((u, i) => <UserRow user={u} key={u.id} index={i+1} onEdit={onEdit} onDelete={(user) => prepDeleteUser(user)} onShow={(user) => showUser(user)} />) : undefined)}
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="py-3 px-1 text-center">
                                        <span className="font-bold text-gray">Loading...</span>
                                    </td>
                                </tr>
                            )}
                            {(visibleUsers == null || users == null) && (
                                <tr>
                                    <td colSpan={6} className="py-3 px-1 text-center">
                                        <span className="font-bold text-gray">No users, yet. </span>
                                        <Link className="text-blue hover:underline" to={Path.Admin.NewUser}>Register one!</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Button disabled={loading || !users || !users.length || noMore} onClick={() => setOffset(offset + limit)} className="self-start mt-5">See More</Button>
            </div>
        </div>
    )
}

function UserDetail({ user, onClose }) {
    const [mediaHistory, setMediaHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const msgBox = useContext(MessageBoxContext);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await User.history(user.id);
            setLoading(false);

            if (handleErrors(msgBox, result)) return;

            setMediaHistory(result.data);
        };
        loadData();
    }, []);

    return (
        <div className="z-20 fixed w-full h-full lg:h-screen lg:block lg:static lg:w-auto lg:grow grow bg-blue-medium text-white">
            <div className="flex items-stretch p-0 border-b border-b-blue-light">
                <h2 className="text-xl grow px-6 py-4">User Detail</h2>
                <button className="text-xl px-6 py-4" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
            <div className="p-6 h-[85vh] overflow-auto">
                <h3 className="text-lg font-bold mb-2">{user.full_name}</h3>
                <p className="flex gap-2 mb-8">
                    <span>{user.email}</span>
                    <span>|</span>
                    <span>{user.phone_number}</span>
                </p>
                <h3 className="text-lg mb-2 font-bold">Upload History</h3>
                {mediaHistory && (mediaHistory.length ? mediaHistory.map(m => <UploadHistoryCard media={m} key={m.id} />) : undefined)}
                {loading ? <p>Loading information...</p> : undefined}
                {mediaHistory == null ? <p>No data.</p> : undefined}
            </div>
        </div>
    )
}

function UploadHistoryCard({ media }) {
    const navigate = useNavigate();

    return (
        <article className="border border-blue-light rounded-md p-3 my-2 cursor-pointer hover:bg-blue-light/20" onClick={() => navigate(Path.Admin.MediaDetail(media.id))}>
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
        <tr className={['z-10 hover:bg-gray-light/40 relative', (loading) ? 'after:absolute after:bg-black/20 after:w-full after:h-full after:top-0 after:left-0' : ''].join(' ')}>
            <td className="text-center py-2">{index}</td>
            <td>
                <TextEditable type="text" value={data.full_name || ''} onChange={(value) => updateData('full_name', value)} label={`Full name of "${data.full_name}"`} />
            </td>
            <td>
                <TextEditable type="email" value={data.email || ''} onChange={(value) => updateData('email', value)} label={`Email of "${data.full_name}"`} />
            </td>
            <td>
                <TextEditable type="number" value={data.phone_number || ''} onChange={(value) => updateData('phone_number', value)} label={`Phone number of "${data.full_name}"`} />
            </td>
            <td>
                <TextEditable type="select" value={data.work_type || ''} onChange={(value) => updateData('work_type', value)} label={`Work type of "${data.full_name}"`}>
                    <option value="">-- Select WorkType --</option>
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Other">Other</option>
                </TextEditable>
            </td>
            <td className="flex items-center justify-start gap-4 col-start-9 md:col-start-12 col-span-3 md:col-span-1 md:row-span-2">
                <button onClick={() => onDelete(latestData)} className="hover:bg-red-medium text-red-medium hover:text-white p-2 rounded-md" title={'Delete "' + data.full_name + '"'}>
                    <FaTrash />
                </button>
                <button onClick={() => onShow(latestData)} className="hover:bg-blue-medium text-blue-medium hover:text-white p-2 rounded-md" title="Show detail">
                    <FaList />
                </button>
            </td>
        </tr>
    )
}

export default UsersPage;