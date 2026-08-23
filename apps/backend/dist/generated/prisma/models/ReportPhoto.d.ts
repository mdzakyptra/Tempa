import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReportPhotoModel = runtime.Types.Result.DefaultSelection<Prisma.$ReportPhotoPayload>;
export type AggregateReportPhoto = {
    _count: ReportPhotoCountAggregateOutputType | null;
    _min: ReportPhotoMinAggregateOutputType | null;
    _max: ReportPhotoMaxAggregateOutputType | null;
};
export type ReportPhotoMinAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    url_foto: string | null;
};
export type ReportPhotoMaxAggregateOutputType = {
    id: string | null;
    report_id: string | null;
    url_foto: string | null;
};
export type ReportPhotoCountAggregateOutputType = {
    id: number;
    report_id: number;
    url_foto: number;
    _all: number;
};
export type ReportPhotoMinAggregateInputType = {
    id?: true;
    report_id?: true;
    url_foto?: true;
};
export type ReportPhotoMaxAggregateInputType = {
    id?: true;
    report_id?: true;
    url_foto?: true;
};
export type ReportPhotoCountAggregateInputType = {
    id?: true;
    report_id?: true;
    url_foto?: true;
    _all?: true;
};
export type ReportPhotoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportPhotoWhereInput;
    orderBy?: Prisma.ReportPhotoOrderByWithRelationInput | Prisma.ReportPhotoOrderByWithRelationInput[];
    cursor?: Prisma.ReportPhotoWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReportPhotoCountAggregateInputType;
    _min?: ReportPhotoMinAggregateInputType;
    _max?: ReportPhotoMaxAggregateInputType;
};
export type GetReportPhotoAggregateType<T extends ReportPhotoAggregateArgs> = {
    [P in keyof T & keyof AggregateReportPhoto]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReportPhoto[P]> : Prisma.GetScalarType<T[P], AggregateReportPhoto[P]>;
};
export type ReportPhotoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportPhotoWhereInput;
    orderBy?: Prisma.ReportPhotoOrderByWithAggregationInput | Prisma.ReportPhotoOrderByWithAggregationInput[];
    by: Prisma.ReportPhotoScalarFieldEnum[] | Prisma.ReportPhotoScalarFieldEnum;
    having?: Prisma.ReportPhotoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReportPhotoCountAggregateInputType | true;
    _min?: ReportPhotoMinAggregateInputType;
    _max?: ReportPhotoMaxAggregateInputType;
};
export type ReportPhotoGroupByOutputType = {
    id: string;
    report_id: string;
    url_foto: string;
    _count: ReportPhotoCountAggregateOutputType | null;
    _min: ReportPhotoMinAggregateOutputType | null;
    _max: ReportPhotoMaxAggregateOutputType | null;
};
export type GetReportPhotoGroupByPayload<T extends ReportPhotoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReportPhotoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReportPhotoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReportPhotoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReportPhotoGroupByOutputType[P]>;
}>>;
export type ReportPhotoWhereInput = {
    AND?: Prisma.ReportPhotoWhereInput | Prisma.ReportPhotoWhereInput[];
    OR?: Prisma.ReportPhotoWhereInput[];
    NOT?: Prisma.ReportPhotoWhereInput | Prisma.ReportPhotoWhereInput[];
    id?: Prisma.UuidFilter<"ReportPhoto"> | string;
    report_id?: Prisma.UuidFilter<"ReportPhoto"> | string;
    url_foto?: Prisma.StringFilter<"ReportPhoto"> | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
};
export type ReportPhotoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    url_foto?: Prisma.SortOrder;
    report?: Prisma.ReportOrderByWithRelationInput;
};
export type ReportPhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReportPhotoWhereInput | Prisma.ReportPhotoWhereInput[];
    OR?: Prisma.ReportPhotoWhereInput[];
    NOT?: Prisma.ReportPhotoWhereInput | Prisma.ReportPhotoWhereInput[];
    report_id?: Prisma.UuidFilter<"ReportPhoto"> | string;
    url_foto?: Prisma.StringFilter<"ReportPhoto"> | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
}, "id">;
export type ReportPhotoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    url_foto?: Prisma.SortOrder;
    _count?: Prisma.ReportPhotoCountOrderByAggregateInput;
    _max?: Prisma.ReportPhotoMaxOrderByAggregateInput;
    _min?: Prisma.ReportPhotoMinOrderByAggregateInput;
};
export type ReportPhotoScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReportPhotoScalarWhereWithAggregatesInput | Prisma.ReportPhotoScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReportPhotoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReportPhotoScalarWhereWithAggregatesInput | Prisma.ReportPhotoScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ReportPhoto"> | string;
    report_id?: Prisma.UuidWithAggregatesFilter<"ReportPhoto"> | string;
    url_foto?: Prisma.StringWithAggregatesFilter<"ReportPhoto"> | string;
};
export type ReportPhotoCreateInput = {
    id?: string;
    url_foto: string;
    report: Prisma.ReportCreateNestedOneWithoutPhotosInput;
};
export type ReportPhotoUncheckedCreateInput = {
    id?: string;
    report_id: string;
    url_foto: string;
};
export type ReportPhotoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutPhotosNestedInput;
};
export type ReportPhotoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoCreateManyInput = {
    id?: string;
    report_id: string;
    url_foto: string;
};
export type ReportPhotoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    report_id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoListRelationFilter = {
    every?: Prisma.ReportPhotoWhereInput;
    some?: Prisma.ReportPhotoWhereInput;
    none?: Prisma.ReportPhotoWhereInput;
};
export type ReportPhotoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReportPhotoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    url_foto?: Prisma.SortOrder;
};
export type ReportPhotoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    url_foto?: Prisma.SortOrder;
};
export type ReportPhotoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    report_id?: Prisma.SortOrder;
    url_foto?: Prisma.SortOrder;
};
export type ReportPhotoCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput> | Prisma.ReportPhotoCreateWithoutReportInput[] | Prisma.ReportPhotoUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ReportPhotoCreateOrConnectWithoutReportInput | Prisma.ReportPhotoCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.ReportPhotoCreateManyReportInputEnvelope;
    connect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
};
export type ReportPhotoUncheckedCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput> | Prisma.ReportPhotoCreateWithoutReportInput[] | Prisma.ReportPhotoUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ReportPhotoCreateOrConnectWithoutReportInput | Prisma.ReportPhotoCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.ReportPhotoCreateManyReportInputEnvelope;
    connect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
};
export type ReportPhotoUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput> | Prisma.ReportPhotoCreateWithoutReportInput[] | Prisma.ReportPhotoUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ReportPhotoCreateOrConnectWithoutReportInput | Prisma.ReportPhotoCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.ReportPhotoUpsertWithWhereUniqueWithoutReportInput | Prisma.ReportPhotoUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.ReportPhotoCreateManyReportInputEnvelope;
    set?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    disconnect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    delete?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    connect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    update?: Prisma.ReportPhotoUpdateWithWhereUniqueWithoutReportInput | Prisma.ReportPhotoUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.ReportPhotoUpdateManyWithWhereWithoutReportInput | Prisma.ReportPhotoUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.ReportPhotoScalarWhereInput | Prisma.ReportPhotoScalarWhereInput[];
};
export type ReportPhotoUncheckedUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput> | Prisma.ReportPhotoCreateWithoutReportInput[] | Prisma.ReportPhotoUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ReportPhotoCreateOrConnectWithoutReportInput | Prisma.ReportPhotoCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.ReportPhotoUpsertWithWhereUniqueWithoutReportInput | Prisma.ReportPhotoUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.ReportPhotoCreateManyReportInputEnvelope;
    set?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    disconnect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    delete?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    connect?: Prisma.ReportPhotoWhereUniqueInput | Prisma.ReportPhotoWhereUniqueInput[];
    update?: Prisma.ReportPhotoUpdateWithWhereUniqueWithoutReportInput | Prisma.ReportPhotoUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.ReportPhotoUpdateManyWithWhereWithoutReportInput | Prisma.ReportPhotoUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.ReportPhotoScalarWhereInput | Prisma.ReportPhotoScalarWhereInput[];
};
export type ReportPhotoCreateWithoutReportInput = {
    id?: string;
    url_foto: string;
};
export type ReportPhotoUncheckedCreateWithoutReportInput = {
    id?: string;
    url_foto: string;
};
export type ReportPhotoCreateOrConnectWithoutReportInput = {
    where: Prisma.ReportPhotoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput>;
};
export type ReportPhotoCreateManyReportInputEnvelope = {
    data: Prisma.ReportPhotoCreateManyReportInput | Prisma.ReportPhotoCreateManyReportInput[];
    skipDuplicates?: boolean;
};
export type ReportPhotoUpsertWithWhereUniqueWithoutReportInput = {
    where: Prisma.ReportPhotoWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReportPhotoUpdateWithoutReportInput, Prisma.ReportPhotoUncheckedUpdateWithoutReportInput>;
    create: Prisma.XOR<Prisma.ReportPhotoCreateWithoutReportInput, Prisma.ReportPhotoUncheckedCreateWithoutReportInput>;
};
export type ReportPhotoUpdateWithWhereUniqueWithoutReportInput = {
    where: Prisma.ReportPhotoWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReportPhotoUpdateWithoutReportInput, Prisma.ReportPhotoUncheckedUpdateWithoutReportInput>;
};
export type ReportPhotoUpdateManyWithWhereWithoutReportInput = {
    where: Prisma.ReportPhotoScalarWhereInput;
    data: Prisma.XOR<Prisma.ReportPhotoUpdateManyMutationInput, Prisma.ReportPhotoUncheckedUpdateManyWithoutReportInput>;
};
export type ReportPhotoScalarWhereInput = {
    AND?: Prisma.ReportPhotoScalarWhereInput | Prisma.ReportPhotoScalarWhereInput[];
    OR?: Prisma.ReportPhotoScalarWhereInput[];
    NOT?: Prisma.ReportPhotoScalarWhereInput | Prisma.ReportPhotoScalarWhereInput[];
    id?: Prisma.UuidFilter<"ReportPhoto"> | string;
    report_id?: Prisma.UuidFilter<"ReportPhoto"> | string;
    url_foto?: Prisma.StringFilter<"ReportPhoto"> | string;
};
export type ReportPhotoCreateManyReportInput = {
    id?: string;
    url_foto: string;
};
export type ReportPhotoUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoUncheckedUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoUncheckedUpdateManyWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url_foto?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ReportPhotoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    url_foto?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reportPhoto"]>;
export type ReportPhotoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    url_foto?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reportPhoto"]>;
export type ReportPhotoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    report_id?: boolean;
    url_foto?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reportPhoto"]>;
export type ReportPhotoSelectScalar = {
    id?: boolean;
    report_id?: boolean;
    url_foto?: boolean;
};
export type ReportPhotoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "report_id" | "url_foto", ExtArgs["result"]["reportPhoto"]>;
export type ReportPhotoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
};
export type ReportPhotoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
};
export type ReportPhotoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
};
export type $ReportPhotoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReportPhoto";
    objects: {
        report: Prisma.$ReportPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        report_id: string;
        url_foto: string;
    }, ExtArgs["result"]["reportPhoto"]>;
    composites: {};
};
export type ReportPhotoGetPayload<S extends boolean | null | undefined | ReportPhotoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload, S>;
export type ReportPhotoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReportPhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReportPhotoCountAggregateInputType | true;
};
export interface ReportPhotoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReportPhoto'];
        meta: {
            name: 'ReportPhoto';
        };
    };
    findUnique<T extends ReportPhotoFindUniqueArgs>(args: Prisma.SelectSubset<T, ReportPhotoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReportPhotoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReportPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReportPhotoFindFirstArgs>(args?: Prisma.SelectSubset<T, ReportPhotoFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReportPhotoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReportPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReportPhotoFindManyArgs>(args?: Prisma.SelectSubset<T, ReportPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReportPhotoCreateArgs>(args: Prisma.SelectSubset<T, ReportPhotoCreateArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReportPhotoCreateManyArgs>(args?: Prisma.SelectSubset<T, ReportPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReportPhotoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReportPhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReportPhotoDeleteArgs>(args: Prisma.SelectSubset<T, ReportPhotoDeleteArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReportPhotoUpdateArgs>(args: Prisma.SelectSubset<T, ReportPhotoUpdateArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReportPhotoDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReportPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReportPhotoUpdateManyArgs>(args: Prisma.SelectSubset<T, ReportPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReportPhotoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReportPhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReportPhotoUpsertArgs>(args: Prisma.SelectSubset<T, ReportPhotoUpsertArgs<ExtArgs>>): Prisma.Prisma__ReportPhotoClient<runtime.Types.Result.GetResult<Prisma.$ReportPhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReportPhotoCountArgs>(args?: Prisma.Subset<T, ReportPhotoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReportPhotoCountAggregateOutputType> : number>;
    aggregate<T extends ReportPhotoAggregateArgs>(args: Prisma.Subset<T, ReportPhotoAggregateArgs>): Prisma.PrismaPromise<GetReportPhotoAggregateType<T>>;
    groupBy<T extends ReportPhotoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReportPhotoGroupByArgs['orderBy'];
    } : {
        orderBy?: ReportPhotoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReportPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReportPhotoFieldRefs;
}
export interface Prisma__ReportPhotoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    report<T extends Prisma.ReportDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReportDefaultArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReportPhotoFieldRefs {
    readonly id: Prisma.FieldRef<"ReportPhoto", 'String'>;
    readonly report_id: Prisma.FieldRef<"ReportPhoto", 'String'>;
    readonly url_foto: Prisma.FieldRef<"ReportPhoto", 'String'>;
}
export type ReportPhotoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    where: Prisma.ReportPhotoWhereUniqueInput;
};
export type ReportPhotoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    where: Prisma.ReportPhotoWhereUniqueInput;
};
export type ReportPhotoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReportPhotoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReportPhotoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReportPhotoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportPhotoCreateInput, Prisma.ReportPhotoUncheckedCreateInput>;
};
export type ReportPhotoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReportPhotoCreateManyInput | Prisma.ReportPhotoCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReportPhotoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    data: Prisma.ReportPhotoCreateManyInput | Prisma.ReportPhotoCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReportPhotoIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReportPhotoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportPhotoUpdateInput, Prisma.ReportPhotoUncheckedUpdateInput>;
    where: Prisma.ReportPhotoWhereUniqueInput;
};
export type ReportPhotoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReportPhotoUpdateManyMutationInput, Prisma.ReportPhotoUncheckedUpdateManyInput>;
    where?: Prisma.ReportPhotoWhereInput;
    limit?: number;
};
export type ReportPhotoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportPhotoUpdateManyMutationInput, Prisma.ReportPhotoUncheckedUpdateManyInput>;
    where?: Prisma.ReportPhotoWhereInput;
    limit?: number;
    include?: Prisma.ReportPhotoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReportPhotoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    where: Prisma.ReportPhotoWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportPhotoCreateInput, Prisma.ReportPhotoUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReportPhotoUpdateInput, Prisma.ReportPhotoUncheckedUpdateInput>;
};
export type ReportPhotoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
    where: Prisma.ReportPhotoWhereUniqueInput;
};
export type ReportPhotoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportPhotoWhereInput;
    limit?: number;
};
export type ReportPhotoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportPhotoSelect<ExtArgs> | null;
    omit?: Prisma.ReportPhotoOmit<ExtArgs> | null;
    include?: Prisma.ReportPhotoInclude<ExtArgs> | null;
};
