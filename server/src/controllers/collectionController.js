import { completeCollectionAction } from "../services/collectionService.js";
export async function updateCollectionStatus(req, res) {
  res.json(await completeCollectionAction(req.user._id, req.body?.type, req.body?.id));
}
export async function collectBin(req, res) {
  res.json(await completeCollectionAction(req.user._id, "pickup", req.body?.id));
}
