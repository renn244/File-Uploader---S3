import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({ region: "ap-souteast-1" })

export const handler = async (event: any) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key);

    const getResponse = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
    )
    const imageBuffer = await getResponse.Body?.transformToByteArray();

    const directory = key.substring(0, key.lastIndexOf("/"));
    const filename = key.split("/").pop()?.split(".")[0];

    
    const thumbnail = await sharp(imageBuffer)
        .resize(200, 200, { fit: "cover" })
        .webp({ quality: 75 })
        .toBuffer();

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_THUMBNAIL_BUCKET,
            Key: `${directory}/${filename}_200x200.webp`,
            Body: thumbnail,
            ContentType: "image/webp"
        })
    )

    return { statusCode: 200 }
}