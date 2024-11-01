const lazyDownloadImage = (src: string, name?: string) => {
  const loadImage = async () => {
    const srcUrl = "https://corsproxy.io/?" + encodeURIComponent(src);

    const image = await fetch(srcUrl);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = name || "image file name here";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage();
        obs.unobserve(entry.target);
      }
    });
  });

  const target = document.createElement("div");
  document.body.appendChild(target);
  observer.observe(target);
};

export default lazyDownloadImage;
