export async function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const result = await response.arrayBuffer();
    return result;
}
