async function getGradioClient(spaceUrl) {
    const { Client } = await import("@gradio/client");
    return Client.connect(spaceUrl);
}

export default getGradioClient;