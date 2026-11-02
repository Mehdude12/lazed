/* Lazed website settings. This is the only file you need to edit when you publish a new build.

   WINDOWS: Lazed for Windows is distributed through the Microsoft Store, so there is no .exe to upload.
   1. In Partner Center, open your app and copy its "Store ID" (12 letters and digits, for example 9NBLGGH4NNS1)
      into windows.store.productId below.
   2. While productId is empty, the Windows button shows "Coming soon" and nothing opens automatically.
      The moment you paste the ID, Windows visitors are sent to your Microsoft Store page.

   MAC: put your two installers in the "downloads" folder using the names below (or change the names here),
   and optionally paste each file's SHA-256 checksum so people can verify their download.
   While a Mac file is missing from the server, its button shows "Coming soon" instead of a broken link. */
window.LAZED = {
  supportEmail: "support@lazed.co.in",
  version: "", // for example "1.0.0". Leave empty to hide it.
  downloads: {
    windows: {
      store: {
        productId: "9NJM7N0TVPFT", // your 12-character Microsoft Store ID, e.g. "9NBLGGH4NNS1"
        autoOpen: true, // Windows visitors on the download page are sent to the Store automatically (once per visit)
      },
      requirements: ["Windows 10 (version 1809) or later, 64-bit", "An internet connection"],
    },
    mac: {
      // The Mac has two installers. Apple Silicon = Macs from late 2020 (M1, M2, M3, M4...). Intel = older Macs.
      requirements: ["macOS 11 or later", "An internet connection"],
      variants: {
        silicon: {
          file: "downloads/Lazed-macOS-silicon.dmg",
          size: "30.3 MB", // shown until the page can read the real size
          sha256: "22059702bb3a1d6aed73034af82bfb3cc2ee1d802b23343f033c59768922402d",
        },
        intel: {
          file: "downloads/Lazed-macOS-intel.dmg",
          size: "30.1 MB",
          sha256: "af0bcdb16d3fc116366c035abb39bb082b220fb0592aef8c5cec0ebc2335f29b",
        },
      },
    },
  },
};
