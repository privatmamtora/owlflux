import { CustomError } from './error';

class MinifluxApi {
	constructor(serverURL, apiKey) {
		serverURL = serverURL.trim();
		apiKey = apiKey.trim();

		if (!serverURL || !apiKey) {
			throw new CustomError('Missing required Settings: Host and/or API Key', 'Configuration Error')
		}
		if (serverURL.endsWith('/')) {
			serverURL = serverURL.slice(0, -1);
		}
        this.server = serverURL;
        this.token = apiKey;
    }

    async apiCall(method, resource, body = null) {
		const params = { headers: { 'X-Auth-Token': this.token } };
		if (body) {
			params['method'] = method;
			params['body'] = JSON.stringify(body);
		}
		const url = this.server + '/v1/' + resource;

		return fetch(url, params)
			.then((r) => {
				if (!r.ok) {
					throw r;
				}
				if (r.status === 204) {
					return r;
				}
				return r.json();
			})
			.catch(async (e) => {
				console.log(e);
				if (e instanceof TypeError) {
					throw new CustomError(e.message, 'Type Error');
				} else if (e instanceof Response) {
					const contentType = e.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1) {
						let r = await e.json();
						throw new CustomError(e.status + ': ' + r['error_message'],'Response Error');
					} else {
						let r = await e.text();
						throw new CustomError(e.status + ': ' + r, 'Response Error');
					}
				} else if (typeof e === 'object') {
					throw new CustomError(e.message, e.constructor.name + ' Error');
				} else {
					throw new CustomError(String(e), 'Unknown Error');
				}
				// return Promise.reject()
			});
    }

    async get_feeds() {
		return await this.apiCall('GET', 'feeds');
    }
  //   apiCall(u + (u.includes('?') ? '&' : '?') + 
  //   	'limit=' + (parseInt(localStorage.getItem('fetch_limit')) || 100) + 
  //   	'&order=published_at&direction=' + (sortOldFirst ? 'asc' : 'desc') + 
  //   	(showRead ? '' : '&status=unread'),
		// props.errorHandler
		// )
}

export {MinifluxApi};
// export function apiCall(resource, errorHandler, body = null) {
// 	const server = localStorage.getItem('miniflux_server')
// 	const token = localStorage.getItem('miniflux_api_key')
// 	if (!(server && token)) {
// 		errorHandler('Server settings not configured.')
// 		return new Promise((x, y) => {
// 			return null
// 		})
// 	}

// 	const params = { headers: { 'X-Auth-Token': token } }
// 	if (body) {
// 		params['method'] = 'PUT'
// 		params['body'] = JSON.stringify(body)
// 	}

// 	const url = server + '/v1/' + resource
// 	const err = (resource) => errorHandler(resource + ' (' + url + ')')

// 	return fetch(url, params)
// 		.then((r) => {
// 			if (!r.ok) {
// 				throw r
// 			}
// 			if (r.status === 204) {
// 				return r
// 			}
// 			return r.json()
// 		})

// 		.catch((e) => {
// 			if (e instanceof TypeError) {
// 				err(e.message)
// 			} else if (e instanceof Response) {
// 				const contentType = e.headers.get('content-type')
// 				if (
// 					contentType &&
// 					contentType.indexOf('application/json') !== -1
// 				) {
// 					e.json().then((msg) => err(msg['error_message']))
// 				} else {
// 					e.text().then((msg) => err(msg))
// 				}
// 			} else {
// 				err(String(e))
// 			}
// 			return Promise.reject()
// 		})
// }