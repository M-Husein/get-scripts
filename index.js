/** Dynamic load scripts.
 * @param {string} urls - The scripts to load.
 * @returns {Promise} - A Promise instance. */

export default function getScripts(urls, to = 'body'){
  return Promise.all(urls.map(url => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const loadend = () => {
      script.onerror = null;
      script.onload = null;
    };

    script.onerror = (e) => {
      const err = new Error(`Failed to load script: ${url}`);

      err.url = url;
      err.data = e;

      loadend();
      reject(err);
    };

    script.onload = (e) => {
      let i = {
        data: e,
        url: url
      };
      loadend();
      resolve(i);
    };

    script.async = 1;// true

    // script.textContent
    url.code ? script.text  = url.code : script.src = url;

    // Set more valid attributes to script tag
    // ...

    document[to].appendChild(script);// parent.appendChild(script);
  })));
}

// getScripts(
// 	[
// 		{code: `function Ok(say){console.log('%cOK ' + say, 'color:red;');}Ok('Bro');`}
// 	],
// 	// ['/js/jquery.js'],
// 	'head'
// ).then(e => {
// 	// console.log(window.jQuery);
// 	console.log(e);
// });
