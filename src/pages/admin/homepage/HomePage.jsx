import { useEffect, useRef, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaCalendarAlt, FaMapMarkerAlt, FaPause, FaPlay } from "react-icons/fa";
import { LinkButton } from "../../../shared/Button";
import { truncate } from "../../../shared/utils";
import LoadingCircle from "../../../shared/LoadingCircle";
import { FormInput } from "../../../shared/FormInput";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../partials/NavBar";
import { Path } from "../../../Routes";

function HomePage() {
    const [medias, setMedias] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const otherMedias = medias ? medias.slice(1) : [];
    const navigate = useNavigate();

    useEffect(() => {
        setMedias([
            ...getSrc(5).map(src => ({
                id: +new Date() + Math.random(),
                date: new Date(),
                location: 'Picsum',
                src: src,
                title: 'Lorem ipsum dolor sit amet',
                description: 'Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla.',
                type: 'image'
            })),
            {
                id: +new Date() + Math.random(),
                date: new Date(),
                location: 'Google',
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                thumbnail: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
                title: 'Elephant Dream',
                description: 'The first Blender Open Movie from 2006',
                type: 'video'
            },
            {
                id: +new Date() + Math.random(),
                date: new Date(),
                location: 'Google',
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                thumbnail: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
                title: 'Big Buck Bunny',
                description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain\'t no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org',
                type: 'video'
            }
        ])
    }, []);

    const searchMedia = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <NavBar action="Register User" onAction={() => navigate('/admin/registeruser')} />
            {medias && <>
                {medias.length > 0 && <MediaHero media={medias[0]} />}
                <div className="grid md:grid-cols-2 max-w-6xl mx-auto p-8 gap-8">
                    <div className="md:col-span-2">
                        <form onSubmit={searchMedia} className="flex justify-end">
                            <FormInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search here.." />
                        </form>
                    </div>
                    {otherMedias.map(e => <MediaItem media={e} key={e.id} />)}
                </div>
            </>}
        </div>
    );
}

function MediaHero({ media }) {
    return (
        <div className={'bg-contain relative min-h-screen md:min-h-[40vh] text-white flex justify-between px-8 z-10 items-center gap-2 overflow-hidden'} style={{ backgroundImage: "url('" + media.src + "')"}}>
            <button className="opacity-50 hover:opacity-100 text-white text-5xl">
                <FaArrowAltCircleLeft />
            </button>
            <button className="opacity-50 hover:opacity-100 text-white text-5xl">
                <FaArrowAltCircleRight />
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
        let element = <div className="bg-contain bg-no-repeat bg-center w-full h-full" style={{ backgroundImage: "url('" + media.src +"')" }}></div>
        
        if (media.type === 'video') {
            element = (
                <div className="group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full">
                    <video className="w-full h-auto" poster={media.thumbnail} ref={videoRef} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)}>
                        <source src={media.src} />
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
        <article className="flex flex-col md:flex-row mx-auto overflow-hidden rounded-2xl shadow-xl">
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

function getSrc(count) {
    const srcs = [];

    for(let i = 0; i < count; i++) {
        srcs.push(`https://picsum.photos/${getRandomSize(600, 1000)}/${getRandomSize(600, 1000)}`)
    }

    return srcs;
}

function getRandomSize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

export default HomePage;