/** Dynamic scripts loading for modern browsers - https://github.com/fengyuanchen/load-scripts
 * @param {string} urls - The scripts to load.
 * @returns {Promise} - A Promise instance. */

import {isObj, setAttr, domQ} from '../utils';// 
import {omit} from '../components/q-ui-bootstrap/utils'; 

export default function getScripts(attrs, to = 'body'){
  return Promise.all(attrs.map((v, i) => new Promise((resolve, reject) => {
		if(domQ(`[src="${v.src}"]`)) return;// MAKE SURE...!!!
		
		const DOC = document;
		const script = DOC.createElement('script');
		const loadend = () => {
			script.onerror = null;
			script.onload = null;
		};

		script.onerror = function(e){
			const err = new Error(`Failed to load script: ${v.src ? v.src : i}`);

			// err.data = v.src || v.text;
			err.e = e;

			loadend();
			reject(err);
		};

		script.onload = function(e){
			// let i = {
				// e: e,
				// data: v.src || v.text
			// };
			loadend();
			resolve(e);
		};
		
		script.async = v.attrs && v.attrs.async ? v.attrs.async : 1;

		// Set more valid attributes to script tag
		if(isObj(v.attrs)){ // 
			let omitAttr = omit(v.attrs, ['text','async','onerror','onload']);
			// console.log(omitAttr);
			setAttr(script, omitAttr);
			/* // Available attributes script tag
				{
					type: "",
					noModule: false,
					async: true,
					defer: false,
					crossOrigin: null,
					text: "",
					referrerPolicy: null,
					event: "",
					integrity: ""
				}
			*/
			// script.async = v.attrs.async ? v.attrs.async : 1;// true
		}
		
		script.src = v.src;
		// v.src ? script.src = v.src : script.text  = v.text; // script.textContent

		DOC[to].appendChild(script);// parent.appendChild(script);
		
		// Return script tag to resolve then if internal code
		// if(resolve && v.text) resolve(script);
  })));
}

/** @USAGE: */
/* getScripts(
	[
    {text: `function Ok(say){console.log('%cOK ' + say, 'color:red;');}Ok('Bro');`},
    {src: '/js/axios.min.js', 
      attrs:{
        src: '/js/sweetalert2/sweetalert2.min.js',
        defer:"",
        onerror: () => {}
      }
    }
	],
	// ['/js/axios.min.js'],
	'head'
).then(e => {
	// console.log(window.pdfMake);
	console.log(e);
}); */
