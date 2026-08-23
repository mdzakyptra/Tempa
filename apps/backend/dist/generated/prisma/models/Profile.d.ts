import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$ProfilePayload>;
export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
};
export type ProfileMinAggregateOutputType = {
    id: string | null;
    nama: string | null;
    email: string | null;
    password: string | null;
    peran: $Enums.Peran | null;
    kawasan_tugas: string | null;
};
export type ProfileMaxAggregateOutputType = {
    id: string | null;
    nama: string | null;
    email: string | null;
    password: string | null;
    peran: $Enums.Peran | null;
    kawasan_tugas: string | null;
};
export type ProfileCountAggregateOutputType = {
    id: number;
    nama: number;
    email: number;
    password: number;
    peran: number;
    kawasan_tugas: number;
    _all: number;
};
export type ProfileMinAggregateInputType = {
    id?: true;
    nama?: true;
    email?: true;
    password?: true;
    peran?: true;
    kawasan_tugas?: true;
};
export type ProfileMaxAggregateInputType = {
    id?: true;
    nama?: true;
    email?: true;
    password?: true;
    peran?: true;
    kawasan_tugas?: true;
};
export type ProfileCountAggregateInputType = {
    id?: true;
    nama?: true;
    email?: true;
    password?: true;
    peran?: true;
    kawasan_tugas?: true;
    _all?: true;
};
export type ProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProfileCountAggregateInputType;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
};
export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProfile[P]> : Prisma.GetScalarType<T[P], AggregateProfile[P]>;
};
export type ProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithAggregationInput | Prisma.ProfileOrderByWithAggregationInput[];
    by: Prisma.ProfileScalarFieldEnum[] | Prisma.ProfileScalarFieldEnum;
    having?: Prisma.ProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInputType | true;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
};
export type ProfileGroupByOutputType = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran: $Enums.Peran;
    kawasan_tugas: string | null;
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
};
export type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProfileGroupByOutputType[P]>;
}>>;
export type ProfileWhereInput = {
    AND?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    OR?: Prisma.ProfileWhereInput[];
    NOT?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    id?: Prisma.UuidFilter<"Profile"> | string;
    nama?: Prisma.StringFilter<"Profile"> | string;
    email?: Prisma.StringFilter<"Profile"> | string;
    password?: Prisma.StringFilter<"Profile"> | string;
    peran?: Prisma.EnumPeranFilter<"Profile"> | $Enums.Peran;
    kawasan_tugas?: Prisma.StringNullableFilter<"Profile"> | string | null;
    reports?: Prisma.ReportListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
    status_history?: Prisma.StatusHistoryListRelationFilter;
};
export type ProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nama?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    peran?: Prisma.SortOrder;
    kawasan_tugas?: Prisma.SortOrderInput | Prisma.SortOrder;
    reports?: Prisma.ReportOrderByRelationAggregateInput;
    votes?: Prisma.VoteOrderByRelationAggregateInput;
    status_history?: Prisma.StatusHistoryOrderByRelationAggregateInput;
};
export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    OR?: Prisma.ProfileWhereInput[];
    NOT?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    nama?: Prisma.StringFilter<"Profile"> | string;
    password?: Prisma.StringFilter<"Profile"> | string;
    peran?: Prisma.EnumPeranFilter<"Profile"> | $Enums.Peran;
    kawasan_tugas?: Prisma.StringNullableFilter<"Profile"> | string | null;
    reports?: Prisma.ReportListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
    status_history?: Prisma.StatusHistoryListRelationFilter;
}, "id" | "email">;
export type ProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nama?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    peran?: Prisma.SortOrder;
    kawasan_tugas?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ProfileCountOrderByAggregateInput;
    _max?: Prisma.ProfileMaxOrderByAggregateInput;
    _min?: Prisma.ProfileMinOrderByAggregateInput;
};
export type ProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProfileScalarWhereWithAggregatesInput | Prisma.ProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProfileScalarWhereWithAggregatesInput | Prisma.ProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Profile"> | string;
    nama?: Prisma.StringWithAggregatesFilter<"Profile"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Profile"> | string;
    password?: Prisma.StringWithAggregatesFilter<"Profile"> | string;
    peran?: Prisma.EnumPeranWithAggregatesFilter<"Profile"> | $Enums.Peran;
    kawasan_tugas?: Prisma.StringNullableWithAggregatesFilter<"Profile"> | string | null;
};
export type ProfileCreateInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportCreateNestedManyWithoutPelaporInput;
    votes?: Prisma.VoteCreateNestedManyWithoutPendukungInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutPetugasInput;
};
export type ProfileUncheckedCreateInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportUncheckedCreateNestedManyWithoutPelaporInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutPendukungInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutPetugasInput;
};
export type ProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUpdateManyWithoutPelaporNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutPendukungNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutPetugasNestedInput;
};
export type ProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUncheckedUpdateManyWithoutPelaporNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutPendukungNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutPetugasNestedInput;
};
export type ProfileCreateManyInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
};
export type ProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nama?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    peran?: Prisma.SortOrder;
    kawasan_tugas?: Prisma.SortOrder;
};
export type ProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nama?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    peran?: Prisma.SortOrder;
    kawasan_tugas?: Prisma.SortOrder;
};
export type ProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nama?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    peran?: Prisma.SortOrder;
    kawasan_tugas?: Prisma.SortOrder;
};
export type ProfileScalarRelationFilter = {
    is?: Prisma.ProfileWhereInput;
    isNot?: Prisma.ProfileWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumPeranFieldUpdateOperationsInput = {
    set?: $Enums.Peran;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type ProfileCreateNestedOneWithoutReportsInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutReportsInput, Prisma.ProfileUncheckedCreateWithoutReportsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutReportsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutReportsNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutReportsInput, Prisma.ProfileUncheckedCreateWithoutReportsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutReportsInput;
    upsert?: Prisma.ProfileUpsertWithoutReportsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutReportsInput, Prisma.ProfileUpdateWithoutReportsInput>, Prisma.ProfileUncheckedUpdateWithoutReportsInput>;
};
export type ProfileCreateNestedOneWithoutVotesInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutVotesInput, Prisma.ProfileUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutVotesInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutVotesNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutVotesInput, Prisma.ProfileUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutVotesInput;
    upsert?: Prisma.ProfileUpsertWithoutVotesInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutVotesInput, Prisma.ProfileUpdateWithoutVotesInput>, Prisma.ProfileUncheckedUpdateWithoutVotesInput>;
};
export type ProfileCreateNestedOneWithoutStatus_historyInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutStatus_historyInput, Prisma.ProfileUncheckedCreateWithoutStatus_historyInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutStatus_historyInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutStatus_historyNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutStatus_historyInput, Prisma.ProfileUncheckedCreateWithoutStatus_historyInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutStatus_historyInput;
    upsert?: Prisma.ProfileUpsertWithoutStatus_historyInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutStatus_historyInput, Prisma.ProfileUpdateWithoutStatus_historyInput>, Prisma.ProfileUncheckedUpdateWithoutStatus_historyInput>;
};
export type ProfileCreateWithoutReportsInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    votes?: Prisma.VoteCreateNestedManyWithoutPendukungInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutPetugasInput;
};
export type ProfileUncheckedCreateWithoutReportsInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutPendukungInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutPetugasInput;
};
export type ProfileCreateOrConnectWithoutReportsInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutReportsInput, Prisma.ProfileUncheckedCreateWithoutReportsInput>;
};
export type ProfileUpsertWithoutReportsInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutReportsInput, Prisma.ProfileUncheckedUpdateWithoutReportsInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutReportsInput, Prisma.ProfileUncheckedCreateWithoutReportsInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutReportsInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutReportsInput, Prisma.ProfileUncheckedUpdateWithoutReportsInput>;
};
export type ProfileUpdateWithoutReportsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    votes?: Prisma.VoteUpdateManyWithoutPendukungNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutPetugasNestedInput;
};
export type ProfileUncheckedUpdateWithoutReportsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutPendukungNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutPetugasNestedInput;
};
export type ProfileCreateWithoutVotesInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportCreateNestedManyWithoutPelaporInput;
    status_history?: Prisma.StatusHistoryCreateNestedManyWithoutPetugasInput;
};
export type ProfileUncheckedCreateWithoutVotesInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportUncheckedCreateNestedManyWithoutPelaporInput;
    status_history?: Prisma.StatusHistoryUncheckedCreateNestedManyWithoutPetugasInput;
};
export type ProfileCreateOrConnectWithoutVotesInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutVotesInput, Prisma.ProfileUncheckedCreateWithoutVotesInput>;
};
export type ProfileUpsertWithoutVotesInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutVotesInput, Prisma.ProfileUncheckedUpdateWithoutVotesInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutVotesInput, Prisma.ProfileUncheckedCreateWithoutVotesInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutVotesInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutVotesInput, Prisma.ProfileUncheckedUpdateWithoutVotesInput>;
};
export type ProfileUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUpdateManyWithoutPelaporNestedInput;
    status_history?: Prisma.StatusHistoryUpdateManyWithoutPetugasNestedInput;
};
export type ProfileUncheckedUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUncheckedUpdateManyWithoutPelaporNestedInput;
    status_history?: Prisma.StatusHistoryUncheckedUpdateManyWithoutPetugasNestedInput;
};
export type ProfileCreateWithoutStatus_historyInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportCreateNestedManyWithoutPelaporInput;
    votes?: Prisma.VoteCreateNestedManyWithoutPendukungInput;
};
export type ProfileUncheckedCreateWithoutStatus_historyInput = {
    id: string;
    nama: string;
    email: string;
    password: string;
    peran?: $Enums.Peran;
    kawasan_tugas?: string | null;
    reports?: Prisma.ReportUncheckedCreateNestedManyWithoutPelaporInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutPendukungInput;
};
export type ProfileCreateOrConnectWithoutStatus_historyInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutStatus_historyInput, Prisma.ProfileUncheckedCreateWithoutStatus_historyInput>;
};
export type ProfileUpsertWithoutStatus_historyInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutStatus_historyInput, Prisma.ProfileUncheckedUpdateWithoutStatus_historyInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutStatus_historyInput, Prisma.ProfileUncheckedCreateWithoutStatus_historyInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutStatus_historyInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutStatus_historyInput, Prisma.ProfileUncheckedUpdateWithoutStatus_historyInput>;
};
export type ProfileUpdateWithoutStatus_historyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUpdateManyWithoutPelaporNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutPendukungNestedInput;
};
export type ProfileUncheckedUpdateWithoutStatus_historyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nama?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    peran?: Prisma.EnumPeranFieldUpdateOperationsInput | $Enums.Peran;
    kawasan_tugas?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reports?: Prisma.ReportUncheckedUpdateManyWithoutPelaporNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutPendukungNestedInput;
};
export type ProfileCountOutputType = {
    reports: number;
    votes: number;
    status_history: number;
};
export type ProfileCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    reports?: boolean | ProfileCountOutputTypeCountReportsArgs;
    votes?: boolean | ProfileCountOutputTypeCountVotesArgs;
    status_history?: boolean | ProfileCountOutputTypeCountStatus_historyArgs;
};
export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileCountOutputTypeSelect<ExtArgs> | null;
};
export type ProfileCountOutputTypeCountReportsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
};
export type ProfileCountOutputTypeCountVotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
};
export type ProfileCountOutputTypeCountStatus_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
};
export type ProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nama?: boolean;
    email?: boolean;
    password?: boolean;
    peran?: boolean;
    kawasan_tugas?: boolean;
    reports?: boolean | Prisma.Profile$reportsArgs<ExtArgs>;
    votes?: boolean | Prisma.Profile$votesArgs<ExtArgs>;
    status_history?: boolean | Prisma.Profile$status_historyArgs<ExtArgs>;
    _count?: boolean | Prisma.ProfileCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nama?: boolean;
    email?: boolean;
    password?: boolean;
    peran?: boolean;
    kawasan_tugas?: boolean;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nama?: boolean;
    email?: boolean;
    password?: boolean;
    peran?: boolean;
    kawasan_tugas?: boolean;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectScalar = {
    id?: boolean;
    nama?: boolean;
    email?: boolean;
    password?: boolean;
    peran?: boolean;
    kawasan_tugas?: boolean;
};
export type ProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nama" | "email" | "password" | "peran" | "kawasan_tugas", ExtArgs["result"]["profile"]>;
export type ProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    reports?: boolean | Prisma.Profile$reportsArgs<ExtArgs>;
    votes?: boolean | Prisma.Profile$votesArgs<ExtArgs>;
    status_history?: boolean | Prisma.Profile$status_historyArgs<ExtArgs>;
    _count?: boolean | Prisma.ProfileCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Profile";
    objects: {
        reports: Prisma.$ReportPayload<ExtArgs>[];
        votes: Prisma.$VotePayload<ExtArgs>[];
        status_history: Prisma.$StatusHistoryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        nama: string;
        email: string;
        password: string;
        peran: $Enums.Peran;
        kawasan_tugas: string | null;
    }, ExtArgs["result"]["profile"]>;
    composites: {};
};
export type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProfilePayload, S>;
export type ProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProfileCountAggregateInputType | true;
};
export interface ProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Profile'];
        meta: {
            name: 'Profile';
        };
    };
    findUnique<T extends ProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProfileFindManyArgs>(args?: Prisma.SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProfileCreateArgs>(args: Prisma.SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProfileDeleteArgs>(args: Prisma.SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProfileUpdateArgs>(args: Prisma.SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProfileUpsertArgs>(args: Prisma.SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProfileCountArgs>(args?: Prisma.Subset<T, ProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProfileCountAggregateOutputType> : number>;
    aggregate<T extends ProfileAggregateArgs>(args: Prisma.Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>;
    groupBy<T extends ProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: ProfileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProfileFieldRefs;
}
export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    reports<T extends Prisma.Profile$reportsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    votes<T extends Prisma.Profile$votesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$votesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    status_history<T extends Prisma.Profile$status_historyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$status_historyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProfileFieldRefs {
    readonly id: Prisma.FieldRef<"Profile", 'String'>;
    readonly nama: Prisma.FieldRef<"Profile", 'String'>;
    readonly email: Prisma.FieldRef<"Profile", 'String'>;
    readonly password: Prisma.FieldRef<"Profile", 'String'>;
    readonly peran: Prisma.FieldRef<"Profile", 'Peran'>;
    readonly kawasan_tugas: Prisma.FieldRef<"Profile", 'String'>;
}
export type ProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileCreateInput, Prisma.ProfileUncheckedCreateInput>;
};
export type ProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProfileCreateManyInput | Prisma.ProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    data: Prisma.ProfileCreateManyInput | Prisma.ProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileUpdateInput, Prisma.ProfileUncheckedUpdateInput>;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProfileUpdateManyMutationInput, Prisma.ProfileUncheckedUpdateManyInput>;
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type ProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileUpdateManyMutationInput, Prisma.ProfileUncheckedUpdateManyInput>;
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type ProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateInput, Prisma.ProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProfileUpdateInput, Prisma.ProfileUncheckedUpdateInput>;
};
export type ProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type Profile$reportsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Profile$votesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Profile$status_historyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
};
