class gltfModelPathProvider
{
    constructor(modelIndexerPath, ignoredVariants = ["glTF-Draco", "glTF-Embedded"])
    {
        this.modelIndexerPath = modelIndexerPath;
        this.ignoredVariants = ignoredVariants;
        this.modelsDictionary = undefined;
    }

    initialize()
    {
        const self = this;
        return axios.get(this.modelIndexerPath).then(response =>
        {
            const modelIndexer = response.data;
            self.populateDictionary(modelIndexer);
        });
    }

    resolve(modelKey)
    {
        return this.modelsDictionary[modelKey];
    }

    getAllKeys()
    {
        return Object.keys(this.modelsDictionary);
    }

    populateDictionary(modelIndexer)
    {
        const modelsFolder = getContainingFolder(this.modelIndexerPath);
        this.modelsDictionary = {};
        for (const entry of modelIndexer)
        {
            if (entry.variants === undefined)
            {
                continue;
            }

            for (const variant of Object.keys(entry.variants))
            {
                if (this.ignoredVariants.includes(variant))
                {
                    continue;
                }

                const fileName = entry.variants[variant];
                const modelPath = combinePaths(modelsFolder, entry.name, variant, fileName);
                let modelKey = getFileNameWithoutExtension(fileName);
                if (variant !== "glTF")
                {
                    modelKey += " (" + variant.replace("glTF-", "") + ")";
                }
                this.modelsDictionary[modelKey] = modelPath;
            }
        }
    }
}