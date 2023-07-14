function ProgressBar({ className, value, label }) {
    return (
        <div className={["relative py-2 px-4 rounded-md bg-gray-light", className].join(' ')}>
            <div className="rounded-md absolute top-0 left-0 bg-gradient-to-r from-green-light from-30% via-white to-green-light to-70% bg-[length:200%] animate-loadingBar h-full" style={{ width: value + '%' }}></div>
            <span className="relative">{label}... {value.toFixed(2)}%</span>
        </div>
    )
}

export default ProgressBar;