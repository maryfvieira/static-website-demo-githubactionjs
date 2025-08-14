import core from "@actions/core";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";

try {
  const bucket = core.getInput("bucket", { required: true });
  const bucketRegion = core.getInput("bucket-region") || "sa-east-1";
  const distFolder = core.getInput("dist-folder", { required: true });

  const s3 = new S3Client({ region: bucketRegion });

  async function uploadDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await uploadDirectory(fullPath);
      } else {
        const fileKey = path
          .relative(distFolder, fullPath)
          .replace(/\\/g, "/");
        const contentType = mime.lookup(file) || "application/octet-stream";

        console.log(`Uploading ${fileKey} to ${bucket}`);
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
            Body: fs.createReadStream(fullPath),
            ContentType: contentType,
          })
        );
      }
    }
  }

  (async () => {
    await uploadDirectory(distFolder);

    const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
    core.setOutput("website-url", websiteUrl);
    console.log(`Deployment complete. URL: ${websiteUrl}`);
  })();
} catch (error) {
  core.setFailed(error.message);
}
