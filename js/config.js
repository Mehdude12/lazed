/* Lazed website settings. This is the only file you need to edit when you publish a new build.

   1. Put your installer files (Windows, and Mac for Apple Silicon and Intel) in the "downloads" folder using the names below
      (or change the names here to match your files).
   2. Set "version" if you want it shown on the download page.
   3. Optional: paste the SHA-256 checksum of each file so people can verify their download.

   While a file is missing from the server, its button shows "Coming soon" instead of a broken link.
   The moment you upload the file, the button turns into a normal download button. */
window.LAZED = {
  supportEmail: "support@lazed.co.in",
  version: "", // for example "1.0.0". Leave empty to hide it.
  downloads: {
    windows: {
      file: "downloads/Lazed-Windows.exe",
      requirements: ["Windows 10 or later, 64-bit", "An internet connection"],
      sha256: "0d83f7864a6c5084d1a59cff16143bd44a64a292071f41b08e5c663c82bc57e5",
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
