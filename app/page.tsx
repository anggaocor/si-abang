'use client'

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DataPohon {
  id: string;
  nama_pemohon: string;
  jenis_pohon: string;
  jumlah_pohon: number;
  lokasi: string;
  foto_url: string;
  tanggal_survey: string;
  keterangan: string;
  created_at: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    nama_pemohon: "",
    jenis_pohon: "",
    jumlah_pohon: 0,
    lokasi: "",
    foto: null as File | null,
    tanggal_survey: "",
    keterangan: "",
  });

  const [dataList, setDataList] = useState<DataPohon[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("pendataan_pohon")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDataList(data);
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({ ...prev, lokasi: `${latitude},${longitude}` }));
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    let foto_url = "";
    if (formData.foto) {
      const fileExt = formData.foto.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("foto-pohon")
        .upload(fileName, formData.foto);

      if (uploadError) {
        alert("Upload foto gagal.");
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("foto-pohon")
        .getPublicUrl(fileName);
      foto_url = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("pendataan_pohon").insert({
      nama_pemohon: formData.nama_pemohon,
      jenis_pohon: formData.jenis_pohon,
      jumlah_pohon: formData.jumlah_pohon,
      lokasi: formData.lokasi,
      foto_url,
      tanggal_survey: formData.tanggal_survey,
      keterangan: formData.keterangan,
    });

    if (!error) {
      alert("Data berhasil disimpan!");
      setFormData({
        nama_pemohon: "",
        jenis_pohon: "",
        jumlah_pohon: 0,
        lokasi: "",
        foto: null,
        tanggal_survey: "",
        keterangan: "",
      });
      fetchData();
    }
    setUploading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SI ABANG - Input Data Pohon</h1>
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

      <h2 className="text-xl font-semibold mt-8 mb-2">Data Tersimpan</h2>
      <ul className="space-y-2">
        {dataList.map((item) => (
          <li key={item.id} className="p-3 border rounded">
            <strong>{item.nama_pemohon}</strong> - {item.jenis_pohon} ({item.jumlah_pohon})<br />
            <span className="text-sm text-gray-500">{item.tanggal_survey}</span><br />
            {item.foto_url && <img src={item.foto_url} alt="foto pohon" className="w-32 mt-1" />}
          </li>
        ))}
      </ul>
    </main>
  );
}
