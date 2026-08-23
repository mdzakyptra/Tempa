import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReportModel = runtime.Types.Result.DefaultSelection<Prisma.$ReportPayload>;
export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null;
    _avg: ReportAvgAggregateOutputType | null;
    _sum: ReportSumAggregateOutputType | null;
    _min: ReportMinAggregateOutputType | null;
    _max: ReportMaxAggregateOutputType | null;
};
export type ReportAvgAggregateOutputType = {
    estimasi_terdampak: number | null;
};
export type ReportSumAggregateOutputType = {
    estimasi_terdampak: number | null;
};
export type ReportMinAggregateOutputType = {
    id: string | null;
    judul: string | null;
    deskripsi: string | null;
    kawasan: string | null;
    jenis_kerusakan: $Enums.JenisKerusakan | null;
    tingkat_bahaya: $Enums.TingkatBahaya | null;
    estimasi_terdampak: number | null;
    jalur_vital: boolean | null;
    status: $Enums.StatusLaporan | null;
    dibuat_pada: Date | null;
    dibuat_oleh: string | null;
};
export type ReportMaxAggregateOutputType = {
    id: string | null;
    judul: string | null;
    deskripsi: string | null;
    kawasan: string | null;
    jenis_kerusakan: $Enums.JenisKerusakan | null;
    tingkat_bahaya: $Enums.TingkatBahaya | null;
    estimasi_terdampak: number | null;
    jalur_vital: boolean | null;
    status: $Enums.StatusLaporan | null;
    dibuat_pada: Date | null;
    dibuat_oleh: string | null;
};
export type ReportCountAggregateOutputType = {
    id: number;
    judul: number;
    deskripsi: number;
    kawasan: number;
    jenis_kerusakan: number;
    tingkat_bahaya: number;
    estimasi_terdampak: number;
    jalur_vital: number;
    status: number;
    dibuat_pada: number;
    dibuat_oleh: number;
    _all: number;
};
export type ReportAvgAggregateInputType = {
    estimasi_terdampak?: true;
};
export type ReportSumAggregateInputType = {
    estimasi_terdampak?: true;
};
export type ReportMinAggregateInputType = {
    id?: true;
    judul?: true;
    deskripsi?: true;
    kawasan?: true;
    jenis_kerusakan?: true;
    tingkat_bahaya?: true;
    estimasi_terdampak?: true;
    jalur_vital?: true;
    status?: true;
    dibuat_pada?: true;
    dibuat_oleh?: true;
};
export type ReportMaxAggregateInputType = {
    id?: true;
    judul?: true;
    deskripsi?: true;
    kawasan?: true;
    jenis_kerusakan?: true;
    tingkat_bahaya?: true;
    estimasi_terdampak?: true;
    jalur_vital?: true;
    status?: true;
    dibuat_pada?: true;
    dibuat_oleh?: true;
};
export type ReportCountAggregateInputType = {
    id?: true;
    judul?: true;
    deskripsi?: true;
    kawasan?: true;
    jenis_kerusakan?: true;
    tingkat_bahaya?: true;
    estimasi_terdampak?: true;
    jalur_vital?: true;
    status?: true;
    dibuat_pada?: true;
    dibuat_oleh?: true;
    _all?: true;
};
export type ReportAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReportCountAggregateInputType;
    _avg?: ReportAvgAggregateInputType;
    _sum?: ReportSumAggregateInputType;
    _min?: ReportMinAggregateInputType;
    _max?: ReportMaxAggregateInputType;
};
export type GetReportAggregateType<T extends ReportAggregateArgs> = {
    [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReport[P]> : Prisma.GetScalarType<T[P], AggregateReport[P]>;
};
export type ReportGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithAggregationInput | Prisma.ReportOrderByWithAggregationInput[];
    by: Prisma.ReportScalarFieldEnum[] | Prisma.ReportScalarFieldEnum;
    having?: Prisma.ReportScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReportCountAggregateInputType | true;
    _avg?: ReportAvgAggregateInputType;
    _sum?: ReportSumAggregateInputType;
    _min?: ReportMinAggregateInputType;
    _max?: ReportMaxAggregateInputType;
};
export type ReportGroupByOutputType = {
    id: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak: number;
    jalur_vital: boolean;
    status: $Enums.StatusLaporan;
    dibuat_pada: Date;
    dibuat_oleh: string;
    _count: ReportCountAggregateOutputType | null;
    _avg: ReportAvgAggregateOutputType | null;
    _sum: ReportSumAggregateOutputType | null;
    _min: ReportMinAggregateOutputType | null;
    _max: ReportMaxAggregateOutputType | null;
};
export type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReportGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReportGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReportGroupByOutputType[P]>;
}>>;
export type ReportWhereInput = {
    AND?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    OR?: Prisma.ReportWhereInput[];
    NOT?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    id?: Prisma.UuidFilter<"Report"> | string;
    judul?: Prisma.StringFilter<"Report"> | string;
    deskripsi?: Prisma.StringFilter<"Report"> | string;
    kawasan?: Prisma.StringFilter<"Report"> | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFilter<"Report"> | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFilter<"Report"> | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFilter<"Report"> | number;
    jalur_vital?: Prisma.BoolFilter<"Report"> | boolean;
    status?: Prisma.EnumStatusLaporanFilter<"Report"> | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFilter<"Report"> | Date | string;
    dibuat_oleh?: Prisma.UuidFilter<"Report"> | string;
    pelapor?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    photos?: Prisma.ReportPhotoListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
    status_history?: Prisma.StatusHistoryListRelationFilter;
};
export type ReportOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    judul?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    kawasan?: Prisma.SortOrder;
    jenis_kerusakan?: Prisma.SortOrder;
    tingkat_bahaya?: Prisma.SortOrder;
    estimasi_terdampak?: Prisma.SortOrder;
    jalur_vital?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    dibuat_oleh?: Prisma.SortOrder;
    pelapor?: Prisma.ProfileOrderByWithRelationInput;
    photos?: Prisma.ReportPhotoOrderByRelationAggregateInput;
    votes?: Prisma.VoteOrderByRelationAggregateInput;
    status_history?: Prisma.StatusHistoryOrderByRelationAggregateInput;
};
export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    OR?: Prisma.ReportWhereInput[];
    NOT?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    judul?: Prisma.StringFilter<"Report"> | string;
    deskripsi?: Prisma.StringFilter<"Report"> | string;
    kawasan?: Prisma.StringFilter<"Report"> | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFilter<"Report"> | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFilter<"Report"> | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFilter<"Report"> | number;
    jalur_vital?: Prisma.BoolFilter<"Report"> | boolean;
    status?: Prisma.EnumStatusLaporanFilter<"Report"> | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFilter<"Report"> | Date | string;
    dibuat_oleh?: Prisma.UuidFilter<"Report"> | string;
    pelapor?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    photos?: Prisma.ReportPhotoListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
    status_history?: Prisma.StatusHistoryListRelationFilter;
}, "id">;
export type ReportOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    judul?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    kawasan?: Prisma.SortOrder;
    jenis_kerusakan?: Prisma.SortOrder;
    tingkat_bahaya?: Prisma.SortOrder;
    estimasi_terdampak?: Prisma.SortOrder;
    jalur_vital?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    dibuat_oleh?: Prisma.SortOrder;
    _count?: Prisma.ReportCountOrderByAggregateInput;
    _avg?: Prisma.ReportAvgOrderByAggregateInput;
    _max?: Prisma.ReportMaxOrderByAggregateInput;
    _min?: Prisma.ReportMinOrderByAggregateInput;
    _sum?: Prisma.ReportSumOrderByAggregateInput;
};
export type ReportScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReportScalarWhereWithAggregatesInput | Prisma.ReportScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReportScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReportScalarWhereWithAggregatesInput | Prisma.ReportScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Report"> | string;
    judul?: Prisma.StringWithAggregatesFilter<"Report"> | string;
    deskripsi?: Prisma.StringWithAggregatesFilter<"Report"> | string;
    kawasan?: Prisma.StringWithAggregatesFilter<"Report"> | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanWithAggregatesFilter<"Report"> | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaWithAggregatesFilter<"Report"> | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntWithAggregatesFilter<"Report"> | number;
    jalur_vital?: Prisma.BoolWithAggregatesFilter<"Report"> | boolean;
    status?: Prisma.EnumStatusLaporanWithAggregatesFilter<"Report"> | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeWithAggregatesFilter<"Report"> | Date | string;
    dibuat_oleh?: Prisma.UuidWithAggregatesFilter<"Report"> | string;
};
export type ReportCreateInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    pelapor: Prisma.ProfileCreateNestedOneWithoutReportsInput;
    photos?: Prisma.ReportPhotoCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    dibuat_oleh: string;
    photos?: Prisma.ReportPhotoUncheckedCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pelapor?: Prisma.ProfileUpdateOneRequiredWithoutReportsNestedInput;
    photos?: Prisma.ReportPhotoUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dibuat_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    photos?: Prisma.ReportPhotoUncheckedUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportCreateManyInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    dibuat_oleh: string;
};
export type ReportUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReportUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dibuat_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportListRelationFilter = {
    every?: Prisma.ReportWhereInput;
    some?: Prisma.ReportWhereInput;
    none?: Prisma.ReportWhereInput;
};
export type ReportOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReportCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    judul?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    kawasan?: Prisma.SortOrder;
    jenis_kerusakan?: Prisma.SortOrder;
    tingkat_bahaya?: Prisma.SortOrder;
    estimasi_terdampak?: Prisma.SortOrder;
    jalur_vital?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    dibuat_oleh?: Prisma.SortOrder;
};
export type ReportAvgOrderByAggregateInput = {
    estimasi_terdampak?: Prisma.SortOrder;
};
export type ReportMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    judul?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    kawasan?: Prisma.SortOrder;
    jenis_kerusakan?: Prisma.SortOrder;
    tingkat_bahaya?: Prisma.SortOrder;
    estimasi_terdampak?: Prisma.SortOrder;
    jalur_vital?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    dibuat_oleh?: Prisma.SortOrder;
};
export type ReportMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    judul?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    kawasan?: Prisma.SortOrder;
    jenis_kerusakan?: Prisma.SortOrder;
    tingkat_bahaya?: Prisma.SortOrder;
    estimasi_terdampak?: Prisma.SortOrder;
    jalur_vital?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    dibuat_oleh?: Prisma.SortOrder;
};
export type ReportSumOrderByAggregateInput = {
    estimasi_terdampak?: Prisma.SortOrder;
};
export type ReportScalarRelationFilter = {
    is?: Prisma.ReportWhereInput;
    isNot?: Prisma.ReportWhereInput;
};
export type ReportCreateNestedManyWithoutPelaporInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput> | Prisma.ReportCreateWithoutPelaporInput[] | Prisma.ReportUncheckedCreateWithoutPelaporInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPelaporInput | Prisma.ReportCreateOrConnectWithoutPelaporInput[];
    createMany?: Prisma.ReportCreateManyPelaporInputEnvelope;
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
};
export type ReportUncheckedCreateNestedManyWithoutPelaporInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput> | Prisma.ReportCreateWithoutPelaporInput[] | Prisma.ReportUncheckedCreateWithoutPelaporInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPelaporInput | Prisma.ReportCreateOrConnectWithoutPelaporInput[];
    createMany?: Prisma.ReportCreateManyPelaporInputEnvelope;
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
};
export type ReportUpdateManyWithoutPelaporNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput> | Prisma.ReportCreateWithoutPelaporInput[] | Prisma.ReportUncheckedCreateWithoutPelaporInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPelaporInput | Prisma.ReportCreateOrConnectWithoutPelaporInput[];
    upsert?: Prisma.ReportUpsertWithWhereUniqueWithoutPelaporInput | Prisma.ReportUpsertWithWhereUniqueWithoutPelaporInput[];
    createMany?: Prisma.ReportCreateManyPelaporInputEnvelope;
    set?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    disconnect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    delete?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    update?: Prisma.ReportUpdateWithWhereUniqueWithoutPelaporInput | Prisma.ReportUpdateWithWhereUniqueWithoutPelaporInput[];
    updateMany?: Prisma.ReportUpdateManyWithWhereWithoutPelaporInput | Prisma.ReportUpdateManyWithWhereWithoutPelaporInput[];
    deleteMany?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
};
export type ReportUncheckedUpdateManyWithoutPelaporNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput> | Prisma.ReportCreateWithoutPelaporInput[] | Prisma.ReportUncheckedCreateWithoutPelaporInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPelaporInput | Prisma.ReportCreateOrConnectWithoutPelaporInput[];
    upsert?: Prisma.ReportUpsertWithWhereUniqueWithoutPelaporInput | Prisma.ReportUpsertWithWhereUniqueWithoutPelaporInput[];
    createMany?: Prisma.ReportCreateManyPelaporInputEnvelope;
    set?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    disconnect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    delete?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    update?: Prisma.ReportUpdateWithWhereUniqueWithoutPelaporInput | Prisma.ReportUpdateWithWhereUniqueWithoutPelaporInput[];
    updateMany?: Prisma.ReportUpdateManyWithWhereWithoutPelaporInput | Prisma.ReportUpdateManyWithWhereWithoutPelaporInput[];
    deleteMany?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
};
export type EnumJenisKerusakanFieldUpdateOperationsInput = {
    set?: $Enums.JenisKerusakan;
};
export type EnumTingkatBahayaFieldUpdateOperationsInput = {
    set?: $Enums.TingkatBahaya;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type EnumStatusLaporanFieldUpdateOperationsInput = {
    set?: $Enums.StatusLaporan;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type ReportCreateNestedOneWithoutPhotosInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPhotosInput, Prisma.ReportUncheckedCreateWithoutPhotosInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPhotosInput;
    connect?: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutPhotosInput, Prisma.ReportUncheckedCreateWithoutPhotosInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutPhotosInput;
    upsert?: Prisma.ReportUpsertWithoutPhotosInput;
    connect?: Prisma.ReportWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReportUpdateToOneWithWhereWithoutPhotosInput, Prisma.ReportUpdateWithoutPhotosInput>, Prisma.ReportUncheckedUpdateWithoutPhotosInput>;
};
export type ReportCreateNestedOneWithoutVotesInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutVotesInput, Prisma.ReportUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutVotesInput;
    connect?: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateOneRequiredWithoutVotesNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutVotesInput, Prisma.ReportUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutVotesInput;
    upsert?: Prisma.ReportUpsertWithoutVotesInput;
    connect?: Prisma.ReportWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReportUpdateToOneWithWhereWithoutVotesInput, Prisma.ReportUpdateWithoutVotesInput>, Prisma.ReportUncheckedUpdateWithoutVotesInput>;
};
export type ReportCreateNestedOneWithoutStatus_historyInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutStatus_historyInput, Prisma.ReportUncheckedCreateWithoutStatus_historyInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutStatus_historyInput;
    connect?: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateOneRequiredWithoutStatus_historyNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutStatus_historyInput, Prisma.ReportUncheckedCreateWithoutStatus_historyInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutStatus_historyInput;
    upsert?: Prisma.ReportUpsertWithoutStatus_historyInput;
    connect?: Prisma.ReportWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReportUpdateToOneWithWhereWithoutStatus_historyInput, Prisma.ReportUpdateWithoutStatus_historyInput>, Prisma.ReportUncheckedUpdateWithoutStatus_historyInput>;
};
export type ReportCreateWithoutPelaporInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    photos?: Prisma.ReportPhotoCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateWithoutPelaporInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    photos?: Prisma.ReportPhotoUncheckedCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportCreateOrConnectWithoutPelaporInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput>;
};
export type ReportCreateManyPelaporInputEnvelope = {
    data: Prisma.ReportCreateManyPelaporInput | Prisma.ReportCreateManyPelaporInput[];
    skipDuplicates?: boolean;
};
export type ReportUpsertWithWhereUniqueWithoutPelaporInput = {
    where: Prisma.ReportWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReportUpdateWithoutPelaporInput, Prisma.ReportUncheckedUpdateWithoutPelaporInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutPelaporInput, Prisma.ReportUncheckedCreateWithoutPelaporInput>;
};
export type ReportUpdateWithWhereUniqueWithoutPelaporInput = {
    where: Prisma.ReportWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutPelaporInput, Prisma.ReportUncheckedUpdateWithoutPelaporInput>;
};
export type ReportUpdateManyWithWhereWithoutPelaporInput = {
    where: Prisma.ReportScalarWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyWithoutPelaporInput>;
};
export type ReportScalarWhereInput = {
    AND?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
    OR?: Prisma.ReportScalarWhereInput[];
    NOT?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
    id?: Prisma.UuidFilter<"Report"> | string;
    judul?: Prisma.StringFilter<"Report"> | string;
    deskripsi?: Prisma.StringFilter<"Report"> | string;
    kawasan?: Prisma.StringFilter<"Report"> | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFilter<"Report"> | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFilter<"Report"> | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFilter<"Report"> | number;
    jalur_vital?: Prisma.BoolFilter<"Report"> | boolean;
    status?: Prisma.EnumStatusLaporanFilter<"Report"> | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFilter<"Report"> | Date | string;
    dibuat_oleh?: Prisma.UuidFilter<"Report"> | string;
};
export type ReportCreateWithoutPhotosInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    pelapor: Prisma.ProfileCreateNestedOneWithoutReportsInput;
    votes?: Prisma.VoteCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateWithoutPhotosInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    dibuat_oleh: string;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportCreateOrConnectWithoutPhotosInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutPhotosInput, Prisma.ReportUncheckedCreateWithoutPhotosInput>;
};
export type ReportUpsertWithoutPhotosInput = {
    update: Prisma.XOR<Prisma.ReportUpdateWithoutPhotosInput, Prisma.ReportUncheckedUpdateWithoutPhotosInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutPhotosInput, Prisma.ReportUncheckedCreateWithoutPhotosInput>;
    where?: Prisma.ReportWhereInput;
};
export type ReportUpdateToOneWithWhereWithoutPhotosInput = {
    where?: Prisma.ReportWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutPhotosInput, Prisma.ReportUncheckedUpdateWithoutPhotosInput>;
};
export type ReportUpdateWithoutPhotosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pelapor?: Prisma.ProfileUpdateOneRequiredWithoutReportsNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateWithoutPhotosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dibuat_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportCreateWithoutVotesInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    pelapor: Prisma.ProfileCreateNestedOneWithoutReportsInput;
    photos?: Prisma.ReportPhotoCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateWithoutVotesInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    dibuat_oleh: string;
    photos?: Prisma.ReportPhotoUncheckedCreateNestedManyWithoutReportInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportCreateOrConnectWithoutVotesInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutVotesInput, Prisma.ReportUncheckedCreateWithoutVotesInput>;
};
export type ReportUpsertWithoutVotesInput = {
    update: Prisma.XOR<Prisma.ReportUpdateWithoutVotesInput, Prisma.ReportUncheckedUpdateWithoutVotesInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutVotesInput, Prisma.ReportUncheckedCreateWithoutVotesInput>;
    where?: Prisma.ReportWhereInput;
};
export type ReportUpdateToOneWithWhereWithoutVotesInput = {
    where?: Prisma.ReportWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutVotesInput, Prisma.ReportUncheckedUpdateWithoutVotesInput>;
};
export type ReportUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pelapor?: Prisma.ProfileUpdateOneRequiredWithoutReportsNestedInput;
    photos?: Prisma.ReportPhotoUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dibuat_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    photos?: Prisma.ReportPhotoUncheckedUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportCreateWithoutStatus_historyInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    pelapor: Prisma.ProfileCreateNestedOneWithoutReportsInput;
    photos?: Prisma.ReportPhotoCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateWithoutStatus_historyInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
    dibuat_oleh: string;
    photos?: Prisma.ReportPhotoUncheckedCreateNestedManyWithoutReportInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportCreateOrConnectWithoutStatus_historyInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutStatus_historyInput, Prisma.ReportUncheckedCreateWithoutStatus_historyInput>;
};
export type ReportUpsertWithoutStatus_historyInput = {
    update: Prisma.XOR<Prisma.ReportUpdateWithoutStatus_historyInput, Prisma.ReportUncheckedUpdateWithoutStatus_historyInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutStatus_historyInput, Prisma.ReportUncheckedCreateWithoutStatus_historyInput>;
    where?: Prisma.ReportWhereInput;
};
export type ReportUpdateToOneWithWhereWithoutStatus_historyInput = {
    where?: Prisma.ReportWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutStatus_historyInput, Prisma.ReportUncheckedUpdateWithoutStatus_historyInput>;
};
export type ReportUpdateWithoutStatus_historyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pelapor?: Prisma.ProfileUpdateOneRequiredWithoutReportsNestedInput;
    photos?: Prisma.ReportPhotoUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateWithoutStatus_historyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dibuat_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    photos?: Prisma.ReportPhotoUncheckedUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportCreateManyPelaporInput = {
    id?: string;
    judul: string;
    deskripsi: string;
    kawasan: string;
    jenis_kerusakan: $Enums.JenisKerusakan;
    tingkat_bahaya: $Enums.TingkatBahaya;
    estimasi_terdampak?: number;
    jalur_vital?: boolean;
    status?: $Enums.StatusLaporan;
    dibuat_pada?: Date | string;
};
export type ReportUpdateWithoutPelaporInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    photos?: Prisma.ReportPhotoUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateWithoutPelaporInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    photos?: Prisma.ReportPhotoUncheckedUpdateManyWithoutReportNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutReportNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateManyWithoutPelaporInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    judul?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    kawasan?: Prisma.StringFieldUpdateOperationsInput | string;
    jenis_kerusakan?: Prisma.EnumJenisKerusakanFieldUpdateOperationsInput | $Enums.JenisKerusakan;
    tingkat_bahaya?: Prisma.EnumTingkatBahayaFieldUpdateOperationsInput | $Enums.TingkatBahaya;
    estimasi_terdampak?: Prisma.IntFieldUpdateOperationsInput | number;
    jalur_vital?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    status?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReportCountOutputType = {
    photos: number;
    votes: number;
    status_history: number;
};
export type ReportCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    photos?: boolean | ReportCountOutputTypeCountPhotosArgs;
    votes?: boolean | ReportCountOutputTypeCountVotesArgs;
    status_history?: boolean | ReportCountOutputTypeCountStatus_historyArgs;
};
export type ReportCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportCountOutputTypeSelect<ExtArgs> | null;
};
export type ReportCountOutputTypeCountPhotosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportPhotoWhereInput;
};
export type ReportCountOutputTypeCountVotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
};
export type ReportCountOutputTypeCountStatus_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
};
export type ReportSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    judul?: boolean;
    deskripsi?: boolean;
    kawasan?: boolean;
    jenis_kerusakan?: boolean;
    tingkat_bahaya?: boolean;
    estimasi_terdampak?: boolean;
    jalur_vital?: boolean;
    status?: boolean;
    dibuat_pada?: boolean;
    dibuat_oleh?: boolean;
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    photos?: boolean | Prisma.Report$photosArgs<ExtArgs>;
    votes?: boolean | Prisma.Report$votesArgs<ExtArgs>;
    status_history?: boolean | Prisma.Report$status_historyArgs<ExtArgs>;
    _count?: boolean | Prisma.ReportCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    judul?: boolean;
    deskripsi?: boolean;
    kawasan?: boolean;
    jenis_kerusakan?: boolean;
    tingkat_bahaya?: boolean;
    estimasi_terdampak?: boolean;
    jalur_vital?: boolean;
    status?: boolean;
    dibuat_pada?: boolean;
    dibuat_oleh?: boolean;
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    judul?: boolean;
    deskripsi?: boolean;
    kawasan?: boolean;
    jenis_kerusakan?: boolean;
    tingkat_bahaya?: boolean;
    estimasi_terdampak?: boolean;
    jalur_vital?: boolean;
    status?: boolean;
    dibuat_pada?: boolean;
    dibuat_oleh?: boolean;
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectScalar = {
    id?: boolean;
    judul?: boolean;
    deskripsi?: boolean;
    kawasan?: boolean;
    jenis_kerusakan?: boolean;
    tingkat_bahaya?: boolean;
    estimasi_terdampak?: boolean;
    jalur_vital?: boolean;
    status?: boolean;
    dibuat_pada?: boolean;
    dibuat_oleh?: boolean;
};
export type ReportOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "judul" | "deskripsi" | "kawasan" | "jenis_kerusakan" | "tingkat_bahaya" | "estimasi_terdampak" | "jalur_vital" | "status" | "dibuat_pada" | "dibuat_oleh", ExtArgs["result"]["report"]>;
export type ReportInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    photos?: boolean | Prisma.Report$photosArgs<ExtArgs>;
    votes?: boolean | Prisma.Report$votesArgs<ExtArgs>;
    status_history?: boolean | Prisma.Report$status_historyArgs<ExtArgs>;
    _count?: boolean | Prisma.ReportCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ReportIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type ReportIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pelapor?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $ReportPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Report";
    objects: {
        pelapor: Prisma.$ProfilePayload<ExtArgs>;
        photos: Prisma.$ReportPhotoPayload<ExtArgs>[];
        votes: Prisma.$VotePayload<ExtArgs>[];
        status_history: Prisma.$StatusHistoryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        judul: string;
        deskripsi: string;
        kawasan: string;
        jenis_kerusakan: $Enums.JenisKerusakan;
        tingkat_bahaya: $Enums.TingkatBahaya;
        estimasi_terdampak: number;
        jalur_vital: boolean;
        status: $Enums.StatusLaporan;
        dibuat_pada: Date;
        dibuat_oleh: string;
    }, ExtArgs["result"]["report"]>;
    composites: {};
};
export type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReportPayload, S>;
export type ReportCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReportCountAggregateInputType | true;
};
export interface ReportDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Report'];
        meta: {
            name: 'Report';
        };
    };
    findUnique<T extends ReportFindUniqueArgs>(args: Prisma.SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReportFindFirstArgs>(args?: Prisma.SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReportFindManyArgs>(args?: Prisma.SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReportCreateArgs>(args: Prisma.SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReportCreateManyArgs>(args?: Prisma.SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReportDeleteArgs>(args: Prisma.SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReportUpdateArgs>(args: Prisma.SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReportDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReportUpdateManyArgs>(args: Prisma.SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReportUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReportUpsertArgs>(args: Prisma.SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReportCountArgs>(args?: Prisma.Subset<T, ReportCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReportCountAggregateOutputType> : number>;
    aggregate<T extends ReportAggregateArgs>(args: Prisma.Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>;
    groupBy<T extends ReportGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReportGroupByArgs['orderBy'];
    } : {
        orderBy?: ReportGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReportFieldRefs;
}
export interface Prisma__ReportClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pelapor<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    photos<T extends Prisma.Report$photosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Report$photosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    votes<T extends Prisma.Report$votesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Report$votesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    status_history<T extends Prisma.Report$status_historyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Report$status_historyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReportFieldRefs {
    readonly id: Prisma.FieldRef<"Report", 'String'>;
    readonly judul: Prisma.FieldRef<"Report", 'String'>;
    readonly deskripsi: Prisma.FieldRef<"Report", 'String'>;
    readonly kawasan: Prisma.FieldRef<"Report", 'String'>;
    readonly jenis_kerusakan: Prisma.FieldRef<"Report", 'JenisKerusakan'>;
    readonly tingkat_bahaya: Prisma.FieldRef<"Report", 'TingkatBahaya'>;
    readonly estimasi_terdampak: Prisma.FieldRef<"Report", 'Int'>;
    readonly jalur_vital: Prisma.FieldRef<"Report", 'Boolean'>;
    readonly status: Prisma.FieldRef<"Report", 'StatusLaporan'>;
    readonly dibuat_pada: Prisma.FieldRef<"Report", 'DateTime'>;
    readonly dibuat_oleh: Prisma.FieldRef<"Report", 'String'>;
}
export type ReportFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportCreateInput, Prisma.ReportUncheckedCreateInput>;
};
export type ReportCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReportCreateManyInput | Prisma.ReportCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReportCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    data: Prisma.ReportCreateManyInput | Prisma.ReportCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReportIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReportUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportUpdateInput, Prisma.ReportUncheckedUpdateInput>;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyInput>;
    where?: Prisma.ReportWhereInput;
    limit?: number;
};
export type ReportUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyInput>;
    where?: Prisma.ReportWhereInput;
    limit?: number;
    include?: Prisma.ReportIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReportUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateInput, Prisma.ReportUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReportUpdateInput, Prisma.ReportUncheckedUpdateInput>;
};
export type ReportDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    limit?: number;
};
export type Report$photosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    where?: Prisma.ReportPhotoWhereInput;
    orderBy?: Prisma.ReportPhotoOrderByWithRelationInput | Prisma.ReportPhotoOrderByWithRelationInput[];
    cursor?: Prisma.ReportPhotoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportPhotoScalarFieldEnum | Prisma.ReportPhotoScalarFieldEnum[];
};
export type Report$votesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithRelationInput | Prisma.VoteOrderByWithRelationInput[];
    cursor?: Prisma.VoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VoteScalarFieldEnum | Prisma.VoteScalarFieldEnum[];
};
export type Report$status_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusHistoryScalarFieldEnum | Prisma.StatusHistoryScalarFieldEnum[];
};
export type ReportDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
};
