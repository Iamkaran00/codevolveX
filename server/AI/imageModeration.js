import groq from "../config/groq.js";
import fs from 'fs';
     const imageModeration = async (imagePath) => {
    
    const imageBuffer = fs.readFileSync(imagePath);
     const base64Image = imageBuffer.toString("base64");
     const response = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `
You are an image moderation system for an educational website.
Analyze this image and determine whether it is appropriate
for use as a profile picture and can be use as thumbnailImage.

REJECT the image if it contains:
- nudity
- pornography
- sexually explicit content
- graphic violence
- hateful or extremist imagery
- clearly inappropriate content

ALLOW:
- normal human portraits
- normal clothing
- animals
- landscapes
- logos
- ordinary non-offensive photographs

Return ONLY valid JSON.

The JSON must have exactly these fields:

{
    "allowed": true,
    "reason": "safe"
}

If the image should be rejected:

{
    "allowed": false,
    "reason": "brief explanation"
}
`
          },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${base64Image}`,
            }
          }
        ]
      }
    ],
    "model": "qwen/qwen3.8-27b",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "response_format": {
            type: "json_object",
        },
    "top_p": 1,
    "stream": false,
    "stop": null
  });
     return JSON.parse(
        response.choices[0].message.content
     )
}

export default imageModeration;