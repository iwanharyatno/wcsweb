import { useEffect, useState } from "react";
import NavBar from "../../partials/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { Path } from "../../../Routes";
import { Button } from "../../../shared/Button";
import { FaCalendarAlt, FaCamera, FaClock, FaMapMarkerAlt, FaStar, FaTasks } from "react-icons/fa";

function MediaDetailPage() {
    const [media, setMedia] = useState(null);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        setMedia({
            id: params.id,
            src: 'https://picsum.photos/1920/720',
            date: new Date(),
            location: 'Picsum',
            title: 'Lorem ipsum dolor sit amet',
            description: 'Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla. Lorem ipsum dolor sit amet, consetetur adispicing elit aliquam nulla.',
            type: 'image',
            mediagrapher: 'Dolorem Ipsum',
            event: 'Global Nature Photography',
            program: 'Global Nature',
            user: {
                firstName: 'Lorem',
                lastName: 'Ipsum'
            }
        });
    }, [params]);

    return (
        <div>
            <NavBar action="Register User" onAction={() => navigate(Path.Admin.NewUser)} />
            {media &&
                <div>
                    <div className="md:col-span-12 bg-cover w-full min-h-[12rem] md:min-h-[24rem]" style={{ backgroundImage: "url('" + media.src +"')" }}></div>
                    <div className="md:grid gap-4 items-start md:grid-cols-12 max-w-6xl pb-8 mx-8 md:mx-auto mt-12">
                        <article className="md:col-span-5">
                            <h1 className="text-blue-dark fw-bold mb-5 text-4xl">{media.title}</h1>
                            <p className="text-blue-light mb-2">{media.user.firstName + ' ' + media.user.lastName}</p>
                            <div className="grid md:grid-cols-2 gap-x-5 mb-8">
                                <MediaMeta icon={<FaCamera />} value={media.mediagrapher} />
                                <MediaMeta icon={<FaMapMarkerAlt />} value={media.location} />
                                <MediaMeta icon={<FaStar />} value={media.event} />
                                <MediaMeta icon={<FaCalendarAlt />} value={new Date(media.date).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                                <MediaMeta icon={<FaTasks />} value={media.program} />
                                <MediaMeta icon={<FaClock />} value={dateFromTime('09:00:00').toLocaleTimeString(undefined, { timeStyle: 'short' })} />
                            </div>
                            <h2 className="text-3xl fw-bold text-blue-dark mb-4">About the Media</h2>
                            <p className="text-gray">{media.description}</p>
                        </article>
                        <form className="shadow-2xl rounded-2xl p-4 md:col-start-8 md:col-span-5 text-blue-dark text-center mt-8" action={media.src}>
                            <Button type="submit" className="w-full block">Download</Button>
                        </form>
                    </div>
                </div>}
        </div>
    )
}

function MediaMeta({ icon, value, className }) {
    return (
        <div className={["flex items-center gap-4 py-4 text-blue-light", className].join(' ')}>
            <span className="text-blue-dark">{icon}</span> <span>{value}</span>
        </div>
    )
}

function dateFromTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
}

export default MediaDetailPage;