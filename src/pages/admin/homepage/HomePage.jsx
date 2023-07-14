import { useContext, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Button, LinkButton } from "../../../shared/Button";
import { handleErrors, truncate } from "../../../shared/utils";
import { FormInput } from "../../../shared/FormInput";
import { Link, useSearchParams } from "react-router-dom";
import { Path } from "../../../Routes";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import Post from "../../../api/Post";
import AdminNavBar from "../AdminNavBar";
import Banner from "../../../api/Banner";
import MediaPreview from "../../../shared/MediaPreview";

function HomePage() {
    const [posts, setPosts] = useState(null);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchParams] = useSearchParams();

    const limit = 10;
    const mediaType = searchParams.get('type');

    const msgBox = useContext(MessageBoxContext);

    const loadData = async () => {
        setLoading(true);
        const result = await Post.all({ offset, limit, type: (mediaType || undefined), keyword: (searchQuery && searching ? searchQuery : undefined)});

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
        <div>
            <AdminNavBar />
            <MediaHero />
            {posts ? <>
                <div className="grid md:grid-cols-2 max-w-6xl mx-auto p-8 gap-8">
                    <div className="md:col-span-2">
                        <form onSubmit={searchMedia} className="flex justify-end gap-2">
                            {searching && <Button type="button" onClick={clearSearch} className="bg-red-medium hover:bg-red-medium/75">Cancel</Button>}
                            <FormInput value={searchQuery} className="w-full md:w-auto" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search here.." />
                            <Button type="submit"><FaSearch /></Button>
                        </form>
                    </div>
                    {posts.map(e => <MediaItem media={e} key={e.id} />)}
                </div>
            </> : <div className="font-bold text-center text-sm italic text-gray">No Posts, yet.</div>}
            <div className="text-center mt-4 mb-8">
                <Button disabled={loading || !posts || !posts.length} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
            </div>
        </div>
    );
}

function MediaHero() {
    const [banners, setBanners] = useState([]);
    const [offset] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const msgBox = useContext(MessageBoxContext);
    const limit = 10;

    useEffect(() => {
        const loadData = async () => {
            const result = await Banner.all({ offset, limit });
            
            if (handleErrors(msgBox, result)) return;

            if (result) setBanners(result.data)
        };
        loadData();
    }, [offset]);

    const previousBanner = () => {
        if (currentIndex === 0) {
            setCurrentIndex(banners.length - 1);
            return;
        }
        setCurrentIndex(currentIndex - 1);
    }

    const nextBanner = () => {
        if (currentIndex === banners.length - 1) {
            setCurrentIndex(0);
            return;
        }
        setCurrentIndex(currentIndex + 1);
    }

    return (
        <div className={'relative min-h-screen md:min-h-[45vh] overflow-hidden'}>
            {banners.map(b => (
                <div key={b.id} className={['absolute top-0 left-0 bg-cover bg-center w-full h-full', (banners[currentIndex].id === b.id ? 'animate-slide-in' : 'hidden')].join(' ')} style={{ backgroundImage: `url("${b.media}")`, animationFillMode: 'forwards' }}>
                </div>
            ))}
            <div className="absolute top-0 left-0 w-full h-full text-white flex justify-between px-8 z-10 items-center gap-2">
                <button className="opacity-50 hover:opacity-100 bg-gray-light text-white text-3xl p-3 rounded-full" onClick={() => previousBanner()}>
                    <FaArrowLeft />
                </button>
                <button className="opacity-50 hover:opacity-100 bg-gray-light text-white text-3xl p-3 rounded-full" onClick={() => nextBanner()}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}

function MediaItem({ media }) {
    return (
        <article className="flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl">
            <MediaPreview className="min-h-[12rem] relative w-full md:w-1/2" nodesc media={media} />
            <div className="md:w-1/2 p-5 text-blue-dark">
                <Link to={Path.Admin.MediaDetail(media.id)} className="text-xl font-bold mb-3 block hover:underline">{media.title}</Link>
                <p className="mb-3">{truncate(media.description, 75)}</p>
                <p className="flex gap-2 items-center mb-4">
                    <FaCalendarAlt />
                    {new Date(media.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
                <p className="flex gap-2 items-center mb-6">
                    <FaMapMarkerAlt />
                    {media.location}
                </p>
                <LinkButton to={Path.Admin.MediaDetail(media.id)} background="bg-blue-dark hover:bg-blue-dark/75">See More</LinkButton>
            </div>
        </article>
    )
}

export default HomePage;
