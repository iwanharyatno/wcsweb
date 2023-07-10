import { Button } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { useContext, useEffect, useState } from "react";
import MessageBoxContext from "../../shared/MessageBoxContext";
import Post from "../../api/Post";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    const msgBox = useContext(MessageBoxContext);

    const loadData = async () => {
        setLoading(true);
        const result = await Post.all({ offset, limit });

        if (result.meta.code >= 300) {
            const errors = result.data.errors || ['Failed: ' + result.meta.code];
            errors.forEach(msg => {
                msgBox.showMessage({
                    type: 'error',
                    message: msg
                });
            });
            return;
        }

        setPosts([...posts, ...result.data]);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [offset]);

    return (
        <>
            <NavBar />
            <main className="px-8 max-w-5xl mx-auto">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="md:grid grid-cols-2">
                    {posts && posts.map(p => <MediaPreview className="h-72" media={p} key={p.id} />)}
                </div>
                <div className="text-center mt-4 mb-8">
                    <Button disabled={loading} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
                </div>
            </main>
        </>
    )
}

export default HomePage;