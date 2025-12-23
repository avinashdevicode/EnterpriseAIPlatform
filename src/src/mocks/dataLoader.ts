// Helper function to parse CSV data
export async function loadCSV(filename: string): Promise<any[]> {
  try {
    const response = await fetch(`/${filename}`);
    const text = await response.text();
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number
        if (!isNaN(Number(value)) && value !== '') {
          obj[header] = Number(value);
        } else {
          obj[header] = value;
        }
      });
      data.push(obj);
    }
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

export const getMockData = async () => {
  const [invoices, customers, metrics] = await Promise.all([
    loadCSV('sample_invoices.csv'),
    loadCSV('sample_customers.csv'),
    loadCSV('sample_metrics.csv'),
  ]);

  return { invoices, customers, metrics };
};
