"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.StatusHistoryScalarFieldEnum = exports.VoteScalarFieldEnum = exports.ReportPhotoScalarFieldEnum = exports.ReportScalarFieldEnum = exports.ProfileScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.9.1",
    engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Profile: 'Profile',
    Report: 'Report',
    ReportPhoto: 'ReportPhoto',
    Vote: 'Vote',
    StatusHistory: 'StatusHistory'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.ProfileScalarFieldEnum = {
    id: 'id',
    nama: 'nama',
    email: 'email',
    password: 'password',
    peran: 'peran',
    kawasan_tugas: 'kawasan_tugas'
};
exports.ReportScalarFieldEnum = {
    id: 'id',
    judul: 'judul',
    deskripsi: 'deskripsi',
    kawasan: 'kawasan',
    jenis_kerusakan: 'jenis_kerusakan',
    tingkat_bahaya: 'tingkat_bahaya',
    estimasi_terdampak: 'estimasi_terdampak',
    jalur_vital: 'jalur_vital',
    status: 'status',
    dibuat_pada: 'dibuat_pada',
    dibuat_oleh: 'dibuat_oleh'
};
exports.ReportPhotoScalarFieldEnum = {
    id: 'id',
    report_id: 'report_id',
    url_foto: 'url_foto'
};
exports.VoteScalarFieldEnum = {
    id: 'id',
    report_id: 'report_id',
    user_id: 'user_id',
    dibuat_pada: 'dibuat_pada'
};
exports.StatusHistoryScalarFieldEnum = {
    id: 'id',
    report_id: 'report_id',
    status_lama: 'status_lama',
    status_baru: 'status_baru',
    catatan: 'catatan',
    diubah_oleh: 'diubah_oleh',
    diubah_pada: 'diubah_pada'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map