import React from "react";
import { DataPohon } from "../types/index";


interface ListProps {
  dataList: DataPohon[];
}

export default function ListDataPohon({ dataList }: ListProps) {
  return (
    <ul className="space-y-2">
      {dataList.map((item) => (
        <li key={item.id} className="p-3 border rounded">
          <strong>{item.nama_pemohon}</strong> - {item.jenis_pohon} ({item.jumlah_pohon})<br />
          <span className="text-sm text-gray-500">{item.tanggal_survey}</span><br />
          {item.foto_url && <img src={item.foto_url} alt="foto pohon" className="w-32 mt-1" />}
        </li>
      ))}
    </ul>
  );
}
