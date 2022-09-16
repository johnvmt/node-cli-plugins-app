import startCliApp from "cli-app-startup";
import importScripts from "./importScripts.js";

export default (pluginsDir, appOptions = {}) => {
	const startAppWithConfig = async (appConfig) => {
		const plugins = {};
		const pluginScripts = await importScripts(pluginsDir);
		for(let [scriptName, scriptImport] of Object.entries(pluginScripts)) {
			const scriptMeta = {
				type: 'plugin',
				name: scriptName
			}

			const scriptOptions = {
				script: scriptMeta,
				plugins: plugins,
				appConfig: appConfig
			}

			if(appOptions.logger) {
				scriptOptions.logger = appOptions.logger.child({
					label: `${scriptMeta.type}/${scriptMeta.name}`
				});
			}

			try {
				const plugin = await scriptImport(scriptOptions);

				Object.assign(plugins, plugin); // all keys from plugin's returned object are merged in
			}
			catch(error) {
				if(scriptOptions.logger)
					scriptOptions.logger.error(error.message);
			}
		}

		return plugins;
	};

	return startCliApp(startAppWithConfig, appOptions);
}
