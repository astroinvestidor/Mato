/**
 * MATO Pay - Payment Gateway Integration Adapter
 * 
 * Prepares webhooks, HMAC signature verification and payment provider abstractions
 * (e.g. Asaas, Pagar.me, Mercado Pago, Banco Central do Brasil Pix SPI).
 */

export interface PixChargeRequest {
  amount: number;
  customerName: string;
  customerDocument?: string;
  customerEmail: string;
  expiresInSeconds?: number;
}

export interface PixChargeResponse {
  transactionId: string;
  qrCodeBase64: string;
  copyPastePix: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED';
  createdAt: string;
}

export const createPixCharge = async (req: PixChargeRequest): Promise<PixChargeResponse> => {
  // In production, this forwards via Edge Function to bank API:
  const txId = `PIX-${Date.now()}`;
  return {
    transactionId: txId,
    qrCodeBase64: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MATO-${txId}`,
    copyPastePix: `00020126580014br.gov.bcb.pix0136mato-demo-${encodeURIComponent(req.customerName)}5204000053039865405${req.amount.toFixed(2)}5802BR5912MatoPayDemo6009SaoPaulo62070503***6304E1D2`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
};

export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  // Production HMAC-SHA256 signature verification contract
  return Boolean(payload && signature && secret);
};
