import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StatusHistoryModel = runtime.Types.Result.DefaultSelection<Prisma.$StatusHistoryPayload>;
export type AggregateStatusHistory = {
    _count: StatusHistoryCountAggregateOutputType | null;
    _min: StatusHistoryMinAggregateOutputType | null;
    _max: StatusHistoryMaxAggregateOutputType | null;
};
export type StatusHistoryMinAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    status_lama: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan | null;
    catatan: string | null;
    diubah_oleh: string | null;
    diubah_pada: Date | null;
};
export type StatusHistoryMaxAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    status_lama: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan | null;
    catatan: string | null;
    diubah_oleh: string | null;
    diubah_pada: Date | null;
};
export type StatusHistoryCountAggregateOutputType = {
    id: number;
    report_id: number;
    status_lama: number;
    status_baru: number;
    catatan: number;
    diubah_oleh: number;
    diubah_pada: number;
    _all: number;
};
export type StatusHistoryMinAggregateInputType = {
    id?: true;
    report_id?: true;
    status_lama?: true;
    status_baru?: true;
    catatan?: true;
    diubah_oleh?: true;
    diubah_pada?: true;
};
export type StatusHistoryMaxAggregateInputType = {
    id?: true;
    report_id?: true;
    status_lama?: true;
    status_baru?: true;
    catatan?: true;
    diubah_oleh?: true;
    diubah_pada?: true;
};
export type StatusHistoryCountAggregateInputType = {
    id?: true;
    report_id?: true;
    status_lama?: true;
    status_baru?: true;
    catatan?: true;
    diubah_oleh?: true;
    diubah_pada?: true;
    _all?: true;
};
export type StatusHistoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StatusHistoryCountAggregateInputType;
    _min?: StatusHistoryMinAggregateInputType;
    _max?: StatusHistoryMaxAggregateInputType;
};
export type GetStatusHistoryAggregateType<T extends StatusHistoryAggregateArgs> = {
    [P in keyof T & keyof AggregateStatusHistory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStatusHistory[P]> : Prisma.GetScalarType<T[P], AggregateStatusHistory[P]>;
};
export type StatusHistoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithAggregationInput | Prisma.StatusHistoryOrderByWithAggregationInput[];
    by: Prisma.StatusHistoryScalarFieldEnum[] | Prisma.StatusHistoryScalarFieldEnum;
    having?: Prisma.StatusHistoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StatusHistoryCountAggregateInputType | true;
    _min?: StatusHistoryMinAggregateInputType;
    _max?: StatusHistoryMaxAggregateInputType;
};
export type StatusHistoryGroupByOutputType = {
    id: string;
    report_id: string;
    status_lama: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan: string | null;
    diubah_oleh: string;
    diubah_pada: Date;
    _count: StatusHistoryCountAggregateOutputType | null;
    _min: StatusHistoryMinAggregateOutputType | null;
    _max: StatusHistoryMaxAggregateOutputType | null;
};
export type GetStatusHistoryGroupByPayload<T extends StatusHistoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StatusHistoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StatusHistoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StatusHistoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StatusHistoryGroupByOutputType[P]>;
}>>;
export type StatusHistoryWhereInput = {
    AND?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    OR?: Prisma.StatusHistoryWhereInput[];
    NOT?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    id?: Prisma.UuidFilter<"StatusHistory"> | string;
    report_id?: Prisma.UuidFilter<"StatusHistory"> | string;
    status_lama?: Prisma.EnumStatusLaporanNullableFilter<"StatusHistory"> | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFilter<"StatusHistory"> | $Enums.StatusLaporan;
    catatan?: Prisma.StringNullableFilter<"StatusHistory"> | string | null;
    diubah_oleh?: Prisma.UuidFilter<"StatusHistory"> | string;
    diubah_pada?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    petugas?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type StatusHistoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    status_lama?: Prisma.SortOrderInput | Prisma.SortOrder;
    status_baru?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    diubah_oleh?: Prisma.SortOrder;
    diubah_pada?: Prisma.SortOrder;
    report?: Prisma.ReportOrderByWithRelationInput;
    petugas?: Prisma.ProfileOrderByWithRelationInput;
};
export type StatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    OR?: Prisma.StatusHistoryWhereInput[];
    NOT?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    report_id?: Prisma.UuidFilter<"StatusHistory"> | string;
    status_lama?: Prisma.EnumStatusLaporanNullableFilter<"StatusHistory"> | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFilter<"StatusHistory"> | $Enums.StatusLaporan;
    catatan?: Prisma.StringNullableFilter<"StatusHistory"> | string | null;
    diubah_oleh?: Prisma.UuidFilter<"StatusHistory"> | string;
    diubah_pada?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    petugas?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id">;
export type StatusHistoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    status_lama?: Prisma.SortOrderInput | Prisma.SortOrder;
    status_baru?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    diubah_oleh?: Prisma.SortOrder;
    diubah_pada?: Prisma.SortOrder;
    _count?: Prisma.StatusHistoryCountOrderByAggregateInput;
    _max?: Prisma.StatusHistoryMaxOrderByAggregateInput;
    _min?: Prisma.StatusHistoryMinOrderByAggregateInput;
};
export type StatusHistoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.StatusHistoryScalarWhereWithAggregatesInput | Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StatusHistoryScalarWhereWithAggregatesInput | Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"StatusHistory"> | string;
    report_id?: Prisma.UuidWithAggregatesFilter<"StatusHistory"> | string;
    status_lama?: Prisma.EnumStatusLaporanNullableWithAggregatesFilter<"StatusHistory"> | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanWithAggregatesFilter<"StatusHistory"> | $Enums.StatusLaporan;
    catatan?: Prisma.StringNullableWithAggregatesFilter<"StatusHistory"> | string | null;
    diubah_oleh?: Prisma.UuidWithAggregatesFilter<"StatusHistory"> | string;
    diubah_pada?: Prisma.DateTimeWithAggregatesFilter<"StatusHistory"> | Date | string;
};
export type StatusHistoryCreateInput = {
    id?: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_pada?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutStatus_historyInput;
    petugas: Prisma.ProfileCreateNestedOneWithoutStatus_historyInput;
};
export type StatusHistoryUncheckedCreateInput = {
    id?: string;
    report_id: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_oleh: string;
    diubah_pada?: Date | string;
};
export type StatusHistoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutStatus_historyNestedInput;
    petugas?: Prisma.ProfileUpdateOneRequiredWithoutStatus_historyNestedInput;
};
export type StatusHistoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryCreateManyInput = {
    id?: string;
    report_id: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_oleh: string;
    diubah_pada?: Date | string;
};
export type StatusHistoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryListRelationFilter = {
    every?: Prisma.StatusHistoryWhereInput;
    some?: Prisma.StatusHistoryWhereInput;
    none?: Prisma.StatusHistoryWhereInput;
};
export type StatusHistoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StatusHistoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    status_lama?: Prisma.SortOrder;
    status_baru?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    diubah_oleh?: Prisma.SortOrder;
    diubah_pada?: Prisma.SortOrder;
};
export type StatusHistoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    status_lama?: Prisma.SortOrder;
    status_baru?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    diubah_oleh?: Prisma.SortOrder;
    diubah_pada?: Prisma.SortOrder;
};
export type StatusHistoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    status_lama?: Prisma.SortOrder;
    status_baru?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    diubah_oleh?: Prisma.SortOrder;
    diubah_pada?: Prisma.SortOrder;
};
export type StatusHistoryCreateNestedManyWithoutPetugasInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput> | Prisma.StatusHistoryCreateWithoutPetugasInput[] | Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput | Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput[];
    createMany?: Prisma.StatusHistoryCreateManyPetugasInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUncheckedCreateNestedManyWithoutPetugasInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput> | Prisma.StatusHistoryCreateWithoutPetugasInput[] | Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput | Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput[];
    createMany?: Prisma.StatusHistoryCreateManyPetugasInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUpdateManyWithoutPetugasNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput> | Prisma.StatusHistoryCreateWithoutPetugasInput[] | Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput | Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutPetugasInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutPetugasInput[];
    createMany?: Prisma.StatusHistoryCreateManyPetugasInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutPetugasInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutPetugasInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutPetugasInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutPetugasInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryUncheckedUpdateManyWithoutPetugasNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput> | Prisma.StatusHistoryCreateWithoutPetugasInput[] | Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput | Prisma.StatusHistoryCreateOrConnectWithoutPetugasInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutPetugasInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutPetugasInput[];
    createMany?: Prisma.StatusHistoryCreateManyPetugasInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutPetugasInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutPetugasInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutPetugasInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutPetugasInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput> | Prisma.StatusHistoryCreateWithoutReportInput[] | Prisma.StatusHistoryUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutReportInput | Prisma.StatusHistoryCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.StatusHistoryCreateManyReportInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUncheckedCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput> | Prisma.StatusHistoryCreateWithoutReportInput[] | Prisma.StatusHistoryUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutReportInput | Prisma.StatusHistoryCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.StatusHistoryCreateManyReportInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput> | Prisma.StatusHistoryCreateWithoutReportInput[] | Prisma.StatusHistoryUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutReportInput | Prisma.StatusHistoryCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutReportInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.StatusHistoryCreateManyReportInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutReportInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutReportInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryUncheckedUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput> | Prisma.StatusHistoryCreateWithoutReportInput[] | Prisma.StatusHistoryUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutReportInput | Prisma.StatusHistoryCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutReportInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.StatusHistoryCreateManyReportInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutReportInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutReportInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type NullableEnumStatusLaporanFieldUpdateOperationsInput = {
    set?: $Enums.StatusLaporan | null;
};
export type StatusHistoryCreateWithoutPetugasInput = {
    id?: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_pada?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutStatus_historyInput;
};
export type StatusHistoryUncheckedCreateWithoutPetugasInput = {
    id?: string;
    report_id: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_pada?: Date | string;
};
export type StatusHistoryCreateOrConnectWithoutPetugasInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput>;
};
export type StatusHistoryCreateManyPetugasInputEnvelope = {
    data: Prisma.StatusHistoryCreateManyPetugasInput | Prisma.StatusHistoryCreateManyPetugasInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryUpsertWithWhereUniqueWithoutPetugasInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutPetugasInput, Prisma.StatusHistoryUncheckedUpdateWithoutPetugasInput>;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutPetugasInput, Prisma.StatusHistoryUncheckedCreateWithoutPetugasInput>;
};
export type StatusHistoryUpdateWithWhereUniqueWithoutPetugasInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutPetugasInput, Prisma.StatusHistoryUncheckedUpdateWithoutPetugasInput>;
};
export type StatusHistoryUpdateManyWithWhereWithoutPetugasInput = {
    where: Prisma.StatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyWithoutPetugasInput>;
};
export type StatusHistoryScalarWhereInput = {
    AND?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
    OR?: Prisma.StatusHistoryScalarWhereInput[];
    NOT?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
    id?: Prisma.UuidFilter<"StatusHistory"> | string;
    report_id?: Prisma.UuidFilter<"StatusHistory"> | string;
    status_lama?: Prisma.EnumStatusLaporanNullableFilter<"StatusHistory"> | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFilter<"StatusHistory"> | $Enums.StatusLaporan;
    catatan?: Prisma.StringNullableFilter<"StatusHistory"> | string | null;
    diubah_oleh?: Prisma.UuidFilter<"StatusHistory"> | string;
    diubah_pada?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
};
export type StatusHistoryCreateWithoutReportInput = {
    id?: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_pada?: Date | string;
    petugas: Prisma.ProfileCreateNestedOneWithoutStatus_historyInput;
};
export type StatusHistoryUncheckedCreateWithoutReportInput = {
    id?: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_oleh: string;
    diubah_pada?: Date | string;
};
export type StatusHistoryCreateOrConnectWithoutReportInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput>;
};
export type StatusHistoryCreateManyReportInputEnvelope = {
    data: Prisma.StatusHistoryCreateManyReportInput | Prisma.StatusHistoryCreateManyReportInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryUpsertWithWhereUniqueWithoutReportInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutReportInput, Prisma.StatusHistoryUncheckedUpdateWithoutReportInput>;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutReportInput, Prisma.StatusHistoryUncheckedCreateWithoutReportInput>;
};
export type StatusHistoryUpdateWithWhereUniqueWithoutReportInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutReportInput, Prisma.StatusHistoryUncheckedUpdateWithoutReportInput>;
};
export type StatusHistoryUpdateManyWithWhereWithoutReportInput = {
    where: Prisma.StatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyWithoutReportInput>;
};
export type StatusHistoryCreateManyPetugasInput = {
    id?: string;
    report_id: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_pada?: Date | string;
};
export type StatusHistoryUpdateWithoutPetugasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutStatus_historyNestedInput;
};
export type StatusHistoryUncheckedUpdateWithoutPetugasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyWithoutPetugasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryCreateManyReportInput = {
    id?: string;
    status_lama?: $Enums.StatusLaporan | null;
    status_baru: $Enums.StatusLaporan;
    catatan?: string | null;
    diubah_oleh: string;
    diubah_pada?: Date | string;
};
export type StatusHistoryUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    petugas?: Prisma.ProfileUpdateOneRequiredWithoutStatus_historyNestedInput;
};
export type StatusHistoryUncheckedUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status_lama?: Prisma.NullableEnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan | null;
    status_baru?: Prisma.EnumStatusLaporanFieldUpdateOperationsInput | $Enums.StatusLaporan;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diubah_oleh?: Prisma.StringFieldUpdateOperationsInput | string;
    diubah_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    status_lama?: boolean;
    status_baru?: boolean;
    catatan?: boolean;
    diubah_oleh?: boolean;
    diubah_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["statusHistory"]>;
export type StatusHistorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    status_lama?: boolean;
    status_baru?: boolean;
    catatan?: boolean;
    diubah_oleh?: boolean;
    diubah_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["statusHistory"]>;
export type StatusHistorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    status_lama?: boolean;
    status_baru?: boolean;
    catatan?: boolean;
    diubah_oleh?: boolean;
    diubah_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["statusHistory"]>;
export type StatusHistorySelectScalar = {
    id?: boolean;
    report_id?: boolean;
    status_lama?: boolean;
    status_baru?: boolean;
    catatan?: boolean;
    diubah_oleh?: boolean;
    diubah_pada?: boolean;
};
export type StatusHistoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "report_id" | "status_lama" | "status_baru" | "catatan" | "diubah_oleh" | "diubah_pada", ExtArgs["result"]["statusHistory"]>;
export type StatusHistoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type StatusHistoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type StatusHistoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    petugas?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $StatusHistoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StatusHistory";
    objects: {
        report: Prisma.$ReportPayload<ExtArgs>;
        petugas: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        report_id: string;
        status_lama: $Enums.StatusLaporan | null;
        status_baru: $Enums.StatusLaporan;
        catatan: string | null;
        diubah_oleh: string;
        diubah_pada: Date;
    }, ExtArgs["result"]["statusHistory"]>;
    composites: {};
};
export type StatusHistoryGetPayload<S extends boolean | null | undefined | StatusHistoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload, S>;
export type StatusHistoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StatusHistoryCountAggregateInputType | true;
};
export interface StatusHistoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StatusHistory'];
        meta: {
            name: 'StatusHistory';
        };
    };
    findUnique<T extends StatusHistoryFindUniqueArgs>(args: Prisma.SelectSubset<T, StatusHistoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StatusHistoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StatusHistoryFindFirstArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StatusHistoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StatusHistoryFindManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StatusHistoryCreateArgs>(args: Prisma.SelectSubset<T, StatusHistoryCreateArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StatusHistoryCreateManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StatusHistoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StatusHistoryDeleteArgs>(args: Prisma.SelectSubset<T, StatusHistoryDeleteArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StatusHistoryUpdateArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpdateArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StatusHistoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StatusHistoryUpdateManyArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StatusHistoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StatusHistoryUpsertArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpsertArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StatusHistoryCountArgs>(args?: Prisma.Subset<T, StatusHistoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StatusHistoryCountAggregateOutputType> : number>;
    aggregate<T extends StatusHistoryAggregateArgs>(args: Prisma.Subset<T, StatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetStatusHistoryAggregateType<T>>;
    groupBy<T extends StatusHistoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StatusHistoryGroupByArgs['orderBy'];
    } : {
        orderBy?: StatusHistoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StatusHistoryFieldRefs;
}
export interface Prisma__StatusHistoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    report<T extends Prisma.ReportDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReportDefaultArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    petugas<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StatusHistoryFieldRefs {
    readonly id: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly report_id: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly status_lama: Prisma.FieldRef<"StatusHistory", 'StatusLaporan'>;
    readonly status_baru: Prisma.FieldRef<"StatusHistory", 'StatusLaporan'>;
    readonly catatan: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly diubah_oleh: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly diubah_pada: Prisma.FieldRef<"StatusHistory", 'DateTime'>;
}
export type StatusHistoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StatusHistoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StatusHistoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StatusHistoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusHistoryCreateInput, Prisma.StatusHistoryUncheckedCreateInput>;
};
export type StatusHistoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StatusHistoryCreateManyInput | Prisma.StatusHistoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    data: Prisma.StatusHistoryCreateManyInput | Prisma.StatusHistoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StatusHistoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateInput, Prisma.StatusHistoryUncheckedUpdateInput>;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyInput>;
    where?: Prisma.StatusHistoryWhereInput;
    limit?: number;
};
export type StatusHistoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyInput>;
    where?: Prisma.StatusHistoryWhereInput;
    limit?: number;
    include?: Prisma.StatusHistoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StatusHistoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateInput, Prisma.StatusHistoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateInput, Prisma.StatusHistoryUncheckedUpdateInput>;
};
export type StatusHistoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    limit?: number;
};
export type StatusHistoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
};
