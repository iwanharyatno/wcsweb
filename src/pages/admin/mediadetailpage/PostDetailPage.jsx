import { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaCamera, FaClock, FaMapMarkerAlt, FaStar, FaTasks } from "react-icons/fa";
import Post from "../../../api/Post";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import { handleErrors } from "../../../shared/utils";
import AdminNavBar from "../AdminNavBar";
import { useParams } from "react-router-dom";

function PostDetailPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(null);
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

    return (
        <div>
            <AdminNavBar />
            {post &&
                <div>
                    <div className="md:col-span-12 bg-cover w-full min-h-[12rem] md:min-h-[24rem]" style={{ backgroundImage: "url('" + post.media +"')" }}></div>
                    <div className="md:grid gap-4 items-start md:grid-cols-12 max-w-6xl pb-8 mx-8 md:mx-auto mt-12">
                        <article className="md:col-span-5">
                            <h1 className="text-blue-dark fw-bold mb-5 text-4xl">{post.title}</h1>
                            {post && post.user && <p className="text-blue-light mb-2">{post.user.firstName + ' ' + post.user.lastName}</p>}
                            <div className="grid md:grid-cols-2 gap-x-5 mb-8">
                                <PostMeta icon={<FaCamera />} value={post.creator_name} />
                                <PostMeta icon={<FaMapMarkerAlt />} value={post.location} />
                                <PostMeta icon={<FaStar />} value={post.event_name} />
                                <PostMeta icon={<FaCalendarAlt />} value={new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                                <PostMeta icon={<FaTasks />} value={post.program_name} />
                                <PostMeta icon={<FaClock />} value={dateFromTime('09:00:00').toLocaleTimeString(undefined, { timeStyle: 'short' })} />
                            </div>
                            <h2 className="text-3xl fw-bold text-blue-dark mb-4">About the Post</h2>
                            <p className="text-gray">{post.description}</p>
                        </article>
                        <div className="shadow-2xl rounded-2xl p-4 md:col-start-8 md:col-span-5 text-blue-dark text-center mt-8" action={post.download_link}>
                            <a href={post.download_link} className="w-full block bg-blue text-white rounded-md hover:bg-blue/75 px-4 py-2" disabled={loading} download>Download</a>
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

function dateFromTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
}

export default PostDetailPage;