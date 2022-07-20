import { useErrorStore } from '../stores/error'

const API_VERSION = 1;

class ConfigurationError extends Error {
	constructor(message) {
		super(message);
	}
}

class MinifluxApi {
	constructor(serverURL, apiKey) {
		try {
			serverURL = serverURL.trim();
			apiKey = apiKey.trim();

			if (!serverURL || !apiKey) {
				throw new ConfigurationError('Missing required Settings: Host and/or API Key');
			}
			if (serverURL.endsWith('/')) {
				serverURL = serverURL.slice(0, -1);
			}
			this._base_url = serverURL;
			this._api_key = apiKey;
		} catch (e) {
			const errorStore = useErrorStore();
			if (e instanceof ConfigurationError) {
				errorStore.setError(e, e.message, 'Configuration Error');
			} else {
				errorStore.setError(e, e.message);
			}
		}
	}

	#getEndpoint(resource) {
		return `${this._base_url}/v${API_VERSION}/${resource}`;
	}

	static #orderOptions = [
		{ name: 'Published At', value: 'published_at'},
		{ name: 'Entry ID', value: 'id'},
		{ name: 'Entry Status', value: 'status'},
		{ name: 'Entry Created At', value: 'created_at'},
		{ name: 'Category Title', value: 'category_title'},
		{ name: 'Category ID', value: 'category_id'}
	];

	static get orderOptions() {
		return MinifluxApi.#orderOptions;
	}

	static #directionOptions = [
		{ name: 'Descending', value: 'desc'},
		{ name: 'Ascending', value: 'asc'},
	];

	static get directionOptions() {
		return MinifluxApi.#directionOptions;
	}

	static #statusOptions = [
		{ name: 'Unread Only', value: ['unread']},
		{ name: 'All', value: ['unread', 'read']},
	];

	static get statusOptions() {
		return MinifluxApi.#statusOptions;
	}

	#buildQueryString(filters) {
		let queryString = Object.keys(filters).map(key => {
			if(Array.isArray(filters[key])) {
				return filters[key].map(value => {
					return key + '=' + value;
				}).join('&');
			} else {
				return key + '=' + filters[key];
			}
		}).join('&');
		return queryString;
	}

	async apiCall(method, url, body = null) {
		const params = { headers: { 'X-Auth-Token': this._api_key } };
		if (body) {
			params['method'] = method;
			params['body'] = JSON.stringify(body);
		}

		return fetch(url, params)
			.then((r) => {
				if (!r.ok) {
					throw r;
				}
				if (r.status === 204) {
					return r;
				}
				const contentType = r.headers.get('content-type');
				if (contentType && contentType.indexOf('application/json') !== -1) {
					return r.json();	
				} else {
					return r.text();
				}
			})
			.catch(async (e) => {
				const errorStore = useErrorStore();
				console.log(e);
				if (e instanceof TypeError) {
					errorStore.setError(e, e.message, 'Type Error');
				} else if (e instanceof Response) {
					const contentType = e.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1) {
						let r = await e.json();
						errorStore.setError(e, e.status + ': ' + r['error_message'], 'Response Error')
					} else {
						let r = await e.text();
						errorStore.setError(e, e.status + ': ' + r, 'Response Error')
					}
				} else if (typeof e === 'object') {
					errorStore.setError(e, e.message, e.constructor.name + ' Error');
				} else {
					errorStore.setError(e, String(e), 'Unknown Error');
				}
			});
	}

	/**
	 * Get Miniflux Version
	 * @returns {String}
	 */
	async getVersion() {
		let r = await fetch(`${this._base_url}/version`);
		return await r.text();
	}

	/**
	 * Get Miniflux Status
	 * @returns {String}
	 */
	async healthCheck() {
		let r = await fetch(`${this._base_url}/healthcheck`);
		return await r.text();
	}

	/**
	 * Returns the information for the current logged in user 
	 * @returns {Object}
	 */
	async me() {
		return await this.apiCall('GET', this.#getEndpoint(`me`));
	}

	/**
	 * Creates a OPML file for the current User
	 * @returns {String}
	 */
	async exportFeeds() {
		return await this.apiCall('GET', this.#getEndpoint(`export`));
	}

	/**
	 * Imports a OPML file for the current User
	 * @returns {Object} With 'message'
	 */
	async importFeeds(opml) {
		return await this.apiCall('POST', this.#getEndpoint(`import`), opml);
	}

	/**
	 * Find Subscriptions from the provided URL
	 * @returns {Array}
	 */
	// discover try to find subscriptions from a website
	async discover(url) {
		return await this.apiCall('POST', this.#getEndpoint(`discover`), { "url": url });
	}

	/**
	 * Gets info for all feeds
	 * @returns {Array}
	 */
	async getFeeds() {
		return await this.apiCall('GET', this.#getEndpoint(`feeds`));
	}

	/**
	 * Create a new field
	 * @returns {Object} with the new "feed_id"
	 */
	async createFeed(feedObj) {
		return await this.apiCall('POST', this.#getEndpoint(`feeds`), feedObj);
	}

	/**
	 * Get the "reads" and "unreads" counters for all feeds
	 * @returns {Object}
	 */
	async getFeedCounters() {
		return await this.apiCall('GET', this.#getEndpoint(`feeds/counters`));
	}

	/**
	 * Refresh all feeds in a bckground process
	 * @returns {Null} Only status code
	 */
	async refreshAllFeeds() {
		return await this.apiCall('PUT', this.#getEndpoint(`feeds/refresh`));
	}

	/**
	 * Refresh a specific feed synchronously
	 * @returns {Null} Only status code
	 */
	async refreshFeed(feed_id) {
		return await this.apiCall('PUT', this.#getEndpoint(`feeds/${feed_id}/refresh`));
	}

	/**
	 * Gets the info for a feed
	 * @returns {Object}
	 */
	async getFeed(feed_id) {
		return await this.apiCall('GET', this.#getEndpoint(`feeds/${feed_id}`));
	}

	/**
	 * Update the info for a feed
	 * @returns {Object}
	 */
	async updateFeed(feed_id, feedObj) {
		return await this.apiCall('PUT', this.#getEndpoint(`feeds/${feed_id}`), feedObj);
	}

	/**
	 * Remove a feed
	 * @returns {Null}
	 */
	async deleteFeed(feed_id) {
		return await this.apiCall('DELETE', this.#getEndpoint(`feeds/${feed_id}`));
	}

	/**
	 * Get the Icon for a feed
	 * @returns {Object}
	 */
	async getFeedIcon(feed_id) {
		return await this.apiCall('GET', this.#getEndpoint(`feeds/${feed_id}/icon`));
	}

	/**
	 * Mark all entries for a feed as read
	 * @returns {Null}
	 */
	async markFeedEntriesAsRead(feed_id) {
		return await this.apiCall('PUT', this.#getEndpoint(`feeds/${feed_id}/mark-all-as-read`));
	}

	/**
	 * Get entries for a feed
	 * @returns {Object}
	 */
	async getFeedEntries(feed_id, filters) {
		let url = this.#getEndpoint(`feeds/${feed_id}/entries`);
		let queryString = this.#buildQueryString(filters);
		if (queryString) {
			url = url + '?' + queryString;
		}
		return await this.apiCall('GET', url);
	}

	/**
	 * Get a entry for a feed
	 * @returns {Object}
	 */
	async getFeedEntry(feed_id, entry_id) {
		return await this.apiCall('GET', this.#getEndpoint(`feeds/${feed_id}/entries/${entry_id}`));
	}

	/**
	 * Get entries accross all feeds
	 * @returns {Object}
	 */
	async getEntries(filters) {
		let url = this.#getEndpoint(`entries`);
		let queryString = this.#buildQueryString(filters);
		if (queryString) {
			url = url + '?' + queryString;
		}
		return await this.apiCall('GET', url);
	}

	/**
	 * Update status of a list of entries
	 * @returns {Null}
	 */	
	async updateEntries(entry_ids, status) {
		let data = {"entry_ids": entry_ids, "status": status};
		return await this.apiCall('PUT', this.#getEndpoint(`entries`), data);
	}

	/**
	 * Get info for an entry
	 * @returns {Object}
	 */
	async getEntry(entry_id) {
		return await this.apiCall('GET', this.#getEndpoint(`entries/${entry_id}`));
	}

	/**
	 * Toggle Entry Bookmark
	 * @returns {Null}
	 */
	async toggleBookmark(entry_id) {
		return await this.apiCall('PUT', this.#getEndpoint(`entries/${entry_id}/bookmark`));
	}

	/**
	 * Get Original Article for entry
	 * @returns {Object}
	 */
	async fetchEntryContent(entry_id) {
		return await this.apiCall('GET', this.#getEndpoint(`entries/${entry_id}/fetch-content`));
	}

	/**
	 * Get info for all Categories
	 * @returns {Array}
	 */
	async getCategories() {
		return await this.apiCall('GET', this.#getEndpoint(`categories`));
	}

	/**
	 * Create a Category
	 * @returns {Object}
	 */
	async createCategory(title) {
		let data = {"title": title};
		return await this.apiCall('POST', this.#getEndpoint(`categories`), data);
	}

	/**
	 * Update the title for a Category
	 * @returns {Object}
	 */
	async updateCategory(category_id, title) {
		let data = {"id": category_id, "title": title};
		return await this.apiCall('PUT', this.#getEndpoint(`categories/${category_id}`), data);
	}

	/**
	 * Remove a Category
	 * @returns {Null}
	 */
	async deleteCategory(category_id) {
		return await this.apiCall('DELETE', this.#getEndpoint(`categories/${category_id}`));
	}

	/**
	 * Marks all entries in a Category as Read
	 * @returns {Null}
	 */
	async markCategoryEntriesAsRead(category_id) {
		return await this.apiCall('PUT', this.#getEndpoint(`categories/${category_id}/mark-all-as-read`));
	}

	/**
	 * Get feeds in a Category
	 * @returns {Array}
	 */	
	async getCategoryFeeds(category_id) {
		return await this.apiCall('GET', this.#getEndpoint(`categories/${category_id}/feeds`));
	}

	/**
	 * Get entries in a Category
	 * @returns {Object}
	 */
	async getCategoryEntries(category_id, filters) {
		let url = this.#getEndpoint(`categories/${category_id}/entries`);
		let queryString = this.#buildQueryString(filters);
		if (queryString) {
			url = url + '?' + queryString;
		}
		return await this.apiCall('GET', url);
	}

	/**
	 * Get entry in a Category
	 * @returns {Object}
	 */
	async getCategoryEntry(category_id, entry_id) {
		return await this.apiCall('GET', this.#getEndpoint(`categories/${category_id}/entries/${entry_id}`));
	}

	/**
	 * Get info for all users
	 * @returns {Array}
	 */
	async getUsers() {
		return await this.apiCall('GET', this.#getEndpoint(`users`));
	}

	/**
	 * Create a new User
	 * @returns {Object}
	 */
	async createUser(username, password, is_admin) {
		let data = {"username": username, "password": password, "is_admin": is_admin}
		return await this.apiCall('POST', this.#getEndpoint(`users`), data);
	}

	/**
	 * Get info for a User
	 * @returns {Object}
	 */
	async getUserById(user_id) {
		return await this.apiCall('GET', this.#getEndpoint(`users/${user_id}`));
	}

	/**
	 * Get info for a User
	 * @returns {Object}
	 */
	async getUserByUsername(username) {
		return await this.apiCall('GET', this.#getEndpoint(`users/${username}`));
	}

	/**
	 * Update info for a User
	 * @returns {Object}
	 */
	async updateUser(user_id, data) {
		return await this.apiCall('PUT', this.#getEndpoint(`users/${user_id}`), data);
	}

	/**
	 * Remove a User
	 * @returns {Null}
	 */
	async deleteUser(user_id) {
		return await this.apiCall('DELETE', this.#getEndpoint(`users/${user_id}`));
	}

	/**
	 * Mark all entries for a user as Read
	 * @returns {Object}
	 */
	async markUserEntriesAsRead(user_id) {
		return await this.apiCall('PUT', this.#getEndpoint(`users/${user_id}/mark-all-as-read`));
	}
}

export {MinifluxApi};
