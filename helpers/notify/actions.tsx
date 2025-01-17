import { toast } from "react-toastify";

const defaultParams = {
    theme: "colored",
}

const errorMessageHandler = (message: string | string[]) => {
    if (typeof message == 'string') return message
    else {
        return <ul>
            {message.map(error => (
                <li className="m-b-10">{error}</li>
            ))}
        </ul>
    }
}

export const notify = {
    success : (message: string | string[], params:any={}) => {
        toast.success(errorMessageHandler(message), {
            ...defaultParams,
            ...params
        });
    },
    error : (message: string | string[], params:any={}) => {
        toast.error(errorMessageHandler(message), {
            ...defaultParams,
            ...params
        });
    },
    warning : (message: string | string[], params:any={}) => {
        toast.warn(errorMessageHandler(message), {
            ...defaultParams,
            ...params
        });
    },
    info : (message: string | string[], params:any={}) => {
        toast.info(errorMessageHandler(message), {
            ...defaultParams,
            ...params
        });
    }
};