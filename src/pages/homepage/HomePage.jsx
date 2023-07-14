import { Button } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { useContext, useEffect, useState } from "react";
import MessageBoxContext from "../../shared/MessageBoxContext";
import Post from "../../api/Post";
import { FormInput } from "../../shared/FormInput";
import { FaSearch } from "react-icons/fa";
import { handleErrors } from "../../shared/utils";
import { useSearchParams } from "react-router-dom";
import { Path } from "../../constants";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const limit = 10;

    const msgBox = useContext(MessageBoxContext);
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('type');

    const loadData = async () => {
        setLoading(true);
        const result = await Post.main({ offset, limit, type: (mediaType || undefined), keyword: (searchQuery && searching ? searchQuery : undefined)});

        if (handleErrors(msgBox, result)) return;

        if (result && result.data) {
            if (offset !== 0) setPosts([...posts, ...result.data]);
            else setPosts(result.data);
        }
        
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [offset, searching]);

    useEffect(() => {
        setPosts([]);
        loadData();
    }, [searchParams]);

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
            <NavBar items={[
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
            ]} />
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
                    {posts ? posts.map(p => <MediaPreview className="h-72" media={p} key={p.id} />) : <div className="font-bold text-center md:col-span-2 text-sm italic text-gray">No Posts, yet.</div>}
                </div>
                <div className="text-center mt-4 mb-8">
                <Button disabled={loading || !posts || !posts.length} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
                </div>
            </main>
        </>
    )
}

export default HomePage;
