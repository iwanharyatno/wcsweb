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

    const limit = 12;

    const msgBox = useContext(MessageBoxContext);
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('type');

    const updatePrevSearch = (value) => {
        prevSearch = value;
        return;
    }

    const loadData = async (reset) => {
        setLoading(true);
        const abortController = new AbortController();
        const id = +new Date();

        if (prevSearch && prevSearch.searchQuery.length) {
            prevSearch.abortController.abort();
        }
        const result = await Post.main({ offset: reset ? 0 : offset, limit, type: (mediaType || undefined), keyword: (searchQuery ? searchQuery : undefined)}, abortController);
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
            if (offset == 0) setPosts(null);
            return updatePrevSearch({ id, abortController, searchQuery });
        }

        if (reset) {
          setPosts(result.data);
          return updatePrevSearch({ id, abortController, searchQuery });
        }

        setPosts([...(posts || []), ...result.data]);
        updatePrevSearch({ id, abortController, searchQuery });
    }

    useEffect(() => {
        if (prevSearch && prevSearch.searchQuery.length != searchQuery.length && offset != 0) {
            setOffset(0);
            return;
        }
        loadData(prevSearch == null);
    }, [offset, searchQuery]);

    useEffect(() => {
        prevSearch = null;
        setPosts([]);
        if (offset == 0) loadData(true);
        setOffset(0);
    }, [searchParams]);

    return (
        <>
            <NavBar
                className="bg-gray-light"
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
            <main className="px-8 max-w-[96rem] mx-auto p-8 gap-8">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="grid xl:grid-cols-3">
                    <div className="xl:col-span-3">
                        <form className="flex justify-end gap-2" onSubmit={(e) => e.preventDefault()}>
                            <FormInput value={searchQuery} className="w-full md:w-auto" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search here.." />
                        </form>
                    </div>
                {posts && posts.length ? posts.map(e => <MediaPreview className="h-72" media={e} key={e.id} />) : undefined}
                {loading && <div className="col-span-3 font-bold text-center text-sm italic text-gray">Loading data...</div>}
                {posts == null && <div className="col-span-3 font-bold text-center text-sm italic text-gray">No Posts, yet.</div>}
                </div>
                <div className="text-center mt-4 mb-8">
                    <Button disabled={loading || !posts || !posts.length || noMore} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
                </div>
            </main>
        </>
    )
}

export default HomePage;
