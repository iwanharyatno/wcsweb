import { Button } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { useContext, useEffect, useState } from "react";
import MessageBoxContext from "../../shared/MessageBoxContext";
import Post from "../../api/Post";
import { FormInput } from "../../shared/FormInput";
import { FaSearch } from "react-icons/fa";
import { handleErrors } from "../../shared/utils";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const limit = 10;

    const msgBox = useContext(MessageBoxContext);

    const loadData = async () => {
        setLoading(true);
        const result = await Post.main({ offset, limit, type: (mediaType === 'home' ? undefined : mediaType), keyword: (searchQuery && searching ? searchQuery : undefined)});

        if (handleErrors(msgBox, result)) return;

        if (result) {
            if (offset !== 0) setPosts([...posts, ...result.data]);
            else setPosts(result.data);
        }
        
        setLoading(false);
    }

    const loadWithFilter = (mediaType) => {
        setPosts([]);
        setMediaType(mediaType);
        setOffset(0);
    }

    useEffect(() => {
        loadData();
    }, [offset, mediaType, searching]);

    const searchMedia = (e) => {
        e.preventDefault();
        setSearching(true);
        if (searching) loadData();
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearching(false);
    }

    return (
        <>
            <NavBar selected={mediaType} onNavigate={(m) => loadWithFilter(m.value)} />
            <main className="px-8 max-w-5xl mx-auto">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="md:grid grid-cols-2">
                    <div className="md:col-span-2 mb-4">
                        <form onSubmit={searchMedia} className="flex justify-end gap-2">
                            {searching && <Button type="button" onClick={clearSearch} className="bg-red-medium hover:bg-red-medium/75">Cancel</Button>}
                            <FormInput value={searchQuery} className="w-full md:w-auto" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search here.." />
                            <Button type="submit"><FaSearch /></Button>
                        </form>
                    </div>
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
