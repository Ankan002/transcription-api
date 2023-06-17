import Replicate from "replicate";

const replicateInstance = {
    replicate: new Replicate({
        auth: process.env["REPLICATE_API_KEY"] ?? "",
    }),
};

export const getReplicateInstance = () => replicateInstance.replicate;
