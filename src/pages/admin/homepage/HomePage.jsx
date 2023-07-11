import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaPause, FaPlay, FaSearch } from "react-icons/fa";
import { Button, LinkButton } from "../../../shared/Button";
import { handleErrors, truncate } from "../../../shared/utils";
import LoadingCircle from "../../../shared/LoadingCircle";
import { FormInput } from "../../../shared/FormInput";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../partials/NavBar";
import { Path } from "../../../Routes";
import MessageBoxContext from "../../../shared/MessageBoxContext";
import Post from "../../../api/Post";

function HomePage() {
    const [posts, setPosts] = useState(null);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const limit = 10;

    const msgBox = useContext(MessageBoxContext);
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        const result = await Post.all({ offset, limit, type: (mediaType === 'home' ? undefined : mediaType), keyword: (searchQuery && searching ? searchQuery : undefined)});

        if (handleErrors(msgBox, result)) return;

        if (result) {
            if (offset !== 0) setPosts([...posts, ...result.data]);
            else setPosts(result.data);
        }
        
        setLoading(false);
    }

    const loadWithFilter = (mediaType) => {
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
        <div>
            <NavBar selected={mediaType} onNavigate={(m) => loadWithFilter(m.value)} action="Register User" onAction={() => navigate('/admin/registeruser')} />
            {posts && <>
                {posts.length > 0 && <MediaHero media={posts[0]} />}
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
            </>}
            <div className="text-center mt-4 mb-8">
                <Button disabled={loading} variant="pill" className="inline-block min-w-[16rem]" onClick={() => setOffset(offset + limit)}>See More</Button>
            </div>
        </div>
    );
}

function MediaHero() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const msgBox = useContext(MessageBoxContext);

    useEffect(() => {
        const loadData = async () => {
            const result = await Post.banners();
            
            if (handleErrors(msgBox, result)) return;

            if (result) setBanners(result.data)
        };
        loadData();
    }, []);

    const currentBanner = banners[currentIndex] || {};

    const previousBanner = () => {
        if (currentIndex === 0) return;
        setCurrentIndex(currentIndex - 1);
    }

    const nextBanner = () => {
        if (currentIndex === banners.length - 1) return;
        setCurrentIndex(currentIndex + 1);
    }

    return (
        <div className={'bg-contain relative min-h-screen md:min-h-[40vh] text-white flex justify-between px-8 z-10 items-center gap-2 overflow-hidden'} style={{ backgroundImage: "url('" + currentBanner.media + "')"}}>
            <button className="opacity-50 hover:opacity-100 bg-gray-light text-white text-3xl p-3 rounded-full" onClick={() => previousBanner()}>
                <FaArrowLeft />
            </button>
            <button className="opacity-50 hover:opacity-100 bg-gray-light text-white text-3xl p-3 rounded-full" onClick={() => nextBanner()}>
                <FaArrowRight />
            </button>
        </div>
    );
}

function MediaItem({ media }) {
    const [playing, setPlaying] = useState(null);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('ended', () => setPlaying(null));
        }
    }, []);

    const startPlaying = () => {
        videoRef.current.play();
        setPlaying(true);
    }

    const pausePlaying = () => {
        videoRef.current.pause();
        setPlaying(false);
        setLoading(false);
    }

    const renderElement = () => {
        let element = <div className="bg-contain bg-no-repeat bg-center w-full h-full" style={{ backgroundImage: "url('" + media.media +"')" }}></div>
        
        if (media.type === 'video') {
            element = (
                <div className="group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full">
                    <video className="w-full h-auto" poster={media.thumbnail} ref={videoRef} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)}>
                        <source src={media.media} />
                    </video>
                    <button className={controlClasses()} onClick={handleControlClick}>
                        {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    {loading && <LoadingCircle className="absolute top-4 right-4" />}
                </div>
            )
        }

        return element;
    }

    const handleControlClick = () => {
        if (!playing) {
            startPlaying();
        } else {
            pausePlaying();
        }
    }

    const controlClasses = () => {
        let classes = "z-10 absolute top-1/2 left-1/2 text-4xl text-white bg-black/30 p-3 -translate-x-1/2 -translate-y-1/2 rounded-full";
        if (playing !== null) {
            classes += " hidden opacity-0 group-hover:inline-block group-hover:opacity-100"
        }

        return classes;
    }

    return (
        <article className="flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl">
            <div className="w-full min-h-[12rem] md:w-1/2 bg-black flex items-center">
                {renderElement()}
            </div>
            <div className="md:w-1/2 p-5 text-blue-dark">
                <Link to={Path.Admin.MediaDetail(media.id)} className="text-xl font-bold mb-3 block hover:underline">{media.title}</Link>
                <p className="mb-3">{truncate(media.description, 75)}</p>
                <p className="flex gap-2 items-center mb-4">
                    <FaCalendarAlt />
                    {new Date(media.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
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