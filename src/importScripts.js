// import scripts v0.0.3
import glob from "glob";
import path from "path";
import ExtendedError from "./ExtendedError.js";

const importScripts = async (scriptsDir, enabledScriptBasenames) => {
    const imports = {};

    const files = glob.sync("*.{js,mjs,cjs}", {
        cwd: scriptsDir
    });

    for(let file of files) {
        const basename = path.parse(file).name;

        if(!Array.isArray(enabledScriptBasenames) || (Array.isArray(enabledScriptBasenames) && enabledScriptBasenames.includes(basename))) {
            if(imports.hasOwnProperty(basename))
                throw new ExtendedError(`Duplicate modules "${basename}"`, {code: "duplicate_import"});

            imports[basename] = (await import(path.join(scriptsDir, file))).default; // must have a default import
        }
    }

    return imports;
}

export default importScripts;
