import createImageUrlBuilder from "@sanity/image-url";
import { buildFileUrl } from "@sanity/asset-utils"

const imageBuilder = createImageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
});

export const urlForImage = (source: any) => {
    if (!source?.asset?._ref) {
        return undefined;
    }

    return imageBuilder?.image(source).auto("format").fit("max");
};

export const getSanityFileUrl = (sanityFile:any) => {
    if (!sanityFile || !sanityFile.asset || !sanityFile.asset._ref) {
        console.error("Invalid sanity file object:", sanityFile);
        return null;
    }

    const { projectId, dataset } = {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
    };

    const { _ref } = sanityFile.asset;

    // Extract the file extension from the reference
    const [assetId, extension] = _ref.split('-').slice(1);

    if (!assetId || !extension) {
        console.error("Invalid file reference:", _ref);
        return null;
    }

    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${extension}`;
};
