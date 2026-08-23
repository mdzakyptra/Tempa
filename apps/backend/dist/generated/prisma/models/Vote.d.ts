import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type VoteModel = runtime.Types.Result.DefaultSelection<Prisma.$VotePayload>;
export type AggregateVote = {
    _count: VoteCountAggregateOutputType | null;
    _min: VoteMinAggregateOutputType | null;
    _max: VoteMaxAggregateOutputType | null;
};
export type VoteMinAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    user_id: string | null;
    dibuat_pada: Date | null;
};
export type VoteMaxAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    user_id: string | null;
    dibuat_pada: Date | null;
};
export type VoteCountAggregateOutputType = {
    id: number;
    report_id: number;
    user_id: number;
    dibuat_pada: number;
    _all: number;
};
export type VoteMinAggregateInputType = {
    id?: true;
    report_id?: true;
    user_id?: true;
    dibuat_pada?: true;
};
export type VoteMaxAggregateInputType = {
    id?: true;
    report_id?: true;
    user_id?: true;
    dibuat_pada?: true;
};
export type VoteCountAggregateInputType = {
    id?: true;
    report_id?: true;
    user_id?: true;
    dibuat_pada?: true;
    _all?: true;
};
export type VoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithRelationInput | Prisma.VoteOrderByWithRelationInput[];
    cursor?: Prisma.VoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VoteCountAggregateInputType;
    _min?: VoteMinAggregateInputType;
    _max?: VoteMaxAggregateInputType;
};
export type GetVoteAggregateType<T extends VoteAggregateArgs> = {
    [P in keyof T & keyof AggregateVote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVote[P]> : Prisma.GetScalarType<T[P], AggregateVote[P]>;
};
export type VoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithAggregationInput | Prisma.VoteOrderByWithAggregationInput[];
    by: Prisma.VoteScalarFieldEnum[] | Prisma.VoteScalarFieldEnum;
    having?: Prisma.VoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VoteCountAggregateInputType | true;
    _min?: VoteMinAggregateInputType;
    _max?: VoteMaxAggregateInputType;
};
export type VoteGroupByOutputType = {
    id: string;
    report_id: string;
    user_id: string;
    dibuat_pada: Date;
    _count: VoteCountAggregateOutputType | null;
    _min: VoteMinAggregateOutputType | null;
    _max: VoteMaxAggregateOutputType | null;
};
export type GetVoteGroupByPayload<T extends VoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VoteGroupByOutputType[P]>;
}>>;
export type VoteWhereInput = {
    AND?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    OR?: Prisma.VoteWhereInput[];
    NOT?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    id?: Prisma.UuidFilter<"Vote"> | string;
    report_id?: Prisma.UuidFilter<"Vote"> | string;
    user_id?: Prisma.UuidFilter<"Vote"> | string;
    dibuat_pada?: Prisma.DateTimeFilter<"Vote"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    pendukung?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type VoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    report?: Prisma.ReportOrderByWithRelationInput;
    pendukung?: Prisma.ProfileOrderByWithRelationInput;
};
export type VoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    report_id_user_id?: Prisma.VoteReport_idUser_idCompoundUniqueInput;
    AND?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    OR?: Prisma.VoteWhereInput[];
    NOT?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    report_id?: Prisma.UuidFilter<"Vote"> | string;
    user_id?: Prisma.UuidFilter<"Vote"> | string;
    dibuat_pada?: Prisma.DateTimeFilter<"Vote"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    pendukung?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id" | "report_id_user_id">;
export type VoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
    _count?: Prisma.VoteCountOrderByAggregateInput;
    _max?: Prisma.VoteMaxOrderByAggregateInput;
    _min?: Prisma.VoteMinOrderByAggregateInput;
};
export type VoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.VoteScalarWhereWithAggregatesInput | Prisma.VoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.VoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VoteScalarWhereWithAggregatesInput | Prisma.VoteScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Vote"> | string;
    report_id?: Prisma.UuidWithAggregatesFilter<"Vote"> | string;
    user_id?: Prisma.UuidWithAggregatesFilter<"Vote"> | string;
    dibuat_pada?: Prisma.DateTimeWithAggregatesFilter<"Vote"> | Date | string;
};
export type VoteCreateInput = {
    id?: string;
    dibuat_pada?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutVotesInput;
    pendukung: Prisma.ProfileCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateInput = {
    id?: string;
    report_id: string;
    user_id: string;
    dibuat_pada?: Date | string;
};
export type VoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutVotesNestedInput;
    pendukung?: Prisma.ProfileUpdateOneRequiredWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteCreateManyInput = {
    id?: string;
    report_id: string;
    user_id: string;
    dibuat_pada?: Date | string;
};
export type VoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteListRelationFilter = {
    every?: Prisma.VoteWhereInput;
    some?: Prisma.VoteWhereInput;
    none?: Prisma.VoteWhereInput;
};
export type VoteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VoteReport_idUser_idCompoundUniqueInput = {
    report_id: string;
    user_id: string;
};
export type VoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
};
export type VoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
};
export type VoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    dibuat_pada?: Prisma.SortOrder;
};
export type VoteCreateNestedManyWithoutPendukungInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput> | Prisma.VoteCreateWithoutPendukungInput[] | Prisma.VoteUncheckedCreateWithoutPendukungInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutPendukungInput | Prisma.VoteCreateOrConnectWithoutPendukungInput[];
    createMany?: Prisma.VoteCreateManyPendukungInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUncheckedCreateNestedManyWithoutPendukungInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput> | Prisma.VoteCreateWithoutPendukungInput[] | Prisma.VoteUncheckedCreateWithoutPendukungInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutPendukungInput | Prisma.VoteCreateOrConnectWithoutPendukungInput[];
    createMany?: Prisma.VoteCreateManyPendukungInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUpdateManyWithoutPendukungNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput> | Prisma.VoteCreateWithoutPendukungInput[] | Prisma.VoteUncheckedCreateWithoutPendukungInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutPendukungInput | Prisma.VoteCreateOrConnectWithoutPendukungInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutPendukungInput | Prisma.VoteUpsertWithWhereUniqueWithoutPendukungInput[];
    createMany?: Prisma.VoteCreateManyPendukungInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutPendukungInput | Prisma.VoteUpdateWithWhereUniqueWithoutPendukungInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutPendukungInput | Prisma.VoteUpdateManyWithWhereWithoutPendukungInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteUncheckedUpdateManyWithoutPendukungNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput> | Prisma.VoteCreateWithoutPendukungInput[] | Prisma.VoteUncheckedCreateWithoutPendukungInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutPendukungInput | Prisma.VoteCreateOrConnectWithoutPendukungInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutPendukungInput | Prisma.VoteUpsertWithWhereUniqueWithoutPendukungInput[];
    createMany?: Prisma.VoteCreateManyPendukungInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutPendukungInput | Prisma.VoteUpdateWithWhereUniqueWithoutPendukungInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutPendukungInput | Prisma.VoteUpdateManyWithWhereWithoutPendukungInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput> | Prisma.VoteCreateWithoutReportInput[] | Prisma.VoteUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutReportInput | Prisma.VoteCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.VoteCreateManyReportInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUncheckedCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput> | Prisma.VoteCreateWithoutReportInput[] | Prisma.VoteUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutReportInput | Prisma.VoteCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.VoteCreateManyReportInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput> | Prisma.VoteCreateWithoutReportInput[] | Prisma.VoteUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutReportInput | Prisma.VoteCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutReportInput | Prisma.VoteUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.VoteCreateManyReportInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutReportInput | Prisma.VoteUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutReportInput | Prisma.VoteUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteUncheckedUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput> | Prisma.VoteCreateWithoutReportInput[] | Prisma.VoteUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutReportInput | Prisma.VoteCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutReportInput | Prisma.VoteUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.VoteCreateManyReportInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutReportInput | Prisma.VoteUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutReportInput | Prisma.VoteUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteCreateWithoutPendukungInput = {
    id?: string;
    dibuat_pada?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateWithoutPendukungInput = {
    id?: string;
    report_id: string;
    dibuat_pada?: Date | string;
};
export type VoteCreateOrConnectWithoutPendukungInput = {
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput>;
};
export type VoteCreateManyPendukungInputEnvelope = {
    data: Prisma.VoteCreateManyPendukungInput | Prisma.VoteCreateManyPendukungInput[];
    skipDuplicates?: boolean;
};
export type VoteUpsertWithWhereUniqueWithoutPendukungInput = {
    where: Prisma.VoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.VoteUpdateWithoutPendukungInput, Prisma.VoteUncheckedUpdateWithoutPendukungInput>;
    create: Prisma.XOR<Prisma.VoteCreateWithoutPendukungInput, Prisma.VoteUncheckedCreateWithoutPendukungInput>;
};
export type VoteUpdateWithWhereUniqueWithoutPendukungInput = {
    where: Prisma.VoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.VoteUpdateWithoutPendukungInput, Prisma.VoteUncheckedUpdateWithoutPendukungInput>;
};
export type VoteUpdateManyWithWhereWithoutPendukungInput = {
    where: Prisma.VoteScalarWhereInput;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyWithoutPendukungInput>;
};
export type VoteScalarWhereInput = {
    AND?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
    OR?: Prisma.VoteScalarWhereInput[];
    NOT?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
    id?: Prisma.UuidFilter<"Vote"> | string;
    report_id?: Prisma.UuidFilter<"Vote"> | string;
    user_id?: Prisma.UuidFilter<"Vote"> | string;
    dibuat_pada?: Prisma.DateTimeFilter<"Vote"> | Date | string;
};
export type VoteCreateWithoutReportInput = {
    id?: string;
    dibuat_pada?: Date | string;
    pendukung: Prisma.ProfileCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateWithoutReportInput = {
    id?: string;
    user_id: string;
    dibuat_pada?: Date | string;
};
export type VoteCreateOrConnectWithoutReportInput = {
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput>;
};
export type VoteCreateManyReportInputEnvelope = {
    data: Prisma.VoteCreateManyReportInput | Prisma.VoteCreateManyReportInput[];
    skipDuplicates?: boolean;
};
export type VoteUpsertWithWhereUniqueWithoutReportInput = {
    where: Prisma.VoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.VoteUpdateWithoutReportInput, Prisma.VoteUncheckedUpdateWithoutReportInput>;
    create: Prisma.XOR<Prisma.VoteCreateWithoutReportInput, Prisma.VoteUncheckedCreateWithoutReportInput>;
};
export type VoteUpdateWithWhereUniqueWithoutReportInput = {
    where: Prisma.VoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.VoteUpdateWithoutReportInput, Prisma.VoteUncheckedUpdateWithoutReportInput>;
};
export type VoteUpdateManyWithWhereWithoutReportInput = {
    where: Prisma.VoteScalarWhereInput;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyWithoutReportInput>;
};
export type VoteCreateManyPendukungInput = {
    id?: string;
    report_id: string;
    dibuat_pada?: Date | string;
};
export type VoteUpdateWithoutPendukungInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateWithoutPendukungInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyWithoutPendukungInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteCreateManyReportInput = {
    id?: string;
    user_id: string;
    dibuat_pada?: Date | string;
};
export type VoteUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pendukung?: Prisma.ProfileUpdateOneRequiredWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dibuat_pada?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    user_id?: boolean;
    dibuat_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    user_id?: boolean;
    dibuat_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    user_id?: boolean;
    dibuat_pada?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectScalar = {
    id?: boolean;
    report_id?: boolean;
    user_id?: boolean;
    dibuat_pada?: boolean;
};
export type VoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "report_id" | "user_id" | "dibuat_pada", ExtArgs["result"]["vote"]>;
export type VoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type VoteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type VoteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    pendukung?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $VotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Vote";
    objects: {
        report: Prisma.$ReportPayload<ExtArgs>;
        pendukung: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        report_id: string;
        user_id: string;
        dibuat_pada: Date;
    }, ExtArgs["result"]["vote"]>;
    composites: {};
};
export type VoteGetPayload<S extends boolean | null | undefined | VoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VotePayload, S>;
export type VoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VoteCountAggregateInputType | true;
};
export interface VoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Vote'];
        meta: {
            name: 'Vote';
        };
    };
    findUnique<T extends VoteFindUniqueArgs>(args: Prisma.SelectSubset<T, VoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VoteFindFirstArgs>(args?: Prisma.SelectSubset<T, VoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VoteFindManyArgs>(args?: Prisma.SelectSubset<T, VoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VoteCreateArgs>(args: Prisma.SelectSubset<T, VoteCreateArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VoteCreateManyArgs>(args?: Prisma.SelectSubset<T, VoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VoteDeleteArgs>(args: Prisma.SelectSubset<T, VoteDeleteArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VoteUpdateArgs>(args: Prisma.SelectSubset<T, VoteUpdateArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, VoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VoteUpdateManyArgs>(args: Prisma.SelectSubset<T, VoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VoteUpsertArgs>(args: Prisma.SelectSubset<T, VoteUpsertArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VoteCountArgs>(args?: Prisma.Subset<T, VoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VoteCountAggregateOutputType> : number>;
    aggregate<T extends VoteAggregateArgs>(args: Prisma.Subset<T, VoteAggregateArgs>): Prisma.PrismaPromise<GetVoteAggregateType<T>>;
    groupBy<T extends VoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VoteGroupByArgs['orderBy'];
    } : {
        orderBy?: VoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VoteFieldRefs;
}
export interface Prisma__VoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    report<T extends Prisma.ReportDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReportDefaultArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    pendukung<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VoteFieldRefs {
    readonly id: Prisma.FieldRef<"Vote", 'String'>;
    readonly report_id: Prisma.FieldRef<"Vote", 'String'>;
    readonly user_id: Prisma.FieldRef<"Vote", 'String'>;
    readonly dibuat_pada: Prisma.FieldRef<"Vote", 'DateTime'>;
}
export type VoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteCreateInput, Prisma.VoteUncheckedCreateInput>;
};
export type VoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VoteCreateManyInput | Prisma.VoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    data: Prisma.VoteCreateManyInput | Prisma.VoteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VoteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteUpdateInput, Prisma.VoteUncheckedUpdateInput>;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyInput>;
    where?: Prisma.VoteWhereInput;
    limit?: number;
};
export type VoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyInput>;
    where?: Prisma.VoteWhereInput;
    limit?: number;
    include?: Prisma.VoteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateInput, Prisma.VoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VoteUpdateInput, Prisma.VoteUncheckedUpdateInput>;
};
export type VoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    limit?: number;
};
export type VoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
};
