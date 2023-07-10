import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-4">
            <img src="/logo.svg" alt="" className="mb-4" />
            <h1 className="text-2xl mb-4 text-blue">Oops! an error has occurred</h1>
            <p dangerouslySetInnerHTML={{ __html: generateErrorMessage(error.status) }}></p>
        </div>
    )
}

function generateErrorMessage(code) {
    let message = '';
    switch (code) {
        case 404:
            message = "Page not found"
            break;
        default:
            message = 'An unknown error has occurred (code: ' + code + '). Please contact developer at <a href="mailto:contact@bakaranproject.com" class="text-blue">Bakaran Project</a>'
            break;
    }

    return message;
}

export default ErrorPage;