import { LinkButton } from "../../shared/Button";
import NavBar from "../partials/NavBar";
import MediaPreview from "../../shared/MediaPreview";
import { Path } from "../../Routes";

function HomePage() {
    return (
        <>
            <NavBar />
            <main className="px-8 max-w-5xl mx-auto">
                <img src="/banner.png" alt="" className="w-full md:w-auto md:mx-auto my-12" />
                <div className="md:grid grid-cols-2">
                    {getSrc(2).map(src => (
                    <MediaPreview className="h-72" key={src} media={{
                        src: "https://drive.google.com/file/d/1-sD6pflxOOJ1ul9q4G3h_qkgau9v9zb5/preview",
                        title: 'Lorem ipsum dolor sit amet',
                        description: 'Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla.',
                        type: 'image'
                    }} />))}
                    <MediaPreview className="h-72" media={{
                        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        thumbnail: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
                        title: 'Elephant Dream',
                        description: 'The first Blender Open Movie from 2006',
                        type: 'video'
                    }} />
                    <MediaPreview className="h-72" media={{
                        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        thumbnail: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
                        title: 'Big Buck Bunny',
                        description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain\'t no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org',
                        type: 'video'
                    }} />
                </div>
                <div className="text-center mt-4 mb-8">
                    <LinkButton to={Path.MediaList.Index} variant="pill" className="inline-block min-w-[16rem]">See More</LinkButton>
                </div>
            </main>
        </>
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