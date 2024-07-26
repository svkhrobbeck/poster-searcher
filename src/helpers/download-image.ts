const downloadImage = async (src: string, name?: string) => {
  const image = await fetch(src);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = name || "image file name here";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadImage;
