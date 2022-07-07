import makeUrlWithParams from 'utils/makeUrlWithParams';

export interface AjaxError {
    code: number,
    message: string,
    details: string
}

export interface AjaxResponse<TResult> {
    httpStatusCode: number,
    result: TResult | null,
    error: AjaxError | null
}

export function defaultHttpStatusHandler(response: Response) {
    if (response.status === 401) {
        window.location.reload();
        return false;
    }

    return true;
}

function paramsToParamsObject(params: Record<string, any>) : Record<string, string> {
    const paramsObject: Record<string, string> = {};

    for (let key in params) {
        const value = params[key];

        if (value !== null && value !== undefined) {
            paramsObject[key] = String(value);
        }
    }

    return paramsObject;
}

async function makeResult<TResult>(response: Response): Promise<AjaxResponse<TResult>> {
    let json: any;
    
    try {
        json = await response.json();
    }
    catch {
        return {
            httpStatusCode: response.status,
            result: null,
            error: null
        }
    }

    let error: AjaxError | null = null;
    let result: TResult | null = null;

    if (typeof json === 'object' && json !== null && !Array.isArray(json) && (json as Object).hasOwnProperty('error')) {
        error = json['error'] as AjaxError;
    }
    else {
        result = json as TResult;
    }

    return {
        httpStatusCode: response.status,
        result: result,
        error: error
    }
}

class AjaxService {
    async fetchGet<TResult>(url: string, params: Record<string, any> = {}, statusCodeHandler = defaultHttpStatusHandler): Promise<AjaxResponse<TResult>> {
        const paramsObject = paramsToParamsObject(params);

        const response = await fetch(
            makeUrlWithParams(url, paramsObject),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (statusCodeHandler(response)) {
            return makeResult(response);
        }
        else {
            return {
                httpStatusCode: response.status,
                result: null,
                error: null
            }
        }
    }

    async fetchPost<TResult>(url: string, params: Record<string, any> = {}, body: any = null, statusCodeHandler = defaultHttpStatusHandler): Promise<AjaxResponse<TResult>> {
        const paramsObject = paramsToParamsObject(params);

        const requestInit: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (body !== undefined && body !== null) {
            requestInit.body = JSON.stringify(body);
        }

        const response = await fetch(
            makeUrlWithParams(url, paramsObject),
            requestInit
        );

        if (statusCodeHandler(response)) {
            return makeResult(response);
        }
        else {
            return {
                httpStatusCode: response.status,
                result: null,
                error: null
            }
        }
    }
}

const ajaxService = new AjaxService();

export default ajaxService;