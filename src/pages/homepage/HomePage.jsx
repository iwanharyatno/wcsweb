import { LinkButton } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { Path } from "../../constants";
import { useContext, useEffect, useState } from "react";
import MessageBoxContext from "../../shared/MessageBoxContext";
import Post from "../../api/Post";

function HomePage() {
    const [posts, setPosts] = useState([]);

    const msgBox = useContext(MessageBoxContext);

    useEffect(() => {
        const loadData = async () => {
            const result = await Post.all();
    
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

            setPosts(result.data);
        }
        loadData();
    }, [msgBox]);

    return (
        <>
            <NavBar />
            <main className="px-8 max-w-5xl mx-auto">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="md:grid grid-cols-2">
                    {posts && posts.map(p => <MediaPreview className="h-72" media={p} key={p.id} />)}
                </div>
                <div className="text-center mt-4 mb-8">
                    <LinkButton to={Path.MediaList.Index} variant="pill" className="inline-block min-w-[16rem]">See More</LinkButton>
                </div>
            </main>
        </>
    )
}

export default HomePage;