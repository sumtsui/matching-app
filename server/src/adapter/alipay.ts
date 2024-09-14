import { AlipayFormData, AlipaySdk } from "alipay-sdk";
import fs from "fs";

class AlipayAdapter {
  private alipaySdk: AlipaySdk;

  constructor({
    appId,
    privateKey,
    alipayPublicKey,
  }: {
    appId: string;
    privateKey: string;
    alipayPublicKey: string;
  }) {
    this.alipaySdk = new AlipaySdk({
      appId,
      privateKey,
      alipayPublicKey,
      // keyType: "PKCS1",
      // endpoint: "https://openapi.alipay.com/gateway.do",
    });
  }

  async test() {
    const result = await this.alipaySdk.curl(
      "POST",
      "/v3/alipay/user/deloauth/detail/query",
      {
        body: {
          date: "20230102",
          offset: 20,
          limit: 1,
        },
      }
    );
    console.log("alipay test", result);

    return result;
  }

  async pageExecute({
    amount,
    orderId,
    subject,
  }: {
    orderId: string;
    amount: string;
    subject: string;
  }): Promise<string> {
    const bizContent = {
      out_trade_no: orderId,
      subject,
      body: "hahaha",
      total_amount: amount,
    };

    const html = this.alipaySdk.pageExecute("alipay.trade.page.pay", "POST", {
      bizContent,
      returnUrl: "https://www.taobao.com",
    });

    return html;
  }

  async createAlipayOrder(params: {
    orderId: string;
    amount: string;
    subject: string;
  }): Promise<string> {
    try {
      const result = await this.alipaySdk.pageExecute(
        "alipay.trade.wap.pay",
        "POST",
        {
          bizContent: {
            out_trade_no: params.orderId,
            subject: params.subject,
            total_amount: params.amount,
            product_code: "QUICK_WAP_WAY",
          },
          returnUrl: "https://www.luudii.com",
        }
      );

      // The result is the payment URL
      return result as unknown as string;
    } catch (error) {
      console.error("Error creating Alipay order:", error);
      throw error;
    }
  }
}

export default AlipayAdapter;
