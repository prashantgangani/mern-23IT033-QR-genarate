
import api from './api';
import { QRCode, PaginatedResponse } from '../types';

interface QRCodeParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const generateQRCode = async (content: string, type: 'url' | 'text', title?: string): Promise<QRCode> => {
  const response = await api.post<QRCode>('/qrcodes', { content, type, title });
  return response.data;
};

export const getQRCodes = async (params: QRCodeParams = {}): Promise<PaginatedResponse<QRCode>> => {
  const response = await api.get<PaginatedResponse<QRCode>>('/qrcodes', { params });
  return response.data;
};

export const shareQRCodeViaEmail = async (qrCodeId: string, email: string): Promise<void> => {
  await api.post(`/qrcodes/${qrCodeId}/share`, { email });
};
