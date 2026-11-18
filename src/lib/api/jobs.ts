const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
export const getJobs = async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    const data = res.json();
    return data;
};


export const getJobById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    const data = res.json();
    return data;
};
