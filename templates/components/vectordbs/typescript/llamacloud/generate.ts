import * as dotenv from "dotenv";
import { LlamaCloudIndex } from "llamaindex";
import { getDataSource } from "./index";
import { getDocuments } from "./loader";
import { initSettings } from "./settings";
import { checkRequiredEnvVars } from "./shared";

dotenv.config();

async function loadAndIndex() {
  const documents = await getDocuments();
  // Set is_local_file=true to distinguish locally ingested files from LlamaCloud files
  for (const document of documents) {
    document.metadata = {
      ...document.metadata,
      is_local_file: "true",
    };
  }
  await getDataSource();
  await LlamaCloudIndex.fromDocuments({
    documents,
    name: process.env.LLAMA_CLOUD_INDEX_NAME!,
    projectName: process.env.LLAMA_CLOUD_PROJECT_NAME!,
    apiKey: process.env.LLAMA_CLOUD_API_KEY,
    baseUrl: process.env.LLAMA_CLOUD_BASE_URL,
  });
  console.log(`Successfully created embeddings!`);
}

(async () => {
  checkRequiredEnvVars();
  initSettings();
  await loadAndIndex();
  console.log("Finished generating storage.");
})();
