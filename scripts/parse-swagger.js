import fs from "fs";
import path from "path";
import YAML from "js-yaml";

/**
 * Extract GET-search endpoints (with required params) from a swagger folder
 * and save to a JSON file.
 *
 * @param {string} swaggerDir - Path to swagger YAML folder
 * @param {string} outputFile - Output JSON file path
 */
function extractEndpoints(swaggerDir, outputFile) {
  const endpoints = [];

  for (const file of fs.readdirSync(swaggerDir)) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;

    const filePath = path.join(swaggerDir, file);
    const resourceName = path.basename(file, path.extname(file));

    let doc;
    try {
      doc = YAML.load(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error(`⚠️ Failed to parse YAML for ${file}:`, err.message);
      continue;
    }

    if (!doc.paths) continue;

    for (const [route, methods] of Object.entries(doc.paths)) {
      const getOp = methods.get;
      if (!getOp) continue;

      // Skip GET by id (those with {id} or other path params)
      if (route.includes("{")) continue;

      // Strip prefix (/api/v2 or /api/<something>)
      const normalizedRoute = route.replace(/^\/api\/v\d+/, "");

      // Collect only required params
      const requiredParams = (getOp.parameters || [])
        .filter((p) => p.required)
        .map((p) => ({
          name: p.name,
          in: p.in || "query",
          type: p.schema?.type || "string",
          description: p.description || "",
        }));

      if (requiredParams.length > 0) {
        endpoints.push({
          resource: resourceName,
          path: normalizedRoute,
          parameters: requiredParams,
        });
      }
    }
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(endpoints, null, 2));

  console.log(
    `✅ Extracted ${endpoints.length} GET-search endpoints into ${outputFile}`
  );
}

// 🔹 Run for both swagger folders
extractEndpoints(path.resolve("./athena-swaggerdoc"), path.resolve("../public/athena-endpoints.json"));
extractEndpoints(path.resolve("./elation-swaggerdoc"), path.resolve("../public/elation-endpoints.json"));
