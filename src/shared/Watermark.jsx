function Watermark() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
            <img src="/banner.png" className="w-48"/>
        </div>
    );
}

export default Watermark;