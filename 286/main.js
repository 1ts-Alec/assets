const originalFetch = window.fetch;
const RAW = "https://raw.githubusercontent.com/1ts-Alec/assets/2a0baec91516e729bf6ed492fda9e34aa19eabb0/286/";

function mergeFiles(fileParts) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        function fetchPart(index) {
            if (index >= fileParts.length) {
                let mergedBlob = new Blob(buffers);
                resolve(URL.createObjectURL(mergedBlob));
                return;
            }
            fetch(fileParts[index]).then((response) => {
                if (!response.ok) throw new Error("Missing part: " + fileParts[index]);
                return response.arrayBuffer();
            }).then((data) => {
                buffers.push(data);
                fetchPart(index + 1);
            }).catch(reject);
        }
        fetchPart(0);
    });
}

function getParts(file, start, end) {
    let parts = [];
    for (let i = start; i <= end; i++) {
        parts.push(RAW + file + ".part" + i);
    }
    return parts;
}
Promise.all([
    mergeFiles(getParts("Endoparasitic.pck", 1, 7))
]).then(([pckUrl]) => {
    window.fetch = async function (url, ...args) {
        if (String(url).endsWith("Endoparasitic.pck")) {
            return originalFetch(pckUrl, ...args);
        } else {
            return originalFetch(url, ...args);
        }
    };
    window.godotrunfunction();
});
