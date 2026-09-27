export const SITE_TITLE = 'The Studio by Kristoff Malejczuk';
export const AUTHOR = 'Kristoff Malejczuk';
export const GOOGLE_ANALYTICS_ID = 'G-B637RMTJB4';

/**
 * Who you are, for search engines: every page names you as its author, and the home page
 * describes you in full, so Google can connect this site and your profiles to your name.
 */
export const PERSON = {
	name: AUTHOR,
	/** Photo under src/images/. */
	image: 'home/alley.jpeg',
	/** Your profiles elsewhere. */
	sameAs: ['https://www.youtube.com/@thestudiowithkristoff', 'https://x.com/malejczukk'],
};

/** Preview image for shared links when a page doesn't set its own (a photo under src/images/). */
export const DEFAULT_SHARE_IMAGE = {
	path: 'share/kristoff.jpeg',
	alt: 'Kristoff in front of green trees on a sunny day',
};
