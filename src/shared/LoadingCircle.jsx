function LoadingCircle({ className }) {
    return (
        <div className={["w-8 h-8 rounded-full border-4 border-white/75 border-t-transparent animate-spin", className].join(' ')}></div>
    )
}

export default LoadingCircle;