export function setupHUD() {
  // Déjà défini dans index.html, donc rien à faire ici pour l'instant
}

export function updateHUD(player) {
  document.getElementById("stats").innerText = `Vie: ${player.life} | Munitions: ${player.ammo}`;
}
