function ProgressBar({ className, value, label }) {
    return (
        <div className={["relative py-2 px-4 rounded-md bg-gray-light", className].join(' ')}>
            <div className={['rounded-md absolute left-0 top-0 h-full', (value.toFixed(0) == 100 ? 'bg-blue-medium text-white' : 'bg-gradient-to-r from-green-light from-30% via-white to-green-light to-70% bg-[length:200%] animate-loadingBar')].join(' ')} style={{ width: value + '%' }}></div>
            <span className="relative">
                {value.toFixed(0) == 100 ? (
                    'Completed'
                ) : (
                    `${label}... (${value.toFixed(2)}%)`
                )}
            </span>
        </div>
    )
}

export default ProgressBar;