const OWNER_PLAYER_ID = "97a6d561-9c6e-45fd-959e-6ccb00674187";
const VERSION = "6.2.0";

export function isOwner(playerId) {
  return String(playerId || "") === OWNER_PLAYER_ID;
}

export function requireOwner(req, res, next) {
  if (!isOwner(req.playerId)) return res.status(403).json({ error: "Owner access required" });
  req.owner = true;
  next();
}

export function ownerStatus(playerId) {
  return {
    owner: isOwner(playerId),
    role: isOwner(playerId) ? "owner" : "user",
    version: VERSION
  };
}

export function ownerPlayerId() {
  return OWNER_PLAYER_ID;
}
