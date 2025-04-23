import React from "react";

interface FormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  detectLocation: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
}

export default function FormInputPohon({
  formData,
  setFormData,
  handleChange,
  detectLocation,
  handleSubmit,
  uploading,
}: FormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="nama_pemohon" placeholder="Nama Pemohon" className="w-full p-2 border" onChange={handleChange} value={formData.nama_pemohon} required />
      <input name="jenis_pohon" placeholder="Jenis Pohon" className="w-full p-2 border" onChange={handleChange} value={formData.jenis_pohon} required />
      <input name="jumlah_pohon" type="number" min="1" placeholder="Jumlah Pohon" className="w-full p-2 border" onChange={handleChange} value={formData.jumlah_pohon} required />
      <input name="lokasi" placeholder="Lokasi (GPS)" className="w-full p-2 border" onChange={handleChange} value={formData.lokasi} required />
      <button type="button" onClick={detectLocation} className="text-blue-600 underline text-sm">Deteksi Lokasi Otomatis</button>
      <input name="tanggal_survey" type="date" className="w-full p-2 border" onChange={handleChange} value={formData.tanggal_survey} required />
      <textarea name="keterangan" placeholder="Keterangan" className="w-full p-2 border" onChange={handleChange} value={formData.keterangan} />
      <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, foto: e.target.files?.[0] || null })} />
      <button disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded">
        {uploading ? "Menyimpan..." : "Simpan Data"}
      </button>
    </form>
  );
}
