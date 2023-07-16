import { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaCamera, FaClock, FaStar, FaTasks, FaUser } from "react-icons/fa";
import Post from "../../../api/Post";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { handleErrors, objectEqual } from "../../../shared/utils";
import AdminNavBar from "../AdminNavBar";
import { useParams } from "react-router-dom";
import MediaPreview from "../../../shared/MediaPreview";
import { Button } from "../../../shared/Button";
import DownloadContext from "../../../shared/DownloadContext";
import TextEditable from "../../../shared/TextEditable";

function PostDetailPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(null);
    const params = useParams();

    const [data, setData] = useState(post);

    const msgBox = useContext(MessageBoxContext);
    const downoadManager = useContext(DownloadContext);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await Post.single(params['id']);
            if (handleErrors(msgBox, result)) return;

            if (result) {
                setPost(result.data);
                setData(result.data);
            }
            
            setLoading(false);
        };
        loadData();
    }, [params]);

    useEffect(() => {
        const updateData = async () => {
            console.log(data);
            setLoading(true);
            const result = await Post.update(data.id, data);
            setLoading(false);

            if (handleErrors(msgBox, result)) {
                setData(post);
                return;
            }

            msgBox.showMessage({
                type: 'success',
                message: 'Detail updated successfully!'
            });
            setPost(data);
        }
        if (data && post && !objectEqual(data, post)) {
            updateData();
        }
    }, [data]);

    const download = () => {
        downoadManager.setVisible(true);
        downoadManager.startDownload(post);
    }

    const updateProp = (name, value) => {
        const updated = {...data};
        updated[name] = value;
        setData(updated);
    }

    return (
        <div>
            <AdminNavBar />
            {data &&
                <div>
                    <MediaPreview scaleType="crop" className="h-[12rem] md:h-[24rem]" media={post} nodesc></MediaPreview>
                    <div className="md:grid gap-4 items-start md:grid-cols-12 max-w-6xl pb-8 mx-8 md:mx-auto mt-12">
                        <article className="md:col-span-5">
                            <TextEditable className="text-blue-dark fw-bold mb-5 text-4xl" value={data.title} type="textarea" label="Title" onChange={(value) => updateProp('title', value)} />
                            {post && post.user && <p className="text-blue-light mb-2">{post.user.firstName + ' ' + post.user.lastName}</p>}
                            <div className="grid md:grid-cols-2 gap-x-12 mb-8">
                                <PostMeta icon={<FaCamera />} value={data.creator_name} onChange={(value) => updateProp('creator_name', value)} label="Creator's name" />
                                <PostMeta icon={<FaStar />} value={data.event_name} onChange={(value) => updateProp('event_name', value)} label="Event name" />
                                <PostMeta icon={<FaUser />} value={data.subject} onChange={(value) => updateProp('subject', value)} label="Subject" />
                                <PostMeta icon={<FaTasks />} value={data.program_name} onChange={(value) => updateProp('program_name', value)} label="Program name" />
                                <PostMeta icon={<FaCalendarAlt />} value={new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} noEdit />
                                <PostMeta icon={<FaClock />} value={new Date(post.created_at).toLocaleTimeString(undefined, { timeStyle: 'short' })} noEdit />
                            </div>
                            <h2 className="text-3xl fw-bold text-blue-dark mb-4">About the Post</h2>
                            <TextEditable
                                className="text-gray w-full"
                                value={data.description}
                                type="textarea"
                                label="Description"
                                onChange={(value) => updateProp('description', value)} />
                        </article>
                        <div className="shadow-2xl rounded-2xl p-4 md:col-start-8 md:col-span-5 text-blue-dark text-center mt-8" action={post.download_link}>
                            <Button className="w-full block bg-blue text-white rounded-md hover:bg-blue/75 px-4 py-2" disabled={loading} onClick={() => download()}>Download</Button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

function PostMeta({ icon, value, className, label, type, noEdit, onChange }) {
    return (
        <div className={["flex items-center gap-4 py-4 text-blue-light", className].join(' ')}>
            <span className="text-blue-dark">{icon}</span> 
            <TextEditable
                disabled={noEdit}
                className={[className, 'w-full'].join(' ')}
                value={value}
                type={type}
                label={label}
                onChange={onChange} />
        </div>
    )
}

export default PostDetailPage;