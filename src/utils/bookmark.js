import { authApis, endpoints } from "../configs/Apis";

export const addBookmark = async (jobId) => {
    await authApis().post(
        endpoints.bookmark(jobId)
    );
};

export const removeBookmark = async (jobId) => {
    await authApis().delete(
        endpoints.unBookmark(jobId)
    );
};

export const getBookmarks = async () => {
    const res = await authApis().get(
        endpoints.bookmarks
    );

    return res.data.data;
};