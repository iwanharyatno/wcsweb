import { Link } from "react-router-dom";

function Button({ variant, size, className, background, children, ...rest }) {
    const classes = fromVariantAndSize(variant, size);
    const color = className?.includes('text-') ? '' : (variant === 'outlined') ? '' : 'text-white disabled:text-gray';
    const bg = background ? background : (variant !== 'outlined') ? 'bg-blue hover:bg-blue/75' : '';


    return (
        <button {...rest} className={[classes, className, color, bg].join(' ')}>
            {children}
        </button>
    )
}

function LinkButton({ variant, size, className, background, children, ...rest }) {
    const classes = fromVariantAndSize(variant, size);
    const color = className?.includes('text-') ? '' : (variant === 'outlined') ? '' : 'text-white disabled:text-gray';
    const bg = background ? background : (variant !== 'outlined') ? 'bg-blue hover:bg-blue/75' : '';

    return (
        <Link {...rest} className={[classes, className, color, bg].join(' ')}>
            {children}
        </Link>
    )
}

function fromVariantAndSize(variant, size) {
    const variantClass = fromVariant(variant);
    const sizeClass = fromSize(size);

    return [variantClass, sizeClass].join(' ');
}

function fromVariant(variant) {
    let result = 'text-center disabled:bg-gray-light disabled:text-gray';

    switch (variant) {
        case 'outlined':
            result = 'text-blue rounded-full border hover:underline transition-all disabled:bg-gray-light disabled:text-gray'
            break;
        case 'pill':
            result += ' rounded-full'
            break;
        default:
            result += ' rounded'
            break;
    }

    return result;
}
function fromSize(size) {
    let result;

    switch (size) {
        case 'sm':
            result = 'px-2 py-1 fs-sm';
            break;
        case 'lg':
            result = 'px-6 py-3';
            break;
        default:
            result = 'px-4 py-2';
    }

    return result;
}

export {
    Button,
    LinkButton
}