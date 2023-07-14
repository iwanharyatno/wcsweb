import { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaCamera, FaClock, FaStar, FaTasks } from "react-icons/fa";
import Post from "../../../api/Post";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { handleErrors } from "../../../shared/utils";
import AdminNavBar from "../AdminNavBar";
import { useParams } from "react-router-dom";
import MediaPreview from "../../../shared/MediaPreview";
import { Button } from "../../../shared/Button";
import ProgressBar from "../../../shared/ProgressBar";

function PostDetailPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(null);
    const [progress, setProgress] = useState(0);
    const params = useParams();

    const msgBox = useContext(MessageBoxContext);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await Post.single(params['id']);
            if (handleErrors(msgBox, result)) return;

            if (result) setPost(result.data)
            
            setLoading(false);
        };
        loadData();
    }, [params]);

    const download = async (url) => {
        setLoading(true);
        const result = await Post.downloadMedia(url, (p) => {
            setProgress(p.progress * 100);
        });
        setLoading(false);
        setProgress(0);

        if (handleErrors(msgBox, result)) return;

        const href = URL.createObjectURL(result.data);
        const ext = result.headers['content-type'].split('/')[1];

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${post.title}.${ext}`);
        link.click();

        URL.revokeObjectURL(result.data);
    }

    return (
        <div>
            <AdminNavBar />
            {post &&
                <div>
                    <MediaPreview className="h-[12rem] md:h-[24rem]" media={post} nodesc></MediaPreview>
                    <div className="md:grid gap-4 items-start md:grid-cols-12 max-w-6xl pb-8 mx-8 md:mx-auto mt-12">
                        <article className="md:col-span-5">
                            <h1 className="text-blue-dark fw-bold mb-5 text-4xl">{post.title}</h1>
                            {post && post.user && <p className="text-blue-light mb-2">{post.user.firstName + ' ' + post.user.lastName}</p>}
                            <div className="grid md:grid-cols-2 gap-x-5 mb-8">
                                <PostMeta icon={<FaCamera />} value={post.creator_name} />
                                <PostMeta icon={<FaStar />} value={post.event_name} />
                                <PostMeta icon={<FaCalendarAlt />} value={new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                                <PostMeta icon={<FaTasks />} value={post.program_name} />
                                <PostMeta icon={<FaClock />} value={new Date(post.created_at).toLocaleTimeString(undefined, { timeStyle: 'short' })} />
                            </div>
                            <h2 className="text-3xl fw-bold text-blue-dark mb-4">About the Post</h2>
                            <p className="text-gray">{post.description}</p>
                        </article>
                        <div className="shadow-2xl rounded-2xl p-4 md:col-start-8 md:col-span-5 text-blue-dark text-center mt-8" action={post.download_link}>
                            <Button className="w-full block bg-blue text-white rounded-md hover:bg-blue/75 px-4 py-2" disabled={loading} onClick={() => download("https://7adc7a7821a245.lhr.life")} >Download</Button>
                            {!!progress && (
                                <ProgressBar className="mt-4" value={progress} label="Downloading" />
                            )}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

function PostMeta({ icon, value, className }) {
    return (
        <div className={["flex items-center gap-4 py-4 text-blue-light", className].join(' ')}>
            <span className="text-blue-dark">{icon}</span> <span>{value}</span>
        </div>
    )
}

export default PostDetailPage;