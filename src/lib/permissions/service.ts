import api from "@/lib/api";
import type {
  PermissionResponse,
} from "./types";

export async function fetchPermissions(): Promise<PermissionResponse> {
  const response = await api.get<{
    success: boolean;
    status: number;
    message: string;
    data: PermissionResponse;
  }>("/permissions");

  return response.data.data;
}