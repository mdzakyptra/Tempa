import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Profile: "Profile";
    readonly Report: "Report";
    readonly ReportPhoto: "ReportPhoto";
    readonly Vote: "Vote";
    readonly StatusHistory: "StatusHistory";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const ProfileScalarFieldEnum: {
    readonly id: "id";
    readonly nama: "nama";
    readonly peran: "peran";
    readonly kawasan_tugas: "kawasan_tugas";
};
export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];
export declare const ReportScalarFieldEnum: {
    readonly id: "id";
    readonly judul: "judul";
    readonly deskripsi: "deskripsi";
    readonly kawasan: "kawasan";
    readonly jenis_kerusakan: "jenis_kerusakan";
    readonly tingkat_bahaya: "tingkat_bahaya";
    readonly estimasi_terdampak: "estimasi_terdampak";
    readonly jalur_vital: "jalur_vital";
    readonly status: "status";
    readonly dibuat_pada: "dibuat_pada";
    readonly dibuat_oleh: "dibuat_oleh";
};
export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum];
export declare const ReportPhotoScalarFieldEnum: {
    readonly id: "id";
    readonly report_id: "report_id";
    readonly url_foto: "url_foto";
};
export type ReportPhotoScalarFieldEnum = (typeof ReportPhotoScalarFieldEnum)[keyof typeof ReportPhotoScalarFieldEnum];
export declare const VoteScalarFieldEnum: {
    readonly id: "id";
    readonly report_id: "report_id";
    readonly user_id: "user_id";
    readonly dibuat_pada: "dibuat_pada";
};
export type VoteScalarFieldEnum = (typeof VoteScalarFieldEnum)[keyof typeof VoteScalarFieldEnum];
export declare const StatusHistoryScalarFieldEnum: {
    readonly id: "id";
    readonly report_id: "report_id";
    readonly status_lama: "status_lama";
    readonly status_baru: "status_baru";
    readonly catatan: "catatan";
    readonly diubah_oleh: "diubah_oleh";
    readonly diubah_pada: "diubah_pada";
};
export type StatusHistoryScalarFieldEnum = (typeof StatusHistoryScalarFieldEnum)[keyof typeof StatusHistoryScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
