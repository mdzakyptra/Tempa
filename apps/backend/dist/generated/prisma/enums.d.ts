export declare const Peran: {
    readonly warga: "warga";
    readonly petugas: "petugas";
};
export type Peran = (typeof Peran)[keyof typeof Peran];
export declare const TingkatBahaya: {
    readonly rendah: "rendah";
    readonly sedang: "sedang";
    readonly tinggi: "tinggi";
    readonly darurat: "darurat";
};
export type TingkatBahaya = (typeof TingkatBahaya)[keyof typeof TingkatBahaya];
export declare const JenisKerusakan: {
    readonly jalan: "jalan";
    readonly trotoar: "trotoar";
    readonly lampu_jalan: "lampu_jalan";
    readonly drainase: "drainase";
    readonly jembatan: "jembatan";
    readonly fasilitas_umum: "fasilitas_umum";
    readonly lainnya: "lainnya";
};
export type JenisKerusakan = (typeof JenisKerusakan)[keyof typeof JenisKerusakan];
export declare const StatusLaporan: {
    readonly menunggu: "menunggu";
    readonly diproses: "diproses";
    readonly selesai: "selesai";
    readonly ditolak: "ditolak";
};
export type StatusLaporan = (typeof StatusLaporan)[keyof typeof StatusLaporan];
