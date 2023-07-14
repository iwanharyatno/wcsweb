import { useContext, useEffect, useMemo, useState } from "react";
import { FaImage } from "react-icons/fa";
import MediaPreview from "../../shared/MediaPreview";
import { FormInput, FormTextArea } from "../../shared/FormInput";
import { Button } from "../../shared/Button";
import Post from "../../api/Post";
import MessageBoxContext from "../../shared/MessageBoxContext";
import { useNavigate } from "react-router-dom";
import { Path } from "../../constants";
import { handleErrors } from "../../shared/utils";
import ProgressBar from "../../shared/ProgressBar";

function UploadPage() {
    const [data, setData] = useState({});
    const [step, setStep] = useState(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] =  useState(false);

    const msgBox = useContext(MessageBoxContext);
    const navigate = useNavigate();

    const objectUrl = useMemo(
        () => data.media && URL.createObjectURL(data.media),
        [data.media]
    );
    
    const submitData = async (e) => {
        e.preventDefault();

        if (!data.media) {
            msgBox.showMessage({
                type: 'error',
                message: 'Please select a file'
            });
            return;
        }

        setLoading(true);

        const result = await Post.create(data, (e) => {
            setUploadProgress(e.progress * 100);
        });
        if (handleErrors(msgBox, result)) return;

        setLoading(false);
        msgBox.showMessage({
            type: 'success',
            message: 'Post created successfully!'
        });
        navigate(Path.Index);
    }

    const setFileFromDrop = (e) => {
        e.preventDefault();
        let file = null;

        if (e.dataTransfer.items) {
            const firstItem = [...e.dataTransfer.items][0];
            if (firstItem.kind === 'file') {
                file = firstItem.getAsFile();
            }
        } else {
            file = [...e.dataTransfer.items][0];
        }

        if (!file || !file.type.includes('image') && !file.type.includes('video')) return;
        setData({...data, media: file});
    }

    const renderPreview = (file) => {
        const fileType = file.type.includes('image') ? 'image' : file.type.includes('video') ? 'video' : null;
        const fileName = file.name;

        return (
            <MediaPreview className={'min-h-[18rem]'} media={{
                title: fileName,
                media: objectUrl,
                description: 'Your selected file. This file is what going to be uploaded in this session.',
                type: fileType
            }} />
        )
    }

    useEffect(() => {
        return () => {
            if (data.file) {
                URL.revokeObjectURL(data.file);
            }
        }
    }, [data.file]);

    return (
        <div className="w-full min-h-screen bg-white lg:bg-gray-light/40">
            <div className="max-w-6xl mx-auto p-8">
                <h1 className="text-4xl text-blue font-bold mb-8">New Post</h1>
                <div className="w-full h-1">
                    <div className={'bg-blue-light h-1' + (step === 1 ? ' w-1/2' : ' w-full')}></div>
                </div>
                <form className="lg:grid grid-cols-2 gap-x-4 mt-8" onSubmit={submitData}>
                    <div className={'mb-4 lg:block lg:col-span-2 ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="media" className="font-bold text-blue-dark mb-3 block">Media</label>
                        <label className="flex items-center bg-green/50 p-4 rounded text-white gap-3 mb-3 cursor-pointer" htmlFor="media" onDragOver={(e) => e.preventDefault()} onDrop={setFileFromDrop}>
                            <FaImage className="text-3xl" />
                            <span>Drag & Drop file or browse your computer</span>
                        </label>
                        {data.media && renderPreview(data.media)}
                        <input type="file" accept="image/*, video/*, audio/*" id="media" className="hidden" onChange={(e) => setData({...data, media: e.target.files[0]})} />
                    </div>
                    {loading && <div className={'mb-4 lg:block lg:col-span-2 ' + (step === 2 ? 'block' : 'hidden')}>
                        <ProgressBar value={uploadProgress} label="Uploading" />
                    </div>}
                    <div className={'mb-4 lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="mediagrapher" className="font-bold text-blue-dark mb-3 block">Photographer/Videographer</label>
                        <FormInput type="text" id="mediagrapher" className="border-gray-light w-full bg-white" placeholder="Add Photographer/Videographer" variant="outlined" value={data.creator_name || ''} onChange={(e) => setData({...data, creator_name: e.target.value})} required />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 2 ? 'block' : 'hidden')}>
                        <label htmlFor="event" className="font-bold text-blue-dark mb-3 block">Event</label>
                        <FormInput type="text" id="event" className="border-gray-light w-full bg-white" placeholder="Add Event Title" variant="outlined" value={data.event_name || ''} onChange={(e) => setData({...data, event_name: e.target.value})} required />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="title" className="font-bold text-blue-dark mb-3 block">Title</label>
                        <FormInput type="text" id="title" className="border-gray-light w-full bg-white" placeholder="Add Title" variant="outlined" value={data.title || ''} onChange={(e) => setData({...data, title: e.target.value})} required />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 2 ? 'block' : 'hidden')}>
                        <label htmlFor="program" className="font-bold text-blue-dark mb-3 block">Program</label>
                        <FormInput type="text" id="program" className="border-gray-light w-full bg-white" placeholder="Add Program" variant="outlined" value={data.program_name || ''} onChange={(e) => setData({...data, program_name: e.target.value})} required />
                    </div>
                    <div className={'lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="subject" className="font-bold text-blue-dark mb-3 block">Subject</label>
                        <FormInput type="text" id="subject" className="border-gray-light w-full bg-white" placeholder="Add Subject" variant="outlined" value={data.subject || ''} onChange={(e) => setData({...data, subject: e.target.value})} required />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 2 ? 'block' : 'hidden')}>
                        <label htmlFor="description" className="font-bold text-blue-dark mb-3 block">Description</label>
                        <FormTextArea rows={5} id="description" className="border-gray-light w-full bg-white" placeholder="Add Description" variant="outlined" value={data.description || ''} onChange={(e) => setData({...data, description: e.target.value})} />
                    </div>
                    <div className="col-span-2 flex gap-2 items-center justify-end mt-8">
                        <Button type="button" onClick={() => setStep(2)} className={'lg:hidden ' + (step === 1 ? 'block' : 'hidden')}>Next</Button>
                        <Button type="button" onClick={() => setStep(1)} className={'lg:hidden ' + (step === 2 ? 'block' : 'hidden')}>Back</Button>
                        <Button type="submit" className={'lg:block ' + (step === 2 ? 'block' : 'hidden')}>Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadPage;