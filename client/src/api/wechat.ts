import apiClient from "./ky";

interface GetSignatureResponse {
  nonceStr: string;
  timestamp: number;
  signature: string;
  appId: string;
}

export async function getWechatSignature(url: string) {
  const json = await apiClient
    .post(`wechat/signature`, { json: { url } })
    .json<GetSignatureResponse>();

  return json;
}
