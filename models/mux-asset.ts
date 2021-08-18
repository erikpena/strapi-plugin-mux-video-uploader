export interface MuxAsset extends MuxAssetUpdate {
  upload_id: string;
  asset_id: string | null;
  playback_id: string | null;
  error_message: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MuxAssetUpdate {
  id: number;
  title: string;
  isReady: boolean;
}

export interface GetMuxAssetsResponse {
  items: MuxAsset[];
  totalCount: number;
}