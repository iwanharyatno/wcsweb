import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import MediaPreview from "../../shared/MediaPreview";
import { FormInput, FormTextArea } from "../../shared/FormInput";
import { Button } from "../../shared/Button";

function UploadPage() {
    const [data, setData] = useState({});
    const [step, setStep] = useState(1);
    
    const submitData = (e) => {
        e.preventDefault();
    }

    const renderPreview = (file) => {
        const fileType = file.type.includes('image') ? 'image' : 'video';
        const fileName = file.name;

        return (
            <MediaPreview className={'min-h-[18rem]'} media={{
                title: fileName,
                src: URL.createObjectURL(file),
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
                        <label className="flex items-center block bg-green/50 p-4 rounded text-white gap-3 mb-3" htmlFor="media">
                            <FaImage className="text-3xl" />
                            <span>Drag & Drop file or browse your computer</span>
                        </label>
                        {data.file && renderPreview(data.file)}
                        <input type="file" accept="image/*, video/*, audio/*" id="media" className="hidden" onChange={(e) => setData({...data, file: e.target.files[0]})} />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="mediagrapher" className="font-bold text-blue-dark mb-3 block">Photographer/Videographer</label>
                        <FormInput type="text" id="mediagrapher" className="border-gray-light w-full bg-white" placeholder="Add Photographer/Videographer" variant="outlined" value={data.mediagrapher || ''} onChange={(e) => setData({...data, mediagrapher: e.target.value})} />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 2 ? 'block' : 'hidden')}>
                        <label htmlFor="event" className="font-bold text-blue-dark mb-3 block">Event</label>
                        <FormInput type="text" id="event" className="border-gray-light w-full bg-white" placeholder="Add Event Title" variant="outlined" value={data.eventTitle || ''} onChange={(e) => setData({...data, eventTitle: e.target.value})} />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="title" className="font-bold text-blue-dark mb-3 block">Title</label>
                        <FormInput type="text" id="title" className="border-gray-light w-full bg-white" placeholder="Add Title" variant="outlined" value={data.title || ''} onChange={(e) => setData({...data, title: e.target.value})} />
                    </div>
                    <div className={'mb-4 lg:block ' + (step === 2 ? 'block' : 'hidden')}>
                        <label htmlFor="program" className="font-bold text-blue-dark mb-3 block">Program</label>
                        <FormInput type="text" id="program" className="border-gray-light w-full bg-white" placeholder="Add Program" variant="outlined" value={data.program || ''} onChange={(e) => setData({...data, program: e.target.value})} />
                    </div>
                    <div className={'lg:block ' + (step === 1 ? 'block' : 'hidden')}>
                        <label htmlFor="subject" className="font-bold text-blue-dark mb-3 block">Subject</label>
                        <FormInput type="text" id="subject" className="border-gray-light w-full bg-white" placeholder="Add Subject" variant="outlined" value={data.subject || ''} onChange={(e) => setData({...data, subject: e.target.value})} />
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