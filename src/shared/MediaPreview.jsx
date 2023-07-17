import { FaHeadphones, FaPause, FaPlay } from "react-icons/fa";
import { truncate } from "./utils";
import { useEffect, useRef, useState } from "react";
import LoadingCircle from "./LoadingCircle";
import Watermark from "./Watermark";
import Hls from "hls.js";

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
    const [progress, setProgress] = useState(0);

    const videoRef = useRef();
    const hlsRef = useRef();

    useEffect(() => {
        if (videoRef.current) {
            setLoading(true);

            if (Hls.isSupported()) {
                hlsRef.current = new Hls();

                const hls = hlsRef.current;
                hls.on(Hls.Events.MANIFEST_LOADED, function() {
                    setLoading(false);
                });
                hls.loadSource(media.media);
                hls.attachMedia(videoRef.current);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = media.media;
            }
        }
    }, []);

    const startPlaying = () => {
        if (!loading) {
            videoRef.current.play();
            setPlaying(true);
        }
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

    const jumpToPercent = (percent) => {
        videoRef.current.currentTime = percent * videoRef.current.duration;
        setProgress(percent * videoRef.current.duration);
    }

    const updateLevel = (index) => {
        if (hlsRef.current) hlsRef.current.currentLevel = index;
    }

    return (
        <div className={["rounded-md m-2 group relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full bg-black flex items-center", className].join(' ')}>
            <video className="w-full h-auto" ref={videoRef} onEnded={() => setPlaying(null)} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onTimeUpdate={(e) => setProgress(e.target.currentTime)}>
            </video>
            <article className="absolute w-full max-h-1/2 bg-black/50 text-white top-0 left-0 p-4 -translate-y-full transition-transform group-hover:translate-y-0" hidden={nodesc}>
                <h2 className="mb-2 font-bold">{media.title}</h2>
                <p className="text-sm">{truncate(media.description, 150)}</p>
            </article>
            <button className={controlClasses()} onClick={handleControlClick}>
                {playing ? <FaPause /> : <FaPlay />}
            </button>
            {loading && <LoadingCircle className="absolute top-4 right-4" />}
            <VideoBottomBar
                valueSecs={progress} totalSecs={videoRef.current?.duration} onJump={jumpToPercent} 
                currentLevel={hlsRef.current?.currentLevel || -1} levels={hlsRef.current?.levels || []} onLevelChanged={updateLevel} />
            <Watermark />
        </div>
    )
}

function VideoBottomBar({ valueSecs, totalSecs, levels, currentLevel, onLevelChanged, onJump }) {
    const [level, setLevel] = useState(currentLevel);

    const precentages = valueSecs * 100 / totalSecs;
    const progresBarRef = useRef();

    useEffect(() => {
        setLevel(currentLevel);
    }, [currentLevel]);

    const calculateJumps = (e) => {
        if (progresBarRef.current) {
            const jumpToPercent = (e.pageX - (progresBarRef.current.offsetLeft + progresBarRef.current.parentNode.parentNode.offsetLeft)) / progresBarRef.current.offsetWidth;
            if (onJump) onJump(jumpToPercent);
        }
    }

    const changeRes = (toIndex) => {
        if (onLevelChanged) onLevelChanged(toIndex);
        setLevel(toIndex);
    }

    return (
        <div className="bg-black/50 text-white p-4 bottom-0 left-0 w-full group-hover:block absolute hidden z-10">
            <div className="mb-1 flex justify-between">
                <div>
                    <span>{formatTimeFromSeconds(valueSecs)}</span>
                    <span className="ms-1 me-1">/</span>
                    <span>{formatTimeFromSeconds(totalSecs)}</span>
                </div>
                <div>
                    <select className="bg-transparent hover:bg-white/10 disabled:appearance-none" value={level} onChange={(e) => changeRes(e.target.value)} disabled>
                        {levels.map((l, i) => (
                            <option className="bg-black p-2" value={i} key={i}>{l.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full relative bg-white/30 h-1 cursor-pointer" onClick={calculateJumps} ref={progresBarRef}>
                <div className="bg-white h-2 w-2 hover:h-3 hover:w-3 rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: (precentages || 0) + '%' }}></div>
                <div className="h-full bg-white" style={{ width: (precentages || 0) + '%' }}></div>
            </div>
        </div>
    )
}

function formatTimeFromSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const result = `${num2ZeroPadding(m)}:${num2ZeroPadding(s)}`;
    if (!h || h == 0) return result;

    return `${num2ZeroPadding(h)}:${result}`;
}

function num2ZeroPadding(value) {
    return Math.round(value || 0).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        minimumFractionDigits: 0,
        useGrouping: false
    });
}

export default MediaPreview;