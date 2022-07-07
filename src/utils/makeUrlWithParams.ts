export default function makeUrlWithParams(urlWithoutParams: string, params: Record<string, string>) {
    const paramsStr = (new URLSearchParams(params)).toString();

    return paramsStr.length > 0
        ? urlWithoutParams + '?' + paramsStr
        : urlWithoutParams;
}