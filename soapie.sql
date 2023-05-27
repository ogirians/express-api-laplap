select 
pendaftaran.no_pendaftaran,
pasien.no_rekam_medik,
pasien.nama_pasien,
pendaftaran.tgl_pendaftaran,
instalasi.instalasi_nama,
ruangan.ruangan_nama,
dpjp.nama_pegawai as nama_dpjp,
ksm.smf_nama as ksm_dpjp,
ppds.ppds_nama as nama_ppds,
ksm_ppds.smf_nama as ksm_ppds,
case 
	when user_input.pegawai_id is not null
	then 'dpjp'
	else 'ppds'
end as penginput,
soap.create_loginpemakai_id, 
soap.tanggal_soapi,
--soap.subyektif,
--soap.obyektif,
--soap.asesmen,
--soap.perencanaan,
--soap.instruksi,
--soap.evaluasi,
case
	when soap.subyektif is not null
	then '1'
	else '0'
end as S,
case
	when soap.obyektif is not null
	then '1'
	else '0'
end as O,
case
	when soap.asesmen is not null
	then '1'
	else '0'
end as A,
case
	when soap.perencanaan is not null
	then '1'
	else '0'
end as P,
case
	when soap.instruksi is not null
	then '1'
	else '0'
end as I,
case
	when soap.evaluasi is not null
	then '1'
	else '0'
end as E,
verif.tgl_pengisian as tgl_verif,
case
	when user_verif.pegawai_id is null
	then ppds_verifikator.ppds_nama  
	else dpjp_verifikator.nama_pegawai 
end as verifikator,
case
	when user_verif.pegawai_id is null
	then smf_ppds_verifikator.smf_nama  
	else smf_dpjp_verifikator.smf_nama 
end as ksm_verifikator
--verif.create_loginpegawai_id  
from emr.perkembanganterintegrasipasien_t as soap
left join pendaftaran_t as pendaftaran on pendaftaran.pendaftaran_id = soap.pendaftaran_id
left join pasien_m as pasien on pasien.pasien_id = pendaftaran.pasien_id
left join ruangan_m as ruangan on ruangan.ruangan_id = pendaftaran.ruangan_id
left join instalasi_m as instalasi on instalasi.instalasi_id = ruangan.instalasi_id
left join pegawai_m as dpjp on dpjp.pegawai_id = soap.dpjp_id
left join ppds_m as ppds on ppds.ppds_id = soap.ppds_id
left join smf_m as ksm on ksm.smf_id = dpjp.smf_id
left join smf_m as ksm_ppds on ksm_ppds.smf_id = ppds.smf_id
left join loginpemakai_k as user_input on user_input.loginpemakai_id = soap.create_loginpemakai_id
left join emr.verifikasi_soapi_t as verif on verif.perkembanganterintegrasipasien_id = soap.perkembanganterintegrasipasien_id 
left join loginpemakai_k as user_verif on user_verif.loginpemakai_id = verif.create_loginpegawai_id 
left join pegawai_m as dpjp_verifikator on dpjp_verifikator.pegawai_id = user_verif.pegawai_id 
left join ppds_m as ppds_verifikator on ppds_verifikator.ppds_id = user_verif.ppds_id
left join smf_m as smf_dpjp_verifikator on smf_dpjp_verifikator.smf_id = dpjp_verifikator.smf_id
left join smf_m as smf_ppds_verifikator on smf_ppds_verifikator.smf_id = ppds_verifikator.smf_id 
where pendaftaran.tgl_pendaftaran >= '2023-03-01 00:00:00'
and pendaftaran.tgl_pendaftaran < '2023-05-01  00:00:00'
and pendaftaran.pasienbatalperiksa_id is null
and soap.jenis_soapi = 'DOKTER'
order by pendaftaran.tgl_pendaftaran asc
limit 1

