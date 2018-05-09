
import * as Uri from 'urijs';

export function getQueryStringParameter(name) {
    const parameters = Uri(window.location.href).query(true);
    return parameters[name];
}