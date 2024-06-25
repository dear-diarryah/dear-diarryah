document.addEventListener("DOMContentLoaded", async function () {
  tt.setProductInfo("Dear Diarryah", "1.0");

  const apiKeyResponse = await fetch("/api/getTomTomApiKey");
  const apiKeyData = await apiKeyResponse.json();
  const API_KEY = apiKeyData.apiKey;

  const map = tt.map({
    key: API_KEY,
    container: "map",
    center: [16.3738, 48.2082], // Wien
    zoom: 12,
  });

  document
    .getElementById("findDocButton")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      try {
        const response = await fetch(`/api/veterinarians`);
        const data = await response.json();
        const veterinarians = data.results;

        veterinarians.forEach((result) => {
          const { position, address, poi } = result;
          const marker = new tt.Marker()
            .setLngLat([position.lon, position.lat])
            .addTo(map);

          const popup = new tt.Popup({ offset: 35 }).setText(
            `${poi.name}\n${address.freeformAddress}`
          );
          marker.setPopup(popup);
        });
      } catch (error) {
        console.error("Fehler bei der Suche:", error);
      }
    });
});
