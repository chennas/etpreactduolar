export const readCSV = async (filePath) => {
  const response = await fetch(filePath);
  const text = await response.text();
  // Split text by new lines and remove empty lines
  const sentences = text.split('\n').map(line => line.trim()).filter(line => line !== '');
  return sentences;
};
