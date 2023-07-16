import { FaHeadphones, FaPause, FaPlay } from "react-icons/fa";
import { truncate } from "./utils";
import { useEffect, useRef, useState } from "react";
import LoadingCircle from "./LoadingCircle";
import Watermark from "./Watermark";

function MediaPreview({ media, className, nodesc, scaleType }) {

    let element = (
        <div className={[className, 'flex items-center justify-center w-full h-60 bg-gray-light rounded-md m-2'].join(' ')}>
            <p className="text-gray font-bold italic">Unsupported Media Type</p>
        </div>
    );

    const transformedMedia = {
        ...media,
        type: media.type || 'image'
    };

    switch(transformedMedia.type) {
        case 'image':
            element = <ImagePreview media={transformedMedia} className={className} nodesc={nodesc} scaleType={scaleType} />
            break;
        case 'video':
            element = <VideoPreview media={transformedMedia} className={className} nodesc={nodesc} />
            break;
        case 'audio':
            element = <AudioPreview media={transformedMedia} className={className} nodesc={nodesc} />
    }
    
    return element;
}

function ImagePreview({ media, className, nodesc, scaleType }) {
    const imgClass = () => {
        let result = 'w-full h-full';

        if (scaleType == 'crop') {
            result = 'w-full h-auto';
        }

        return result;
    }

    return (
        <div className={["rounded-md m-2 group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full bg-black flex items-center", className].join(' ')}>
            <img src={media.media} alt={media.title} className={imgClass()}/>
            <article className="absolute w-full max-h-1/2 bg-black/50 text-white top-0 left-0 p-4 -translate-y-full transition-transform group-hover:translate-y-0" hidden={nodesc}>
                <h2 className="mb-2 font-bold">{media.title}</h2>
                <p className="text-sm">{truncate(media.description, 100)}</p>
            </article>
            <Watermark />
        </div>
    )
}

function AudioPreview({ media, className, nodesc }) {
    const [playing, setPlaying] = useState(null);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('ended', () => setPlaying(null));
        }
    }, []);

    const startPlaying = () => {
        audioRef.current.play();
        setPlaying(true);
    }

    const pausePlaying = () => {
        audioRef.current.pause();
        setPlaying(false);
        setLoading(false);
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
        <div className={["min-h-[8rem] rounded-md m-2 group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full bg-black flex items-center", className].join(' ')}>
            <audio className="w-full h-auto" ref={audioRef} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} src={media.media}></audio>
            <article className="absolute w-full max-h-1/2 bg-black/50 text-white top-0 left-0 p-4 -translate-y-full transition-transform group-hover:translate-y-0" hidden={nodesc}>
                <h2 className="mb-2 font-bold">{media.title}</h2>
                <p className="text-sm">{truncate(media.description, 150)}</p>
            </article>
            <button className={controlClasses()} onClick={handleControlClick}>
                {playing ? <FaPause /> : <FaPlay />}
            </button>
            <div className="absolute p-3 rounded-full bg-white opacity-10 flex items-center justify-center left-4">
                <FaHeadphones className="text-2xl" />
            </div>
            {loading && <LoadingCircle className="absolute top-4 right-4" />}
        </div>
    )
}

function VideoPreview({ media, className, nodesc }) {
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
        <div className={["rounded-md m-2 group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full bg-black flex items-center", className].join(' ')}>
            <video className="w-full h-auto" poster={media.thumbnail} ref={videoRef} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)}>
                <source src={media.media} />
            </video>
            <article className="absolute w-full max-h-1/2 bg-black/50 text-white top-0 left-0 p-4 -translate-y-full transition-transform group-hover:translate-y-0" hidden={nodesc}>
                <h2 className="mb-2 font-bold">{media.title}</h2>
                <p className="text-sm">{truncate(media.description, 150)}</p>
            </article>
            <button className={controlClasses()} onClick={handleControlClick}>
                {playing ? <FaPause /> : <FaPlay />}
            </button>
            {loading && <LoadingCircle className="absolute top-4 right-4" />}
            <Watermark />
        </div>
    )
}

export default MediaPreview;