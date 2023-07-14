import { createContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import ProgressBar from "./ProgressBar";
import Post from "../api/Post";
import { Button } from "./Button";

const DownloadContext = createContext({});

function DownloadContextProvider({ children }) {
    const [downloads, setDownloads] = useState([]);
    const [show, setShow] = useState(true);
  
    const removeDownload = (id) => {
        setDownloads(downloads.filter(m => m.id !== id));
    };
  
    const addDownload = (post) => {
        const updated = [...downloads];
        updated.push({
            id: +new Date(),
            post,
            abortController: new AbortController(),
        });
        setDownloads(updated);
    };
  
    return (
      <DownloadContext.Provider value={{
            startDownload: (post) => addDownload(post),
            setVisible: setShow
        }}>
        {downloads.length > 0 &&
            <div>
                <Button aria-expanded={show} aria-label={show ? 'hide downloads' : 'show downloads'} className="z-50 group fixed top-0 md:top-2 left-0 md:left-2 grow-0 inline-block" type="button" onClick={() => setShow(!show)}>{show ? (
                    <div className="flex items-center gap-2">
                        <FaEyeSlash />
                        <span className="group-hover:inline hidden">Hide downloads</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <FaEye />
                        <span className="group-hover:inline hidden">Show downloads</span>
                    </div>
                )}</Button>
                <div className={['z-40 md:rounded-md divide-y divide-gray-light top-12 md:top-14 w-full md:left-2 md:w-96 flex flex-col gap-3 p-4 bg-white max-h-[80vh] overflow-auto', show ? 'fixed' : 'hidden'].join(' ')}>
                    <p className="text-lg">Downloads</p>
                    {downloads.map(m => <DownloadBox detail={m} onClose={(id) => removeDownload(id)} key={m.id} />)}
                </div>
            </div>}
        {children}
    </DownloadContext.Provider>
    )
}

function DownloadBox({ detail, onClose }) {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const cancelDownload = () => {
        detail.abortController.abort();
        if (progress.toFixed(0) == 100 && onClose) onClose(detail.id);
    }

    useEffect(() => {
        const download = async () => {
            setLoading(true);
            const result = await Post.downloadMedia(detail.post.download_link, detail.abortController, (p) => {
                setLoading(false);
                setProgress(p.progress * 100);
            });
    
            if (!result) {
                if (onClose) onClose(detail.id);
                return;
            }
    
            const href = URL.createObjectURL(result.data);
            const ext = result.headers['content-type'].split('/')[1];
    
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `${detail.post.title}.${ext}`);
            link.click();
    
            URL.revokeObjectURL(result.data);
        }
        download();
    }, []);

    return (
        <div className={'z-50 w-auto flex flex-col gap-2 p-3 bg-white'}>
            <p className="font-bold">Media: {detail.post.title}</p>
            <div className="flex items-center gap-2">
                <ProgressBar className="grow" value={progress} label={(loading ? 'Preparing for download' : progress === 1 ? 'Download completed' : 'Downloading')} />
                <button className="hover:opacity-50" onClick={cancelDownload} aria-label="cancel download">
                    <FaTimes />
                </button>
            </div>
        </div>
    )
}

export default DownloadContext;
export { DownloadContextProvider }