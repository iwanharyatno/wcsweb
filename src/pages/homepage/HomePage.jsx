import { Button } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { useContext, useEffect, useState } from "react";
import MessageBoxContext from "../../shared/MessageBoxContext";
import Post from "../../api/Post";
import { FormInput } from "../../shared/FormInput";
import { handleErrors } from "../../shared/utils";
import { useSearchParams } from "react-router-dom";
import { Path } from "../../constants";

let prevSearch = null;

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [noMore, setNoMore] = useState(false);

    const limit = 10;

    const msgBox = useContext(MessageBoxContext);
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('type');

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
        const result = await Post.main({ offset, limit, type: (mediaType || undefined), keyword: (searchQuery ? searchQuery : undefined)}, abortController);
        setLoading(false);

        if (!result && prevSearch && prevSearch.searchQuery.length) return updatePrevSearch();
        if (handleErrors(msgBox, result)) {
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        setNoMore(!result.data);

        if (searchQuery && prevSearch && prevSearch.searchQuery.length != searchQuery.length) {
            setPosts(result.data);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        if (prevSearch && prevSearch.searchQuery.length > searchQuery.length && !searchQuery) {
            setPosts(result.data);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        if (!result.data) {
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        setPosts([...posts, ...result.data]);
        updatePrevSearch({ id, abortController, searchQuery });
    }

    useEffect(() => {
        if (prevSearch && prevSearch.searchQuery.length != searchQuery.length && offset != 0) {
            setOffset(0);
            return;
        }
        loadData();
    }, [offset, searchQuery]);

    useEffect(() => {
        setPosts([]);
        loadData();
    }, [searchParams]);

    return (
        <>
            <NavBar
                items={[
                    {
                        text: 'Home',
                        href: Path.Index
                    },
                    {
                        text: 'Video',
                        href: Path.Index + '?type=video'
                    },
                    {
                        text: 'Photo',
                        href: Path.Index + '?type=image'
                    },
                    {
                        text: 'Audio',
                        href: Path.Index + '?type=audio'
                    }
                ]}
                actions={[
                    {
                        id: 1,
                        text: "Upload Media",
                        href: Path.User.Upload
                    }
                ]} />
            <main className="px-8 max-w-5xl mx-auto">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="md:grid grid-cols-2">
                    <div className="md:col-span-2 mb-4">
                        <form className="flex justify-end gap-2" onSubmit={(e) => e.preventDefault()}>
                            <FormInput value={searchQuery} className="w-full md:w-auto" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search here.." />
                        </form>
                    </div>
                    <MediaPreview className="h-72" media={{
                        title: 'Big buck Bunny sample HLS',
                        description: 'There\'s not much to see here, this is just some test HLS streams, primarily used by hls.js and hosted with 💖 by Mux.',
                        media: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                        type: 'video'
                    }} />
                    <MediaPreview className="h-72" media={{
                        title: 'Tears of Steel, HLS with IMSC Captions',
                        description: 'There\'s not much to see here, this is just some test HLS streams, primarily used by hls.js and hosted with 💖 by Mux.',
                        media: 'https://test-streams.mux.dev/tos_ismc/main.m3u8',
                        type: 'video'
                    }} />
                    {posts && posts.length ? posts.map(p => <MediaPreview className="h-72" media={p} key={p.id} />) : <div className="font-bold text-center md:col-span-2 text-sm italic text-gray">No Posts, yet.</div>}
                </div>
                <div className="text-center mt-4 mb-8">
                <Button disabled={loading || !posts || !posts.length || noMore} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
                </div>
            </main>
        </>
    )
}

export default HomePage;
