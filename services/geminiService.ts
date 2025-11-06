import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generationModel = 'gemini-2.5-flash-image';

export const generateImage = async (modelImage: UploadedFile, productImage: UploadedFile): Promise<string> => {
  const modelImagePart = {
    inlineData: {
      data: modelImage.base64,
      mimeType: modelImage.mimeType,
    },
  };
  
  const productImagePart = {
    inlineData: {
      data: productImage.base64,
      mimeType: productImage.mimeType,
    },
  };

  const prompt = "Ảnh đầu tiên là người mẫu, ảnh thứ hai là sản phẩm. Hãy tạo một ảnh mới chân thực, trong đó người mẫu từ ảnh đầu tiên đang mặc hoặc sử dụng sản phẩm từ ảnh thứ hai. Ảnh cuối cùng phải là ảnh chân thực của người mẫu với sản phẩm trên nền sạch, phù hợp cho thương mại điện tử.";
  
  const parts: any[] = [
      {text: prompt},
      modelImagePart,
      productImagePart
  ];

  const response = await ai.models.generateContent({
    model: generationModel,
    contents: {
      parts: parts,
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  const firstPart = response.candidates?.[0]?.content?.parts?.[0];

  if (firstPart && firstPart.inlineData) {
    return firstPart.inlineData.data;
  }
  
  throw new Error("Không tìm thấy dữ liệu hình ảnh trong phản hồi từ mô hình tạo ảnh.");
};
